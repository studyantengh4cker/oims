'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { useState } from 'react';
import { departments } from '@/lib/globals';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { createNote, updateNote } from '@/actions/note.action';

// Updated schema to include disciplinary notes
const schema = z.object({
	studentId: z.string().min(1, 'Student ID is required'),
	firstName: z.string().min(2, 'First name is required'),
	middleName: z.string().optional(),
	lastName: z.string().min(2, 'Last name is required'),
	email: z.string().email('Invalid email address'),
	contactNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
	course: z.string().min(1, 'Course is required'),
	program: z.string().min(1, 'Program is required'),
	yearLevel: z.string(),
	disciplinaryNotes: z.array(
		z.object({
			id: z.string().optional(),
			dateGiven: z.string(),
			note: z.string().min(1, 'Disciplinary note is required'),
		})
	),
});

export type NoteFormData = z.infer<typeof schema>;

interface NoteFormProps {
	defaultValues?: NoteFormData;
}

// Main NoteForm component
export function NotesForm({ defaultValues }: NoteFormProps) {
	const [selectedCourse, setSelectedCourse] = useState<string | null>(
		defaultValues?.course || null
	);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<NoteFormData>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues || {
			studentId: '',
			firstName: '',
			middleName: '',
			lastName: '',
			email: '',
			contactNumber: '',
			course: '',
			program: '',
			yearLevel: '',
			disciplinaryNotes: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'disciplinaryNotes',
	});

	const onSubmit = async (values: NoteFormData) => {
		try {
			setLoading(true);
			// Use updateNote if defaultValues is provided, otherwise use createNote
			if (defaultValues) {
				await updateNote(values);
				toast({
					title: 'Student Updated',
					description: 'Successfully updated student information with disciplinary notes',
				});
			} else {
				await createNote(values);
				toast({
					title: 'Student Created',
					description: 'Successfully submitted student information with disciplinary notes',
				});
			}
			router.push(`/osas/notes`);
		} catch (error) {
			toast({
				title: 'Submission Error',
				description: 'There was an error submitting the information. Please try again later.',
			});
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const programsForSelectedCourse =
		departments.find((course) => course.name === selectedCourse)?.programs || [];

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Responsive grid container */}
				<div className="grid gap-6 md:grid-cols-2">
					
					{/* Student Details Column */}
					<div className="space-y-3">
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
						<FormField
							control={form.control}
							name="course"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Course</FormLabel>
									<Select
										onValueChange={(value) => {
											field.onChange(value);
											setSelectedCourse(value);
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
											{programsForSelectedCourse.length > 0 ? (
												programsForSelectedCourse.map((program) => (
													<SelectItem key={program.shortname} value={program.name}>
														{program.name}
													</SelectItem>
												))
											) : (
												<SelectItem value="none">
													No programs available
												</SelectItem>
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Disciplinary Notes Column */}
					<div className="space-y-3 space-x-5">
						<FormLabel>Disciplinary Notes</FormLabel>
						{fields.map((note, index) => (
							<div key={note.id} className="flex space-x-4 items-center">
								<FormField
									control={form.control}
									name={`disciplinaryNotes.${index}.dateGiven`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input type="datetime-local" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name={`disciplinaryNotes.${index}.note`}
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input placeholder="Disciplinary Note" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="button" onClick={() => remove(index)}>
									Remove
								</Button>
							</div>
						))}
						<Button type="button" onClick={() => append({ dateGiven: '', note: '' })}>
							Add Note
						</Button>
					</div>
				</div>

				{/* Submit Button */}
				<Button type="submit" disabled={loading} className="w-full md:w-auto">
					{loading ? 'Submitting...' : 'Submit'}
				</Button>
			</form>
		</Form>
	);
}
