import { departments } from "@/lib/globals";
import Image from "next/image";

export default function AdmissionCollegeData({
  admissions,
}: {
  admissions: any[];
}) {
  // Count admissions by department and status
  const admissionCounts = departments.map((department) => {
    const departmentAdmissions = admissions.filter(
      (admission) => admission.student.course === department.name // Match course to department
    );

    const completeCount = departmentAdmissions.filter(
      (admission) => admission.status === "Complete"
    ).length;

    const incompleteCount = departmentAdmissions.filter(
      (admission) => admission.status !== "Complete"
    ).length;

    return {
      ...department,
      totalCount: departmentAdmissions.length,
      completeCount,
      incompleteCount,
    };
  });

  // Total admissions count across all departments
  const totalCompleteAdmissions = admissions.filter(
    (admission) => admission.status === "Complete"
  ).length;

  const totalIncompleteAdmissions = admissions.length - totalCompleteAdmissions;

  return (
    <section className="flex gap-6">
      {/* Total Admissions */}
      <div className="bg-primary text-primary-foreground p-8 rounded-lg drop-shadow-lg flex flex-col justify-center gap-10">
        <div>
          <h1>Total Admissions</h1>
          <h1 className="text-lg font-bold">{admissions.length}</h1>
        </div>
        <div>
          <h1>Total Incomplete</h1>
          <h1 className="text-lg font-bold">{totalIncompleteAdmissions}</h1>
        </div>
      </div>

      {/* Admissions by Department */}
      <div className="flex flex-wrap gap-4">
        {admissionCounts.map((department, i) => (
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
              <p>{department.totalCount} Total Admission(s)</p>
              <p className="text-green-500">
                {department.completeCount} Complete Admission(s)
              </p>
              <p className="text-red-500">
                {department.incompleteCount} Incomplete Admission(s)
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
