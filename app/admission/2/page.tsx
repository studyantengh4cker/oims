import { AdmissionForm } from "@/components/forms/AdmissionForm";

export default function AdmissionTwoPage() {
  return (
    <main className="flex items-center justify-center bg-slate-200 w-full h-screen">
      <section className="bg-white p-10 rounded-md drop-shadow-lg w-[50%]">
        <h1 className="text-primary font-semibold mb-4 text-lg">
          Admission Form For Transfer
        </h1>
        <AdmissionForm admissionNo="2" />
      </section>
    </main>
  );
}
