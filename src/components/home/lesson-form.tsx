"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function LessonForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCategories(data);
        if (data.length === 0) {
          setCategoryDialogOpen(true);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authorized. Please log in.");
      setLoading(false);
      return;
    }

    const categoryName =
      newCategoryName.trim() ||
      categories.find((cat) => cat._id === selectedCategoryId)?.name ||
      "";

    if (!categoryName) {
      setError("Please select or create a category.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons`,
        { title, content, categoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setSuccess("Lesson created successfully!");
      setTitle("");
      setContent("");
      setSelectedCategoryId("");
      setNewCategoryName("");
    } catch (err) {
      console.error("Error submitting lesson:", err);
      setError("Failed to create lesson.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-screen-lg mx-auto px-4 py-10"
    >
      <h2 className="text-3xl font-semibold mb-6">📚 Create a Lesson</h2>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      {success && <p className="text-sm text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="space-y-1">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={selectedCategoryId || ""}
            onValueChange={(value) => {
              if (value === "create_new") {
                setCategoryDialogOpen(true);
              } else {
                setSelectedCategoryId(value);
                setNewCategoryName(""); // clear new name
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
              <SelectItem value="create_new" className="text-blue-500">
                <Plus size={16} className="inline-block mr-2" />
                Create New Category
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Write the lesson content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[20rem] text-base leading-7"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Lesson"}
        </Button>
      </form>

      {/* Category Input Dialog (does NOT call API) */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              onClick={() => {
                setCategoryDialogOpen(false);
                setSelectedCategoryId(""); // clear any selection
              }}
              disabled={!newCategoryName.trim()}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
