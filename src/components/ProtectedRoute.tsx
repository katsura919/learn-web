"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // Redirect to landing page if not logged in
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>; // Show a loader while checking auth status

  return <>{user ? children : null}</>;
};
