import type { DeviceType, RegionKey } from "@/lib/types";

function withParamIfMissing(url: URL, key: string, value: string) {
  if (!url.searchParams.get(key)) {
    url.searchParams.set(key, value);
  }
}

export function buildTrackedCpaUrl(params: {
  baseUrl: string;
  region: RegionKey;
  eventId: string;
  position: number;
  device: DeviceType;
}): string {
  const url = new URL(params.baseUrl);

  withParamIfMissing(url, "utm_source", "wedding_evee");
  withParamIfMissing(url, "utm_medium", "affiliate");
  withParamIfMissing(url, "utm_campaign", "wedding_fair");

  url.searchParams.set("sub1", params.region);
  url.searchParams.set("sub2", params.eventId);
  url.searchParams.set("sub3", String(params.position));
  url.searchParams.set("sub4", params.device);

  return url.toString();
}

