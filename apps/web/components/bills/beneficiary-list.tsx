"use client";

import { cn, getInitials, formatPhoneNumber } from "@/lib/utils";

export interface Beneficiary {
  id: string;
  name: string;
  phone: string;
}

interface BeneficiaryListProps {
  beneficiaries: Beneficiary[];
  onSelect: (beneficiary: Beneficiary) => void;
  onAddNew?: () => void;
  className?: string;
}

export function BeneficiaryList({
  beneficiaries,
  onSelect,
  onAddNew,
  className,
}: BeneficiaryListProps) {
  return (
    <div
      className={cn(
        "flex gap-4 overflow-x-auto pb-2 scrollbar-none",
        className
      )}
    >
      {/* Add New button */}
      <button
        type="button"
        onClick={onAddNew}
        className={cn(
          "flex shrink-0 flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl p-2 transition-colors duration-200"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-primary/50 bg-primary/5 transition-all duration-200 hover:border-primary hover:bg-primary/10 hover:shadow-sm">
          <svg
            className="h-5 w-5 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <span className="w-16 truncate text-center text-xs text-muted-foreground">
          Add New
        </span>
      </button>

      {/* Beneficiary items */}
      {beneficiaries.map((beneficiary) => (
        <button
          key={beneficiary.id}
          type="button"
          onClick={() => onSelect(beneficiary)}
          className={cn(
            "flex shrink-0 flex-col items-center gap-2 rounded-xl p-2 transition-all duration-200",
            "hover:bg-accent/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-2 ring-primary/20">
            {getInitials(beneficiary.name)}
          </div>
          <span className="w-16 truncate text-center text-xs font-medium text-foreground">
            {beneficiary.name.split(" ")[0]}
          </span>
          <span className="w-16 truncate text-center text-[10px] text-muted-foreground">
            {formatPhoneNumber(beneficiary.phone)}
          </span>
        </button>
      ))}
    </div>
  );
}
