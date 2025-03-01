"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/login-form";

export default function LandingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="relative">
          {/* Outer Circle */}
          <div className="w-16 h-16 border-4 border-gray-300 rounded-full"></div>

          {/* Animated Spinning Arc */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-t-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (user) {
    redirect("/dashboard"); // Redirect if user is logged in
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to the Game</h1>
        <p className="text-lg text-gray-600 mt-2">Join now and start playing!</p>
        <LoginForm />
      </div>
    </div>
  );
}
