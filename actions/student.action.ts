"use server";

import prisma from "@/lib/db";
import { Student } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Create a student record
export async function createStudent(
  studentId: string,
  firstName: string,
  middleName: string | null,
  lastName: string,
  email: string,
  contactNumber: string,
  course: string,
  program: string,
  yearLevel: string,
  classification: string
): Promise<Student | null> {
  try {
    const student = await prisma.student.upsert({
      where: { studentId },
      update: {
        firstName,
        middleName,
        lastName,
        email,
        contactNumber,
        course,
        program,
        yearLevel,
        classification,
      },
      create: {
        studentId,
        firstName,
        middleName,
        lastName,
        email,

        contactNumber,
        course,
        program,
        yearLevel,
        classification,
      },
    });
    revalidatePath("/");
    return student; // Return the created or updated student
  } catch (error) {
    console.error("Error creating or updating student:", error);
    return null;
  }
}

// Update a student record
export async function updateStudent(
  studentId: string,
  firstName: string,
  middleName: string | null,
  lastName: string,
  email: string,
  contactNumber: string,
  course: string,
  program: string,
  yearLevel: string,
  classification: string
): Promise<Student | null> {
  try {
    const student = await prisma.student.update({
      where: { studentId }, // Find the student by ID
      data: {
        firstName,
        middleName,
        lastName,
        email,
        contactNumber,
        course,
        program,
        yearLevel,
        classification,
      },
    });
    return student; // Return the updated student
  } catch (error) {
    console.error("Error updating student:", error);
    return null;
  }
}

// Fetch graduating students
export async function getAllGraduatingStudents(): Promise<Student[] | null> {
  try {
    const graduatingStudents = await prisma.student.findMany({
      where: { classification: "Graduate" }, // Filter by classification
    });

    console.log(graduatingStudents);

    return graduatingStudents; // Return the list of graduating students
  } catch (error) {
    console.error("Error fetching graduating students:", error);
    return null;
  }
}

// Fetch graduating students
export async function getGraduatingStudents(
  course: string,
  program: string
): Promise<Student[] | null> {
  try {
    const graduatingStudents = await prisma.student.findMany({
      where: { classification: "Graduate", course, program }, // Filter by classification
    });

    console.log(graduatingStudents);

    return graduatingStudents; // Return the list of graduating students
  } catch (error) {
    console.error("Error fetching graduating students:", error);
    return null;
  }
}

export async function getStudentsByProgram(
  program: string,
  classification: string
) {
  try {
    return await prisma.student.findMany({
      where: { program, classification },
    });
  } catch (error) {
    console.log(error);
  }
}
