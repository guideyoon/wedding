import type { WeddingEvent } from "@/lib/types";

interface EventStructuredDataProps {
  events: WeddingEvent[];
}

export function EventStructuredData({ events }: EventStructuredDataProps) {
  const itemList = events.slice(0, 20).map((event) => ({
    "@type": "Event",
    name: event.title,
    startDate: event.startDate || undefined,
    endDate: event.endDate || undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venueText,
    },
    image: event.heroImageUrl ? [event.heroImageUrl] : undefined,
    url: event.detailUrl,
  }));

  const payload = {
    "@context": "https://schema.org",
    "@graph": itemList,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload),
      }}
    />
  );
}

