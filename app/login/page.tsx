"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [fallbackRedirectUrl, setFallbackRedirectUrl] = useState("/recipes");

  // Read redirect query param on the client without using useSearchParams
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const redirectParam = params.get("redirect");
    if (redirectParam) {
      setFallbackRedirectUrl(redirectParam);
    }
  }, []);

  const { mutate } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      await mutate();
      toast.success("Welcome back!");
      router.push(fallbackRedirectUrl);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md border-none shadow-none text-center bg-transparent">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-text-primary mb-2">Welcome back</CardTitle>
            <p className="text-text-secondary">Enter your credentials to access your account</p>
          </CardHeader>
          <CardContent className="text-left">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email?.message}
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-sm font-medium text-text-secondary hover:text-primary"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2 mb-6">
                <label className="flex items-center space-x-2 text-sm text-text-secondary cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer" />
                  <span>Remember me</span>
                </label>
              </div>

              <Button type="submit" className="w-full h-12 text-lg" isLoading={isSubmitting}>
                Log in
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{" "}
              <Link href="/register" className="font-bold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <div className="hidden md:flex md:w-1/2 bg-surface items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 z-0" />
        <div className="relative z-10 p-12 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 text-center max-w-md shadow-xl">
          <h2 className="text-3xl font-bold text-primary mb-4 block">"Cooking is like love. It should be entered into with abandon or not at all."</h2>
          <p className="text-lg text-text-secondary font-medium">— Harriet Van Horne</p>
        </div>
      </div>
    </div>
  );
}
