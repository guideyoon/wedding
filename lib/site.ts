const FALLBACK_SITE_URL = "http://localhost:3000";

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
    return FALLBACK_SITE_URL;
  }
}

export function getSiteUrl(): string {
  const configured = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ].find((value): value is string => Boolean(value && value.trim().length > 0));

  if (!configured) {
    return FALLBACK_SITE_URL;
  }

  return normalizeSiteUrl(withProtocol(configured.trim()));
}
