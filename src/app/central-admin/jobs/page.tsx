"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

type Job = {
  id: string;
  employerId: string;
  title: string;
  location: string;
  salary: string | number;
  workersNeeded: number;
  description: string;
  status: string;
  employerType: string;
  companyName: string;
  employerProfileId: string;
  employerDescription: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function CentralAdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const loadJobs = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          "/api/central-admin/jobs",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Jobs load করা যায়নি।"
          );
        }

        setJobs(result.jobs || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Jobs load করা যায়নি।"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const statuses = useMemo(() => {
    const values = jobs
      .map((job) => job.status)
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesStatus =
        statusFilter === "all" ||
        job.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        job.title,
        job.location,
        job.salary,
        job.description,
        job.status,
        job.companyName,
        job.employerType,
        job.employerId,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [jobs, search, statusFilter]);

  const openJobs = jobs.filter(
    (job) => job.status === "open"
  ).length;

  const closedJobs = jobs.filter(
    (job) => job.status === "closed"
  ).length;

  const completedJobs = jobs.filter(
    (job) => job.status === "completed"
  ).length;

  function formatDate(value: string | null) {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleDateString(
        "bn-BD",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return value;
    }
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case "open":
        return "Open";
      case "closed":
        return "Closed";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Unknown";
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "open":
        return "bg-emerald-50 text-emerald-700";
      case "closed":
        return "bg-slate-100 text-slate-600";
      case "completed":
        return "bg-blue-50 text-blue-700";
      case "cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-amber-50 text-amber-700";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link
                href="/central-admin"
                className="transition hover:text-blue-600"
              >
                Central Admin
              </Link>

              <span>/</span>

              <span className="font-semibold text-slate-700">
                Jobs
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Jobs Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Shromobazar-এর সব Job posting এক জায়গা থেকে দেখুন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadJobs(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Jobs"}
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total Jobs
            </p>
            <p className="mt-2 text-2xl font-black text-slate-900">
              {jobs.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              Open
            </p>
            <p className="mt-2 text-2xl font-black text-emerald-700">
              {openJobs}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Closed
            </p>
            <p className="mt-2 text-2xl font-black text-slate-700">
              {closedJobs}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Completed
            </p>
            <p className="mt-2 text-2xl font-black text-blue-700">
              {completedJobs}
            </p>
          </div>
        </div>

        {/* Search / Filter */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Job title, company, location, salary..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                সব Status
              </option>

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 text-xs font-semibold text-slate-500">
            Showing{" "}
            <span className="text-slate-900">
              {filteredJobs.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-900">
              {jobs.length}
            </span>{" "}
            jobs
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadJobs()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-6 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredJobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">📋</div>

              <h2 className="mt-3 text-lg font-black text-slate-800">
                কোনো Job পাওয়া যায়নি
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search বা status filter পরিবর্তন করে আবার দেখুন।
              </p>
            </div>
          )}

        {/* Jobs */}
        {!loading &&
          filteredJobs.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words text-lg font-black text-slate-900">
                        {job.title ||
                          "Untitled Job"}
                      </h2>

                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {job.companyName ||
                          "Employer company not provided"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                        job.status
                      )}`}
                    >
                      {getStatusLabel(
                        job.status
                      )}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Location
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {job.location || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Salary
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {job.salary || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Workers Needed
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {job.workersNeeded}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Employer Type
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {job.employerType || "—"}
                      </p>
                    </div>
                  </div>

                  {job.description && (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-slate-400">
                        Description
                      </p>

                      <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">
                        {job.description}
                      </p>
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="text-xs text-slate-400">
                      <span className="font-semibold">
                        Registered:
                      </span>{" "}
                      {formatDate(
                        job.createdAt
                      )}
                    </div>

                    <div className="text-[11px] font-medium text-slate-400">
                      ID: {job.id}
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
                    <span className="font-bold">
                      Employer ID:
                    </span>{" "}
                    {job.employerId}
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}