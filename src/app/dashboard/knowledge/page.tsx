"use client";

import { useAuth } from "@/context/AuthContext";

import LessonForm from "@/components/home/lesson-form";
import LessonList from "@/components/home/lesson-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion"; 

export default function HomePage() {
  const { logout } = useAuth();

  return (

      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#313244] p-6 text-white">


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

  );
}
