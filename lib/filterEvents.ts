import { isDateInCurrentMonth, isDateInCurrentWeek, isIsoDate } from "@/lib/date";
import type { EventFilters, WeddingEvent } from "@/lib/types";

const FREE_INVITE_REGEX = /(무료\s*초대|무료초대권|초대권|무료입장)/i;
const LARGE_EVENT_REGEX = /(대형|초대형|웨딩박람회|웨딩페어|웨딩페스타)/i;

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matchesQuery(event: WeddingEvent, query: string): boolean {
  if (!query) {
    return true;
  }
  const normalizedQuery = normalize(query);
  const haystack = `${event.title} ${event.venueText}`.toLowerCase();
  return haystack.includes(normalizedQuery);
}

function matchesTimeframe(event: WeddingEvent, filters: EventFilters, now: Date): boolean {
  if (filters.timeframe === "all") {
    return true;
  }
  if (filters.timeframe === "week") {
    return isDateInCurrentWeek(event.startDate, now);
  }
  return isDateInCurrentMonth(event.startDate, now);
}

function isFreeInviteEvent(event: WeddingEvent): boolean {
  if (FREE_INVITE_REGEX.test(event.title)) {
    return true;
  }
  return event.badges.some((badge) => FREE_INVITE_REGEX.test(badge));
}

function isLargeEvent(event: WeddingEvent): boolean {
  return LARGE_EVENT_REGEX.test(event.title);
}

function compareByStartDate(a: WeddingEvent, b: WeddingEvent): number {
  const aHasDate = isIsoDate(a.startDate);
  const bHasDate = isIsoDate(b.startDate);

  if (aHasDate && bHasDate) {
    const aTime = new Date(`${a.startDate}T00:00:00`).getTime();
    const bTime = new Date(`${b.startDate}T00:00:00`).getTime();
    if (aTime !== bTime) {
      return aTime - bTime;
    }
  }

  if (aHasDate !== bHasDate) {
    return aHasDate ? -1 : 1;
  }

  return a.title.localeCompare(b.title, "ko");
}

export function filterAndSortEvents(
  events: WeddingEvent[],
  filters: EventFilters,
  now: Date = new Date(),
): WeddingEvent[] {
  return events
    .filter((event) => matchesQuery(event, filters.query))
    .filter((event) => matchesTimeframe(event, filters, now))
    .filter((event) => (filters.freeInviteOnly ? isFreeInviteEvent(event) : true))
    .filter((event) => (filters.largeOnly ? isLargeEvent(event) : true))
    .sort(compareByStartDate);
}

