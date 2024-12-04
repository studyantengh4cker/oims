import { getCertificateRequest } from "@/actions/certificate.action";
import { Viewer } from "./PDF";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function RequestPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) return;

  const request = await getCertificateRequest(params.id);
  if (!request) return <>Request not found</>;

  return (
    <>
      <Button asChild variant="link">
        <Link href="/osas/certificates">Back</Link>
      </Button>
      <Viewer request={request} />;
    </>
  );
}
