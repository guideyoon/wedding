import { EventCard } from "@/components/EventCard";
import type { RegionKey, WeddingEvent } from "@/lib/types";

interface EventListProps {
  events: WeddingEvent[];
  regionForTracking: RegionKey;
}

export function EventList({ events, regionForTracking }: EventListProps) {
  if (events.length === 0) {
    return (
      <section
        id="event-list"
        className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper)] p-8 text-center text-sm text-[var(--ink-dim)]"
      >
        조건에 맞는 박람회가 없습니다. 필터를 해제하거나 다른 지역을 선택해 주세요.
      </section>
    );
  }

  return (
    <section id="event-list" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} position={index + 1} regionForTracking={regionForTracking} />
      ))}
    </section>
  );
}

