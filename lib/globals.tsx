import { Requirement } from "@prisma/client";
import {
  PieChartIcon,
  BookIcon,
  CalendarCheck,
  BaggageClaimIcon,
  HardHatIcon,
  Paperclip,
  Pin,
  BookDashed,
} from "lucide-react"; // Ensure you import all icons

export const osasLinks = [
  { tag: "Dashboard", href: "/osas", icon: <PieChartIcon /> },
  { tag: "Admission", href: "/osas/admission", icon: <BookIcon /> },
  { tag: "Events", href: "/osas/events", icon: <CalendarCheck /> },
  { tag: "Equipments", href: "/osas/equipments", icon: <BaggageClaimIcon /> },
  { tag: "Certificates", href: "/osas/certificates", icon: <Paperclip /> },
  { tag: "Disciplinary Notes", href: "/osas/notes", icon: <Pin /> },
  { tag: "Logs", href: "/osas/logs", icon: <BookDashed /> },
];

export const guidanceLinks = [
  { tag: "Dashboard", href: "/guidance", icon: <PieChartIcon /> },
  { tag: "Admission", href: "/guidance/admission", icon: <BookIcon /> },
  { tag: "Disciplinary Notes", href: "/guidance/notes", icon: <Pin /> },
  { tag: "Career", href: "/guidance/career", icon: <HardHatIcon /> },
  { tag: "Logs", href: "/guidance/logs", icon: <BookDashed /> },
];

export interface Admission {
  id: string;
  studentId: string;
  yearLevel: string;
  admissionType: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  contactNumber: string;
  course: string;
  program: string;
  classification: string;
  admissionNo: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  requirements: Requirement[];
}

export interface Event {
  id: string; // Unique identifier for the event
  colorId: string; // Color identifier (corresponding to your color list)
  summary: string; // Summary or description of the event
  location: string | null;
  start: {
    dateTime: string | null; // Start date and time in ISO 8601 format
  };
  end: {
    dateTime: string | null; // End date and time in ISO 8601 format
  };
  calendarId: string;
  status: string;
}

export const departments = [
  {
    name: "College Of Computer Studies",
    shortname: "CCS",
    logo: "/colleges/ccs.png",
    colorId: "10",
    programs: [
      {
        name: "Bachelor of Science in Information Technology",
        shortname: "BSIT",
      },
    ],
  },
  {
    name: "College Of Arts and Sciences",
    shortname: "CAS",
    logo: "/colleges/cas.png",
    colorId: "6",
    programs: [
      {
        name: "Bachelor of Arts in English Language",
        shortname: "BAEL",
      },
    ],
  },
  {
    name: "College of Criminology",
    shortname: "COC",
    logo: "/colleges/coc.png",
    colorId: "8",
    programs: [
      {
        name: "Bachelor of Science in Criminology",
        shortname: "BSCrim",
      },
    ],
  },
  {
    name: "College of Business Administration",
    shortname: "CBA",
    logo: "/colleges/cba.png",
    colorId: "5", // No match found
    programs: [
      {
        name: "Bachelor of Science in Business Administration",
        shortname: "BSBA",
      },
    ],
  },
  {
    name: "Basic Education Department",
    shortname: "BED",
    logo: "/colleges/ced.png",
    colorId: "4", // No match found
    programs: [
      {
        name: "Elementary Education",
        shortname: "ElemEd",
      },
      {
        name: "Secondary Education",
        shortname: "SecEd",
      },
    ],
  },
  {
    name: "College of Engineering",
    shortname: "COE",
    logo: "/colleges/coe.png",
    colorId: "9",
    programs: [
      {
        name: "Bachelor of Science in Civil Engineering",
        shortname: "BSCE",
      },
      {
        name: "Bachelor of Science in Electrical Engineering",
        shortname: "BSEE",
      },
    ],
  },
];

export const venues = [
  "Covered Court",
  "School Ground",
  "Auditorium",
  "Library",
  "QUAD/CC",
  "OSAS Activity Area",
  "Accreditation Room",
  "Off-campus",
  "CC/AVR1/QUAD",
  "CC/AVR 1",
  "Others",
  "ICT Room",
  "Computer Laboratory",
  "Volleyball Court",
  "Basketball Court",
  "Stage",
  "Quadrangle",
  "AVR 2",
  "AVR 1",
];
