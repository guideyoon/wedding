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

export async function readWeddingData(): Promise<WeddingDataset> {
  const kv = await getWeddingDataKv();
  if (kv) {
    try {
      const kvDataset = parseDataset(await kv.get(WEDDING_DATA_KV_KEY));
      if (kvDataset) {
        return kvDataset;
      }
    } catch {
      // Fall back to file storage when KV reads fail.
    }
  }

  try {
    const raw = await readFile(DATA_FILE_PATH, "utf-8");
    const fileDataset = parseDataset(raw);
    if (fileDataset) {
      return fileDataset;
    }
  } catch {
    // Fall through to empty dataset.
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

