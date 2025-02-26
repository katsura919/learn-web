"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function LessonList() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch (err) {
        setError("Failed to fetch lessons.");
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-[#cdd6f4] animate-pulse">Loading lessons...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-32">
        <p className="text-red-400">{error}</p>
      </div>
    );

  return (
    <Card className="p-6 bg-[#45475a] border border-[#585b70] rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-[#cdd6f4]">Your Lessons</h2>

      {lessons.length === 0 ? (
        <p className="text-[#a6adc8] text-center">No lessons found.</p>
      ) : (
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          {lessons.map((lesson: any) => (
            <motion.li
              key={lesson._id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={`/home/lessons/${lesson._id}`}
                className="block p-4 bg-[#585b70] hover:bg-[#6c7086] text-[#cdd6f4] rounded-lg shadow-md transition-all"
              >
                {lesson.title}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </Card>
  );
}
