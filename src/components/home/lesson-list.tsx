"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LessonList() {
  const { user } = useAuth(); // Get logged-in user
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(lessons)
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token
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

  if (loading) return <p>Loading lessons...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Your Lessons</h2>

      {lessons.length === 0 ? (
        <p>No lessons found.</p>
      ) : (
        <ul className="space-y-3">
          {lessons.map((lesson: any) => (
            <li key={lesson._id}>
              <Link
                href={`/home/lessons/${lesson._id}`}
                className="block p-3 bg-blue-100 hover:bg-blue-200 rounded-md cursor-pointer"
              >
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
