export const DATA_REGION_KEYS = [
  "seoul",
  "gyeonggi",
  "incheon",
  "busan",
  "chungcheong",
  "jeolla",
  "gangwon",
  "gyeongsang",
  "jeju",
  "etc",
] as const;

export type DataRegionKey = (typeof DATA_REGION_KEYS)[number];
export type RegionKey = "all" | DataRegionKey;

export type TimeframeFilter = "all" | "week" | "month";

export type DeviceType = "mobile" | "desktop" | "tablet" | "unknown";

export interface WeddingEvent {
  id: string;
  region: DataRegionKey;
  title: string;
  dateRangeText: string;
  startDate: string;
  endDate: string;
  venueText: string;
  detailUrl: string;
  cpaUrl: string;
  heroImageUrl: string;
  badges: string[];
  updatedAt: string;
}

export interface WeddingRegion {
  key: DataRegionKey;
  name: string;
  heroImageUrl: string;
  events: WeddingEvent[];
}

export interface WeddingDataset {
  generatedAt: string;
  regions: WeddingRegion[];
}

export interface EventFilters {
  query: string;
  timeframe: TimeframeFilter;
  freeInviteOnly: boolean;
  largeOnly: boolean;
}

export interface TrackingPayload {
  event: "view_region" | "click_cpa" | "filter_apply";
  region: RegionKey;
  eventId?: string;
  position?: number;
  query?: string;
  timeframe?: TimeframeFilter;
  freeInviteOnly?: boolean;
  largeOnly?: boolean;
  device?: DeviceType;
  at: string;
}

