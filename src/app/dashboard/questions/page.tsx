"use client";
import { useAuth } from "@/context/AuthContext";
import LessonList from "@/components/home/lesson-list";
import { motion } from "framer-motion"; 

export default function QuestionPage() {
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
       <div>
        question
       </div>
      </motion.div>
    </div>
  );
}
