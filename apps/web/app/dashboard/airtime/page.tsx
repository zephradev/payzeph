"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { cn, formatNaira, detectNetwork } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NetworkSelector, type NetworkId } from "@/components/bills/network-selector";
import { BeneficiaryList, type Beneficiary } from "@/components/bills/beneficiary-list";
import { PageHeader } from "@/components/shared/page-header";
import { useBillStore } from "@/stores/bill.store";
import api from "@/lib/api";

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

const mockBeneficiaries: Beneficiary[] = [
  { id: "b1", name: "Ifeanyi Okafor", phone: "08012345678" },
  { id: "b2", name: "Ada Eze", phone: "08098765432" },
  { id: "b3", name: "Chidi Nwosu", phone: "07055512345" },
];

export default function AirtimePage() {
  const { selectedNetwork, setSelectedNetwork } = useBillStore();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = useCallback(
    (value: string) => {
      const cleaned = value.replace(/\D/g, "");
      setPhone(cleaned);
      if (cleaned.length >= 4) {
        const detected = detectNetwork(cleaned);
        if (detected) {
          setSelectedNetwork(detected);
        }
      }
    },
    [setSelectedNetwork]
  );

  const handleBeneficiarySelect = useCallback(
    (beneficiary: Beneficiary) => {
      setPhone(beneficiary.phone);
      const detected = detectNetwork(beneficiary.phone);
      if (detected) {
        setSelectedNetwork(detected);
      }
    },
    [setSelectedNetwork]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedNetwork || !phone || !amount) return;

      setIsLoading(true);
      try {
        await api.post("/bills/airtime", {
          network: selectedNetwork,
          phone,
          amount: Number(amount),
        });
        toast.success(
          `Successfully purchased ${formatNaira(Number(amount))} airtime for ${phone}`
        );
        setPhone("");
        setAmount("");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Airtime purchase failed");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedNetwork, phone, amount]
  );

  const isFormValid = selectedNetwork && phone.length >= 11 && Number(amount) > 0;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Buy Airtime"
        description="Purchase airtime for any Nigerian network"
      />

      <Card className="border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Recent Beneficiaries</CardTitle>
        </CardHeader>
        <CardContent>
          <BeneficiaryList
            beneficiaries={mockBeneficiaries}
            onSelect={handleBeneficiarySelect}
          />
        </CardContent>
      </Card>

      <Card className="border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Purchase Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label>Select Network</Label>
              <NetworkSelector
                selected={(selectedNetwork as NetworkId) || null}
                onSelect={(network) => setSelectedNetwork(network)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 08012345678"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={11}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={50}
              />
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {quickAmounts.map((qa) => (
                  <button
                    key={qa}
                    type="button"
                    onClick={() => setAmount(String(qa))}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm font-medium transition-all",
                      "hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      Number(amount) === qa
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/50 bg-card text-foreground"
                    )}
                  >
                    {formatNaira(qa)}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Processing..." : "Buy Airtime"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
