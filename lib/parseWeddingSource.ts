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

const TITLE_KEYWORD_REGEX = /(wedding|fair|expo|\uc6e8\ub529|\uacb0\ud63c|\ubc15\ub78c\ud68c|\ud398\uc5b4|\ud5c8\ub2c8\ubb38|\uc2a4\ub4dc\uba54)/i;
const BADGE_PATTERNS = [
  "\ubb34\ub8cc\ucd08\ub300",
  "\ubb34\ub8cc \ucd08\ub300",
  "\ucd08\ub300\uad8c",
  "\uc0ac\uc804\uc608\uc57d",
  "\ud604\uc7a5\ud61c\ud0dd",
];

const SECTION_REGION_MAP: Record<string, DataRegionKey> = {
  sec1: "seoul",
  sec2: "gyeonggi",
  sec3: "incheon",
  sec4: "busan",
  sec5: "chungcheong",
  sec6: "jeolla",
  sec7: "gangwon",
  sec8: "gyeongsang",
  sec9: "jeju",
  sec10: "etc",
};

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
  const rangeMatch = input.match(
    /\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}[^0-9]{0,10}[-~][^0-9]{0,10}\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}/,
  );
  if (rangeMatch) {
    return cleanText(rangeMatch[0]);
  }

  const singleMatch = input.match(/\d{4}[.\-/]\d{1,2}[.\-/]\d{1,2}/);
  if (singleMatch) {
    return cleanText(singleMatch[0]);
  }

  return "";
}

function extractVenueText(input: string): string {
  const lines = input.split(/[\n\r]/).map(cleanText).filter(Boolean);
  const venueLine =
    lines.find((line) =>
      /(\ud638\ud154|\uc13c\ud130|\uc6e8\ub529|\ucee8\ubca4\uc158|\ucf54\uc5d1\uc2a4|\ubca1\uc2a4\ucf54|\uc8fc\uc18c|\uad6c|\uc2dc)/.test(line),
    ) ?? "";
  return venueLine.slice(0, 160);
}

function extractBadges(input: string): string[] {
  const badges = BADGE_PATTERNS.filter((pattern) => input.includes(pattern));
  return [...new Set(badges)];
}

function detectRegionFromContext(input: string): DataRegionKey | null {
  return toDataRegionKey(input);
}

function detectRegionFromSection(sectionElement: AnyNode, html$: ReturnType<typeof load>): DataRegionKey {
  const id = html$(sectionElement).attr("id")?.trim() ?? "";
  if (id && SECTION_REGION_MAP[id]) {
    return SECTION_REGION_MAP[id];
  }

  const heading = cleanText(html$(sectionElement).find("h2").first().text());
  return detectRegionFromContext(heading) ?? "etc";
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

function parseSectionCards(html: string, sourceUrl: string): {
  events: ParsedEventCandidate[];
  regionHeroImages: Partial<Record<DataRegionKey, string>>;
} {
  const html$ = load(html);
  const events: ParsedEventCandidate[] = [];
  const regionHeroImages: Partial<Record<DataRegionKey, string>> = {};
  const dedupe = new Set<string>();

  const sectionNodes = html$("div.contents[id^='sec']").toArray();

  for (const sectionNode of sectionNodes) {
    const region = detectRegionFromSection(sectionNode, html$);
    const cardNodes = html$(sectionNode).find("ul.list1").toArray();

    for (const cardNode of cardNodes) {
      const card = html$(cardNode);
      const anchor = card.parent("a[href]").first();

      const title = cleanText(card.find(".naming").first().text());
      const dateRangeText = cleanText(card.find(".time").first().text());
      const venueText = cleanText(card.find(".area").first().text());
      const detailHref = cleanText(anchor.attr("href") ?? "");
      const detailUrl = detailHref ? toAbsoluteUrl(detailHref, sourceUrl) : "";
      const imageSrc = cleanText(card.find("img[src]").first().attr("src") ?? "");
      const heroImageUrl = imageSrc ? toAbsoluteUrl(imageSrc, sourceUrl) : "";
      const contextText = cleanText(`${title} ${dateRangeText} ${venueText}`);
      const parsedRange = parseDateRangeText(dateRangeText || extractDateRangeText(contextText));
      const badges = extractBadges(contextText);

      if (!title || !dateRangeText || !venueText) {
        continue;
      }

      const dedupeKey = `${region}|${title}|${dateRangeText}|${venueText}`;
      if (dedupe.has(dedupeKey)) {
        continue;
      }
      dedupe.add(dedupeKey);

      if (!regionHeroImages[region] && heroImageUrl) {
        regionHeroImages[region] = heroImageUrl;
      }

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
  }

  return { events, regionHeroImages };
}

function parseWithGenericAnchorStrategy(html: string, sourceUrl: string): {
  events: ParsedEventCandidate[];
  regionHeroImages: Partial<Record<DataRegionKey, string>>;
} {
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
    events,
    regionHeroImages: extractRegionHeroImages(html$, sourceUrl),
  };
}

export function parseWeddingSource(html: string, sourceUrl: string): ParsedSourceResult {
  const structured = parseSectionCards(html, sourceUrl);
  if (structured.events.length > 0) {
    return {
      generatedAt: new Date().toISOString(),
      regionHeroImages: structured.regionHeroImages,
      events: structured.events,
    };
  }

  const fallback = parseWithGenericAnchorStrategy(html, sourceUrl);
  return {
    generatedAt: new Date().toISOString(),
    regionHeroImages: fallback.regionHeroImages,
    events: fallback.events,
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
