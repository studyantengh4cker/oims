"use server";

import { EventFormData } from "@/components/forms/EventForm";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { db } from "@/lib/firebase-admin";
import { google } from "googleapis"; // Move the import here for clarity
import { revalidatePath } from "next/cache";
import { createActivityLog } from "./log.action";

const oauth2Client = new google.auth.OAuth2();
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export async function getCalendarID() {
  try {
    const calendarDoc = await db.collection("calendar").doc("id").get();
    if (calendarDoc.exists) {
      return calendarDoc.data()!.id as string;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function setCalendarID(id: string) {
  try {
    await db.collection("calendar").doc("id").set({ id: id });
    revalidatePath("/osas/events");
  } catch (error) {
    console.log(error);
  } finally {
    await createActivityLog("Changed the calendar ID", "Events");
  }
}

// Fetch Events from the Database
export async function getEvents(calendarId: string) {
  try {
    const events = await prisma.schoolEvent.findMany({
      where: { calendarId },
      orderBy: { start: "asc" },
      take: 10,
    });
    return events;
  } catch (error) {
    console.error("Error fetching events from database:", error);
    return [];
  }
}

// Create Event in Google Calendar and Database
export async function createEvent(data: EventFormData) {
  const calendarId = await getCalendarID();
  if (!calendarId) throw new Error("Calendar ID is required.");

  const session = await auth();
  if (!session?.accessToken) throw new Error("Access token is required.");
  oauth2Client.setCredentials({ access_token: session.accessToken });

  try {
    // Create the event in Google Calendar first
    const eventPayload = {
      summary: data.summary,
      location: data.location || undefined,
      start: { dateTime: new Date(data.start).toISOString(), timeZone: "UTC" },
      end: { dateTime: new Date(data.end).toISOString(), timeZone: "UTC" },
      colorId: data.colorId,
    };

    const googleEventResponse = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: eventPayload,
    });

    const googleEventId = googleEventResponse.data.id;
    if (!googleEventId)
      throw new Error("Failed to create event in Google Calendar.");

    // Store the event in the database with Google Calendar event ID as the primary key
    await prisma.schoolEvent.create({
      data: {
        id: googleEventId, // Use Google Calendar event ID as the primary key
        summary: data.summary,
        eventType: data.eventType,
        location: data.location,
        start: new Date(data.start),
        end: new Date(data.end),
        colorId: data.colorId,
        status: data.status,
        isWithinSchool: data.isWithinSchool || false,
        hasEvaluationReport: data.hasEvaluationReport,
        hasPostActivityRequirements: data.hasPostActivityRequirements,
        calendarId: calendarId,
      },
    });

    // Revalidate the events path
    revalidatePath("/osas/events");
  } catch (error) {
    console.error("Error creating event:", error);
  } finally {
    await createActivityLog("Created an Event", "Events");
  }
}

// Fetch a Single Event by ID from the Database
export async function getEventById(eventId: string) {
  try {
    const event = await prisma.schoolEvent.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new Error("Event not found.");
    return event;
  } catch (error) {
    console.error("Error fetching event by ID from database:", error);
  }
}

// Update Event in Database and Google Calendar
export async function updateEvent(eventId: string, data: EventFormData) {
  const calendarId = await getCalendarID();
  if (!calendarId) throw new Error("Calendar ID is required.");

  const session = await auth();
  if (!session?.accessToken) throw new Error("Access token is required.");
  oauth2Client.setCredentials({ access_token: session.accessToken });

  try {
    // Update the event in Google Calendar first
    const eventPayload = {
      summary: data.summary,
      location: data.location || undefined,
      start: { dateTime: new Date(data.start).toISOString(), timeZone: "UTC" },
      end: { dateTime: new Date(data.end).toISOString(), timeZone: "UTC" },
      colorId: data.colorId,
    };

    await calendar.events.update({
      calendarId: calendarId,
      eventId: eventId, // Use Google Calendar event ID for updating
      requestBody: eventPayload,
    });

    // Update the event in the database after successful update in Google Calendar
    await prisma.schoolEvent.update({
      where: { id: eventId },
      data: {
        summary: data.summary,
        eventType: data.eventType,
        location: data.location,
        start: new Date(data.start),
        end: new Date(data.end),
        colorId: data.colorId,
        status: data.status,
        isWithinSchool: data.isWithinSchool,
        hasEvaluationReport: data.hasEvaluationReport,
        hasPostActivityRequirements: data.hasPostActivityRequirements,
      },
    });

    // Revalidate the path to refresh event data
    revalidatePath("/osas/events");
  } catch (error) {
    console.error("Error updating event:", error);
  } finally {
    await createActivityLog("Updated an Event", "Events");
  }
}

// Delete Event from Database and Google Calendar
export async function deleteEvent(eventId: string) {
  const calendarId = await getCalendarID();
  if (!calendarId) throw new Error("Calendar ID is required.");

  const session = await auth();
  if (!session?.accessToken) throw new Error("Access token is required.");
  oauth2Client.setCredentials({ access_token: session.accessToken });

  try {
    await prisma.schoolEvent.delete({ where: { id: eventId } });

    await calendar.events.delete({
      calendarId: calendarId,
      eventId: eventId,
    });

    revalidatePath("/osas/events");
  } catch (error) {
    console.error("Error deleting event:", error);
  } finally {
    await createActivityLog("Deleted an Event", "Events");
  }
}

export async function getAllEvents() {
  try {
    const events = await prisma.schoolEvent.findMany({
      orderBy: { start: "asc" },
    });

    console.log(events);

    return events;
  } catch (error) {
    console.error("Error fetching events from database:", error);
    return [];
  }
}
