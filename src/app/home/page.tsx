"use client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "@/context/AuthContext"; // Import the AuthContext

interface User {
  _id: string;
  username: string; // Include other fields as necessary
  email?: string; // Optional field if you need it
}

interface Conversation {
  _id: string;
  participants: User[]; // Include participants
}

export default function HomePage() {
  
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        Home Page
      </div>
    </ProtectedRoute>
  );
}
