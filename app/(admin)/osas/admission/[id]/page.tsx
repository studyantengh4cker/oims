import { getAdmissionById } from "@/actions/admission.action";
import AdmissionContainer from "./Admission";

export default async function OsasAdmissionPage({ params }: { params: any }) {
  if (!params) return null;

  const admission = await getAdmissionById(params.id);
  if (!admission) return <>Admission not found</>;

  const data = { ...admission, ...admission.student };

  return <AdmissionContainer admission={data} />;
}
