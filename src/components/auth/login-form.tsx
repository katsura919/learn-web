"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpRight, Loader2  } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        { username, password }
      );

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="rounded-full text-base">
            Get Started <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          {showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <>
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold">Login</h2>
                <p className="text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-3">
                 <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Logging in...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="underline underline-offset-4 ml-1"
                >
                  Sign up
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
