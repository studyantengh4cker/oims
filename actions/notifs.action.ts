import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function createNotif(office: string, data: any) {
  await db
    .collection("notifs")
    .doc()
    .set({
      office,
      isRead: false,
      notifiedAt: FieldValue.serverTimestamp(), // Add server timestamp
      ...data,
    });
}
