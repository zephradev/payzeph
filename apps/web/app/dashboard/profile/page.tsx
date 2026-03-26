"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useUser } from "@/hooks/use-user";
import { useAuthStore } from "@/stores/auth.store";
import { getInitials } from "@/lib/utils";
import api from "@/lib/api";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { data: userData, isLoading } = useUser();
  const authUser = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const user = authUser ?? userData;
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Pre-fill profile form when user data is available
  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      const res = await api.put("/user/profile", {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      updateUser(res.data.user);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await api.post("/user/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPassword();
      toast.success("Password updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  if (isLoading && !authUser) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-2xl" />
        <Skeleton className="h-[250px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your personal information" />

      {/* Avatar Section */}
      <Card className="border border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="h-24 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5" />
        <CardContent className="flex flex-col items-center gap-4 pb-8 -mt-12 sm:flex-row sm:items-end sm:gap-6 sm:px-8">
          <Avatar className="h-24 w-24 text-2xl ring-4 ring-background shadow-lg">
            <AvatarImage src={user?.avatar} alt={fullName} />
            <AvatarFallback className="text-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              {fullName ? getInitials(fullName) : <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left sm:pb-1">
            <h2 className="text-xl font-semibold text-foreground">
              {fullName || "User"}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Button variant="outline" size="sm" className="mt-3 rounded-xl">
              <Camera className="h-4 w-4" />
              Change Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card className="border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Personal Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-medium text-muted-foreground">First Name</Label>
                <Input id="firstName" className="rounded-xl" {...registerProfile("firstName")} />
                {profileErrors.firstName && (
                  <p className="text-xs text-destructive">
                    {profileErrors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-medium text-muted-foreground">Last Name</Label>
                <Input id="lastName" className="rounded-xl" {...registerProfile("lastName")} />
                {profileErrors.lastName && (
                  <p className="text-xs text-destructive">
                    {profileErrors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                disabled
                {...registerProfile("email")}
                className="disabled:bg-muted rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                className="rounded-xl"
                {...registerProfile("phone")}
              />
              {profileErrors.phone && (
                <p className="text-xs text-destructive">
                  {profileErrors.phone.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 pt-6">
            <Button type="submit" disabled={isProfileSubmitting} className="rounded-xl">
              {isProfileSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Change Password */}
      <Card className="border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Change Password</CardTitle>
        </CardHeader>
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword" className="text-xs font-medium text-muted-foreground">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                className="rounded-xl"
                {...registerPassword("currentPassword")}
              />
              {passwordErrors.currentPassword && (
                <p className="text-xs text-destructive">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-medium text-muted-foreground">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="rounded-xl"
                  {...registerPassword("newPassword")}
                />
                {passwordErrors.newPassword && (
                  <p className="text-xs text-destructive">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="rounded-xl"
                  {...registerPassword("confirmPassword")}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 pt-6">
            <Button type="submit" disabled={isPasswordSubmitting} className="rounded-xl">
              {isPasswordSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
