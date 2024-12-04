import { EventForm } from "@/components/forms/EventForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EventCreatePage() {
  return (
    <main className="p-10">
      <Button asChild variant="link">
        <Link href="/osas/events">Back</Link>
      </Button>
      <h1 className="text-lg font-bold text-primary mb-4">Create Event</h1>
      <EventForm />
    </main>
  );
}
