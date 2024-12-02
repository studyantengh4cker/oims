import { getAllGraduatingStudents } from "@/actions/student.action";
import { GraduatingStudentTable } from "@/components/admin/GraduationStudentTable";

export default async function GraduatingStudentsPage() {
  const students = await getAllGraduatingStudents();

  return (
    <div className="p-10">
      <GraduatingStudentTable data={students} />
    </div>
  );
}
