"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleUserRound,
  Heart,
  LogOut,
  Mail,
  MessageCircle,
  Settings,
  ShoppingBag,
  UserRound,
  Wallet,
} from "lucide-react";

import { supabase } from "@/lib/client";

type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

export default function MyAccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw new Error(authError.message);
      }

      if (!user) {
        setError("আপনি এখনো লগইন করেননি।");
        setLoading(false);
        return;
      }

      setEmail(user.email ?? "");

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(profileError.message);
      }

      setProfile(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Account information load করা যায়নি।",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    const { error: logoutError } = await supabase.auth.signOut();

    if (logoutError) {
      setError(logoutError.message);
      setLoggingOut(false);
      return;
    }

    window.location.href = "/login";
  }

  const displayName =
    profile?.name?.trim() ||
    (email ? email.split("@")[0] : "Shromobazar Member");

  const initial = displayName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fa] text-[#07152d]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">
            <Link
              href="/status-feed"
              className="flex items-center gap-2 text-xs font-black text-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Social Hub
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-36 rounded-[1.75rem] bg-white" />
            <div className="h-32 rounded-[1.5rem] bg-white" />
            <div className="h-64 rounded-[1.5rem] bg-white" />
          </div>
        </section>
      </main>
    );
  }

  if (error && !profile) {
    return (
      <main className="min-h-screen bg-[#f5f7fa] text-[#07152d]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">
            <Link
              href="/status-feed"
              className="flex items-center gap-2 text-xs font-black text-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Social Hub
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
            <CircleUserRound className="mx-auto h-12 w-12 text-slate-300" />

            <h1 className="mt-4 text-lg font-black">
              Account unavailable
            </h1>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              {error}
            </p>

            <div className="mt-5 flex justify-center gap-2">
              <Link
                href="/login"
                className="rounded-xl bg-[#07152d] px-5 py-3 text-xs font-black text-white"
              >
                Login
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-black text-slate-600"
              >
                Home
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa] pb-16 text-[#07152d]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/status-feed"
            className="flex items-center gap-2 text-xs font-black text-slate-600 hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Social Hub</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/status-feed"
              className="hidden rounded-xl px-3 py-2 text-[10px] font-black text-slate-500 hover:bg-slate-50 sm:block"
            >
              Home Feed
            </Link>

            <Link
              href="/settings"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-500"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Profile Hero */}
        <div className="overflow-hidden rounded-[1.75rem] bg-[#07152d] shadow-lg">
          <div className="relative h-24 bg-gradient-to-r from-[#07152d] via-[#10284a] to-orange-500/80 sm:h-32">
            <div className="absolute inset-0 bg-white/5" />
          </div>

          <div className="relative px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#07152d] bg-white text-2xl font-black text-[#07152d] shadow-lg sm:h-28 sm:w-28">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>

                <div className="pb-1 text-white">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-300">
                    Shromobazar Identity
                  </p>

                  <h1 className="mt-1 text-xl font-black sm:text-2xl">
                    {displayName}
                  </h1>

                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-300">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="break-all">{email || "Email unavailable"}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/status-feed/create"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-orange-500 px-5 text-xs font-black text-white hover:bg-orange-600"
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>

        {/* Identity Notice */}
        <div className="mt-5 rounded-[1.5rem] border border-orange-100 bg-orange-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xs font-black text-slate-800">
                One Account • One Identity
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-slate-600 sm:text-xs">
                আপনার Shromobazar account-ই আপনার মূল identity। একই account
                দিয়ে Social Hub, Jobs, Marketplace, Chat, Wallet এবং
                Business/Shop/Office ব্যবহার করা যাবে।
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <section className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black">Account Information</h2>
              <p className="mt-1 text-[10px] text-slate-400">
                Your central Shromobazar identity
              </p>
            </div>

            <CircleUserRound className="h-5 w-5 text-orange-500" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={UserRound}
              label="Name"
              value={displayName}
            />

            <InfoCard
              icon={Mail}
              label="Email"
              value={email || "Not available"}
            />
          </div>
        </section>

        {/* Ecosystem */}
        <section className="mt-5">
          <div className="mb-3">
            <h2 className="text-sm font-black">My Shromobazar</h2>
            <p className="mt-1 text-[10px] text-slate-400">
              সব service একই account-এর সঙ্গে connected
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AccountLink
              href="/status-feed"
              icon={Heart}
              title="Social Hub"
              subtitle="Posts, Reels & Community"
            />

            <AccountLink
              href="/jobs"
              icon={BriefcaseBusiness}
              title="Jobs"
              subtitle="Find work & manage jobs"
            />

            <AccountLink
              href="/marketplace"
              icon={ShoppingBag}
              title="Marketplace"
              subtitle="Buy & Sell"
            />

            <AccountLink
              href="/chat"
              icon={MessageCircle}
              title="Chat"
              subtitle="Messages & conversations"
            />

            <AccountLink
              href="/wallet"
              icon={Wallet}
              title="Wallet"
              subtitle="Balance & transactions"
            />

            <AccountLink
              href="/global-business"
              icon={Building2}
              title="Business"
              subtitle="Shop, Office & Business"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-sm font-black">Account Actions</h2>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link
              href="/status-feed/create"
              className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:border-orange-100 hover:bg-orange-50"
            >
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-xs font-black">Create Post</p>
                  <p className="mt-0.5 text-[9px] text-slate-400">
                    Share with the community
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-300" />
            </Link>

            <Link
              href="/notifications"
              className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:border-orange-100 hover:bg-orange-50"
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs font-black">Notifications</p>
                  <p className="mt-0.5 text-[9px] text-slate-400">
                    Check your activity
                  </p>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-300" />
            </Link>
          </div>
        </section>

        {/* Logout */}
        <section className="mt-5">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] border border-red-100 bg-white px-5 py-4 text-xs font-black text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>

          {error && profile && (
            <p className="mt-3 text-center text-[10px] font-medium text-red-500">
              {error}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-orange-500" />

        <span className="text-[9px] font-black uppercase tracking-wide text-slate-400">
          {label}
        </span>
      </div>

      <p className="mt-2 break-all text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function AccountLink({
  href,
  icon: Icon,
  title,
  subtitle,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[#07152d] transition group-hover:bg-orange-500 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-black text-slate-800">{title}</p>
          <p className="mt-1 truncate text-[9px] text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-orange-500" />
    </Link>
  );
}