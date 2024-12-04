import { departments } from "@/lib/globals";
import Image from "next/image";

export default function NotesCollegeData({ students }: { students: any[] }) {
  // Count students by department and disciplinary notes
  const studentCounts = departments.map((department) => {
    const departmentStudents = students.filter(
      (student) => student.course === department.name // Match course to department
    );

    const totalStudents = departmentStudents.length;
    const studentsWithNotes = departmentStudents.filter(
      (student) =>
        student.disciplinaryNotes && student.disciplinaryNotes.length > 0
    ).length;

    return {
      ...department,
      totalStudents,
      studentsWithNotes,
    };
  });

  // Total student count and students with notes
  const totalStudents = students.length;

  return (
    <section className="flex gap-6 my-10">
      {/* Total Students */}
      <div className="bg-primary text-primary-foreground p-8 rounded-lg drop-shadow-lg flex flex-col justify-center gap-10">
        <div>
          <h1>Total Students</h1>
          <h1 className="text-lg font-bold">{totalStudents}</h1>
        </div>
      </div>

      {/* Students by Department */}
      <div className="flex flex-wrap gap-4">
        {studentCounts.map((department, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col items-start gap-4"
          >
            <Image
              src={department.logo}
              alt={`${department.name} logo`}
              width={60}
              height={60}
            />
            <div>
              <h2 className="font-bold">{department.shortname}</h2>
              <p className="text-red-500">
                {department.studentsWithNotes} Student(s) with Disciplinary
                Notes
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
