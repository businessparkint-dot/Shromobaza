"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Globe2,
  KeyRound,
  LogOut,
  Mail,
  Moon,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";

const CURRENT_USER_KEY = "shromobazar_current_user";

type CurrentUser = {
  name?: string;
  phone?: string;
  email?: string;
  userType?: string;
};

export default function SettingsPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("বাংলা");

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-4 sm:px-6">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-[3px_3px_0px_#f97316]">
              <span className="font-black italic">S</span>
            </div>

            <span className="hidden text-sm font-black sm:block">
              Shromobazar
            </span>
          </div>

        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* TITLE */}
        <div className="mb-8">

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
            Account Center
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            আপনার account, privacy, security এবং platform preferences
            এখান থেকে পরিচালনা করুন।
          </p>

        </div>

        {/* PROFILE SUMMARY */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950 to-slate-900 p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500">
              <UserRound className="h-8 w-8" />
            </div>

            <div className="flex-1">

              <h2 className="text-xl font-black">
                {user?.name || "শ্রমবাজার ব্যবহারকারী"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {user?.phone || "Mobile number"}
              </p>

              {user?.email && (
                <p className="mt-1 text-xs text-slate-500">
                  {user.email}
                </p>
              )}

            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Profile
              <ChevronRight className="h-4 w-4" />
            </Link>

          </div>
        </section>

        {/* ACCOUNT */}
        <SettingsSection title="Account">

          <SettingsRow
            icon={<UserRound />}
            title="Profile"
            description="নাম, পেশা, দক্ষতা ও location পরিবর্তন করুন।"
            href="/"
          />

          <SettingsRow
            icon={<Mail />}
            title="Email"
            description={
              user?.email
                ? user.email
                : "Optional email এখনো যোগ করা হয়নি।"
            }
            href="/"
          />

          <SettingsRow
            icon={<Smartphone />}
            title="Mobile Number"
            description={user?.phone || "Mobile number"}
            href="/"
          />

        </SettingsSection>

        {/* SECURITY */}
        <SettingsSection title="Security & Verification">

          <SettingsRow
            icon={<ShieldCheck />}
            title="Verification"
            description="ভবিষ্যতে NID ও identity verification এখান থেকে পরিচালিত হবে।"
            href="/"
            badge="Coming Soon"
          />

          <SettingsRow
            icon={<KeyRound />}
            title="Password & Login"
            description="Password এবং login security পরিচালনা করুন।"
            href="/login"
          />

        </SettingsSection>

        {/* PREFERENCES */}
        <SettingsSection title="Preferences">

          <div className="flex items-center gap-4 border-b border-white/10 px-1 py-5">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Bell className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold">
                Notifications
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Job, application, hire request ও account updates।
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                notifications ? "bg-orange-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  notifications ? "left-6" : "left-1"
                }`}
              />
            </button>

          </div>

          <div className="flex items-center gap-4 border-b border-white/10 px-1 py-5">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Globe2 className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold">
                Language
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Platform language
              </p>
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none"
            >
              <option>বাংলা</option>
              <option>English</option>
            </select>

          </div>

          <div className="flex items-center gap-4 px-1 py-5">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-500/10 text-slate-300">
              <Moon className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold">
                Appearance
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Dark interface এখন সক্রিয়।
              </p>
            </div>

            <span className="rounded-lg bg-white/5 px-3 py-2 text-xs font-bold text-slate-400">
              Dark
            </span>

          </div>

        </SettingsSection>

        {/* FUTURE SECURITY */}
        <section className="mt-8 rounded-3xl border border-emerald-400/10 bg-emerald-500/5 p-6">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold">
                Trusted Workforce Account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                শ্রমবাজার ভবিষ্যতে identity verification, NID,
                trusted profile, secure communication এবং verified
                workforce system যুক্ত করবে।
              </p>
            </div>

          </div>

        </section>

        {/* LOGOUT */}
        <section className="mt-8 rounded-3xl border border-red-500/10 bg-red-500/5 p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="font-bold text-red-300">
                Account Session
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                এই device থেকে আপনার শ্রমবাজার account থেকে বের হয়ে যাবেন।
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>

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
   SECTION
============================================================ */

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">

      <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </h2>

      <div className="rounded-3xl border border-white/10 bg-white/[0.035] px-5">
        {children}
      </div>

    </section>
  );
}

/* ============================================================
   SETTINGS ROW
============================================================ */

function SettingsRow({
  icon,
  title,
  description,
  href,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 border-b border-white/10 px-1 py-5 last:border-b-0"
    >

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        <span className="[&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-center gap-2">

          <h3 className="text-sm font-bold text-white">
            {title}
          </h3>

          {badge && (
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-bold text-slate-500">
              {badge}
            </span>
          )}

        </div>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-700 transition group-hover:translate-x-1 group-hover:text-slate-400" />

    </Link>
  );
}