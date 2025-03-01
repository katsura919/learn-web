"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import QuizComponent from "@/components/home/quiz-component";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

export default function LessonDetails() {
  const params = useParams();
  const lessonId = params?.lessonId;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false);
  useEffect(() => {
    const fetchLessonAndQuestions = async () => {
      try {
        const token = localStorage.getItem("token");

        const [lessonResponse, questionsResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons/${lessonId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/lessons/${lessonId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setLesson(lessonResponse.data);
        setQuestions(questionsResponse.data.questions);
      } catch (err) {
        setError("Failed to fetch lesson or questions.");
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLessonAndQuestions();
  }, [lessonId]);

    // Handle Generate Questions
    const handleGenerateQuestions = async () => {
      setIsGenerating(true);
      setShowDialog(true);
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/lessons/${lessonId}/generate`
        );
      } catch (error) {
        console.error("Error generating questions:", error);
      } finally {
        setIsGenerating(false);
        setShowDialog(false);
      }
    };
  if (loading) return <p className="text-center text-white">Loading lesson...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!lesson) return <p className="text-center text-white">Lesson not found.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#313244] p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-6 bg-[#45475a] border border-[#585b70] rounded-xl shadow-lg relative">
          {/* 🔹 Back Button & Generate AI Button (Top Bar) */}
          <div className="flex justify-between items-center mb-4">
            <Link href="/home/lessons">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="text-[#cdd6f4] w-6 h-6" />
              </Button>
            </Link>

            {/* AI Generate Button */}
            {questions.length === 0 && (
              <Button
                onClick={handleGenerateQuestions}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold shadow-md transition-all duration-300 hover:shadow-blue-500/50"
              >
                <Bot className="w-5 h-5 animate-bounce" />
                Generate with AI
              </Button>
            )}
          </div>

          <h2 className="text-3xl font-extrabold text-[#cdd6f4]">{lesson.title}</h2>
          <p className="text-[#a6adc8] mt-2">{lesson.content}</p>

          {/* Show Quiz & Questions If Available */}
          {questions.length > 0 && (
            <>
              <Link href={`/home/quiz/${lessonId}`}>
                <Button className="mt-4 w-full bg-green-600 hover:bg-green-700">Start Quiz</Button>
              </Link>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-[#cdd6f4]">Generated Questions:</h3>
                <ul className="pl-5 mt-2 space-y-3">
                  {questions.map((q, index) => (
                    <li key={index} className="bg-[#585b70] p-4 rounded-lg shadow-md">
                      <p className="font-medium text-white">{q.questionText}</p>
                      <ul className="mt-2 space-y-1">
                        {q.choices.map((choice: string, i: number) => (
                          <li key={i} className="text-[#a6adc8]">
                            <span className="font-bold">{String.fromCharCode(65 + i)}.</span> {choice}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </Card>
      </motion.div>
      
      
      {/* 🔹 AI Loading Dialog */}
      <Dialog open={showDialog}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <DialogContent className="p-6 bg-[#24283b] border border-[#585b70] rounded-lg shadow-lg flex flex-col items-center">
            <Loader className="animate-spin text-[#3b82f6] w-12 h-12 mb-4" />
            <p className="text-lg text-[#cdd6f4]">Generating AI-powered questions...</p>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
}
