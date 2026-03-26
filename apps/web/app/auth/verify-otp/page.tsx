"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/shared/otp-input";
import { useAuthStore } from "@/stores/auth.store";
import api from "@/lib/api";
import { Mail, Loader2 } from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpComplete = useCallback(
    async (otp: string) => {
      setIsVerifying(true);
      try {
        const email = sessionStorage.getItem("verify-email") || "";
        const res = await api.post("/auth/verify-otp", { email, otp });
        login(res.data.user, res.data.accessToken, res.data.refreshToken);
        sessionStorage.removeItem("verify-email");
        toast.success("Email verified successfully!");
        router.push("/dashboard");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    },
    [login, router]
  );

  const handleResendOtp = async () => {
    try {
      const email = sessionStorage.getItem("verify-email") || "";
      await api.post("/auth/resend-otp", { email });
      setTimer(60);
      setCanResend(false);
      toast.success("A new OTP has been sent to your email");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Check your email
        </h1>
        <p className="mt-2 text-muted-foreground">
          We sent a 6-digit verification code to your email address
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex justify-center">
          <OtpInput
            length={6}
            onComplete={handleOtpComplete}
            disabled={isVerifying}
          />
        </div>

        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          {!canResend ? (
            <p className="text-sm text-muted-foreground">
              Resend code in{" "}
              <span className="font-semibold text-foreground">
                {formatTime(timer)}
              </span>
            </p>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResendOtp}
              className="font-semibold text-primary hover:text-primary/80"
            >
              Resend OTP
            </Button>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/auth/login"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
