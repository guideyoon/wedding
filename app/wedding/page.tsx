import type { Metadata } from "next";

import { WeddingPageContent } from "@/components/WeddingPageContent";

export const metadata: Metadata = {
  title: "전국 웨딩박람회 일정",
  description: "지역별 웨딩박람회 일정과 무료초대권 신청 링크를 한눈에 확인하세요.",
};

interface WeddingRootPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function WeddingRootPage({ searchParams }: WeddingRootPageProps) {
  return <WeddingPageContent region="all" searchParams={await searchParams} />;
}

