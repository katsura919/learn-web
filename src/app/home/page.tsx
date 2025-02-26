"use client";

import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LessonForm from "@/components/home/lesson-form";
import LessonList from "@/components/home/lesson-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion"; // For smooth animations

export default function HomePage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#313244] p-6 text-white">
        {/* Logout Button */}
        <Button
          onClick={logout}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600"
        >
          Logout
        </Button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold tracking-wide text-[#cdd6f4]">
            Welcome to BLAHBLAH ⚡
          </h1>
          <p className="text-lg text-[#a6adc8] mt-2">
            Store your lessons, generate AI-powered questions, and take quizzes!
          </p>
        </motion.div>

        {/* Lesson Form & List Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-6 bg-[#45475a] border border-[#585b70] rounded-xl shadow-lg">
            <LessonForm />
          </Card>

          <div className="mt-6">
            <LessonList />
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
