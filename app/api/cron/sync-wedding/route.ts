import { NextResponse, type NextRequest } from "next/server";

import { syncWeddingData } from "@/lib/syncWeddingData";
import type { WeddingDataset } from "@/lib/types";

export const dynamic = "force-dynamic";

function buildCpaCoverage(dataset: WeddingDataset) {
  const missingByRegion = dataset.regions.map((region) => {
    const total = region.events.length;
    const withCpa = region.events.filter((event) => Boolean(event.cpaUrl?.trim())).length;
    return {
      region: region.key,
      total,
      withCpa,
      missing: total - withCpa,
    };
  });

  const totals = missingByRegion.reduce(
    (acc, item) => {
      acc.total += item.total;
      acc.withCpa += item.withCpa;
      acc.missing += item.missing;
      return acc;
    },
    { total: 0, withCpa: 0, missing: 0 },
  );

  return {
    ...totals,
    missingByRegion,
  };
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return process.env.NODE_ENV !== "production";
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
    const cpaCoverage = buildCpaCoverage(result.dataset);

    return NextResponse.json({
      ok: true,
      generatedAt: result.dataset.generatedAt,
      eventCount: result.eventCount,
      storage: result.storage,
      wroteToStorage: result.wroteToStorage,
      wroteToFile: result.wroteToFile,
      cpa: cpaCoverage,
      hasMissingCpa: cpaCoverage.missing > 0,
      cpaDrift: result.cpaDrift,
      hasCpaDrift: result.cpaDrift.sourceAdDataChanged > 0,
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

