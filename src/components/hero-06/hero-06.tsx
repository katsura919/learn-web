import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import { BackgroundPattern } from "./background-pattern";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "../theme-toggle";

const Hero06 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative ">
      {/* Theme Toggle in the upper right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <BackgroundPattern />

      <div className="relative z-10 text-center max-w-2xl">
        <Badge className="bg-gradient-to-br via-100% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
          Just released v1.0.0
        </Badge>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
          Welcome to ThinkBox
        </h1>
        <p className="mt-6 text-[17px] md:text-lg">
          Take notes, generate questions, and challenge yourself—all in one
          place. ThinkBox makes learning more interactive and engaging, helping
          you retain knowledge faster.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <LoginForm />

          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="!h-5 !w-5" /> Watch Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero06;
