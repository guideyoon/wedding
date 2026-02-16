"use client";

import { useMemo } from "react";

import { trackFilterApply } from "@/lib/tracking";
import type { RegionKey, TimeframeFilter } from "@/lib/types";

interface FilterBarProps {
  actionPath: string;
  region: RegionKey;
  query: string;
  timeframe: TimeframeFilter;
  freeInviteOnly: boolean;
  largeOnly: boolean;
}

export function FilterBar({
  actionPath,
  region,
  query,
  timeframe,
  freeInviteOnly,
  largeOnly,
}: FilterBarProps) {
  const currentValues = useMemo(
    () => ({ region, query, timeframe, freeInviteOnly, largeOnly }),
    [region, query, timeframe, freeInviteOnly, largeOnly],
  );

  return (
    <form
      action={actionPath}
      method="get"
      className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-[var(--shadow-soft)]"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const formData = new FormData(form);
        trackFilterApply({
          region: currentValues.region,
          query: String(formData.get("q") ?? ""),
          timeframe: (String(formData.get("timeframe") ?? "all") as TimeframeFilter) ?? "all",
          freeInviteOnly: formData.get("freeInvite") === "on",
          largeOnly: formData.get("largeOnly") === "on",
        });
      }}
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <label className="lg:col-span-2">
          <span className="mb-1 block text-xs font-medium text-[var(--ink-faint)]">검색</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="박람회명/장소 검색"
            className="h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm outline-none ring-[var(--accent)] transition focus:ring-2"
          />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium text-[var(--ink-faint)]">기간</span>
          <select
            name="timeframe"
            defaultValue={timeframe}
            className="h-10 w-full rounded-lg border border-[var(--line)] bg-white px-3 text-sm outline-none ring-[var(--accent)] transition focus:ring-2"
          >
            <option value="all">전체</option>
            <option value="week">이번 주</option>
            <option value="month">이번 달</option>
          </select>
        </label>

        <label className="flex items-end gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2">
          <input type="checkbox" name="freeInvite" defaultChecked={freeInviteOnly} className="h-4 w-4" />
          <span className="text-sm text-[var(--ink-dim)]">무료초대권 포함</span>
        </label>

        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-[var(--line)] bg-white px-3 py-2">
            <input type="checkbox" name="largeOnly" defaultChecked={largeOnly} className="h-4 w-4" />
            <span className="text-sm text-[var(--ink-dim)]">대형 박람회</span>
          </label>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:brightness-95"
          >
            적용
          </button>
        </div>
      </div>
    </form>
  );
}

