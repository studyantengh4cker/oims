"use client";

import { CertificateRequest } from "@prisma/client";
import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import GoodMoral from "../GoodMoral";
import LeadershipCertificate from "../Leadership";
import Loading from "@/components/Loading";

export function Viewer({ request }: { request: CertificateRequest }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Loading />;

  return (
    <PDFViewer className="w-full h-screen">
      {request.certificateType == "Good Moral" ? (
        <GoodMoral
          studentName={request.name}
          osasDean={request.osasDean}
          cocDean={request.cocDean}
          controlNumber={request.controlNumber}
          selectedPurpose={request.purpose as string}
        />
      ) : (
        <LeadershipCertificate
          studentName={request.name}
          deanName={request.osasDean}
          position={request.position as string}
          organization={request.organization as string}
          schoolYear={request.schoolYear as string}
          issueDate="12/12/12"
        />
      )}
    </PDFViewer>
  );
}
