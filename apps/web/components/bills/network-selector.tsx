"use client";

import { cn } from "@/lib/utils";

const networks = [
  { id: "mtn", name: "MTN", color: "#FFCC00" },
  { id: "airtel", name: "Airtel", color: "#FF0000" },
  { id: "glo", name: "Glo", color: "#00A651" },
  { id: "9mobile", name: "9mobile", color: "#006B3F" },
] as const;

export type NetworkId = (typeof networks)[number]["id"];

interface NetworkSelectorProps {
  selected: NetworkId | null;
  onSelect: (network: NetworkId) => void;
  className?: string;
}

export function NetworkSelector({
  selected,
  onSelect,
  className,
}: NetworkSelectorProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}>
      {networks.map((network) => {
        const isSelected = selected === network.id;

        return (
          <button
            key={network.id}
            type="button"
            onClick={() => onSelect(network.id)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 bg-card p-4 transition-all duration-200",
              "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              isSelected
                ? "border-primary shadow-sm"
                : "border-border/50 hover:border-primary/50"
            )}
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
              style={{
                backgroundColor: network.color,
                color: network.id === "mtn" ? "#000" : "#fff",
              }}
            >
              {network.name.slice(0, 3).toUpperCase()}
            </div>

            <span className="text-sm font-medium text-foreground">
              {network.name}
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
  );
}
