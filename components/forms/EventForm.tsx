"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { createEvent, updateEvent } from "@/actions/event.action";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { venues } from "@/lib/globals";

// Schema with new fields: eventType, hasEvaluationReport, and hasPostActivityRequirements
export const eventFormSchema = z.object({
  id: z.string().optional(),
  eventType: z.string().min(1, "Event type is required"),
  summary: z.string().min(2, "Event summary is required"),
  location: z.string().optional(),
  start: z.string().min(1, "Start date and time are required"),
  end: z.string().min(1, "End date and time are required"),
  colorId: z.string().min(1, "Color is required"),
  status: z.string(),
  isWithinSchool: z.boolean().optional(),
  hasEvaluationReport: z.boolean().optional(),
  hasPostActivityRequirements: z.boolean().optional(),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  defaultValues?: z.infer<typeof eventFormSchema>;
}

export function EventForm({ defaultValues }: EventFormProps) {
  const router = useRouter();
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: defaultValues || {
      eventType: "",
      summary: "",
      location: "",
      start: "",
      end: "",
      colorId: "",
      status: "Pending",
      isWithinSchool: true,
      hasEvaluationReport: false,
      hasPostActivityRequirements: false,
    },
  });

  useEffect(() => {
    if (defaultValues?.location && defaultValues.isWithinSchool) {
      setSelectedVenues(defaultValues.location.split(", "));
    }
  }, [defaultValues]);

  const handleVenueChange = (venue: string, isChecked: boolean) => {
    const updatedVenues = isChecked
      ? [...selectedVenues, venue]
      : selectedVenues.filter((v) => v !== venue);

    setSelectedVenues(updatedVenues);
    form.setValue("location", updatedVenues.join(", "));
  };

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    try {
      setLoading(true);
      if (values.id) {
        await updateEvent(values.id, values)
          .then(() => {
            window.location.reload();
          })
          .catch((error) => console.error("Failed to update event:", error));
      } else {
        await createEvent(values)
          .then(() => {
            router.push("/osas/events");
          })
          .catch((error) => console.error("Failed to create event:", error));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Event Type Field */}
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Non-Curricular">Non-Curricular</SelectItem>
                  <SelectItem value="Co-Curricular">Co-Curricular</SelectItem>
                  <SelectItem value="Extra-Curricular">
                    Extra-Curricular
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Event Summary */}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Summary</FormLabel>
              <FormControl>
                <Input placeholder="Event summary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Checkbox to indicate if the event is within the school */}
        <FormField
          control={form.control}
          name="isWithinSchool"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel>Is the event within the school?</FormLabel>
            </FormItem>
          )}
        />

        {form.watch("isWithinSchool") ? (
          <div className="space-y-4">
            <FormLabel>Select Venues:</FormLabel>
            <div className="flex flex-wrap gap-4">
              {venues.map((venue) => (
                <FormItem key={venue} className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      checked={selectedVenues.includes(venue)}
                      onCheckedChange={(isChecked) =>
                        handleVenueChange(venue, Boolean(isChecked))
                      }
                    />
                  </FormControl>
                  <FormLabel>{venue}</FormLabel>
                </FormItem>
              ))}
            </div>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Location Address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Start DateTime Field */}
        <FormField
          control={form.control}
          name="start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date and Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date and Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color Field */}
        <FormField
          control={form.control}
          name="colorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Organizer</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select colorId" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="10">CCS</SelectItem>
                  <SelectItem value="6">CAS</SelectItem>
                  <SelectItem value="5">CBA</SelectItem>
                  <SelectItem value="4">CED</SelectItem>
                  <SelectItem value="9">COE</SelectItem>
                  <SelectItem value="8">COC</SelectItem>
                  <SelectItem value="11">SPC</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Has Evaluation Report Checkbox */}
        <FormField
          control={form.control}
          name="hasEvaluationReport"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel>Has Evaluation Report?</FormLabel>
            </FormItem>
          )}
        />

        {/* Has Post-Activity Requirements Checkbox */}
        <FormField
          control={form.control}
          name="hasPostActivityRequirements"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
              <FormLabel>Has Post-Activity Requirements?</FormLabel>
            </FormItem>
          )}
        />

        <Button disabled={loading} type="submit">
          {loading ? "Saving..." : "Save Event"}
        </Button>
      </form>
    </Form>
  );
}
