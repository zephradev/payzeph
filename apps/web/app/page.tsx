import Link from "next/link";
import {
  Phone,
  Wifi,
  Zap,
  Tv,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    title: "Airtime Top-up",
    description: "Instant airtime for MTN, Airtel, Glo & 9mobile",
    icon: Phone,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    cardBg: "bg-blue-50 dark:bg-blue-500/5",
  },
  {
    title: "Data Bundles",
    description: "Best data plans at unbeatable prices",
    icon: Wifi,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    cardBg: "bg-emerald-50 dark:bg-emerald-500/5",
  },
  {
    title: "Electricity",
    description: "Pay all DisCos — IKEDC, EKEDC, AEDC & more",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    cardBg: "bg-amber-50 dark:bg-amber-500/5",
  },
  {
    title: "Cable TV",
    description: "DStv, GOtv & Startimes subscriptions",
    icon: Tv,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    cardBg: "bg-purple-50 dark:bg-purple-500/5",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Account",
    description: "Sign up in under 60 seconds with your email and phone number",
  },
  {
    step: "02",
    title: "Fund Wallet",
    description: "Add money via card payment or bank transfer instantly",
  },
  {
    step: "03",
    title: "Pay Bills",
    description: "Select a service, enter details, and pay — it's that simple",
  },
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "2M+", label: "Transactions" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const trustPoints = [
  { icon: Shield, title: "Bank-grade Security", description: "256-bit SSL encryption on every transaction" },
  { icon: Clock, title: "Instant Delivery", description: "Bills processed in under 5 seconds" },
  { icon: CreditCard, title: "Multiple Payment Options", description: "Pay with cards, bank transfer, or wallet" },
  { icon: TrendingUp, title: "Cashback Rewards", description: "Earn cashback on every bill payment" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary-foreground" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">PayZeph</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
            <a href="#trust" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Why PayZeph</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="hidden rounded-xl px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
            >
              Get Started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Background decorations */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-[300px] -top-[200px] h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-[200px] top-[100px] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/3 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8 lg:pt-32">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Text content */}
            <div className="animate-fade-in-up max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
                #1 Bill Payment Platform in Nigeria
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Pay your bills,
                <br />
                <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
                  the smart way.
                </span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Buy airtime, data bundles, pay electricity and cable TV bills
                instantly. Fast, secure, and reliable payments for every Nigerian.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                >
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-8 py-3.5 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md"
                >
                  Sign In
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-primary/60 to-emerald-500/60 text-[10px] font-bold text-white"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="h-4 w-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Trusted by 50,000+ Nigerians</p>
                </div>
              </div>
            </div>

            {/* Right: Floating UI Cards (like Samurai inspiration) */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-md">
                {/* Main phone mockup card */}
                <div className="animate-fade-in rounded-3xl border border-border/50 bg-card p-6 shadow-2xl">
                  {/* Mini app header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                          <path d="M2 17l10 5 10-5" />
                          <path d="M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <span className="text-sm font-bold">PayZeph</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Balance card */}
                  <div className="mb-6 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 p-5 text-white">
                    <p className="text-xs font-medium opacity-80">Wallet Balance</p>
                    <p className="mt-1 text-2xl font-bold tracking-tight">&#8358;45,750.00</p>
                    <div className="mt-4 flex gap-3">
                      <button className="rounded-lg bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                        Fund Wallet
                      </button>
                      <button className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                        Transfer
                      </button>
                    </div>
                  </div>

                  {/* Quick actions mini */}
                  <div className="mb-5 grid grid-cols-4 gap-3">
                    {[
                      { icon: Phone, label: "Airtime", color: "bg-blue-500/10 text-blue-500" },
                      { icon: Wifi, label: "Data", color: "bg-emerald-500/10 text-emerald-500" },
                      { icon: Zap, label: "Electric", color: "bg-amber-500/10 text-amber-500" },
                      { icon: Tv, label: "Cable", color: "bg-purple-500/10 text-purple-500" },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-1.5">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recent transaction */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</p>
                    {[
                      { desc: "MTN Airtime", amount: "-&#8358;1,000", time: "2 min ago", status: "success" },
                      { desc: "IKEDC Electricity", amount: "-&#8358;10,000", time: "1 hr ago", status: "success" },
                    ].map((txn) => (
                      <div key={txn.desc} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">{txn.desc}</p>
                            <p className="text-[10px] text-muted-foreground">{txn.time}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold" dangerouslySetInnerHTML={{ __html: txn.amount }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating accent cards (Samurai-style) */}
                <div className="animate-float absolute -left-16 top-8 rounded-2xl border border-border/50 bg-card p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Payment Successful</p>
                      <p className="text-[10px] text-muted-foreground">DStv Compact - &#8358;10,500</p>
                    </div>
                  </div>
                </div>

                <div className="animate-float-delayed absolute -right-12 bottom-32 rounded-2xl border border-primary/20 bg-primary/5 p-4 shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-primary">Secure & Encrypted</p>
                      <p className="text-[10px] text-muted-foreground">Bank-grade SSL</p>
                    </div>
                  </div>
                </div>

                <div className="animate-float-slow absolute -right-8 top-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 p-3 shadow-md border border-amber-200/50 dark:border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">+2% Cashback</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Services</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              All your bills, one platform
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From airtime to electricity, handle all your utility payments in seconds
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group relative rounded-2xl border border-border/50 ${feature.cardBg} p-6 transition-all hover:border-border hover:shadow-lg`}
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Get Started <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-y border-border/50 bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Process</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-10 hidden h-0.5 w-full border-t-2 border-dashed border-border md:block" />
                )}
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                  <span className="text-2xl font-extrabold text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PayZeph / Trust Section */}
      <section id="trust" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Why PayZeph</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Built for trust, designed for speed
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point.title} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <point.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground">{point.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-emerald-600 px-8 py-16 text-center shadow-2xl sm:px-16">
            {/* Decorative */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-60 w-60 rounded-full bg-white/5" />

            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to pay bills the smart way?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/80">
                Join 50,000+ Nigerians who trust PayZeph for fast, secure bill payments.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
                >
                  Get Started — It&apos;s Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary-foreground" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5Z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-bold text-foreground">PayZeph</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built by Zephra Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
