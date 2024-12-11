"use client";

const purposes = [
  "Admission to Higher Education",
  "Admission to Graduate Program",
  "Awards/Graduation Requirement",
  "Board Examination",
  "Civil Service Requirement",
  "Disciplinary Proceedings",
  "Employment",
  "Internship/OJT",
  "Membership to Organizations",
  "Participation to Competition",
  "Professional Licensing (PRC) Requirement",
  "Promotion",
  "Scholarship Application/ or Update Requirement",
  "Transfer to Another School",
  "Others",
];

import { getNotesByStudentId } from "@/actions/note.action";
import { useEffect, useState } from "react";
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
import { departments } from "@/lib/globals";

export default function CertificateForm() {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [osasDean, setOsasDean] = useState("DIANNE THERESE MARIE C. BAHALA");
  const [cocDean, setCOCDean] = useState("CHARLYN S. JANOG, Phd Crim");
  const [selectedPurpose, setSelectedPurpose] = useState("Others");
  const [controlNumber, setControlNumber] = useState("123");
  const [selectedCollege, setSelectedCollege] = useState(""); // Track selected college

  const [hasViolation, setHasViolation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    await createCertificate({
      certificateType: "Good Moral",
      status: "Pending",
      studentId,
      name: studentName,
      purpose: selectedPurpose,
      osasDean,
      cocDean: selectedCollege === "College of Criminology" ? cocDean : null,
      controlNumber,
      hasViolation,
    });
  };

  useEffect(() => {
    setLoading(true);
    async function check() {
      const notes = await getNotesByStudentId(studentId);
      if (notes) {
        setHasViolation(true);
        console.log(notes);
      } else {
        setHasViolation(false);
      }
      setLoading(false);
    }
    if (studentId.length >= 9) {
      check();
    }
  }, [studentId]);

  return (
    <form className="space-y-4 w-[20rem]" onSubmit={handleCreate}>
      <div className="mt-4">
        {studentId.length >= 9 && (
          <div
            className={`p-4 rounded-md text-sm font-medium ${
              loading
                ? "bg-blue-100 text-blue-700" // Loading state colors
                : hasViolation
                ? "bg-red-100 text-red-700" // Violation colors
                : "bg-green-100 text-green-700" // No violation colors
            }`}
          >
            {loading
              ? "Loading violation status..." // Display this while loading
              : hasViolation
              ? "The student has violations. Please review."
              : "The student has no violations. Good to proceed!"}
          </div>
        )}
      </div>
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
        <Label htmlFor="college">College</Label>
        <Select
          name="college"
          value={selectedCollege}
          onValueChange={(value) => setSelectedCollege(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select College" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((course) => (
              <SelectItem key={course.name} value={course.name}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      {selectedCollege === "College of Criminology" && (
        <div>
          <Label htmlFor="cocDean">COC Dean</Label>
          <Input
            placeholder="COC Dean"
            name="cocDean"
            id="cocDean"
            value={cocDean}
            onChange={(e) => setCOCDean(e.target.value)}
          />
        </div>
      )}
      <div>
        <Label htmlFor="purpose">Purpose</Label>
        <Select
          value={selectedPurpose}
          onValueChange={(value) => setSelectedPurpose(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Purpose" />
          </SelectTrigger>
          <SelectContent>
            {purposes.map((purpose, i) => (
              <SelectItem value={purpose} key={i}>
                {purpose}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Button disabled={submitting}>Submit</Button>
      </div>
    </form>
  );
}
