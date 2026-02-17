import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { getSiteUrl } from "@/lib/site";

const FAQ_ITEMS = [
  {
    question: "웨딩박람회 가기 전 준비물은 무엇인가요?",
    answer:
      "예산표, 원하는 스드메 스타일 캡처, 웨딩홀 희망 날짜 범위, 부모님 의견 메모, 신분증, 상담 비교용 체크리스트를 준비하세요. 현장에서 가격표를 즉시 비교할 수 있도록 휴대폰 메모 템플릿을 미리 만들어 가면 결정 실수를 줄일 수 있습니다. 2026 웨딩박람회 무료초대권을 받아 방문할 경우 상담 효율이 더 높습니다.",
  },
  {
    question: "웨딩박람회 호구 안 되는 법, 핵심 체크는?",
    answer:
      "당일 계약 특가 문구만 보고 바로 결제하지 말고, 필수 포함 항목과 추가금 조건을 먼저 확인하세요. 특히 드레스 업그레이드, 본식 헬퍼, 원판 촬영, 앨범 페이지 추가 비용을 계약서에 명시해야 합니다. 최소 2개 업체 견적을 같은 항목 기준으로 비교한 뒤 결정하는 것이 안전합니다.",
  },
  {
    question: "2026년 스드메 패키지 혜택 비교는 어떻게 해야 하나요?",
    answer:
      "총액만 비교하지 말고 구성품 단가를 분리해서 보세요. 스튜디오 촬영 컷 수, 드레스 피팅 횟수, 메이크업 원장 여부, 촬영 원본 제공 범위, 보정본 수량을 같은 표로 정리하면 실제 혜택 차이가 보입니다. 2026년에는 원본 제공과 피팅 추가 혜택 유무가 체감 차이가 큽니다.",
  },
  {
    question: "웨딩박람회 초대장 받는 법과 결혼박람회 무료 입장 방법은?",
    answer:
      "공식 랜딩 페이지에서 사전 신청을 완료하면 웨딩박람회 초대장 받는 법이 가장 간단합니다. 결혼박람회 무료 입장은 대부분 사전 신청자 대상으로 운영되므로 방문 날짜와 동반 인원까지 미리 등록해 두는 것이 좋습니다.",
  },
  {
    question: "서울 웨딩박람회 무료 신청, 서울 웨딩쇼 무료초대권은 어디서 확인하나요?",
    answer:
      "서울 웨딩박람회 무료 신청은 지역별 일정 페이지에서 신청 링크를 확인하는 방식이 가장 정확합니다. 서울 웨딩쇼 무료초대권도 동일하게 사전 신청 경로를 통해 발급되며, 행사별 마감 시점이 빨라 조기 신청이 유리합니다.",
  },
  {
    question: "웨딩페어 무료초대와 다이렉트 웨딩박람회 초대, 무엇이 다른가요?",
    answer:
      "웨딩페어 무료초대는 행사 운영사가 제공하는 일반 초대권인 경우가 많고, 다이렉트 웨딩박람회 초대는 특정 제휴 혜택이나 상담 우선권이 함께 제공되는 경우가 있습니다. 신청 전 제공 혜택과 제외 조건을 같이 확인하세요.",
  },
  {
    question: "결혼 준비 체크리스트는 어떤 순서로 진행하면 되나요?",
    answer:
      "예식 10~12개월 전 예산과 희망일 확정, 8~10개월 전 웨딩홀/스드메 계약, 4~6개월 전 혼수·예물·청첩장 준비, 1~2개월 전 하객/식순/좌석 확정 순으로 진행하세요. 일정이 꼬이지 않도록 주차별 해야 할 일 체크리스트를 공유 캘린더에 넣어 관리하는 것이 좋습니다.",
  },
  {
    question: "2026 웨딩박람회 혜택과 웨딩박람회 가면 좋은 점, 사은품 많은 곳 판단법은?",
    answer:
      "2026 웨딩박람회 혜택은 계약 할인, 촬영 업그레이드, 추가 사은품 중심으로 구성됩니다. 웨딩박람회 가면 좋은 점은 여러 업체를 하루에 비교할 수 있다는 점이며, 웨딩박람회 사은품 많은 곳을 고를 때는 사은품 종류보다 실제 계약 조건과 총액 절감 폭을 우선 확인해야 합니다.",
  },
] as const;

const SEO_KEYWORD_TERMS = [
  "2026 웨딩박람회 무료초대권",
  "서울 웨딩박람회 무료 신청",
  "웨딩박람회 초대장 받는 법",
  "결혼박람회 무료 입장",
  "웨딩페어 무료초대",
  "다이렉트 웨딩박람회 초대",
  "서울 웨딩쇼 무료초대권",
  "2026 웨딩박람회 혜택",
  "웨딩박람회 가면 좋은 점",
  "웨딩박람회 사은품 많은 곳",
] as const;

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export const metadata: Metadata = {
  title: "웨딩 준비 꿀팁 Q&A",
  description:
    "2026 웨딩박람회 무료초대권, 서울 웨딩박람회 무료 신청, 웨딩박람회 초대장 받는 법, 결혼 준비 체크리스트까지 한 번에 확인하세요.",
  keywords: [...SEO_KEYWORD_TERMS],
  alternates: {
    canonical: `${getSiteUrl()}/tips`,
  },
  openGraph: {
    title: "웨딩 준비 꿀팁 Q&A",
    description:
      "웨딩박람회 가기 전 준비물, 웨딩박람회 호구 안 되는 법, 2026 웨딩박람회 혜택까지 실전 Q&A로 정리했습니다.",
    url: `${getSiteUrl()}/tips`,
    type: "article",
  },
};

export default function TipsPage() {
  return (
    <main className="mx-auto w-full max-w-[960px] px-4 py-8 md:px-6 md:py-10">
      <Script
        id="tips-faq-jsonld"
        type="application/ld+json"
      >{JSON.stringify(faqStructuredData)}</Script>

      <section className="rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[var(--shadow-soft)] md:p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--ink-faint)]">WEDDING TIPS</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--ink-strong)] md:text-4xl">웨딩 준비 꿀팁 Q&A</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-dim)] md:text-base">
          웨딩 박람회 방문 전 꼭 알아야 할 실전 질문을 모았습니다. 비용 비교, 계약 체크포인트, 결혼 준비 순서까지
          SEO 기반 정보형 콘텐츠로 정리했습니다.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {SEO_KEYWORD_TERMS.map((term) => (
            <span key={term} className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs text-[var(--ink-dim)]">
              {term}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-5 space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <article key={item.question} className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)] md:p-6">
            <p className="text-xs font-semibold tracking-[0.14em] text-[var(--ink-faint)]">Q{index + 1}</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--ink-strong)]">{item.question}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--ink-dim)]">{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)] md:p-6">
        <h2 className="text-xl font-semibold text-[var(--ink-strong)]">바로 이동</h2>
        <p className="mt-2 text-sm text-[var(--ink-dim)]">지역별 웨딩 박람회를 바로 확인하고 무료초대권 혜택을 비교해 보세요.</p>
        <Link
          href="/wedding#region-list-heading"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:brightness-95"
        >
          웨딩 박람회 보러가기
        </Link>
      </section>
    </main>
  );
}
