"use client";
import { useAuth } from "@/context/AuthContext"; // Import useAuth hook
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LessonForm from "@/components/home/lesson-form";
import LessonList from "@/components/home/lesson-list";

export default function HomePage() {
  const { logout } = useAuth(); // Get logout function from context

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h1 className="text-2xl font-bold mb-6">Home Page</h1>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>

        <LessonForm />
        <LessonList />
      </div>
    </ProtectedRoute>
  );
}
