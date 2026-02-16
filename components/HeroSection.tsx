import type { WeddingEvent } from "@/lib/types";

interface HeroSectionProps {
  regionLabel: string;
  updatedAt: string;
  topEvent: WeddingEvent | null;
}

function formatUpdatedAt(isoText: string): string {
  const date = new Date(isoText);
  if (Number.isNaN(date.getTime())) {
    return "업데이트 날짜 미확인";
  }
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")} 업데이트`;
}

export function HeroSection({ regionLabel, updatedAt, topEvent }: HeroSectionProps) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-medium tracking-wide text-[var(--ink-faint)]">{formatUpdatedAt(updatedAt)}</p>
      <h1 className="mt-2 text-2xl font-semibold leading-tight text-[var(--ink-strong)] md:text-3xl">
        {regionLabel} 웨딩박람회 일정과 무료초대권 정보를 한 번에 확인하세요
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-[var(--ink-dim)]">
        일정은 가까운 날짜 순으로 정렬됩니다. 원하는 지역을 선택하고, 무료초대권 신청 버튼으로 바로 이동하세요.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={topEvent ? `/go/${topEvent.id}?region=${topEvent.region}&position=1` : "#event-list"}
          className="inline-flex items-center rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
        >
          {topEvent ? "무료초대권 바로 신청" : "이벤트 목록 보기"}
        </a>
        {topEvent ? (
          <span className="text-xs text-[var(--ink-faint)]">
            추천: {topEvent.title} ({topEvent.dateRangeText || "일정 확인 필요"})
          </span>
        ) : null}
      </div>
    </section>
  );
}

