import { AdmissionForm } from "@/components/forms/AdmissionForm";
import { StatusBadge } from "@/components/StatusBadge";
import { Admission } from "@/lib/globals";

export default function AdmissionContainer({
  admission,
}: {
  admission: Admission;
}) {
  const normalizedAdmission = {
    ...admission,
    middleName: admission.middleName || "", // Convert null to an empty string for form compatibility
    studentId: admission.studentId || "", // Ensure studentId is included
    yearLevel: admission.yearLevel || "", // Ensure yearLevel is included
    admissionType: admission.admissionType || "", // Ensure admissionType is included
  };

  return (
    <main className="p-10">
      <section className="p-10 bg-white drop-shadow-lg rounded-lg">
        <div className="my-6 flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Admission</h1>
          <StatusBadge status={admission.status} />
        </div>
        <AdmissionForm admissionNo="2" defaultValues={normalizedAdmission} />
      </section>
    </main>
  );
}
