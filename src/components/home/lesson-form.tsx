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
import { toast } from "sonner";

export default function LessonForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

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
        toast("Failed to load categories.", {
          className: "bg-red-600 text-white",
        });
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authorized. Please log in.", {
        className: "bg-red-600 text-white",
      });
      setLoading(false);
      return;
    }

    const categoryName =
      newCategoryName.trim() ||
      categories.find((cat) => cat._id === selectedCategoryId)?.name ||
      "";

    if (!categoryName) {
      toast.error("Please select or create a category.", {
        className: "bg-red-600 text-white",
      });
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

      toast.success("Lesson created successfully!", {
        className: "bg-green-600 text-white",
      });

      setTitle("");
      setContent("");
      setSelectedCategoryId("");
      setNewCategoryName("");
    } catch (err) {
      console.error("Error submitting lesson:", err);
      toast.error("Failed to create lesson.", {
        className: "bg-red-600 text-white",
      });
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
                setNewCategoryName("");
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

      {/* Category Input Dialog */}
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
                setSelectedCategoryId("");
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
