"use client";

import Link from "next/link";
import { Phone, Wifi, Zap, Tv, Wallet, ArrowRight } from "lucide-react";
import { cn, formatNaira, formatDate } from "@/lib/utils";
import type { Transaction } from "@/lib/mock-data";

const typeIcons: Record<Transaction["type"], typeof Phone> = {
  airtime: Phone,
  data: Wifi,
  electricity: Zap,
  "cable-tv": Tv,
  "wallet-funding": Wallet,
};

const typeColors: Record<Transaction["type"], string> = {
  airtime: "text-blue-600 bg-blue-500/10 dark:text-blue-400",
  data: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400",
  electricity: "text-amber-600 bg-amber-500/10 dark:text-amber-400",
  "cable-tv": "text-purple-600 bg-purple-500/10 dark:text-purple-400",
  "wallet-funding": "text-primary bg-primary/10",
};

const statusStyles: Record<Transaction["status"], string> = {
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  failed: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="text-base font-bold text-card-foreground sm:text-lg">
          Recent Transactions
        </h2>
        <Link
          href="/dashboard/transactions"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80 sm:text-sm"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-muted-foreground sm:px-6 sm:py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Wallet className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-medium">No transactions yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Your transactions will appear here</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/50">
          {transactions.map((txn) => {
            const Icon = typeIcons[txn.type] ?? Wallet;
            return (
              <li
                key={txn.id}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/30 sm:gap-4 sm:px-6 sm:py-4"
              >
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11",
                    typeColors[txn.type] ?? "text-muted-foreground bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-card-foreground sm:text-sm">
                    {txn.description}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                    {formatDate(txn.date)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 sm:gap-1.5">
                  <p
                    className={cn(
                      "text-xs font-bold sm:text-sm",
                      txn.type === "wallet-funding"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-card-foreground"
                    )}
                  >
                    {txn.type === "wallet-funding" ? "+" : "-"}
                    {formatNaira(txn.amount)}
                  </p>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-semibold capitalize sm:px-2 sm:text-[10px]",
                      statusStyles[txn.status] ?? ""
                    )}
                  >
                    {txn.status}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
