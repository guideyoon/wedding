import { getSiteUrl } from "@/lib/site";

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, "");
}

export function GET() {
  const siteUrl = normalizeSiteUrl(getSiteUrl());

  const robotsText = [
    "#DaumWebMasterTool:fa6c103b27ed821bdd18e37ace0386b311fd3d2edfd8b6282f7c0cd0930ecdbd:DaVRQ9e3Dp2Y906PSz1IAQ==",
    "User-agent: Yeti",
    "Allow: /",
    "",
    "User-agent: *",
    "Allow: /",
    "Allow: /wedding",
    "Allow: /wedding/*",
    "Allow: /tarot",
    "Allow: /match",
    "Allow: /tips",
    "Allow: /privacy",
    "Allow: /terms",
    "Disallow: /api/",
    "Disallow: /go/",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    `Sitemap: ${siteUrl}/rss.xml`,
    "",
  ].join("\n");

  return new Response(robotsText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
