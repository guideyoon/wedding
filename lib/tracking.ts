import type { DeviceType, RegionKey, TimeframeFilter, TrackingPayload } from "@/lib/types";

function detectDevice(): DeviceType {
  if (typeof navigator === "undefined") {
    return "unknown";
  }
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|android/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

async function sendToServer(payload: TrackingPayload): Promise<void> {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Tracking failures should not affect navigation flow.
  }
}

export function emitTrackingEvent(
  input: Omit<TrackingPayload, "at" | "device"> & { device?: DeviceType },
): void {
  const payload: TrackingPayload = {
    ...input,
    at: new Date().toISOString(),
    device: input.device ?? detectDevice(),
  };

  if (typeof window !== "undefined") {
    const win = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
      fbq?: (...args: unknown[]) => void;
    };

    win.dataLayer = win.dataLayer ?? [];
    win.dataLayer.push(payload);

    if (typeof win.gtag === "function") {
      win.gtag("event", payload.event, payload);
    }
    if (typeof win.fbq === "function") {
      win.fbq("trackCustom", payload.event, payload);
    }
  }

  void sendToServer(payload);
}

export function trackViewRegion(region: RegionKey): void {
  emitTrackingEvent({ event: "view_region", region });
}

export function trackClickCpa(region: RegionKey, eventId: string, position: number): void {
  emitTrackingEvent({ event: "click_cpa", region, eventId, position });
}

export function trackFilterApply(params: {
  region: RegionKey;
  query: string;
  timeframe: TimeframeFilter;
  freeInviteOnly: boolean;
  largeOnly: boolean;
}): void {
  emitTrackingEvent({ event: "filter_apply", ...params });
}

export function trackClickWeddingGuide(
  region: RegionKey,
  source: "tarot_result" | "compatibility_result",
): void {
  emitTrackingEvent({ event: "click_wedding_guide", region, source });
}
