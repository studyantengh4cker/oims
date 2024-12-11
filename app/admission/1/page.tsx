import { AdmissionForm } from "@/components/forms/AdmissionForm";

export default function AdmissionOnePage() {
  return (
    <main className="flex items-center justify-center bg-slate-200 w-full h-screen">
      <section className="bg-white p-10 rounded-md drop-shadow-lg">
        <h1 className="text-primary font-semibold mb-4 text-lg">
          Admission Form For New Students
        </h1>
        <AdmissionForm admissionNo="1" />
      </section>
    </main>
  );
}
