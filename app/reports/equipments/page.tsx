"use client";

import { useEffect, useState } from "react";
import { getAllBorrowHistory, getEquipments } from "@/actions/equipment.action";
import Loading from "@/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Import Label from ShadCN
import { departments } from "@/lib/globals"; // Assuming `departments` contains department data
import { EquipmentReport } from "./EquipmentReport";
import { PDFViewer } from "@react-pdf/renderer";

export default function EquipmentsReportPage() {
  const [equipments, setEquipments] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const historyData = await getAllBorrowHistory();
      setEquipments((await getEquipments()) || []);
      setHistory(historyData || []);
      setFilteredHistory(historyData || []);
    }
    fetchData();
    setIsClient(true);
  }, []);

  useEffect(() => {
    let filtered = history;

    // Filter by department
    if (departmentFilter !== "All") {
      filtered = filtered.filter(
        (item) => item.request.event.colorId === departmentFilter
      );
    }

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by fromDate
    if (fromDate) {
      filtered = filtered.filter(
        (item) => new Date(item.request.dateRequested) >= new Date(fromDate)
      );
    }

    // Filter by toDate
    if (toDate) {
      filtered = filtered.filter(
        (item) => new Date(item.request.dateRequested) <= new Date(toDate)
      );
    }

    setFilteredHistory(filtered);
  }, [statusFilter, departmentFilter, fromDate, toDate, history]);

  if (!isClient) return <Loading />;

  return (
    <main className="bg-primary">
      {/* Filter Section */}
      <div className="flex flex-wrap space-x-4 p-4">
        {/* Status Filter */}
        <div>
          <Label
            htmlFor="status-filter"
            className="mb-2 text-primary-foreground"
          >
            Filter by Status
          </Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white" id="status-filter">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Not Returned">Not Returned</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter */}
        <div>
          <Label
            htmlFor="department-filter"
            className="mb-2 text-primary-foreground"
          >
            Filter by Department
          </Label>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="bg-white" id="department-filter">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.colorId} value={dept.colorId}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From Date Filter */}
        <div>
          <Label htmlFor="from-date" className="mb-2 text-primary-foreground">
            From Date
          </Label>
          <input
            type="date"
            id="from-date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2 py-1 w-full"
          />
        </div>

        {/* To Date Filter */}
        <div>
          <Label htmlFor="to-date" className="mb-2 text-primary-foreground">
            To Date
          </Label>
          <input
            type="date"
            id="to-date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2 py-1 w-full"
          />
        </div>
      </div>
      <PDFViewer className="w-full h-screen">
        <EquipmentReport
          borrowHistory={filteredHistory}
          equipments={equipments}
          filters={{
            status: statusFilter,
            college: departmentFilter,
            fromDate,
            toDate,
          }}
        />
      </PDFViewer>
    </main>
  );
}
