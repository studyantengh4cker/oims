"use client";

import { updateRequestStatus } from "@/actions/certificate.action";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function StatusSelect({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const handleChange = async (newStatus: string) => {
    try {
      await updateRequestStatus(id, newStatus); // Pass the correct new status
      console.log("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Select defaultValue={currentStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Released">Released</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
