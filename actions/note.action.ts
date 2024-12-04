"use server";

import { NoteFormData } from "@/components/forms/DisciplinaryNoteForm";
import { createStudent } from "./student.action";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createActivityLog } from "./log.action";

export async function createNote(data: NoteFormData) {
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
      "Non Graduate"
    );
    await prisma.disciplinaryNote.createMany({
      data: data.disciplinaryNotes.map((note) => ({
        studentId: data.studentId,
        note: note.note,
        dateGiven: new Date(note.dateGiven),
      })),
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error creating admission:", error);
    throw new Error("There was a problem creating the admission.");
  } finally {
    await createActivityLog("Created a Note", "Notes");
  }
}

export async function getStudentsWithDisciplinaryNotes() {
  try {
    const students = await prisma.student.findMany({
      where: {
        disciplinaryNotes: {
          some: {}, // Filters to include only students with disciplinary notes
        },
      },
      include: {
        disciplinaryNotes: true, // Include disciplinary notes in the result
      },
    });
    return students;
  } catch (error) {
    console.error("Error fetching students with disciplinary notes:", error);
    throw new Error(
      "There was a problem retrieving the students with disciplinary notes."
    );
  }
}

export async function getNotesByStudentId(studentId: string) {
  try {
    const student = await prisma.student.findUnique({
      where: {
        studentId: studentId,
      },
      include: {
        disciplinaryNotes: true, // Include disciplinary notes in the result
      },
    });

    // Return null if student doesn't exist or disciplinaryNotes is empty
    if (
      !student ||
      !student.disciplinaryNotes ||
      student.disciplinaryNotes.length === 0
    ) {
      return null;
    }

    return student;
  } catch (error) {
    console.error(`Error fetching student with ID ${studentId}:`, error);
    throw new Error("There was a problem retrieving the student.");
  }
}

export async function updateNote(data: NoteFormData) {
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
      "Non Graduate"
    );

    await prisma.student.update({
      where: { studentId: data.studentId },
      data: {
        disciplinaryNotes: {
          deleteMany: {}, // Delete existing requirements
          create: data.disciplinaryNotes.map((note) => ({
            note: note.note,
            dateGiven: new Date(note.dateGiven),
          })), // Create new requirements
        },
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating admission:", error);
    throw new Error("There was a problem updating the admission.");
  } finally {
    await createActivityLog("Updated a Note", "Notes");
  }
}
