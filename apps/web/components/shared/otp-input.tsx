"use client";

import { useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  onComplete,
  disabled = false,
  className,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!disabled) {
      inputsRef.current[0]?.focus();
    }
  }, [disabled]);

  const getOtp = useCallback(() => {
    return inputsRef.current.map((input) => input?.value ?? "").join("");
  }, []);

  const focusInput = useCallback((index: number) => {
    const input = inputsRef.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, "").slice(-1);
      const input = inputsRef.current[index];
      if (input) {
        input.value = digit;
      }

      if (digit && index < length - 1) {
        focusInput(index + 1);
      }

      const otp = getOtp();
      if (otp.length === length && onComplete) {
        onComplete(otp);
      }
    },
    [length, onComplete, focusInput, getOtp]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        const input = inputsRef.current[index];
        if (input && !input.value && index > 0) {
          e.preventDefault();
          const prev = inputsRef.current[index - 1];
          if (prev) {
            prev.value = "";
            focusInput(index - 1);
          }
        }
      }

      if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      }

      if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [length, focusInput]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

      pasted.split("").forEach((digit, i) => {
        const input = inputsRef.current[i];
        if (input) {
          input.value = digit;
        }
      });

      const nextIndex = Math.min(pasted.length, length - 1);
      focusInput(nextIndex);

      if (pasted.length === length && onComplete) {
        onComplete(pasted);
      }
    },
    [length, onComplete, focusInput]
  );

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          disabled={disabled}
          className={cn(
            "h-12 w-12 rounded-xl border border-border/50 bg-background text-center text-lg font-semibold",
            "transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "placeholder:text-muted-foreground/50"
          )}
          placeholder="·"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
