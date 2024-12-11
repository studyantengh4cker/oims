"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { getAllAdmission } from "@/actions/admission.action";
import AdmissionSummaryReport from "./AdmissionReport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label"; // Import Label from ShadCN
import { departments } from "@/lib/globals";
import Loading from "@/components/Loading";

export default function AdmissionReportsPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [admissionTypeFilter, setAdmissionTypeFilter] = useState<string>("All");
  const [collegeFilter, setCollegeFilter] = useState<string>("All");
  const [programFilter, setProgramFilter] = useState<string>("All");
  const [availablePrograms, setAvailablePrograms] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Date filters
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  useEffect(() => {
    async function fetchAdmissions() {
      const admissions = await getAllAdmission();
      setAdmissions(admissions || []);
      setFilteredAdmissions(admissions || []);
    }
    fetchAdmissions();
    setIsClient(true);
  }, []);

  useEffect(() => {
    let filtered = admissions;

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (admission) => admission.status === statusFilter
      );
    }

    if (admissionTypeFilter !== "All") {
      filtered = filtered.filter(
        (admission) => admission.admissionType === admissionTypeFilter
      );
    }

    if (collegeFilter !== "All") {
      filtered = filtered.filter(
        (admission) => admission.student.course === collegeFilter
      );
    }

    if (programFilter !== "All") {
      filtered = filtered.filter(
        (admission) => admission.student.program === programFilter
      );
    }
    // Apply date filtering
    if (fromDate) {
      filtered = filtered.filter(
        (admission) => new Date(admission.createdAt) >= new Date(fromDate)
      );
    }

    if (toDate) {
      filtered = filtered.filter(
        (admission) => new Date(admission.createdAt) <= new Date(toDate)
      );
    }

    setFilteredAdmissions(filtered);
  }, [
    statusFilter,
    admissionTypeFilter,
    collegeFilter,
    programFilter,
    fromDate,
    toDate,
    admissions,
  ]);

  useEffect(() => {
    // Update the available programs based on the selected college
    const selectedCollege = departments.find(
      (dept) => dept.name === collegeFilter
    );
    setAvailablePrograms(selectedCollege ? selectedCollege.programs : []);
    setProgramFilter("All"); // Reset program filter when college changes
  }, [collegeFilter]);

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
              <SelectItem value="Complete">Complete</SelectItem>
              <SelectItem value="Incomplete">Incomplete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Admission Type Filter */}
        <div className="">
          <Label
            htmlFor="admission-type-filter"
            className="mb-2 text-primary-foreground"
          >
            Filter by Admission Type
          </Label>
          <Select
            value={admissionTypeFilter}
            onValueChange={(value) => setAdmissionTypeFilter(value)}
          >
            <SelectTrigger className="bg-white" id="admission-type-filter">
              <SelectValue placeholder="Select Admission Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* College Filter */}
        <div className="">
          <Label
            htmlFor="college-filter"
            className="mb-2 text-primary-foreground"
          >
            Filter by College
          </Label>
          <Select
            value={collegeFilter}
            onValueChange={(value) => setCollegeFilter(value)}
          >
            <SelectTrigger className="bg-white" id="college-filter">
              <SelectValue placeholder="Select College" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.shortname} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Program Filter */}
        <div className="">
          <Label
            htmlFor="program-filter"
            className="mb-2 text-primary-foreground"
          >
            Filter by Program
          </Label>
          <Select
            value={programFilter}
            onValueChange={(value) => setProgramFilter(value)}
          >
            <SelectTrigger className="bg-white" id="program-filter">
              <SelectValue placeholder="Select Program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {availablePrograms.map((program) => (
                <SelectItem key={program.shortname} value={program.name}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Filters */}
        <div className="">
          <Label htmlFor="from-date" className="mb-2 text-primary-foreground">
            From Date
          </Label>
          <input
            type="date"
            id="from-date"
            className="w-full bg-white border border-gray-300 rounded px-2 py-1"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="">
          <Label htmlFor="to-date" className="mb-2 text-primary-foreground">
            To Date
          </Label>
          <input
            type="date"
            id="to-date"
            className="w-full bg-white border border-gray-300 rounded px-2 py-1"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>
      {/* PDF Viewer */}
      <PDFViewer className="w-full h-screen mt-4">
        <AdmissionSummaryReport
          admissionData={filteredAdmissions}
          filters={{
            status: statusFilter,
            admissionType: admissionTypeFilter,
            college: collegeFilter,
            program: programFilter,
            fromDate,
            toDate,
          }}
        />
      </PDFViewer>
    </main>
  );
}
