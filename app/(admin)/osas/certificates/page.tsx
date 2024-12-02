import { getCertificateRequests } from "@/actions/certificate.action";
import { CertificateRequestTable } from "@/components/admin/CertificateRequestTable";
import { FormModal } from "@/components/admin/FormModal";
import CertificateForm from "@/components/forms/GoodMoralForm";
import LeadershipForm from "@/components/forms/LeadershipForm";
import { RequestStatistics } from "./RequestStatistics";

export default async function CertificatesPage() {
  const requests = (await getCertificateRequests()) || [];

  return (
    <main className="p-10">
      <RequestStatistics data={requests} />
      <section className="flex gap-2 my-10">
        <FormModal title="Create Good Moral Certificate">
          <CertificateForm />
        </FormModal>
        <FormModal title="Create Leadership Certificate">
          <LeadershipForm />
        </FormModal>
      </section>
      <CertificateRequestTable data={requests} />
    </main>
  );
}
