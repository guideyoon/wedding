import type { Metadata } from "next";

import { LoveTarotExperience } from "@/components/LoveTarotExperience";

export const metadata: Metadata = {
  title: "연애 타로",
  description: "연애 질문 10개와 3장 타로 리딩으로 현재 감정 흐름과 관계 방향을 확인해 보세요.",
};

export default function TarotPage() {
  return <LoveTarotExperience />;
}
