"use client";

import Loading from "@/app/loading";
import RequestEquipmentsForm from "@/components/forms/EquipmentRequestForm";
import { useEvent } from "@/hooks/useEvent";

import { useSearchParams } from "next/navigation";

export default function RequestPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const { event, loading } = useEvent(eventId as string);

  if (loading) return <Loading />;
  if (!event) return;

  return (
    <main>
      <p className="text-foreground/50 text-sm">For {event.summary}</p>
      <RequestEquipmentsForm eventId={event.id} />
    </main>
  );
}
