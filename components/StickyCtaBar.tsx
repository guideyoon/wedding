"use client";

import { trackClickCpa } from "@/lib/tracking";
import type { RegionKey, WeddingEvent } from "@/lib/types";

interface StickyCtaBarProps {
  topEvent: WeddingEvent | null;
  regionForTracking: RegionKey;
}

export function StickyCtaBar({ topEvent, regionForTracking }: StickyCtaBarProps) {
  if (!topEvent) {
    return null;
  }

  const href = `/go/${topEvent.id}?region=${topEvent.region}&position=1`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3">
        <p className="line-clamp-1 text-xs text-[var(--ink-dim)]">{topEvent.title}</p>
        <a
          href={href}
          onClick={() => trackClickCpa(regionForTracking, topEvent.id, 1)}
          className="inline-flex h-10 shrink-0 items-center rounded-full bg-[var(--accent)] px-4 text-sm font-semibold text-white"
        >
          무료초대권 받기
        </a>
      </div>
    </div>
  );
}

