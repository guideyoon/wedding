import { readFile } from "node:fs/promises";
import path from "node:path";

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

  const kvCount = countEvents(kvDataset);
  const fileCount = countEvents(fileDataset);

  if (kvDataset && kvCount >= fileCount) {
    return kvDataset;
  }
  if (fileDataset) {
    return fileDataset;
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

