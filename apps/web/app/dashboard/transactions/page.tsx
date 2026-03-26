"use client";

import { useState, useMemo } from "react";
import { Receipt, Search, ChevronLeft, ChevronRight, Download, Phone, Wifi, Zap, Tv, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useTransactions } from "@/hooks/use-transactions";
import { formatNaira, formatDate, cn } from "@/lib/utils";
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

const typeIcons: Record<Transaction["type"], typeof Phone> = {
  airtime: Phone,
  data: Wifi,
  electricity: Zap,
  "cable-tv": Tv,
  "wallet-funding": Wallet,
};

const PER_PAGE = 10;

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusTab, setStatusTab] = useState("all");

  const { data: transactionsData, isLoading } = useTransactions({
    page: 1,
    perPage: 50,
  });

  const filteredTransactions = useMemo(() => {
    if (!transactionsData?.data) return [];
    return transactionsData.data.filter((txn) => {
      if (statusTab !== "all" && txn.status !== statusTab) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          txn.description.toLowerCase().includes(q) ||
          txn.reference.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactionsData?.data, statusTab, searchQuery]);

  const totalPages = Math.ceil(filteredTransactions.length / PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  const handleStatusChange = (value: string) => {
    setStatusTab(value);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction History"
        description="View and manage all your transactions"
      />

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by description or reference..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9 rounded-xl border-border/50"
        />
      </div>

      {/* Tabs + Content */}
      <Tabs value={statusTab} onValueChange={handleStatusChange}>
        <TabsList className="w-full sm:w-auto rounded-xl">
          <TabsTrigger value="all" className="rounded-lg text-xs sm:text-sm">All</TabsTrigger>
          <TabsTrigger value="success" className="rounded-lg text-xs sm:text-sm">Success</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg text-xs sm:text-sm">Pending</TabsTrigger>
          <TabsTrigger value="failed" className="rounded-lg text-xs sm:text-sm">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value={statusTab}>
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
          ) : paginatedTransactions.length === 0 ? (
            <Card className="border border-border/50 rounded-2xl shadow-sm">
              <CardContent className="p-0">
                <EmptyState
                  icon={Receipt}
                  title="No transactions found"
                  description={
                    searchQuery
                      ? "Try a different search term."
                      : "You have no transactions matching this filter."
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="space-y-3 md:hidden">
                {paginatedTransactions.map((txn) => {
                  const Icon = typeIcons[txn.type] ?? Wallet;
                  return (
                    <div
                      key={txn.id}
                      className="rounded-xl border border-border/50 bg-card p-4 shadow-sm"
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
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 rounded-lg px-2 text-xs"
                              onClick={() =>
                                toast.success("Receipt downloaded", {
                                  description: `Receipt for ${txn.reference}`,
                                })
                              }
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
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
              <Card className="border border-border/50 rounded-2xl shadow-sm hidden md:block">
                <CardContent className="p-0 sm:p-6 sm:pt-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="text-xs font-medium text-muted-foreground">Date</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground">Description</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
                          <TableHead className="text-right text-xs font-medium text-muted-foreground">Amount</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                          <TableHead className="text-xs font-medium text-muted-foreground">Reference</TableHead>
                          <TableHead className="text-right text-xs font-medium text-muted-foreground">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTransactions.map((txn) => (
                          <TableRow key={txn.id} className="group">
                            <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                              {formatDate(txn.date)}
                            </TableCell>
                            <TableCell className="font-medium text-sm max-w-50 truncate">
                              {txn.description}
                            </TableCell>
                            <TableCell>
                              <span
                                className={cn(
                                  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
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
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-xl"
                                onClick={() =>
                                  toast.success("Receipt downloaded", {
                                    description: `Receipt for ${txn.reference}`,
                                  })
                                }
                              >
                                <Download className="h-4 w-4" />
                                <span className="sr-only lg:not-sr-only lg:ml-1">
                                  Receipt
                                </span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="rounded-xl text-xs sm:text-sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="rounded-xl text-xs sm:text-sm"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
