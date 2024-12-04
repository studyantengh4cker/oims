"use server";

import { AdmissionFormData } from "@/components/forms/AdmissionForm";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createStudent, updateStudent } from "./student.action";
import { createActivityLog } from "./log.action";

// Function to create admission with already existing student record
export async function createAdmission(data: AdmissionFormData) {
  try {
    await createStudent(
      data.studentId,
      data.firstName,
      data.middleName || null,
      data.lastName,
      data.email,
      data.contactNumber,
      data.course,
      data.program,
      data.yearLevel,
      data.classification
    );
    await prisma.admission.create({
      data: {
        admissionNo: data.admissionNo,
        admissionType: data.admissionType, // Ensure admission type is included
        studentId: data.studentId, // Link admission to existing student
        requirements: {
          create: data.requirements, // Create admission requirements
        },
        status: data.requirements.every((req) => req.isSubmitted)
          ? "Complete"
          : "Incomplete",
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating admission:", error);
    throw new Error("There was a problem creating the admission.");
  } finally {
    await createActivityLog("Created an Admission", "Admission");
  }
}

// Function to update the admission and its requirements
export async function updateAdmission(data: AdmissionFormData) {
  try {
    await updateStudent(
      data.studentId,
      data.firstName,
      data.middleName || null,
      data.lastName,
      data.email,
      data.contactNumber,
      data.course,
      data.program,
      data.yearLevel,
      data.classification
    );

    await prisma.admission.update({
      where: { id: data.id },
      data: {
        admissionNo: data.admissionNo,
        admissionType: data.admissionType,
        status: data.requirements.every((req) => req.isSubmitted)
          ? "Complete"
          : "Incomplete",
        requirements: {
          deleteMany: {}, // Delete existing requirements
          create: data.requirements, // Create new requirements
        },
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating admission:", error);
    throw new Error("There was a problem updating the admission.");
  } finally {
    await createActivityLog("Updated an Admission", "Admission");
  }
}

export async function getAdmissionById(id: string) {
  try {
    return await prisma.admission.findUnique({
      where: { id },
      include: {
        requirements: true,
        student: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getAdmissionByNumber(number: string) {
  try {
    return await prisma.admission.findMany({
      where: { admissionNo: number },
      include: {
        requirements: true,
        student: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
}
