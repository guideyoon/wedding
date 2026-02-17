# 궁합보기 서비스 남자 여자 각각 응답형

## 목적
같은 질문을 남자와 여자가 각각 답하고 두 답변 차이로 궁합 점수와 해석을 제공합니다

## 입력 항목
### 필수
- male_name 문자열 1자 이상 20자 이하
- female_name 문자열 1자 이상 20자 이하
- male_birthdate 날짜 YYYY-MM-DD
- female_birthdate 날짜 YYYY-MM-DD
- relation_stage 선택값
  - 썸
  - 연애
  - 결혼 또는 동거
- disclosure_level 선택값
  - 재미로만 보기
  - 관계 점검용
  - 상담 참고용

### 선택
- meeting_channel 선택값
  - 지인 소개
  - 직장 또는 학교
  - 온라인
  - 기타
- relationship_goal 선택값
  - 가볍게
  - 진지하게
  - 아직 모름

## 화면 구성 방식
- 각 질문 카드 1개
- 카드 안에 선택 영역 2개
  - 남자 답변 선택
  - 여자 답변 선택
- 각 선택 영역은 3지선다 라디오 또는 셀렉트로 구성
- 저장 값은 0 1 2 정수

## 질문 10가지
- 문항 공통 저장 필드
  - q_id
  - domain
  - male_value 0 1 2
  - female_value 0 1 2

### Q1 연락 빈도 선호 domain communication
- 질문
  - 하루 연락 빈도 관련 선호가 무엇입니까
- 선택지
  - 0 필요한 내용 중심으로 간단히
  - 1 여유 시간에 적당히
  - 2 자주 짧게라도 계속

### Q2 애정 표현 방식 domain affection
- 질문
  - 애정 표현 방식 선호가 무엇입니까
- 선택지
  - 0 말보다 행동 중심
  - 1 말과 행동 균형
  - 2 말로 자주 표현

### Q3 갈등 발생 시 첫 반응 domain conflict
- 질문
  - 다툼이 생겼을 때 첫 반응이 무엇입니까
- 선택지
  - 0 잠깐 정리 후 대화
  - 1 바로 대화로 해결
  - 2 시간 필요 후 대화

### Q4 사과와 화해 방식 domain conflict
- 질문
  - 화해가 잘 되기 위한 방식 선호가 무엇입니까
- 선택지
  - 0 원인 정리 후 약속 정하기
  - 1 감정 공감과 안심 우선
  - 2 분위기 풀고 자연 회복

### Q5 데이트 스타일 domain lifestyle
- 질문
  - 데이트 선호가 무엇입니까
- 선택지
  - 0 집 근처 편한 코스
  - 1 가끔 이벤트 코스
  - 2 새로운 곳 활동 중심

### Q6 주말 시간 배분 domain lifestyle
- 질문
  - 주말 시간 배분 선호가 무엇입니까
- 선택지
  - 0 혼자 회복 시간 필요
  - 1 반반 정도 선호
  - 2 함께 시간 우선

### Q7 소비 성향 domain finance
- 질문
  - 소비 성향이 무엇입니까
- 선택지
  - 0 절약과 계획 우선
  - 1 균형 소비
  - 2 경험 만족 우선

### Q8 돈 관련 공유 수준 domain finance
- 질문
  - 돈 관련 공유 수준 선호가 무엇입니까
- 선택지
  - 0 큰 틀만 공유
  - 1 주요 지출 계획 공유
  - 2 수입 지출 투명 공유

### Q9 가족과의 거리 domain values
- 질문
  - 가족 관련 경계 설정 선호가 무엇입니까
- 선택지
  - 0 서로 가족 영역 분리
  - 1 중요한 일만 논의
  - 2 자주 왕래 함께 챙김

### Q10 미래 계획 논의 속도 domain values
- 질문
  - 다음 단계 논의 속도 선호가 무엇입니까
- 선택지
  - 0 천천히 자연 진행
  - 1 시기 맞으면 논의 가능
  - 2 빠르게 방향 합의

## 점수 계산 방식
### 문항 점수
- d = 절대값 male_value - female_value
- item_score
  - d 0 점수 10
  - d 1 점수 6
  - d 2 점수 2

### 영역 가중치
- communication Q1 가중치 1.2
- affection Q2 가중치 1.1
- conflict Q3 Q4 가중치 1.3
- lifestyle Q5 Q6 가중치 1.0
- finance Q7 Q8 가중치 1.1
- values Q9 Q10 가중치 1.2

### 총점
- raw_sum = Σ item_score x weight
- raw_max = Σ 10 x weight
- total_score = 반올림 raw_sum / raw_max x 100

### 등급
- 90 이상 매우 높음
- 75 이상 높음
- 60 이상 보통
- 45 이상 주의
- 44 이하 관리 필요

## 결과 값 설계
### 결과 필드
- total_score 정수 0에서 100
- grade 문자열
  - 매우 높음
  - 높음
  - 보통
  - 주의
  - 관리 필요
- type 문자열
  - 안정형
  - 성장형
  - 열정형
  - 친구형
  - 롤러코스터형
- domain_scores 객체 0에서 100
  - communication
  - affection
  - conflict
  - lifestyle
  - finance
  - values
- highlights 배열 3개
- risks 배열 3개
- action_tips 배열 3개
- recommended_date_style 문자열
- conflict_manual 문자열 3문장 이내

### 타입 결정 규칙
- 안정형 conflict 75 이상 그리고 values 70 이상
- 성장형 total_score 70 이상 그리고 domain 최고점과 최저점 차이 25 이상
- 열정형 affection 80 이상 그리고 lifestyle 65 이하
- 친구형 communication 75 이상 그리고 affection 65 이하
- 롤러코스터형 conflict 55 이하 또는 values 55 이하

## 응답 저장 예시
{
  "male_name": "민수",
  "female_name": "지은",
  "relation_stage": "연애",
  "answers": [
    { "q_id": "Q1", "domain": "communication", "male_value": 2, "female_value": 1 },
    { "q_id": "Q2", "domain": "affection", "male_value": 1, "female_value": 1 },
    { "q_id": "Q3", "domain": "conflict", "male_value": 0, "female_value": 2 },
    { "q_id": "Q4", "domain": "conflict", "male_value": 1, "female_value": 1 },
    { "q_id": "Q5", "domain": "lifestyle", "male_value": 2, "female_value": 1 },
    { "q_id": "Q6", "domain": "lifestyle", "male_value": 1, "female_value": 0 },
    { "q_id": "Q7", "domain": "finance", "male_value": 0, "female_value": 1 },
    { "q_id": "Q8", "domain": "finance", "male_value": 1, "female_value": 2 },
    { "q_id": "Q9", "domain": "values", "male_value": 0, "female_value": 0 },
    { "q_id": "Q10", "domain": "values", "male_value": 1, "female_value": 1 }
  ]
}

## 결과 출력 예시
{
  "total_score": 73,
  "grade": "보통",
  "type": "성장형",
  "domain_scores": {
    "communication": 86,
    "affection": 78,
    "conflict": 58,
    "lifestyle": 70,
    "finance": 66,
    "values": 80
  },
  "highlights": [
    "대화 흐름이 잘 맞아 오해가 줄어듭니다",
    "애정 표현 균형이 비슷해 안정감이 생깁니다",
    "가족과 미래 방향 합의가 수월합니다"
  ],
  "risks": [
    "갈등 타이밍이 어긋나 감정이 쌓일 수 있습니다",
    "소비 기준 차이로 불편이 생길 수 있습니다",
    "휴식 방식 차이로 피로가 누적될 수 있습니다"
  ],
  "action_tips": [
    "갈등 관련 대화 시작 시간과 멈춤 신호를 정합니다",
    "고정 지출과 자유 지출 기준을 나눕니다",
    "함께 시간과 각자 회복 시간을 주간 단위로 배분합니다"
  ],
  "recommended_date_style": "편한 코스 중심으로 가끔 새 활동을 추가하는 방식",
  "conflict_manual": "감정이 올라오면 대화 시작 시간을 합의합니다. 쟁점 한 가지만 다룹니다. 합의 문장 한 줄로 마무리합니다"
}

## 안내
본 결과는 재미와 점검 목적 참고 자료입니다
실제 관계는 대화와 경험으로 조정하시면 됩니다
