"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type Question = {
  _id: string;
  questionText: string;
  choices: string[];
  correctAnswer: string;
};

export default function QuizPage() {
  const { quizId } = useParams(); // Get lessonId from URL
  const router = useRouter(); // Navigation hook
  console.log(quizId)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const totalTime = 10;
  useEffect(() => {
    async function fetchQuizData() {
      if (!quizId) {
        console.error("❌ No lessonId found in URL params.");
        return;
      }

      console.log("🔍 Fetching questions for lesson:", quizId);

      try {
        const response = await axios.get(`http://localhost:5000/api/questions/lessons/${quizId}`);
        console.log("✅ API Response:", response.data);

        setQuestions(response.data.questions || []);
      } catch (error) {
        console.error("❌ Error fetching questions:", error);
      } finally {
        setLoading(false); // ✅ Stops infinite loading
      }
    }

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextQuestion();
    }
  }, [timeLeft]);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setTimeout(handleNextQuestion, 1000);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(10);
      setSelectedAnswer(null);
    } else {
      setQuizEnded(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading questions...</p>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#313244]">
        <Card className="p-6 text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🎉 Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl">
              Your Score: <span className="font-bold">{score} / {questions.length}</span>
            </p>
            <Button onClick={() => router.push("/home")} className="mt-4 bg-yellow-400 text-black font-bold">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-[#1e1e2e] to-[#313244]">
      <Card className="relative p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl w-full max-w-xl mx-auto">
        
        {/* Timer at Top Right */}
        <div className="absolute top-4 right-4 w-14 h-14">
          <CircularProgressbar
            value={(timeLeft / totalTime) * 100}
            text={`${timeLeft}`}
            styles={buildStyles({
              pathColor: timeLeft > 5 ? "#00ff88" : "#ff4d4d", // Green if time > 5s, red if <= 5s
              trailColor: "#444",
              textColor: "#fff",
              textSize: "24px",
            })}
          />
        </div>
  
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            ⚔️ Question {currentIndex + 1} / {questions.length}
          </CardTitle>
          <Progress value={((currentIndex + 1) / questions.length) * 100} className="mt-2 bg-gray-700 h-2 rounded-full" />
        </CardHeader>
  
        <CardContent>
          <motion.p
            key={currentIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-semibold text-center"
          >
            {questions[currentIndex]?.questionText}
          </motion.p>
  
          <div className="mt-4 space-y-3">
            {questions[currentIndex]?.choices.map((choice, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 px-4 text-lg font-bold rounded-lg shadow-md transition-all flex items-center justify-center 
                  ${
                    selectedAnswer === choice
                      ? choice === questions[currentIndex]?.correctAnswer
                        ? "bg-green-500"
                        : "bg-red-500"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                onClick={() => handleAnswerClick(choice)}
                disabled={selectedAnswer !== null}
              >
                {choice}
              </motion.button>
            ))}
          </div>
  
  
        </CardContent>
      </Card>
    </div>
  );
  
}
