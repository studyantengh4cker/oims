"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { getEventsWithDetails } from "@/actions/event.action";
import EventSummaryReport from "./EventReport";
import Loading from "@/app/loading";

export default function EventsReportPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    async function fetchAdmissions() {
      const events = await getEventsWithDetails();
      console.log(events);
      setEvents(events || []);
    }
    fetchAdmissions();

    setIsClient(true);
  }, []);

  if (!isClient) return <Loading />;

  return (
    <PDFViewer className="w-full h-screen">
      <EventSummaryReport events={events} />
    </PDFViewer>
  );
}
