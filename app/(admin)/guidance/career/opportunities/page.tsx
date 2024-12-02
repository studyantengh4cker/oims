import { getOpportunities } from "@/actions/opportunity.action";
import { Opportunities } from "@/components/admin/Opportunities";

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  return (
    <div className="p-10">
      <Opportunities data={opportunities} />
    </div>
  );
}
