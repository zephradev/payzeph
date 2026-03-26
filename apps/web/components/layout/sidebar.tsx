"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Phone,
  Zap,
  Tv,
  Receipt,
  Wallet,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/auth.store";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Airtime & Data", icon: Phone, href: "/dashboard/airtime" },
  { label: "Electricity", icon: Zap, href: "/dashboard/electricity" },
  { label: "Cable TV", icon: Tv, href: "/dashboard/cable-tv" },
  { label: "Transactions", icon: Receipt, href: "/dashboard/transactions" },
  { label: "Wallet", icon: Wallet, href: "/dashboard/wallet" },
  { label: "Profile", icon: User, href: "/dashboard/profile" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : "PayZeph User";
  const displayEmail = user?.email ?? "user@payzeph.com";
  const initials = getInitials(displayName);

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  function handleNavClick() {
    onNavigate?.();
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]",
        // On mobile inside Sheet, always show full width; otherwise hide on mobile
        !onToggleCollapse ? "!w-[280px] !relative flex" : "hidden lg:flex"
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          "flex h-16 items-center px-4 shrink-0",
          collapsed && onToggleCollapse ? "justify-center" : "gap-3"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/25">
          <Layers className="h-5 w-5 text-primary-foreground" />
        </div>
        {(!collapsed || !onToggleCollapse) && (
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-tight">
              PayZeph
            </span>
            <span className="text-[10px] font-medium text-sidebar-foreground/40 uppercase tracking-widest">
              Pay Bills Easily
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-sidebar-foreground/10" />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const isCollapsed = collapsed && !!onToggleCollapse;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground/90",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {/* Active left border indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary" />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-colors duration-200",
                  active
                    ? "text-primary"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
                )}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-sidebar-foreground/10" />

      {/* User Section */}
      <div className="shrink-0 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1",
            collapsed && onToggleCollapse && "justify-center px-0"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0 ring-2 ring-sidebar-foreground/10">
            <AvatarImage src={user?.avatar} alt={displayName} />
            <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {(!collapsed || !onToggleCollapse) && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-sidebar-foreground/90">
                {displayName}
              </span>
              <span className="truncate text-[11px] text-sidebar-foreground/40">
                {displayEmail}
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle - desktop only */}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={cn(
              "w-full text-sidebar-foreground/50 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground/80 transition-colors duration-200",
              collapsed ? "justify-center" : "justify-start gap-3"
            )}
            onClick={onToggleCollapse}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm">Collapse</span>
              </>
            )}
          </Button>
        )}

        {/* Logout */}
        <Button
          variant="ghost"
          size={collapsed && onToggleCollapse ? "icon" : "default"}
          className={cn(
            "w-full text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-colors duration-200",
            collapsed && onToggleCollapse ? "justify-center" : "justify-start gap-3"
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {(!collapsed || !onToggleCollapse) && <span className="text-sm">Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
