import { DATA_REGION_KEYS, type DataRegionKey, type RegionKey } from "@/lib/types";

export const REGION_LABELS: Record<DataRegionKey, string> = {
  seoul: "서울",
  gyeonggi: "경기",
  incheon: "인천",
  busan: "부산",
  chungcheong: "충청권",
  jeolla: "전라권",
  gangwon: "강원권",
  gyeongsang: "경상권",
  jeju: "제주",
  etc: "기타",
};

export const REGION_LABELS_WITH_ALL: Record<RegionKey, string> = {
  all: "전체",
  ...REGION_LABELS,
};

export const REGION_NAV_ORDER: RegionKey[] = ["all", ...DATA_REGION_KEYS];

export const REGION_FALLBACK_IMAGES: Record<DataRegionKey, string> = {
  seoul: "/images/region-fallback/seoul.svg",
  gyeonggi: "/images/region-fallback/gyeonggi.svg",
  incheon: "/images/region-fallback/incheon.svg",
  busan: "/images/region-fallback/busan.svg",
  chungcheong: "/images/region-fallback/chungcheong.svg",
  jeolla: "/images/region-fallback/jeolla.svg",
  gangwon: "/images/region-fallback/gangwon.svg",
  gyeongsang: "/images/region-fallback/gyeongsang.svg",
  jeju: "/images/region-fallback/jeju.svg",
  etc: "/images/region-fallback/etc.svg",
};

const REGION_ALIAS_TO_KEY: Record<string, DataRegionKey> = {
  서울: "seoul",
  경기: "gyeonggi",
  인천: "incheon",
  부산: "busan",
  충청: "chungcheong",
  충청권: "chungcheong",
  대전: "chungcheong",
  세종: "chungcheong",
  전라: "jeolla",
  전라권: "jeolla",
  광주: "jeolla",
  강원: "gangwon",
  경상: "gyeongsang",
  경상권: "gyeongsang",
  대구: "gyeongsang",
  울산: "gyeongsang",
  제주: "jeju",
  기타: "etc",
};

export function toDataRegionKey(input: string): DataRegionKey | null {
  const normalized = input.trim().toLowerCase();
  if ((DATA_REGION_KEYS as readonly string[]).includes(normalized)) {
    return normalized as DataRegionKey;
  }

  const koreanMatch = Object.entries(REGION_ALIAS_TO_KEY).find(([key]) =>
    input.includes(key),
  );
  return koreanMatch?.[1] ?? null;
}

