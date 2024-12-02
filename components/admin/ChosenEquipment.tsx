import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRequestedEquipment } from "@/actions/equipment.action";
import { FormControl } from "../ui/form";

interface ChosenEquipmentProps {
  equipmentId: string;
  index: number;
  form: any; // Replace with the actual type if you have defined it
  availableQ: number;
}

const ChosenEquipment = ({
  equipmentId,
  index,
  form,
  availableQ,
}: ChosenEquipmentProps) => {
  const [equipment, setEquipment] = useState<any>(null); // Replace `any` with your equipment type
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      const fetchedEquipment = await getRequestedEquipment(equipmentId);
      setEquipment(fetchedEquipment);
      setLoading(false);
    };

    fetchEquipment();
  }, [equipmentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!equipment) {
    return <p>Equipment not found</p>;
  }

  const availableQuantity = availableQ + equipment.quantity;

  return (
    <div className="flex items-center space-x-2 my-2">
      <img
        src={equipment.imageUrl}
        alt={equipment.name}
        className="w-16 h-16"
      />
      <label className="flex-1">{equipment.name}</label>
      <Input
        type="number"
        min="0"
        max={availableQuantity} // Set max to available quantity
        {...form.register(`items.${index}.quantity`, {
          valueAsNumber: true,
        })}
        className="w-20"
      />
      <div className="w-[10rem]">
        <Select
          defaultValue={form.getValues(`items.${index}.status`) || ""}
          onValueChange={(value) =>
            form.setValue(`items.${index}.status`, value)
          }
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="Not Returned">Not Returned</SelectItem>
            <SelectItem value="Returned">Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChosenEquipment;
