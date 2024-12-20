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
import Link from "next/link";
import StatusSelect from "./StatusSelect";

const certificateTypes = ["All", "Good Moral", "Leadership"];
const statuses = ["All", "Pending", "Approved", "Declined"];

export function CertificateRequestTable({ data }: { data: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCertificateType, setFilterCertificateType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter data based on search term, certificate type, and status
  const filteredData = data
    .filter((request) =>
      request.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((request) =>
      filterCertificateType && filterCertificateType !== "All"
        ? request.certificateType === filterCertificateType
        : true
    )
    .filter((request) =>
      filterStatus && filterStatus !== "All"
        ? request.status === filterStatus
        : true
    );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCertificateTypeChange = (value: string) => {
    setFilterCertificateType(value === "All" ? "" : value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value === "All" ? "" : value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Search and Filters */}
      <div className="flex justify-between gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search by Student ID..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-1/3"
        />
        <Select onValueChange={handleCertificateTypeChange}>
          <SelectTrigger className="w-1/3">
            <span>{filterCertificateType || "Filter by Certificate Type"}</span>
          </SelectTrigger>
          <SelectContent>
            {certificateTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger className="w-1/3">
            <span>{filterStatus || "Filter by Status"}</span>
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Certificate Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Has Violation</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.certificateType}</TableCell>
                <TableCell>
                  <StatusSelect
                    id={request.id}
                    currentStatus={request.status}
                  />
                </TableCell>
                <TableCell>{request.name}</TableCell>
                <TableCell>{request.studentId}</TableCell>
                <TableCell>
                  {request.hasViolation ? (
                    <Link
                      href={`/osas/notes/${request.studentId}`}
                      className="hover:text-blue-600 underline"
                    >
                      Has Voilations
                    </Link>
                  ) : (
                    "None"
                  )}
                </TableCell>
                <TableCell>
                  {new Date(request.dateCreated).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link href={`certificates/${request.id}`}>View</Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No certificate requests found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
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
