declare global {
  interface Window {
    fbq: (
      command: "track" | "trackCustom" | "init",
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

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
