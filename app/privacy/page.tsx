import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
  description: "Wedding damoa 서비스의 개인정보 처리방침입니다.",
};

const EFFECTIVE_DATE = "2026-02-17";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-10 md:px-6">
      <section className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[var(--shadow-soft)] md:p-8">
        <h1 className="text-2xl font-semibold text-[var(--ink-strong)] md:text-3xl">개인정보 처리방침</h1>
        <p className="mt-2 text-sm text-[var(--ink-faint)]">시행일: {EFFECTIVE_DATE}</p>

        <div className="mt-6 space-y-6 text-sm leading-6 text-[var(--ink-dim)]">
          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">1. 수집하는 개인정보 항목</h2>
            <p className="mt-2">
              본 서비스는 회원가입 없이 이용 가능하며, 원칙적으로 이용자를 직접 식별할 수 있는 이름, 연락처 등의 개인정보를 필수로 수집하지 않습니다.
            </p>
            <ul className="mt-2 list-disc pl-5">
              <li>서비스 이용 과정에서 자동 생성되는 정보: IP 주소, 브라우저 정보, 접속 일시, 기기 정보</li>
              <li>이벤트 추적 데이터: 지역 조회, 필터 적용, CPA 버튼 클릭 이력</li>
              <li>분석 도구 사용 시 생성 정보: 쿠키/식별자 기반 통계 정보</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">2. 개인정보 이용 목적</h2>
            <ul className="mt-2 list-disc pl-5">
              <li>서비스 운영 및 안정성 확보</li>
              <li>이용 통계 분석 및 사용자 경험 개선</li>
              <li>부정 이용 방지 및 보안 대응</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">3. 보유 및 이용 기간</h2>
            <p className="mt-2">
              수집된 정보는 목적 달성 시 지체 없이 파기하며, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안만 보관합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">4. 제3자 제공 및 처리 위탁</h2>
            <p className="mt-2">본 서비스는 이용자 식별 개인정보를 제3자에게 판매하지 않습니다.</p>
            <p className="mt-2">다만 서비스 제공을 위해 아래 외부 서비스가 사용될 수 있습니다.</p>
            <ul className="mt-2 list-disc pl-5">
              <li>Cloudflare: 인프라/보안/캐시/로그 처리</li>
              <li>Google Analytics, Meta Pixel(설정 시): 방문 통계 및 마케팅 성과 측정</li>
              <li>외부 제휴 링크(CPA): 이용자가 클릭 시 해당 제휴사 정책이 적용됨</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">5. 쿠키 및 추적 기술</h2>
            <p className="mt-2">
              서비스는 분석 및 품질 개선 목적의 쿠키/스크립트를 사용할 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">6. 이용자 권리</h2>
            <p className="mt-2">
              이용자는 관련 법령에 따라 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있으며, 서비스 운영자는 정당한 요청에 성실히 응답합니다.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[var(--ink-strong)]">7. 방침 변경</h2>
            <p className="mt-2">
              본 방침은 법령 및 서비스 변경 사항을 반영해 수정될 수 있으며, 중요한 변경 시 서비스 내 공지로 안내합니다.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
