import { readFile } from "node:fs/promises";
import path from "node:path";

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

export async function readWeddingData(): Promise<WeddingDataset> {
  try {
    const raw = await readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(raw) as WeddingDataset;
  } catch {
    return buildEmptyDataset();
  }
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

