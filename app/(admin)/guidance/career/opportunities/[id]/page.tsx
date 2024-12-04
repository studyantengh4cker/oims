import { getOpportunity } from "@/actions/opportunity.action";
import { OpportunityForm } from "@/components/forms/OpportunityForm";
import ProgramStudents from "./ProgramStudents";

export default async function OpportunityPage({ params }: { params: any }) {
  if (!params) return null;

  const opportunity = await getOpportunity(params.id as string);
  if (!opportunity) return <>Not Found</>;

  return (
    <main className="h-screen space-y-8">
      <section className="p-5">
        <OpportunityForm
          defaultValues={{
            id: opportunity.id,
            title: opportunity.title,
            description: opportunity.description,
            department: opportunity.department,
            program: opportunity.program,
          }}
        />
      </section>
      <section className="p-5">
        <h1 className="text-lg font-bold mb-4">Students To Be Notified</h1>
        <ProgramStudents program={opportunity.program} />
      </section>
    </main>
  );
}
