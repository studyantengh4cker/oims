import { Suspense } from "react";
import GraduatingStudentsPage from "./students/page";
import OpportunitiesPage from "./opportunities/page";
import { FormModal } from "@/components/admin/FormModal";
import { GraduatingStudentForm } from "@/components/forms/GraduatingStudentForm";
import { OpportunityForm } from "@/components/forms/OpportunityForm";

export default async function CareerPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold text-primary my-4">Career Guidance</h1>
      <Suspense fallback={<>Loading Opportunities...</>}>
        <FormModal title="Create Opportunity">
          <OpportunityForm />
        </FormModal>
        <OpportunitiesPage />
      </Suspense>
      <Suspense fallback={<>Loading Students...</>}>
        <FormModal title="Create Graduating Student">
          <GraduatingStudentForm />
        </FormModal>
        <GraduatingStudentsPage />
      </Suspense>
    </main>
  );
}
