"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

type Application = {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: string;
  message: string;
  appliedAt: string | null;
  updatedAt: string | null;

  job: {
    id: string;
    title: string;
    location: string;
    salary: string | number;
    workersNeeded: number;
    status: string;
  };

  employer: {
    id: string;
    profileId: string;
    type: string;
    companyName: string;
    description: string;
  };

  worker: {
    id: string;
    profileId: string;
    name: string;
    phone: string;
    location: string;
    district: string;
    category: string;
    subCategory: string;
    experience: string;
    skills: string;
    rating: number;
    reviewCount: number;
    avatarUrl: string | null;
  };
};

export default function CentralAdminApplicationsPage() {
  const [applications, setApplications] =
    useState<Application[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const loadApplications = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          "/api/central-admin/applications",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Applications load করা যায়নি।"
          );
        }

        setApplications(
          result.applications || []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Applications load করা যায়নি।"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const statuses = useMemo(() => {
    const values = applications
      .map((item) => item.status)
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        statusFilter === "all" ||
        application.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        application.worker.name,
        application.worker.phone,
        application.worker.location,
        application.worker.district,
        application.worker.category,
        application.worker.subCategory,
        application.worker.experience,
        application.worker.skills,
        application.job.title,
        application.job.location,
        application.job.salary,
        application.employer.companyName,
        application.employer.type,
        application.message,
        application.status,
        application.id,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [
    applications,
    search,
    statusFilter,
  ]);

  const pendingCount = applications.filter(
    (item) => item.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (item) => item.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "rejected"
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
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "rejected":
        return "Rejected";
      case "in_progress":
        return "In Progress";
      case "worker_completed":
        return "Worker Completed";
      case "completed":
        return "Completed";
      default:
        return status || "Unknown";
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700";

      case "accepted":
        return "bg-emerald-50 text-emerald-700";

      case "rejected":
        return "bg-red-50 text-red-600";

      case "in_progress":
        return "bg-blue-50 text-blue-700";

      case "worker_completed":
        return "bg-indigo-50 text-indigo-700";

      case "completed":
        return "bg-green-50 text-green-700";

      default:
        return "bg-slate-100 text-slate-600";
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
                Applications
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Applications Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Worker-এর Job Applications এক জায়গা থেকে দেখুন।
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadApplications(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Applications"}
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="mt-2 text-2xl font-black text-slate-900">
              {applications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
              Pending
            </p>

            <p className="mt-2 text-2xl font-black text-amber-700">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              Accepted
            </p>

            <p className="mt-2 text-2xl font-black text-emerald-700">
              {acceptedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-red-600">
              Rejected
            </p>

            <p className="mt-2 text-2xl font-black text-red-700">
              {rejectedCount}
            </p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Worker, Job, Employer, phone, location..."
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
              {filteredApplications.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-900">
              {applications.length}
            </span>{" "}
            applications
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
              onClick={() =>
                loadApplications()
              }
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
                <div className="mt-5 h-16 rounded bg-slate-100" />
                <div className="mt-3 h-10 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredApplications.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">📨</div>

              <h2 className="mt-3 text-lg font-black text-slate-800">
                কোনো Application পাওয়া যায়নি
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search বা status filter পরিবর্তন করে আবার দেখুন।
              </p>
            </div>
          )}

        {/* Applications */}
        {!loading &&
          filteredApplications.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredApplications.map(
                (application) => (
                  <article
                    key={application.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="break-words text-lg font-black text-slate-900">
                          {application.worker.name}
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {application.worker.phone ||
                            "Phone not provided"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                          application.status
                        )}`}
                      >
                        {getStatusLabel(
                          application.status
                        )}
                      </span>
                    </div>

                    {/* Worker */}
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Worker
                      </p>

                      <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                        <p className="text-slate-700">
                          <span className="font-bold">
                            Category:
                          </span>{" "}
                          {application.worker.category ||
                            "—"}
                        </p>

                        <p className="text-slate-700">
                          <span className="font-bold">
                            Sub-category:
                          </span>{" "}
                          {application.worker.subCategory ||
                            "—"}
                        </p>

                        <p className="text-slate-700">
                          <span className="font-bold">
                            District:
                          </span>{" "}
                          {application.worker.district ||
                            "—"}
                        </p>

                        <p className="text-slate-700">
                          <span className="font-bold">
                            Experience:
                          </span>{" "}
                          {application.worker.experience ||
                            "—"}
                        </p>
                      </div>
                    </div>

                    {/* Job */}
                    <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-blue-500">
                        Applied Job
                      </p>

                      <h3 className="mt-1 text-base font-black text-blue-900">
                        {application.job.title ||
                          "Untitled Job"}
                      </h3>

                      <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                        <p className="text-blue-800">
                          <span className="font-bold">
                            Location:
                          </span>{" "}
                          {application.job.location ||
                            "—"}
                        </p>

                        <p className="text-blue-800">
                          <span className="font-bold">
                            Salary:
                          </span>{" "}
                          {application.job.salary ||
                            "—"}
                        </p>
                      </div>
                    </div>

                    {/* Employer */}
                    <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 p-4">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-orange-500">
                        Employer
                      </p>

                      <p className="mt-1 text-sm font-black text-orange-900">
                        {application.employer.companyName ||
                          "Employer company not provided"}
                      </p>

                      <p className="mt-1 text-xs text-orange-800">
                        {application.employer.type ||
                          "Employer type not provided"}
                      </p>
                    </div>

                    {/* Message */}
                    {application.message && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-slate-400">
                          Applicant Message
                        </p>

                        <p className="mt-1 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                          {application.message}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="text-xs text-slate-400">
                        <span className="font-semibold">
                          Applied:
                        </span>{" "}
                        {formatDate(
                          application.appliedAt
                        )}
                      </div>

                      <div className="text-[11px] font-medium text-slate-400">
                        ID: {application.id}
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
      </div>
    </main>
  );
}