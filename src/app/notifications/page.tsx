"use client";

import {
  Bell,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCheck,
  ChevronRight,
  Clapperboard,
  GraduationCap,
  Headphones,
  HeartPulse,
  MessageCircle,
  Megaphone,
  Newspaper,
  Settings,
  ShoppingBag,
  Star,
  Trash2,
  Trophy,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";

import { supabase } from "@/lib/client";

type NotificationType =
  | "job"
  | "marketplace"
  | "business"
  | "social"
  | "chat"
  | "wallet"
  | "review"
  | "system"
  | "promotion"
  | "support"
  | "education"
  | "health"
  | "sports"
  | "entertainment"
  | "event";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  createdAt: string;
  read: boolean;
  href: string;
};

type FilterKey = "all" | NotificationType;

type SectorConfig = {
  label: string;
  icon: ElementType;
  className: string;
};

const sectorConfig: Record<NotificationType, SectorConfig> = {
  job: {
    label: "Jobs",
    icon: BriefcaseBusiness,
    className: "bg-blue-50 text-blue-700",
  },

  marketplace: {
    label: "Market",
    icon: ShoppingBag,
    className: "bg-orange-50 text-orange-700",
  },

  business: {
    label: "Business",
    icon: Building2,
    className: "bg-purple-50 text-purple-700",
  },

  social: {
    label: "Social Hub",
    icon: Users,
    className: "bg-pink-50 text-pink-700",
  },

  chat: {
    label: "Chat",
    icon: MessageCircle,
    className: "bg-cyan-50 text-cyan-700",
  },

  wallet: {
    label: "Wallet",
    icon: Wallet,
    className: "bg-emerald-50 text-emerald-700",
  },

  review: {
    label: "Reviews",
    icon: Star,
    className: "bg-yellow-50 text-yellow-700",
  },

  system: {
    label: "System",
    icon: Settings,
    className: "bg-slate-100 text-slate-700",
  },

  promotion: {
    label: "Offers",
    icon: Megaphone,
    className: "bg-red-50 text-red-700",
  },

  support: {
    label: "Support",
    icon: Headphones,
    className: "bg-indigo-50 text-indigo-700",
  },

  education: {
    label: "Education",
    icon: GraduationCap,
    className: "bg-violet-50 text-violet-700",
  },

  health: {
    label: "Health",
    icon: HeartPulse,
    className: "bg-rose-50 text-rose-700",
  },

  sports: {
    label: "Sports",
    icon: Trophy,
    className: "bg-green-50 text-green-700",
  },

  entertainment: {
    label: "Entertainment",
    icon: Clapperboard,
    className: "bg-fuchsia-50 text-fuchsia-700",
  },

  event: {
    label: "Events",
    icon: Newspaper,
    className: "bg-amber-50 text-amber-700",
  },
};

const filterItems: Array<{
  key: FilterKey;
  label: string;
}> = [
  { key: "all", label: "All" },
  { key: "job", label: "Jobs" },
  { key: "marketplace", label: "Market" },
  { key: "business", label: "Business" },
  { key: "social", label: "Social" },
  { key: "chat", label: "Chat" },
  { key: "wallet", label: "Wallet" },
  { key: "review", label: "Reviews" },
  { key: "education", label: "Education" },
  { key: "health", label: "Health" },
  { key: "sports", label: "Sports" },
  { key: "entertainment", label: "Entertainment" },
  { key: "event", label: "Events" },
  { key: "support", label: "Support" },
  { key: "promotion", label: "Offers" },
  { key: "system", label: "System" },
];

const allowedTypes: NotificationType[] = [
  "job",
  "marketplace",
  "business",
  "social",
  "chat",
  "wallet",
  "review",
  "system",
  "promotion",
  "support",
  "education",
  "health",
  "sports",
  "entertainment",
  "event",
];

function normalizeType(value: unknown): NotificationType {
  if (
    typeof value === "string" &&
    allowedTypes.includes(value as NotificationType)
  ) {
    return value as NotificationType;
  }

  return "system";
}

function formatNotificationTime(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return "Just now";
  }

  if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}m ago`;
  }

  if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}h ago`;
  }

  if (diff < 7 * day) {
    const days = Math.floor(diff / day);
    return `${days}d ago`;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);

  const [filter, setFilter] = useState<FilterKey>("all");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        setLoggedIn(false);
        setUserId(null);
        setNotifications([]);
        return;
      }

      setLoggedIn(true);
      setUserId(user.id);

      const {
        data,
        error: notificationError,
      } = await supabase
        .from("notifications")
        .select(
          "id, type, title, message, href, read, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (notificationError) {
        throw notificationError;
      }

      const mapped: NotificationItem[] = (data ?? []).map(
        (item) => ({
          id: String(item.id),
          type: normalizeType(item.type),
          title:
            typeof item.title === "string" && item.title.trim()
              ? item.title
              : "Notification",
          message:
            typeof item.message === "string"
              ? item.message
              : "",
          time: formatNotificationTime(item.created_at),
          createdAt: item.created_at,
          read: Boolean(item.read),
          href:
            typeof item.href === "string" && item.href.trim()
              ? item.href
              : "#",
        })
      );

      setNotifications(mapped);
    } catch (err) {
      console.error("Notification load error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Notification load করতে সমস্যা হয়েছে।"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (item) => !item.read
    ).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (filter === "all") {
      return notifications;
    }

    return notifications.filter(
      (item) => item.type === filter
    );
  }, [filter, notifications]);

  const markAsRead = async (id: string) => {
    if (!userId) {
      return;
    }

    const target = notifications.find(
      (item) => item.id === id
    );

    if (!target || target.read) {
      return;
    }

    setBusyId(id);

    try {
      const {
        error: updateError,
      } = await supabase
        .from("notifications")
        .update({
          read: true,
        })
        .eq("id", id)
        .eq("user_id", userId);

      if (updateError) {
        throw updateError;
      }

      setNotifications((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                read: true,
              }
            : item
        )
      );
    } catch (err) {
      console.error(
        "Mark notification read error:",
        err
      );
    } finally {
      setBusyId(null);
    }
  };

  const markAllAsRead = async () => {
    if (!userId || unreadCount === 0 || markingAll) {
      return;
    }

    setMarkingAll(true);

    try {
      const {
        error: updateError,
      } = await supabase
        .from("notifications")
        .update({
          read: true,
        })
        .eq("user_id", userId)
        .eq("read", false);

      if (updateError) {
        throw updateError;
      }

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          read: true,
        }))
      );
    } catch (err) {
      console.error(
        "Mark all notifications read error:",
        err
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!userId) {
      return;
    }

    setBusyId(id);

    try {
      const {
        error: deleteError,
      } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (deleteError) {
        throw deleteError;
      }

      setNotifications((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(
        "Delete notification error:",
        err
      );
    } finally {
      setBusyId(null);
    }
  };

  const openNotification = async (
    item: NotificationItem
  ) => {
    if (!item.read) {
      await markAsRead(item.id);
    }

    if (
      item.href &&
      item.href !== "#" &&
      item.href !== ""
    ) {
      window.location.href = item.href;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Bell size={24} />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Notifications
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  আপনার Shromobazar-এর সব গুরুত্বপূর্ণ
                  আপডেট এক জায়গায়
                </p>
              </div>
            </div>

            {loggedIn && unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={markingAll}
                className="hidden shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
              >
                <CheckCheck size={17} />

                {markingAll
                  ? "Updating..."
                  : "Mark all read"}
              </button>
            )}
          </div>

          {loggedIn && (
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {filterItems.map((item) => {
                const active = filter === item.key;

                const filterUnreadCount =
                  item.key === "all"
                    ? unreadCount
                    : notifications.filter(
                        (notification) =>
                          notification.type === item.key &&
                          !notification.read
                      ).length;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setFilter(item.key)
                    }
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}

                    {filterUnreadCount > 0 && (
                      <span
                        className={`ml-2 rounded-full px-1.5 py-0.5 text-[11px] ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-700"
                        }`}
                      >
                        {filterUnreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {/* Logged out */}
        {!loggedIn && !loading && (
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
              <Bell size={26} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              Login করলে Notifications দেখতে পারবেন
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              আপনার Jobs, Marketplace, Business, Social
              Hub, Chat, Wallet এবং অন্যান্য আপডেট এখানে
              দেখা যাবে।
            </p>

            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Login
              <ChevronRight size={17} />
            </Link>
          </div>
        )}

        {/* Logged in */}
        {loggedIn && (
          <>
            {/* Loading */}
            {loading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-24 animate-pulse rounded-2xl bg-white shadow-sm"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-start gap-3">
                  <X
                    className="mt-0.5 shrink-0 text-red-600"
                    size={20}
                  />

                  <div className="min-w-0">
                    <h2 className="font-bold text-red-800">
                      Notification load হয়নি
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-red-700">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={loadNotifications}
                      className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !error &&
              filteredNotifications.length === 0 && (
                <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Bell size={28} />
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-slate-900">
                    No notifications yet
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    নতুন কোনো update, message, job
                    activity বা অন্য কোনো notification এলে
                    এখানে দেখা যাবে।
                  </p>
                </div>
              )}

            {/* Notification list */}
            {!loading &&
              !error &&
              filteredNotifications.length > 0 && (
                <div className="space-y-3">
                  {filteredNotifications.map((item) => {
                    const config =
                      sectorConfig[item.type] ??
                      sectorConfig.system;

                    const Icon = config.icon;

                    const isBusy =
                      busyId === item.id;

                    return (
                      <article
                        key={item.id}
                        className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                          item.read
                            ? "border-slate-200"
                            : "border-blue-200 bg-blue-50/30"
                        }`}
                      >
                        {!item.read && (
                          <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />
                        )}

                        <div className="flex gap-3 p-4 sm:p-5">
                          {/* Main notification */}
                          <button
                            type="button"
                            onClick={() =>
                              openNotification(item)
                            }
                            disabled={isBusy}
                            className="flex min-w-0 flex-1 gap-3 text-left disabled:cursor-wait"
                          >
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                            >
                              <Icon size={20} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3
                                  className={`text-sm font-bold ${
                                    item.read
                                      ? "text-slate-800"
                                      : "text-slate-950"
                                  }`}
                                >
                                  {item.title}
                                </h3>

                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${config.className}`}
                                >
                                  {config.label}
                                </span>

                                {!item.read && (
                                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                                )}
                              </div>

                              {item.message && (
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                  {item.message}
                                </p>
                              )}

                              <div className="mt-2 text-xs font-medium text-slate-400">
                                {item.time}
                              </div>
                            </div>

                            {item.href &&
                              item.href !== "#" && (
                                <ChevronRight
                                  size={18}
                                  className="mt-2 hidden shrink-0 text-slate-400 sm:block"
                                />
                              )}
                          </button>

                          {/* Actions */}
                          <div className="flex shrink-0 items-start gap-1">
                            {!item.read && (
                              <button
                                type="button"
                                title="Mark as read"
                                onClick={() =>
                                  markAsRead(item.id)
                                }
                                disabled={isBusy}
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Check size={17} />
                              </button>
                            )}

                            <button
                              type="button"
                              title="Delete"
                              onClick={() =>
                                deleteNotification(item.id)
                              }
                              disabled={isBusy}
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

            {/* Mobile Mark All */}
            {unreadCount > 0 && (
              <div className="mt-4 flex justify-center sm:hidden">
                <button
                  type="button"
                  onClick={markAllAsRead}
                  disabled={markingAll}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCheck size={17} />

                  {markingAll
                    ? "Updating..."
                    : "Mark all read"}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-6 text-sm text-slate-500">
          <Link
            href="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            href="/status-feed"
            className="transition hover:text-blue-600"
          >
            Social Hub
          </Link>

          <Link
            href="/marketplace"
            className="transition hover:text-blue-600"
          >
            Marketplace
          </Link>

          <Link
            href="/chat"
            className="transition hover:text-blue-600"
          >
            Chat
          </Link>
        </div>
      </footer>
    </main>
  );
}