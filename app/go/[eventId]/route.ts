import { NextResponse, type NextRequest } from "next/server";

import { buildTrackedCpaUrl } from "@/lib/cpa/buildCpaUrl";
import { findWeddingEventById } from "@/lib/data/readWeddingData";
import type { DeviceType, RegionKey } from "@/lib/types";

function detectDeviceFromUserAgent(userAgent: string): DeviceType {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|android/.test(ua)) {
    return "mobile";
  }
  if (ua) {
    return "desktop";
  }
  return "unknown";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;
  const event = await findWeddingEventById(eventId);
  const region = (request.nextUrl.searchParams.get("region") ?? "all") as RegionKey;
  const position = Number(request.nextUrl.searchParams.get("position") ?? "0") || 0;

  if (!event) {
    return NextResponse.redirect(new URL(`/go/unavailable?eventId=${eventId}&region=${region}`, request.url));
  }

  if (!event.cpaUrl) {
    return NextResponse.redirect(new URL(`/go/unavailable?eventId=${eventId}&region=${event.region}`, request.url));
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const device = detectDeviceFromUserAgent(userAgent);

  try {
    const trackedUrl = buildTrackedCpaUrl({
      baseUrl: event.cpaUrl,
      region: event.region,
      eventId,
      position: Math.max(1, position),
      device,
    });
    return NextResponse.redirect(trackedUrl);
  } catch {
    return NextResponse.redirect(new URL(`/go/unavailable?eventId=${eventId}&region=${event.region}`, request.url));
  }
}

