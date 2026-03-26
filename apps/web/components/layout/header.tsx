"use client";

import { useState, useCallback, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn, getInitials, formatNaira, formatDate } from "@/lib/utils";
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Wallet,
  Phone,
  Zap,
  Tv,
  Receipt,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/auth.store";
import { useTransactions } from "@/hooks/use-transactions";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/airtime": "Airtime & Data",
  "/dashboard/data": "Data Bundles",
  "/dashboard/electricity": "Electricity",
  "/dashboard/cable-tv": "Cable TV",
  "/dashboard/transactions": "Transactions",
  "/dashboard/wallet": "Wallet",
  "/dashboard/profile": "Profile",
  "/dashboard/settings": "Settings",
};

const pageSubtitles: Record<string, string> = {
  "/dashboard": "Welcome back! Here's your overview.",
  "/dashboard/airtime": "Purchase airtime and data bundles.",
  "/dashboard/data": "Purchase data bundles.",
  "/dashboard/electricity": "Pay your electricity bills.",
  "/dashboard/cable-tv": "Subscribe to cable TV packages.",
  "/dashboard/transactions": "View your transaction history.",
  "/dashboard/wallet": "Manage your wallet balance.",
  "/dashboard/profile": "Manage your personal information.",
  "/dashboard/settings": "Customize your preferences.",
};

const searchablePages = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Buy Airtime", href: "/dashboard/airtime", icon: Phone },
  { label: "Buy Data", href: "/dashboard/data", icon: Phone },
  { label: "Pay Electricity", href: "/dashboard/electricity", icon: Zap },
  { label: "Cable TV", href: "/dashboard/cable-tv", icon: Tv },
  { label: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface HeaderUser {
  name: string;
  avatar?: string;
}

interface HeaderProps {
  onMenuClick?: () => void;
  user?: HeaderUser;
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { data: txnData } = useTransactions({ page: 1, perPage: 5 });

  const pageTitle = pageTitles[pathname] ?? "Dashboard";
  const pageSubtitle = pageSubtitles[pathname] ?? "";
  const initials = user?.name ? getInitials(user.name) : "PZ";

  const filteredPages = useMemo(() => {
    if (!searchQuery.trim()) return searchablePages;
    const q = searchQuery.toLowerCase();
    return searchablePages.filter((p) => p.label.toLowerCase().includes(q));
  }, [searchQuery]);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/auth/login");
  }, [logout, router]);

  const handleSearchNav = useCallback(
    (href: string) => {
      setSearchOpen(false);
      setSearchQuery("");
      router.push(href);
    },
    [router]
  );

  // Recent transactions as notifications
  const notifications = txnData?.data?.slice(0, 5) ?? [];

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center border-b border-border/50 bg-background/80 px-4 md:px-6 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        {/* Mobile: hamburger + centered branding */}
        <div className="flex flex-1 items-center lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 hover:bg-muted/80 transition-colors duration-200"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              PayZeph
            </span>
          </div>
          {/* Spacer to balance hamburger */}
          <div className="w-10" />
        </div>

        {/* Desktop: page title on left */}
        <div className="hidden flex-1 lg:block">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {pageTitle}
          </h1>
          {pageSubtitle && (
            <p className="text-[13px] text-muted-foreground mt-0.5 leading-none">
              {pageSubtitle}
            </p>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-[18px] w-[18px]" />
          </Button>

          {/* Notifications */}
          <DropdownMenu
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                {notifications.length > 0 && (
                  <span className="absolute right-2 top-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] sm:w-80 max-w-80">
              <DropdownMenuLabel className="font-semibold">
                Recent Activity
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No recent activity
                </div>
              ) : (
                notifications.map((txn: any) => (
                  <DropdownMenuItem
                    key={txn.id}
                    className="flex flex-col items-start gap-1 px-3 py-2.5 cursor-pointer"
                    onClick={() => router.push("/dashboard/transactions")}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium truncate max-w-[180px]">
                        {txn.description}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          txn.type === "wallet-funding"
                            ? "text-emerald-600"
                            : "text-foreground"
                        )}
                      >
                        {txn.type === "wallet-funding" ? "+" : "-"}
                        {formatNaira(txn.amount)}
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <span
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                          txn.status === "success" &&
                            "bg-emerald-500/10 text-emerald-600",
                          txn.status === "pending" &&
                            "bg-amber-500/10 text-amber-600",
                          txn.status === "failed" &&
                            "bg-destructive/10 text-destructive"
                        )}
                      >
                        {txn.status}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(txn.date)}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="justify-center text-sm font-medium text-primary cursor-pointer"
                onClick={() => router.push("/dashboard/transactions")}
              >
                View all transactions
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="hidden md:block h-6 w-px bg-border/60 mx-1.5" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 pl-1 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/80 outline-none">
                <Avatar className="h-8 w-8 ring-2 ring-border/50 transition-shadow hover:ring-primary/30">
                  <AvatarImage
                    src={user?.avatar}
                    alt={user?.name ?? "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {user?.name && (
                  <div className="hidden lg:flex items-center gap-1">
                    <span className="text-sm font-medium leading-tight">
                      {user.name}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">
                    {user?.name ?? "User"}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none">
                    Manage your account
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => router.push("/dashboard/profile")}
              >
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => router.push("/dashboard/wallet")}
              >
                <Wallet className="h-4 w-4" />
                Wallet
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer gap-2"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          />
          <div className="relative z-10 mx-4 w-full max-w-lg rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                  if (e.key === "Enter" && filteredPages.length > 0) {
                    handleSearchNav(filteredPages[0].href);
                  }
                }}
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[300px] overflow-y-auto py-2">
              {filteredPages.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No results found
                </p>
              ) : (
                filteredPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.href}
                      onClick={() => handleSearchNav(page.href)}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/80",
                        pathname === page.href && "bg-primary/5 text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium">{page.label}</span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="border-t border-border/50 px-4 py-2">
              <p className="text-[11px] text-muted-foreground">
                Press <kbd className="rounded border border-border px-1 py-0.5 text-[10px] font-mono">Enter</kbd> to navigate, <kbd className="rounded border border-border px-1 py-0.5 text-[10px] font-mono">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
