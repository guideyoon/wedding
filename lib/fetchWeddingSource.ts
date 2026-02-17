const DEFAULT_SOURCE_URL = "https://replyalba.com/intros/weddingA/";

function toAbsoluteUrl(input: string, baseUrl: string): string {
  try {
    return new URL(input, baseUrl).toString();
  } catch {
    return input;
  }
}

export function getWeddingSourceUrl(): string {
  return process.env.WEDDING_SOURCE_URL ?? DEFAULT_SOURCE_URL;
}

export async function fetchWeddingSourceHtml(): Promise<{ html: string; sourceUrl: string }> {
  const sourceUrl = getWeddingSourceUrl();
  const response = await fetch(sourceUrl, {
    cache: "no-store",
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; WeddingDamoaBot/1.0; +https://wedding-damoa.example)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch source page: ${response.status}`);
  }

  return { html: await response.text(), sourceUrl };
}

export async function fetchDetailHtml(detailUrl: string, sourceUrl: string): Promise<string | null> {
  const absoluteUrl = toAbsoluteUrl(detailUrl, sourceUrl);
  try {
    const response = await fetch(absoluteUrl, {
      cache: "no-store",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; WeddingDamoaBot/1.0; +https://wedding-damoa.example)",
      },
    });

    if (!response.ok) {
      return null;
    }
    return await response.text();
  } catch {
    return null;
  }
}

export { toAbsoluteUrl };

