import { EventList } from "@/components/EventList";
import { EventStructuredData } from "@/components/EventStructuredData";
import { FilterBar } from "@/components/FilterBar";
import { HeroSection } from "@/components/HeroSection";
import { RegionTabs } from "@/components/RegionTabs";
import { RegionViewTracker } from "@/components/RegionViewTracker";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import { readWeddingData } from "@/lib/data/readWeddingData";
import { filterAndSortEvents } from "@/lib/filterEvents";
import { REGION_LABELS_WITH_ALL } from "@/lib/regions";
import { toFilters, type WeddingListSearchParams } from "@/lib/searchParams";
import type { RegionKey, WeddingEvent } from "@/lib/types";

interface WeddingPageContentProps {
  region: RegionKey;
  searchParams: Record<string, string | string[] | undefined>;
}

function pickFirstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function toSearchParamsRecord(
  input: Record<string, string | string[] | undefined>,
): WeddingListSearchParams {
  return {
    q: pickFirstValue(input.q),
    timeframe: pickFirstValue(input.timeframe),
    freeInvite: pickFirstValue(input.freeInvite),
    largeOnly: pickFirstValue(input.largeOnly),
  };
}

function flattenEvents(eventsByRegion: WeddingEvent[][]): WeddingEvent[] {
  return eventsByRegion.flat();
}

export async function WeddingPageContent({ region, searchParams }: WeddingPageContentProps) {
  const dataset = await readWeddingData();
  const filters = toFilters(toSearchParamsRecord(searchParams));

  const sourceEvents =
    region === "all"
      ? flattenEvents(dataset.regions.map((regionData) => regionData.events))
      : (dataset.regions.find((regionData) => regionData.key === region)?.events ?? []);

  const filteredEvents = filterAndSortEvents(sourceEvents, filters);
  const defaultSortedEvents = filterAndSortEvents(sourceEvents, {
    query: "",
    timeframe: "all",
    freeInviteOnly: false,
    largeOnly: false,
  });
  const topEvent = filteredEvents[0] ?? defaultSortedEvents[0] ?? null;
  const currentRegionLabel = region === "all" ? "전국" : REGION_LABELS_WITH_ALL[region];
  const actionPath = region === "all" ? "/wedding" : `/wedding/${region}`;

  const missingCpa = pickFirstValue(searchParams.missingCpa);

  return (
    <>
      <RegionViewTracker region={region} />
      <EventStructuredData events={filteredEvents} />

      <main className="mx-auto w-full max-w-[1320px] px-4 pb-24 pt-5 md:px-6 md:pb-10">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <RegionTabs activeRegion={region} />
          </div>

          <div className="space-y-4">
            <HeroSection regionLabel={currentRegionLabel} updatedAt={dataset.generatedAt} topEvent={topEvent} />

            {missingCpa ? (
              <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                선택한 박람회의 신청 링크가 아직 등록되지 않았습니다. 잠시 후 다시 시도해 주세요.
              </section>
            ) : null}

            <FilterBar
              actionPath={actionPath}
              region={region}
              query={filters.query}
              timeframe={filters.timeframe}
              freeInviteOnly={filters.freeInviteOnly}
              largeOnly={filters.largeOnly}
            />

            <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-[var(--shadow-soft)]">
              <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-[var(--line)] pb-3">
                <h2 className="text-lg font-semibold text-[var(--ink-strong)]">{currentRegionLabel}</h2>
                <span className="rounded-full bg-[var(--soft-accent)] px-2 py-1 text-xs font-medium text-[var(--ink-strong)]">
                  {filteredEvents.length}개
                </span>
              </div>
              <EventList events={filteredEvents} regionForTracking={region} />
            </section>
          </div>
        </div>
      </main>

      <StickyCtaBar topEvent={topEvent} regionForTracking={region} />
    </>
  );
}

