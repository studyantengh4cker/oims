"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { StatusBadge } from "../StatusBadge";
import Link from "next/link";
import { departments } from "@/lib/globals";

const statuses = ["All", "Complete", "Incomplete"]; // Added "All"

export function AdmissionTable({ data }: { data: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  console.log(data);

  // Filter data based on search term and selected status
  const filteredData = data
    .filter((admission) => {
      const fullName = `${admission.student.firstName} ${
        admission.student.middleName || ""
      } ${admission.student.lastName}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter((admission) => {
      return filterStatus && filterStatus !== "All"
        ? admission.status === filterStatus
        : true; // Allow all statuses if "All" is selected
    })
    .filter((admission) => {
      return filterCollege ? admission.student.course === filterCollege : true;
    });

  // Calculate pagination data
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (value: string) => {
    setFilterStatus(value === "All" ? "" : value); // Reset status filter if "All" is selected
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleCollegeFilterChange = (value: string) => {
    setFilterCollege(value === "All" ? "" : value); // Reset college filter if "All" is selected
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Search and Filter Inputs */}
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-1/2"
        />
        <Select onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-1/4">
            <span>{filterStatus || "Filter by status"}</span>
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleCollegeFilterChange}>
          <SelectTrigger className="w-1/4">
            <span>{filterCollege || "Filter by college"}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem> {/* Added "All" option */}
            {departments.map((department) => (
              <SelectItem key={department.shortname} value={department.name}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((admission) => (
              <TableRow key={admission.id}>
                <TableCell className="font-medium">
                  {admission.student.firstName} {admission.student.middleName}{" "}
                  {admission.student.lastName}
                </TableCell>
                <TableCell>{admission.student.course}</TableCell>
                <TableCell>
                  <StatusBadge status={admission.status} />
                </TableCell>
                <TableCell>
                  {new Date(admission.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex items-center gap-4">
                  <Button>
                    <Link href={`admission/${admission.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No admissions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
