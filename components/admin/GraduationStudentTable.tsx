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

const statuses = ["All", "Graduate", "Undergraduate"];

export function GraduatingStudentTable({ data }: { data: any[] | null }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter data based on search term, status, and course
  const filteredData = data!
    .filter((student) => student.classification === "Graduate") // Filter for graduates only
    .filter((student) => {
      const fullName = `${student.firstName} ${student.middleName || ""} ${
        student.lastName
      }`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter((student) => {
      return filterCourse ? student.course === filterCourse : true;
    });

  // Calculate pagination data
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setFilterStatus(value === "All" ? "" : value);
    setCurrentPage(1);
  };

  const handleCourseFilterChange = (value: string) => {
    setFilterCourse(value === "All" ? "" : value);
    setCurrentPage(1);
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
        <Select onValueChange={handleCourseFilterChange}>
          <SelectTrigger className="w-1/4">
            <span>{filterCourse || "Filter by course"}</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="College of Criminology">
              College of Criminology
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell className="font-medium">
                  {student.firstName} {student.middleName} {student.lastName}
                </TableCell>
                <TableCell>{student.course}</TableCell>
                <TableCell>
                  <StatusBadge status={student.classification} />
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.contactNumber}</TableCell>
                <TableCell className="flex items-center gap-4">
                  <Button>
                    <Link href={`students/${student.studentId}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No graduating students found.
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
