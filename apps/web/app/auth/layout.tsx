"use client";

import Link from "next/link";
import { Shield, Zap, Users } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branded panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] lg:flex-col lg:justify-between bg-gradient-to-br from-[hsl(220,25%,7%)] via-[hsl(220,20%,10%)] to-[hsl(162,30%,12%)] relative overflow-hidden p-10">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-emerald-500/8 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Top — Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/10">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-primary" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">PayZeph</span>
          </Link>
        </div>

        {/* Center — Value prop */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-tight xl:text-4xl">
              Pay your bills,
              <br />
              <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                the smart way.
              </span>
            </h2>
            <p className="mt-4 max-w-sm text-base text-white/50 leading-relaxed">
              Fast, secure, and reliable bill payments for airtime, data, electricity, cable TV, and more.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { icon: Shield, text: "Bank-grade security on every transaction" },
              { icon: Zap, text: "Bills processed in under 5 seconds" },
              { icon: Users, text: "Trusted by 50,000+ Nigerians" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-white/60">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative z-10 text-xs text-white/30">
          Built by Zephra Studio
        </p>
      </div>

      {/* Right side — scrollable form area */}
      <div className="flex w-full flex-col lg:w-[55%] xl:w-[50%]">
        {/* Mobile logo */}
        <div className="flex items-center justify-center pt-8 pb-2 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary-foreground" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">PayZeph</span>
          </Link>
        </div>

        {/* Centered form container */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 py-8 sm:px-8">
          <div className="w-full max-w-[440px] animate-fade-in-up">{children}</div>
        </div>
      </div>
    </div>
  );
}
