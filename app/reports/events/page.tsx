"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { getAllEvents } from "@/actions/event.action";
import EventSummaryReport from "./EventReport";
import Loading from "@/components/Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Import Label from ShadCN
import { departments } from "@/lib/globals";

export default function EventsReportPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    async function fetchEvents() {
      const events = await getAllEvents();
      setEvents(events || []);
      setFilteredEvents(events || []);
    }
    fetchEvents();

    setIsClient(true);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    // Filter by type
    if (typeFilter !== "All") {
      filtered = filtered.filter((event) => event.eventType === typeFilter);
    }

    // Filter by department
    if (departmentFilter !== "All") {
      filtered = filtered.filter((event) =>
        event.colorId.includes(departmentFilter)
      ); // Adjust according to your data structure
    }

    // Apply date filtering
    if (fromDate) {
      filtered = filtered.filter(
        (event) => new Date(event.start) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (event) => new Date(event.start) <= new Date(toDate)
      );
    }

    setFilteredEvents(filtered);
  }, [statusFilter, typeFilter, departmentFilter, fromDate, toDate, events]);

  if (!isClient) return <Loading />;

  return (
    <main className="bg-primary">
      {/* Filter Section */}
      <div className="flex flex-wrap space-x-4 p-4">
        {/* Status Filter */}
        <div className="">
          <Label
            htmlFor="status-filter"
            className="mb-2 text-primary-foreground"
          >
            Filter by Status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="bg-white" id="status-filter">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div className="">
          <Label htmlFor="type-filter" className="mb-2 text-primary-foreground">
            Filter by Type
          </Label>
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value)}
          >
            <SelectTrigger className="bg-white" id="type-filter">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Non-Curricular">Non-Curricular</SelectItem>
              <SelectItem value="Curricular">Curricular</SelectItem>
              <SelectItem value="Co-Curricular">Co-Curricular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter */}
        <div className="">
          <Label
            htmlFor="department-filter"
            className="mb-2 text-primary-foreground"
          >
            Filter by Department
          </Label>
          <Select
            value={departmentFilter}
            onValueChange={(value) => setDepartmentFilter(value)}
          >
            <SelectTrigger className="bg-white" id="department-filter">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.name} value={dept.colorId}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From Date Filter */}
        <div className="">
          <Label htmlFor="from-date" className="mb-2 text-primary-foreground">
            From Date
          </Label>
          <input
            type="date"
            id="from-date"
            className="bg-white border border-gray-300 rounded px-2 py-1 w-full"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* To Date Filter */}
        <div className="">
          <Label htmlFor="to-date" className="mb-2 text-primary-foreground">
            To Date
          </Label>
          <input
            type="date"
            id="to-date"
            className="bg-white border border-gray-300 rounded px-2 py-1 w-full"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* PDF Viewer */}
      <PDFViewer className="w-full h-screen">
        <EventSummaryReport
          events={filteredEvents}
          filters={{
            status: statusFilter,
            eventType: typeFilter,
            college: departmentFilter,
            fromDate,
            toDate,
          }}
        />
      </PDFViewer>
    </main>
  );
}
