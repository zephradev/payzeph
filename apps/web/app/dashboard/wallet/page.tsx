"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, Phone, Wifi, Zap, Tv, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { WalletCard } from "@/components/dashboard/wallet-card";
import { FundWalletDialog } from "@/components/dashboard/fund-wallet-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useWalletBalance } from "@/hooks/use-wallet-balance";
import { useTransactions } from "@/hooks/use-transactions";
import { formatNaira, formatDate, cn } from "@/lib/utils";
import { mockWalletBalance } from "@/lib/mock-data";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Transaction } from "@/lib/mock-data";

const typeLabels: Record<Transaction["type"], string> = {
  airtime: "Airtime",
  data: "Data",
  electricity: "Electricity",
  "cable-tv": "Cable TV",
  "wallet-funding": "Wallet Funding",
};

const statusStyles: Record<Transaction["status"], string> = {
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const typeStyles: Record<Transaction["type"], string> = {
  airtime:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  data:
    "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  electricity:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "cable-tv":
    "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  "wallet-funding":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
};

export default function WalletPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [fundDialogOpen, setFundDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const verifiedRef = useRef(false);

  const { data: walletBalance, isLoading: isBalanceLoading, refetch: refetchBalance } =
    useWalletBalance();
  const { data: transactionsData, isLoading: isTransactionsLoading, refetch: refetchTransactions } =
    useTransactions({ page: 1, perPage: 50 });

  // Verify payment when returning from Flutterwave
  useEffect(() => {
    // Flutterwave redirects with: ?status=successful&tx_ref=PZ-WLT-xxx&transaction_id=12345
    const reference = searchParams.get("tx_ref") || searchParams.get("reference");
    const transactionId = searchParams.get("transaction_id");
    const flwStatus = searchParams.get("status");

    if (reference && !verifiedRef.current) {
      verifiedRef.current = true;

      // If Flutterwave says cancelled, skip verification
      if (flwStatus === "cancelled") {
        toast.error("Payment was cancelled");
        router.replace("/dashboard/wallet");
        return;
      }

      setIsVerifying(true);
      api.post("/wallet/fund/verify", { reference, transactionId })
        .then(() => {
          toast.success("Wallet funded successfully!");
          refetchBalance();
          refetchTransactions();
        })
        .catch((err) => {
          const msg = err.response?.data?.message;
          if (msg === "Transaction already verified") {
            toast.success("Wallet funded successfully!");
            refetchBalance();
            refetchTransactions();
          } else {
            toast.error(msg || "Payment verification failed");
          }
        })
        .finally(() => {
          setIsVerifying(false);
          router.replace("/dashboard/wallet");
        });
    }
  }, [searchParams, refetchBalance, refetchTransactions, router]);

  const filteredTransactions = useMemo(() => {
    if (!transactionsData?.data) return [];
    return transactionsData.data.filter((txn) => {
      if (typeFilter !== "all" && txn.type !== typeFilter) return false;
      if (statusFilter !== "all" && txn.status !== statusFilter) return false;
      if (dateFrom) {
        const from = new Date(dateFrom);
        if (new Date(txn.date) < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(txn.date) > to) return false;
      }
      return true;
    });
  }, [transactionsData?.data, typeFilter, statusFilter, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      <PageHeader title="Wallet" description="Manage your wallet and view transaction history" />

      {isVerifying && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-primary">Verifying your payment...</span>
        </div>
      )}

      {/* Wallet Balance */}
      {isBalanceLoading ? (
        <Skeleton className="h-[180px] w-full rounded-2xl" />
      ) : (
        <WalletCard
          balance={walletBalance ?? mockWalletBalance}
          onFundWallet={() => setFundDialogOpen(true)}
        />
      )}

      <FundWalletDialog
        open={fundDialogOpen}
        onOpenChange={setFundDialogOpen}
      />

      {/* Transaction History */}
      <Card className="border border-border/50 rounded-2xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="airtime">Airtime</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="electricity">Electricity</SelectItem>
                  <SelectItem value="cable-tv">Cable TV</SelectItem>
                  <SelectItem value="wallet-funding">Wallet Funding</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date-from" className="text-xs font-medium text-muted-foreground">From</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date-to" className="text-xs font-medium text-muted-foreground">To</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Table */}
          {isTransactionsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 flex-1 rounded-lg" />
                  <Skeleton className="h-4 w-20 rounded-lg" />
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-16 rounded-lg" />
                  <Skeleton className="h-4 w-32 rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No transactions found"
              description="Try adjusting your filters to find what you're looking for."
            />
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="space-y-3 md:hidden">
                {filteredTransactions.map((txn) => {
                  const typeIconMap: Record<string, typeof Phone> = {
                    airtime: Phone, data: Wifi, electricity: Zap,
                    "cable-tv": Tv, "wallet-funding": Wallet,
                  };
                  const Icon = typeIconMap[txn.type] ?? Wallet;
                  return (
                    <div
                      key={txn.id}
                      className="rounded-xl border border-border/50 bg-muted/20 p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                            typeStyles[txn.type]
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-card-foreground truncate">
                              {txn.description}
                            </p>
                            <p
                              className={cn(
                                "text-sm font-bold whitespace-nowrap",
                                txn.type === "wallet-funding"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-card-foreground"
                              )}
                            >
                              {txn.type === "wallet-funding" ? "+" : "-"}
                              {formatNaira(txn.amount)}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={cn(
                                "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                                statusStyles[txn.status]
                              )}
                            >
                              {txn.status}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {formatDate(txn.date)}
                            </span>
                          </div>
                          <p className="mt-1 text-[10px] text-muted-foreground font-mono truncate">
                            {txn.reference}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Description</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                      <TableHead className="text-right text-xs font-medium text-muted-foreground">Amount</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                      <TableHead className="text-xs font-medium text-muted-foreground">Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((txn) => (
                      <TableRow key={txn.id} className="group">
                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(txn.date)}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {txn.description}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                              typeStyles[txn.type]
                            )}
                          >
                            {typeLabels[txn.type]}
                          </span>
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-semibold whitespace-nowrap text-sm",
                            txn.type === "wallet-funding"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : ""
                          )}
                        >
                          {txn.type === "wallet-funding" ? "+" : "-"}
                          {formatNaira(txn.amount)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                              statusStyles[txn.status]
                            )}
                          >
                            {txn.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {txn.reference}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
