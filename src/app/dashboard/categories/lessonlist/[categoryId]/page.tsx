"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, NotebookText } from "lucide-react";
import LessonCard from "@/components/home/categories/lesson-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Lesson {
  _id: string;
  title: string;
  content: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function CategoryLessonsPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(lessons)
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");

        const lessonsRes = await axios.get<{ data: Lesson[] }>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons/category/${categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setLessons(lessonsRes.data.data);
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setError("Failed to load lessons. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="w-full max-w-screen-lg mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-screen-lg mx-auto px-4 py-8 flex flex-col items-center justify-center gap-6">
        <div className="text-red-500 text-center space-y-4">
          <NotebookText className="w-12 h-12 mx-auto text-muted-foreground/40" />
          <p className="text-lg font-medium">{error}</p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Lessons</h1>
      </div>

      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <NotebookText className="w-12 h-12 text-muted-foreground/40" />
          <h3 className="text-xl font-medium text-muted-foreground">
            No lessons available
          </h3>
          <p className="text-muted-foreground/70">
            There are no lessons in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              onClick={() => router.push(`/dashboard/knowledge/lessons/${lesson._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
