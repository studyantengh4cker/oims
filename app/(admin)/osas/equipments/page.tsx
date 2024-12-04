import { getEquipments } from "@/actions/equipment.action";
import { EquipmentsTable } from "@/components/admin/EquipmentsTable";
import { FormModal } from "@/components/admin/FormModal";
import { EquipmentForm } from "@/components/forms/EquipmentForm";

export default async function EquipmentsPage() {
  const equipments = await getEquipments();
  return (
    <main className="p-5">
      <div className="flex items-center gap-4 mb-4">
        <FormModal title="Create Equipment">
          <EquipmentForm />
        </FormModal>
        <h1 className="text-2xl text-primary font-bold">Equipments</h1>
      </div>
      <EquipmentsTable data={equipments} />
    </main>
  );
}
