import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";

import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";
import "./globals.css";

const bodySans = Noto_Sans_KR({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const titleSerif = Noto_Serif_KR({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wedding-evee.example"),
  title: {
    default: "Wedding Evee | 웨딩박람회 일정",
    template: "%s | Wedding Evee",
  },
  description: "전국 웨딩박람회 일정과 무료초대권 신청 링크를 지역별로 빠르게 확인하세요.",
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
      <body className={`${bodySans.variable} ${titleSerif.variable} bg-[var(--bg)] text-[var(--ink)] antialiased`}>
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
