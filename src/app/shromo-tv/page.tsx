"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileVideo,
  Image as ImageIcon,
  MonitorPlay,
  Pause,
  Play,
  Plus,
  Search,
  Share2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

type MediaType = "video" | "image";

type TVContent = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  media_type: MediaType;
  media_url: string;
  thumbnail_url: string | null;
  published: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

type MenuKey =
  | "overview"
  | "all"
  | "published"
  | "scheduled"
  | "draft"
  | "expired"
  | "upload";

const BUCKET = "shromo-tv";

function getAdminKey() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("shromo_tv_admin_key") || "";
}

function dhakaISO(date: string, time: string) {
  if (!date) return null;

  const safeTime = time || "00:00";

  const value = new Date(`${date}T${safeTime}:00+06:00`);

  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return value.toISOString();
}

function getDhakaParts(value: string | null) {
  if (!value) {
    return {
      date: "",
      time: "",
    };
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(value));

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  const dateValue = `${get("year")}-${get("month")}-${get("day")}`;

  const timeValue = `${get("hour")}:${get("minute")}`;

  return {
    date: dateValue,
    time: timeValue,
  };
}

function getStatus(item: TVContent) {
  const now = Date.now();

  const start = item.starts_at
    ? new Date(item.starts_at).getTime()
    : null;

  const end = item.expires_at
    ? new Date(item.expires_at).getTime()
    : null;

  if (end !== null && !Number.isNaN(end) && end <= now) {
    return "expired";
  }

  if (start !== null && !Number.isNaN(start) && start > now) {
    return "scheduled";
  }

  if (item.published) {
    return "published";
  }

  return "draft";
}

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "shromo-tv"}-${Date.now()}`;
}

function publicStorageUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!base) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  }

  const encodedPath = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${base}/storage/v1/object/public/${BUCKET}/${encodedPath}`;
}

export default function ShromoTVAdminPage() {
  const [items, setItems] = useState<TVContent[]>([]);
  const [menu, setMenu] = useState<MenuKey>("overview");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [adminKey, setAdminKey] = useState("");

  const [showUpload, setShowUpload] = useState(false);
  const [preview, setPreview] = useState<TVContent | null>(null);
  const [fullMonitor, setFullMonitor] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("video");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!url || !key) return null;

    return createClient(url, key);
  }, []);

  useEffect(() => {
    const saved = getAdminKey();

    if (saved) {
      setAdminKey(saved);
      loadContent(saved);
    } else {
      setLoading(false);
    }
  }, []);

  async function loadContent(keyOverride?: string) {
    const key = keyOverride || adminKey;

    if (!key) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/shromo-tv?admin=1", {
        cache: "no-store",
        headers: {
          "x-shromo-admin-key": key,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load SHROMO TV content."
        );
      }

      setItems(Array.isArray(data.content) ? data.content : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load SHROMO TV content."
      );
    } finally {
      setLoading(false);
    }
  }

  function saveKey(value: string) {
    setAdminKey(value);
    localStorage.setItem("shromo_tv_admin_key", value);
  }

  function resetUploadForm() {
    setTitle("");
    setDescription("");
    setMediaType("video");
    setMediaFile(null);
    setThumbnailFile(null);
    setStartDate("");
    setStartTime("");
    setExpiryDate("");
    setExpiryTime("");
  }

  function openUpload() {
    setError("");
    resetUploadForm();
    setShowUpload(true);
  }

  function closeUpload() {
    if (saving) return;
    setShowUpload(false);
  }

  async function createSignedUpload(file: File, type: MediaType) {
    const key = adminKey;

    if (!key) {
      throw new Error("Admin Key দিন।");
    }

    const response = await fetch("/api/shromo-tv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-shromo-admin-key": key,
      },
      body: JSON.stringify({
        action: "create-upload",
        file_name: file.name,
        content_type: file.type,
        media_type: type,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "Unable to create upload URL."
      );
    }

    if (!supabase) {
      throw new Error("Supabase browser configuration is missing.");
    }

    const path = data.path;
    const token = data.token;

    if (!path || !token) {
      throw new Error("Upload information was not returned.");
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .uploadToSignedUrl(path, token, file, {
        contentType: file.type || undefined,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    return {
      path,
      url: publicStorageUrl(path),
    };
  }

  async function handleUpload() {
    if (!title.trim()) {
      setError("Title দিন।");
      return;
    }

    if (!mediaFile) {
      setError("Video অথবা image select করুন।");
      return;
    }

    if (!adminKey) {
      setError("Admin Key দিন।");
      return;
    }

    try {
      setSaving(true);
      setError("");

      saveKey(adminKey);

      const media = await createSignedUpload(mediaFile, mediaType);

      let thumbnailUrl: string | null = null;

      if (thumbnailFile) {
        const thumbnail = await createSignedUpload(
          thumbnailFile,
          "image"
        );

        thumbnailUrl = thumbnail.url;
      }

      const response = await fetch("/api/shromo-tv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-shromo-admin-key": adminKey,
        },
        body: JSON.stringify({
          action: "create-content",
          title: title.trim(),
          slug: makeSlug(title),
          description: description.trim() || null,
          media_type: mediaType,
          media_url: media.url,
          thumbnail_url: thumbnailUrl,
          starts_at: dhakaISO(startDate, startTime),
          expires_at: dhakaISO(expiryDate, expiryTime),
          published: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create SHROMO TV content."
        );
      }

      setShowUpload(false);
      resetUploadForm();

      await loadContent(adminKey);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Upload failed."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish(item: TVContent) {
    if (!adminKey) {
      setError("Admin Key দিন।");
      return;
    }

    try {
      setError("");

      const response = await fetch("/api/shromo-tv", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-shromo-admin-key": adminKey,
        },
        body: JSON.stringify({
          id: item.id,
          published: !item.published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to update publication status."
        );
      }

      await loadContent(adminKey);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update content."
      );
    }
  }

  async function deleteItem(item: TVContent) {
    if (!adminKey) {
      setError("Admin Key দিন।");
      return;
    }

    const confirmed = window.confirm(
      `"${item.title}" delete করতে চান?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch("/api/shromo-tv", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-shromo-admin-key": adminKey,
        },
        body: JSON.stringify({
          id: item.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to delete content."
        );
      }

      if (preview?.id === item.id) {
        setPreview(null);
      }

      await loadContent(adminKey);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete content."
      );
    }
  }

  async function shareItem(item: TVContent) {
    const url = `${window.location.origin}/shromo-tv/${item.slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.description || "SHROMO TV",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("SHROMO TV link copied.");
      }
    } catch {
      // User cancelled share.
    }
  }

  const filteredItems = items.filter((item) => {
    const status = getStatus(item);

    const matchesMenu =
      menu === "overview" ||
      menu === "all" ||
      menu === status;

    const q = search.trim().toLowerCase();

    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      (item.description || "").toLowerCase().includes(q);

    return matchesMenu && matchesSearch;
  });

  const stats = {
    total: items.length,
    published: items.filter(
      (item) => getStatus(item) === "published"
    ).length,
    scheduled: items.filter(
      (item) => getStatus(item) === "scheduled"
    ).length,
    draft: items.filter(
      (item) => getStatus(item) === "draft"
    ).length,
    expired: items.filter(
      (item) => getStatus(item) === "expired"
    ).length,
  };

  const menuItems: {
    key: MenuKey;
    label: string;
    icon: typeof MonitorPlay;
    count?: number;
  }[] = [
    {
      key: "overview",
      label: "Overview",
      icon: MonitorPlay,
    },
    {
      key: "all",
      label: "All Content",
      icon: FileVideo,
      count: stats.total,
    },
    {
      key: "published",
      label: "Published",
      icon: CheckCircle2,
      count: stats.published,
    },
    {
      key: "scheduled",
      label: "Scheduled",
      icon: Clock3,
      count: stats.scheduled,
    },
    {
      key: "draft",
      label: "Draft",
      icon: Pause,
      count: stats.draft,
    },
    {
      key: "expired",
      label: "Expired",
      icon: CalendarDays,
      count: stats.expired,
    },
  ];

  return (
    <main className="min-h-screen bg-[#06152c] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06152c]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/central-admin"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-[0.08em]">
                  SHROMO
                </span>

                <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[8px] font-black tracking-[0.16em] text-cyan-300">
                  TV
                </span>
              </div>

              <p className="text-[10px] text-slate-500">
                Digital Display Management
              </p>
            </div>
          </div>

          <button
            onClick={openUpload}
            className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-orange-950/20 transition hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" />
            Add Content
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[235px_1fr]">
        {/* SIDEBAR */}
        <aside className="hidden border-r border-white/10 lg:block">
          <div className="sticky top-16 p-4">
            <div className="mb-4 px-3">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-600">
                SHROMO TV
              </p>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = menu === item.key;

                return (
                  <button
                    key={item.key}
                    onClick={() => setMenu(item.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition ${
                      active
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-bold">
                        {item.label}
                      </span>
                    </span>

                    {item.count !== undefined && (
                      <span className="text-[10px] font-bold text-slate-600">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="my-5 h-px bg-white/10" />

            <button
              onClick={openUpload}
              className="flex w-full items-center gap-3 rounded-xl border border-dashed border-cyan-400/30 bg-cyan-400/5 px-3 py-3 text-left text-cyan-300 transition hover:bg-cyan-400/10"
            >
              <Upload className="h-4 w-4" />

              <span>
                <span className="block text-xs font-black">
                  Upload Content
                </span>
                <span className="block text-[9px] text-slate-500">
                  Video or image
                </span>
              </span>
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          {/* MOBILE MENU */}
          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = menu === item.key;

              return (
                <button
                  key={item.key}
                  onClick={() => setMenu(item.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-bold ${
                    active
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                      : "border-white/10 bg-white/5 text-slate-400"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* TITLE */}
          <div className="mb-7">
            <p className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400">
              Digital Display
            </p>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              SHROMO TV
            </h1>

            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
              Manage videos and visual content shown on the
              SHROMOBAZAR digital display.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 flex items-start justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
              <span>{error}</span>

              <button
                onClick={() => setError("")}
                className="text-red-300/60 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STATS */}
          <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5">
            <StatCard
              label="Total Content"
              value={stats.total}
              icon={FileVideo}
            />

            <StatCard
              label="Published"
              value={stats.published}
              icon={CheckCircle2}
            />

            <StatCard
              label="Scheduled"
              value={stats.scheduled}
              icon={Clock3}
            />

            <StatCard
              label="Draft"
              value={stats.draft}
              icon={Pause}
            />

            <div className="col-span-2 sm:col-span-1">
              <StatCard
                label="Expired"
                value={stats.expired}
                icon={CalendarDays}
              />
            </div>
          </div>

          {/* MONITOR */}
          <div className="mb-7 rounded-2xl border border-white/10 bg-[#0a1b34] p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-white">
                  Monitor Preview
                </p>
                <p className="mt-1 text-[9px] text-slate-500">
                  Real published content appears here.
                </p>
              </div>

              <button
                onClick={() => setFullMonitor(true)}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-bold text-slate-300 hover:bg-white/10"
              >
                <Eye className="h-3.5 w-3.5" />
                Full Monitor
              </button>
            </div>

            <div className="mx-auto max-w-[780px]">
              <div className="rounded-[1.4rem] border border-slate-600/70 bg-[#111827] p-2 shadow-2xl">
                <div className="rounded-[1rem] border border-slate-800 bg-black p-1.5">
                  <div className="relative aspect-video overflow-hidden rounded-[0.8rem] bg-[#03060a]">
                    {items.filter(
                      (item) => getStatus(item) === "published"
                    ).length > 0 ? (
                      (() => {
                        const live = items.find(
                          (item) => getStatus(item) === "published"
                        );

                        if (!live) return null;

                        return (
                          <>
                            {live.media_type === "video" ? (
                              <video
                                src={live.media_url}
                                poster={
                                  live.thumbnail_url || undefined
                                }
                                autoPlay
                                muted
                                loop
                                playsInline
                                controls={false}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <img
                                src={live.media_url}
                                alt={live.title}
                                className="h-full w-full object-cover"
                              />
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                            <div className="absolute left-4 top-4">
                              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[8px] font-black tracking-[0.16em] text-white backdrop-blur">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                SHROMO TV
                              </span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4">
                              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-cyan-300">
                                Published
                              </p>

                              <h3 className="mt-1 text-base font-black text-white sm:text-xl">
                                {live.title}
                              </h3>
                            </div>
                          </>
                        );
                      })()
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.08),_transparent_60%)]">
                        <div className="text-center">
                          <MonitorPlay className="mx-auto h-9 w-9 text-slate-700" />

                          <p className="mt-3 text-xs font-black text-slate-500">
                            No published content
                          </p>

                          <p className="mt-1 text-[9px] text-slate-700">
                            Publish content to display it here.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex h-8 items-center justify-between px-2">
                  <span className="text-[7px] font-bold tracking-[0.16em] text-slate-600">
                    SMART DIGITAL DISPLAY
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />

                    <span className="text-[7px] font-bold tracking-[0.12em] text-slate-600">
                      ONLINE
                    </span>
                  </div>
                </div>
              </div>

              <div className="mx-auto h-2 w-24 rounded-b-full bg-slate-600/60" />
              <div className="mx-auto h-1 w-36 rounded-full bg-slate-700/50" />
            </div>
          </div>

          {/* SEARCH + LIST */}
          <div className="rounded-2xl border border-white/10 bg-[#081a32]">
            <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black text-white">
                  Content Library
                </p>

                <p className="mt-1 text-[9px] text-slate-600">
                  Real database content only.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-600" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search content..."
                  className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/30"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

                  <p className="mt-3 text-[9px] text-slate-600">
                    Loading...
                  </p>
                </div>
              </div>
            ) : !adminKey ? (
              <AdminKeyEmpty
                value={adminKey}
                onSave={saveKey}
                onUpload={openUpload}
              />
            ) : filteredItems.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center px-6 text-center">
                <div>
                  <MonitorPlay className="mx-auto h-9 w-9 text-slate-700" />

                  <p className="mt-3 text-xs font-black text-slate-500">
                    No content found
                  </p>

                  <p className="mt-1 text-[9px] text-slate-700">
                    Upload real SHROMO TV content to get started.
                  </p>

                  <button
                    onClick={openUpload}
                    className="mt-4 rounded-lg bg-orange-500 px-4 py-2 text-[9px] font-black text-white hover:bg-orange-600"
                  >
                    Upload Content
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredItems.map((item) => {
                  const status = getStatus(item);

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 p-4 transition hover:bg-white/[0.02] sm:flex-row sm:items-center"
                    >
                      <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
                        {item.media_type === "video" ? (
                          item.thumbnail_url ? (
                            <img
                              src={item.thumbnail_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <FileVideo className="h-6 w-6 text-slate-700" />
                            </div>
                          )
                        ) : (
                          <img
                            src={item.media_url}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-xs font-black text-white">
                            {item.title}
                          </h3>

                          <StatusBadge status={status} />
                        </div>

                        <p className="mt-1 line-clamp-1 text-[9px] text-slate-600">
                          {item.description ||
                            "No description provided."}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[8px] font-bold text-slate-700">
                          <span className="uppercase">
                            {item.media_type}
                          </span>

                          {item.starts_at && (
                            <span>
                              Start:{" "}
                              {getDhakaParts(item.starts_at).date}
                            </span>
                          )}

                          {item.expires_at && (
                            <span>
                              Expiry:{" "}
                              {getDhakaParts(item.expires_at).date}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPreview(item)}
                          title="Preview"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => shareItem(item)}
                          title="Share"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => togglePublish(item)}
                          title={
                            item.published
                              ? "Unpublish"
                              : "Publish"
                          }
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                            item.published
                              ? "border-green-400/20 bg-green-400/10 text-green-400"
                              : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                          }`}
                        >
                          {item.published ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => deleteItem(item)}
                          title="Delete"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-400/10 bg-red-400/5 text-red-400/70 hover:bg-red-400/10 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#091b34] shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#091b34]/95 px-5 py-4 backdrop-blur">
              <div>
                <p className="text-sm font-black text-white">
                  Upload SHROMO TV Content
                </p>
                <p className="mt-1 text-[9px] text-slate-600">
                  Upload goes directly to Supabase Storage.
                </p>
              </div>

              <button
                onClick={closeUpload}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* ADMIN KEY */}
              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Admin Key
                </label>

                <input
                  type="password"
                  value={adminKey}
                  onChange={(event) =>
                    saveKey(event.target.value)
                  }
                  placeholder="Enter SHROMO TV admin key"
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                />
              </div>

              {/* TITLE */}
              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Title
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Content title"
                  className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={3}
                  placeholder="Optional description"
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-xs text-white outline-none placeholder:text-slate-700 focus:border-cyan-400/30"
                />
              </div>

              {/* MEDIA TYPE */}
              <div>
                <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Media Type
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaType("video")}
                    className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-[10px] font-black ${
                      mediaType === "video"
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-500"
                    }`}
                  >
                    <FileVideo className="h-4 w-4" />
                    Video
                  </button>

                  <button
                    type="button"
                    onClick={() => setMediaType("image")}
                    className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-[10px] font-black ${
                      mediaType === "image"
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-500"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Image
                  </button>
                </div>
              </div>

              {/* MEDIA FILE */}
              <FileInput
                label={
                  mediaType === "video"
                    ? "Video File"
                    : "Image File"
                }
                accept={
                  mediaType === "video"
                    ? "video/*"
                    : "image/*"
                }
                file={mediaFile}
                onChange={setMediaFile}
              />

              {/* THUMBNAIL */}
              {mediaType === "video" && (
                <FileInput
                  label="Thumbnail (Optional)"
                  accept="image/*"
                  file={thumbnailFile}
                  onChange={setThumbnailFile}
                />
              )}

              {/* SCHEDULE */}
              <div>
                <div className="mb-3">
                  <p className="text-[10px] font-black text-white">
                    Schedule
                  </p>

                  <p className="mt-1 text-[8px] text-slate-700">
                    Leave empty to publish manually later.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[8px] font-bold text-slate-600">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(event) =>
                        setStartDate(event.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[8px] font-bold text-slate-600">
                      Start Time
                    </label>

                    <input
                      type="time"
                      value={startTime}
                      onChange={(event) =>
                        setStartTime(event.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[8px] font-bold text-slate-600">
                      Expiry Date
                    </label>

                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(event) =>
                        setExpiryDate(event.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[8px] font-bold text-slate-600">
                      Expiry Time
                    </label>

                    <input
                      type="time"
                      value={expiryTime}
                      onChange={(event) =>
                        setExpiryTime(event.target.value)
                      }
                      className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-2 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                <button
                  onClick={closeUpload}
                  disabled={saving}
                  className="rounded-lg border border-white/10 bg-white/5 px-5 py-2.5 text-[10px] font-black text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpload}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-[10px] font-black text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      Upload Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#081a32] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs font-black text-white">
                  {preview.title}
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-slate-600">
                  {preview.media_type} • {getStatus(preview)}
                </p>
              </div>

              <button
                onClick={() => setPreview(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-black">
              {preview.media_type === "video" ? (
                <video
                  src={preview.media_url}
                  poster={preview.thumbnail_url || undefined}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="mx-auto max-h-[70vh] w-full object-contain"
                />
              ) : (
                <img
                  src={preview.media_url}
                  alt={preview.title}
                  className="mx-auto max-h-[70vh] w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL MONITOR */}
      {fullMonitor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
          <button
            onClick={() => setFullMonitor(false)}
            className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {items.filter(
            (item) => getStatus(item) === "published"
          ).length > 0 ? (
            (() => {
              const live = items.find(
                (item) => getStatus(item) === "published"
              );

              if (!live) return null;

              return (
                <div className="w-full max-w-[1400px] px-4">
                  <div className="aspect-video overflow-hidden rounded-xl bg-black">
                    {live.media_type === "video" ? (
                      <video
                        src={live.media_url}
                        poster={
                          live.thumbnail_url || undefined
                        }
                        autoPlay
                        muted
                        loop
                        controls
                        playsInline
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <img
                        src={live.media_url}
                        alt={live.title}
                        className="h-full w-full object-contain"
                      />
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-400">
                      SHROMO TV
                    </p>

                    <h2 className="mt-1 text-lg font-black text-white">
                      {live.title}
                    </h2>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="text-center">
              <MonitorPlay className="mx-auto h-12 w-12 text-slate-800" />

              <p className="mt-4 text-sm font-black text-slate-600">
                No published SHROMO TV content
              </p>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof MonitorPlay;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#081a32] p-4">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-600">
          {label}
        </span>

        <Icon className="h-4 w-4 text-slate-700" />
      </div>

      <p className="mt-3 text-2xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    published:
      "border-green-400/20 bg-green-400/10 text-green-400",
    scheduled:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    draft:
      "border-slate-400/10 bg-slate-400/5 text-slate-500",
    expired:
      "border-red-400/20 bg-red-400/10 text-red-400",
  };

  const labels: Record<string, string> = {
    published: "Published",
    scheduled: "Scheduled",
    draft: "Draft",
    expired: "Expired",
  };

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.08em] ${
        styles[status] || styles.draft
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

function FileInput({
  label,
  accept,
  file,
  onChange,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">
        {label}
      </label>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-400/20 hover:bg-white/[0.05]">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
          <Upload className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold text-slate-300">
            {file ? file.name : "Choose file"}
          </p>

          <p className="mt-1 text-[8px] text-slate-700">
            {file
              ? `${(file.size / 1024 / 1024).toFixed(2)} MB`
              : "Click to select"}
          </p>
        </div>

        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) =>
            onChange(event.target.files?.[0] || null)
          }
        />
      </label>
    </div>
  );
}

function AdminKeyEmpty({
  value,
  onSave,
  onUpload,
}: {
  value: string;
  onSave: (value: string) => void;
  onUpload: () => void;
}) {
  const [localKey, setLocalKey] = useState(value);

  return (
    <div className="flex min-h-[260px] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <MonitorPlay className="mx-auto h-10 w-10 text-slate-700" />

        <p className="mt-4 text-sm font-black text-slate-400">
          Admin access required
        </p>

        <p className="mt-1 text-[9px] leading-4 text-slate-700">
          Enter the SHROMO TV admin key to manage content.
        </p>

        <div className="mt-5 flex gap-2">
          <input
            type="password"
            value={localKey}
            onChange={(event) =>
              setLocalKey(event.target.value)
            }
            placeholder="Admin Key"
            className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white outline-none placeholder:text-slate-700"
          />

          <button
            onClick={() => {
              onSave(localKey);

              if (localKey) {
                window.location.reload();
              }
            }}
            className="rounded-lg bg-cyan-500 px-4 text-[9px] font-black text-white hover:bg-cyan-600"
          >
            Connect
          </button>
        </div>

        <button
          onClick={onUpload}
          className="mt-3 text-[9px] font-bold text-slate-600 hover:text-cyan-300"
        >
          Upload Content
        </button>
      </div>
    </div>
  );
}