import type { Metadata } from "next";

import { CompatibilityExperience } from "@/components/CompatibilityExperience";

export const metadata: Metadata = {
  title: "궁합보기",
  description: "남자와 여자 응답 차이로 궁합 점수와 해석을 확인해 보세요.",
};

export default function MatchPage() {
  return <CompatibilityExperience />;
}

