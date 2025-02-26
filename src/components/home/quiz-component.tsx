"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

type Question = {
  questionText: string;
  choices: string[];
  correctAnswer: string;
};

type QuizProps = {
  questions: Question[];
  onQuit: () => void;
};

export default function QuizComponent({ questions, onQuit }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizEnded, setQuizEnded] = useState(false);

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

  if (quizEnded) {
    return (
      <Card className="p-6 text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🎉 Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl">
            Your Score: <span className="font-bold">{score} / {questions.length}</span>
          </p>
          <Button onClick={onQuit} className="mt-4 bg-yellow-400 text-black font-bold">
            Return to Lesson
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          ⚔️ Question {currentIndex + 1} / {questions.length}
        </CardTitle>
        <Progress value={((currentIndex + 1) / questions.length) * 100} className="mt-2 bg-gray-200 h-2 rounded-full" />
      </CardHeader>
      <CardContent>
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-semibold"
        >
          {questions[currentIndex].questionText}
        </motion.p>

        <div className="mt-4 space-y-3">
          {questions[currentIndex].choices.map((choice, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              className={`w-full py-3 px-4 text-lg font-bold rounded-lg shadow-md transition-all 
                ${selectedAnswer === choice ? 
                  (choice === questions[currentIndex].correctAnswer ? "bg-green-500" : "bg-red-500") 
                  : "bg-white text-black hover:bg-gray-300"}`}
              onClick={() => handleAnswerClick(choice)}
              disabled={selectedAnswer !== null}
            >
              {choice}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm font-medium">🕒 Time left: {timeLeft}s</p>
          {selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {selectedAnswer === questions[currentIndex].correctAnswer ? (
                <CheckCircle className="text-green-400 w-8 h-8" />
              ) : (
                <XCircle className="text-red-400 w-8 h-8" />
              )}
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
