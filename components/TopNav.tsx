"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/wedding", label: "웨딩 박람회", released: true },
  { href: "/tarot", label: "연애 타로", released: false },
  { href: "/match", label: "궁합 보기", released: false },
] as const;

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(255,255,255,0.9)] backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1320px] items-center gap-4 px-4 py-3 md:px-6">
        <Link href="/wedding" className="text-lg font-semibold tracking-tight text-[var(--ink-strong)]">
          Wedding Evee
        </Link>
        <nav className="ml-2 flex items-center gap-1 text-sm">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 transition ${
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
