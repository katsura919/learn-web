"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpenText, BarChart3, Gauge } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card className="h-30 flex flex-col justify-between p-4">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      <div className="text-muted-foreground">{icon}</div>
    </div>
    <CardContent className="p-0">
      <p className="text-4xl font-semibold">{value}</p>
    </CardContent>
  </Card>
);

export function DashboardCards({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) {
  const [lessonCount, setLessonCount] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState<number | null>(null);
  const [averageScore, setAverageScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [lessonsRes, attemptsRes, averageRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/lessons/count/${userId}`, { headers }),
          axios.get(`${API_BASE_URL}/attempts/user/${userId}`, { headers }),
          axios.get(`${API_BASE_URL}/attempts/average/user/${userId}`, {
            headers,
          }),
        ]);

        setLessonCount(lessonsRes.data.total);
        setAttemptCount(attemptsRes.data.totalAttempts);
        setAverageScore(averageRes.data.averageScore);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    if (userId && token) fetchData();
  }, [userId, token]);

  return (
    <>
      <StatCard
        title="Total Lessons"
        value={lessonCount ?? "..."}
        icon={<BookOpenText className="w-6 h-6" />}
      />
      <StatCard
        title="Total Attempts"
        value={attemptCount ?? "..."}
        icon={<BarChart3 className="w-6 h-6" />}
      />
      <StatCard
        title="Average Accuracy"
        value={averageScore !== null ? `${Math.round(averageScore)}%` : "..."}
        icon={<Gauge className="w-6 h-6" />}
      />
    </>
  );
}
