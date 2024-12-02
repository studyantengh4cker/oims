"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { BellIcon } from "lucide-react";
import { useState } from "react";

const initialNotifications = [
  {
    id: 1,
    message:
      "🚨 Equipment Alert: The following equipment has expired: Projector.",
    isRead: false,
  },
  {
    id: 2,
    message:
      "⚠️ Notice: Equipment Laptop has reached its expiration date. Ensure to replace or renew it.",
    isRead: false,
  },
  {
    id: 3,
    message:
      "📥 New Submission: A new student admission form has been submitted by John Doe. Check the details!",
    isRead: false,
  },
  {
    id: 4,
    message:
      "📄 New Admission Alert: Jane Smith has submitted her application. Review it in the admissions section.",
    isRead: true,
  },
  {
    id: 5,
    message:
      "📅 Upcoming Event: The Annual Sports Day is scheduled for November 15th at 10 AM. Don’t miss out!",
    isRead: false,
  },
  {
    id: 6,
    message:
      "🔔 Reminder: The Faculty Meeting is approaching on November 10th. Please make sure to prepare accordingly.",
    isRead: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="text-primary">
          <BellIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] mr-4">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map(({ id, message, isRead }) => (
          <DropdownMenuItem
            key={id}
            onClick={() => handleNotificationClick(id)}
            className={`flex items-center p-2 transition-colors duration-200 ${
              isRead
                ? "text-gray-500"
                : "text-black bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {message}
            {!isRead && <span className="ml-2 text-red-500">•</span>}{" "}
            {/* Unread indicator */}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
