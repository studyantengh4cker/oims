import { getCertificateRequest } from "@/actions/certificate.action";
import { Viewer } from "./PDF";

export default async function RequestPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) return;

  const request = await getCertificateRequest(params.id);
  if (!request) return <>Request not found</>;

  return <Viewer request={request} />;
}
