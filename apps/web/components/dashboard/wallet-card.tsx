"use client";

import { useState } from "react";
import { Eye, EyeOff, Plus, ArrowUpRight } from "lucide-react";
import { formatNaira } from "@/lib/utils";

interface WalletCardProps {
  balance: number;
  onFundWallet: () => void;
}

export function WalletCard({ balance, onFundWallet }: WalletCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(220,25%,7%)] via-[hsl(220,20%,10%)] to-[hsl(162,30%,12%)] p-5 text-white shadow-xl sm:p-8">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-emerald-500/10 blur-2xl" />
      <div className="pointer-events-none absolute right-8 bottom-8 h-24 w-24 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-white/60 sm:text-sm">Wallet Balance</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight sm:mt-2 sm:text-4xl">
              {showBalance ? formatNaira(balance) : "********"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBalance((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-white/20 sm:h-10 sm:w-10"
            aria-label={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? (
              <Eye className="h-4 w-4 text-white/80" />
            ) : (
              <EyeOff className="h-4 w-4 text-white/80" />
            )}
          </button>
        </div>

        <div className="mt-6 flex gap-2.5 sm:mt-8 sm:gap-3">
          <button
            type="button"
            onClick={onFundWallet}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl sm:gap-2 sm:px-5 sm:text-sm"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Fund Wallet
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:gap-2 sm:px-5 sm:text-sm"
          >
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
