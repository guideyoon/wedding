import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-[900px] items-center px-4 py-10 md:px-6">
      <section className="w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-8 text-center shadow-[var(--shadow-soft)]">
        <h1 className="text-2xl font-semibold text-[var(--ink-strong)]">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-[var(--ink-dim)]">요청한 경로가 없거나 삭제되었습니다.</p>
        <Link
          href="/wedding"
          className="mt-5 inline-flex h-10 items-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white"
        >
          웨딩 박람회 홈으로
        </Link>
      </section>
    </main>
  );
}

