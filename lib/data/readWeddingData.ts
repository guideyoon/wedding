import { readFile } from "node:fs/promises";
import path from "node:path";

import seedWeddingDataset from "@/public/data/wedding.json";
import { getWeddingDataKv, WEDDING_DATA_KV_KEY } from "@/lib/data/getWeddingDataKv";
import { getNowIsoString } from "@/lib/date";
import { REGION_FALLBACK_IMAGES, REGION_LABELS } from "@/lib/regions";
import type { DataRegionKey, WeddingDataset, WeddingRegion } from "@/lib/types";

const DATA_FILE_PATH = path.join(process.cwd(), "public", "data", "wedding.json");

function buildEmptyRegion(key: DataRegionKey): WeddingRegion {
  return {
    key,
    name: REGION_LABELS[key],
    heroImageUrl: REGION_FALLBACK_IMAGES[key],
    events: [],
  };
}

export function buildEmptyDataset(): WeddingDataset {
  return {
    generatedAt: getNowIsoString(),
    regions: (Object.keys(REGION_LABELS) as DataRegionKey[]).map(buildEmptyRegion),
  };
}

function parseDataset(raw: string | null): WeddingDataset | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as WeddingDataset;
    if (!parsed || !Array.isArray(parsed.regions)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function countEvents(dataset: WeddingDataset | null): number {
  if (!dataset) {
    return 0;
  }
  return dataset.regions.reduce((sum, region) => sum + region.events.length, 0);
}

function getGeneratedAtMs(dataset: WeddingDataset | null): number {
  if (!dataset?.generatedAt) {
    return 0;
  }

  const timestamp = Date.parse(dataset.generatedAt);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

const SEEDED_DATASET = seedWeddingDataset as WeddingDataset;
const SEEDED_DATASET_EVENT_COUNT = countEvents(SEEDED_DATASET);

export async function readWeddingData(): Promise<WeddingDataset> {
  let kvDataset: WeddingDataset | null = null;
  const kv = await getWeddingDataKv();
  if (kv) {
    try {
      kvDataset = parseDataset(await kv.get(WEDDING_DATA_KV_KEY));
    } catch {
      // Fall back to file storage when KV reads fail.
    }
  }

  let fileDataset: WeddingDataset | null = null;
  try {
    const raw = await readFile(DATA_FILE_PATH, "utf-8");
    fileDataset = parseDataset(raw);
  } catch {
    // Fall through to empty dataset.
  }

  const candidates: Array<{ dataset: WeddingDataset; eventCount: number; generatedAtMs: number }> = [];

  if (kvDataset) {
    candidates.push({
      dataset: kvDataset,
      eventCount: countEvents(kvDataset),
      generatedAtMs: getGeneratedAtMs(kvDataset),
    });
  }
  if (fileDataset) {
    candidates.push({
      dataset: fileDataset,
      eventCount: countEvents(fileDataset),
      generatedAtMs: getGeneratedAtMs(fileDataset),
    });
  }
  candidates.push({
    dataset: SEEDED_DATASET,
    eventCount: SEEDED_DATASET_EVENT_COUNT,
    generatedAtMs: getGeneratedAtMs(SEEDED_DATASET),
  });

  const withEvents = candidates
    .filter((candidate) => candidate.eventCount > 0)
    .sort((a, b) => b.generatedAtMs - a.generatedAtMs || b.eventCount - a.eventCount);
  if (withEvents.length > 0) {
    return withEvents[0].dataset;
  }

  const newest = [...candidates].sort((a, b) => b.generatedAtMs - a.generatedAtMs)[0];
  if (newest) {
    return newest.dataset;
  }

  return buildEmptyDataset();
}

export async function findWeddingEventById(eventId: string) {
  const dataset = await readWeddingData();
  for (const region of dataset.regions) {
    const found = region.events.find((event) => event.id === eventId);
    if (found) {
      return found;
    }
  }
  return null;
}

