"use client";

import { useState } from "react";
import {
  Bell,
  Shield,
  Monitor,
  Sun,
  Moon,
  Laptop,
  Smartphone,
  Globe,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ToggleRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          checked ? "bg-emerald-500 dark:bg-emerald-500" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  icon: typeof Monitor;
  current: boolean;
}

const mockSessions: Session[] = [
  {
    id: "s1",
    device: "Windows PC",
    browser: "Chrome",
    location: "Lagos, Nigeria",
    lastActive: "Active now",
    icon: Monitor,
    current: true,
  },
  {
    id: "s2",
    device: "iPhone 15",
    browser: "Safari",
    location: "Lagos, Nigeria",
    lastActive: "2 hours ago",
    icon: Smartphone,
    current: false,
  },
];

type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
  // Notification preferences
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [txnAlerts, setTxnAlerts] = useState(true);

  // Security settings
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginNotif, setLoginNotif] = useState(true);
  const [sessions, setSessions] = useState(mockSessions);

  // Appearance
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "light" || stored === "dark" || stored === "system")
        return stored;
    }
    return "system";
  });

  const applyTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      const root = document.documentElement;
      if (newTheme === "dark") {
        root.classList.add("dark");
      } else if (newTheme === "light") {
        root.classList.remove("dark");
      } else {
        // System preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (prefersDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Session revoked successfully");
  };

  const handleSave = () => {
    toast.success("Preferences saved successfully");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account preferences"
      />

      {/* Notification Preferences */}
      <Card className="border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
              <Bell className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-lg font-semibold">Notification Preferences</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <ToggleRow
            label="Email Notifications"
            description="Receive transaction summaries and updates via email"
            checked={emailNotif}
            onChange={setEmailNotif}
          />
          <Separator className="opacity-50" />
          <ToggleRow
            label="SMS Notifications"
            description="Get SMS alerts for important account activities"
            checked={smsNotif}
            onChange={setSmsNotif}
          />
          <Separator className="opacity-50" />
          <ToggleRow
            label="Push Notifications"
            description="Receive push notifications on your devices"
            checked={pushNotif}
            onChange={setPushNotif}
          />
          <Separator className="opacity-50" />
          <ToggleRow
            label="Transaction Alerts"
            description="Instant alerts for every transaction on your account"
            checked={txnAlerts}
            onChange={setTxnAlerts}
          />
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
              <Shield className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-lg font-semibold">Security Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <ToggleRow
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            checked={twoFactor}
            onChange={setTwoFactor}
          />
          <Separator className="opacity-50" />
          <ToggleRow
            label="Login Notifications"
            description="Get notified when your account is accessed from a new device"
            checked={loginNotif}
            onChange={setLoginNotif}
          />
          <Separator className="opacity-50" />

          {/* Active Sessions */}
          <div className="pt-4">
            <h3 className="text-sm font-medium text-foreground">
              Active Sessions
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Devices where you are currently logged in
            </p>

            <div className="space-y-3">
              {sessions.map((session) => {
                const Icon = session.icon;
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {session.browser} on {session.device}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          <span>{session.location}</span>
                          <span>-</span>
                          <span>{session.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    {session.current ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        Current
                      </span>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="rounded-xl text-destructive hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" />
                        Revoke
                      </Button>
                    )}
                  </div>
                );
              })}

              {sessions.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No active sessions
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/10">
              <Sun className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-lg font-semibold">Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Choose how the application looks to you
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => applyTheme("light")}
              className="min-w-25 rounded-xl"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => applyTheme("dark")}
              className="min-w-25 rounded-xl"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => applyTheme("system")}
              className="min-w-25 rounded-xl"
            >
              <Laptop className="h-4 w-4" />
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end pb-6">
        <Button onClick={handleSave} size="lg" className="rounded-xl">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
