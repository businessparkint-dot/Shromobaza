"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

type NotificationItem = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  href: string;
  metadata: unknown;
  read: boolean;
  createdAt: string | null;
};

export default function CentralAdminNotificationsPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("all");
  const [readFilter, setReadFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          "/api/central-admin/notifications",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Notifications load করা যায়নি।"
          );
        }

        setNotifications(
          result.notifications || []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Notifications load করা যায়নি।"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const types = useMemo(() => {
    const values = notifications
      .map((item) => item.type)
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [notifications]);

  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const readCount = notifications.filter(
    (item) => item.read
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesType =
        typeFilter === "all" ||
        item.type === typeFilter;

      const matchesRead =
        readFilter === "all" ||
        (readFilter === "read" && item.read) ||
        (readFilter === "unread" && !item.read);

      if (!matchesType || !matchesRead) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        item.userId,
        item.type,
        item.title,
        item.message,
        item.href,
        item.id,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [
    notifications,
    search,
    typeFilter,
    readFilter,
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

  function getTypeLabel(type: string) {
    const labels: Record<string, string> = {
      job: "Job",
      marketplace: "Marketplace",
      business: "Business",
      social: "Social",
      chat: "Chat",
      wallet: "Wallet",
      review: "Review",
      system: "System",
      promotion: "Promotion",
      support: "Support",
      education: "Education",
      health: "Health",
      sports: "Sports",
      entertainment: "Entertainment",
      event: "Event",
    };

    return labels[type] || type || "Unknown";
  }

  function getTypeClass(type: string) {
    switch (type) {
      case "job":
        return "bg-blue-50 text-blue-700";

      case "marketplace":
        return "bg-purple-50 text-purple-700";

      case "business":
        return "bg-orange-50 text-orange-700";

      case "social":
        return "bg-pink-50 text-pink-700";

      case "chat":
        return "bg-cyan-50 text-cyan-700";

      case "wallet":
        return "bg-emerald-50 text-emerald-700";

      case "review":
        return "bg-yellow-50 text-yellow-700";

      case "support":
        return "bg-red-50 text-red-700";

      case "education":
        return "bg-indigo-50 text-indigo-700";

      case "health":
        return "bg-teal-50 text-teal-700";

      case "sports":
        return "bg-green-50 text-green-700";

      case "entertainment":
        return "bg-fuchsia-50 text-fuchsia-700";

      case "event":
        return "bg-violet-50 text-violet-700";

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
                Notifications
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Notifications Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Shromobazar-এর notification activity এক জায়গা থেকে দেখুন।
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadNotifications(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Notifications"}
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="mt-2 text-2xl font-black text-slate-900">
              {notifications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-600">
              Unread
            </p>

            <p className="mt-2 text-2xl font-black text-amber-700">
              {unreadCount}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              Read
            </p>

            <p className="mt-2 text-2xl font-black text-emerald-700">
              {readCount}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_200px_200px]">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="User ID, title, message, type..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                সব Type
              </option>

              {types.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {getTypeLabel(type)}
                </option>
              ))}
            </select>

            <select
              value={readFilter}
              onChange={(event) =>
                setReadFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                Read + Unread
              </option>

              <option value="unread">
                Unread only
              </option>

              <option value="read">
                Read only
              </option>
            </select>
          </div>

          <div className="mt-3 text-xs font-semibold text-slate-500">
            Showing{" "}
            <span className="text-slate-900">
              {filteredNotifications.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-900">
              {notifications.length}
            </span>{" "}
            notifications
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
                loadNotifications()
              }
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-5 w-1/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />
                <div className="mt-4 h-12 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredNotifications.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">🔔</div>

              <h2 className="mt-3 text-lg font-black text-slate-800">
                কোনো Notification পাওয়া যায়নি
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search বা filter পরিবর্তন করে আবার দেখুন।
              </p>
            </div>
          )}

        {/* Notification List */}
        {!loading &&
          filteredNotifications.length > 0 && (
            <div className="space-y-3">
              {filteredNotifications.map(
                (notification) => (
                  <article
                    key={notification.id}
                    className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md ${
                      notification.read
                        ? "border-slate-200"
                        : "border-amber-200 bg-amber-50/30"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${getTypeClass(
                              notification.type
                            )}`}
                          >
                            {getTypeLabel(
                              notification.type
                            )}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              notification.read
                                ? "bg-slate-100 text-slate-500"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {notification.read
                              ? "Read"
                              : "Unread"}
                          </span>
                        </div>

                        <h2 className="mt-3 break-words text-base font-black text-slate-900">
                          {notification.title ||
                            "Untitled Notification"}
                        </h2>

                        {notification.message && (
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {notification.message}
                          </p>
                        )}

                        <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <span className="font-bold text-slate-500">
                              User ID
                            </span>

                            <p className="mt-1 break-all font-mono text-slate-700">
                              {notification.userId}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <span className="font-bold text-slate-500">
                              Created
                            </span>

                            <p className="mt-1 font-semibold text-slate-700">
                              {formatDate(
                                notification.createdAt
                              )}
                            </p>
                          </div>
                        </div>

                        {notification.href && (
                          <div className="mt-3 rounded-xl bg-blue-50 px-3 py-2 text-xs text-blue-700">
                            <span className="font-bold">
                              Link:
                            </span>{" "}
                            {notification.href}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 text-[10px] font-medium text-slate-400 lg:text-right">
                        <p>
                          Notification ID
                        </p>

                        <p className="mt-1 max-w-[220px] break-all font-mono">
                          {notification.id}
                        </p>
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