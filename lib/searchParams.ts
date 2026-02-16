import type { EventFilters, TimeframeFilter } from "@/lib/types";

export interface WeddingListSearchParams {
  q?: string;
  timeframe?: string;
  freeInvite?: string;
  largeOnly?: string;
}

function asBool(input?: string): boolean {
  return input === "1" || input === "true" || input === "on";
}

function asTimeframe(input?: string): TimeframeFilter {
  if (input === "week" || input === "month") {
    return input;
  }
  return "all";
}

export function toFilters(searchParams: WeddingListSearchParams): EventFilters {
  return {
    query: searchParams.q?.trim() ?? "",
    timeframe: asTimeframe(searchParams.timeframe),
    freeInviteOnly: asBool(searchParams.freeInvite),
    largeOnly: asBool(searchParams.largeOnly),
  };
}

