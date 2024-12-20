import { getEquipments } from "@/actions/equipment.action";
import { EquipmentsTable } from "@/components/admin/EquipmentsTable";
import { FormModal } from "@/components/admin/FormModal";
import { EquipmentForm } from "@/components/forms/EquipmentForm";
import { EquipmentHistory } from "./EquipmentHistory";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EquipmentsPage() {
  const equipments = await getEquipments();
  return (
    <main className="p-5">
      <div className="flex items-center gap-4 mb-4">
        <FormModal title="Create Equipment">
          <EquipmentForm />
        </FormModal>
        <h1 className="text-2xl text-primary font-bold">Equipments</h1>
        <Button asChild variant="link">
          <Link href="/reports/equipments" className="text-primary">
            View Report
          </Link>
        </Button>
      </div>
      <EquipmentsTable data={equipments} />
      <EquipmentHistory />
    </main>
  );
}
