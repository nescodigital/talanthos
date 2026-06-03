"use client";

// Client-side helper: sends events to our server endpoint for Meta CAPI

function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

function getFbp(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/_fbp=([^;]+)/);
  return match ? match[1] : undefined;
}

function getFbc(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(/_fbc=([^;]+)/);
  return match ? match[1] : undefined;
}

interface CapiEventPayload {
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

export async function sendCapiEvent(
  eventName: string,
  options?: {
    email?: string;
    phone?: string;
    externalId?: string;
    customData?: Record<string, unknown>;
  }
): Promise<void> {
  const eventId = generateEventId();
  const eventTime = Math.floor(Date.now() / 1000);
  const eventSourceUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const payload: CapiEventPayload = {
    eventName,
    eventId,
    eventTime,
    eventSourceUrl,
    userData: {
      email: options?.email,
      phone: options?.phone,
      fbp: getFbp(),
      fbc: getFbc(),
      externalId: options?.externalId,
    },
    customData: options?.customData,
  };

  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Silently fail — CAPI is best-effort
  }
}

export { generateEventId };
