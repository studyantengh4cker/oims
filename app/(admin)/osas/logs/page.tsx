import { Logs } from "./Logs";

export default function LogsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">Activity Logs</h1>
      <Logs office="OSAS" />
    </div>
  );
}
