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
  Tv,
} from "lucide-react";

type DashboardData = {
  success?: boolean;
  database?: {
    connected?: boolean;
  };
  counts?: {
    workers?: number;
    employers?: number;
    jobs?: number;
    applications?: number;
    marketplace?: number;
    buyRequests?: number;
    statusFeed?: number;
    helpAdvice?: number;
    chat?: number;
    complaints?: number;
    subscriptions?: number;
  };
  modules?: Record<string, unknown>;
  error?: string;
};

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-white/60">{title}</div>
        <div className="rounded-xl bg-white/10 p-2.5 text-white">
          {icon}
        </div>
      </div>

      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
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
      className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="rounded-xl bg-white/10 p-3 text-white">
          {icon}
        </div>

        <ArrowRight
          size={18}
          className="text-white/35 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white"
        />
      </div>

      <h3 className="text-base font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-white/55">
        {description}
      </p>
    </Link>
  );
}

export default function CentralAdminPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/central-admin", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.error || "Failed to load central admin data."
        );
      }

      setData(result);
    } catch (err) {
      console.error("Central Admin Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const counts = data?.counts || {};

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#07111f]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2.5">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Central Admin
                </h1>

                <p className="mt-0.5 text-xs text-white/50">
                  Shromobazar Management System
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-7 lg:px-8">
        {/* Database status */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-xl p-2.5 ${
                data?.database?.connected
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              <Database size={20} />
            </div>

            <div>
              <div className="text-sm font-semibold text-white">
                Database Status
              </div>

              <div className="mt-1 text-xs text-white/50">
                {loading
                  ? "Checking connection..."
                  : data?.database?.connected
                  ? "Supabase database connected"
                  : "Database connection unavailable"}
              </div>
            </div>
          </div>

          <div
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              data?.database?.connected
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {loading
              ? "CHECKING"
              : data?.database?.connected
              ? "CONNECTED"
              : "OFFLINE"}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-7 rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <h2 className="font-semibold text-red-300">
                  Dashboard Error
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-200/75">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Overview */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">Overview</h2>

            <p className="mt-1 text-sm text-white/50">
              Current Shromobazar platform statistics
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Workers"
              value={loading ? "—" : counts.workers ?? 0}
              icon={<Users size={20} />}
            />

            <StatCard
              title="Employers"
              value={loading ? "—" : counts.employers ?? 0}
              icon={<Building2 size={20} />}
            />

            <StatCard
              title="Jobs"
              value={loading ? "—" : counts.jobs ?? 0}
              icon={<BriefcaseBusiness size={20} />}
            />

            <StatCard
              title="Applications"
              value={loading ? "—" : counts.applications ?? 0}
              icon={<FileText size={20} />}
            />
          </div>
        </section>

        {/* Management Modules */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white">
              Management Modules
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Manage the main Shromobazar platform services
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ModuleCard
              title="Workers"
              description="View and manage registered workers, profiles and worker information."
              icon={<Users size={21} />}
              href="/central-admin/workers"
            />

            <ModuleCard
              title="Employers"
              description="Manage employers, companies and hiring accounts."
              icon={<Building2 size={21} />}
              href="/central-admin/employers"
            />

            <ModuleCard
              title="Jobs"
              description="Review and manage job postings and opportunities."
              icon={<BriefcaseBusiness size={21} />}
              href="/central-admin/jobs"
            />

            <ModuleCard
              title="Applications"
              description="Monitor worker applications and hiring activity."
              icon={<FileText size={21} />}
              href="/central-admin/applications"
            />

            <ModuleCard
              title="Marketplace"
              description="Manage marketplace products, sellers and listings."
              icon={<Store size={21} />}
              href="/marketplace"
            />

            <ModuleCard
              title="Buy Requests"
              description="Review customer requests for products and services."
              icon={<ShoppingCart size={21} />}
              href="/buy-requests"
            />

            <ModuleCard
              title="Chat"
              description="Monitor platform communication and messaging."
              icon={<MessageSquare size={21} />}
              href="/chat"
            />

            <ModuleCard
              title="Help & Advice"
              description="Manage help, advice and support content."
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
              description="Manage subscription plans and premium platform services."
              icon={<CreditCard size={21} />}
              href="/subscriptions"
            />

            {/* SHROMO TV */}
            <ModuleCard
              title="SHROMO TV"
              description="Upload, schedule and manage TV images and videos."
              icon={<Tv size={21} />}
              href="/central-admin/shromo-tv"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-white/50">
              Frequently used administration pages
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/central-admin/workers"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <Users size={20} />
                </div>

                <div>
                  <div className="font-semibold">Manage Workers</div>
                  <div className="mt-1 text-xs text-white/45">
                    Worker database
                  </div>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="text-white/35 transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/central-admin/jobs"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <BriefcaseBusiness size={20} />
                </div>

                <div>
                  <div className="font-semibold">Manage Jobs</div>
                  <div className="mt-1 text-xs text-white/45">
                    Job postings
                  </div>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="text-white/35 transition-transform group-hover:translate-x-1"
              />
            </Link>

            {/* SHROMO TV Quick Action */}
            <Link
              href="/central-admin/shromo-tv"
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:bg-white/[0.07]"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <Tv size={20} />
                </div>

                <div>
                  <div className="font-semibold">SHROMO TV</div>
                  <div className="mt-1 text-xs text-white/45">
                    Upload & manage media
                  </div>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="text-white/35 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/10 pt-6 pb-8">
          <div className="flex flex-col justify-between gap-2 text-xs text-white/35 sm:flex-row">
            <span>
              Shromobazar Central Administration
            </span>

            <span>
              Business Park International
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}