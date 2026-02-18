import type { Metadata } from "next";
import Script from "next/script";

import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Wedding damoa | 웨딩박람회 일정",
    template: "%s | Wedding damoa",
  },
  description: "전국 웨딩박람회 일정과 무료초대권 신청 링크를 지역별로 빠르게 확인하세요.",
  verification: {
    other: {
      "naver-site-verification": "78ff458b24dc66dd833f1406a14516ec338455f0",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaMeasurementId =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? process.env.GA_MEASUREMENT_ID ?? "";
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? process.env.META_PIXEL_ID ?? "";

  return (
    <html lang="ko">
      <body className="bg-[var(--bg)] text-[var(--ink)] antialiased">
        <TopNav />
        {children}
        <Footer />
      </body>
      {gaMeasurementId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');`}
          </Script>
        </>
      ) : null}
      {metaPixelId ? (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
        </Script>
      ) : null}
    </html>
  );
}
