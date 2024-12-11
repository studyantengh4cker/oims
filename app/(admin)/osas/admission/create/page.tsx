import { AdmissionForm } from "@/components/forms/AdmissionForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CreateAdmissionPage() {
  return (
    <main className="p-4">
      <Button asChild variant="link">
        <Link href="/osas/admission">Back</Link>
      </Button>
      <h1 className="text-primary text-2xl font-bold mb-4">Create Admission</h1>
      <AdmissionForm admissionNo="2" />
    </main>
  );
}
