"use client";
import { useAuth } from "@/context/AuthContext";
import LessonForm from "@/components/home/lesson-form";
import { motion } from "framer-motion"; 

export default function CreatePage() {
  const { logout } = useAuth();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full p-6">
      {/* Lesson List Container */}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full flex flex-col flex-grow"
      >
        <LessonForm />
      </motion.div>
    </div>
  );
}
