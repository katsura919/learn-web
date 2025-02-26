"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Import Auth Hook

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, { email, password });
  
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "/home"; // Redirect to home
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">Login</Button>
        </DialogTrigger>
        <DialogContent>
          {showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Login</h2>
                <p className="text-gray-600">Enter your email below to login to your account</p>
              </div>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full">Login</Button>
                  <Button variant="outline" className="w-full">Login with Google</Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account? 
                  <button type="button" onClick={() => setShowRegister(true)} className="underline underline-offset-4 ml-1">Sign up</button>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
