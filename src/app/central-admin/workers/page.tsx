"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  MapPin,
  BriefcaseBusiness,
  Eye,
  RefreshCw,
  UserRound,
  ChevronDown,
  ArrowLeft,
  Phone,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

type Worker = {
  id: string;
  name: string | null;
  phone: string | null;
  location: string | null;
  userType: string | null;
  category: string | null;
  subCategory: string | null;
  employerType: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  workers?: Worker[];
  total?: number;
  error?: string;
};

export default function CentralAdminWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  async function loadWorkers(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        "/api/central-admin/workers",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data: ApiResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Workers could not be loaded."
        );
      }

      setWorkers(data.workers ?? []);
    } catch (err) {
      console.error(
        "Workers loading error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Workers could not be loaded."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadWorkers();
  }, []);

  const categories = useMemo(() => {
    const values = workers
      .map((worker) => worker.category)
      .filter(
        (value): value is string =>
          Boolean(value?.trim())
      );

    return Array.from(
      new Set(values)
    ).sort((a, b) =>
      a.localeCompare(b, "bn")
    );
  }, [workers]);

  const filteredWorkers = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return workers.filter((worker) => {
      const matchesCategory =
        category === "all" ||
        worker.category === category;

      if (!matchesCategory) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      const searchableText = [
        worker.name,
        worker.phone,
        worker.location,
        worker.userType,
        worker.category,
        worker.subCategory,
        worker.employerType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        keyword
      );
    });
  }, [
    workers,
    search,
    category,
  ]);

  const activeWorkers = useMemo(() => {
    return workers.filter(
      (worker) =>
        worker.userType?.toLowerCase() ===
        "worker"
    ).length;
  }, [workers]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                href="/central-admin"
                className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Central Admin
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg">
                  <Users size={23} />
                </div>

                <div>
                  <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                    Workers Management
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    শ্রমবাজারের নিবন্ধিত
                    শ্রমিক ও workforce
                    management
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                loadWorkers(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
        {/* SUMMARY */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={
              <Users size={20} />
            }
            title="Total Workers"
            value={workers.length}
          />

          <SummaryCard
            icon={
              <BriefcaseBusiness
                size={20}
              />
            }
            title="Categories"
            value={categories.length}
          />

          <SummaryCard
            icon={
              <Eye size={20} />
            }
            title="Showing"
            value={
              filteredWorkers.length
            }
          />

          <SummaryCard
            icon={
              <ShieldCheck
                size={20}
              />
            }
            title="Worker Accounts"
            value={activeWorkers}
          />
        </section>

        {/* SEARCH & FILTER */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="নাম, ফোন, জেলা, পেশা বা category দিয়ে খুঁজুন..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-orange-400/40 focus:ring-2 focus:ring-orange-500/10"
              />
            </div>

            <div className="relative lg:w-72">
              <Filter
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-10 text-sm text-white outline-none focus:border-orange-400/40"
              >
                <option
                  value="all"
                  className="bg-slate-950"
                >
                  All Categories
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                      className="bg-slate-950"
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>

          {(search ||
            category !== "all") && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>
                Filtered result:
              </span>

              <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-orange-300">
                {filteredWorkers.length}{" "}
                workers
              </span>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
                className="rounded-full border border-white/10 px-2.5 py-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* ERROR */}
        {error && (
          <section className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-400/10">
                <span className="text-red-300">
                  !
                </span>
              </div>

              <div>
                <h2 className="font-semibold text-red-200">
                  Workers could not be
                  loaded
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-300/80">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    loadWorkers()
                  }
                  className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-400/20"
                >
                  Try Again
                </button>
              </div>
            </div>
          </section>
        )}

        {/* LOADING */}
        {loading && (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-white/10" />

                  <div className="flex-1">
                    <div className="h-4 w-2/3 rounded bg-white/10" />
                    <div className="mt-3 h-3 w-1/2 rounded bg-white/5" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-3 rounded bg-white/5" />
                  <div className="h-3 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>

                <div className="mt-6 h-10 rounded-xl bg-white/5" />
              </div>
            ))}
          </section>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          workers.length === 0 && (
            <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center md:p-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <UserRound
                  size={28}
                  className="text-slate-400"
                />
              </div>

              <h2 className="mt-5 text-xl font-bold">
                এখনো কোনো Worker
                নিবন্ধিত হয়নি
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                নতুন worker registration
                সম্পন্ন হলে তারা
                automatically এখানে
                দেখা যাবে।
              </p>
            </section>
          )}

        {/* NO RESULTS */}
        {!loading &&
          !error &&
          workers.length > 0 &&
          filteredWorkers.length ===
            0 && (
            <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-12 text-center">
              <Search
                size={30}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-4 text-lg font-bold">
                কোনো matching worker
                পাওয়া যায়নি
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Search term অথবা
                category পরিবর্তন করে
                আবার চেষ্টা করুন।
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory(
                    "all"
                  );
                }}
                className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Clear Filters
              </button>
            </section>
          )}

        {/* WORKER CARDS */}
        {!loading &&
          !error &&
          filteredWorkers.length >
            0 && (
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredWorkers.map(
                (worker) => (
                  <WorkerCard
                    key={worker.id}
                    worker={worker}
                  />
                )
              )}
            </section>
          )}
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/15 hover:bg-white/[0.06]">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-300">
          {icon}
        </div>

        <span className="text-2xl font-black tracking-tight">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-400">
        {title}
      </p>
    </div>
  );
}

function WorkerCard({
  worker,
}: {
  worker: Worker;
}) {
  const displayName =
    worker.name?.trim() ||
    worker.subCategory?.trim() ||
    worker.category?.trim() ||
    "Worker";

  const category =
    worker.category?.trim() ||
    "Workforce Professional";

  const subCategory =
    worker.subCategory?.trim();

  const location =
    worker.location?.trim() ||
    "Location not provided";

  const phone =
    worker.phone?.trim() ||
    "Phone not provided";

  const createdDate =
    worker.createdAt
      ? new Date(
          worker.createdAt
        ).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      : "Unknown";

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-black/20">
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {worker.avatarUrl ? (
            <img
              src={worker.avatarUrl}
              alt={displayName}
              className="h-12 w-12 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10">
              <UserRound
                size={21}
                className="text-orange-300"
              />
            </div>
          )}

          <div className="min-w-0">
            <h2 className="truncate font-bold text-white">
              {displayName}
            </h2>

            <p className="mt-1 truncate text-xs text-slate-500">
              {subCategory ||
                category}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
          Active
        </span>
      </div>

      {/* INFORMATION */}
      <div className="mt-5 space-y-3">
        <InfoRow
          icon={
            <BriefcaseBusiness
              size={15}
            />
          }
          text={category}
        />

        <InfoRow
          icon={
            <MapPin size={15} />
          }
          text={location}
        />

        <InfoRow
          icon={
            <Phone size={15} />
          }
          text={phone}
        />

        <InfoRow
          icon={
            <CalendarDays
              size={15}
            />
          }
          text={`Registered ${createdDate}`}
        />
      </div>

      {/* ACCOUNT TYPE */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-slate-400">
          Account:{" "}
          <span className="font-semibold text-slate-300">
            {worker.userType ||
              "worker"}
          </span>
        </span>

        {worker.employerType && (
          <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] text-slate-400">
            Type:{" "}
            <span className="font-semibold text-slate-300">
              {worker.employerType}
            </span>
          </span>
        )}
      </div>

      {/* ACTION */}
      <Link
        href={`/central-admin/workers/${worker.id}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold transition hover:border-orange-400/20 hover:bg-orange-500/10 hover:text-orange-300"
      >
        <Eye size={16} />
        View Worker
      </Link>
    </article>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-400">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-slate-600">
        {icon}
      </span>

      <span className="truncate">
        {text}
      </span>
    </div>
  );
}