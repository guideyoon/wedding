import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { WeddingPageContent } from "@/components/WeddingPageContent";
import { DATA_REGION_KEYS, type DataRegionKey } from "@/lib/types";
import { REGION_LABELS } from "@/lib/regions";

interface RegionPageProps {
  params: Promise<{ region: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function isDataRegionKey(value: string): value is DataRegionKey {
  return (DATA_REGION_KEYS as readonly string[]).includes(value);
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region } = await params;
  if (!isDataRegionKey(region)) {
    return {
      title: "지역을 찾을 수 없음",
    };
  }

  const regionLabel = REGION_LABELS[region];
  return {
    title: `2026 ${regionLabel} 웨딩박람회 일정`,
    description: `${regionLabel} 지역 웨딩박람회 일정, 장소, 무료초대권 신청 링크를 확인하세요.`,
  };
}

export default async function RegionPage({ params, searchParams }: RegionPageProps) {
  const { region } = await params;
  if (!isDataRegionKey(region)) {
    notFound();
  }

  return <WeddingPageContent region={region} searchParams={await searchParams} />;
}

