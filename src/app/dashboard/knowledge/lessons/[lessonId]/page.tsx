"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Bot,
  Eye,
  Pencil,
  Trash,
  Loader,
  MoreVertical,
} from "lucide-react";
import QuestionDialog from "@/components/dashboard/question-list";

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
      <div className="flex justify-end items-center mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleGenerateQuestions}
                variant="ghost"
                className="justify-start"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Bot className="w-4 h-4 mr-2" />
                )}
                Generate Questions
              </Button>

              <Button
                onClick={() => setShowDialog(true)}
                variant="ghost"
                className="justify-start"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Questions
              </Button>

              <Button
                onClick={handleUpdateLesson}
                variant="ghost"
                className="justify-start"
              >
                <Pencil className="w-4 h-4 mr-2" />
                {isEditing ? "Save Changes" : "Edit Lesson"}
              </Button>

              <Button
                onClick={handleDeleteLesson}
                variant="ghost"
                className="justify-start text-destructive"
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete Lesson
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col gap-4">
        {isEditing ? (
          <>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-3xl font-bold"
            />
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[400px]"
            />
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">{lesson.title}</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {lesson.content}
            </p>
          </>
        )}
      </div>

      <QuestionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        questions={questions}
        lessonId={lessonId as string}
        isLoading={isGenerating}
      />
    </div>
  );
}
