
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  MapPin,
  BriefcaseBusiness,
  Star,
  Eye,
  RefreshCw,
  UserRound,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

type Worker = {
  id: string;
  profile_id: string | null;
  category: string | null;
  sub_category: string | null;
  experience: string | null;
  skills: string | null;
  district: string | null;
  rating: number | null;
  review_count: number | null;
  created_at: string;
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

      const response = await fetch("/api/central-admin/workers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Workers could not be loaded."
        );
      }

      setWorkers(data.workers ?? []);
    } catch (err) {
      console.error("Workers loading error:", err);

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
          Boolean(value && value.trim())
      );

    return Array.from(new Set(values)).sort();
  }, [workers]);

  const filteredWorkers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return workers.filter((worker) => {
      const matchesCategory =
        category === "all" ||
        worker.category === category;

      if (!keyword) {
        return matchesCategory;
      }

      const searchableText = [
        worker.category,
        worker.sub_category,
        worker.experience,
        worker.skills,
        worker.district,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        searchableText.includes(keyword)
      );
    });
  }, [workers, search, category]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                href="/central-admin"
                className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Central Admin
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                  <Users size={23} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Workers Management
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    Manage and monitor the Shromobazar workforce.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadWorkers(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing ? "animate-spin" : ""
                }
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
        {/* Summary */}
        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Users size={20} />}
            title="Total Workers"
            value={workers.length}
          />

          <SummaryCard
            icon={<BriefcaseBusiness size={20} />}
            title="Categories"
            value={categories.length}
          />

          <SummaryCard
            icon={<Eye size={20} />}
            title="Showing"
            value={filteredWorkers.length}
          />
        </section>

        {/* Search & filters */}
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
                  setSearch(event.target.value)
                }
                placeholder="Search by category, skill, district or experience..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-white/20"
              />
            </div>

            <div className="relative lg:w-64">
              <Filter
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950 py-3 pl-11 pr-10 text-sm text-white outline-none focus:border-white/20"
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <section className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
            <p className="text-sm font-medium text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadWorkers()}
              className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-200 transition hover:bg-red-400/20"
            >
              Try Again
            </button>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="h-12 w-12 rounded-xl bg-white/10" />
                <div className="mt-5 h-4 w-2/3 rounded bg-white/10" />
                <div className="mt-3 h-3 w-1/2 rounded bg-white/5" />
                <div className="mt-6 h-10 rounded-xl bg-white/5" />
              </div>
            ))}
          </section>
        )}

        {/* Empty state */}
        {!loading &&
          !error &&
          workers.length === 0 && (
            <section className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center md:p-12">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                <UserRound size={28} className="text-slate-400" />
              </div>

              <h2 className="mt-5 text-xl font-semibold">
                No workers registered yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Worker registrations will automatically appear
                here after they are connected to the central
                Shromobazar database.
              </p>
            </section>
          )}

        {/* No search results */}
        {!loading &&
          !error &&
          workers.length > 0 &&
          filteredWorkers.length === 0 && (
            <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-10 text-center">
              <Search
                size={28}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-4 text-lg font-semibold">
                No matching workers
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try a different search term or category.
              </p>
            </section>
          )}

        {/* Worker cards */}
        {!loading &&
          !error &&
          filteredWorkers.length > 0 && (
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredWorkers.map((worker) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                />
              ))}
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-slate-300">
          {icon}
        </div>

        <span className="text-2xl font-bold">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-400">
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
  const rating = worker.rating ?? 0;

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <UserRound size={20} className="text-slate-300" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate font-semibold">
              {worker.sub_category ||
                worker.category ||
                "Worker"}
            </h2>

            <p className="mt-1 truncate text-xs text-slate-500">
              {worker.category ||
                "Workforce Professional"}
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
          Active
        </span>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <MapPin size={15} className="text-slate-600" />
          <span>
            {worker.district || "Location not provided"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <BriefcaseBusiness
            size={15}
            className="text-slate-600"
          />

          <span>
            {worker.experience ||
              "Experience not provided"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Star
            size={15}
            className="text-slate-600"
          />

          <span>
            {rating.toFixed(1)} rating ·{" "}
            {worker.review_count ?? 0} reviews
          </span>
        </div>
      </div>

      {worker.skills && (
        <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-500">
          {worker.skills}
        </p>
      )}

      <Link
        href={`/central-admin/workers/${worker.id}`}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
      >
        <Eye size={16} />
        View Worker
      </Link>
    </article>
  );
}