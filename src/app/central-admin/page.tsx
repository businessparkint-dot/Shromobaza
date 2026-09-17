"use client";

import { useEffect, useState, type ReactNode } from "react";
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
  CheckCircle2,
  XCircle,
  Sparkles,
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

type SponsorRequest = {
  id: string;
  company_name?: string | null;
  logo_url?: string | null;
  offer_text?: string | null;
  link_url?: string | null;
  published?: boolean | null;
  starts_at?: string | null;
  expires_at?: string | null;
  priority?: number | null;
  created_at?: string | null;
};

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: ReactNode;
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
  icon: ReactNode;
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

  const [sponsorRequests, setSponsorRequests] = useState<
    SponsorRequest[]
  >([]);

  const [sponsorLoading, setSponsorLoading] = useState(true);

  const [sponsorActionId, setSponsorActionId] = useState<string | null>(
    null
  );

  const [sponsorMessage, setSponsorMessage] = useState("");

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

  async function loadSponsorRequests() {
    try {
      setSponsorLoading(true);
      setSponsorMessage("");

      const response = await fetch(
        "/api/central-admin/shromo-sponsors",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.error || "Failed to load sponsor requests."
        );
      }

      const sponsors = Array.isArray(result?.sponsors)
        ? result.sponsors
        : [];

      setSponsorRequests(sponsors);
    } catch (err) {
      console.error("Sponsor Request Error:", err);

      setSponsorMessage(
        err instanceof Error
          ? err.message
          : "Unable to load sponsor requests."
      );
    } finally {
      setSponsorLoading(false);
    }
  }

  async function handleSponsorAction(
    id: string,
    action: "approve" | "reject"
  ) {
    const sponsor = sponsorRequests.find(
      (item) => item.id === id
    );

    if (!sponsor) return;

    const companyName =
      sponsor.company_name?.trim() || "this sponsor";

    if (action === "reject") {
      const confirmed = window.confirm(
        `Reject sponsor request from "${companyName}"?`
      );

      if (!confirmed) return;
    }

    if (action === "approve") {
      const confirmed = window.confirm(
        `Approve sponsor request from "${companyName}" and show it on the public Sponsor Row?`
      );

      if (!confirmed) return;
    }

    try {
      setSponsorActionId(id);
      setSponsorMessage("");

      const response = await fetch(
        "/api/central-admin/shromo-sponsors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            action,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(
          result?.error || "Unable to process sponsor request."
        );
      }

      if (action === "approve") {
        setSponsorMessage(
          `"${companyName}" sponsor request approved successfully.`
        );
      } else {
        setSponsorMessage(
          `"${companyName}" sponsor request rejected.`
        );
      }

      await loadSponsorRequests();
    } catch (err) {
      console.error("Sponsor Action Error:", err);

      setSponsorMessage(
        err instanceof Error
          ? err.message
          : "Unable to process sponsor request."
      );
    } finally {
      setSponsorActionId(null);
    }
  }

  useEffect(() => {
    loadDashboard();
    loadSponsorRequests();
  }, []);

  const counts = data?.counts || {};

  const pendingSponsors = sponsorRequests.filter(
    (item) => !item.published
  );

  const approvedSponsors = sponsorRequests.filter(
    (item) => item.published
  );

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
            onClick={() => {
              loadDashboard();
              loadSponsorRequests();
            }}
            disabled={loading || sponsorLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading || sponsorLoading
                  ? "animate-spin"
                  : ""
              }
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
            <h2 className="text-lg font-bold text-white">
              Overview
            </h2>

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

        {/* SHROMO Sponsor Requests */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles
                  size={19}
                  className="text-amber-300"
                />

                <h2 className="text-lg font-bold text-white">
                  SHROMO Sponsor Requests
                </h2>
              </div>

              <p className="mt-1 text-sm text-white/50">
                Review sponsor advertisements before they appear on
                the public Sponsor Row.
              </p>
            </div>

            <button
              type="button"
              onClick={loadSponsorRequests}
              disabled={sponsorLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  sponsorLoading ? "animate-spin" : ""
                }
              />

              Refresh Sponsors
            </button>
          </div>

          {/* Sponsor message */}
          {sponsorMessage && (
            <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
              {sponsorMessage}
            </div>
          )}

          {/* Sponsor summary */}
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.05] px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-amber-300/70">
                Pending Requests
              </div>

              <div className="mt-1 text-2xl font-bold text-amber-200">
                {sponsorLoading ? "—" : pendingSponsors.length}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] px-5 py-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-300/70">
                Approved Sponsors
              </div>

              <div className="mt-1 text-2xl font-bold text-emerald-200">
                {sponsorLoading ? "—" : approvedSponsors.length}
              </div>
            </div>
          </div>

          {/* Sponsor loading */}
          {sponsorLoading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-8 text-center text-sm text-white/45">
              Loading sponsor requests...
            </div>
          )}

          {/* Empty */}
          {!sponsorLoading && sponsorRequests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.025] px-5 py-10 text-center">
              <Sparkles
                size={28}
                className="mx-auto text-white/20"
              />

              <div className="mt-3 text-sm font-medium text-white/60">
                No sponsor requests yet
              </div>

              <p className="mt-1 text-xs text-white/35">
                New sponsor requests will appear here for approval.
              </p>
            </div>
          )}

          {/* Sponsor list */}
          {!sponsorLoading && sponsorRequests.length > 0 && (
            <div className="space-y-3">
              {sponsorRequests.map((sponsor) => {
                const isPending = !sponsor.published;
                const isWorking =
                  sponsorActionId === sponsor.id;

                return (
                  <div
                    key={sponsor.id}
                    className={`rounded-2xl border p-4 transition ${
                      isPending
                        ? "border-amber-400/20 bg-amber-400/[0.035]"
                        : "border-emerald-400/15 bg-emerald-400/[0.025]"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* Sponsor information */}
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.06]">
                          {sponsor.logo_url ? (
                            <img
                              src={sponsor.logo_url}
                              alt={
                                sponsor.company_name ||
                                "Sponsor logo"
                              }
                              className="h-full w-full object-contain p-1.5"
                            />
                          ) : (
                            <Sparkles
                              size={21}
                              className="text-white/30"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-white">
                              {sponsor.company_name ||
                                "Unnamed Business"}
                            </h3>

                            {isPending ? (
                              <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                                Pending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                                <CheckCircle2 size={11} />
                                Approved
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm leading-6 text-white/60">
                            {sponsor.offer_text ||
                              "No offer text provided."}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-white/35">
                            {sponsor.link_url && (
                              <span className="max-w-[280px] truncate">
                                {sponsor.link_url}
                              </span>
                            )}

                            {sponsor.created_at && (
                              <span>
                                Submitted{" "}
                                {new Date(
                                  sponsor.created_at
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {isPending ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleSponsorAction(
                                  sponsor.id,
                                  "approve"
                                )
                              }
                              disabled={isWorking}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CheckCircle2 size={16} />

                              {isWorking
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleSponsorAction(
                                  sponsor.id,
                                  "reject"
                                )
                              }
                              disabled={isWorking}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <XCircle size={16} />

                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] px-4 py-2.5 text-xs font-medium text-emerald-300/80">
                            <CheckCircle2 size={15} />
                            Live on Sponsor Row
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                  <div className="font-semibold">
                    Manage Workers
                  </div>

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
                  <div className="font-semibold">
                    Manage Jobs
                  </div>

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
                  <div className="font-semibold">
                    SHROMO TV
                  </div>

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