"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/wedding", label: "2026 웨딩박람회", released: true },
  { href: "/tips", label: "웨딩 준비 꿀팁", released: true },
  { href: "/tarot", label: "연애 타로", released: true },
  { href: "/match", label: "궁합보기", released: true },
] as const;

const WEDDING_HOME_PATH = "/wedding";

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return (
    event.button === 0 &&
    !event.defaultPrevented &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey
  );
}

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainLeftClick(event)) {
      return;
    }

    const hasSearch = typeof window !== "undefined" && window.location.search.length > 0;
    const shouldResetToWeddingHome = pathname !== WEDDING_HOME_PATH || hasSearch;
    if (!shouldResetToWeddingHome) {
      return;
    }

    event.preventDefault();
    router.push(WEDDING_HOME_PATH, { scroll: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,255,255,0.9)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1320px] items-center gap-4 px-4 py-3 md:px-6">
        <Link
          href={WEDDING_HOME_PATH}
          onClick={handleLogoClick}
          className="text-lg font-semibold tracking-tight text-[var(--ink-strong)]"
        >
          Wedding damoa
        </Link>
        <nav className="ml-2 flex items-center gap-1 overflow-x-auto whitespace-nowrap text-sm">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
            <Link
              key={item.href}
              href={item.href}
               className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 transition ${
                active
                  ? "bg-[var(--soft-accent)] text-[var(--ink-strong)]"
                  : "text-[var(--ink-dim)] hover:bg-white"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
              {!item.released ? <span className="ml-1 text-xs text-[var(--ink-faint)]">Coming Soon</span> : null}
            </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
