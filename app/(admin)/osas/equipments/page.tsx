import { getEquipments } from "@/actions/equipment.action";
import { EquipmentsTable } from "@/components/admin/EquipmentsTable";

export default async function EquipmentsPage() {
  const equipments = await getEquipments();
  return (
    <main className="p-5">
      <h1 className="text-2xl text-primary font-bold mb-4">Equipments</h1>
      <EquipmentsTable data={equipments} />
    </main>
  );
}
