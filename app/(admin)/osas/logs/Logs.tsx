"use client";

import { useEffect, useState } from "react";
import { store } from "@/lib/firebase"; // Import your Firebase configuration
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { LogsTable } from "@/components/admin/LogsTable";

export function Logs({ office }: { office: string }) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    // Query to fetch logs in descending order of timestamp
    const q = query(
      collection(store, "activityLogs"),
      where("office", "==", office),
      orderBy("timestamp", "desc")
    );

    // Real-time listener for logs
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLogs(fetchedLogs);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [office]);

  return <LogsTable data={logs} />;
}
