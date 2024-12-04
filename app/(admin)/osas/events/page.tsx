import { getCalendarID } from "@/actions/event.action";
import { CalendarIDForm } from "@/components/forms/CalendarIDForm";
import { Suspense } from "react";
import { Events } from "./Events";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Loading from "@/components/Loading";

export default async function EventsPage() {
  const calendarID = await getCalendarID();
  return (
    <main className="p-10 space-y-10">
      {calendarID && (
        <Suspense fallback={<Loading />}>
          <div className="flex gap-4 items-center">
            <Button asChild>
              <Link href="/osas/events/create">Create Event</Link>
            </Button>
            <h1 className="text-2xl font-bold text-primary">Events</h1>
          </div>
          <Events calendarID={calendarID} />
        </Suspense>
      )}
      <CalendarIDForm defaultID={calendarID} />
      <section>
        <iframe
          className="m-auto"
          src="https://calendar.google.com/calendar/embed?src=2e2cb7d4edcd3965c29b36abe0b2156cdd0740b91e4ceef8e341b8f5b83e45ea%40group.calendar.google.com&ctz=Asia%2FManila"
          width="800"
          height="600"
          scrolling="no"
        ></iframe>
      </section>
    </main>
  );
}
