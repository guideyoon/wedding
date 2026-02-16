import { NextResponse, type NextRequest } from "next/server";

import type { TrackingPayload } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as TrackingPayload;
    console.info("[tracking]", payload);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

