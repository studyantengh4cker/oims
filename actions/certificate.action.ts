"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCertificate(data: any) {
  try {
    await prisma.certificateRequest.create({ data });
    revalidatePath("/osas/certificates");
  } catch (error) {
    console.log(error);
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
