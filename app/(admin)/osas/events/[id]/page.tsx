import { getEventById } from "@/actions/event.action";
import { EventForm } from "@/components/forms/EventForm";
import React from "react";
import Equipments from "../Equipments";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params) return null;

  const event = await getEventById(params.id);
  if (!event) return <>Event not found</>;
  const data = {
    ...event,
    location: event.location || "",
    start: new Date(event.start).toISOString().slice(0, 16),
    end: new Date(event.end).toISOString().slice(0, 16),
  };

  return (
    <main className="p-4">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 drop-shadow-md rounded-lg">
          <h1 className="text-primary font-bold text-2xl mb-10">Event</h1>
          <EventForm defaultValues={data} />
        </div>
        <div className="bg-white p-8 drop-shadow-md rounded-lg h-fit">
          <Equipments eventId={event.id} />
        </div>
      </section>
    </main>
  );
}
