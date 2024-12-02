import { AdmissionForm } from '@/components/forms/AdmissionForm';

export default function CreateAdmissionPage() {
	return (
		<main className="p-4">
			<h1 className="text-primary text-2xl font-bold mb-4">Create Admission</h1>
			<AdmissionForm admissionNo="2" />
		</main>
	);
}
