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
import { departments } from "@/lib/globals";
import { useToast } from "@/hooks/use-toast";
import { createStudent, updateStudent } from "@/actions/student.action";
import { useRouter } from "next/navigation";

// Validation schema using Zod
const schema = z.object({
  studentId: z.string(),
  firstName: z.string().min(2, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  course: z.string().min(1, "Course is required"),
  program: z.string().min(1, "Program is required"),
  yearLevel: z.string().default("Graduate"),
  classification: z.string().min(1, "Classification is required."),
});

export type GraduatingStudentFormData = z.infer<typeof schema>;

interface GraduatingStudentFormProps {
  defaultValues?: z.infer<typeof schema>;
}

// Main GraduatingStudentForm component
export function GraduatingStudentForm({
  defaultValues,
}: GraduatingStudentFormProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(
    defaultValues?.course || null
  );
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<GraduatingStudentFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      studentId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      course: "",
      program: "",
      yearLevel: "4th Year",
      classification: "Graduate",
    },
  });

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    form.setValue("program", "");
  };

  const onSubmit = async (values: GraduatingStudentFormData) => {
    try {
      setLoading(true);
      if (defaultValues) {
        await updateStudent(
          values.studentId,
          values.firstName,
          values.middleName || "",
          values.lastName,
          values.email,
          values.contactNumber,
          values.course,
          values.program,
          values.yearLevel,
          values.classification
        );
      } else {
        await createStudent(
          values.studentId,
          values.firstName,
          values.middleName || "",
          values.lastName,
          values.email,
          values.contactNumber,
          values.course,
          values.program,
          values.yearLevel,
          values.classification
        );
        router.push(`/guidance/career`);
      }
      toast({
        title: "Graduation Record",
        description: defaultValues
          ? "Successfully Saved Graduation Record"
          : "Successfully Submitted Graduation Record",
      });
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Error in submitting your record. Please try again later.",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const programsForSelectedCourse =
    departments.find((course) => course.name === selectedCourse)?.programs ||
    [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="flex flex-wrap gap-10">
          <div className="flex-1">
            {/* Student ID */}
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Student ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Middle Name */}
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Middle Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* contactNumber */}
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            {/* Course */}
            <FormField
              control={form.control}
              name="course"
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
                        <SelectValue placeholder="Select course" />
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
                        <SelectItem
                          key={program.shortname}
                          value={program.name}
                        >
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classification</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select classification" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Non Graduate">Non Graduate</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Submit button */}
        <Button type="submit" disabled={loading}>
          {defaultValues ? "Update Record" : "Submit Graduation Record"}
        </Button>
      </form>
    </Form>
  );
}
