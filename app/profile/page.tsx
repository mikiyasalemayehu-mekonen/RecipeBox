"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { UserCircleIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { hashColor } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, mutate } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email, password: "" });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {
        name: data.name,
        email: data.email,
      };
      if (data.password && data.password.length > 0) {
        payload.password = data.password;
      }
      await api.updateMe(payload);
      await mutate();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset({ name: user?.name ?? "", email: user?.email ?? "", password: "" });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name?.charAt(0).toUpperCase() ?? "?";
  const avatarColor = hashColor(user.email);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl flex-1">
      <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-8">My Profile</h1>

      {/* Avatar Card */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div
            className="h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md flex-shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-text-primary">{user.name}</h2>
            <p className="text-text-secondary mt-1">{user.email}</p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2 shrink-0"
            >
              <PencilIcon className="h-4 w-4" />
              Edit profile
            </Button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="bg-surface rounded-2xl border border-border shadow-sm p-8">
          <h3 className="text-lg font-bold text-text-primary mb-6">Edit Profile</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Your name"
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
            <Input
              label="New Password"
              type="password"
              placeholder="Leave blank to keep current password"
              {...register("password")}
              error={errors.password?.message}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="gap-2"
              >
                <XMarkIcon className="h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" isLoading={isSaving} className="gap-2">
                <CheckIcon className="h-4 w-4" />
                Save changes
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Account Info Card */}
      {!isEditing && (
        <div className="bg-surface rounded-2xl border border-border shadow-sm p-8">
          <h3 className="text-lg font-bold text-text-primary mb-6">Account Details</h3>
          <dl className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <dt className="w-32 text-sm font-semibold text-text-secondary uppercase tracking-wider">Name</dt>
              <dd className="text-text-primary font-medium">{user.name}</dd>
            </div>
            <div className="border-t border-border" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
              <dt className="w-32 text-sm font-semibold text-text-secondary uppercase tracking-wider">Email</dt>
              <dd className="text-text-primary font-medium">{user.email}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
