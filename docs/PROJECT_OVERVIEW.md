# 프로젝트 개요

## 1. 목적

Wedding damoa는 전국 웨딩 박람회 일정을 지역별로 빠르게 보여주고, 사용자가 CPA 링크로 자연스럽게 이동하도록 설계된 서비스입니다.

- 핵심 목표: 정보 탐색 시간을 줄이고 CPA 클릭 전환을 높이는 것
- 주요 사용자: 결혼 준비 단계의 모바일 중심 사용자
- 데이터 소스: `replyalba` 웨딩 소개 페이지 크롤링

## 2. 핵심 기능

1. 지역별 웨딩 박람회 목록 제공 (`/wedding/[region]`)
2. 필터/검색/정렬 기반 빠른 탐색
3. 이벤트별 CPA 브릿지 라우트 (`/go/[eventId]`)
4. 크롤러 동기화 엔드포인트 (`/api/cron/sync-wedding`)
5. 추적 이벤트 수집 (`/api/track`)
6. SEO 대응 (`sitemap.xml`, `robots.txt`, 구조화 데이터)

## 3. 시스템 구조

### 3.1 프론트엔드

- Next.js App Router 기반 SSR/CSR 혼합
- 주요 컴포넌트
  - `TopNav`, `RegionTabs`, `HeroSection`
  - `FilterBar`, `EventList`, `EventCard`
  - `StickyCtaBar`, `Footer`

### 3.2 데이터 계층

- 저장소: `public/data/wedding.json`
- 읽기/쓰기:
  - `lib/data/readWeddingData.ts`
  - `lib/data/writeWeddingData.ts`
- 정규화/필터링:
  - `lib/normalizeWeddingData.ts`
  - `lib/filterEvents.ts`

### 3.3 수집 파이프라인

1. 소스 HTML 수집 (`lib/fetchWeddingSource.ts`)
2. 이벤트 후보 파싱 (`lib/parseWeddingSource.ts`)
3. 기존 데이터와 병합/정규화 (`lib/normalizeWeddingData.ts`)
4. JSON 저장 (`lib/data/writeWeddingData.ts`)
5. 동기화 API 노출 (`app/api/cron/sync-wedding/route.ts`)

### 3.4 전환/추적

- 전환 경로
  - 목록 CTA 클릭 -> `/go/[eventId]` -> 실제 CPA URL 리다이렉트
- 추적
  - `view_region`
  - `click_cpa`
  - `filter_apply`
- 구현 파일
  - `lib/tracking.ts`
  - `app/api/track/route.ts`
  - `lib/cpa/buildCpaUrl.ts`

## 4. 디렉터리 구조

```text
app/
  api/
    cron/sync-wedding/route.ts
    track/route.ts
  go/[eventId]/route.ts
  go/unavailable/page.tsx
  wedding/page.tsx
  wedding/[region]/page.tsx
  layout.tsx
  page.tsx
  sitemap.ts
  robots.ts

components/
  TopNav.tsx
  RegionTabs.tsx
  HeroSection.tsx
  FilterBar.tsx
  EventList.tsx
  EventCard.tsx
  StickyCtaBar.tsx
  Footer.tsx

lib/
  data/
    readWeddingData.ts
    writeWeddingData.ts
  cpa/buildCpaUrl.ts
  fetchWeddingSource.ts
  parseWeddingSource.ts
  normalizeWeddingData.ts
  filterEvents.ts
  tracking.ts
  types.ts

public/
  data/wedding.json
  images/region-fallback/*.svg
```

## 5. 작업 내용 요약

### 완료된 작업

1. Next.js 기반 초기 프로젝트 세팅
2. 요구사항 기반 IA/라우팅 구성
3. 지역 탭 + 히어로 + 카드 리스트 중심 UI 구현
4. 필터/검색/정렬 기능 구현
5. CPA 브릿지(`/go/[eventId]`) 구현
6. 크롤러 동기화 API(`sync-wedding`) 구현
7. 트래킹 이벤트 및 수집 API 구현
8. SEO 기본 구성(sitemap, robots, JSON-LD) 반영
9. Cloudflare Workers(OpenNext) 배포 설정 반영

### 배포 전 체크포인트

1. 실제 CPA URL 데이터 반영 여부
2. `CRON_SECRET` 및 분석 도구 환경 변수 설정
3. Cloudflare Workers Builds 명령 확인
   - Build: `npx opennextjs-cloudflare build`
   - Deploy: `npx wrangler deploy`

## 6. 운영 메모

- 크롤링 실패 시 기존 JSON을 유지하도록 설계되어 빈 화면 리스크를 낮춤
- CPA URL 미등록 이벤트는 안내 페이지로 우회 처리
- 향후 데이터 볼륨 증가 시 KV/R2/D1 등 Cloudflare 스토리지로 확장 가능

