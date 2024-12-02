"use client";

import { getEventById } from "@/actions/event.action";
import { SchoolEvent } from "@prisma/client";
import { useEffect, useState } from "react";

export const useEvent = (eventId: string) => {
  const [event, setEvent] = useState<SchoolEvent | null>(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const fetchedEvent = await getEventById(eventId);
        setEvent(fetchedEvent || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]); // Add eventId to the dependency array to re-fetch if it changes

  return { event, loading };
};
