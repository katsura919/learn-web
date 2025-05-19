"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { Component } from "@/components/dashboard/quiz-attempt-chart";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.id) {
          setUserId(parsed.id);
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
  }, []);


  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Top 3 stat cards */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {userId && token && <DashboardCards userId={userId} token={token} />}
        </div>

        {/* Chart below the cards */}
        {userId && token && <Component userId={userId} />
}
      </div>
    </ProtectedRoute>
  );
}
