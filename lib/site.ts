const DEV_FALLBACK_SITE_URL = "http://localhost:3000";
const PROD_FALLBACK_SITE_URL = "https://weddingdamoa.com";

function getFallbackSiteUrl(): string {
  return process.env.NODE_ENV === "production" ? PROD_FALLBACK_SITE_URL : DEV_FALLBACK_SITE_URL;
}

function withProtocol(candidate: string): string {
  return /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
}

function normalizeSiteUrl(candidate: string): string {
  try {
    const parsed = new URL(candidate);
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/+$/, "");
  } catch {
    return getFallbackSiteUrl();
  }
}

export function getSiteUrl(): string {
  const configured = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.CF_PAGES_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ].find((value): value is string => Boolean(value && value.trim().length > 0));

  if (!configured) {
    return getFallbackSiteUrl();
  }

  return normalizeSiteUrl(withProtocol(configured.trim()));
}
