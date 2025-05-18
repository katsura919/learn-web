"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { quizId } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLimit, setTimeLimit] = useState(10);

  useEffect(() => {
    async function fetchQuizData() {
      if (!quizId) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/lessons/${quizId}`
        );
        setQuestions(response.data.questions || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (!quizStarted || selectedAnswer !== null) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextQuestion();
    }
  }, [timeLeft, quizStarted, selectedAnswer]);

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
      setTimeLeft(timeLimit);
      setSelectedAnswer(null);
    } else {
      setQuizEnded(true);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(timeLimit);
  };

  const handleRetry = () => {
    setQuizEnded(false);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(timeLimit);
    setSelectedAnswer(null);
  };

useEffect(() => {
  if (quizEnded) {
    const saveAttempt = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user.id; // ✅ use `id` not `_id`

        if (!userId) {
          console.error("User ID is missing.");
          return;
        }

        const correctAnswers = score;
        const totalItems = questions.length;
        const calculatedScore = Math.round((correctAnswers / totalItems) * 100);

        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attempts`, {
          userId,
          lessonId: quizId,
          score: calculatedScore,
          totalItems,
          correctAnswers,
        });

        console.log("Attempt saved successfully.");
      } catch (error) {
        console.error("Failed to save attempt:", error);
      }
    };

    saveAttempt();
  }
}, [quizEnded, score, questions.length, quizId]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading questions...</p>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 space-y-4">
        <h1 className="text-xl font-semibold">Start Quiz</h1>
        <div className="w-full max-w-xs space-y-2">
          <label htmlFor="timeLimit" className="text-sm font-medium">
            Time per question (seconds)
          </label>
          <Input
            id="timeLimit"
            type="number"
            value={timeLimit}
            min={5}
            max={60}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </div>
        <Button onClick={startQuiz} className="w-full max-w-xs">
          Start Quiz
        </Button>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 px-4 text-center">
        <h2 className="text-2xl font-bold">🎉 Quiz Completed!</h2>
        <p className="text-lg font-medium">
          Your Score: {score} / {questions.length}
        </p>
        <div className="space-x-2">
          <Button variant="secondary" onClick={handleRetry}>
            Retry Quiz
          </Button>
          <Button onClick={() => router.back()}>
            Go Back
          </Button>

        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center items-center h-screen w-full px-4 space-y-6">
      {/* Timer */}
      <div className="absolute top-4 right-4 w-14 h-14">
        <CircularProgressbar
          value={(timeLeft / timeLimit) * 100}
          text={`${timeLeft}`}
          styles={buildStyles({
            pathColor: "#22c55e",       // green
            trailColor: "#1f2937",      // dark gray
            textColor: "#ffffff",       // white text
            textSize: "24px",
            strokeLinecap: "round",
          })}
        />
      </div>

      {/* Header */}
      <div className="w-full max-w-2xl">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold">
            Question {currentIndex + 1} of {questions.length}
          </h2>
          <Progress
            value={((currentIndex + 1) / questions.length) * 100}
            className="mt-2 h-2"
          />
        </div>

        {/* Question */}
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center text-base font-medium mb-4"
        >
          {questions[currentIndex]?.questionText}
        </motion.p>

        {/* Choices */}
        <div className="space-y-3">
          {questions[currentIndex]?.choices.map((choice, i) => {
            const isCorrect =
              selectedAnswer === choice &&
              choice === questions[currentIndex].correctAnswer;
            const isIncorrect =
              selectedAnswer === choice &&
              choice !== questions[currentIndex].correctAnswer;

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 px-4 rounded-md border text-sm font-medium transition 
                  ${
                    selectedAnswer
                      ? isCorrect
                        ? "bg-green-100"
                        : isIncorrect
                        ? "bg-red-100"
                        : "bg-muted"
                      : "bg-muted hover:bg-muted-foreground/10"
                  }`}
                onClick={() => handleAnswerClick(choice)}
                disabled={selectedAnswer !== null}
              >
                {choice}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
