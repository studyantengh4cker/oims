"use client";

import { BellIcon, AlertCircle, Mail, Info } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { store } from "@/lib/firebase"; // Ensure this is your Firebase client instance
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  message: string;
  link?: string;
  isRead: boolean;
  notifiedAt: any; // Adjust type based on Firestore timestamp (e.g., `FirebaseFirestore.Timestamp`)
}

export default function Notifications({ office }: { office: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!office) return; // Ensure office is provided

    const q = query(
      collection(store, "notifs"),
      where("office", "==", office),
      orderBy("notifiedAt", "desc") // Sort by `notifiedAt` in descending order
    );

    const unsubscribeNotifications = onSnapshot(q, (querySnapshot) => {
      const notificationsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifications(notificationsArray);
    });

    return () => unsubscribeNotifications(); // Cleanup listener on unmount
  }, [office]);

  const handleNotificationClick = (id: string) => {
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
      <DropdownMenuContent className="w-[350px] mr-4">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length > 0 ? (
          notifications.map(({ id, message, link, isRead, notifiedAt }) => {
            const timeAgo = formatDistanceToNow(
              notifiedAt instanceof Timestamp
                ? notifiedAt.toDate()
                : new Date(notifiedAt),
              {
                addSuffix: true,
              }
            );

            return (
              <DropdownMenuItem
                key={id}
                onClick={() => handleNotificationClick(id)}
                className={`flex items-center gap-3 p-3 transition-colors duration-200 rounded-lg ${
                  isRead
                    ? "bg-white text-gray-500"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                }`}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                  {link ? (
                    <Mail size={20} />
                  ) : isRead ? (
                    <Info size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                </span>
                <div className="flex flex-col flex-1">
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold line-clamp-2"
                    >
                      {message}
                    </a>
                  ) : (
                    <span className="font-semibold line-clamp-2">
                      {message}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{timeAgo}</span>
                </div>
                {!isRead && (
                  <span className="ml-2 text-red-500 font-bold">•</span>
                )}
              </DropdownMenuItem>
            );
          })
        ) : (
          <DropdownMenuItem className="text-gray-500">
            No notifications
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
