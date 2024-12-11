import { getAdmissionByNumber } from "@/actions/admission.action";
import { AdmissionTable } from "@/components/admin/AdmissionTable";
import AdmissionCollegeData from "./AdmissionCollegeData";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdmissionPage() {
  const admissions = await getAdmissionByNumber("2");

  console.log(admissions);

  if (!admissions) return;
  return (
    <main className="p-10">
      <div className="flex items-center gap-4 mb-5">
        <Button asChild>
          <Link href="admission/create">Create Admission</Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary">Admission</h1>
      </div>
      <AdmissionCollegeData admissions={admissions} />
      <div className="my-10"></div>
      <AdmissionTable data={admissions} />
    </main>
  );
}
