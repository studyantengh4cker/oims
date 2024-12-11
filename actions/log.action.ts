"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/firebase-admin";
import { headers } from "next/headers";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { UAParser } from "ua-parser-js";

function getIpAddress() {
  const forwarded = headers().get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0] : "Unknown";
}

function getDeviceInfo() {
  const userAgent = headers().get("user-agent") || ""; // Default to an empty string if null
  const parser = new UAParser(userAgent); // Instantiate UAParser with a string
  const browser = parser.getBrowser(); // Get browser details
  const cpu = parser.getCPU(); // Get CPU details
  const device = parser.getDevice(); // Get device details
  const os = parser.getOS(); // Get OS details

  return {
    deviceType: device.type || "Desktop", // Defaults to Desktop if no type is found
    deviceVendor: device.vendor || "Unknown",
    deviceModel: device.model || "Unknown",
    os: `${os.name} ${os.version || ""}`.trim(),
    browser: `${browser.name} ${browser.version || ""}`.trim(),
    cpuArchitecture: cpu.architecture || "Unknown",
  };
}

export async function createActivityLog(action: string, system: string) {
  const session = await auth();

  if (!session?.user) return;

  const ipAddress = getIpAddress();
  const deviceInfo = getDeviceInfo();

  const log = {
    id: uuidv4(),
    userId: session.user.id,
    userName: session.user.name,
    action,
    timestamp: new Date().toISOString(),
    ipAddress,
    deviceInfo,
    office: session.user.office,
    role: session.user.role,
    system,
  };

  // Save to Firestore or your database
  await db.collection("activityLogs").doc(log.id).set(log);
  console.log("Activity log created:", log);
}
