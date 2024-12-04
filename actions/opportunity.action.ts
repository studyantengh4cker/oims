"use server";

import { OpportunityFormData } from "@/components/forms/OpportunityForm";
import prisma from "@/lib/db";
import { google } from "googleapis";
import { revalidatePath } from "next/cache";
import { getGraduatingStudents } from "./student.action";
import { auth } from "@/lib/auth";
import { createActivityLog } from "./log.action";

const oauth2Client = new google.auth.OAuth2();

export const createOpportunity = async (data: OpportunityFormData) => {
  try {
    await prisma.opportunity.create({
      data: {
        ...data,
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  } finally {
    await createActivityLog("Created a Opportunity", "Career");
  }
};

export const getOpportunities = async () => {
  try {
    return await prisma.opportunity.findMany();
  } catch (error) {
    return [];
  }
};

export const getOpportunity = async (id: string) => {
  try {
    const opportunity = await prisma.opportunity.findUnique({ where: { id } });
    return opportunity;
  } catch (error) {
    console.log(error);
  }
};

export async function notifyGraduatingStudents(
  course: string,
  program: string
) {
  try {
    const students = await getGraduatingStudents(course, program);
    if (!students || students.length === 0) {
      console.log("No graduating students found.");
      return;
    }

    const session = await auth();
    if (!session?.accessToken) throw new Error("Access token is required.");

    // Set credentials for Gmail API
    oauth2Client.setCredentials({ access_token: session.accessToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    for (const student of students) {
      const emailBody = [
        `To: ${student.email}`,
        "Content-Type: text/plain; charset=UTF-8",
        `Subject: Congratulations on Your Graduation! 🎓`,
        "",
        `Dear ${student.lastName},`,
        "",
        `Congratulations on reaching this milestone in your academic journey! We are proud of your achievement and wish you success in your future endeavors.`,
        "",
        `Best regards,`,
        `Your University Office`,
      ].join("\n");

      const encodedEmail = Buffer.from(emailBody)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      // Send the email
      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedEmail,
        },
      });
      console.log(`Email sent to ${student.lastName} (${student.email})`);
    }

    console.log("All notifications sent.");
  } catch (error) {
    console.error("Error notifying graduating students:", error);
  }
}
