"use client";

import { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader, Pencil, Save, Play } from "lucide-react";
import Link from "next/link";

interface Question {
  _id: string;
  questionText: string;
  choices: string[];
  correctAnswer: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: Question[];
  lessonId: string;
  isLoading: boolean;
}

export default function QuestionDialog({
  open,
  onOpenChange,
  questions,
  lessonId,
  isLoading,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState<Question[]>(questions);

  const handleChange = (
    index: number,
    field: keyof Question,
    value: string,
    choiceIndex?: number
  ) => {
    setEditedQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              [field]:
                field === "choices"
                  ? q.choices.map((c, ci) => (ci === choiceIndex ? value : c))
                  : value,
            }
          : q
      )
    );
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/batch-update`,
        { updates: editedQuestions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Questions updated successfully");
      setEditMode(false);
    } catch (err) {
      toast.error("Failed to update questions");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="animate-spin w-12 h-12 mb-4" />
            <p className="text-lg">Generating AI-powered questions...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-semibold">Generated Questions</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/knowledge/quiz/${lessonId}`}>
                    <Play className="w-4 h-4 mr-1" />
                    Start Quiz
                  </Link>
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    if (editMode) handleSave();
                    setEditMode((prev) => !prev);
                  }}
                >
                  {editMode ? <Save className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Questions */}
            {editedQuestions.map((q, index) => (
              <div
                key={q._id}
                className="bg-muted p-4 rounded-xl space-y-3 border"
              >
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Question {index + 1}
                  </Label>
                  {editMode ? (
                    <Input
                      value={q.questionText}
                      onChange={(e) =>
                        handleChange(index, "questionText", e.target.value)
                      }
                    />
                  ) : (
                    <p className="font-medium">{q.questionText}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Choices</Label>
                  {q.choices.map((choice, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="font-semibold">{String.fromCharCode(65 + i)}.</span>
                      {editMode ? (
                        <Input
                          value={choice}
                          onChange={(e) =>
                            handleChange(index, "choices", e.target.value, i)
                          }
                        />
                      ) : (
                        <p>{choice}</p>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Correct Answer</Label>
                  {editMode ? (
                    <Input
                      value={q.correctAnswer}
                      onChange={(e) =>
                        handleChange(index, "correctAnswer", e.target.value)
                      }
                    />
                  ) : (
                    <p className="text-green-600 font-semibold">✓ {q.correctAnswer}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
