"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  BookOpen,
  Brain,
  Clapperboard,
  FileText,
  Lightbulb,
  Music,
  PenLine,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

import { createClient } from "@supabase/supabase-js";

type Creator = {
  id: string;
  name: string;
  phone?: string | null;
  location?: string | null;
  avatar_url?: string | null;
};

type BrainItem = {
  id: string;
  creator_id: string;
  title: string;
  description: string | null;
  category: string;
  item_type: string;
  access_type: string;
  price: number | null;
  license_type: string | null;
  cover_url: string | null;
  status: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  creator: Creator | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

const categories = [
  {
    id: "all",
    label: "All",
    icon: Brain,
  },
  {
    id: "story",
    label: "Stories",
    icon: BookOpen,
  },
  {
    id: "poetry",
    label: "Poetry",
    icon: PenLine,
  },
  {
    id: "script",
    label: "Scripts",
    icon: Clapperboard,
  },
  {
    id: "lyrics",
    label: "Lyrics",
    icon: Music,
  },
  {
    id: "content",
    label: "Content",
    icon: FileText,
  },
  {
    id: "creative_idea",
    label: "Creative Ideas",
    icon: Lightbulb,
  },
  {
    id: "research",
    label: "Research",
    icon: Sparkles,
  },
];

const itemTypeLabel = (type: string) => {
  const found = categories.find((item) => item.id === type);

  return found?.label || "Creative Work";
};

const accessLabel = (type: string) => {
  switch (type) {
    case "free":
      return "Free";

    case "sell":
      return "For Sale";

    case "license":
      return "License";

    case "custom_request":
      return "Custom Request";

    default:
      return "Showcase";
  }
};

export default function ArtOfBrainPage() {
  const [items, setItems] = useState<BrainItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "story",
    accessType: "showcase",
    price: "",
    licenseType: "all_rights_reserved",
  });

  const loadItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("category", category);

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `/api/art-of-brain?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not load creative works."
        );
      }

      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not load creative works."
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadItems();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadItems]);

  const getToken = async () => {
    if (!supabase) {
      throw new Error("Supabase is not configured.");
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      throw new Error(
        "Please login before publishing your creative work."
      );
    }

    return session.access_token;
  };

  const publishWork = async () => {
    try {
      if (!form.title.trim()) {
        setError("Please enter a title.");
        return;
      }

      if (!form.description.trim()) {
        setError("Please describe your creative work.");
        return;
      }

      if (
        (form.accessType === "sell" ||
          form.accessType === "license") &&
        (!form.price || Number(form.price) < 0)
      ) {
        setError("Please enter a valid price.");
        return;
      }

      setSaving(true);
      setError("");
      setSuccess("");

      const token = await getToken();

      const response = await fetch("/api/art-of-brain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: form.category,
          itemType: form.category,
          accessType: form.accessType,
          price:
            form.accessType === "sell" ||
            form.accessType === "license"
              ? form.price
              : null,
          licenseType:
            form.accessType === "sell" ||
            form.accessType === "license"
              ? form.licenseType
              : null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Could not publish your work."
        );
      }

      setSuccess(
        "Your creative work has been published successfully."
      );

      setForm({
        title: "",
        description: "",
        category: "story",
        accessType: "showcase",
        price: "",
        licenseType: "all_rights_reserved",
      });

      setShowCreate(false);

      await loadItems();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not publish your work."
      );
    } finally {
      setSaving(false);
    }
  };

  const openChat = (creatorId: string) => {
    if (!creatorId) return;

    window.location.href = `/chat?userId=${encodeURIComponent(
      creatorId
    )}`;
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-fuchsia-600" />

                <h1 className="text-lg font-black tracking-tight text-[#07152d]">
                  ART OF BRAIN
                </h1>
              </div>

              <p className="text-[11px] font-medium text-slate-500">
                Where ideas become valuable
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setShowCreate(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-fuchsia-700"
          >
            <Plus className="h-4 w-4" />

            <span className="hidden sm:inline">
              Publish Your Work
            </span>

            <span className="sm:hidden">Publish</span>
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero */}

        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-700 via-purple-700 to-indigo-800 p-6 text-white shadow-xl sm:p-8">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <Brain className="h-4 w-4" />
              Creative & Intellectual Marketplace
            </div>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Your Mind Has Value.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              Discover stories, poetry, scripts, lyrics,
              content and creative ideas. Writers and
              creators can showcase, sell or license
              their work.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                Writers
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                Directors
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                Producers
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                Publishers
              </span>
            </div>
          </div>
        </div>

        {/* Search */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search stories, writers, scripts, lyrics..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium outline-none transition focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-100"
            />
          </div>
        </div>

        {/* Categories */}

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const Icon = item.icon;
            const active = category === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-black transition ${
                  active
                    ? "border-fuchsia-600 bg-fuchsia-600 text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-600 hover:border-fuchsia-300 hover:text-fuchsia-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Messages */}

        {success && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {/* Content */}

        <div className="mt-7">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-600">
                Discover
              </p>

              <h3 className="mt-1 text-xl font-black text-[#07152d]">
                Creative Works
              </h3>
            </div>

            <div className="text-xs font-bold text-slate-400">
              {items.length} works
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-3xl bg-slate-200"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <Brain className="mx-auto h-12 w-12 text-slate-300" />

              <h4 className="mt-4 text-lg font-black text-slate-700">
                No creative work found
              </h4>

              <p className="mt-2 text-sm text-slate-400">
                Be the first creator to publish something.
              </p>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setShowCreate(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-3 text-sm font-black text-white"
              >
                <Plus className="h-4 w-4" />
                Publish Your Work
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Cover */}

                  <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-fuchsia-100 via-purple-100 to-indigo-100">
                    {item.cover_url ? (
                      <img
                        src={item.cover_url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Brain className="h-14 w-14 text-fuchsia-400 transition group-hover:scale-110" />
                    )}

                    <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black text-fuchsia-700 shadow-sm">
                      {itemTypeLabel(item.item_type)}
                    </div>

                    <div className="absolute right-3 top-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-black text-white">
                      {accessLabel(item.access_type)}
                    </div>
                  </div>

                  {/* Body */}

                  <div className="p-5">
                    <h4 className="line-clamp-2 text-lg font-black text-[#07152d]">
                      {item.title}
                    </h4>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {item.description ||
                        "Creative work by a Shromobazar creator."}
                    </p>

                    {/* Creator */}

                    <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-fuchsia-100 text-fuchsia-700">
                        {item.creator?.avatar_url ? (
                          <img
                            src={item.creator.avatar_url}
                            alt={item.creator.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Users className="h-4 w-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black text-slate-700">
                          {item.creator?.name || "Creator"}
                        </p>

                        <p className="truncate text-[10px] font-medium text-slate-400">
                          {item.creator?.location ||
                            "Shromobazar Creator"}
                        </p>
                      </div>

                      {item.price !== null &&
                        item.access_type === "sell" && (
                          <div className="text-right">
                            <p className="text-[9px] font-bold text-slate-400">
                              Price
                            </p>

                            <p className="text-sm font-black text-fuchsia-700">
                              ৳{" "}
                              {Number(item.price).toLocaleString(
                                "en-BD"
                              )}
                            </p>
                          </div>
                        )}
                    </div>

                    {/* Actions */}

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          item.creator_id &&
                          openChat(item.creator_id)
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 transition hover:border-fuchsia-300 hover:text-fuchsia-700"
                      >
                        <Send className="h-4 w-4" />
                        Chat Creator
                      </button>

                      {item.access_type === "sell" ||
                      item.access_type === "license" ? (
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              "Purchase and License will connect to the main Marketplace Order + Wallet system."
                            )
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-3 py-2.5 text-xs font-black text-white transition hover:bg-fuchsia-700"
                        >
                          <ShoppingBag className="h-4 w-4" />

                          {item.access_type === "license"
                            ? "License"
                            : "Buy"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              "This creative work is currently available for discovery."
                            )
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
                        >
                          <Star className="h-4 w-4" />
                          View
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Publish Modal */}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-black text-[#07152d]">
                  Publish Your Creative Work
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Let your ideas find their value.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}

            <div className="overflow-y-auto p-5">
              <div className="space-y-4">
                {/* Title */}

                <div>
                  <label className="mb-1.5 block text-xs font-black text-slate-700">
                    Title
                  </label>

                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="e.g. A new Bengali thriller story"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-100"
                  />
                </div>

                {/* Type */}

                <div>
                  <label className="mb-1.5 block text-xs font-black text-slate-700">
                    Type
                  </label>

                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-fuchsia-400"
                  >
                    {categories
                      .filter((item) => item.id !== "all")
                      .map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.label}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Description */}

                <div>
                  <label className="mb-1.5 block text-xs font-black text-slate-700">
                    Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    rows={5}
                    placeholder="Describe your work..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-100"
                  />
                </div>

                {/* Availability */}

                <div>
                  <label className="mb-1.5 block text-xs font-black text-slate-700">
                    Availability
                  </label>

                  <select
                    value={form.accessType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        accessType: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-fuchsia-400"
                  >
                    <option value="showcase">
                      Showcase
                    </option>

                    <option value="free">Free</option>

                    <option value="sell">Sell</option>

                    <option value="license">License</option>

                    <option value="custom_request">
                      Custom Request
                    </option>
                  </select>
                </div>

                {/* Price + Rights */}

                {(form.accessType === "sell" ||
                  form.accessType === "license") && (
                  <>
                    <div>
                      <label className="mb-1.5 block text-xs font-black text-slate-700">
                        Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            price: event.target.value,
                          }))
                        }
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-fuchsia-400"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-black text-slate-700">
                        Rights / License
                      </label>

                      <select
                        value={form.licenseType}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            licenseType:
                              event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-fuchsia-400"
                      >
                        <option value="all_rights_reserved">
                          All Rights Reserved
                        </option>

                        <option value="non_exclusive">
                          Non-exclusive License
                        </option>

                        <option value="exclusive">
                          Exclusive License
                        </option>

                        <option value="full_rights_transfer">
                          Full Rights Transfer
                        </option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Modal Footer */}

            <div className="flex shrink-0 gap-3 border-t border-slate-200 bg-white px-5 py-4">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                disabled={saving}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  saving ||
                  !form.title.trim() ||
                  !form.description.trim()
                }
                onClick={publishWork}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-3 text-sm font-black text-white hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />

                {saving ? "Publishing..." : "Publish Work"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
