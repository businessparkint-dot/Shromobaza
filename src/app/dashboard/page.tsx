"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Newspaper,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  UsersRound,
  WalletCards,
} from "lucide-react";

const CURRENT_USER_KEY = "shromobazar_current_user";

type UserType = "worker" | "employer" | "customer";

type CurrentUser = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  userType?: UserType;
};

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (!savedUser) return;

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    window.location.href = "/";
  };

  const userName = user?.name || "শ্রমবাজার ব্যবহারকারী";

  const userTypeLabel =
    user?.userType === "worker"
      ? "কর্মী"
      : user?.userType === "employer"
        ? "Shopkeeper / Employer"
        : user?.userType === "customer"
          ? "সাধারণ ব্যবহারকারী"
          : "Guest User";

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">

        <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between">

            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[3px_3px_0px_#f97316]">
                <span className="text-xl font-black italic">
                  S
                </span>
              </div>

              <div>
                <div className="text-lg font-black">
                  Shromobazar
                </div>

                <div className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Global Workforce Platform
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">

              <Link
                href="/"
                className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white sm:block"
              >
                Home
              </Link>

              {mounted && user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/10 px-3.5 py-2.5 text-sm font-bold text-red-300 transition hover:bg-red-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              )}

            </div>

          </div>

          {/* PROFILE HERO */}
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl shadow-orange-500/20">
                <CircleUserRound className="h-8 w-8" />
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <h1 className="text-2xl font-black sm:text-3xl">
                    {mounted ? userName : "স্বাগতম"}
                  </h1>

                  {mounted && user && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </span>
                  )}

                </div>

                <p className="mt-1 text-sm text-slate-400">
                  {mounted ? userTypeLabel : "Global Workforce Platform"}
                </p>

                {mounted && user?.phone && (
                  <p className="mt-1 text-xs text-slate-500">
                    {user.phone}
                  </p>
                )}

              </div>

            </div>

            {!user && (
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

          </div>

        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* OVERVIEW */}
        <section>

          <div className="flex items-end justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                Overview
              </p>

              <h2 className="mt-1 text-2xl font-black">
                আপনার কর্মক্ষেত্র
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                শ্রমবাজারের গুরুত্বপূর্ণ কার্যক্রম এক জায়গায়।
              </p>
            </div>

            <LayoutDashboard className="hidden h-6 w-6 text-slate-700 sm:block" />

          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <OverviewCard
              title="Activity"
              value="—"
              description="Recent activity"
              icon={<Bell />}
              tone="orange"
            />

            <OverviewCard
              title="Jobs"
              value="—"
              description="Applications & jobs"
              icon={<BriefcaseBusiness />}
              tone="blue"
            />

            <OverviewCard
              title="Business"
              value="—"
              description="Business activity"
              icon={<Building2 />}
              tone="emerald"
            />

            <OverviewCard
              title="Earnings"
              value="৳ —"
              description="Available balance"
              icon={<WalletCards />}
              tone="purple"
            />

          </div>

        </section>

        {/* WORK */}
        <DashboardSection
          label="Work & Workforce"
          title="কাজ ও কর্মী"
          color="blue"
        >

          <DashboardLink
            href="/jobs"
            icon={<Search />}
            title="কাজ খুঁজুন"
            description="আপনার জন্য উপযুক্ত কাজ ও সুযোগ খুঁজুন।"
            tone="blue"
          />

          <DashboardLink
            href="/workers"
            icon={<UsersRound />}
            title="কর্মী খুঁজুন"
            description="দক্ষ কর্মী ও service provider খুঁজে নিন।"
            tone="orange"
          />

          <DashboardLink
            href="/worker-dashboard"
            icon={<BriefcaseBusiness />}
            title="My Work"
            description="আপনার কাজ, আবেদন ও hire activity পরিচালনা করুন।"
            tone="emerald"
          />

          <DashboardLink
            href="/worker-applications"
            icon={<FileText />}
            title="Applications"
            description="আপনার job applications-এর status দেখুন।"
            tone="purple"
          />

          <DashboardLink
            href="/worker-hire-requests"
            icon={<UsersRound />}
            title="Hire Requests"
            description="Hire request দেখুন ও পরিচালনা করুন।"
            tone="rose"
          />

          <DashboardLink
            href="/my-jobs"
            icon={<BriefcaseBusiness />}
            title="My Jobs"
            description="গৃহীত ও চলমান কাজ পরিচালনা করুন।"
            tone="cyan"
          />

        </DashboardSection>

        {/* BUSINESS */}
        <DashboardSection
          label="Business & Marketplace"
          title="ব্যবসা ও মার্কেটপ্লেস"
          color="emerald"
        >

          <DashboardLink
            href="/"
            icon={<ShoppingBag />}
            title="Marketplace"
            description="পণ্য ও সেবা আবিষ্কার করুন।"
            tone="emerald"
          />

          <DashboardLink
            href="/"
            icon={<Store />}
            title="My Shop / Business"
            description="আপনার Shop বা Business profile পরিচালনা করুন।"
            tone="orange"
          />

          <DashboardLink
            href="/"
            icon={<Plus />}
            title="Sell Products & Services"
            description="পণ্য, service বা skill marketplace-এ প্রকাশ করুন।"
            tone="blue"
          />

          <DashboardLink
            href="/"
            icon={<Search />}
            title="আমি কিনতে চাই"
            description="আপনার প্রয়োজন প্রকাশ করে বিক্রেতা খুঁজুন।"
            tone="purple"
          />

          <DashboardLink
            href="/"
            icon={<Building2 />}
            title="Business Opportunities"
            description="ভবিষ্যতের business ও professional opportunities।"
            tone="cyan"
          />

          <DashboardLink
            href="/"
            icon={<WalletCards />}
            title="Subscriptions"
            description="Premium business tools ও subscriptions।"
            tone="rose"
          />

        </DashboardSection>

        {/* COMMUNITY */}
        <DashboardSection
          label="Community"
          title="Community & Communication"
          color="purple"
        >

          <DashboardLink
            href="/"
            icon={<Newspaper />}
            title="News Feed"
            description="কাজ, জীবন ও community-এর আপডেট দেখুন।"
            tone="purple"
          />

          <DashboardLink
            href="/"
            icon={<MessageCircle />}
            title="Messages"
            description="Worker, employer ও customer-এর সাথে chat করুন।"
            tone="blue"
          />

          <DashboardLink
            href="/"
            icon={<Bell />}
            title="Notifications"
            description="গুরুত্বপূর্ণ activity ও updates দেখুন।"
            tone="orange"
          />

          <DashboardLink
            href="/"
            icon={<Heart />}
            title="Saved"
            description="পছন্দের worker, job ও marketplace items।"
            tone="rose"
          />

        </DashboardSection>

        {/* ACCOUNT */}
        <DashboardSection
          label="Account"
          title="Account & Security"
          color="slate"
        >

          {/* IMPORTANT: PROFILE NOW CONNECTED */}
          <DashboardLink
            href="/profile"
            icon={<CircleUserRound />}
            title="My Profile"
            description="পরিচয়, দক্ষতা, পেশা ও location পরিচালনা করুন।"
            tone="blue"
          />

          <DashboardLink
            href="/settings"
            icon={<Settings />}
            title="Settings"
            description="Account ও platform preferences পরিচালনা করুন।"
            tone="slate"
          />

          <DashboardLink
            href="/settings"
            icon={<ShieldCheck />}
            title="Security & Verification"
            description="Account security ও verification settings।"
            tone="emerald"
          />

          <DashboardLink
            href="/"
            icon={<MessageCircle />}
            title="Help & Support"
            description="সহায়তা, অভিযোগ ও support center।"
            tone="orange"
          />

        </DashboardSection>

        {/* SECURITY */}
        <section className="mt-10 rounded-3xl border border-emerald-400/10 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold">
                  Trusted Workforce Account
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  ভবিষ্যতে NID verification, verified profile,
                  secure communication এবং trusted workforce
                  ecosystem এই account-এর সাথে যুক্ত হবে।
                </p>
              </div>

            </div>

            {mounted && user && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}

          </div>

        </section>

        <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
          শ্রমবাজার — Global Workforce Platform
        </footer>

      </div>
    </main>
  );
}

/* ============================================================
   OVERVIEW CARD
============================================================ */

function OverviewCard({
  title,
  value,
  description,
  icon,
  tone,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  tone: "orange" | "blue" | "emerald" | "purple";
}) {
  const colors = {
    orange: "text-orange-400",
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">

      <div className="flex items-center justify-between">

        <span className="text-xs font-bold text-slate-500">
          {title}
        </span>

        <span className={colors[tone]}>
          <span className="[&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        </span>

      </div>

      <div className="mt-4 text-2xl font-black">
        {value}
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}

/* ============================================================
   SECTION
============================================================ */

function DashboardSection({
  label,
  title,
  color,
  children,
}: {
  label: string;
  title: string;
  color: "blue" | "emerald" | "purple" | "slate";
  children: React.ReactNode;
}) {
  const colors = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    slate: "text-slate-500",
  };

  return (
    <section className="mt-10">

      <div className="mb-5">

        <p
          className={`text-xs font-bold uppercase tracking-[0.18em] ${colors[color]}`}
        >
          {label}
        </p>

        <h2 className="mt-1 text-xl font-black">
          {title}
        </h2>

      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>

    </section>
  );
}

/* ============================================================
   DASHBOARD LINK
============================================================ */

function DashboardLink({
  href,
  icon,
  title,
  description,
  tone,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tone:
    | "blue"
    | "orange"
    | "emerald"
    | "purple"
    | "rose"
    | "cyan"
    | "slate";
}) {
  const toneClasses = {
    blue: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/15",
    orange: "bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/15",
    emerald: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/15",
    purple: "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/15",
    rose: "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/15",
    cyan: "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/15",
    slate: "bg-slate-500/10 text-slate-300 group-hover:bg-slate-500/15",
  };

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07]"
    >

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ${toneClasses[tone]}`}
      >
        <span className="[&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
      </div>

      <div className="min-w-0 flex-1">

        <h3 className="truncate text-sm font-bold text-white">
          {title}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-slate-400" />

    </Link>
  );
}