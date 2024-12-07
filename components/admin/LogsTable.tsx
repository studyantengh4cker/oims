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

const roles = ["All", "ADMIN", "USER", "GUEST"];
const offices = ["All", "GUIDANCE", "REGISTRAR", "FINANCE"];

export function LogsTable({ data }: { data: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterOffice, setFilterOffice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Filter data based on search term, role, and office
  const filteredData = data
    .filter((log) =>
      log.userName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((log) =>
      filterRole && filterRole !== "All" ? log.role === filterRole : true
    )
    .filter((log) =>
      filterOffice && filterOffice !== "All"
        ? log.office === filterOffice
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

  const handleRoleChange = (value: string) => {
    setFilterRole(value === "All" ? "" : value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleOfficeChange = (value: string) => {
    setFilterOffice(value === "All" ? "" : value);
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
          placeholder="Search by User Name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-1/3"
        />
        <Select onValueChange={handleRoleChange}>
          <SelectTrigger className="w-1/3">
            <span>{filterRole || "Filter by Role"}</span>
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={handleOfficeChange}>
          <SelectTrigger className="w-1/3">
            <span>{filterOffice || "Filter by Office"}</span>
          </SelectTrigger>
          <SelectContent>
            {offices.map((office) => (
              <SelectItem key={office} value={office}>
                {office}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>System</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Device Info</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Office</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.system}</TableCell>
                <TableCell>{log.userName}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell>
                  {log.deviceInfo.deviceType}, {log.deviceInfo.browser},{" "}
                  {log.deviceInfo.os}
                </TableCell>
                <TableCell>{log.role}</TableCell>
                <TableCell>{log.office}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No logs found.
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
