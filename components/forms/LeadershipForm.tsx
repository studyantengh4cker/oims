"use client";

const leadershipPositions = [
  "President",
  "Vice President",
  "Secretary",
  "Treasurer",
  "Public Information Officer",
  "Auditor",
  "PRO",
  "Other",
];

import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { createCertificate } from "@/actions/certificate.action";

export default function LeadershipForm() {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [leadershipPosition, setLeadershipPosition] = useState("Other");
  const [organization, setOrganization] = useState("");
  const [schoolYear, setSchoolYear] = useState("2023-2024");
  const [osasDean, setOsasDean] = useState("DIANNE THERESE MARIE C. BAHALA");
  const [controlNumber, setControlNumber] = useState("456");

  const handleCreate = async (e: any) => {
    e.preventDefault();
    await createCertificate({
      certificateType: "Leadership",
      status: "Pending",
      studentId,
      name: studentName,
      osasDean,
      controlNumber,
      position: leadershipPosition,
      organization,
      schoolYear,
    });
  };

  return (
    <form className="space-y-4 w-[20rem]" onSubmit={handleCreate}>
      <div>
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          placeholder="Student ID"
          name="studentId"
          id="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="studentName">Student Name</Label>
        <Input
          placeholder="Student Name"
          name="studentName"
          id="studentName"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="leadershipPosition">Leadership Position</Label>
        <Select
          value={leadershipPosition}
          onValueChange={(value) => setLeadershipPosition(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Position" />
          </SelectTrigger>
          <SelectContent>
            {leadershipPositions.map((position, i) => (
              <SelectItem value={position} key={i}>
                {position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="organization">Organization</Label>
        <Input
          placeholder="Organization"
          name="organization"
          id="organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="schoolYear">School Year</Label>
        <Input
          placeholder="School Year"
          name="schoolYear"
          id="schoolYear"
          value={schoolYear}
          onChange={(e) => setSchoolYear(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="osasDean">OSAS Dean</Label>
        <Input
          placeholder="OSAS Dean"
          name="osasDean"
          id="osasDean"
          value={osasDean}
          onChange={(e) => setOsasDean(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="controlNumber">Control Number</Label>
        <Input
          placeholder="Control Number"
          name="controlNumber"
          id="controlNumber"
          value={controlNumber}
          onChange={(e) => setControlNumber(e.target.value)}
        />
      </div>
      <div>
        <Button>Submit</Button>
      </div>
    </form>
  );
}
