import type { Metadata } from "next";

import { WeddingPageContent } from "@/components/WeddingPageContent";
import { getSiteUrl } from "@/lib/site";

const WEDDING_CANONICAL_URL = `${getSiteUrl()}/wedding`;

export const metadata: Metadata = {
  title: "2026 웨딩박람회 일정",
  description: "전국 웨딩박람회 일정과 무료초대권 정보를 지역별로 확인하세요.",
  alternates: {
    canonical: WEDDING_CANONICAL_URL,
  },
  openGraph: {
    title: "2026 웨딩박람회 일정",
    description: "전국 웨딩박람회 일정과 무료초대권 정보를 지역별로 확인하세요.",
    url: WEDDING_CANONICAL_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 웨딩박람회 일정",
    description: "전국 웨딩박람회 일정과 무료초대권 정보를 지역별로 확인하세요.",
  },
};

interface HomePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  return <WeddingPageContent region="all" searchParams={await searchParams} />;
}
