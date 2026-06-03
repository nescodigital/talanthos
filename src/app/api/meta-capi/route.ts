import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const META_PIXEL_ID = "2401459223710739";
const META_CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const GRAPH_API_VERSION = "v22.0";

function hashSha256(input: string): string {
  return crypto.createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

interface CapiRequestBody {
  eventName: string;
  eventId: string;
  eventTime: number;
  eventSourceUrl: string;
  userData?: {
    email?: string;
    phone?: string;
    fbp?: string;
    fbc?: string;
    externalId?: string;
  };
  customData?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  if (!META_CAPI_TOKEN) {
    return NextResponse.json(
      { error: "Meta CAPI token not configured" },
      { status: 500 }
    );
  }

  let body: CapiRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    eventName,
    eventId,
    eventTime,
    eventSourceUrl,
    userData,
    customData,
  } = body;

  if (!eventName || !eventId || !eventTime) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Build user_data
  const userDataPayload: Record<string, unknown> = {};

  if (userData?.email) {
    userDataPayload.em = hashSha256(userData.email);
  }
  if (userData?.phone) {
    userDataPayload.ph = hashSha256(userData.phone);
  }
  if (userData?.fbp) {
    userDataPayload.fbp = userData.fbp;
  }
  if (userData?.fbc) {
    userDataPayload.fbc = userData.fbc;
  }
  if (userData?.externalId) {
    userDataPayload.external_id = hashSha256(userData.externalId);
  }

  // IP and User-Agent from request
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || undefined;
  if (ip) {
    userDataPayload.client_ip_address = ip;
  }
  const userAgent = request.headers.get("user-agent");
  if (userAgent) {
    userDataPayload.client_user_agent = userAgent;
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_id: eventId,
        event_time: eventTime,
        event_source_url: eventSourceUrl,
        action_source: "website",
        user_data: userDataPayload,
        custom_data: customData || {},
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Meta CAPI error:", responseData);
      return NextResponse.json(
        { error: "Meta CAPI request failed", details: responseData },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, events_received: responseData.events_received ?? 1 });
  } catch (err) {
    console.error("Meta CAPI fetch error:", err);
    return NextResponse.json(
      { error: "Failed to reach Meta CAPI" },
      { status: 502 }
    );
  }
}
