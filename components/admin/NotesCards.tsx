"use client"

import { useState } from "react";

interface DisciplinaryNote {
  id: string;
  dateGiven: Date;
  note: string;
}

interface Student {
  studentId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  course: string;
  program: string;
  yearLevel: string;
  email: string;
  contactNumber: string;
  createdAt: Date;
  updatedAt: Date;
  disciplinaryNotes: DisciplinaryNote[];
}

interface DisciplinaryNotesCardsProps {
  students: Student[];
}

export function DisciplinaryNotesCards({ students }: DisciplinaryNotesCardsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Filter students based on search term and selected course
  const filteredStudents = students.filter((student) => {
    const matchesName =
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse ? student.course === selectedCourse : true;
    return matchesName && matchesCourse && student.disciplinaryNotes.length > 0;
  });

  // Extract unique courses for filter options
  const courses = Array.from(new Set(students.map((student) => student.course)));

  return (
    <div className="space-y-4">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by student name"
          className="border rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">All Courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Display Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <div key={student.studentId} className="border rounded-lg p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              {student.firstName} {student.middleName || ""} {student.lastName}
            </h2>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Program:</strong> {student.program}</p>
            <p><strong>Contact:</strong> {student.contactNumber}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Disciplinary Notes:</strong> {student.disciplinaryNotes.length}</p>

            {/* Disciplinary Notes List */}
            <ul className="mt-3 space-y-2">
              {student.disciplinaryNotes.map((note) => (
                <li key={note.id} className="border-t pt-2">
                  <p><strong>Date:</strong> {new Date(note.dateGiven).toLocaleDateString()}</p>
                  <p><strong>Note:</strong> {note.note}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
