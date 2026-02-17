const FALLBACK_SITE_URL = "https://wedding-evee.example";

function normalizeSiteUrl(candidate: string): string {
  try {
    const parsed = new URL(candidate);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (!configured) {
    return FALLBACK_SITE_URL;
  }
  return normalizeSiteUrl(configured);
}
