"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function LessonForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("default");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  console.log(categories)
  // State for category modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Create Lesson API Call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authorized. Please log in.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons`,
        { title, content, categoryName: selectedCategory },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setSuccess("Lesson created successfully!");
      setTitle("");
      setContent("");
      setSelectedCategory("default");
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      setError("Failed to create lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Create New Category API Call
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError("Category name is required.");
      return;
    }

    setCategoryLoading(true);
    setCategoryError("");

    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
        { name: newCategoryName.trim() },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Add new category to list and select it
      setCategories((prev) => [...prev, data]);
      setSelectedCategory(data.name);
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      setCategoryError("Failed to create category. It may already exist.");
    } finally {
      setCategoryLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="p-6 border rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold">📚 Create a Lesson</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lesson Title Input */}
          <Input type="text" placeholder="Lesson Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    {/* Category Selection */}
                    <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={selectedCategory} onValueChange={(value) => {
              if (value === "create_new") {
                setIsCategoryModalOpen(true);
              } else {
                setSelectedCategory(value);
              }
            }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
            {/* Default Category */}
            <SelectItem key="default-category" value="default">
              Default
            </SelectItem>

            {/* Existing Categories - Ensure Unique IDs */}
            {categories.map((category) => (
              <SelectItem key={`category-${category.id || category.name}`} value={category.id || category.name}>
                {category.name}
              </SelectItem>
            ))}


            {/* Create New Category Option */}
            <SelectItem key="create_new_category" value="create_new" className="text-blue-500 flex items-center gap-2">
              <Plus size={16} /> Create New Category
            </SelectItem>
          </SelectContent>

            </Select>
          </div>
          
          {/* Lesson Content Input */}
          <Textarea placeholder="Lesson Content" value={content} onChange={(e) => setContent(e.target.value)} required className="h-32" />



          {/* Submit Button */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create Lesson"}
          </Button>
        </form>
      </Card>

      {/* Create Category Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
            {categoryError && <p className="text-red-500 text-sm">{categoryError}</p>}
          </div>
          <DialogFooter>
            <Button onClick={handleCreateCategory} disabled={categoryLoading}>
              {categoryLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
