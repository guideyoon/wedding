"use client";

import { trackClickCpa } from "@/lib/tracking";
import type { RegionKey } from "@/lib/types";

interface CpaButtonProps {
  href: string;
  region: RegionKey;
  eventId: string;
  position: number;
}

export function CpaButton({ href, region, eventId, position }: CpaButtonProps) {
  return (
    <a
      href={href}
      className="relative z-20 inline-flex h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:brightness-95"
      onClick={() => trackClickCpa(region, eventId, position)}
    >
      무료초대권 신청하기
    </a>
  );
}

