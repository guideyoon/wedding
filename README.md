# Wedding Evee

Wedding fair directory app based on `sample/wedding.md`.

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Cheerio (source parsing)
- OpenNext for Cloudflare Workers
- Wrangler

## App routes

- `/`, `/wedding`: all regions list
- `/wedding/[region]`: region detail
- `/tarot`, `/match`: coming soon
- `/go/[eventId]`: CPA redirect bridge
- `/go/unavailable`: fallback page when CPA URL is missing
- `/api/cron/sync-wedding`: crawl and sync endpoint
- `/api/track`: tracking ingest endpoint

## Local development

```bash
npm run dev
```

## Cloudflare Workers deployment (OpenNext)

This repository is configured for Workers builds.

- Root directory: `web`
- Deploy command: `npm run deploy`
- Config file: `wrangler.jsonc`

Worker build scripts:

```bash
npm run preview
npm run deploy
```

## Required environment variables

- `CRON_SECRET`
- `WEDDING_SOURCE_URL` (default source: replyalba weddingA)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_META_PIXEL_ID` or `META_PIXEL_ID`
- `NEXT_PUBLIC_CARD_WHOLE_CLICK_CPA` (`true` to enable full-card click to CPA)

## Data file

- `public/data/wedding.json`

