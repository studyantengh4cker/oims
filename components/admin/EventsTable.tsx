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

const eventColors: { [key: string]: string } = {
  "1": "bg-blue-400", // Lavender (#7986CB)
  "2": "bg-green-500", // Sage (#33B679)
  "3": "bg-purple-600", // Grape (#8E24AA)
  "4": "bg-red-400", // Flamingo (#E67C73)
  "5": "bg-yellow-500", // Banana (#F6BF26)
  "6": "bg-orange-500", // Tangerine (#F4511E)
  "7": "bg-cyan-500", // Peacock (#039BE5)
  "8": "bg-gray-500", // Graphite (#616161)
  "9": "bg-blue-500", // Blueberry (#3F51B5)
  "10": "bg-green-600", // Basil (#0B8043)
  "11": "bg-red-600", // Tomato (#D50000)
};

const statuses = ["All", "Ongoing", "Complete", "Pending"]; // Include all relevant statuses
const colleges: { [key: string]: string } = {
  "10": "CCS",
  "6": "CAS",
  "4": "CED",
  "9": "COE",
  "8": "COC",
  "11": "SPC",
};

export function EventsTable({ data }: { data: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCollege, setFilterCollege] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filter data based on search term, selected status, and college
  const filteredData = data
    .filter((event) => {
      return event.summary.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter((event) => {
      return filterStatus && filterStatus !== "All"
        ? event.status === filterStatus
        : true;
    })
    .filter((event) => {
      return filterCollege ? event.colorId === filterCollege : true;
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
    setFilterCollege(value); // Update college filter
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      {/* Search and Filter Inputs */}
      <div className="flex justify-between mb-4 gap-4">
        <Input
          type="text"
          placeholder="Search by summary..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-1/3"
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
            <span>{colleges[filterCollege] || "Filter by college"}</span>
          </SelectTrigger>
          <SelectContent>
            {Object.entries(colleges).map(([colorId, collegeName]) => (
              <SelectItem key={colorId} value={colorId}>
                {collegeName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Summary</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Requirements</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">
                  <div
                    className={`${
                      eventColors[event.colorId] || "bg-gray-500"
                    } rounded-lg p-1 text-white`}
                  >
                    {event.summary}
                  </div>
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.status}</TableCell>
                <TableCell>
                  {event.hasEvaluationReport &&
                  event.hasPostActivityRequirements
                    ? "Complete"
                    : "Incomplete"}
                </TableCell>

                <TableCell>
                  {new Date(event.start).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(event.end).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button>
                    <a href={`events/${event.id}`}>View</a>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No events found.
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
