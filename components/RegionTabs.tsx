import Link from "next/link";

import { REGION_LABELS_WITH_ALL, REGION_NAV_ORDER } from "@/lib/regions";
import type { RegionKey } from "@/lib/types";

interface RegionTabsProps {
  activeRegion: RegionKey;
}

function toRegionHref(region: RegionKey): string {
  return region === "all" ? "/wedding" : `/wedding/${region}`;
}

export function RegionTabs({ activeRegion }: RegionTabsProps) {
  return (
    <aside className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-[var(--shadow-soft)]">
      <h2 className="mb-2 text-sm font-semibold text-[var(--ink-strong)]">지역 선택</h2>
      <ul className="space-y-1">
        {REGION_NAV_ORDER.map((region) => {
          const active = region === activeRegion;
          return (
            <li key={region}>
              <Link
                href={toRegionHref(region)}
                className={`block rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "bg-[var(--accent)] font-semibold text-white"
                    : "text-[var(--ink-dim)] hover:bg-[var(--soft-accent)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {REGION_LABELS_WITH_ALL[region]}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

