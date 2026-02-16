# Wedding Evee

웨딩 박람회 일정 수집/노출 및 CPA 전환 최적화를 목표로 한 Next.js 기반 디렉터리 서비스입니다.

요구사항 원본: `sample/wedding.md`  
상세 개요 문서: `docs/PROJECT_OVERVIEW.md`

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Cheerio (수집 파서)
- OpenNext + Cloudflare Workers
- Wrangler

## 주요 라우트

- `/`, `/wedding`: 전국 웨딩 박람회 리스트
- `/wedding/[region]`: 지역별 리스트
- `/tarot`, `/match`: Coming Soon 페이지
- `/go/[eventId]`: CPA 리다이렉트 브릿지
- `/go/unavailable`: CPA 미등록 안내
- `/api/cron/sync-wedding`: 소스 수집/동기화
- `/api/track`: 트래킹 이벤트 수집

## 로컬 실행

```bash
npm install
npm run dev
```

## Cloudflare Workers 배포 (OpenNext)

이 저장소는 Workers 배포를 기본으로 설정되어 있습니다.

- Root directory: `.` (레포 루트)
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx wrangler deploy`
- 설정 파일: `wrangler.jsonc`

로컬 Worker 미리보기/배포 명령:

```bash
npm run preview
npm run deploy
```

## 필수 환경 변수

- `CRON_SECRET`
- `WEDDING_SOURCE_URL` (기본값: replyalba weddingA)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` 또는 `GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID` 또는 `META_PIXEL_ID`
- `NEXT_PUBLIC_CARD_WHOLE_CLICK_CPA` (`true` 시 카드 전체 클릭 CPA 활성화)

## 데이터 파일

- `public/data/wedding.json`
