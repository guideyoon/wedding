import { readWeddingData } from "@/lib/data/readWeddingData";
import { writeWeddingData } from "@/lib/data/writeWeddingData";
import { fetchDetailHtml, fetchWeddingSourceHtml } from "@/lib/fetchWeddingSource";
import { normalizeWeddingData } from "@/lib/normalizeWeddingData";
import {
  parseHeroImageFromDetailHtml,
  parseSourceAdDataFromDetailHtml,
  parseWeddingSource,
} from "@/lib/parseWeddingSource";
import type { WeddingDataset, WeddingEvent } from "@/lib/types";

interface CpaDriftSummary {
  missing: number;
  newWithoutCpa: number;
  sourceAdDataChanged: number;
  changedEvents: Array<{
    eventId: string;
    title: string;
    detailUrl: string;
    previousSourceAdData: string;
    currentSourceAdData: string;
  }>;
}

function flattenEvents(dataset: WeddingDataset): WeddingEvent[] {
  return dataset.regions.flatMap((region) => region.events);
}

function buildCpaDriftSummary(previous: WeddingDataset, next: WeddingDataset): CpaDriftSummary {
  const previousByDetailUrl = new Map(flattenEvents(previous).map((event) => [event.detailUrl, event]));
  const changedEvents: CpaDriftSummary["changedEvents"] = [];
  let missing = 0;
  let newWithoutCpa = 0;

  for (const event of flattenEvents(next)) {
    const hasCpa = Boolean(event.cpaUrl?.trim());
    if (!hasCpa) {
      missing += 1;
      if (!previousByDetailUrl.has(event.detailUrl)) {
        newWithoutCpa += 1;
      }
    }

    const previousEvent = previousByDetailUrl.get(event.detailUrl);
    const previousSourceAdData = previousEvent?.sourceAdData?.trim() ?? "";
    const currentSourceAdData = event.sourceAdData?.trim() ?? "";
    if (previousSourceAdData && currentSourceAdData && previousSourceAdData !== currentSourceAdData) {
      changedEvents.push({
        eventId: event.id,
        title: event.title,
        detailUrl: event.detailUrl,
        previousSourceAdData,
        currentSourceAdData,
      });
    }
  }

  return {
    missing,
    newWithoutCpa,
    sourceAdDataChanged: changedEvents.length,
    changedEvents,
  };
}

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
  cpaDrift: CpaDriftSummary;
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
      cpaDrift: buildCpaDriftSummary(previous, previous),
    };
  }

  const detailTargets = parsed.events.filter((event) => !!event.detailUrl);

  await asyncPool(5, detailTargets, async (event) => {
    const detailHtml = await fetchDetailHtml(event.detailUrl, sourceUrl);
    if (!detailHtml) {
      return;
    }

    const heroImage = !event.heroImageUrl ? parseHeroImageFromDetailHtml(detailHtml, sourceUrl) : "";
    if (heroImage) {
      event.heroImageUrl = heroImage;
    }

    const sourceAdData = parseSourceAdDataFromDetailHtml(detailHtml);
    if (sourceAdData) {
      event.sourceAdData = sourceAdData;
    }

  });

  const normalized = normalizeWeddingData(previous, parsed);
  const cpaDrift = buildCpaDriftSummary(previous, normalized);

  try {
    const storage = await writeWeddingData(normalized);
    return {
      dataset: normalized,
      eventCount: normalized.regions.reduce((sum, region) => sum + region.events.length, 0),
      storage,
      wroteToStorage: true,
      wroteToFile: storage === "file",
      cpaDrift,
    };
  } catch {
    return {
      dataset: normalized,
      eventCount: normalized.regions.reduce((sum, region) => sum + region.events.length, 0),
      storage: "none",
      wroteToStorage: false,
      wroteToFile: false,
      cpaDrift,
    };
  }
}

