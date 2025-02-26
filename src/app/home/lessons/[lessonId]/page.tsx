"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import QuizComponent from "@/components/home/quiz-component"; // Import the quiz component

export default function LessonDetails() {
  const params = useParams();
  const lessonId = params?.lessonId;
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [isQuizActive, setIsQuizActive] = useState(false); // Track if quiz is active

  useEffect(() => {
    const fetchLessonAndQuestions = async () => {
      try {
        const token = localStorage.getItem("token");

        const lessonResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons/${lessonId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLesson(lessonResponse.data);

        const questionsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/lessons/${lessonId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuestions(questionsResponse.data.questions);
      } catch (err) {
        setError("Failed to fetch lesson or questions.");
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLessonAndQuestions();
  }, [lessonId]);

  if (loading) return <p>Loading lesson...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!lesson) return <p>Lesson not found.</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto mt-6">
      {isQuizActive ? (
        <QuizComponent questions={questions} onQuit={() => setIsQuizActive(false)} />
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">{lesson.title}</h2>
          <p className="text-gray-700">{lesson.content}</p>

          <button
            onClick={() => setIsQuizActive(true)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={questions.length === 0}
          >
            Start Quiz
          </button>

            {/* ✅ Display Generated Questions */}
            <div className="mt-6">
              <h3 className="text-lg font-bold">Generated Questions:</h3>
              {questions.length === 0 ? (
                <p className="text-gray-500">No questions available. Try generating some.</p>
              ) : (
                <ul className="pl-5 mt-2">
                  {questions.map((q, index) => (
                    <li key={index} className="mb-3">
                      <p className="font-medium">{q.questionText}</p>
                      <ul className="list-none mt-1">
                        {q.choices.map((choice: string, i: number) => {
                          const labels = ["A", "B", "C", "D"]; // Labels for choices
                          return (
                            <li key={i} className="text-gray-700">
                              <span className="font-bold">{labels[i]}.</span> {choice}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          <div className="mt-6">
            <Link href="/home/lessons" className="text-blue-600 hover:underline">
              ⬅ Back to Lessons
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
