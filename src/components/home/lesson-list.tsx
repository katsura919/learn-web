"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { List, Grid } from "lucide-react";

export default function LessonList() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLessons(response.data);
        setFilteredLessons(response.data);
      } catch (err) {
        setError("Failed to fetch lessons.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  useEffect(() => {
    const filtered = lessons.filter((lesson: any) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLessons(filtered);
  }, [searchQuery, lessons]);

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-32">
        <p className="animate-pulse">Loading lessons...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">Lessons</h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 sm:w-64"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsGridView(!isGridView)}
          >
            {isGridView ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Lesson List */}
      {filteredLessons.length === 0 ? (
        <p className="text-center">No lessons found.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`grid gap-4 ${
            isGridView
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredLessons.map((lesson: any) => (
            <motion.div
              key={lesson._id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Link
                href={`/dashboard/knowledge/lessons/${lesson._id}`}
                className="block p-4 rounded-lg shadow-md transition-all border hover:bg-muted bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <h3 className="font-semibold text-lg">{lesson.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {truncateText(lesson.content || "No content available.", 20)}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
