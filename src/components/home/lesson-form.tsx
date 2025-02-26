"use client";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion"; // Smooth animations

export default function LessonForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        { title, content },
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
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
      setError("Failed to create lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <Card className="p-6 bg-[#45475a] border border-[#585b70] rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-[#cdd6f4] mb-4">
          📚 Create a Lesson
        </h2>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-[#313244] text-[#cdd6f4] border border-[#585b70] rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
          />

          <Textarea
            placeholder="Lesson Content"
            value={content}
            onChange={(e:any) => setContent(e.target.value)}
            required
            className="w-full bg-[#313244] text-[#cdd6f4] border border-[#585b70] rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-400"
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            {loading ? "Creating..." : "Create Lesson"}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
