"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { cn, formatNaira } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { discoList } from "@/lib/mock-data";
import api from "@/lib/api";

type MeterType = "prepaid" | "postpaid";

export default function ElectricityPage() {
  const [disco, setDisco] = useState("");
  const [meterType, setMeterType] = useState<MeterType>("prepaid");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMeterValid = meterNumber.length >= 10 && meterNumber.length <= 13;

  // Verify meter via API
  useEffect(() => {
    if (!isMeterValid || !disco) {
      setCustomerName("");
      return;
    }

    setIsVerifying(true);
    setCustomerName("");
    const controller = new AbortController();

    api.post("/bills/electricity/verify-meter", {
      discoId: disco,
      meterType,
      meterNumber,
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
  }, [meterNumber, disco, meterType, isMeterValid]);

  const handleMeterChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, "");
    setMeterNumber(cleaned);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!disco || !isMeterValid || !customerName || !amount) return;

      setIsLoading(true);
      try {
        await api.post("/bills/electricity", {
          discoId: disco,
          meterType,
          meterNumber,
          amount: Number(amount),
        });
        const discoName = discoList.find((d) => d.id === disco)?.name ?? disco;
        toast.success(
          `Successfully paid ${formatNaira(Number(amount))} to ${discoName} for meter ${meterNumber}`
        );
        setMeterNumber("");
        setAmount("");
        setCustomerName("");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Electricity payment failed");
      } finally {
        setIsLoading(false);
      }
    },
    [disco, isMeterValid, customerName, amount, meterNumber, meterType]
  );

  const isFormValid = disco && isMeterValid && customerName && Number(amount) > 0 && !isVerifying;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Pay Electricity Bill"
        description="Pay your electricity bill to any distribution company"
      />

      <Card className="border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label>Distribution Company (DisCo)</Label>
              <Select value={disco} onValueChange={setDisco}>
                <SelectTrigger>
                  <span className="pointer-events-none">
                    {disco ? (
                      discoList.find((d) => d.id === disco)?.name
                    ) : (
                      <span className="text-muted-foreground">
                        Select a distribution company
                      </span>
                    )}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {discoList.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Meter Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["prepaid", "postpaid"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setMeterType(type)}
                    className={cn(
                      "rounded-xl border-2 px-4 py-2.5 text-sm font-medium capitalize transition-all",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      meterType === type
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/50 bg-card text-foreground hover:border-primary/50 hover:shadow-sm"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="meter">Meter Number</Label>
              <Input
                id="meter"
                type="text"
                inputMode="numeric"
                placeholder="Enter meter number (10-13 digits)"
                value={meterNumber}
                onChange={(e) => handleMeterChange(e.target.value)}
                maxLength={13}
              />
              {meterNumber.length > 0 && !isMeterValid && (
                <p className="text-xs text-destructive">
                  Meter number must be between 10 and 13 digits
                </p>
              )}
            </div>

            {isVerifying && (
              <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/50 px-4 py-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="text-sm text-muted-foreground">
                  Verifying meter number...
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
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={500}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Processing..." : "Pay Electricity"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
