import Image from "next/image";
import Link from "next/link";

import { CpaButton } from "@/components/CpaButton";
import { REGION_FALLBACK_IMAGES } from "@/lib/regions";
import type { RegionKey, WeddingEvent } from "@/lib/types";

interface EventCardProps {
  event: WeddingEvent;
  position: number;
  regionForTracking: RegionKey;
}

const WHOLE_CARD_CLICK_CPA = process.env.NEXT_PUBLIC_CARD_WHOLE_CLICK_CPA === "true";
const ALLOWED_IMAGE_HOSTS = new Set(["replyalba.com", "www.replyalba.com", "images.unsplash.com"]);

function toSafeImageSrc(event: WeddingEvent): string {
  const source = event.heroImageUrl?.trim();
  if (!source) {
    return REGION_FALLBACK_IMAGES[event.region];
  }

  if (source.startsWith("/")) {
    return source;
  }

  try {
    const parsed = new URL(source);
    if (parsed.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(parsed.hostname)) {
      return parsed.toString();
    }
  } catch {
    // Ignore invalid image URL and use fallback.
  }

  return REGION_FALLBACK_IMAGES[event.region];
}

export function EventCard({ event, position, regionForTracking }: EventCardProps) {
  const goHref = `/go/${event.id}?region=${event.region}&position=${position}`;
  const safeImageSrc = toSafeImageSrc(event);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[var(--shadow-soft)] transition hover:-translate-y-[1px] hover:shadow-lg">
      {WHOLE_CARD_CLICK_CPA ? (
        <Link href={goHref} className="absolute inset-0 z-10" aria-label={`${event.title} 신청하기`} />
      ) : null}

      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={safeImageSrc}
          alt={event.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={position <= 2}
        />
      </div>

      <div className="space-y-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {event.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-[var(--soft-accent)] px-2 py-1 text-[11px] font-medium text-[var(--ink-strong)]"
            >
              {badge}
            </span>
          ))}
        </div>
        <h3 className="line-clamp-2 text-[17px] font-semibold leading-snug text-[var(--ink-strong)]">
          {event.title}
        </h3>
        <p className="text-sm text-[var(--ink-dim)]">📅 {event.dateRangeText || "일정 확인 필요"}</p>
        <p className="line-clamp-2 text-sm text-[var(--ink-dim)]">📍 {event.venueText || "장소 정보 확인 필요"}</p>
        <div className="flex items-center justify-between gap-3 pt-1">
          <CpaButton href={goHref} region={regionForTracking} eventId={event.id} position={position} />
          <Link
            href={event.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-20 text-xs font-medium text-[var(--ink-faint)] underline-offset-2 hover:underline"
          >
            상세 보기
          </Link>
        </div>
      </div>
    </article>
  );
}

