"use client";

import { useMemo, useState } from "react";

type Domain = "communication" | "affection" | "conflict" | "lifestyle" | "finance" | "values";
type CompatibilityType = "안정형" | "성장형" | "열정형" | "친구형" | "롤러코스터형";

interface Question {
  id: `Q${number}`;
  domain: Domain;
  prompt: string;
  options: [string, string, string];
}

interface PairAnswer {
  male: number | null;
  female: number | null;
}

interface CompatResult {
  totalScore: number;
  grade: string;
  type: CompatibilityType;
  domainScores: Record<Domain, number>;
  highlights: string[];
  risks: string[];
  actionTips: string[];
  recommendedDateStyle: string;
  conflictManual: string;
}

const QUESTIONS: Question[] = [
  {
    id: "Q1",
    domain: "communication",
    prompt: "하루 연락 빈도 관련 선호가 무엇입니까",
    options: ["필요한 내용 중심으로 간단히", "여유 시간에 적당히", "자주 짧게라도 계속"],
  },
  {
    id: "Q2",
    domain: "affection",
    prompt: "애정 표현 방식 선호가 무엇입니까",
    options: ["말보다 행동 중심", "말과 행동 균형", "말로 자주 표현"],
  },
  {
    id: "Q3",
    domain: "conflict",
    prompt: "다툼이 생겼을 때 첫 반응이 무엇입니까",
    options: ["잠깐 정리 후 대화", "바로 대화로 해결", "시간 필요 후 대화"],
  },
  {
    id: "Q4",
    domain: "conflict",
    prompt: "화해가 잘 되기 위한 방식 선호가 무엇입니까",
    options: ["원인 정리 후 약속 정하기", "감정 공감과 안심 우선", "분위기 풀고 자연 회복"],
  },
  {
    id: "Q5",
    domain: "lifestyle",
    prompt: "데이트 선호가 무엇입니까",
    options: ["집 근처 편한 코스", "가끔 이벤트 코스", "새로운 곳 활동 중심"],
  },
  {
    id: "Q6",
    domain: "lifestyle",
    prompt: "주말 시간 배분 선호가 무엇입니까",
    options: ["혼자 회복 시간 필요", "반반 정도 선호", "함께 시간 우선"],
  },
  {
    id: "Q7",
    domain: "finance",
    prompt: "소비 성향이 무엇입니까",
    options: ["절약과 계획 우선", "균형 소비", "경험 만족 우선"],
  },
  {
    id: "Q8",
    domain: "finance",
    prompt: "돈 관련 공유 수준 선호가 무엇입니까",
    options: ["큰 틀만 공유", "주요 지출 계획 공유", "수입 지출 투명 공유"],
  },
  {
    id: "Q9",
    domain: "values",
    prompt: "가족 관련 경계 설정 선호가 무엇입니까",
    options: ["서로 가족 영역 분리", "중요한 일만 논의", "자주 왕래 함께 챙김"],
  },
  {
    id: "Q10",
    domain: "values",
    prompt: "다음 단계 논의 속도 선호가 무엇입니까",
    options: ["천천히 자연 진행", "시기 맞으면 논의 가능", "빠르게 방향 합의"],
  },
];

const DOMAIN_WEIGHT: Record<Domain, number> = {
  communication: 1.2,
  affection: 1.1,
  conflict: 1.3,
  lifestyle: 1.0,
  finance: 1.1,
  values: 1.2,
};

const DOMAIN_NAME: Record<Domain, string> = {
  communication: "소통",
  affection: "애정표현",
  conflict: "갈등",
  lifestyle: "생활리듬",
  finance: "금전관",
  values: "가치관",
};

const DOMAIN_HIGHLIGHT: Record<Domain, string> = {
  communication: "대화 흐름이 잘 맞아 오해가 줄어드는 장점이 있습니다",
  affection: "애정 표현 방식이 비슷해 정서적 안정감이 높습니다",
  conflict: "갈등을 풀어가는 리듬이 유사해 회복 속도가 빠릅니다",
  lifestyle: "데이트와 휴식 리듬이 맞아 피로 누적이 적습니다",
  finance: "소비 기준과 공유 수준이 비슷해 실무 갈등이 줄어듭니다",
  values: "가족과 미래 계획 기준이 맞아 중장기 합의가 수월합니다",
};

const DOMAIN_RISK: Record<Domain, string> = {
  communication: "연락 빈도 기대치 차이로 서운함이 쌓일 수 있습니다",
  affection: "표현 방식 차이로 사랑받는 느낌이 엇갈릴 수 있습니다",
  conflict: "갈등 타이밍이 어긋나 감정 소모가 길어질 수 있습니다",
  lifestyle: "주말 시간 배분 차이로 관계 피로가 커질 수 있습니다",
  finance: "돈 공유 기준 차이로 불안감이나 통제감이 생길 수 있습니다",
  values: "가족과 미래 방향 합의가 늦어지면 갈등이 반복될 수 있습니다",
};

const DOMAIN_ACTION: Record<Domain, string> = {
  communication: "연락 시작 시간과 응답 기대치를 짧은 규칙으로 합의해 보세요",
  affection: "서로가 사랑을 느끼는 표현 2가지를 정해 주간 루틴으로 실행해 보세요",
  conflict: "감정이 올라오면 멈춤 신호를 쓰고, 합의한 시간에 한 쟁점만 대화하세요",
  lifestyle: "함께 시간과 각자 회복 시간을 주간 단위로 배분표로 맞춰보세요",
  finance: "고정 지출과 자유 지출 기준을 나눠 투명하게 공유해 보세요",
  values: "가족 관련 경계와 다음 단계 논의 시점을 월 단위로 확인해 보세요",
};

const ITEM_SCORE_BY_DIFF = [10, 6, 2] as const;

function getGrade(totalScore: number): string {
  if (totalScore >= 90) return "매우 높음";
  if (totalScore >= 75) return "높음";
  if (totalScore >= 60) return "보통";
  if (totalScore >= 45) return "주의";
  return "관리 필요";
}

function computeType(totalScore: number, domainScores: Record<Domain, number>): CompatibilityType {
  const values = Object.values(domainScores);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const gap = max - min;

  if (domainScores.conflict >= 75 && domainScores.values >= 70) return "안정형";
  if (totalScore >= 70 && gap >= 25) return "성장형";
  if (domainScores.affection >= 80 && domainScores.lifestyle <= 65) return "열정형";
  if (domainScores.communication >= 75 && domainScores.affection <= 65) return "친구형";
  if (domainScores.conflict <= 55 || domainScores.values <= 55) return "롤러코스터형";
  return totalScore >= 70 ? "안정형" : "친구형";
}

function getTopDomains(domainScores: Record<Domain, number>, count: number, asc: boolean): Domain[] {
  const entries = (Object.entries(domainScores) as [Domain, number][]).sort((a, b) =>
    asc ? a[1] - b[1] : b[1] - a[1],
  );
  return entries.slice(0, count).map(([domain]) => domain);
}

function computeCompatibility(answers: Record<string, PairAnswer>): CompatResult {
  let rawSum = 0;
  let rawMax = 0;
  const domainRaw: Record<Domain, number> = {
    communication: 0,
    affection: 0,
    conflict: 0,
    lifestyle: 0,
    finance: 0,
    values: 0,
  };
  const domainMax: Record<Domain, number> = {
    communication: 0,
    affection: 0,
    conflict: 0,
    lifestyle: 0,
    finance: 0,
    values: 0,
  };

  for (const question of QUESTIONS) {
    const pair = answers[question.id];
    const male = pair?.male ?? 0;
    const female = pair?.female ?? 0;
    const diff = Math.abs(male - female);
    const itemScore = ITEM_SCORE_BY_DIFF[diff] ?? 2;
    const weight = DOMAIN_WEIGHT[question.domain];

    rawSum += itemScore * weight;
    rawMax += 10 * weight;
    domainRaw[question.domain] += itemScore;
    domainMax[question.domain] += 10;
  }

  const totalScore = Math.round((rawSum / rawMax) * 100);
  const domainScores = (Object.keys(domainRaw) as Domain[]).reduce(
    (acc, domain) => {
      acc[domain] = Math.round((domainRaw[domain] / domainMax[domain]) * 100);
      return acc;
    },
    {
      communication: 0,
      affection: 0,
      conflict: 0,
      lifestyle: 0,
      finance: 0,
      values: 0,
    } as Record<Domain, number>,
  );

  const strongest = getTopDomains(domainScores, 3, false);
  const weakest = getTopDomains(domainScores, 3, true);
  const highlights = strongest.map((domain) => DOMAIN_HIGHLIGHT[domain]);
  const risks = weakest.map((domain) => DOMAIN_RISK[domain]);
  const actionTips = weakest.map((domain) => DOMAIN_ACTION[domain]);
  const type = computeType(totalScore, domainScores);
  const grade = getGrade(totalScore);

  const recommendedDateStyle =
    domainScores.lifestyle >= 75
      ? "함께하는 활동 중심 코스에 짧은 회복 시간을 섞는 방식"
      : domainScores.lifestyle >= 60
        ? "편한 코스를 기본으로 가끔 새로운 이벤트를 추가하는 방식"
        : "집 근처 편안한 코스와 대화 중심 시간을 늘리는 방식";

  const conflictManual =
    domainScores.conflict >= 70
      ? "감정이 올라오면 바로 결론 내지 말고 쟁점 하나만 확인합니다. 상대 요약 문장을 먼저 반복합니다. 마지막에 실행 약속 한 줄로 마무리합니다"
      : "감정이 올라오면 대화 시작 시간을 합의합니다. 비난 대신 사실과 감정을 분리해 한 가지 쟁점만 다룹니다. 합의 내용을 메시지 한 줄로 남겨 재충돌을 줄입니다";

  return {
    totalScore,
    grade,
    type,
    domainScores,
    highlights,
    risks,
    actionTips,
    recommendedDateStyle,
    conflictManual,
  };
}

function createInitialAnswers(): Record<string, PairAnswer> {
  return QUESTIONS.reduce<Record<string, PairAnswer>>((acc, question) => {
    acc[question.id] = { male: null, female: null };
    return acc;
  }, {});
}

type CompatibilityStep = "basic" | "questions" | "result";

export function CompatibilityExperience() {
  const [maleName, setMaleName] = useState("");
  const [femaleName, setFemaleName] = useState("");
  const [maleBirthdate, setMaleBirthdate] = useState("");
  const [femaleBirthdate, setFemaleBirthdate] = useState("");
  const [relationStage, setRelationStage] = useState("");
  const [disclosureLevel, setDisclosureLevel] = useState("");
  const [meetingChannel, setMeetingChannel] = useState("");
  const [relationshipGoal, setRelationshipGoal] = useState("");
  const [answers, setAnswers] = useState<Record<string, PairAnswer>>(createInitialAnswers);
  const [step, setStep] = useState<CompatibilityStep>("basic");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [basicInfoError, setBasicInfoError] = useState<string | null>(null);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[questionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const progressPercent = Math.round(((questionIndex + 1) / QUESTIONS.length) * 100);

  const basicInfoValid =
    maleName.trim().length >= 1 &&
    maleName.trim().length <= 20 &&
    femaleName.trim().length >= 1 &&
    femaleName.trim().length <= 20 &&
    Boolean(maleBirthdate) &&
    Boolean(femaleBirthdate) &&
    Boolean(relationStage) &&
    Boolean(disclosureLevel);

  const answeredCount = useMemo(
    () => QUESTIONS.filter((question) => answers[question.id].male !== null && answers[question.id].female !== null).length,
    [answers],
  );

  const allQuestionsAnswered = answeredCount === QUESTIONS.length;

  const result = useMemo(
    () => (step === "result" && allQuestionsAnswered ? computeCompatibility(answers) : null),
    [step, allQuestionsAnswered, answers],
  );

  const handleValueChange = (qId: string, side: "male" | "female", value: string) => {
    const parsedValue = value === "" ? null : Number(value);
    setAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [side]: parsedValue,
      },
    }));
    setQuestionError(null);
  };

  const startQuestionFlow = () => {
    if (!basicInfoValid) {
      setBasicInfoError("필수 기본정보를 먼저 입력해 주세요.");
      return;
    }

    setBasicInfoError(null);
    setQuestionError(null);
    setStep("questions");
    setQuestionIndex(0);
  };

  const goToPreviousQuestion = () => {
    if (questionIndex === 0) {
      return;
    }

    setQuestionError(null);
    setQuestionIndex((prev) => prev - 1);
  };

  const goToNextQuestion = () => {
    if (currentAnswer.male === null || currentAnswer.female === null) {
      setQuestionError("남자/여자 답변을 모두 선택해 주세요.");
      return;
    }

    setQuestionError(null);
    if (questionIndex === QUESTIONS.length - 1) {
      setStep("result");
      return;
    }

    setQuestionIndex((prev) => prev + 1);
  };

  const restartQuestions = () => {
    setAnswers(createInitialAnswers());
    setQuestionError(null);
    setQuestionIndex(0);
    setStep("questions");
  };

  const resetAll = () => {
    setMaleName("");
    setFemaleName("");
    setMaleBirthdate("");
    setFemaleBirthdate("");
    setRelationStage("");
    setDisclosureLevel("");
    setMeetingChannel("");
    setRelationshipGoal("");
    setAnswers(createInitialAnswers());
    setQuestionIndex(0);
    setStep("basic");
    setBasicInfoError(null);
    setQuestionError(null);
  };

  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-6 shadow-[var(--shadow-soft)] md:p-8">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--ink-faint)]">COMPATIBILITY CHECK</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--ink-strong)] md:text-4xl">궁합보기</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-dim)]">
          같은 질문에 남자와 여자가 각각 답하면, 답변 차이를 기반으로 궁합 점수와 해석을 제공합니다.
        </p>
      </section>

      {step === "basic" ? (
        <section className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)] md:p-6">
          <h2 className="text-xl font-semibold text-[var(--ink-strong)]">STEP 1 · 기본정보 입력</h2>
          <p className="mt-2 text-sm text-[var(--ink-dim)]">
            먼저 필수 기본정보를 입력한 뒤, 질문을 한 문항씩 진행합니다.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
              남자 이름 (필수)
              <input
                value={maleName}
                onChange={(event) => setMaleName(event.target.value)}
                maxLength={20}
                className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
              />
            </label>
            <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
              여자 이름 (필수)
              <input
                value={femaleName}
                onChange={(event) => setFemaleName(event.target.value)}
                maxLength={20}
                className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
              />
            </label>
            <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
              남자 생년월일 (필수)
              <input
                type="date"
                value={maleBirthdate}
                onChange={(event) => setMaleBirthdate(event.target.value)}
                className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
              />
            </label>
            <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
              여자 생년월일 (필수)
              <input
                type="date"
                value={femaleBirthdate}
                onChange={(event) => setFemaleBirthdate(event.target.value)}
                className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
              />
            </label>
            <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
              관계 단계 (필수)
              <select
                value={relationStage}
                onChange={(event) => setRelationStage(event.target.value)}
                className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
              >
                <option value="">선택하세요</option>
                <option value="썸">썸</option>
                <option value="연애">연애</option>
                <option value="결혼 또는 동거">결혼 또는 동거</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
              공개 수준 (필수)
              <select
                value={disclosureLevel}
                onChange={(event) => setDisclosureLevel(event.target.value)}
                className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
              >
                <option value="">선택하세요</option>
                <option value="재미로만 보기">재미로만 보기</option>
                <option value="관계 점검용">관계 점검용</option>
                <option value="상담 참고용">상담 참고용</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
              만남 경로 (선택)
              <select
                value={meetingChannel}
                onChange={(event) => setMeetingChannel(event.target.value)}
                className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
              >
                <option value="">선택 안함</option>
                <option value="지인 소개">지인 소개</option>
                <option value="직장 또는 학교">직장 또는 학교</option>
                <option value="온라인">온라인</option>
                <option value="기타">기타</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
              관계 목표 (선택)
              <select
                value={relationshipGoal}
                onChange={(event) => setRelationshipGoal(event.target.value)}
                className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
              >
                <option value="">선택 안함</option>
                <option value="가볍게">가볍게</option>
                <option value="진지하게">진지하게</option>
                <option value="아직 모름">아직 모름</option>
              </select>
            </label>
          </div>
          {basicInfoError ? (
            <p className="mt-4 rounded-lg border border-[#efbfca] bg-[#fff4f6] px-3 py-2 text-sm text-[#9f4256]">
              {basicInfoError}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={startQuestionFlow}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              질문 시작하기
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--ink-dim)] transition hover:bg-[var(--soft-accent)]"
            >
              입력 초기화
            </button>
          </div>
        </section>
      ) : null}

      {step === "questions" ? (
        <section className="mt-5 space-y-4">
          <header className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--ink-faint)]">STEP 2 · 질문 진행</p>
            <div className="mt-2 flex items-center justify-between text-sm text-[var(--ink-dim)]">
              <span>
                질문 {questionIndex + 1} / {QUESTIONS.length}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--soft-accent)]">
              <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </header>

          <article className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)] md:p-6">
            <div className="mb-4 flex flex-wrap gap-2 text-xs text-[var(--ink-faint)]">
              <span className="rounded-full bg-white px-3 py-1">남자: {maleName}</span>
              <span className="rounded-full bg-white px-3 py-1">여자: {femaleName}</span>
              <span className="rounded-full bg-white px-3 py-1">관계 단계: {relationStage}</span>
            </div>
            <p className="text-xs font-semibold tracking-wide text-[var(--ink-faint)]">
              {currentQuestion.id} · {DOMAIN_NAME[currentQuestion.domain]}
            </p>
            <h2 className="mt-2 text-xl font-semibold leading-snug text-[var(--ink-strong)] md:text-2xl">
              {currentQuestion.prompt}
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
                남자 답변
                <select
                  value={currentAnswer.male ?? ""}
                  onChange={(event) => handleValueChange(currentQuestion.id, "male", event.target.value)}
                  className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
                >
                  <option value="">선택하세요</option>
                  {currentQuestion.options.map((option, index) => (
                    <option key={`${currentQuestion.id}_male_${index}`} value={index}>
                      {index} · {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-1 text-sm text-[var(--ink-dim)]">
                여자 답변
                <select
                  value={currentAnswer.female ?? ""}
                  onChange={(event) => handleValueChange(currentQuestion.id, "female", event.target.value)}
                  className="h-10 rounded-lg border border-[var(--line)] bg-white px-3 text-[var(--ink)]"
                >
                  <option value="">선택하세요</option>
                  {currentQuestion.options.map((option, index) => (
                    <option key={`${currentQuestion.id}_female_${index}`} value={index}>
                      {index} · {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {questionError ? (
              <p className="mt-4 rounded-lg border border-[#efbfca] bg-[#fff4f6] px-3 py-2 text-sm text-[#9f4256]">
                {questionError}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={goToPreviousQuestion}
                disabled={questionIndex === 0}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--ink-dim)] transition hover:bg-[var(--soft-accent)] disabled:cursor-not-allowed disabled:opacity-55"
              >
                이전 질문
              </button>
              <button
                type="button"
                onClick={goToNextQuestion}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:brightness-95"
              >
                {questionIndex === QUESTIONS.length - 1 ? "궁합 결과 보기" : "다음 질문"}
              </button>
              <button
                type="button"
                onClick={() => setStep("basic")}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--ink-dim)] transition hover:bg-[var(--soft-accent)]"
              >
                기본정보 수정
              </button>
            </div>
          </article>
        </section>
      ) : null}

      {step === "result" && result ? (
        <section className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[var(--shadow-soft)] md:p-6">
          <header className="border-b border-[var(--line)] pb-4">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--ink-faint)]">RESULT</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--ink-strong)] md:text-3xl">
              {maleName} · {femaleName} 궁합 결과
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-dim)]">
              총점 <span className="font-semibold text-[var(--ink-strong)]">{result.totalScore}</span>점 · 등급{" "}
              <span className="font-semibold text-[var(--ink-strong)]">{result.grade}</span> · 유형{" "}
              <span className="font-semibold text-[var(--ink-strong)]">{result.type}</span>
            </p>
            <p className="mt-2 text-sm text-[var(--ink-dim)]">
              관계 단계: {relationStage}
              {meetingChannel ? ` · 만남 경로: ${meetingChannel}` : ""}
              {relationshipGoal ? ` · 관계 목표: ${relationshipGoal}` : ""}
            </p>
          </header>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {(Object.entries(result.domainScores) as [Domain, number][]).map(([domain, score]) => (
              <article key={domain} className="rounded-xl border border-[var(--line)] bg-white p-3">
                <p className="text-xs text-[var(--ink-faint)]">{DOMAIN_NAME[domain]}</p>
                <p className="mt-1 text-xl font-semibold text-[var(--ink-strong)]">{score}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <h3 className="text-lg font-semibold text-[var(--ink-strong)]">강점</h3>
              <ul className="mt-2 space-y-2 text-sm text-[var(--ink-dim)]">
                {result.highlights.map((text) => (
                  <li key={text}>- {text}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <h3 className="text-lg font-semibold text-[var(--ink-strong)]">주의 포인트</h3>
              <ul className="mt-2 space-y-2 text-sm text-[var(--ink-dim)]">
                {result.risks.map((text) => (
                  <li key={text}>- {text}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-[var(--line)] bg-white p-4">
              <h3 className="text-lg font-semibold text-[var(--ink-strong)]">실행 팁</h3>
              <ul className="mt-2 space-y-2 text-sm text-[var(--ink-dim)]">
                {result.actionTips.map((text) => (
                  <li key={text}>- {text}</li>
                ))}
              </ul>
            </article>
          </div>

          <article className="mt-4 rounded-2xl border border-[var(--line)] bg-white p-4">
            <h3 className="text-lg font-semibold text-[var(--ink-strong)]">추천 데이트 스타일</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">{result.recommendedDateStyle}</p>
          </article>

          <article className="mt-3 rounded-2xl border border-[var(--line)] bg-white p-4">
            <h3 className="text-lg font-semibold text-[var(--ink-strong)]">갈등 매뉴얼</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-dim)]">{result.conflictManual}</p>
          </article>

          <p className="mt-4 text-xs text-[var(--ink-faint)]">
            본 결과는 재미와 점검 목적의 참고 자료입니다. 실제 관계는 대화와 경험을 바탕으로 유연하게 조정해 주세요.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={restartQuestions}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:brightness-95"
            >
              질문 다시 하기
            </button>
            <button
              type="button"
              onClick={() => setStep("questions")}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--ink-dim)] transition hover:bg-[var(--soft-accent)]"
            >
              답변 수정하기
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--ink-dim)] transition hover:bg-[var(--soft-accent)]"
            >
              처음부터 다시
            </button>
          </div>
        </section>
      ) : null}
    </main>
  );
}
