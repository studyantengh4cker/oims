import { Suspense } from "react";
import GraduatingStudentsPage from "./students/page";
import OpportunitiesPage from "./opportunities/page";

export default async function CareerPage() {
  return (
    <main>
      <Suspense fallback={<>Loading Opportunities...</>}>
        <OpportunitiesPage />
      </Suspense>
      <Suspense fallback={<>Loading Students...</>}>
        <GraduatingStudentsPage />
      </Suspense>
    </main>
  );
}
