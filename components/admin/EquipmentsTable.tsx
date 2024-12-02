"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import Link from "next/link";

const availabilityStatuses = ["All", "Available", "Unavailable"];

export function EquipmentsTable({ data }: { data: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6; // Adjust this for the number of cards per page

  // Filter data based on search term and availability
  const filteredData = data
    .filter((equipment) =>
      equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((equipment) =>
      filterAvailability && filterAvailability !== "All"
        ? filterAvailability === "Available"
          ? equipment.isAvailable
          : !equipment.isAvailable
        : true
    );

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

  const handleAvailabilityFilterChange = (value: string) => {
    setFilterAvailability(value === "All" ? "" : value); // Reset filter if "All" is selected
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
          placeholder="Search by equipment name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-1/2"
        />
        <Select onValueChange={handleAvailabilityFilterChange}>
          <SelectTrigger className="w-1/4">
            <span>{filterAvailability || "Filter by availability"}</span>
          </SelectTrigger>
          <SelectContent>
            {availabilityStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Equipment Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.length > 0 ? (
          paginatedData.map((equipment) => (
            <div
              key={equipment.id}
              className="relative rounded-lg overflow-hidden shadow-lg h-64"
              style={{
                backgroundImage: `url(${equipment.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>

              {/* Equipment Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                <h3 className="font-semibold text-lg">{equipment.name}</h3>
                <p className="text-sm">{equipment.brand}</p>
                <p className="text-sm">Php{equipment.price.toFixed(2)}</p>
                <p className="text-sm">Quantity: {equipment.quantity}</p>
                <p
                  className={`text-sm mt-2 ${
                    equipment.isAvailable ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {equipment.isAvailable ? "Available" : "Unavailable"}
                </p>
                <p className="text-xs">
                  Date Bought:{" "}
                  {new Date(equipment.dateBought).toLocaleDateString()}
                </p>
                <Button className="mt-2 w-full">
                  <Link href={`equipments/${equipment.id}`}>View</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full">No equipment found.</div>
        )}
      </div>

      {/* Pagination Controls */}
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
