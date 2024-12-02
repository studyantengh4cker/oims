import { getEquipmentRequest } from "@/actions/equipment.action";
import RequestEquipmentsForm from "@/components/forms/EquipmentRequestForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Equipments({ eventId }: { eventId: string }) {
  const request = await getEquipmentRequest(eventId);
  if (!request)
    return (
      <div>
        <p>No equipment request found. Please create a new request.</p>
        <Button asChild>
          <Link href={`/osas/equipments/request?eventId=${eventId}`}>
            Create Equipment Request
          </Link>
        </Button>
      </div>
    );

  const data = {
    eventId,
    requestor: request.requestor,
    dateRequested: new Date(request.dateRequested).toISOString().slice(0, 16),
    dateToBeReturned: new Date(request.dateToBeReturned)
      .toISOString()
      .slice(0, 16),
    items: request.equipments.map((item) => ({
      status: item.status,
      equipmentId: item.equipmentId,
      quantity: item.quantity,
    })),
    id: request.id,
  };

  return (
    <div>
      <RequestEquipmentsForm eventId={eventId} defaultValues={data} />
    </div>
  );
}
