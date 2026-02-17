import { readWeddingData } from "@/lib/data/readWeddingData";
import { writeWeddingData } from "@/lib/data/writeWeddingData";
import { fetchDetailHtml, fetchWeddingSourceHtml } from "@/lib/fetchWeddingSource";
import { normalizeWeddingData } from "@/lib/normalizeWeddingData";
import { parseHeroImageFromDetailHtml, parseWeddingSource } from "@/lib/parseWeddingSource";
import type { WeddingDataset } from "@/lib/types";

async function asyncPool<T, R>(
  concurrency: number,
  items: T[],
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  const queue = [...items];
  const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item) {
        return;
      }
      results.push(await task(item));
    }
  });
  await Promise.all(workers);
  return results;
}

export async function syncWeddingData(): Promise<{
  dataset: WeddingDataset;
  eventCount: number;
  storage: "kv" | "file" | "none";
  wroteToStorage: boolean;
  wroteToFile: boolean;
}> {
  const previous = await readWeddingData();
  const { html, sourceUrl } = await fetchWeddingSourceHtml();
  const parsed = parseWeddingSource(html, sourceUrl);

  // If source parsing fails completely, keep previous snapshot to avoid blank pages.
  if (parsed.events.length === 0) {
    return {
      dataset: previous,
      eventCount: previous.regions.reduce((sum, region) => sum + region.events.length, 0),
      storage: "none",
      wroteToStorage: false,
      wroteToFile: false,
    };
  }

  const missingImageTargets = parsed.events.filter(
    (event) => !event.heroImageUrl && !!event.detailUrl,
  );

  await asyncPool(5, missingImageTargets, async (event) => {
    const detailHtml = await fetchDetailHtml(event.detailUrl, sourceUrl);
    if (!detailHtml) {
      return;
    }
    const heroImage = parseHeroImageFromDetailHtml(detailHtml, sourceUrl);
    if (heroImage) {
      event.heroImageUrl = heroImage;
    }
  });

  const normalized = normalizeWeddingData(previous, parsed);

  try {
    const storage = await writeWeddingData(normalized);
    return {
      dataset: normalized,
      eventCount: normalized.regions.reduce((sum, region) => sum + region.events.length, 0),
      storage,
      wroteToStorage: true,
      wroteToFile: storage === "file",
    };
  } catch {
    return {
      dataset: normalized,
      eventCount: normalized.regions.reduce((sum, region) => sum + region.events.length, 0),
      storage: "none",
      wroteToStorage: false,
      wroteToFile: false,
    };
  }
}

