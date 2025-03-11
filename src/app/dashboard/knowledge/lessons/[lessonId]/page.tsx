"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, Loader, Trash, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";

export default function LessonDetails() {
  const params = useParams();
  const lessonId = params?.lessonId;
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);

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
        setEditedTitle(lessonResponse.data.title);
        setEditedContent(lessonResponse.data.content);
        setQuestions(questionsResponse.data.questions);
      } catch (err) {
        setError("Failed to fetch lesson or questions.");
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLessonAndQuestions();
  }, [lessonId]);

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setShowDialog(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/lessons/${lessonId}/generate`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsGenerating(false);
      setShowDialog(false);
    }
  };

  const handleUpdateLesson = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons/${lessonId}`,
        { title: editedTitle, content: editedContent },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setLesson(response.data.lesson);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating lesson:", error);
      alert("Failed to update lesson.");
    }
  };

  const handleDeleteLesson = async () => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons/${lessonId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      router.push("/dashboard/knowledge");
    } catch (error) {
      console.error("Error deleting lesson:", error);
      alert("Failed to delete lesson.");
    }
  };

  if (loading) return <p className="text-center">Loading lesson...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!lesson) return <p className="text-center">Lesson not found.</p>;

  return (
    <div className="flex flex-col min-h-screen w-full px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/home/lessons">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button onClick={handleGenerateQuestions} className="flex items-center gap-2">
          {isGenerating ? <Loader className="w-5 h-5 animate-spin" /> : <Bot className="w-5 h-5 animate-bounce" />}
          Generate Questions
          </Button>
          <Button onClick={() => setShowQuestions(!showQuestions)} variant="default">
            View Questions
          </Button>
          <Button onClick={handleUpdateLesson} variant="outline" className="flex items-center gap-2">
            <Pencil className="w-4 h-4" /> {isEditing ? "Save" : "Edit"}
          </Button>
          <Button onClick={handleDeleteLesson} variant="destructive" className="flex items-center gap-2">
            <Trash className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-3xl font-bold border-none focus:ring-0"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[400px] p-4 border-none focus:ring-0"
            />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">{lesson.title}</h2>
            <p className="text-muted-foreground">{lesson.content}</p>
          </>
        )}
      </div>

      {showQuestions && (
        <div className="w-full max-w-6xl mx-auto mt-6 space-y-4">
          <h3 className="text-xl font-bold">Generated Questions:</h3>
          <ul className="space-y-3">
            {questions.map((q, index) => (
              <li key={index} className="p-4 rounded-md bg-muted">
                <p className="font-medium">{q.questionText}</p>
                <ul className="mt-2 space-y-1">
                  {q.choices.map((choice: string, i: number) => (
                    <li key={i} className="text-muted-foreground">
                      <span className="font-bold">{String.fromCharCode(65 + i)}.</span> {choice}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <Link href={`/dashboard/knowledge/quiz/${lessonId}`}>
               <Button className="w-full">Start Quiz</Button>
           </Link>
        </div>
      )}

      <Dialog open={showDialog}>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <DialogContent className="p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Loader className="animate-spin w-12 h-12 mb-4" />
            <p className="text-lg">Generating AI-powered questions...</p>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
}
