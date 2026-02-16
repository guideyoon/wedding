import { load } from "cheerio";
import type { AnyNode } from "domhandler";

import { parseDateRangeText } from "@/lib/date";
import { toAbsoluteUrl } from "@/lib/fetchWeddingSource";
import { toDataRegionKey } from "@/lib/regions";
import type { DataRegionKey } from "@/lib/types";

export interface ParsedEventCandidate {
  region: DataRegionKey;
  title: string;
  dateRangeText: string;
  startDate: string;
  endDate: string;
  venueText: string;
  detailUrl: string;
  heroImageUrl: string;
  badges: string[];
}

export interface ParsedSourceResult {
  generatedAt: string;
  regionHeroImages: Partial<Record<DataRegionKey, string>>;
  events: ParsedEventCandidate[];
}

const TITLE_KEYWORD_REGEX = /(웨딩|결혼|박람회|페어|허니문|스드메)/i;
const BADGE_PATTERNS = ["무료초대", "무료 초대", "초대권", "사전예약", "현장혜택"];

function cleanText(input: string): string {
  return input.replace(/\s+/g, " ").replace(/[|]/g, " ").trim();
}

function firstNonEmpty(values: Array<string | undefined | null>): string {
  for (const value of values) {
    if (value && value.trim()) {
      return cleanText(value);
    }
  }
  return "";
}

function extractDateRangeText(input: string): string {
  const match = input.match(
    /\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}[^0-9]*(?:[-~][^0-9]*)?\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}/,
  );
  if (match) {
    return cleanText(match[0]);
  }
  return "";
}

function extractVenueText(input: string): string {
  const lines = input.split(/[\n\r]/).map(cleanText).filter(Boolean);
  const venueLine =
    lines.find((line) => /(홀|센터|웨딩|호텔|컨벤션|코엑스|벡스코|주소|구|시)/.test(line)) ??
    "";
  return venueLine.slice(0, 120);
}

function extractBadges(input: string): string[] {
  const badges = BADGE_PATTERNS.filter((pattern) => input.includes(pattern));
  return [...new Set(badges)];
}

function detectRegionFromContext(input: string): DataRegionKey | null {
  return toDataRegionKey(input);
}

function getContextText(element: AnyNode, html$: ReturnType<typeof load>): string {
  const selfText = html$(element).text();
  const parentText = html$(element).parent().text();
  const cardText = html$(element).closest("li,article,div,section").text();
  return cleanText([selfText, parentText, cardText].join(" "));
}

function extractTitle(element: AnyNode, html$: ReturnType<typeof load>): string {
  const linkText = cleanText(html$(element).text());
  const card = html$(element).closest("li,article,div,section");
  const headingText = cleanText(card.find("h1,h2,h3,h4,strong,b").first().text());
  const imageAlt = cleanText(card.find("img[alt]").first().attr("alt") ?? "");
  const title = firstNonEmpty([linkText, headingText, imageAlt]);
  return title.slice(0, 120);
}

function extractImageUrl(element: AnyNode, html$: ReturnType<typeof load>, sourceUrl: string): string {
  const card = html$(element).closest("li,article,div,section");
  const direct = html$(element).find("img").first().attr("src");
  const inCard = card.find("img").first().attr("src");
  const picked = firstNonEmpty([direct, inCard]);
  return picked ? toAbsoluteUrl(picked, sourceUrl) : "";
}

function extractRegionHeroImages(
  html$: ReturnType<typeof load>,
  sourceUrl: string,
): Partial<Record<DataRegionKey, string>> {
  const result: Partial<Record<DataRegionKey, string>> = {};
  const images = html$("img[src]").toArray();

  for (const imageElement of images) {
    const src = html$(imageElement).attr("src");
    if (!src) {
      continue;
    }
    const context = cleanText(
      [
        html$(imageElement).attr("alt"),
        html$(imageElement).attr("title"),
        html$(imageElement).closest("section,div,li,article").text(),
      ]
        .filter(Boolean)
        .join(" "),
    );
    const region = detectRegionFromContext(context);
    if (region && !result[region]) {
      result[region] = toAbsoluteUrl(src, sourceUrl);
    }
  }

  return result;
}

export function parseWeddingSource(html: string, sourceUrl: string): ParsedSourceResult {
  const html$ = load(html);
  const anchors = html$("a[href]").toArray();
  const events: ParsedEventCandidate[] = [];
  const dedupe = new Set<string>();

  for (const anchor of anchors) {
    const href = html$(anchor).attr("href");
    if (!href) {
      continue;
    }
    if (!href.includes("intros") && !href.includes("wedding")) {
      continue;
    }

    const title = extractTitle(anchor, html$);
    if (!title || !TITLE_KEYWORD_REGEX.test(title)) {
      continue;
    }

    const detailUrl = toAbsoluteUrl(href, sourceUrl);
    const contextText = getContextText(anchor, html$);
    const region = detectRegionFromContext(contextText) ?? "etc";
    const dateRangeText = extractDateRangeText(contextText);
    const parsedRange = parseDateRangeText(dateRangeText);
    const venueText = extractVenueText(contextText);
    const badges = extractBadges(contextText);
    const heroImageUrl = extractImageUrl(anchor, html$, sourceUrl);

    const dedupeKey = `${detailUrl}|${title}`;
    if (dedupe.has(dedupeKey)) {
      continue;
    }
    dedupe.add(dedupeKey);

    events.push({
      region,
      title,
      dateRangeText,
      startDate: parsedRange?.startDate ?? "",
      endDate: parsedRange?.endDate ?? "",
      venueText,
      detailUrl,
      heroImageUrl,
      badges,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    regionHeroImages: extractRegionHeroImages(html$, sourceUrl),
    events,
  };
}

export function parseHeroImageFromDetailHtml(detailHtml: string, sourceUrl: string): string {
  const html$ = load(detailHtml);
  const image = html$("img[src]")
    .toArray()
    .map((element) => html$(element).attr("src") ?? "")
    .find((src) => !!src && !src.startsWith("data:"));
  return image ? toAbsoluteUrl(image, sourceUrl) : "";
}
