"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { formatNaira, detectNetwork } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { NetworkSelector, type NetworkId } from "@/components/bills/network-selector";
import { BundleSelector } from "@/components/bills/bundle-selector";
import { BeneficiaryList, type Beneficiary } from "@/components/bills/beneficiary-list";
import { PageHeader } from "@/components/shared/page-header";
import { useDataBundles } from "@/hooks/use-data-bundles";
import { useBillStore } from "@/stores/bill.store";
import api from "@/lib/api";

const mockBeneficiaries: Beneficiary[] = [
  { id: "b1", name: "Ifeanyi Okafor", phone: "08012345678" },
  { id: "b2", name: "Ada Eze", phone: "08098765432" },
  { id: "b3", name: "Chidi Nwosu", phone: "07055512345" },
];

export default function DataPage() {
  const { selectedNetwork, setSelectedNetwork } = useBillStore();
  const [phone, setPhone] = useState("");
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: bundles, isLoading: bundlesLoading } = useDataBundles(selectedNetwork);

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

  const handleNetworkSelect = useCallback(
    (network: NetworkId) => {
      setSelectedNetwork(network);
      setSelectedBundle(null);
    },
    [setSelectedNetwork]
  );

  const handleBeneficiarySelect = useCallback(
    (beneficiary: Beneficiary) => {
      setPhone(beneficiary.phone);
      const detected = detectNetwork(beneficiary.phone);
      if (detected) {
        setSelectedNetwork(detected);
        setSelectedBundle(null);
      }
    },
    [setSelectedNetwork]
  );

  const selectedBundleData = bundles?.find((b) => b.id === selectedBundle);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedNetwork || !phone || !selectedBundle || !selectedBundleData) return;

      setIsLoading(true);
      try {
        await api.post("/bills/data", {
          network: selectedNetwork,
          phone,
          bundleId: selectedBundle,
        });
        toast.success(
          `Successfully purchased ${selectedBundleData.name} (${formatNaira(selectedBundleData.amount)}) for ${phone}`
        );
        setPhone("");
        setSelectedBundle(null);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Data purchase failed");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedNetwork, phone, selectedBundle, selectedBundleData]
  );

  const isFormValid = selectedNetwork && phone.length >= 11 && selectedBundle;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Buy Data"
        description="Purchase data bundles for any Nigerian network"
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
                onSelect={handleNetworkSelect}
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
              <Label>Select Data Plan</Label>
              {!selectedNetwork ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Please select a network first
                </p>
              ) : bundlesLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : bundles ? (
                <BundleSelector
                  bundles={bundles}
                  selected={selectedBundle}
                  onSelect={setSelectedBundle}
                />
              ) : null}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Processing..." : "Buy Data"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
