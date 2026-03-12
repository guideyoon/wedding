# Wedding damoa

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

## 자동 동기화/알림 (GitHub Actions)

- 워크플로우: `.github/workflows/sync-wedding.yml`
- 실행 주기: 매 정각(UTC 기준, hourly)
- 필요 Secrets:
  - `SYNC_URL` (예: `https://weddingdamoa.com`)
  - `CRON_SECRET` (`/api/cron/sync-wedding` 인증용)
  - `CPA_ALERT_WEBHOOK_URL` (선택, 실패/CPA 누락 시 webhook 전송 - Google Chat incoming webhook 가능)

동기화 API 응답에 `cpa.missing`이 1개 이상이면 워크플로우를 실패 처리해서 즉시 감지할 수 있습니다.
또한 replyalba 상세페이지의 `input[name="adData"]` 값이 이전 스냅샷과 달라지면 source-side CPA 변경 가능성으로 간주해 워크플로우를 실패 처리합니다.
외부 webhook을 쓸 수 없는 환경이라도, 실패 시 GitHub Issue를 자동 생성/갱신해서 저장소 알림과 이메일 알림으로 바로 확인할 수 있습니다.

## 데이터 파일

- `public/data/wedding.json`
