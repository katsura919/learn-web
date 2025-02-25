"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/auth/login-form";
export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home"); // Redirect to home if user is logged in
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>; // Prevent flickering

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
