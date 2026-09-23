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
  Globe2,
  Bell,
  WalletCards,
  HeartPulse,
  GraduationCap,
  Trophy,
  ClipboardList,
  UserRoundCog,
  Settings,
  Megaphone,
  Newspaper,
  CircleDot,
  LockKeyhole,
} from "lucide-react";

type DashboardData = {
  success?: boolean;

  database?: {
    connected?: boolean;
    provider?: string;
  };

  statistics?: {
    workers?: number;
    employers?: number;
    jobs?: number;
    applications?: number;
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-white/50">
            {title}
          </div>

          <div className="mt-1 text-2xl font-bold text-white">
            {value}
          </div>
        </div>

        <div className="rounded-xl bg-white/10 p-2.5 text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

function ModuleBar({
  title,
  description,
  icon,
  href,
  badge,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  badge?: string;
}) {
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              {title}
            </h3>

            {badge && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/45">
                {badge}
              </span>
            )}
          </div>

          <p className="mt-0.5 truncate text-xs text-white/40">
            {description}
          </p>
        </div>
      </div>

      {href ? (
        <ArrowRight
          size={17}
          className="shrink-0 text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white"
        />
      ) : (
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-white/25">
          Planned
        </span>
      )}
    </>
  );

  if (!href) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3.5">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3.5 transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      {content}
    </Link>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="text-white/70">{icon}</span>

        <h2 className="text-base font-bold text-white">
          {title}
        </h2>
      </div>

      <p className="mt-1 text-xs text-white/40">
        {description}
      </p>
    </div>
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
          result?.error || result?.message || "Failed to load central admin data."
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

  const statistics = data?.statistics || {};
  const counts = data?.counts || {};

  const workers = statistics.workers ?? counts.workers ?? 0;
  const employers = statistics.employers ?? counts.employers ?? 0;
  const jobs = statistics.jobs ?? counts.jobs ?? 0;
  const applications =
    statistics.applications ?? counts.applications ?? 0;

  const pendingSponsors = sponsorRequests.filter(
    (item) => !item.published
  );

  const approvedSponsors = sponsorRequests.filter(
    (item) => item.published
  );

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-white/10 bg-[#07111f]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-2.5">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Central Admin
              </h1>

              <p className="text-[11px] text-white/40">
                Shromobazar Management System
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              loadDashboard();
              loadSponsorRequests();
            }}
            disabled={loading || sponsorLoading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
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

      <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
        {/* =====================================================
            DATABASE STATUS
        ====================================================== */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-xl p-2 ${
                data?.database?.connected
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              <Database size={18} />
            </div>

            <div>
              <div className="text-sm font-semibold">
                Database
              </div>

              <div className="text-[11px] text-white/40">
                {loading
                  ? "Checking connection..."
                  : data?.database?.connected
                  ? "Supabase connected"
                  : "Connection unavailable"}
              </div>
            </div>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-[10px] font-bold ${
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

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={19}
                className="mt-0.5 shrink-0 text-red-400"
              />

              <div>
                <h2 className="text-sm font-semibold text-red-300">
                  Dashboard Error
                </h2>

                <p className="mt-1 text-xs leading-5 text-red-200/70">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            OVERVIEW
        ====================================================== */}
        <section>
          <SectionTitle
            icon={<CircleDot size={17} />}
            title="Overview"
            description="Current platform statistics"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Workers"
              value={loading ? "—" : workers}
              icon={<Users size={19} />}
            />

            <StatCard
              title="Employers"
              value={loading ? "—" : employers}
              icon={<Building2 size={19} />}
            />

            <StatCard
              title="Jobs"
              value={loading ? "—" : jobs}
              icon={<BriefcaseBusiness size={19} />}
            />

            <StatCard
              title="Applications"
              value={loading ? "—" : applications}
              icon={<FileText size={19} />}
            />
          </div>
        </section>

        {/* =====================================================
            SPONSOR BAR
        ====================================================== */}
        <section className="mt-8">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <SectionTitle
              icon={<Sparkles size={17} />}
              title="Sponsor Bar"
              description="Review and approve sponsor advertisements"
            />

            <button
              type="button"
              onClick={loadSponsorRequests}
              disabled={sponsorLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={
                  sponsorLoading ? "animate-spin" : ""
                }
              />
              Refresh
            </button>
          </div>

          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wide text-amber-300/60">
                Pending
              </div>

              <div className="mt-0.5 text-xl font-bold text-amber-200">
                {sponsorLoading
                  ? "—"
                  : pendingSponsors.length}
              </div>
            </div>

            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-wide text-emerald-300/60">
                Approved / Live
              </div>

              <div className="mt-0.5 text-xl font-bold text-emerald-200">
                {sponsorLoading
                  ? "—"
                  : approvedSponsors.length}
              </div>
            </div>
          </div>

          {sponsorMessage && (
            <div className="mb-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white/70">
              {sponsorMessage}
            </div>
          )}

          {sponsorLoading && (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-7 text-center text-xs text-white/40">
              Loading sponsor requests...
            </div>
          )}

          {!sponsorLoading &&
            sponsorRequests.length === 0 && (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-7 text-center">
                <Sparkles
                  size={24}
                  className="mx-auto text-white/20"
                />

                <div className="mt-2 text-xs font-medium text-white/50">
                  No sponsor requests yet
                </div>
              </div>
            )}

          {!sponsorLoading &&
            sponsorRequests.length > 0 && (
              <div className="space-y-2.5">
                {sponsorRequests.map((sponsor) => {
                  const isPending = !sponsor.published;
                  const isWorking =
                    sponsorActionId === sponsor.id;

                  return (
                    <div
                      key={sponsor.id}
                      className={`rounded-xl border px-4 py-3 ${
                        isPending
                          ? "border-amber-400/15 bg-amber-400/[0.025]"
                          : "border-emerald-400/10 bg-emerald-400/[0.02]"
                      }`}
                    >
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.05]">
                            {sponsor.logo_url ? (
                              <img
                                src={sponsor.logo_url}
                                alt={
                                  sponsor.company_name ||
                                  "Sponsor"
                                }
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <Sparkles
                                size={17}
                                className="text-white/25"
                              />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-semibold text-white">
                                {sponsor.company_name ||
                                  "Unnamed Business"}
                              </h3>

                              {isPending ? (
                                <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-300">
                                  Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-300">
                                  <CheckCircle2 size={10} />
                                  Live
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 truncate text-xs text-white/45">
                              {sponsor.offer_text ||
                                "No offer text provided."}
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
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
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
                              >
                                <CheckCircle2 size={14} />

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
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400/[0.05] px-3 py-2 text-[10px] font-semibold text-emerald-300/70">
                              <CheckCircle2 size={13} />
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

        {/* =====================================================
            PEOPLE & WORK
        ====================================================== */}
        <section className="mt-9">
          <SectionTitle
            icon={<Users size={17} />}
            title="People & Work"
            description="Core workforce and hiring administration"
          />

          <div className="grid gap-2.5 md:grid-cols-2">
            <ModuleBar
              title="Workers"
              description="Worker profiles and worker database"
              icon={<Users size={18} />}
              href="/central-admin/workers"
            />

            <ModuleBar
              title="Employers"
              description="Employers and hiring accounts"
              icon={<Building2 size={18} />}
              href="/central-admin/employers"
            />

            <ModuleBar
              title="Jobs"
              description="Job postings and opportunities"
              icon={<BriefcaseBusiness size={18} />}
              href="/central-admin/jobs"
            />

            <ModuleBar
              title="Applications"
              description="Worker applications and hiring activity"
              icon={<FileText size={18} />}
              href="/central-admin/applications"
            />

            <ModuleBar
              title="Users & Accounts"
              description="Master accounts and identity management"
              icon={<UserRoundCog size={18} />}
              badge="Core"
            />

            <ModuleBar
              title="Verification & Trust"
              description="Future verification and trust controls"
              icon={<LockKeyhole size={18} />}
              badge="Planned"
            />
          </div>
        </section>

        {/* =====================================================
            MARKETPLACE & BUSINESS
        ====================================================== */}
        <section className="mt-9">
          <SectionTitle
            icon={<Store size={17} />}
            title="Marketplace & Business"
            description="Shromobazar commerce and organization ecosystem"
          />

          <div className="grid gap-2.5 md:grid-cols-2">
            <ModuleBar
              title="Marketplace"
              description="Products, sellers and marketplace listings"
              icon={<Store size={18} />}
              href="/marketplace"
            />

            <ModuleBar
              title="Buy Requests"
              description="Customer product and service requests"
              icon={<ShoppingCart size={18} />}
              href="/buy-requests"
            />

            <ModuleBar
              title="Business / Office"
              description="Business and organization management"
              icon={<Building2 size={18} />}
              badge="Business"
            />

            <ModuleBar
              title="Global Business"
              description="International business expansion tools"
              icon={<Globe2 size={18} />}
              badge="Global"
            />

            <ModuleBar
              title="Shop"
              description="Retail, wholesale and online shop ecosystem"
              icon={<Store size={18} />}
              badge="Shop"
            />

            <ModuleBar
              title="Tender Opportunity"
              description="Tender notice and opportunity center"
              icon={<ClipboardList size={18} />}
              badge="Tender"
            />
          </div>
        </section>

        {/* =====================================================
            CONTENT & COMMUNICATION
        ====================================================== */}
        <section className="mt-9">
          <SectionTitle
            icon={<MessageSquare size={17} />}
            title="Content & Communication"
            description="Community, media and communication controls"
          />

          <div className="grid gap-2.5 md:grid-cols-2">
            <ModuleBar
              title="Status / News Feed"
              description="Status posts, comments and community activity"
              icon={<Newspaper size={18} />}
              badge="Core"
            />

            <ModuleBar
              title="Chat"
              description="Platform communication and messaging"
              icon={<MessageSquare size={18} />}
              href="/chat"
            />

            <ModuleBar
              title="Help & Advice"
              description="Help, advice and support content"
              icon={<HelpCircle size={18} />}
              href="/help-advice"
            />

            <ModuleBar
              title="Notifications"
              description="Platform notification management"
              icon={<Bell size={18} />}
              badge="Admin"
            />

            <ModuleBar
              title="SHROMO TV"
              description="Upload and manage TV media"
              icon={<Tv size={18} />}
              href="/central-admin/shromo-tv"
            />

            <ModuleBar
              title="Sponsor Bar"
              description="Sponsor approval and public Sponsor Row"
              icon={<Megaphone size={18} />}
              badge="Active"
            />
          </div>
        </section>

        {/* =====================================================
            SERVICES & SUPPORT
        ====================================================== */}
        <section className="mt-9">
          <SectionTitle
            icon={<HelpCircle size={17} />}
            title="Services & Support"
            description="Platform support, health, education and other services"
          />

          <div className="grid gap-2.5 md:grid-cols-2">
            <ModuleBar
              title="Complaints"
              description="Review complaints and support cases"
              icon={<AlertTriangle size={18} />}
              href="/complaints"
            />

            <ModuleBar
              title="Subscriptions"
              description="Subscription plans and premium services"
              icon={<CreditCard size={18} />}
              href="/subscriptions"
            />

            <ModuleBar
              title="Medical / Health"
              description="Health and medical service administration"
              icon={<HeartPulse size={18} />}
              badge="Planned"
            />

            <ModuleBar
              title="Education / Student"
              description="Student and education ecosystem"
              icon={<GraduationCap size={18} />}
              badge="Planned"
            />

            <ModuleBar
              title="Sports"
              description="Sports profiles, activities and future features"
              icon={<Trophy size={18} />}
              badge="Planned"
            />

            <ModuleBar
              title="Good Work / Public Album"
              description="Future public good-work and community showcase"
              icon={<Sparkles size={18} />}
              badge="Planned"
            />
          </div>
        </section>

        {/* =====================================================
            FINANCE & SYSTEM
        ====================================================== */}
        <section className="mt-9">
          <SectionTitle
            icon={<WalletCards size={17} />}
            title="Finance & System"
            description="Financial and platform-level administration"
          />

          <div className="grid gap-2.5 md:grid-cols-2">
            <ModuleBar
              title="Wallet / Transactions"
              description="Wallet and transaction administration"
              icon={<WalletCards size={18} />}
              badge="Wallet"
            />

            <ModuleBar
              title="Premium / Subscriptions"
              description="Premium visibility and subscription controls"
              icon={<CreditCard size={18} />}
              href="/subscriptions"
            />

            <ModuleBar
              title="Admin Settings"
              description="Central administration settings"
              icon={<Settings size={18} />}
              badge="System"
            />

            <ModuleBar
              title="Security & Access"
              description="Future admin access and security controls"
              icon={<ShieldCheck size={18} />}
              badge="Planned"
            />
          </div>
        </section>

        {/* =====================================================
            FUTURE / PLANNED
        ====================================================== */}
        <section className="mt-9">
          <SectionTitle
            icon={<Sparkles size={17} />}
            title="Future Platform Tools"
            description="Reserved space for upcoming Shromobazar features"
          />

          <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
            <ModuleBar
              title="Join & Earn"
              description="Future investment / income campaign"
              icon={<Sparkles size={18} />}
              badge="Planned"
            />

            <ModuleBar
              title="AI & Legal Services"
              description="Future AI and legal service ecosystem"
              icon={<FileText size={18} />}
              badge="Planned"
            />

            <ModuleBar
              title="Player Market"
              description="Future player and sports market"
              icon={<Trophy size={18} />}
              badge="Planned"
            />

            <ModuleBar
              title="Art Marketplace"
              description="Creative work, licensing and marketplace tools"
              icon={<Sparkles size={18} />}
              badge="Planned"
            />

            <ModuleBar
              title="Shromo Display"
              description="Future promotional display system"
              icon={<Tv size={18} />}
              badge="Planned"
            />

            <ModuleBar
              title="Invoice"
              description="Future Shromo Invoice and deal records"
              icon={<FileText size={18} />}
              badge="Planned"
            />
          </div>
        </section>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}
        <section className="mt-9">
          <SectionTitle
            icon={<ArrowRight size={17} />}
            title="Quick Actions"
            description="Frequently used administration pages"
          />

          <div className="grid gap-2.5 md:grid-cols-3">
            <ModuleBar
              title="Manage Workers"
              description="Worker database"
              icon={<Users size={18} />}
              href="/central-admin/workers"
            />

            <ModuleBar
              title="Manage Jobs"
              description="Job postings"
              icon={<BriefcaseBusiness size={18} />}
              href="/central-admin/jobs"
            />

            <ModuleBar
              title="SHROMO TV"
              description="Upload & manage media"
              icon={<Tv size={18} />}
              href="/central-admin/shromo-tv"
            />
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer className="mt-10 border-t border-white/10 pt-5 pb-7">
          <div className="flex flex-col justify-between gap-2 text-[10px] text-white/30 sm:flex-row">
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