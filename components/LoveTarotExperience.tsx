"use client";

import { useEffect, useMemo, useState } from "react";

type TarotPhase = "intro" | "questions" | "shuffle" | "pick";
type LoveFocus = "stability" | "passion" | "healing" | "communication" | "commitment";

interface TarotQuestionOption {
  id: string;
  label: string;
  focus: LoveFocus;
}

interface TarotQuestion {
  id: number;
  illustration: string;
  prompt: string;
  options: TarotQuestionOption[];
}

interface TarotAnswer {
  questionId: number;
  optionId: string;
  focus: LoveFocus;
}

interface TarotCard {
  id: number;
  name: string;
  keyTheme: string;
  interpretation: string;
  advice: string;
}

const CARD_ROLES = ["현재의 마음", "관계의 흐름", "가까운 미래 조언"] as const;
const SHUFFLE_MESSAGES = ["카드 에너지를 정돈하고 있어요", "질문을 카드에 연결하고 있어요", "당신의 3장을 준비하고 있어요"];

const LOVE_FOCUS_PRIORITY: LoveFocus[] = ["communication", "stability", "passion", "healing", "commitment"];

const LOVE_FOCUS_SUMMARY: Record<LoveFocus, { title: string; detail: string; action: string }> = {
  communication: {
    title: "소통 회복형",
    detail: "관계의 핵심을 대화와 공감에서 찾는 성향입니다. 솔직한 대화 한 번이 오래된 오해를 줄여줍니다.",
    action: "이번 주에는 감정을 추측하지 말고 짧아도 구체적인 문장으로 마음을 확인해 보세요.",
  },
  stability: {
    title: "안정 지향형",
    detail: "일관성, 신뢰, 생활 리듬이 맞을 때 애정이 깊어지는 성향입니다. 작은 약속을 지키는 힘이 큽니다.",
    action: "관계의 불안을 줄이기 위해 함께 지킬 수 있는 현실적인 약속 1가지를 정해보세요.",
  },
  passion: {
    title: "감정 표현형",
    detail: "설렘과 몰입이 사랑의 동력입니다. 표현이 줄면 마음도 멀어졌다고 느끼기 쉬운 편입니다.",
    action: "호감과 고마움을 미루지 말고 오늘 바로 짧은 메시지로 표현해 보세요.",
  },
  healing: {
    title: "회복 우선형",
    detail: "상대와의 관계를 건강하게 유지하기 위해 정서적 안전과 회복 시간을 중요하게 여깁니다.",
    action: "지친 상태에서 결론을 내리기보다, 충분히 쉬고 감정이 가라앉은 뒤 대화 일정을 잡아보세요.",
  },
  commitment: {
    title: "확신 추구형",
    detail: "관계의 방향성과 책임감을 중요하게 생각합니다. 애매함이 길어질수록 피로가 커질 수 있습니다.",
    action: "관계의 다음 단계에 대해 서로 기대하는 바를 명확하게 말하고 기준을 맞춰보세요.",
  },
};

const TAROT_QUESTIONS: TarotQuestion[] = [
  {
    id: 1,
    illustration: "초저녁 하늘 아래 두 사람이 마주 선 장면",
    prompt: "요즘 연애에서 가장 크게 느끼는 감정은 무엇인가요?",
    options: [
      { id: "q1_a", label: "설렘과 기대가 크다", focus: "passion" },
      { id: "q1_b", label: "편안하고 안정적이다", focus: "stability" },
      { id: "q1_c", label: "불안하거나 조심스럽다", focus: "healing" },
    ],
  },
  {
    id: 2,
    illustration: "테이블 위에 놓인 편지와 열리지 않은 메시지",
    prompt: "서운한 일이 생기면 보통 어떻게 반응하나요?",
    options: [
      { id: "q2_a", label: "바로 대화로 풀려고 한다", focus: "communication" },
      { id: "q2_b", label: "혼자 정리할 시간을 갖는다", focus: "healing" },
      { id: "q2_c", label: "기준을 정하고 분명히 말한다", focus: "commitment" },
    ],
  },
  {
    id: 3,
    illustration: "같은 방향을 바라보는 두 개의 의자",
    prompt: "연인에게 가장 바라는 모습은 무엇인가요?",
    options: [
      { id: "q3_a", label: "약속을 잘 지키는 신뢰감", focus: "stability" },
      { id: "q3_b", label: "진심을 자주 표현하는 태도", focus: "passion" },
      { id: "q3_c", label: "생각을 솔직히 공유하는 소통", focus: "communication" },
    ],
  },
  {
    id: 4,
    illustration: "갈림길 앞에서 비추는 가로등",
    prompt: "현재 관계에서 가장 고민되는 지점은 어디인가요?",
    options: [
      { id: "q4_a", label: "관계의 미래가 불분명하다", focus: "commitment" },
      { id: "q4_b", label: "감정 기복이 커서 힘들다", focus: "healing" },
      { id: "q4_c", label: "표현 방식이 달라 오해가 생긴다", focus: "communication" },
    ],
  },
  {
    id: 5,
    illustration: "창가에 앉아 서로의 손을 잡는 장면",
    prompt: "관계가 좋아질 때 가장 필요한 요소는 무엇인가요?",
    options: [
      { id: "q5_a", label: "안정적인 루틴과 꾸준함", focus: "stability" },
      { id: "q5_b", label: "따뜻한 말과 행동 표현", focus: "passion" },
      { id: "q5_c", label: "감정을 경청해 주는 시간", focus: "healing" },
    ],
  },
  {
    id: 6,
    illustration: "달빛 아래 놓인 두 잔의 커피",
    prompt: "연애에서 갈등을 해결할 때 더 중요한 것은?",
    options: [
      { id: "q6_a", label: "팩트를 정리하는 대화", focus: "communication" },
      { id: "q6_b", label: "서로의 책임과 약속", focus: "commitment" },
      { id: "q6_c", label: "감정 회복 후 재논의", focus: "healing" },
    ],
  },
  {
    id: 7,
    illustration: "일정표에 표시된 데이트 약속",
    prompt: "내가 사랑받는다고 느끼는 순간은 언제인가요?",
    options: [
      { id: "q7_a", label: "작은 약속도 지켜줄 때", focus: "stability" },
      { id: "q7_b", label: "애정 표현을 자주 들을 때", focus: "passion" },
      { id: "q7_c", label: "내 이야기를 깊게 들어줄 때", focus: "communication" },
    ],
  },
  {
    id: 8,
    illustration: "비 내린 뒤 맑아지는 거리",
    prompt: "최근 연애에서 가장 필요한 변화는 무엇이라 생각하나요?",
    options: [
      { id: "q8_a", label: "관계의 방향을 명확히 하는 것", focus: "commitment" },
      { id: "q8_b", label: "상처를 치유하는 시간", focus: "healing" },
      { id: "q8_c", label: "표현을 더 적극적으로 하는 것", focus: "passion" },
    ],
  },
  {
    id: 9,
    illustration: "따뜻한 조명이 비추는 식탁",
    prompt: "이상적인 연애 리듬은 어떤 모습인가요?",
    options: [
      { id: "q9_a", label: "규칙적이고 예측 가능한 관계", focus: "stability" },
      { id: "q9_b", label: "대화가 끊기지 않는 관계", focus: "communication" },
      { id: "q9_c", label: "서로를 격려하며 성장하는 관계", focus: "commitment" },
    ],
  },
  {
    id: 10,
    illustration: "새벽빛이 들어오는 창가와 열린 노트",
    prompt: "이번 타로에서 가장 알고 싶은 것은 무엇인가요?",
    options: [
      { id: "q10_a", label: "지금 마음을 어떻게 전해야 할지", focus: "communication" },
      { id: "q10_b", label: "관계가 안정될 수 있을지", focus: "stability" },
      { id: "q10_c", label: "앞으로의 관계 방향성", focus: "commitment" },
    ],
  },
];

const TAROT_CARDS: TarotCard[] = [
  {
    id: 1,
    name: "연인",
    keyTheme: "진심의 일치",
    interpretation: "서로의 마음이 같은 방향으로 맞춰질 가능성이 큽니다. 감정을 숨기기보다 확인할수록 관계가 선명해집니다.",
    advice: "상대의 마음을 추측하기보다, 내가 원하는 사랑의 방식부터 명확히 말해보세요.",
  },
  {
    id: 2,
    name: "태양",
    keyTheme: "밝은 확신",
    interpretation: "관계에 긍정적인 에너지가 강하게 들어옵니다. 오해보다 이해가 빨라지는 흐름입니다.",
    advice: "좋은 분위기일 때 중요한 대화를 꺼내 관계의 기준을 한 단계 올려보세요.",
  },
  {
    id: 3,
    name: "별",
    keyTheme: "회복과 희망",
    interpretation: "이전의 상처가 천천히 회복되며 신뢰가 재구성되는 카드입니다. 급하게 결론내지 않을 때 관계가 살아납니다.",
    advice: "감정 회복에 필요한 시간과 방식을 구체적으로 합의하면 안정감이 커집니다.",
  },
  {
    id: 4,
    name: "컵 2",
    keyTheme: "감정 교류",
    interpretation: "상호 호감, 공감, 정서적 교감이 핵심입니다. 대화가 깊어질수록 관계 만족도가 높아집니다.",
    advice: "하루 10분이라도 감정 체크 대화를 루틴으로 만들어 보세요.",
  },
  {
    id: 5,
    name: "완드 기사",
    keyTheme: "강한 끌림",
    interpretation: "매력과 설렘이 빠르게 커지는 흐름입니다. 다만 속도 조절 없이 달리면 피로가 생길 수 있습니다.",
    advice: "감정의 속도와 현실의 속도를 맞추는 대화가 필요합니다.",
  },
  {
    id: 6,
    name: "황제",
    keyTheme: "관계의 구조",
    interpretation: "책임감과 안정적 리드가 요구됩니다. 경계와 규칙이 명확할수록 신뢰가 높아집니다.",
    advice: "서로 지켜야 할 최소 기준을 정하고 애매한 영역을 줄이세요.",
  },
  {
    id: 7,
    name: "여황제",
    keyTheme: "정서적 풍요",
    interpretation: "돌봄과 애정 표현이 관계를 부드럽게 만듭니다. 따뜻한 반응이 큰 안정감을 줍니다.",
    advice: "상대가 편안함을 느끼는 표현 방식을 먼저 관찰하고 맞춰보세요.",
  },
  {
    id: 8,
    name: "정의",
    keyTheme: "균형과 합의",
    interpretation: "감정보다 공정성과 균형이 중요해지는 시기입니다. 일방적인 관계는 조정이 필요합니다.",
    advice: "서로 원하는 것과 부담되는 것을 표로 정리해 현실적인 중간점을 찾으세요.",
  },
  {
    id: 9,
    name: "은둔자",
    keyTheme: "내면 점검",
    interpretation: "잠시 거리를 두고 스스로를 살피는 흐름입니다. 조용한 시간은 후퇴가 아니라 정리의 과정입니다.",
    advice: "연락 빈도보다 연락의 질을 높이는 방향으로 관계 리듬을 조정해 보세요.",
  },
  {
    id: 10,
    name: "달",
    keyTheme: "불안과 오해",
    interpretation: "확인되지 않은 생각이 불안을 키우기 쉽습니다. 추측이 늘수록 관계가 흐려집니다.",
    advice: "상대의 의도를 해석하지 말고, 확인 질문으로 사실을 먼저 맞추세요.",
  },
  {
    id: 11,
    name: "운명의 수레바퀴",
    keyTheme: "전환점",
    interpretation: "관계의 국면이 바뀌는 시기입니다. 우연처럼 보이는 계기가 방향을 바꿀 수 있습니다.",
    advice: "변화가 들어올 때 기존 방식만 고수하지 말고 새로운 대화법을 시도해 보세요.",
  },
  {
    id: 12,
    name: "힘",
    keyTheme: "성숙한 인내",
    interpretation: "강한 감정을 부드럽게 다루는 능력이 관계를 지켜줍니다. 조급함보다 꾸준함이 유리합니다.",
    advice: "감정이 올라올 때 즉시 반응하기보다 호흡을 고르고 핵심만 전달하세요.",
  },
  {
    id: 13,
    name: "매달린 사람",
    keyTheme: "관점 전환",
    interpretation: "답답함이 있지만 시각을 바꾸면 해결 실마리가 보입니다. 기존 해석을 내려놓을 필요가 있습니다.",
    advice: "내 입장만이 아니라 상대의 하루, 상황, 우선순위를 함께 고려해 보세요.",
  },
  {
    id: 14,
    name: "죽음",
    keyTheme: "정리와 재시작",
    interpretation: "한 단계가 끝나고 새로운 방식으로 넘어가는 카드입니다. 낡은 패턴을 끊어야 관계가 살아납니다.",
    advice: "반복되는 갈등 패턴 하나를 골라 이번에 명확히 끊는 행동을 정하세요.",
  },
  {
    id: 15,
    name: "컵 10",
    keyTheme: "정서적 완성",
    interpretation: "정서적 만족감과 안정이 크게 올라오는 카드입니다. 관계의 일상성이 행복의 핵심이 됩니다.",
    advice: "특별한 이벤트보다 꾸준한 배려 루틴을 만드는 것이 장기적으로 더 강합니다.",
  },
];

function shuffleCards(cards: readonly TarotCard[]): TarotCard[] {
  const copied = [...cards];
  for (let i = copied.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function getDominantFocus(answers: TarotAnswer[]): LoveFocus {
  const score: Record<LoveFocus, number> = {
    communication: 0,
    stability: 0,
    passion: 0,
    healing: 0,
    commitment: 0,
  };

  for (const answer of answers) {
    score[answer.focus] += 1;
  }

  let selected: LoveFocus = LOVE_FOCUS_PRIORITY[0];
  for (const focus of LOVE_FOCUS_PRIORITY) {
    if (score[focus] > score[selected]) {
      selected = focus;
    }
  }
  return selected;
}

interface TarotCardBackProps {
  index: number;
}

function TarotCardBack({ index }: TarotCardBackProps) {
  const cardLabel = `CARD ${String(index + 1).padStart(2, "0")}`;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[0.65rem] border border-[rgba(255,255,255,0.3)] bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.22),transparent_34%),linear-gradient(165deg,#4a3460_0%,#6b4b8a_44%,#2f213f_100%)]">
      <div className="absolute inset-2 rounded-[0.5rem] border border-[rgba(255,255,255,0.25)]" />
      <div className="absolute inset-4 rounded-[0.45rem] border border-[rgba(255,255,255,0.18)]" />

      <svg viewBox="0 0 100 140" className="absolute inset-0 h-full w-full opacity-90" aria-hidden="true">
        <circle cx="50" cy="70" r="20" fill="none" stroke="rgba(248,242,255,0.5)" strokeWidth="1.2" />
        <circle cx="50" cy="70" r="30" fill="none" stroke="rgba(248,242,255,0.28)" strokeWidth="1" />
        <path d="M50 22 L54 34 L66 34 L56 41 L60 53 L50 45 L40 53 L44 41 L34 34 L46 34 Z" fill="rgba(248,242,255,0.8)" />
        <path d="M50 88 L53 96 L61 96 L54 101 L57 109 L50 104 L43 109 L46 101 L39 96 L47 96 Z" fill="rgba(248,242,255,0.72)" />
        <circle cx="21" cy="24" r="2.2" fill="rgba(255,255,255,0.72)" />
        <circle cx="79" cy="24" r="2.2" fill="rgba(255,255,255,0.72)" />
        <circle cx="21" cy="116" r="2.2" fill="rgba(255,255,255,0.72)" />
        <circle cx="79" cy="116" r="2.2" fill="rgba(255,255,255,0.72)" />
        <path d="M27 69 C40 52, 60 52, 73 69 C60 86, 40 86, 27 69 Z" fill="none" stroke="rgba(248,242,255,0.22)" strokeWidth="1" />
      </svg>

      <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(43,31,57,0),rgba(20,12,30,0.68))] px-2 pb-2 pt-6 text-center">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[rgba(248,242,255,0.86)]">LOVE TAROT</p>
        <p className="mt-1 text-xs font-semibold text-[rgba(248,242,255,0.95)]">{cardLabel}</p>
      </div>
    </div>
  );
}

export function LoveTarotExperience() {
  const [phase, setPhase] = useState<TarotPhase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<TarotAnswer[]>([]);
  const [shuffleMessageIndex, setShuffleMessageIndex] = useState(0);
  const [deck, setDeck] = useState<TarotCard[]>(TAROT_CARDS);
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const [resultOpen, setResultOpen] = useState(false);

  const currentQuestion = TAROT_QUESTIONS[questionIndex];
  const dominantFocus = useMemo(() => getDominantFocus(answers), [answers]);
  const focusSummary = LOVE_FOCUS_SUMMARY[dominantFocus];
  const progressPercent = Math.round(((questionIndex + 1) / TAROT_QUESTIONS.length) * 100);

  const selectedCards = useMemo(
    () =>
      selectedCardIds
        .map((cardId) => deck.find((card) => card.id === cardId))
        .filter((card): card is TarotCard => Boolean(card)),
    [deck, selectedCardIds],
  );

  const moveToShufflePhase = () => {
    setResultOpen(false);
    setSelectedCardIds([]);
    setShuffleMessageIndex(0);
    setPhase("shuffle");
  };

  useEffect(() => {
    if (phase !== "shuffle") {
      return;
    }

    const rotate = window.setInterval(() => {
      setShuffleMessageIndex((previous) => (previous + 1) % SHUFFLE_MESSAGES.length);
    }, 700);

    const done = window.setTimeout(() => {
      setDeck(shuffleCards(TAROT_CARDS));
      setPhase("pick");
    }, 2600);

    return () => {
      window.clearInterval(rotate);
      window.clearTimeout(done);
    };
  }, [phase]);

  const startQuestionFlow = () => {
    setPhase("questions");
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedCardIds([]);
    setResultOpen(false);
  };

  const restartFromIntro = () => {
    setPhase("intro");
    setQuestionIndex(0);
    setAnswers([]);
    setSelectedCardIds([]);
    setResultOpen(false);
  };

  const selectAnswer = (option: TarotQuestionOption) => {
    const answer: TarotAnswer = {
      questionId: currentQuestion.id,
      optionId: option.id,
      focus: option.focus,
    };

    setAnswers((previous) => [...previous, answer]);

    if (questionIndex === TAROT_QUESTIONS.length - 1) {
      moveToShufflePhase();
      return;
    }
    setQuestionIndex((previous) => previous + 1);
  };

  const selectCard = (cardId: number) => {
    setSelectedCardIds((previous) => {
      if (previous.includes(cardId) || previous.length >= 3) {
        return previous;
      }
      const next = [...previous, cardId];
      if (next.length === 3) {
        setResultOpen(true);
      }
      return next;
    });
  };

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8 md:px-6 md:py-10">
      {phase === "intro" ? (
        <section className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-soft)]">
          <div className="border-b border-[var(--line)] bg-[linear-gradient(120deg,rgba(184,141,216,0.17),rgba(255,255,255,0.2))] p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-[var(--ink-faint)]">LOVE TAROT</p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-[var(--ink-strong)] md:text-4xl">
              연애 타로 리딩
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-dim)] md:text-base">
              10가지 질문에 답하고 카드를 3장 선택하면, 현재 감정 흐름과 관계의 방향을 자세한 연애 타로 해석으로
              확인할 수 있어요.
            </p>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <article className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <p className="text-xs font-semibold text-[var(--ink-faint)]">STEP 1</p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--ink-strong)]">연애 질문 10개</h2>
              <p className="mt-2 text-sm text-[var(--ink-dim)]">삽화 설명과 질문을 보고 현재 마음에 가장 가까운 답을 고릅니다.</p>
            </article>
            <article className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <p className="text-xs font-semibold text-[var(--ink-faint)]">STEP 2</p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--ink-strong)]">카드 셔플 이벤트</h2>
              <p className="mt-2 text-sm text-[var(--ink-dim)]">질문 에너지와 카드를 연결하는 짧은 셔플 로딩이 진행됩니다.</p>
            </article>
            <article className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <p className="text-xs font-semibold text-[var(--ink-faint)]">STEP 3</p>
              <h2 className="mt-1 text-lg font-semibold text-[var(--ink-strong)]">3장 결과 팝업</h2>
              <p className="mt-2 text-sm text-[var(--ink-dim)]">15장의 뒤집힌 카드 중 3장을 고르면 상세 결과가 팝업으로 열립니다.</p>
            </article>
          </div>
          <div className="px-6 pb-8 md:px-8">
            <button
              type="button"
              onClick={startQuestionFlow}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:brightness-95"
            >
              시작하기
            </button>
          </div>
        </section>
      ) : null}

      {phase === "questions" ? (
        <section className="space-y-4">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-[var(--shadow-soft)]">
            <div className="mb-2 flex items-center justify-between text-xs text-[var(--ink-faint)]">
              <span>
                질문 {questionIndex + 1} / {TAROT_QUESTIONS.length}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--soft-accent)]">
              <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)] md:p-6">
            <div className="mb-4 rounded-2xl border border-[var(--line)] bg-[linear-gradient(140deg,rgba(184,141,216,0.2),rgba(255,255,255,0.2))] p-4">
              <p className="text-xs font-semibold tracking-wide text-[var(--ink-faint)]">삽화</p>
              <p className="mt-2 text-sm text-[var(--ink-dim)]">{currentQuestion.illustration}</p>
            </div>
            <h2 className="text-xl font-semibold leading-snug text-[var(--ink-strong)] md:text-2xl">{currentQuestion.prompt}</h2>
            <div className="mt-4 grid gap-2">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectAnswer(option)}
                  className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-left text-sm text-[var(--ink)] transition hover:border-[var(--accent)] hover:bg-[var(--soft-accent)]"
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={restartFromIntro}
                className="text-sm font-medium text-[var(--ink-faint)] underline-offset-4 hover:underline"
              >
                처음 화면으로
              </button>
              <p className="text-xs text-[var(--ink-faint)]">가장 가까운 답 하나를 선택해 주세요.</p>
            </div>
          </article>
        </section>
      ) : null}

      {phase === "shuffle" ? (
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-8 text-center shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold tracking-[0.18em] text-[var(--ink-faint)]">SHUFFLING</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--ink-strong)] md:text-3xl">타로 카드를 섞고 있어요</h2>
          <p className="mt-3 text-sm text-[var(--ink-dim)]">{SHUFFLE_MESSAGES[shuffleMessageIndex]}...</p>
          <div className="mx-auto mt-7 grid w-full max-w-[340px] grid-cols-3 gap-3">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className="aspect-[2/3] rounded-xl border border-[var(--line)] bg-[linear-gradient(165deg,rgba(184,141,216,0.28),rgba(94,79,116,0.18))] animate-pulse"
                style={{ animationDelay: `${slot * 180}ms` }}
              />
            ))}
          </div>
        </section>
      ) : null}

      {phase === "pick" ? (
        <section className="space-y-4">
          <header className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold tracking-[0.18em] text-[var(--ink-faint)]">CARD PICK</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--ink-strong)]">뒤집힌 카드 15장 중 3장을 선택하세요</h2>
            <p className="mt-2 text-sm text-[var(--ink-dim)]">
              선택 완료: <span className="font-semibold text-[var(--ink-strong)]">{selectedCardIds.length}</span> / 3
            </p>
            {selectedCardIds.length === 3 && !resultOpen ? (
              <button
                type="button"
                onClick={() => setResultOpen(true)}
                className="mt-3 inline-flex h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:brightness-95"
              >
                결과 보기
              </button>
            ) : null}
          </header>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {deck.map((card, index) => {
              const selectedOrder = selectedCardIds.indexOf(card.id);
              const selected = selectedOrder >= 0;
              const disabled = !selected && selectedCardIds.length >= 3;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => selectCard(card.id)}
                  disabled={disabled}
                  className={`group relative aspect-[2/3] rounded-xl border p-2 text-left transition ${
                    selected
                      ? "border-[var(--accent)] bg-white shadow-[var(--shadow-soft)]"
                      : "border-[var(--line)] bg-transparent hover:-translate-y-0.5 hover:border-[var(--accent)]"
                  } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  {selected ? (
                    <div className="flex h-full flex-col">
                      <p className="text-xs font-semibold text-[var(--ink-faint)]">{selectedOrder + 1}번째 선택</p>
                      <h3 className="mt-2 text-base font-semibold text-[var(--ink-strong)]">{card.name}</h3>
                      <p className="mt-2 text-xs leading-5 text-[var(--ink-dim)]">{card.keyTheme}</p>
                    </div>
                  ) : (
                    <TarotCardBack index={index} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={moveToShufflePhase}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--ink-dim)] transition hover:bg-[var(--soft-accent)]"
            >
              카드 다시 섞기
            </button>
            <button
              type="button"
              onClick={restartFromIntro}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--ink-dim)] transition hover:bg-[var(--soft-accent)]"
            >
              처음부터 다시
            </button>
          </div>
        </section>
      ) : null}

      {resultOpen && selectedCards.length === 3 ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,12,30,0.58)] p-4">
          <section className="max-h-[90vh] w-full max-w-[860px] overflow-y-auto rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)] md:p-7">
            <header className="border-b border-[var(--line)] pb-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-[var(--ink-faint)]">RESULT</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--ink-strong)] md:text-3xl">연애 타로 결과</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                이번 리딩의 핵심 성향은 <span className="font-semibold text-[var(--ink-strong)]">{focusSummary.title}</span>입니다.
                {` ${focusSummary.detail}`}
              </p>
            </header>

            <div className="mt-4 space-y-3">
              {selectedCards.map((card, index) => (
                <article key={card.id} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                  <p className="text-xs font-semibold text-[var(--ink-faint)]">{CARD_ROLES[index]}</p>
                  <h3 className="mt-1 text-xl font-semibold text-[var(--ink-strong)]">{card.name}</h3>
                  <p className="mt-2 text-sm font-medium text-[var(--ink-dim)]">핵심 키워드: {card.keyTheme}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">{card.interpretation}</p>
                  <p className="mt-2 rounded-lg bg-[var(--soft-accent)] px-3 py-2 text-sm leading-6 text-[var(--ink-strong)]">
                    조언: {card.advice}
                  </p>
                </article>
              ))}
            </div>

            <article className="mt-4 rounded-2xl border border-[var(--line)] bg-white p-4">
              <h3 className="text-lg font-semibold text-[var(--ink-strong)]">종합 해석</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">
                현재 마음 카드인{" "}
                <span className="font-semibold text-[var(--ink-strong)]">{selectedCards[0].name}</span>는 당신의 감정 중심축을
                보여주고, 관계 흐름 카드인{" "}
                <span className="font-semibold text-[var(--ink-strong)]">{selectedCards[1].name}</span>는 두 사람 사이에서 반복되는
                패턴을 드러냅니다. 마지막 조언 카드인{" "}
                <span className="font-semibold text-[var(--ink-strong)]">{selectedCards[2].name}</span>는 다음 단계로 넘어가기 위한
                실질적인 행동 포인트를 제시합니다.
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">{focusSummary.action}</p>
            </article>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={moveToShufflePhase}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--accent)] px-4 text-sm font-semibold text-white transition hover:brightness-95"
              >
                같은 답변으로 다시 뽑기
              </button>
              <button
                type="button"
                onClick={startQuestionFlow}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--ink-dim)] transition hover:bg-[var(--soft-accent)]"
              >
                질문부터 다시 하기
              </button>
              <button
                type="button"
                onClick={() => setResultOpen(false)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--ink-dim)] transition hover:bg-[var(--soft-accent)]"
              >
                팝업 닫기
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
