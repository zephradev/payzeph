"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Phone, Zap, Receipt, User } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Airtime", icon: Phone, href: "/dashboard/airtime" },
  { label: "Electricity", icon: Zap, href: "/dashboard/electricity" },
  { label: "Transactions", icon: Receipt, href: "/dashboard/transactions" },
  { label: "Profile", icon: User, href: "/dashboard/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="flex items-center justify-around px-1 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 px-3 py-1 text-[11px] font-medium transition-all duration-200 rounded-lg min-w-[56px]",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    active && "text-primary drop-shadow-[0_0_6px_rgba(16,185,129,0.3)]"
                  )}
                  strokeWidth={active ? 2.5 : 1.75}
                />
              </div>
              <span
                className={cn(
                  "transition-colors duration-200",
                  active ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              {/* Active dot indicator */}
              {active && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
