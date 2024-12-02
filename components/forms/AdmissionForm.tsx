'use client';

import { useForm } from 'react-hook-form';
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
import { Checkbox } from '../ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { createAdmission, updateAdmission } from '@/actions/admission.action';
import { useRouter } from 'next/navigation';

// Validation schema using Zod
const schema = z.object({
	id: z.string().optional(), // Optional field for update
	admissionNo: z.string().min(1, 'Admission Number required'),
	studentId: z.string(), // Student ID is required
	firstName: z.string().min(2, 'First name is required'),
	middleName: z.string().optional(), // Middle name is optional
	lastName: z.string().min(2, 'Last name is required'),
	classification: z.string().min(1, "Classification is required."),
	yearLevel: z.string(),
	email: z.string().email('Invalid email address'),
	contactNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
	course: z.string().min(1, 'Course is required'),
	program: z.string().min(1, 'Program is required'),
	requirements: z
		.array(
			z.object({
				name: z.string(),
				isSubmitted: z.boolean(),
			})
		)
		.refine(
			(requirements) => requirements.some((req) => req.isSubmitted),
			'You must submit at least one requirement'
		), // Ensure at least one requirement is submitted
	admissionType: z.string(),
});

export type AdmissionFormData = z.infer<typeof schema>;

interface AdmissionFormProps {
	defaultValues?: z.infer<typeof schema>; // Pre-filled values for edit mode
	admissionNo: string; // Admission number passed from props
}

// Main AdmissionForm component
export function AdmissionForm({
	defaultValues,
	admissionNo,
}: AdmissionFormProps) {
	// State hooks for course selection and loading state
	const [selectedCourse, setSelectedCourse] = useState<string | null>(
		defaultValues?.course || null
	);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	// React Hook Form setup with Zod validation
	const form = useForm<AdmissionFormData>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues || {
			admissionNo: admissionNo,
			studentId: '',
			firstName: '',
			middleName: '',
			lastName: '',
			classification: 'Non Graduate',
			email: '',
			contactNumber: '',
			course: '',
			program: '',
			requirements: [
				{ name: 'Grade 12 Report Card / Form 138', isSubmitted: false },
				{ name: 'Original Diploma / Graduation proof', isSubmitted: false },
				{ name: 'Good Moral Certificate', isSubmitted: false },
				{ name: '2x2 ID Picture (2 pcs)', isSubmitted: false },
				{ name: 'PSA Birth Certificate (photocopy)', isSubmitted: false },
			],
			admissionType: '',
		},
	});

	// Handles course change and resets the program when course changes
	const handleCourseChange = (value: string) => {
		setSelectedCourse(value);
		form.setValue('program', ''); // Reset program when course changes
	};

	// Handles the check/uncheck of the requirement items
	const handleCheck = (index: number, checked: boolean) => {
		const updated = [...form.getValues('requirements')];
		updated[index].isSubmitted = checked;
		form.setValue('requirements', updated);
	};

	const onSubmit = async (values: AdmissionFormData) => {
		try {
			setLoading(true);
			if (values.id) {
				await updateAdmission(values);
			} else {
				await createAdmission(values);
				router.push(`/osas/admission`);
			}
			toast({
				title: 'Admission',
				description: defaultValues
					? 'Successfully Saved Admission'
					: 'Successfully Submitted Admission',
			});
		} catch (error) {
			toast({
				title: 'Submission Error',
				description:
					'Error in submitting your submission. Please try again later.',
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
				{/* Contact Number */}
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
				<FormField
					control={form.control}
					name="classification"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Classification</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
									{programsForSelectedCourse.length > 0 ? (
										programsForSelectedCourse.map((program) => (
											<SelectItem key={program.shortname} value={program.name}>
												{program.name}
											</SelectItem>
										))
									) : (
										<SelectItem value={'none'}>
											No programs available
										</SelectItem>
									)}
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
				{/* Requirements Section */}
				<FormField
					control={form.control}
					name="requirements"
					render={() => (
						<FormItem>
							<FormLabel>Requirements</FormLabel>
							<div className="space-y-2">
								{form.getValues('requirements').map((req, index) => (
									<div key={index} className="flex items-center space-x-2">
										<Checkbox
											checked={req.isSubmitted}
											onCheckedChange={(checked) =>
												handleCheck(index, Boolean(checked))
											}
										/>
										<span>{req.name}</span>
									</div>
								))}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Admission Type */}
				<FormField
					control={form.control}
					name="admissionType"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Admission Type</FormLabel>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select admission type" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="New">New</SelectItem>
									<SelectItem value="Transfer">Transfer</SelectItem>
									<SelectItem value="Re-enrollment">Re-enrollment</SelectItem>
									{/* Add more options as needed */}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				{/* Submit Button */}
				<Button type="submit" disabled={loading}>
					{loading ? 'Submitting...' : 'Submit'}
				</Button>
			</form>
		</Form>
	);
}
