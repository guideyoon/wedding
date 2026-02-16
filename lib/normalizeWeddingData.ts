import { parseDateRangeText } from "@/lib/date";
import { REGION_FALLBACK_IMAGES, REGION_LABELS } from "@/lib/regions";
import type {
  DataRegionKey,
  WeddingDataset,
  WeddingEvent,
  WeddingRegion,
} from "@/lib/types";
import type { ParsedEventCandidate, ParsedSourceResult } from "@/lib/parseWeddingSource";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function buildEventId(event: ParsedEventCandidate): string {
  const dateToken = event.startDate ? event.startDate.replaceAll("-", "") : "unknown";
  return `${event.region}-${dateToken}-${slugify(event.title)}`;
}

function indexPreviousEvents(dataset: WeddingDataset): Map<string, WeddingEvent> {
  const map = new Map<string, WeddingEvent>();
  for (const region of dataset.regions) {
    for (const event of region.events) {
      map.set(event.id, event);
      map.set(event.detailUrl, event);
    }
  }
  return map;
}

function toWeddingEvent(
  candidate: ParsedEventCandidate,
  previousIndex: Map<string, WeddingEvent>,
  generatedAt: string,
): WeddingEvent {
  const parsedDateRange = parseDateRangeText(candidate.dateRangeText);
  const startDate = candidate.startDate || parsedDateRange?.startDate || "";
  const endDate = candidate.endDate || parsedDateRange?.endDate || startDate;
  const candidateId = buildEventId({
    ...candidate,
    startDate,
    endDate,
  });
  const previous = previousIndex.get(candidateId) ?? previousIndex.get(candidate.detailUrl);

  return {
    id: candidateId,
    region: candidate.region,
    title: candidate.title,
    dateRangeText: candidate.dateRangeText || previous?.dateRangeText || "일정 확인 필요",
    startDate: startDate || previous?.startDate || "",
    endDate: endDate || previous?.endDate || "",
    venueText: candidate.venueText || previous?.venueText || "장소 정보 확인 필요",
    detailUrl: candidate.detailUrl || previous?.detailUrl || "",
    cpaUrl: previous?.cpaUrl || "",
    heroImageUrl: candidate.heroImageUrl || previous?.heroImageUrl || "",
    badges: candidate.badges.length ? candidate.badges : (previous?.badges ?? []),
    updatedAt: generatedAt,
  };
}

function sortEvents(events: WeddingEvent[]): WeddingEvent[] {
  return [...events].sort((a, b) => {
    if (a.startDate && b.startDate && a.startDate !== b.startDate) {
      return a.startDate.localeCompare(b.startDate);
    }
    if (a.startDate && !b.startDate) {
      return -1;
    }
    if (!a.startDate && b.startDate) {
      return 1;
    }
    return a.title.localeCompare(b.title, "ko");
  });
}

export function normalizeWeddingData(
  previousDataset: WeddingDataset,
  parsedResult: ParsedSourceResult,
): WeddingDataset {
  const previousIndex = indexPreviousEvents(previousDataset);
  const byRegion: Record<DataRegionKey, WeddingEvent[]> = {
    seoul: [],
    gyeonggi: [],
    incheon: [],
    busan: [],
    chungcheong: [],
    jeolla: [],
    gangwon: [],
    gyeongsang: [],
    jeju: [],
    etc: [],
  };

  for (const candidate of parsedResult.events) {
    const normalized = toWeddingEvent(candidate, previousIndex, parsedResult.generatedAt);
    byRegion[normalized.region].push(normalized);
  }

  const regions: WeddingRegion[] = (Object.keys(REGION_LABELS) as DataRegionKey[]).map((key) => {
    const previousRegion = previousDataset.regions.find((region) => region.key === key);
    const events = sortEvents(byRegion[key]);
    const hasEvents = events.length > 0;
    const mergedEvents = hasEvents ? events : (previousRegion?.events ?? []);
    const heroImageUrl =
      parsedResult.regionHeroImages[key] ??
      previousRegion?.heroImageUrl ??
      REGION_FALLBACK_IMAGES[key];

    return {
      key,
      name: REGION_LABELS[key],
      heroImageUrl,
      events: mergedEvents.map((event) => ({
        ...event,
        heroImageUrl: event.heroImageUrl || heroImageUrl,
      })),
    };
  });

  return {
    generatedAt: parsedResult.generatedAt,
    regions,
  };
}

