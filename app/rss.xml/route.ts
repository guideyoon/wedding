import { readWeddingData } from "@/lib/data/readWeddingData";
import { getSiteUrl } from "@/lib/site";
import type { WeddingEvent } from "@/lib/types";

const RSS_ITEM_LIMIT = 40;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toUtcString(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toUTCString();
  }
  return date.toUTCString();
}

function buildEventPageUrl(baseUrl: string, event: WeddingEvent): string {
  return `${baseUrl}/wedding/${event.region}`;
}

function buildItemXml(baseUrl: string, event: WeddingEvent): string {
  const link = buildEventPageUrl(baseUrl, event);
  const title = escapeXml(event.title);
  const description = escapeXml(`${event.dateRangeText} | ${event.venueText}`);
  const guid = escapeXml(`${siteUrlWithoutTrailingSlash(baseUrl)}#${event.id}`);

  return [
    "    <item>",
    `      <title>${title}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid isPermaLink=\"false\">${guid}</guid>`,
    `      <description>${description}</description>`,
    `      <pubDate>${toUtcString(event.updatedAt)}</pubDate>`,
    `      <category>${escapeXml(event.region)}</category>`,
    "    </item>",
  ].join("\n");
}

function siteUrlWithoutTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

export async function GET() {
  const siteUrl = siteUrlWithoutTrailingSlash(getSiteUrl());
  const dataset = await readWeddingData();

  const latestEvents = dataset.regions
    .flatMap((region) => region.events)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, RSS_ITEM_LIMIT);

  const itemXml = latestEvents.length
    ? latestEvents.map((event) => buildItemXml(siteUrl, event)).join("\n")
    : [
        "    <item>",
        "      <title>Wedding damoa 업데이트</title>",
        `      <link>${escapeXml(`${siteUrl}/wedding`)}</link>`,
        `      <guid isPermaLink=\"true\">${escapeXml(`${siteUrl}/wedding`)}</guid>`,
        "      <description>최신 웨딩박람회 일정이 곧 반영됩니다.</description>",
        `      <pubDate>${toUtcString(dataset.generatedAt)}</pubDate>`,
        "    </item>",
      ].join("\n");

  const rssXml = [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<rss version=\"2.0\">",
    "  <channel>",
    "    <title>Wedding damoa 최신 웨딩박람회</title>",
    `    <link>${escapeXml(`${siteUrl}/wedding`)}</link>`,
    "    <description>전국 웨딩박람회 일정 업데이트 RSS 피드</description>",
    "    <language>ko-KR</language>",
    `    <lastBuildDate>${toUtcString(dataset.generatedAt)}</lastBuildDate>`,
    "    <ttl>60</ttl>",
    itemXml,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
