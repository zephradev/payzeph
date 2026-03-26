"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { cn, formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BundleSelector } from "@/components/bills/bundle-selector";
import { PageHeader } from "@/components/shared/page-header";
import { useCableBouquets } from "@/hooks/use-cable-bouquets";
import { useBillStore } from "@/stores/bill.store";
import api from "@/lib/api";

const providers = [
  { id: "dstv", name: "DStv", color: "#003B7E" },
  { id: "gotv", name: "GOtv", color: "#00A651" },
  { id: "startimes", name: "Startimes", color: "#FF6600" },
] as const;

type ProviderId = (typeof providers)[number]["id"];

export default function CableTvPage() {
  const { selectedProvider, setSelectedProvider } = useBillStore();
  const [smartcardNumber, setSmartcardNumber] = useState("");
  const [selectedBouquet, setSelectedBouquet] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: bouquets, isLoading: bouquetsLoading } = useCableBouquets(selectedProvider);

  const isSmartcardValid = smartcardNumber.length >= 10 && smartcardNumber.length <= 13;

  // Verify smartcard via API
  useEffect(() => {
    if (!isSmartcardValid || !selectedProvider) {
      setCustomerName("");
      return;
    }

    setIsVerifying(true);
    setCustomerName("");
    const controller = new AbortController();

    api.post("/bills/cable-tv/verify-smartcard", {
      provider: selectedProvider,
      smartcardNumber,
    }, { signal: controller.signal })
      .then((res) => {
        setCustomerName(res.data.customerName);
        setIsVerifying(false);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setIsVerifying(false);
        }
      });

    return () => controller.abort();
  }, [smartcardNumber, selectedProvider, isSmartcardValid]);

  const handleProviderSelect = useCallback(
    (provider: ProviderId) => {
      setSelectedProvider(provider);
      setSelectedBouquet(null);
    },
    [setSelectedProvider]
  );

  const handleSmartcardChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, "");
    setSmartcardNumber(cleaned);
  }, []);

  const selectedBouquetData = bouquets?.find((b) => b.id === selectedBouquet);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedProvider || !isSmartcardValid || !customerName || !selectedBouquet || !selectedBouquetData) return;

      setIsLoading(true);
      try {
        await api.post("/bills/cable-tv", {
          provider: selectedProvider,
          smartcardNumber,
          bouquetId: selectedBouquet,
        });
        const providerName = providers.find((p) => p.id === selectedProvider)?.name ?? selectedProvider;
        toast.success(
          `Successfully subscribed to ${selectedBouquetData.name} (${formatNaira(selectedBouquetData.amount)}) on ${providerName}`
        );
        setSmartcardNumber("");
        setSelectedBouquet(null);
        setCustomerName("");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Subscription failed");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedProvider, isSmartcardValid, customerName, selectedBouquet, selectedBouquetData, smartcardNumber]
  );

  const isFormValid =
    selectedProvider && isSmartcardValid && customerName && selectedBouquet && !isVerifying;

  // Map bouquets to BundleSelector format with channel info in validity field
  const bundlesForSelector = bouquets?.map((b) => ({
    id: b.id,
    name: b.name,
    amount: b.amount,
    validity: `${b.channels} channels`,
  })) ?? [];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Pay Cable TV"
        description="Subscribe to your favourite cable TV package"
      />

      <Card className="border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Subscription Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label>Select Provider</Label>
              <div className="grid grid-cols-3 gap-3">
                {providers.map((provider) => {
                  const isSelected = selectedProvider === provider.id;

                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => handleProviderSelect(provider.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-card p-4 transition-all",
                        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        isSelected
                          ? "border-primary shadow-sm"
                          : "border-border/50 hover:border-primary/50"
                      )}
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: provider.color }}
                      >
                        {provider.name.slice(0, 3).toUpperCase()}
                      </div>

                      <span className="text-sm font-medium text-foreground">
                        {provider.name}
                      </span>

                      {isSelected && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <svg
                            className="h-3 w-3 text-primary-foreground"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="smartcard">Smartcard / IUC Number</Label>
              <Input
                id="smartcard"
                type="text"
                inputMode="numeric"
                placeholder="Enter smartcard or IUC number"
                value={smartcardNumber}
                onChange={(e) => handleSmartcardChange(e.target.value)}
                maxLength={13}
              />
              {smartcardNumber.length > 0 && !isSmartcardValid && (
                <p className="text-xs text-destructive">
                  Smartcard number must be between 10 and 13 digits
                </p>
              )}
            </div>

            {isVerifying && (
              <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-4 py-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">
                  Verifying smartcard number...
                </span>
              </div>
            )}

            {customerName && !isVerifying && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-xs text-muted-foreground">Customer Name</p>
                <p className="text-sm font-semibold text-foreground">
                  {customerName}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label>Select Bouquet</Label>
              {!selectedProvider ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Please select a provider first
                </p>
              ) : bouquetsLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <BundleSelector
                  bundles={bundlesForSelector}
                  selected={selectedBouquet}
                  onSelect={setSelectedBouquet}
                />
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Processing..." : "Subscribe"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
