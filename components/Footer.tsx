import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-10 border-t border-[var(--line)] bg-white">
      <div className="mx-auto grid w-full max-w-[1320px] gap-3 px-4 py-6 text-xs text-[var(--ink-faint)] md:px-6">
        <p className="flex flex-wrap items-center gap-2">
          <Link href="/privacy" className="underline-offset-2 hover:underline">
            개인정보 처리방침
          </Link>
          <span aria-hidden>·</span>
          <Link href="/terms" className="underline-offset-2 hover:underline">
            이용약관
          </Link>
        </p>
        <p>
          일정 데이터 출처: replyalba 웨딩 일정 페이지 (
          <a
            className="underline-offset-2 hover:underline"
            href="https://replyalba.com/intros/weddingA/"
            target="_blank"
            rel="noopener noreferrer"
          >
            replyalba.com
          </a>
          )
        </p>
      </div>
    </footer>
  );
}
