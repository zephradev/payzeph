"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Lock, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const amount = Number(searchParams.get("amount")) || 0;
  const reference = searchParams.get("reference") || "";
  const callbackUrl = searchParams.get("callback") || "/dashboard/wallet";
  const email = searchParams.get("email") || "";

  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [cardNumber, setCardNumber] = useState("5399 8383 8383 8381");
  const [cardHolder, setCardHolder] = useState("TEST USER");
  const [expiry, setExpiry] = useState("10/31");
  const [cvv, setCvv] = useState("564");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "transfer">("card");

  useEffect(() => {
    if (!amount || !reference) {
      router.replace("/dashboard");
    }
  }, [amount, reference, router]);

  const handlePay = () => {
    setStatus("processing");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        const separator = callbackUrl.includes("?") ? "&" : "?";
        router.replace(
          `${callbackUrl}${separator}tx_ref=${reference}&transaction_id=SIM-${Date.now()}&status=successful`
        );
      }, 1500);
    }, 2500);
  };

  const handleCancel = () => {
    setStatus("failed");
    setTimeout(() => {
      const separator = callbackUrl.includes("?") ? "&" : "?";
      router.replace(
        `${callbackUrl}${separator}tx_ref=${reference}&status=cancelled`
      );
    }, 1000);
  };

  if (!amount || !reference) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[920px]">
        {/* Back button */}
        <button
          onClick={handleCancel}
          className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to PayZeph
        </button>

        {/* Status overlays */}
        {status !== "idle" && (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-12 sm:p-16">
            <div className="text-center">
              {status === "processing" && (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-neutral-400 mx-auto" />
                  <p className="mt-5 text-base font-medium text-neutral-200">Processing payment...</p>
                  <p className="mt-1.5 text-sm text-neutral-500">Please wait, do not close this page</p>
                </>
              )}
              {status === "success" && (
                <>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <p className="mt-5 text-base font-medium text-neutral-200">Payment Successful</p>
                  <p className="mt-1.5 text-sm text-neutral-500">Redirecting back to your dashboard...</p>
                </>
              )}
              {status === "failed" && (
                <>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <p className="mt-5 text-base font-medium text-neutral-200">Payment Cancelled</p>
                  <p className="mt-1.5 text-sm text-neutral-500">Redirecting...</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main checkout layout */}
        {status === "idle" && (
          <div className="flex flex-col lg:flex-row rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
            {/* Left — Payment form */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10">
              <h1 className="text-xl font-semibold text-neutral-100">Checkout</h1>

              {/* Payment method selector */}
              <div className="mt-6">
                <p className="text-sm font-medium text-neutral-400 mb-3">Payment method</p>
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      selectedMethod === "card"
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      checked={selectedMethod === "card"}
                      onChange={() => setSelectedMethod("card")}
                      className="sr-only"
                    />
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === "card" ? "border-emerald-500" : "border-neutral-600"
                    }`}>
                      {selectedMethod === "card" && (
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <span className="flex-1 text-sm font-medium text-neutral-200">Credit card</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-9 rounded bg-[#1A1F71] flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white italic">VISA</span>
                      </div>
                      <div className="h-6 w-9 rounded bg-neutral-800 flex items-center justify-center">
                        <div className="flex -space-x-1">
                          <div className="h-3.5 w-3.5 rounded-full bg-red-500 opacity-80" />
                          <div className="h-3.5 w-3.5 rounded-full bg-yellow-500 opacity-80" />
                        </div>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-colors ${
                      selectedMethod === "transfer"
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="method"
                      checked={selectedMethod === "transfer"}
                      onChange={() => setSelectedMethod("transfer")}
                      className="sr-only"
                    />
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      selectedMethod === "transfer" ? "border-emerald-500" : "border-neutral-600"
                    }`}>
                      {selectedMethod === "transfer" && (
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <span className="flex-1 text-sm font-medium text-neutral-200">Bank transfer</span>
                  </label>
                </div>
              </div>

              {/* Card form */}
              {selectedMethod === "card" && (
                <div className="mt-6 space-y-4 rounded-xl border border-neutral-800 p-5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">Card holder name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-transparent border-b border-neutral-800 pb-2.5 text-sm text-neutral-200 placeholder:text-neutral-700 focus:border-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">Card number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 1234 1234 1234"
                      className="w-full bg-transparent border-b border-neutral-800 pb-2.5 text-sm text-neutral-200 placeholder:text-neutral-700 focus:border-neutral-600 focus:outline-none font-mono tracking-wide transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5">Expiration</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-transparent border-b border-neutral-800 pb-2.5 text-sm text-neutral-200 placeholder:text-neutral-700 focus:border-neutral-600 focus:outline-none font-mono transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1.5">CVV</label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className="w-full bg-transparent border-b border-neutral-800 pb-2.5 text-sm text-neutral-200 placeholder:text-neutral-700 focus:border-neutral-600 focus:outline-none font-mono transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank transfer info */}
              {selectedMethod === "transfer" && (
                <div className="mt-6 rounded-xl border border-neutral-800 p-5 space-y-4">
                  <p className="text-sm text-neutral-400">
                    Transfer the exact amount to the account below. Your wallet will be credited once confirmed.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-neutral-500">Bank</span>
                      <span className="text-sm font-medium text-neutral-200">Wema Bank</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-neutral-500">Account No.</span>
                      <span className="text-sm font-medium text-neutral-200 font-mono">7824567890</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-neutral-500">Account Name</span>
                      <span className="text-sm font-medium text-neutral-200">PayZeph Ltd</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Pay button */}
              <button
                onClick={handlePay}
                className="mt-6 w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-semibold text-black transition-all hover:bg-emerald-400 active:scale-[0.99]"
              >
                Pay &#8358;{amount.toLocaleString()}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-neutral-600">
                <Lock className="h-3 w-3" />
                <span className="text-xs">Secure payment &bull; SSL encrypted</span>
              </div>
            </div>

            {/* Right — Summary */}
            <div className="border-t lg:border-t-0 lg:border-l border-neutral-800 bg-neutral-950/50 p-6 sm:p-8 lg:p-10 lg:w-[340px] shrink-0">
              <h2 className="text-sm font-semibold text-neutral-300">Summary</h2>

              <div className="mt-6 rounded-xl bg-neutral-800/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <span className="text-lg font-bold text-emerald-500">P</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">Wallet Funding</p>
                    <p className="text-xs text-neutral-500">PayZeph Wallet</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Amount</span>
                  <span className="text-sm font-medium text-neutral-200">
                    &#8358;{amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Fee</span>
                  <span className="text-sm font-medium text-neutral-200">&#8358;0.00</span>
                </div>
                <div className="h-px bg-neutral-800" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-300">Total</span>
                  <span className="text-lg font-bold text-neutral-100">
                    &#8358;{amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {email && (
                <div className="mt-6 pt-5 border-t border-neutral-800">
                  <span className="text-xs text-neutral-600">Paying as</span>
                  <p className="mt-0.5 text-sm text-neutral-400 truncate">{email}</p>
                </div>
              )}

              <div className="mt-6 pt-5 border-t border-neutral-800">
                <span className="text-xs text-neutral-600">Reference</span>
                <p className="mt-0.5 text-xs text-neutral-500 font-mono break-all">{reference}</p>
              </div>

              <div className="mt-6 rounded-lg bg-amber-500/5 border border-amber-500/10 px-3 py-2.5">
                <p className="text-[11px] text-amber-500/80 leading-relaxed">
                  Test mode — no real charges will be made. Use the pre-filled card details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 text-center">
          <p className="text-[11px] text-neutral-700">PZ&copy;2025</p>
        </div>
      </div>
    </div>
  );
}
