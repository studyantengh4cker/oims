import { getEquipment } from "@/actions/equipment.action";
import { EquipmentForm } from "@/components/forms/EquipmentForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EquipmentPage({ params }: { params: any }) {
  if (!params) return null;

  const equipment = await getEquipment(params.id);
  if (!equipment) return <>Admission not found</>;

  const data = {
    id: equipment.id,
    name: equipment.name,
    brand: equipment.brand,
    price: String(equipment.price),
    quantity: String(equipment.quantity),
    dateBought: equipment.dateBought,
    isAvailable: equipment.isAvailable,
    imageUrl: equipment.imageUrl || undefined,
  };

  return (
    <main className=" bg-white p-8 rounded-md">
      <Button asChild variant="link">
        <Link href="/osas/equipments">Back</Link>
      </Button>
      <EquipmentForm defaultValues={data} />
    </main>
  );
}
