"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCheck,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Heart,
  MessageCircle,
  Megaphone,
  ShoppingBag,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";

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
  | "entertainment";

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  href: string;
};

type FilterType = "all" | NotificationType;

const sectorConfig: Record<
  NotificationType,
  {
    label: string;
    icon: typeof Bell;
    className: string;
  }
> = {
  job: {
    label: "Jobs",
    icon: BriefcaseBusiness,
    className: "bg-blue-50 text-blue-700",
  },
  marketplace: {
    label: "Marketplace",
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
    icon: CircleDollarSign,
    className: "bg-emerald-50 text-emerald-700",
  },
  review: {
    label: "Reviews",
    icon: Star,
    className: "bg-yellow-50 text-yellow-700",
  },
  system: {
    label: "System",
    icon: ShieldCheck,
    className: "bg-slate-100 text-slate-700",
  },
  promotion: {
    label: "Offers",
    icon: Megaphone,
    className: "bg-violet-50 text-violet-700",
  },
  support: {
    label: "Support",
    icon: ShieldCheck,
    className: "bg-red-50 text-red-700",
  },
  education: {
    label: "Education",
    icon: BriefcaseBusiness,
    className: "bg-indigo-50 text-indigo-700",
  },
  health: {
    label: "Health",
    icon: Heart,
    className: "bg-rose-50 text-rose-700",
  },
  sports: {
    label: "Sports",
    icon: Star,
    className: "bg-green-50 text-green-700",
  },
  entertainment: {
    label: "Entertainment",
    icon: Bell,
    className: "bg-fuchsia-50 text-fuchsia-700",
  },
};

const filterItems: Array<{
  key: FilterType;
  label: string;
}> = [
  { key: "all", label: "All" },
  { key: "job", label: "Jobs" },
  { key: "marketplace", label: "Market" },
  { key: "business", label: "Business" },
  { key: "social", label: "Social" },
  { key: "chat", label: "Chat" },
  { key: "wallet", label: "Wallet" },
  { key: "system", label: "System" },
];

const demoNotifications: NotificationItem[] = [
  {
    id: "demo-job-1",
    type: "job",
    title: "Job activity",
    message:
      "আপনার Jobs section-এর নতুন activity এখানে দেখা যাবে।",
    time: "Now",
    read: false,
    href: "/jobs",
  },
  {
    id: "demo-market-1",
    type: "marketplace",
    title: "Marketplace activity",
    message:
      "Buy, Sell, Shop এবং Marketplace-এর update এখানে থাকবে।",
    time: "Today",
    read: false,
    href: "/marketplace",
  },
  {
    id: "demo-business-1",
    type: "business",
    title: "Business update",
    message:
      "আপনার Shop / Office / Business-এর গুরুত্বপূর্ণ update এখানে থাকবে।",
    time: "Today",
    read: true,
    href: "/global-business",
  },
  {
    id: "demo-social-1",
    type: "social",
    title: "Social Hub",
    message:
      "Post, reaction, comment এবং community activity এখানে আসবে।",
    time: "Today",
    read: true,
    href: "/status-feed",
  },
  {
    id: "demo-chat-1",
    type: "chat",
    title: "Chat messages",
    message:
      "নতুন message বা conversation-এর notification এখানে থাকবে।",
    time: "Today",
    read: true,
    href: "/chat",
  },
  {
    id: "demo-wallet-1",
    type: "wallet",
    title: "Wallet activity",
    message:
      "Payment, transaction এবং wallet-related alert এখানে দেখা যাবে।",
    time: "Today",
    read: true,
    href: "/wallet",
  },
  {
    id: "demo-system-1",
    type: "system",
    title: "Welcome to Shromobazar",
    message:
      "Shromobazar-এর central notification hub প্রস্তুত।",
    time: "Today",
    read: true,
    href: "/my-account",
  },
];

function getErrorMessage(error: unknown) {
  if (!error) return "Unknown error";

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    const item = error as {
      message?: string;
      details?: string;
      hint?: string;
    };

    return [
      item.message,
      item.details,
      item.hint,
    ]
      .filter(Boolean)
      .join(" | ");
  }

  return String(error);
}

function formatTime(value: string) {
  if (value === "Now" || value === "Today") {
    return value;
  }

  try {
    return new Intl.DateTimeFormat("en-BD", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function NotificationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] =
    useState<FilterType>("all");

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(demoNotifications);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (authError) {
          console.warn(
            "Notification auth:",
            getErrorMessage(authError)
          );
        }

        setUserId(user?.id || null);

        /*
         * Notification UI is intentionally independent
         * from a database table for now.
         *
         * Future sector APIs/tables can feed this central
         * notification list without changing the UI.
         */
      } catch (err) {
        if (!mounted) return;

        setError(getErrorMessage(err));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    return notifications.filter(
      (item) => item.type === activeFilter
    );
  }, [notifications, activeFilter]);

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (item) => !item.read
    ).length;
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, read: true }
          : item
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 lg:px-6">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:scale-105"
            aria-label="Home"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-black text-slate-950">
                Notifications
              </h1>

              {unreadCount > 0 && (
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-black text-white">
                  {unreadCount} NEW
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Shromobazar Central Notification Hub
            </p>
          </div>

          <div className="ml-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                <Bell className="h-4 w-4" />
                CENTRAL ALERT SYSTEM
              </div>

              <h2 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                আপনার সব Notification
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Jobs, Marketplace, Business, Social Hub,
                Chat, Wallet এবং Shromobazar-এর অন্যান্য
                sector-এর গুরুত্বপূর্ণ activity এক জায়গায়।
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
        {/* USER STATUS */}
        {!userId && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black text-amber-900">
                  Login করলে আপনার personal notifications
                  দেখা যাবে।
                </p>

                <p className="mt-1 text-xs text-amber-700">
                  এখন আপনি central notification interface
                  দেখতে পারছেন।
                </p>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-amber-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-800"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-800">
              Notification error
            </p>
            <p className="mt-1 break-words text-xs text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* FILTERS */}
        <div className="mb-5 overflow-x-auto">
          <div className="flex min-w-max gap-2">
            {filterItems.map((item) => {
              const active =
                activeFilter === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    setActiveFilter(item.key)
                  }
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    active
                      ? "bg-slate-950 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* NOTIFICATION LIST */}
        <div className="space-y-3">
          {loading ? (
            <>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <div className="flex gap-4">
                    <div className="h-11 w-11 rounded-xl bg-slate-200" />

                    <div className="flex-1">
                      <div className="h-4 w-40 rounded bg-slate-200" />
                      <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                      <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : filteredNotifications.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Bell className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-900">
                No notifications
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                এই category-তে এখন কোনো notification
                নেই।
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const config =
                sectorConfig[notification.type];

              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  className={`group rounded-2xl border bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                    notification.read
                      ? "border-slate-200"
                      : "border-blue-200 bg-blue-50/30"
                  }`}
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${config.className}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`text-sm font-black ${
                                notification.read
                                  ? "text-slate-900"
                                  : "text-slate-950"
                              }`}
                            >
                              {notification.title}
                            </h3>

                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${config.className}`}
                            >
                              {config.label}
                            </span>

                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-blue-600" />
                            )}
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {notification.message}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatTime(notification.time)}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <Link
                          href={notification.href}
                          onClick={() =>
                            markAsRead(notification.id)
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                        >
                          Open
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>

                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() =>
                              markAsRead(notification.id)
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                          >
                            <CheckCheck className="h-3.5 w-3.5" />
                            Mark read
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            removeNotification(
                              notification.id
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* SECTOR MAP */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Bell className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-black text-slate-950">
                Notification Coverage
              </h3>

              <p className="text-xs text-slate-500">
                সব major sector-এর notification এখানেই
                centralize হবে।
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {(
              Object.entries(sectorConfig) as Array<
                [
                  NotificationType,
                  (typeof sectorConfig)[NotificationType]
                ]
              >
            ).map(([type, config]) => {
              const Icon = config.icon;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setActiveFilter(type)
                  }
                  className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:bg-slate-100"
                >
                  <Icon
                    className={`h-4 w-4 ${
                      config.className
                        .split(" ")
                        .find((item) =>
                          item.startsWith("text-")
                        ) || "text-slate-600"
                    }`}
                  />

                  <span className="truncate text-xs font-bold text-slate-700">
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <p className="font-black">
              SHROMOBAZAR
            </p>

            <p className="mt-1 text-xs text-slate-400">
              One identity • One notification hub •
              Connected ecosystem
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              Home
            </Link>

            <Link
              href="/status-feed"
              className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              Social Hub
            </Link>

            <Link
              href="/marketplace"
              className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              Marketplace
            </Link>

            <Link
              href="/chat"
              className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              Chat
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}