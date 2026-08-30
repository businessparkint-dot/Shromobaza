"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  BriefcaseBusiness,
  FileText,
  Store,
  ShoppingCart,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  CreditCard,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Database,
} from "lucide-react";

type Statistics = {
  workers: number;
  employers: number;
  jobs: number;
  applications: number;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  database?: {
    connected: boolean;
    provider: string;
  };
  statistics?: Statistics;
  modules?: {
    workers: boolean;
    employers: boolean;
    jobs: boolean;
    applications: boolean;
    marketplace: boolean;
    buyRequests: boolean;
    statusFeed: boolean;
    helpAdvice: boolean;
    chat: boolean;
    complaints: boolean;
    subscriptions: boolean;
  };
  error?: string;
};

type DashboardCardProps = {
  title: string;
  value?: number;
  description: string;
  icon: React.ReactNode;
  href?: string;
  disabled?: boolean;
};

export default function CentralAdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics>({
    workers: 0,
    employers: 0,
    jobs: 0,
    applications: 0,
  });

  const [databaseConnected, setDatabaseConnected] = useState(false);
  const [provider, setProvider] = useState("Supabase");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboard(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/central-admin", {
        cache: "no-store",
      });

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Central Admin data could not be loaded."
        );
      }

      setStatistics(
        data.statistics || {
          workers: 0,
          employers: 0,
          jobs: 0,
          applications: 0,
        }
      );

      setDatabaseConnected(
        data.database?.connected ?? false
      );

      setProvider(data.database?.provider || "Supabase");
    } catch (err) {
      console.error("Central Admin loading error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Central Admin data could not be loaded."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalRecords =
    statistics.workers +
    statistics.employers +
    statistics.jobs +
    statistics.applications;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg">
                  <ShieldCheck size={24} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Central Admin
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    Shromobazar platform administration
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadDashboard(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh Dashboard"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
        {/* Database Status */}
        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  databaseConnected
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-red-400/10 text-red-300"
                }`}
              >
                <Database size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Central Database
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Provider: {provider}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  databaseConnected
                    ? "bg-emerald-400"
                    : "bg-red-400"
                }`}
              />

              <span
                className={`text-sm font-medium ${
                  databaseConnected
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {databaseConnected
                  ? "Connected"
                  : "Disconnected"}
              </span>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <section className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
            <p className="text-sm font-medium text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadDashboard()}
              className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/20"
            >
              Try Again
            </button>
          </section>
        )}

        {/* Main Statistics */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Platform Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Real-time statistics from the central database.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DashboardCard
              title="Workers"
              value={statistics.workers}
              description="Registered workforce"
              icon={<Users size={22} />}
              href="/central-admin/workers"
            />

            <DashboardCard
              title="Employers"
              value={statistics.employers}
              description="Registered employers"
              icon={<Building2 size={22} />}
              href="/employer"
            />

            <DashboardCard
              title="Jobs"
              value={statistics.jobs}
              description="Published job posts"
              icon={<BriefcaseBusiness size={22} />}
              href="/jobs"
            />

            <DashboardCard
              title="Applications"
              value={statistics.applications}
              description="Worker applications"
              icon={<FileText size={22} />}
              href="/worker/applications"
            />
          </div>
        </section>

        {/* System Summary */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              System Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current records across the core platform.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">
                Total Core Records
              </p>

              <p className="mt-2 text-3xl font-bold">
                {loading ? "—" : totalRecords}
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Workers + Employers + Jobs + Applications
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm text-slate-400">
                Platform Status
              </p>

              <p className="mt-2 text-3xl font-bold">
                {databaseConnected
                  ? "Online"
                  : "Offline"}
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Central administration system
              </p>
            </div>
          </div>
        </section>

        {/* Management Modules */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Management Modules
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the different areas of Shromobazar.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ModuleCard
              title="Workers Management"
              description="View, search and manage workers."
              icon={<Users size={21} />}
              href="/central-admin/workers"
            />

            <ModuleCard
              title="Employers"
              description="Manage employer accounts and profiles."
              icon={<Building2 size={21} />}
              href="/employer"
            />

            <ModuleCard
              title="Jobs"
              description="Monitor published jobs and hiring."
              icon={<BriefcaseBusiness size={21} />}
              href="/jobs"
            />

            <ModuleCard
              title="Applications"
              description="Monitor worker job applications."
              icon={<FileText size={21} />}
              href="/worker/applications"
            />

            <ModuleCard
              title="Marketplace"
              description="Manage products and marketplace activity."
              icon={<Store size={21} />}
              href="/marketplace"
            />

            <ModuleCard
              title="Buy Requests"
              description="Monitor customer purchase requests."
              icon={<ShoppingCart size={21} />}
              href="/marketplace"
            />

            <ModuleCard
              title="Chat"
              description="Platform communication and messages."
              icon={<MessageSquare size={21} />}
              href="/chat"
            />

            <ModuleCard
              title="Help & Advice"
              description="Support and platform guidance."
              icon={<HelpCircle size={21} />}
              href="/help-advice"
            />

            <ModuleCard
              title="Complaints"
              description="Review complaints and support cases."
              icon={<AlertTriangle size={21} />}
              href="/complaints"
            />

            <ModuleCard
              title="Subscriptions"
              description="Manage subscription services."
              icon={<CreditCard size={21} />}
              href="/subscriptions"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Quick Actions
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/central-admin/workers"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Users size={20} />
                </div>

                <div>
                  <p className="font-semibold">
                    Open Workers Management
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    View all registered workers
                  </p>
                </div>
              </div>

              <ArrowRight
                size={19}
                className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-white"
              />
            </Link>

            <Link
              href="/jobs"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <BriefcaseBusiness size={20} />
                </div>

                <div>
                  <p className="font-semibold">
                    Open Jobs
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Review current job posts
                  </p>
                </div>
              </div>

              <ArrowRight
                size={19}
                className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-white"
              />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-slate-600">
            Shromobazar Central Administration
          </p>
        </footer>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon,
  href,
}: DashboardCardProps) {
  return (
    <Link
      href={href || "#"}
      className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-slate-300">
          {icon}
        </div>

        <ArrowRight
          size={17}
          className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-white"
        />
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {value ?? 0}
      </p>

      <p className="mt-2 text-xs text-slate-600">
        {description}
      </p>
    </Link>
  );
}

function ModuleCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-slate-300">
          {icon}
        </div>

        <ArrowRight
          size={17}
          className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-white"
        />
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}