"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { NotebookText, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import socket, { connectSocket} from "@/utils/socket";

interface Category {
  _id: string;
  id: string;
  name: string;
}

export default function CategoryGrid() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtered, setFiltered] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  console.log("🚀 Categories:", categories);

useEffect(() => {
  let isMounted = true;

  const handleNewCategory = (newCategory: any) => {
    if (!isMounted) return;

    setCategories((prev) => {
      const exists = prev.some(
        (cat) => cat._id === newCategory._id || cat.id === newCategory.id
      );
      if (exists) return prev;

      const updated = [...prev, newCategory];
      return updated.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
  };

  const initializeSocket = async () => {
    await connectSocket(); 

  
    socket.off("category_created", handleNewCategory);
    socket.off("new_category", handleNewCategory);

    socket.on("category_created", handleNewCategory);
    socket.on("new_category", handleNewCategory);
  };

  initializeSocket();

  return () => {
    isMounted = false;
    socket.off("category_created", handleNewCategory);
    socket.off("new_category", handleNewCategory);
  };
}, []);




  const fetchCategories = async () => {
    try {
      setIsRefreshing(true);
      setError("");
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setCategories(data);
      setFiltered(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
  fetchCategories();
}, []);


  useEffect(() => {
    const results = categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
  }, [search, categories]);

 const handleCardClick = (categoryId: string, categoryName: string) => {
  router.push(
    `/dashboard/notebooks/lessonlist/${categoryId}?name=${encodeURIComponent(categoryName)}`
  );
};


  if (loading) {
    return (
      <div className="w-full max-w-screen-lg mx-auto px-4 py-10">
        <div className="mb-8">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-screen-lg mx-auto px-4 py-10 flex flex-col items-center justify-center gap-4"
      >
        <div className="text-red-500 text-center space-y-4">
          <p className="text-lg font-medium">{error}</p>
          <Button
            variant="outline"
            onClick={fetchCategories}
            disabled={isRefreshing}
          >
            {isRefreshing && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Retry
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-screen-lg mx-auto"
    >
      <div className="mb-8 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-6 text-base rounded-lg border-muted-foreground/20 focus-visible:ring-2 focus-visible:ring-primary/50"
          />
        </div>
        {search && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            Showing {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </motion.p>
        )}
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 gap-4 text-center"
        >
          <NotebookText className="w-12 h-12 text-muted-foreground/40" />
          <h3 className="text-xl font-medium text-muted-foreground">
            No categories found
          </h3>
          <p className="text-muted-foreground/70">
            {search ? 'Try a different search term' : 'No categories available'}
          </p>
          {search && (
            <Button
              variant="ghost"
              onClick={() => setSearch('')}
              className="text-primary"
            >
              Clear search
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 justify-start">

          {filtered.map((category) => (
            <motion.div
              key={category._id || category.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(category._id, category.name)}

            >
              <Card className="flex items-center gap-4 p-6 rounded-xl border border-muted-foreground/20 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center justify-center p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition">
                  <NotebookText className="w-5 h-5 text-primary" />
                </div>
                <p className="text-base font-medium truncate">{category.name}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
