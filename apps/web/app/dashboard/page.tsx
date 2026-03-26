"use client";

import { useState } from "react";
import { WalletCard } from "@/components/dashboard/wallet-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { FundWalletDialog } from "@/components/dashboard/fund-wallet-dialog";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { useTransactions } from "@/hooks/use-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth.store";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const { data: walletBalance, isLoading: isBalanceLoading } =
    useWalletBalance();
  const { data: transactionsData, isLoading: isTransactionsLoading } =
    useTransactions({ page: 1, perPage: 5 });

  const greeting = getGreeting();
  const firstName = user?.firstName ?? "User";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {greeting}, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s your account overview
        </p>
      </div>

      {/* Wallet Card */}
      {isBalanceLoading ? (
        <Skeleton className="h-50 w-full rounded-2xl" />
      ) : (
        <WalletCard
          balance={walletBalance ?? 0}
          onFundWallet={() => setFundDialogOpen(true)}
        />
      )}

      {/* Fund Wallet Dialog */}
      <FundWalletDialog
        open={fundDialogOpen}
        onOpenChange={setFundDialogOpen}
      />

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Quick Actions
        </h2>
        <QuickActions />
      </div>

      {/* Recent Transactions */}
      {isTransactionsLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-2">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <RecentTransactions
          transactions={transactionsData?.data ?? []}
        />
      )}
    </div>
  );
}
