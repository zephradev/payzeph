import Link from "next/link";
import { Phone, Wifi, Zap, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    label: "Buy Airtime",
    icon: Phone,
    href: "/dashboard/airtime",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    hoverBorder: "hover:border-blue-500/30",
  },
  {
    label: "Buy Data",
    icon: Wifi,
    href: "/dashboard/data",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    hoverBorder: "hover:border-emerald-500/30",
  },
  {
    label: "Pay Electricity",
    icon: Zap,
    href: "/dashboard/electricity",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    hoverBorder: "hover:border-amber-500/30",
  },
  {
    label: "Pay Cable TV",
    icon: Tv,
    href: "/dashboard/cable-tv",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    hoverBorder: "hover:border-purple-500/30",
  },
] as const;

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={cn(
            "group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-5 text-card-foreground transition-all hover:shadow-md",
            action.hoverBorder
          )}
        >
          <div className={cn("rounded-2xl p-3.5 transition-transform group-hover:scale-105", action.color)}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
