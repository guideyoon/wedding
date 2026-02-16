import type { Metadata } from "next";

import { ComingSoonPanel } from "@/components/ComingSoonPanel";

export const metadata: Metadata = {
  title: "궁합 보기",
  description: "궁합 보기 서비스는 곧 공개됩니다.",
};

export default function MatchPage() {
  return (
    <ComingSoonPanel
      title="궁합 보기"
      description="현재 준비 중인 기능입니다. 웨딩 박람회 데이터 품질 안정화 이후 제공됩니다."
    />
  );
}

