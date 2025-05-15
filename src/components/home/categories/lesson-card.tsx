"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { BookOpenText } from "lucide-react";

interface LessonCardProps {
  lesson: {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
  };
  onClick: () => void;
}

export default function LessonCard({ lesson, onClick }: LessonCardProps) {
  const formattedDate = new Date(lesson.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <Card className="p-6 rounded-xl border border-muted-foreground/20 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center p-3 rounded-lg bg-primary/10">
            <BookOpenText className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-lg mb-1 line-clamp-2">
              {lesson.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {lesson.content}
            </p>
            <p className="text-xs text-muted-foreground/70">
              Created: {formattedDate}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}