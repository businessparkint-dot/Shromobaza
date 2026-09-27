"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

type BuyRequest = {
  id: string;
  buyerId: string;
  sellerId: string;
  marketplacePostId: string;
  title: string;
  description: string;
  budget: string | number;
  location: string;
  quantity: string | number;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function CentralAdminBuyRequestsPage() {
  const [requests, setRequests] = useState<
    BuyRequest[]
  >([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const loadRequests = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          "/api/central-admin/buy-requests",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Buy Requests load করা যায়নি।"
          );
        }

        setRequests(result.requests || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Buy Requests load করা যায়নি।"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const statuses = useMemo(() => {
    const values = requests
      .map((item) => item.status)
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [requests]);

  const pendingCount = requests.filter(
    (item) => item.status === "pending"
  ).length;

  const acceptedCount = requests.filter(
    (item) => item.status === "accepted"
  ).length;

  const completedCount = requests.filter(
    (item) => item.status === "completed"
  ).length;

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesStatus =
        statusFilter === "all" ||
        request.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        request.title,
        request.description,
        request.location,
        request.budget,
        request.quantity,
        request.status,
        request.buyerId,
        request.sellerId,
        request.marketplacePostId,
        request.id,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [
    requests,
    search,
    statusFilter,
  ]);

  function formatDate(value: string | null) {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleString(
        "bn-BD",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
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
      case "pending":
        return "bg-amber-50 text-amber-700";

      case "accepted":
        return "bg-emerald-50 text-emerald-700";

      case "rejected":
        return "bg-red-50 text-red-600";

      case "completed":
        return "bg-blue-50 text-blue-700";

      case "cancelled":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-purple-50 text-purple-700";
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
                Buy Requests
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Buy Requests Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Marketplace-এর ক্রেতাদের Buy Request এক জায়গা থেকে দেখুন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadRequests(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Requests"}
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="mt-2 text-2xl font-black text-slate-900">
              {requests.length}
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

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Completed
            </p>

            <p className="mt-2 text-2xl font-black text-blue-700">
              {completedCount}
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
              placeholder="Title, buyer ID, seller ID, location..."
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
              {filteredRequests.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-900">
              {requests.length}
            </span>{" "}
            requests
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
              onClick={() => loadRequests()}
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
          filteredRequests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">🛒</div>

              <h2 className="mt-3 text-lg font-black text-slate-800">
                কোনো Buy Request পাওয়া যায়নি
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search বা status filter পরিবর্তন করে আবার দেখুন।
              </p>
            </div>
          )}

        {/* Requests */}
        {!loading &&
          filteredRequests.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredRequests.map(
                (request) => (
                  <article
                    key={request.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    {/* Top */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="break-words text-lg font-black text-slate-900">
                          {request.title ||
                            "Untitled Buy Request"}
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                          Created:{" "}
                          {formatDate(
                            request.createdAt
                          )}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {getStatusLabel(
                          request.status
                        )}
                      </span>
                    </div>

                    {/* Request Details */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Budget
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-700">
                          {request.budget || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Quantity
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-700">
                          {request.quantity || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {request.location || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {request.description && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-slate-400">
                          Description
                        </p>

                        <p className="mt-1 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                          {request.description}
                        </p>
                      </div>
                    )}

                    {/* Buyer / Seller */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-blue-500">
                          Buyer ID
                        </p>

                        <p className="mt-1 break-all font-mono text-xs font-semibold text-blue-800">
                          {request.buyerId}
                        </p>
                      </div>

                      <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-orange-500">
                          Seller ID
                        </p>

                        <p className="mt-1 break-all font-mono text-xs font-semibold text-orange-800">
                          {request.sellerId}
                        </p>
                      </div>
                    </div>

                    {/* Marketplace Post */}
                    <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-purple-500">
                        Marketplace Post ID
                      </p>

                      <p className="mt-1 break-all font-mono text-xs font-semibold text-purple-800">
                        {request.marketplacePostId}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <div className="text-[11px] text-slate-400">
                        Request ID:{" "}
                        <span className="font-mono">
                          {request.id}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400">
                        Updated:{" "}
                        {formatDate(
                          request.updatedAt
                        )}
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