"use client";

import { useAuth } from "@/context/AuthContext";
import CategoryGrid from "@/components/home/categories/categories";
import { motion } from "framer-motion"; 

export default function CategoryPage() {


  return (

      <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#1e1e2e] to-[#313244] p-6 text-white">


        {/* Lesson Form & List Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >

          <div className="mt-6">
            <CategoryGrid />
          </div>
        </motion.div>
      </div>

  );
}
