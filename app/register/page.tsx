"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { mutate } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // 1. Create User
      await api.createUser(data);
      
      // 2. Automatically log in
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!response.ok) {
        throw new Error("Created user but failed to log in automatically");
      }

      await mutate();
      toast.success("Account created successfully!");
      router.push("/recipes");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-background">
      <div className="hidden md:flex md:w-1/2 bg-surface items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 z-0" />
        <div className="relative z-10 p-12 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 text-center max-w-md shadow-xl">
          <h2 className="text-3xl font-bold text-primary mb-4 block">"A recipe has no soul. You as the cook must bring soul to the recipe."</h2>
          <p className="text-lg text-text-secondary font-medium">— Thomas Keller</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md border-none shadow-none text-center bg-transparent">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-text-primary mb-2">Create an account</CardTitle>
            <p className="text-text-secondary">Join us to organize your culinary creations</p>
          </CardHeader>
          <CardContent className="text-left">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Name"
                placeholder="Jane Doe"
                {...register("name")}
                error={errors.name?.message}
              />
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

              <Button type="submit" className="w-full h-12 mt-6 text-lg" isLoading={isSubmitting}>
                Sign up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
