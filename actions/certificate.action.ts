"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createActivityLog } from "./log.action";

export async function createCertificate(data: any) {
  try {
    await prisma.certificateRequest.create({ data });
    revalidatePath("/osas/certificates");
  } catch (error) {
    console.log(error);
  } finally {
    await createActivityLog("Created a certificate request", "Certificates");
  }
}

export async function getCertificateRequests() {
  try {
    const requests = await prisma.certificateRequest.findMany();
    return requests;
  } catch (error) {
    console.log(error);
  }
}

export async function getCertificateRequest(id: string) {
  try {
    return await prisma.certificateRequest.findUnique({ where: { id } });
  } catch (error) {
    console.log(error);
  }
}

export async function updateRequestStatus(id: string, status: string) {
  try {
    await prisma.certificateRequest.update({
      where: { id },
      data: {
        status,
      },
    });
    revalidatePath("/osas/certificates");
  } catch (error) {
    console.log(error);
  } finally {
    await createActivityLog(
      "Updated a Certificate Request status",
      "Certificates"
    );
  }
}
