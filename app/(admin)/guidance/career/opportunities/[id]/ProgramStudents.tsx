import { getStudentsByProgram } from "@/actions/student.action";
import { GraduatingStudentTable } from "@/components/admin/GraduationStudentTable";
import NotifyStudentsButton from "@/components/admin/NotifyStudentsButton";

export default async function ProgramStudents({
  program,
}: {
  program: string;
}) {
  const students = (await getStudentsByProgram(program, "Graduate")) || [];

  return (
    <section>
      <NotifyStudentsButton />
      <GraduatingStudentTable data={students} />;
    </section>
  );
}
