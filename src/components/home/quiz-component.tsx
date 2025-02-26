"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Question = {
  questionText: string;
  choices: string[];
  correctAnswer: string;
};

type QuizProps = {
  questions: Question[];
  onQuit: () => void; // Callback to exit quiz
};

export default function QuizComponent({ questions, onQuit }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizEnded, setQuizEnded] = useState(false);
  console.log(questions)
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNextQuestion(); // Move to next question if time runs out
    }
  }, [timeLeft]);

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);

    if (answer === questions[currentIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(handleNextQuestion, 1000); // Move to next question after 1 sec
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
      <Card className="p-6 text-center">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Quiz Completed!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Your Score: <span className="font-bold">{score} / {questions.length}</span></p>
          <Button onClick={onQuit} className="mt-4">Return to Lesson</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-lg font-bold">
          Question {currentIndex + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800 font-medium">{questions[currentIndex].questionText}</p>
        <div className="mt-4">
          {questions[currentIndex].choices.map((choice, i) => (
            <Button
              key={i}
              className={`w-full mt-2 ${
                selectedAnswer === choice
                  ? choice === questions[currentIndex].correctAnswer
                    ? "bg-green-500"
                    : "bg-red-500"
                  : "bg-gray-200"
              }`}
              onClick={() => handleAnswerClick(choice)}
              disabled={selectedAnswer !== null}
            >
              {choice}
            </Button>
          ))}
        </div>
        <p className="mt-4 text-gray-600">Time left: {timeLeft}s</p>
      </CardContent>
    </Card>
  );
}
