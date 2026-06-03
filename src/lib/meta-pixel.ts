declare global {
  interface Window {
    fbq: (
      command: "track" | "trackCustom" | "init",
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

import { sendCapiEvent } from "./meta-capi";

const META_PIXEL_ID = "2401459223710739";

export function trackMetaPixelEvent(
  event: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

export function trackMetaPixelCustomEvent(
  event: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", event, params);
  }
}

export function initMetaPixel() {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("init", META_PIXEL_ID);
  }
}

export { META_PIXEL_ID };

// Unified tracking: browser + server-side CAPI
export async function trackEvent(
  eventName: string,
  options?: {
    value?: number;
    currency?: string;
    contentIds?: string[];
    contentName?: string;
    contentType?: string;
    email?: string;
    phone?: string;
    externalId?: string;
    customData?: Record<string, unknown>;
  }
) {
  const customData: Record<string, unknown> = { ...options?.customData };

  if (options?.value !== undefined) {
    customData.value = options.value;
  }
  if (options?.currency) {
    customData.currency = options.currency;
  }
  if (options?.contentIds) {
    customData.content_ids = options.contentIds;
  }
  if (options?.contentName) {
    customData.content_name = options.contentName;
  }
  if (options?.contentType) {
    customData.content_type = options.contentType;
  }

  // 1. Browser pixel
  trackMetaPixelEvent(eventName, customData);

  // 2. Server-side CAPI
  await sendCapiEvent(eventName, {
    email: options?.email,
    phone: options?.phone,
    externalId: options?.externalId,
    customData,
  });
}

export { sendCapiEvent };
