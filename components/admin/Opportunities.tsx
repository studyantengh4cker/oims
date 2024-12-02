"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

export function Opportunities({ data }: { data: any[] | null }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredData =
    data?.filter((opportunity) =>
      opportunity.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((opportunity) => (
            <Card key={opportunity.id} className="shadow-lg border">
              <CardHeader>
                <CardTitle>{opportunity.title}</CardTitle>
                <CardDescription>
                  {new Date(opportunity.dateCreated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Description:</strong> {opportunity.description}
                </p>
                <p>
                  <strong>Department:</strong> {opportunity.department}
                </p>
                <p>
                  <strong>Program:</strong> {opportunity.program}
                </p>
              </CardContent>
              <div className="p-4">
                <Button className="w-full" asChild>
                  <Link
                    href={`/guidance/career/opportunities/${opportunity.id}`}
                  >
                    View Details
                  </Link>
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p>No opportunities found.</p>
        )}
      </div>
    </div>
  );
}
