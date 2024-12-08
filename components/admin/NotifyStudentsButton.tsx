"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

export default function NotifyStudentsButton() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() => {
        toast({
          title: "Email Notification",
          description: "Students are being notified",
        });
      }}
      className="my-10"
    >
      Notify Students
    </Button>
  );
}
