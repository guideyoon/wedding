# Wedding Evee

`wedding.md` 요구사항 기반 웨딩박람회 디렉터리 프로젝트입니다.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Cheerio (수집 파서)

## 주요 경로

- `/`, `/wedding`: 전국 리스트
- `/wedding/[region]`: 지역 상세
- `/tarot`, `/match`: Coming Soon
- `/go/[eventId]`: CPA 중간 리다이렉트
- `/go/unavailable`: 미등록 CPA 안내
- `/api/cron/sync-wedding`: 소스 수집/동기화
- `/api/track`: 트래킹 수집

## 로컬 실행

```bash
npm run dev
```

## 수집 수동 실행

```bash
curl "http://localhost:3000/api/cron/sync-wedding?secret=YOUR_CRON_SECRET"
```

## 환경 변수

- `CRON_SECRET`: cron 동기화 보호용 시크릿
- `WEDDING_SOURCE_URL`: 소스 URL (기본: replyalba weddingA)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` 또는 `GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID` 또는 `META_PIXEL_ID`
- `NEXT_PUBLIC_CARD_WHOLE_CLICK_CPA`: `true`일 때 카드 전체 클릭 CPA 활성화

## 데이터 파일

- `public/data/wedding.json`
  초기 데이터 저장 및 빌드 시 정적 로딩에 사용됩니다.

