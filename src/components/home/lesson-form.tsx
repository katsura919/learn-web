"use client";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Import AuthContext to get the user token

export default function LessonForm() {
  const { user } = useAuth(); // Get the authenticated user
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
  
    const token = localStorage.getItem("token"); // Get token from localStorage or wherever you store it
  
    if (!token) {
      setError("You are not authorized. Please log in.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/lessons`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Ensure token is included
            "Content-Type": "application/json",
          },
          withCredentials: true, // Optional, depends on your backend setup
        }
      );
  
      setSuccess("Lesson created successfully!");
      setTitle("");
      setContent("");
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message); // Log error details
      setError("Failed to create lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a Lesson</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Lesson Title"
          className="w-full p-2 border rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Lesson Content"
          className="w-full p-2 border rounded mb-4 h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Lesson"}
        </button>
      </form>
    </div>
  );
}
