import { getAllBorrowHistory } from "@/actions/equipment.action";
import { BorrowHistoryTable } from "@/components/admin/BorrowHistoryTable";

export async function EquipmentHistory() {
  const history = (await getAllBorrowHistory()) || [];

  return (
    <main className="p-10 bg-white rounded-lg drop-shadow-lg mt-10">
      <h1 className="text-lg font-bold text-primary mb-5">Borrow History</h1>
      <BorrowHistoryTable data={history} />
    </main>
  );
}
