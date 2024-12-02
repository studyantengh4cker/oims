import { getEvents } from "@/actions/event.action";
import { EventsTable } from "@/components/admin/EventsTable";
import EventCollegeData from "./EventCollegeData";

export async function Events({ calendarID }: { calendarID: string }) {
  const events = await getEvents(calendarID);
  return (
    <div className="space-y-4">
      <EventCollegeData events={events} />
      <EventsTable data={events} />
    </div>
  );
}
