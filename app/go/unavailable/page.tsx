import Link from "next/link";

interface UnavailablePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getFirst(input: string | string[] | undefined): string {
  if (Array.isArray(input)) {
    return input[0] ?? "";
  }
  return input ?? "";
}

export default async function GoUnavailablePage({ searchParams }: UnavailablePageProps) {
  const params = await searchParams;
  const region = getFirst(params.region);
  const backHref = region ? `/wedding/${region}?missingCpa=1` : "/wedding?missingCpa=1";

  return (
    <main className="mx-auto flex min-h-[65vh] w-full max-w-[900px] items-center px-4 py-10 md:px-6">
      <section className="w-full rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-8 text-center shadow-[var(--shadow-soft)]">
        <h1 className="text-2xl font-semibold text-[var(--ink-strong)]">신청 링크 준비 중</h1>
        <p className="mt-2 text-sm text-[var(--ink-dim)]">
          선택한 박람회의 CPA 링크가 아직 등록되지 않았습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <Link
          href={backHref}
          className="mt-5 inline-flex h-10 items-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white"
        >
          목록으로 돌아가기
        </Link>
      </section>
    </main>
  );
}

