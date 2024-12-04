import { getOfficeUsers } from "@/actions/office.action";
import { accountColumn } from "@/lib/columns";
import { DataTable } from "@/components/admin/DataTable";
import { AccountForm } from "@/components/forms/AccountForm";
import { FormModal } from "@/components/admin/FormModal";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default function OsasPage() {
  return (
    <main className="space-y-10">
      <section
        className="text-center p-16 bg-primary rounded-md bg-gradient-to-r from-red-900 via-red-800 to-red-700"
        style={{
          background: `linear-gradient(rgba(255, 0, 0, 0.089), rgba(0, 0, 0, 0.473)), url("/0.jpg") no-repeat center center / cover`,
        }}
      >
        <h1 className="text-3xl font-bold text-primary-foreground">
          OFFICE OF STUDENT AFFAIRS AND SERVICES
        </h1>
      </section>

      <FormModal title="Add Account">
        <AccountForm office="OSAS" />
      </FormModal>
      <Suspense fallback={<Loading />}>
        <UsersTable />
      </Suspense>
    </main>
  );
}

async function UsersTable() {
  const members = await getOfficeUsers("OSAS");
  return <DataTable columns={accountColumn} data={members} />;
}
