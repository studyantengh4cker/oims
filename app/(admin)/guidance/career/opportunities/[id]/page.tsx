import { getOpportunity } from "@/actions/opportunity.action";
import { OpportunityForm } from "@/components/forms/OpportunityForm";

export default async function OpportunityPage({ params }: { params: any }) {
  if (!params) return null;

  const opportunity = await getOpportunity(params.id as string);
  if (!opportunity) return <>Not Found</>;

  console.log(opportunity);

  return (
    <main className="h-screen space-y-8">
      <section className="flex">
        <div className="bg-orange-600 text-white p-8 rounded-md drop-shadow-md">
          <p className="text-sm">Student Notified</p>
          <h1 className="text-2xl font-bold">30</h1>
        </div>
      </section>
      <section>
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
    </main>
  );
}
