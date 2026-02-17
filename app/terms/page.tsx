import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관",
  description: "Wedding damoa 서비스 이용약관입니다.",
};

const EFFECTIVE_DATE = "2026-02-17";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-10 md:px-6">
      <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[var(--shadow-soft)] md:p-8">
        <h1 className="text-2xl font-semibold text-[var(--ink-strong)] md:text-3xl">이용약관</h1>
        <p className="mt-2 text-sm text-[var(--ink-faint)]">시행일: {EFFECTIVE_DATE}</p>

        <div className="mt-6 space-y-6 text-sm leading-6 text-[var(--ink-dim)]">
          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">1. 목적</h2>
            <p className="mt-2">
              본 약관은 Wedding damoa(이하 &quot;서비스&quot;)가 제공하는 웨딩 박람회 정보 및 관련 부가 서비스의 이용 조건과 절차, 이용자와 운영자의 권리 및 의무를 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">2. 서비스 내용</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>지역별 웨딩 박람회 일정, 장소, 썸네일 등 정보 제공</li>
              <li>검색/필터 기능 제공</li>
              <li>외부 제휴사(CPA) 페이지로 이동할 수 있는 링크 제공</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">3. 이용자의 의무</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>관계 법령 및 본 약관을 준수해야 합니다.</li>
              <li>서비스를 부정한 목적(자동화 남용, 공격, 크롤링 남용 등)으로 이용해서는 안 됩니다.</li>
              <li>서비스 운영을 방해하는 행위를 해서는 안 됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">4. 외부 링크 및 제휴 서비스</h2>
            <p className="mt-2">
              서비스는 외부 사이트(제휴사 포함)로 연결되는 링크를 제공할 수 있습니다. 외부 사이트에서의 거래, 신청, 개인정보 처리, 약관 적용은 해당 사이트의 정책을 따릅니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">5. 면책사항</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>서비스는 외부 출처 데이터를 기반으로 정보를 제공하며, 최신성/정확성/완전성을 보증하지 않습니다.</li>
              <li>천재지변, 시스템 장애, 외부 플랫폼 장애 등 불가항력 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
              <li>이용자의 귀책 사유로 발생한 손해에 대해 책임을 지지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">6. 서비스 변경 및 중단</h2>
            <p className="mt-2">
              운영자는 서비스 품질 향상 또는 운영상 필요에 따라 서비스 일부 또는 전부를 변경/중단할 수 있으며, 중요한 변경 사항은 사전 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">7. 약관의 개정</h2>
            <p className="mt-2">
              운영자는 관련 법령의 변경 또는 서비스 정책 변경에 따라 약관을 개정할 수 있으며, 개정 시 시행일과 개정 사유를 공지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">8. 준거법 및 관할</h2>
            <p className="mt-2">본 약관은 대한민국 법령을 준거법으로 하며, 분쟁 발생 시 관련 법령에 따른 관할 법원을 따릅니다.</p>
          </section>
        </div>
      </section>
    </main>
  );
}
