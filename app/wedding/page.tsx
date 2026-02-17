import type { Metadata } from "next";

import { WeddingPageContent } from "@/components/WeddingPageContent";

export const metadata: Metadata = {
  title: "전국 웨딩박람회 일정",
  description:
    "2026 웨딩박람회 무료초대권, 웨딩페어 무료초대, 결혼박람회 무료 입장 신청 링크를 지역별로 빠르게 확인하세요.",
  keywords: [
    "2026 웨딩박람회 무료초대권",
    "웨딩페어 무료초대",
    "결혼박람회 무료 입장",
    "웨딩박람회 초대장 받는 법",
  ],
};

interface WeddingRootPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WeddingRootPage({ searchParams }: WeddingRootPageProps) {
  return <WeddingPageContent region="all" searchParams={await searchParams} />;
}

