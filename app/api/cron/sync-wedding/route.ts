import { NextResponse, type NextRequest } from "next/server";

import { syncWeddingData } from "@/lib/syncWeddingData";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return true;
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const querySecret = request.nextUrl.searchParams.get("secret") ?? "";

  return bearerToken === secret || querySecret === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncWeddingData();
    return NextResponse.json({
      ok: true,
      generatedAt: result.dataset.generatedAt,
      eventCount: result.eventCount,
      wroteToFile: result.wroteToFile,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Sync failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

