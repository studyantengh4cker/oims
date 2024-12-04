import { getStudentsByProgram } from "@/actions/student.action";
import { GraduatingStudentTable } from "@/components/admin/GraduationStudentTable";

export default async function ProgramStudents({
  program,
}: {
  program: string;
}) {
  const students = (await getStudentsByProgram(program, "Graduate")) || [];

  return <GraduatingStudentTable data={students} />;
}
