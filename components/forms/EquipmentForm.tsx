"use client";

import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { CalendarIcon, X } from "lucide-react";
import { deleteEquipment } from "@/actions/equipment.action";
import DeleteButton from "../admin/DeleteButton";
import { updateEquipment, createEquipment } from "@/actions/equipment.action"; // Import the actions
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { useRouter } from "next/navigation";

const EquipmentFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2).max(50),
  brand: z.string().min(2).max(50),
  price: z.string(),
  quantity: z.string(),
  dateBought: z.date(),
  isAvailable: z.boolean().optional(),
  imageUrl: z.string().optional(),
});

interface EquipmentFormProps {
  defaultValues?: Partial<z.infer<typeof EquipmentFormSchema>>;
}

export type EquipmentFormData = z.infer<typeof EquipmentFormSchema>;

export function EquipmentForm({ defaultValues }: EquipmentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | undefined>(
    defaultValues?.imageUrl
  );
  const form = useForm<z.infer<typeof EquipmentFormSchema>>({
    resolver: zodResolver(EquipmentFormSchema),
    defaultValues: defaultValues || {
      id: "",
      name: "",
      brand: "",
      price: "0",
      quantity: "0",
      isAvailable: false,
      imageUrl: "",
      dateBought: undefined,
    },
  });

  const router = useRouter();

  const handleImageUpload = async (file: File) => {
    const storageRef = ref(storage, `equipment-images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleSubmit = async (values: z.infer<typeof EquipmentFormSchema>) => {
    setError(null);
    startTransition(async () => {
      try {
        if (image) {
          values.imageUrl = image;
        }
        // Convert price and quantity to numbers
        if (defaultValues) {
          // Update equipment
          await updateEquipment(values);
        } else {
          // Create new equipment
          await createEquipment(values);
          router.push(`/osas/equipments`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 p-4"
      >
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <h1 className="font-bold text-primary text-lg mb-5">
              {defaultValues ? "Edit Equipment" : ""}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Item Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="Item Brand" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      defaultValue={field.value!.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Available</SelectItem>
                        <SelectItem value="false">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Item Price"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input placeholder="Quantity" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateBought"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Bought</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormLabel>Item Image</FormLabel>
                  <FormControl>
                    {image ? (
                      <div className="relative max-w-full min-w-[200px] max-h-[400px] min-h-[200px]">
                        <Image
                          src={image}
                          alt="Item Image"
                          width={400}
                          height={400}
                          className="object-contain"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute right-[-12px] top-0"
                          onClick={() => setImage(undefined)} // Clear image
                        >
                          <X />
                        </Button>
                      </div>
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleImageUpload(file);
                            setImage(url);
                            form.setValue("imageUrl", url);
                          }
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Action Buttons */}
        <section className="flex justify-end gap-8 mt-4">
          {defaultValues?.id && (
            <DeleteButton
              deleteFunction={deleteEquipment}
              id={defaultValues.id}
            />
          )}
          <Button type="submit" disabled={isPending}>
            {defaultValues ? "Update Equipment" : "Add Equipment"}
          </Button>
          {error && (
            <div>
              <p>{error}</p>
            </div>
          )}
        </section>
      </form>
    </Form>
  );
}
