import { getAdmissionByNumber } from "@/actions/admission.action";
import { AdmissionTable } from "@/components/admin/AdmissionTable";
import AdmissionCollegeData from "./AdmissionCollegeData";

export default async function AdmissionPage() {
  const admissions = await getAdmissionByNumber("2");
  if (!admissions) return;
  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold text-primary mb-5">Admission</h1>
      <AdmissionCollegeData admissions={admissions} />
      <div className="my-10"></div>
      <AdmissionTable data={admissions} />
    </main>
  );
}
