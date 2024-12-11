"use client";

import { useForm } from "react-hook-form";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useState } from "react";
import { departments, venues } from "@/lib/globals"; // Example: List of departments
import { useToast } from "@/hooks/use-toast";
import { createOpportunity } from "@/actions/opportunity.action"; // Assuming these functions exist
//import { useRouter } from "next/navigation";

// Validation schema using Zod
const schema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description is required"),
  start: z.string().min(1, "Start date and time are required"),
  venue: z.string().min(1, "End date and time are required"),
  department: z.string().min(1, "Department is required"),
  program: z.string().min(1, "Program is required"),
});

export type OpportunityFormData = z.infer<typeof schema>;

interface OpportunityFormProps {
  defaultValues?: OpportunityFormData;
}

// Main OpportunityForm component
export function OpportunityForm({ defaultValues }: OpportunityFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  //const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(
    defaultValues?.department || null
  );

  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      start: "",
      venue: "",
      department: "",
      program: "",
    },
  });

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    form.setValue("program", "");
  };

  const programsForSelectedCourse =
    departments.find((course) => course.name === selectedCourse)?.programs ||
    [];

  const onSubmit = async (values: OpportunityFormData) => {
    try {
      setLoading(true);
      if (defaultValues) {
        //await updateOpportunity(values);
      } else {
        await createOpportunity(values);
      }
      toast({
        title: "Opportunity",
        description: defaultValues
          ? "Successfully Updated Opportunity"
          : "Successfully Created Opportunity",
      });
    } catch (error) {
      toast({
        title: "Submission Error",
        description:
          "Error in submitting your opportunity. Please try again later.",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {venues.map((venue, i) => (
                    <SelectItem value={venue} key={i}>
                      {venue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Department */}
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCourseChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((course) => (
                    <SelectItem key={course.name} value={course.name}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Program */}
        <FormField
          control={form.control}
          name="program"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedCourse}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {programsForSelectedCourse.map((program) => (
                    <SelectItem key={program.shortname} value={program.name}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <Button type="submit" disabled={loading}>
          {defaultValues ? "Update Opportunity" : "Create Opportunity"}
        </Button>
      </form>
    </Form>
  );
}
