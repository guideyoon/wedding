import type { Metadata } from "next";

import { LoveTarotExperience } from "@/components/LoveTarotExperience";
import { getSiteUrl } from "@/lib/site";

const TAROT_PAGE_URL = `${getSiteUrl()}/tarot`;

export const metadata: Metadata = {
  title: "연애타로",
  description: "연애 질문 10개와 3장 타로 리딩으로 현재 감정 흐름과 관계 방향을 확인해 보세요.",
  alternates: {
    canonical: TAROT_PAGE_URL,
  },
  openGraph: {
    title: "연애타로",
    description: "연애 질문 10개와 3장 타로 리딩으로 현재 감정 흐름과 관계 방향을 확인해 보세요.",
    url: TAROT_PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "연애타로",
    description: "연애 질문 10개와 3장 타로 리딩으로 현재 감정 흐름과 관계 방향을 확인해 보세요.",
  },
};

export default function TarotPage() {
  return <LoveTarotExperience />;
}
