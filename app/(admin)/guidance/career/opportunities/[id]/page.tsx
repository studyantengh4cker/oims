import { getOpportunity } from "@/actions/opportunity.action";
import { OpportunityForm } from "@/components/forms/OpportunityForm";
import ProgramStudents from "./ProgramStudents";
import { departments } from "@/lib/globals";
import Image from "next/image";

export default async function OpportunityPage({ params }: { params: any }) {
  if (!params) return null;

  const opportunity = await getOpportunity(params.id as string);
  if (!opportunity) return <>Not Found</>;

  const department = departments.find(
    (dept) => dept.name === opportunity.department
  );

  if (!department) return <>Department Not Found</>;

  return (
    <main className="h-screen space-y-8">
      <div className="flex items-center gap-4">
        <Image src={department.logo} alt="logo" width={80} height={80} />
        <h1 className="text-2xl font-bold">{department.name}</h1>
      </div>
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
