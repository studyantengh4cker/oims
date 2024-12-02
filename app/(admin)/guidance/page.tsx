import { getOfficeUsers } from "@/actions/office.action";
import { DataTable } from "@/components/admin/DataTable";
import { FormModal } from "@/components/admin/FormModal";
import { AccountForm } from "@/components/forms/AccountForm";
import { accountColumn } from "@/lib/columns";

export default async function GuidancePage() {
  const members = await getOfficeUsers("GUIDANCE");
  return (
    <main className="space-y-10">
      <section
        className="text-center p-16 bg-primary rounded-md bg-gradient-to-r from-red-900 via-red-800 to-red-700"
        style={{
          background: `linear-gradient(rgba(255, 0, 0, 0.089), rgba(0, 0, 0, 0.473)), url("/0.jpg") no-repeat center center / cover`,
        }}
      >
        <h1 className="text-3xl font-bold text-primary-foreground">
          GUIDANCE OFFICE
        </h1>
      </section>
      <FormModal title="Add Account">
        <AccountForm office="GUIDANCE" />
      </FormModal>
      <DataTable columns={accountColumn} data={members} />
    </main>
  );
}
