"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { getAdmissionByNumber } from "@/actions/admission.action";
import AdmissionSummaryReport from "./AdmissionReport";

export default function AdmissionReportsPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    async function fetchAdmissions() {
      const admissions = await getAdmissionByNumber("2");
      console.log(admissions);
      setAdmissions(admissions || []);
    }
    fetchAdmissions();

    setIsClient(true);
  }, []);

  if (!isClient) return;

  return (
    <PDFViewer className="w-full h-screen">
      <AdmissionSummaryReport admissionData={admissions} />
    </PDFViewer>
  );
}
