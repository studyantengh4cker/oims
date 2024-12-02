"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Equipment } from "@prisma/client";
import {
  createEquipmentRequest,
  getAvailableEquipments,
  updateEquipmentRequest,
} from "@/actions/equipment.action";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import ChosenEquipment from "../admin/ChosenEquipment";

export const RequestEquipmentsFormSchema = z.object({
  id: z.string().optional(),
  requestor: z.string().min(2).max(50),
  dateRequested: z.string().min(1, "Start date and time are required"),
  dateToBeReturned: z.string().min(1, "End date and time are required"),
  eventId: z.string().max(50), // Add eventId to the schema
  items: z
    .array(
      z.object({
        equipmentId: z.string(),
        quantity: z.number().min(0),
        status: z.string().default("Not Returned"),
      })
    )
    .min(1, "You must request at least one item."),
});

export type RequestEquipmentsFormData = z.infer<
  typeof RequestEquipmentsFormSchema
>;

interface RequestEquipmentsFormProps {
  defaultValues?: RequestEquipmentsFormData;
  eventId?: string;
}

export default function RequestEquipmentsForm({
  defaultValues,
  eventId,
}: RequestEquipmentsFormProps) {
  const router = useRouter();

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [chosenEquipments, setChosenEquipments] = useState<
    RequestEquipmentsFormData["items"]
  >(defaultValues?.items || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const form = useForm<z.infer<typeof RequestEquipmentsFormSchema>>({
    resolver: zodResolver(RequestEquipmentsFormSchema),
    defaultValues: {
      id: defaultValues?.id || undefined,
      requestor: defaultValues?.requestor || "",
      dateRequested: defaultValues?.dateRequested || "",
      dateToBeReturned: defaultValues?.dateToBeReturned || "",
      eventId: eventId || "",
      items: chosenEquipments,
    },
  });

  const { control, handleSubmit } = form;
  const { append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    async function fetchEquipments() {
      setLoading(true);
      const equipments = await getAvailableEquipments();
      setEquipments(equipments);
      setLoading(false);
    }
    fetchEquipments();
  }, []);

  const handleCheckboxChange = (equipment: Equipment) => {
    const existingIndex = chosenEquipments.findIndex(
      (item) => item.equipmentId === equipment.id
    );

    if (existingIndex === -1) {
      const newItem = {
        equipmentId: equipment.id,
        quantity: 1,
        status: "Not Returned",
      };
      setChosenEquipments([...chosenEquipments, newItem]);
      append(newItem);
    } else {
      const updatedChosen = chosenEquipments.filter(
        (item) => item.equipmentId !== equipment.id
      );
      setChosenEquipments(updatedChosen);
      remove(existingIndex);
    }
  };

  const handleSubmitForm = async (
    values: z.infer<typeof RequestEquipmentsFormSchema>
  ) => {
    try {
      setSubmitting(true);
      if (values.id) {
        await updateEquipmentRequest(values.id, values)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => console.error("Failed to update event:", error));
      } else {
        createEquipmentRequest(values)
          .then(() => {
            router.push(`/osas/events/${values.eventId}`);
          })
          .catch((error) => console.error("Failed to create event:", error));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-3 p-2">
        <h1 className="font-bold text-primary text-lg mb-5">
          Request Equipments
        </h1>

        <FormField
          control={control}
          name="requestor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrowers Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dateRequested"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Requested</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="dateToBeReturned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date To Be Returned</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <section>
          <FormLabel>Available Equipment</FormLabel>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            equipments.map((equipment) => {
              const isChecked = chosenEquipments.some(
                (item) => item.equipmentId === equipment.id
              );
              return (
                <div
                  key={equipment.id}
                  className="flex items-center space-x-2 my-2"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(equipment)}
                  />
                  <label className="flex-1">
                    {equipment.name} ({equipment.quantity} available)
                  </label>
                </div>
              );
            })
          )}
        </section>
        <section>
          <FormLabel>Chosen Equipment</FormLabel>
          {loading ? (
            <div className="flex justify-center items-center py-4">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : chosenEquipments.length > 0 ? (
            chosenEquipments.map((item, index) => (
              <ChosenEquipment
                key={item.equipmentId}
                equipmentId={item.equipmentId}
                index={index}
                form={form} // Pass the form control to ChosenEquipment
                availableQ={item.quantity}
              />
            ))
          ) : (
            <p>No equipment chosen</p>
          )}
        </section>
        <section className="flex justify-between mt-4">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </section>
      </form>
    </Form>
  );
}
