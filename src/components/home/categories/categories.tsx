"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        
        // Ensure unique keys and filter out any undefined IDs
        const uniqueCategories = data.map((category: Category, index: number) => ({
          id: category.id || `fallback-${index}`,
          name: category.name,
        }));
        
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p className="text-center">Loading categories...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
    >
      {categories.map((category) => (
        <Card key={category.id} className="p-4 shadow-lg rounded-lg">
          <p className="text-lg font-semibold">{category.name}</p>
        </Card>
      ))}
    </motion.div>
  );
}