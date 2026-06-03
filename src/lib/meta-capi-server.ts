import crypto from "crypto";

const META_PIXEL_ID = "2401459223710739";
const META_CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const GRAPH_API_VERSION = "v22.0";

function hashSha256(input: string): string {
  return crypto.createHash("sha256").update(input.trim().toLowerCase()).digest("hex");
}

interface ServerCapiEvent {
  eventName: string;
  eventId: string;
  eventTime: number;
  eventSourceUrl?: string;
  userData?: {
    email?: string;
    phone?: string;
    fbp?: string;
    fbc?: string;
    externalId?: string;
    clientIpAddress?: string;
    clientUserAgent?: string;
  };
  customData?: Record<string, unknown>;
}

export async function sendServerSideCapiEvent(event: ServerCapiEvent): Promise<void> {
  if (!META_CAPI_TOKEN) {
    console.error("[CAPI SERVER] META_CAPI_ACCESS_TOKEN not set");
    return;
  }

  const userDataPayload: Record<string, unknown> = {};

  if (event.userData?.email) {
    userDataPayload.em = hashSha256(event.userData.email);
  }
  if (event.userData?.phone) {
    userDataPayload.ph = hashSha256(event.userData.phone);
  }
  if (event.userData?.fbp) {
    userDataPayload.fbp = event.userData.fbp;
  }
  if (event.userData?.fbc) {
    userDataPayload.fbc = event.userData.fbc;
  }
  if (event.userData?.externalId) {
    userDataPayload.external_id = hashSha256(event.userData.externalId);
  }
  if (event.userData?.clientIpAddress) {
    userDataPayload.client_ip_address = event.userData.clientIpAddress;
  }
  if (event.userData?.clientUserAgent) {
    userDataPayload.client_user_agent = event.userData.clientUserAgent;
  }

  const payload = {
    data: [
      {
        event_name: event.eventName,
        event_id: event.eventId,
        event_time: event.eventTime,
        event_source_url: event.eventSourceUrl || "https://talanthos.com",
        action_source: "website",
        user_data: userDataPayload,
        custom_data: event.customData || {},
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

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("[CAPI SERVER] Meta error:", data);
    } else {
      console.log("[CAPI SERVER] Sent:", event.eventName, "| received:", data.events_received);
    }
  } catch (err) {
    console.error("[CAPI SERVER] Fetch error:", err);
  }
}
