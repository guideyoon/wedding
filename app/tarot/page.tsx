import type { Metadata } from "next";

import { ComingSoonPanel } from "@/components/ComingSoonPanel";

export const metadata: Metadata = {
  title: "연애 타로",
  description: "연애 타로 서비스는 곧 공개됩니다.",
};

export default function TarotPage() {
  return (
    <ComingSoonPanel
      title="연애 타로"
      description="현재 준비 중인 기능입니다. 웨딩 박람회 일정 서비스 안정화 후 순차 공개됩니다."
    />
  );
}

