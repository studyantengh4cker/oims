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
import { StatusBadge } from "../StatusBadge";
import Link from "next/link";

export function BorrowHistoryTable({ data }: { data: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    const equipmentName = item.equipment.name.toLowerCase();
    const borrower = item.request.requestor.toLowerCase();
    return (
      equipmentName.includes(searchTerm.toLowerCase()) ||
      borrower.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by equipment or borrower..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-1/2"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipment Name</TableHead>
            <TableHead>Quantity Borrowed</TableHead>
            <TableHead>Borrowed Date</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Borrower</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.equipment.name}
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {new Date(item.request.dateRequested).toLocaleString()}
                </TableCell>
                <TableCell>{item.request.event.summary}</TableCell>
                <TableCell>{item.request.requestor}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <Button asChild variant="link">
                    <Link href={`/osas/events/${item.request.event.id}`}>
                      View
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No borrowing history found.
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
