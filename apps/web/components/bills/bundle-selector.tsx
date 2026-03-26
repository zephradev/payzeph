"use client";

import { cn, formatNaira } from "@/lib/utils";

export interface Bundle {
  id: string;
  name: string;
  amount: number;
  validity?: string;
}

interface BundleSelectorProps {
  bundles: Bundle[];
  selected: string | null;
  onSelect: (bundleId: string) => void;
  className?: string;
}

export function BundleSelector({
  bundles,
  selected,
  onSelect,
  className,
}: BundleSelectorProps) {
  if (bundles.length === 0) {
    return (
      <div className={cn("py-8 text-center text-sm text-muted-foreground", className)}>
        No bundles available
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {bundles.map((bundle) => {
        const isSelected = selected === bundle.id;

        return (
          <button
            key={bundle.id}
            type="button"
            onClick={() => onSelect(bundle.id)}
            className={cn(
              "flex items-center justify-between rounded-xl border-2 bg-card px-4 py-3.5 text-left transition-all duration-200",
              "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border/50 hover:border-primary/50"
            )}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {bundle.name}
              </span>
              {bundle.validity && (
                <span className="text-xs text-muted-foreground">
                  {bundle.validity}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {formatNaira(bundle.amount)}
              </span>

              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-200",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              >
                {isSelected && (
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
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
