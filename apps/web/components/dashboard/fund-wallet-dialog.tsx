"use client";

import { useState } from "react";
import { X, Copy, Check, CreditCard, Building2, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

interface FundWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tab = "card" | "bank-transfer";
type Step = "amount" | "confirm";

export function FundWalletDialog({ open, onOpenChange }: FundWalletDialogProps) {
  const [activeTab, setActiveTab] = useState<Tab>("card");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [step, setStep] = useState<Step>("amount");

  const handleCopyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText("7824567890");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setAmount("");
    setCopied(false);
    setActiveTab("card");
    setStep("amount");
  };

  const handleProceedToConfirm = () => {
    if (!amount || Number(amount) < 100) {
      toast.error("Minimum amount is ₦100");
      return;
    }
    setStep("confirm");
  };

  const handleFundWallet = async () => {
    setIsFunding(true);
    try {
      const res = await api.post("/wallet/fund/initialize", { amount: Number(amount) });
      const { authorizationUrl } = res.data;

      if (authorizationUrl) {
        // Redirect to Flutterwave payment page
        window.location.href = authorizationUrl;
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initialize payment");
    } finally {
      setIsFunding(false);
    }
  };

  if (!open) return null;

  const numAmount = Number(amount) || 0;
  const fee = 0;
  const total = numAmount + fee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="animate-fade-in-up relative z-10 mx-4 w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-card-foreground">
            {step === "confirm" ? "Confirm Payment" : "Fund Wallet"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs - only show on amount step */}
        {step === "amount" && (
          <div className="mt-6 flex rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setActiveTab("card")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
                activeTab === "card"
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <CreditCard className="h-4 w-4" />
              Card Payment
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bank-transfer")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
                activeTab === "bank-transfer"
                  ? "bg-card text-card-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Building2 className="h-4 w-4" />
              Bank Transfer
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="mt-6">
          {step === "confirm" ? (
            /* Confirmation Step */
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-lg font-bold text-card-foreground">
                    &#8358;{numAmount.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fee</span>
                  <span className="text-sm font-semibold text-card-foreground">
                    &#8358;{fee.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">
                    &#8358;{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200/50 bg-blue-50/50 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                  You will be redirected to Flutterwave to complete this payment securely.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl py-3 text-sm font-semibold"
                  size="lg"
                  onClick={() => setStep("amount")}
                  disabled={isFunding}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  disabled={isFunding}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold"
                  size="lg"
                  onClick={handleFundWallet}
                >
                  {isFunding ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Pay &#8358;{total.toLocaleString()}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ) : activeTab === "card" ? (
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="fund-amount"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    &#8358;
                  </span>
                  <input
                    id="fund-amount"
                    type="number"
                    min="100"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-3 pl-9 pr-4 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {amount && Number(amount) < 100 && (
                  <p className="mt-1.5 text-xs text-destructive">Minimum amount is ₦100</p>
                )}
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2000, 5000, 10000, 20000, 50000].map((qa) => (
                  <button
                    key={qa}
                    type="button"
                    onClick={() => setAmount(String(qa))}
                    className={cn(
                      "rounded-lg border py-2 text-xs font-semibold transition-all",
                      Number(amount) === qa
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    )}
                  >
                    &#8358;{qa.toLocaleString()}
                  </button>
                ))}
              </div>

              <Button
                type="button"
                disabled={!amount || Number(amount) < 100}
                className="w-full rounded-xl py-3 text-sm font-semibold"
                size="lg"
                onClick={handleProceedToConfirm}
              >
                <span className="flex items-center gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Transfer to the account details below. Your wallet will be
                credited automatically.
              </p>

              <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bank Name</span>
                  <span className="text-sm font-bold text-card-foreground">Wema Bank</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-card-foreground font-mono tracking-wider">
                      7824567890
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAccountNumber}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      aria-label="Copy account number"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account Name</span>
                  <span className="text-sm font-bold text-card-foreground">PayZeph/John Doe</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 p-4 dark:border-amber-500/20 dark:bg-amber-500/5">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  Transfers are confirmed within 1-5 minutes. Please use the exact account number above.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
