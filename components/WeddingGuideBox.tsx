"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { REGION_LABELS_WITH_ALL, REGION_NAV_ORDER } from "@/lib/regions";
import { trackClickWeddingGuide } from "@/lib/tracking";
import type { RegionKey } from "@/lib/types";

interface WeddingGuideBoxProps {
  source: "tarot_result" | "compatibility_result";
}

interface ConversionWindow extends Window {
  gtag_report_conversion?: (url?: string) => boolean;
}

function toWeddingRegionHref(region: RegionKey): string {
  return region === "all" ? "/wedding#region-list-heading" : `/wedding/${region}#region-list-heading`;
}

export function WeddingGuideBox({ source }: WeddingGuideBoxProps) {
  const router = useRouter();
  const [region, setRegion] = useState<RegionKey | "">("");

  const handleFindClick = () => {
    if (!region) {
      return;
    }

    const targetHref = toWeddingRegionHref(region);
    trackClickWeddingGuide(region, source);

    if (typeof window !== "undefined") {
      const conversionWindow = window as ConversionWindow;
      if (typeof conversionWindow.gtag_report_conversion === "function") {
        conversionWindow.gtag_report_conversion(targetHref);
        return;
      }
    }

    router.push(targetHref, { scroll: true });
  };

  return (
    <article className="mt-4 rounded-2xl border border-[var(--line)] bg-[linear-gradient(140deg,rgba(184,141,216,0.15),rgba(255,255,255,0.65))] p-4">
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--ink-faint)]">WEDDING GUIDE</p>
      <h3 className="mt-2 text-lg font-semibold text-[var(--ink-strong)]">웨딩 박람회 안내</h3>
      <p className="mt-1 text-sm text-[var(--ink-dim)]">지역을 선택하고 찾기 버튼을 누르면 해당 지역 박람회 목록으로 바로 이동합니다.</p>
      <div className="mt-3 rounded-xl border border-[var(--line)] bg-white/75 p-2.5 sm:border-0 sm:bg-transparent sm:p-0">
        <p className="mb-2 text-xs font-semibold tracking-[0.12em] text-[var(--ink-faint)] sm:hidden">지역 선택</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor={`wedding-guide-region-${source}`}>
            지역 선택
          </label>
          <select
            id={`wedding-guide-region-${source}`}
            value={region}
            onChange={(event) => setRegion(event.target.value as RegionKey)}
            className="h-12 flex-1 rounded-xl border-2 border-[var(--accent)] bg-white px-3 text-base font-semibold text-[var(--ink-strong)] shadow-[0_6px_18px_rgba(122,74,160,0.12)] outline-none ring-[var(--accent)] transition focus:ring-2 sm:h-10 sm:rounded-lg sm:border sm:border-[var(--line)] sm:text-sm sm:font-medium sm:text-[var(--ink)] sm:shadow-none"
          >
            <option value="">지역 선택</option>
            {REGION_NAV_ORDER.map((key) => (
              <option key={key} value={key}>
                {REGION_LABELS_WITH_ALL[key]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleFindClick}
            disabled={!region}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[var(--accent)] px-4 text-base font-semibold text-white shadow-[0_8px_20px_rgba(122,74,160,0.28)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:w-auto sm:rounded-lg sm:text-sm sm:shadow-none"
          >
            찾기
          </button>
        </div>
      </div>
    </article>
  );
}
