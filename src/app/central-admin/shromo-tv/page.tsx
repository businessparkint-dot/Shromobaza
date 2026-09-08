"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarClock,
  Check,
  CheckCircle2,
  ExternalLink,
  FileImage,
  FileVideo,
  Film,
  FolderOpen,
  LayoutDashboard,
  Maximize,
  Minimize2,
  Monitor,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings2,
  Trash2,
  Tv,
  Upload,
  X,
  type LucideIcon,
} from "lucide-react";

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
  | "expired";

type TVMenuItem = {
  key: MenuKey;
  label: string;
  icon: LucideIcon;
  count?: number;
};

const ADMIN_KEY_STORAGE = "shromobazar_central_admin_key";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(
      (
        error as {
          message?: unknown;
        }
      ).message
    );
  }

  return "Unknown error";
}

function dhakaDateTimeToISO(date: string, time: string) {
  if (!date && !time) {
    return null;
  }

  if (!date || !time) {
    throw new Error("Date এবং Time দুটোই নির্বাচন করুন।");
  }

  const value = new Date(`${date}T${time}:00+06:00`);

  if (Number.isNaN(value.getTime())) {
    throw new Error("সঠিক Date এবং Time নির্বাচন করুন।");
  }

  return value.toISOString();
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0980-\u09ff]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base || "shromo-tv"}-${Date.now()}`;
}

function getStatus(item: TVContent) {
  const now = Date.now();

  const start = item.starts_at
    ? new Date(item.starts_at).getTime()
    : null;

  const expiry = item.expires_at
    ? new Date(item.expires_at).getTime()
    : null;

  if (expiry !== null && now >= expiry) {
    return {
      key: "expired" as const,
      label: "Expired",
      className:
        "border-red-200 bg-red-50 text-red-700",
    };
  }

  if (!item.published) {
    return {
      key: "draft" as const,
      label: "Draft",
      className:
        "border-slate-200 bg-slate-100 text-slate-600",
    };
  }

  if (start !== null && now < start) {
    return {
      key: "scheduled" as const,
      label: "Scheduled",
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    };
  }

  return {
    key: "published" as const,
    label: "Live",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
}

export default function CentralAdminShromoTVPage() {
  const [items, setItems] = useState<TVContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeMenu, setActiveMenu] =
    useState<MenuKey>("overview");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedItem, setSelectedItem] =
    useState<TVContent | null>(null);

  const [monitorMode, setMonitorMode] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const [adminKey, setAdminKey] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [mediaType, setMediaType] =
    useState<MediaType>("video");

  const [mediaFile, setMediaFile] =
    useState<File | null>(null);

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const [publishNow, setPublishNow] = useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const thumbnailInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const savedKey = window.localStorage.getItem(
      ADMIN_KEY_STORAGE
    );

    if (savedKey) {
      setAdminKey(savedKey);
    }

    loadContent(savedKey || "");
  }, []);

  useEffect(() => {
    if (!monitorMode) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [monitorMode]);

  async function loadContent(keyOverride?: string) {
    setLoading(true);
    setError("");

    try {
      const key = keyOverride || adminKey;

      const headers: HeadersInit = key
        ? {
            "x-shromo-tv-admin-key": key,
          }
        : {};

      const url = key
        ? "/api/shromo-tv?admin=1"
        : "/api/shromo-tv";

      const response = await fetch(url, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.details ||
            data?.error ||
            "SHROMO TV content load করা যায়নি।"
        );
      }

      setItems(
        Array.isArray(data?.content)
          ? data.content
          : []
      );
    } catch (err) {
      console.error(
        "SHROMO TV LOAD ERROR:",
        err
      );

      setError(
        `Content load করা যায়নি। ${getErrorMessage(
          err
        )}`
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setMediaType("video");
    setMediaFile(null);
    setThumbnailFile(null);
    setStartDate("");
    setStartTime("");
    setExpiryDate("");
    setExpiryTime("");
    setPublishNow(false);
    setUploadProgress("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  }

  function openUpload() {
    setError("");
    setSuccess("");
    resetForm();
    setShowUpload(true);
  }

  function closeUpload() {
    if (saving) {
      return;
    }

    setShowUpload(false);
    resetForm();
  }

  async function createUploadUrl(
    file: File,
    key: string
  ) {
    const response = await fetch(
      "/api/shromo-tv",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-shromo-tv-admin-key": key,
        },
        body: JSON.stringify({
          action: "create-upload",
          fileName: file.name,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.details ||
          data?.error ||
          "Upload URL তৈরি করা যায়নি।"
      );
    }

    return data as {
      path: string;
      token: string;
      signedUrl: string;
      publicUrl: string;
    };
  }

  async function uploadToSupabase(
    file: File,
    key: string
  ) {
    const upload = await createUploadUrl(
      file,
      key
    );

    setUploadProgress(
      `Uploading ${file.name}...`
    );

    const response = await fetch(
      upload.signedUrl,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            file.type ||
            "application/octet-stream",
        },
        body: file,
      }
    );

    if (!response.ok) {
      const text = await response.text();

      throw new Error(
        text ||
          `Storage upload failed (${response.status}).`
      );
    }

    return upload.publicUrl;
  }

  async function handleUpload(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const key = adminKey.trim();

    if (!key) {
      setError("Admin Key দিন।");
      return;
    }

    if (!title.trim()) {
      setError("Content title দিন।");
      return;
    }

    if (!mediaFile) {
      setError(
        "Video অথবা Image নির্বাচন করুন।"
      );
      return;
    }

    if (
      mediaType === "video" &&
      !mediaFile.type.startsWith("video/")
    ) {
      setError(
        "Media Type Video হলে video file নির্বাচন করুন।"
      );
      return;
    }

    if (
      mediaType === "image" &&
      !mediaFile.type.startsWith("image/")
    ) {
      setError(
        "Media Type Image হলে image file নির্বাচন করুন।"
      );
      return;
    }

    let startsAt: string | null = null;
    let expiresAt: string | null = null;

    try {
      startsAt = dhakaDateTimeToISO(
        startDate,
        startTime
      );

      expiresAt = dhakaDateTimeToISO(
        expiryDate,
        expiryTime
      );

      if (startsAt && expiresAt) {
        if (
          new Date(expiresAt).getTime() <=
          new Date(startsAt).getTime()
        ) {
          setError(
            "Expiry Date & Time অবশ্যই Start Date & Time-এর পরে হতে হবে।"
          );
          return;
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
      return;
    }

    setSaving(true);

    try {
      window.localStorage.setItem(
        ADMIN_KEY_STORAGE,
        key
      );

      const mediaUrl =
        await uploadToSupabase(
          mediaFile,
          key
        );

      let thumbnailUrl: string | null =
        null;

      if (
        mediaType === "video" &&
        thumbnailFile
      ) {
        thumbnailUrl =
          await uploadToSupabase(
            thumbnailFile,
            key
          );
      }

      setUploadProgress(
        "Saving SHROMO TV content..."
      );

      const response = await fetch(
        "/api/shromo-tv",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            "x-shromo-tv-admin-key":
              key,
          },
          body: JSON.stringify({
            action: "create-content",
            title: title.trim(),
            slug: makeSlug(title),
            description:
              description.trim() ||
              null,
            media_type: mediaType,
            media_url: mediaUrl,
            thumbnail_url:
              thumbnailUrl,
            starts_at: startsAt,
            expires_at: expiresAt,
            published: publishNow,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.details ||
            data?.error ||
            "Content save করা যায়নি।"
        );
      }

      setSuccess(
        publishNow
          ? "SHROMO TV content publish হয়েছে।"
          : "SHROMO TV content draft হিসেবে save হয়েছে।"
      );

      setShowUpload(false);
      resetForm();

      await loadContent(key);
    } catch (err) {
      console.error(
        "SHROMO TV UPLOAD ERROR:",
        err
      );

      setError(
        `Upload করা যায়নি। ${getErrorMessage(
          err
        )}`
      );
    } finally {
      setSaving(false);
      setUploadProgress("");
    }
  }

  async function togglePublish(
    item: TVContent
  ) {
    setError("");
    setSuccess("");

    const key = adminKey.trim();

    if (!key) {
      setError(
        "Publish/Unpublish করার আগে Admin Key দিন।"
      );
      return;
    }

    try {
      const response = await fetch(
        "/api/shromo-tv",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
            "x-shromo-tv-admin-key":
              key,
          },
          body: JSON.stringify({
            id: item.id,
            published: !item.published,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.details ||
            data?.error ||
            "Publish status change করা যায়নি।"
        );
      }

      setSuccess(
        item.published
          ? "Content unpublished হয়েছে।"
          : "Content published হয়েছে."
      );

      await loadContent(key);
    } catch (err) {
      setError(
        `Status change করা যায়নি। ${getErrorMessage(
          err
        )}`
      );
    }
  }

  async function deleteItem(
    item: TVContent
  ) {
    setError("");
    setSuccess("");

    const key = adminKey.trim();

    if (!key) {
      setError(
        "Delete করার আগে Admin Key দিন।"
      );
      return;
    }

    const confirmed = window.confirm(
      `আপনি কি "${item.title}" delete করতে চান?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "/api/shromo-tv",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
            "x-shromo-tv-admin-key":
              key,
          },
          body: JSON.stringify({
            id: item.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.details ||
            data?.error ||
            "Content delete করা যায়নি।"
        );
      }

      if (
        selectedItem?.id === item.id
      ) {
        setSelectedItem(null);
      }

      setSuccess(
        "Content delete হয়েছে।"
      );

      await loadContent(key);
    } catch (err) {
      setError(
        `Delete করা যায়নি। ${getErrorMessage(
          err
        )}`
      );
    }
  }

  function openPreview(
    item: TVContent
  ) {
    setSelectedItem(item);
    setMonitorMode(false);
    setError("");
    setSuccess("");
  }

  function openFullMonitor() {
    if (!selectedItem) {
      setError(
        "আগে একটি content Preview করুন।"
      );
      return;
    }

    setMonitorMode(true);
  }

  const filteredItems = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    let result = [...items];

    if (
      activeMenu === "published"
    ) {
      result = result.filter(
        (item) =>
          getStatus(item).key ===
          "published"
      );
    }

    if (
      activeMenu === "scheduled"
    ) {
      result = result.filter(
        (item) =>
          getStatus(item).key ===
          "scheduled"
      );
    }

    if (
      activeMenu === "draft"
    ) {
      result = result.filter(
        (item) =>
          getStatus(item).key ===
          "draft"
      );
    }

    if (
      activeMenu === "expired"
    ) {
      result = result.filter(
        (item) =>
          getStatus(item).key ===
          "expired"
      );
    }

    if (query) {
      result = result.filter(
        (item) =>
          [
            item.title,
            item.slug,
            item.description || "",
            item.media_type,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
      );
    }

    return result;
  }, [
    items,
    activeMenu,
    searchTerm,
  ]);

  const stats = useMemo(() => {
    let published = 0;
    let scheduled = 0;
    let draft = 0;
    let expired = 0;

    items.forEach((item) => {
      const key = getStatus(item).key;

      if (key === "published") {
        published++;
      }

      if (key === "scheduled") {
        scheduled++;
      }

      if (key === "draft") {
        draft++;
      }

      if (key === "expired") {
        expired++;
      }
    });

    return {
      total: items.length,
      published,
      scheduled,
      draft,
      expired,
    };
  }, [items]);

  const menuItems: TVMenuItem[] = [
    {
      key: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      key: "all",
      label: "All Content",
      icon: FolderOpen,
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
      icon: CalendarClock,
      count: stats.scheduled,
    },
    {
      key: "draft",
      label: "Draft",
      icon: Film,
      count: stats.draft,
    },
    {
      key: "expired",
      label: "Expired",
      icon: CalendarClock,
      count: stats.expired,
    },
  ];

  function handleMenuClick(
    key: MenuKey
  ) {
    setActiveMenu(key);
    setError("");
    setSuccess("");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/central-admin"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07152d] text-white">
                <Tv className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-sm font-black text-[#07152d] sm:text-base">
                    SHROMO TV
                  </h1>

                  <span className="hidden rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-orange-700 sm:inline-flex">
                    Central Admin
                  </span>
                </div>

                <p className="truncate text-[10px] text-slate-500 sm:text-xs">
                  Digital Display & Content Control
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() =>
                loadContent()
              }
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                className={
                  loading
                    ? "h-4 w-4 animate-spin"
                    : "h-4 w-4"
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <button
              type="button"
              onClick={openUpload}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#07152d] px-3 text-xs font-black text-white shadow-sm hover:bg-[#10254a] sm:px-4"
            >
              <Plus className="h-4 w-4" />
              Add Content
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* MENU */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-1 overflow-x-auto p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active =
                activeMenu ===
                item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    handleMenuClick(
                      item.key
                    )
                  }
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                    active
                      ? "bg-[#07152d] text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  {item.label}

                  {typeof item.count ===
                    "number" && (
                    <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-black">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={openUpload}
              className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-black text-orange-700 hover:bg-orange-100"
            >
              <Upload className="h-4 w-4" />
              Upload
            </button>
          </div>
        </div>

        {/* ALERT */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <X className="mt-0.5 h-5 w-5" />

            <p className="flex-1">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5" />

            <p className="flex-1">
              {success}
            </p>

            <button
              type="button"
              onClick={() =>
                setSuccess("")
              }
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* STATS */}
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(
            [
              [
                "Total",
                stats.total,
                FolderOpen,
              ],
              [
                "Published",
                stats.published,
                CheckCircle2,
              ],
              [
                "Scheduled",
                stats.scheduled,
                CalendarClock,
              ],
              [
                "Draft",
                stats.draft,
                Film,
              ],
              [
                "Expired",
                stats.expired,
                CalendarClock,
              ],
            ] as [
              string,
              number,
              LucideIcon
            ][]
          ).map(
            ([label, value, Icon]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>

                    <p className="mt-1 text-2xl font-black text-[#07152d]">
                      {value}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )
          )}
        </section>

        {/* MONITOR */}
        <section className="mt-5 overflow-hidden rounded-3xl border border-slate-800 bg-[#020617] shadow-2xl">
          <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Monitor className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white">
                  Smart TV Monitor
                </p>

                <p className="text-[10px] text-slate-400">
                  16:9 Digital Display Preview
                </p>
              </div>
            </div>

            {selectedItem && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedItem(
                      null
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>

                <button
                  type="button"
                  onClick={
                    openFullMonitor
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-black text-white"
                >
                  <Maximize className="h-4 w-4" />
                  Full Monitor
                </button>
              </div>
            )}
          </div>

          <div className="p-3 sm:p-5">
            <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.25rem] border-[6px] border-[#111827] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
              <div className="relative aspect-video overflow-hidden bg-black">
                {selectedItem ? (
                  selectedItem.media_type ===
                  "video" ? (
                    <video
                      key={
                        selectedItem.media_url
                      }
                      src={
                        selectedItem.media_url
                      }
                      poster={
                        selectedItem.thumbnail_url ||
                        undefined
                      }
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <img
                      src={
                        selectedItem.media_url
                      }
                      alt={
                        selectedItem.title
                      }
                      className="h-full w-full object-contain"
                    />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
                        <Tv className="h-8 w-8" />
                      </div>

                      <p className="mt-4 text-sm font-bold text-slate-300">
                        Preview Content
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Content list থেকে Preview নির্বাচন করুন
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex h-8 items-center justify-between border-t border-white/10 bg-[#0b1220] px-3">
                <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                  SHROMO TV
                </span>

                <span className="text-[8px] text-slate-500">
                  16:9 • Monitor
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* TOOLBAR */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-[#07152d]">
                {activeMenu ===
                "overview"
                  ? "SHROMO TV Content"
                  : menuItems.find(
                      (item) =>
                        item.key ===
                        activeMenu
                    )?.label}
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                Real database content only
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={
                    searchTerm
                  }
                  onChange={(event) =>
                    setSearchTerm(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search content..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-orange-400 focus:bg-white sm:w-64"
                />
              </div>

              <button
                type="button"
                onClick={openUpload}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-xs font-black text-white hover:bg-orange-600"
              >
                <Upload className="h-4 w-4" />
                Add Content
              </button>
            </div>
          </div>
        </section>

        {/* CONTENT LIST */}
        <section className="mt-4">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <RefreshCw className="mx-auto h-7 w-7 animate-spin text-slate-400" />

              <p className="mt-3 text-sm font-bold text-slate-600">
                Loading SHROMO TV...
              </p>
            </div>
          ) : filteredItems.length ===
            0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <FolderOpen className="h-7 w-7" />
              </div>

              <p className="mt-4 text-sm font-black text-slate-700">
                No content found
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Database-এ matching SHROMO TV content নেই।
              </p>

              <button
                type="button"
                onClick={openUpload}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#07152d] px-4 py-2.5 text-xs font-black text-white"
              >
                <Plus className="h-4 w-4" />
                Add First Content
              </button>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredItems.map(
                (item) => {
                  const status =
                    getStatus(item);

                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="grid md:grid-cols-[220px_1fr]">
                        <div className="relative aspect-video overflow-hidden bg-slate-950 md:aspect-auto">
                          {item.media_type ===
                          "video" ? (
                            <video
                              src={
                                item.media_url
                              }
                              poster={
                                item.thumbnail_url ||
                                undefined
                              }
                              muted
                              playsInline
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <img
                              src={
                                item.media_url
                              }
                              alt={
                                item.title
                              }
                              className="h-full w-full object-cover"
                            />
                          )}

                          <div className="absolute left-2 top-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[8px] font-black uppercase text-white">
                              {item.media_type ===
                              "video" ? (
                                <FileVideo className="h-3 w-3" />
                              ) : (
                                <FileImage className="h-3 w-3" />
                              )}

                              {item.media_type}
                            </span>
                          </div>
                        </div>

                        <div className="flex min-w-0 flex-col p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-black text-[#07152d]">
                                {item.title}
                              </h3>

                              <p className="mt-1 truncate text-[10px] text-slate-400">
                                /{item.slug}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-black ${status.className}`}
                            >
                              {
                                status.label
                              }
                            </span>
                          </div>

                          {item.description && (
                            <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                              {
                                item.description
                              }
                            </p>
                          )}

                          <div className="mt-4 grid grid-cols-2 gap-2 text-[9px]">
                            <div className="rounded-xl bg-slate-50 p-2.5">
                              <p className="font-bold uppercase text-slate-400">
                                Start
                              </p>

                              <p className="mt-1 font-bold text-slate-700">
                                {formatDateTime(
                                  item.starts_at
                                )}
                              </p>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-2.5">
                              <p className="font-bold uppercase text-slate-400">
                                Expiry
                              </p>

                              <p className="mt-1 font-bold text-slate-700">
                                {formatDateTime(
                                  item.expires_at
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto flex flex-wrap gap-2 pt-4">
                            <button
                              type="button"
                              onClick={() =>
                                openPreview(
                                  item
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#07152d] px-3 py-2 text-[10px] font-black text-white"
                            >
                              <Check className="hidden" />
                              <svg
                                viewBox="0 0 24 24"
                                className="h-3.5 w-3.5 fill-current"
                                aria-hidden="true"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              Preview
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                togglePublish(
                                  item
                                )
                              }
                              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-black ${
                                item.published
                                  ? "border-orange-200 bg-orange-50 text-orange-700"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {item.published ? (
                                <>
                                  <X className="h-3.5 w-3.5" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  Publish
                                </>
                              )}
                            </button>

                            <a
                              href={
                                item.media_url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-black text-slate-600"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Open
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                deleteItem(
                                  item
                                )
                              }
                              className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[10px] font-black text-red-700"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </div>

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-6">
          <div className="mx-auto my-4 max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">
                  SHROMO TV
                </p>

                <h2 className="mt-1 text-lg font-black text-[#07152d]">
                  Add TV Content
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Real video/image upload করুন এবং schedule করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={closeUpload}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleUpload}
              className="space-y-5 p-5 sm:p-6"
            >
              {/* ADMIN KEY */}
              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <Settings2 className="mt-0.5 h-5 w-5 text-orange-600" />

                  <div className="flex-1">
                    <label className="text-xs font-black text-orange-900">
                      Admin Key
                    </label>

                    <input
                      type="password"
                      value={
                        adminKey
                      }
                      onChange={(
                        event
                      ) =>
                        setAdminKey(
                          event.target
                            .value
                        )
                      }
                      placeholder="Central Admin Key"
                      className="mt-2 h-11 w-full rounded-xl border border-orange-200 bg-white px-3 text-sm outline-none focus:border-orange-500"
                    />

                    <p className="mt-2 text-[10px] text-orange-800">
                      Browser-এ localStorage-এ save থাকবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* TITLE */}
              <div>
                <label className="text-xs font-black text-slate-700">
                  Content Title *
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target
                        .value
                    )
                  }
                  placeholder="TV content title"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-orange-400 focus:bg-white"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-xs font-black text-slate-700">
                  Description
                </label>

                <textarea
                  value={
                    description
                  }
                  onChange={(event) =>
                    setDescription(
                      event.target
                        .value
                    )
                  }
                  rows={3}
                  placeholder="Optional description"
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:bg-white"
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="text-xs font-black text-slate-700">
                  Media Type *
                </label>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(
                    [
                      [
                        "video",
                        "Video",
                        FileVideo,
                      ],
                      [
                        "image",
                        "Image",
                        FileImage,
                      ],
                    ] as const
                  ).map(
                    ([
                      type,
                      label,
                      Icon,
                    ]) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setMediaType(
                            type
                          )
                        }
                        className={`flex items-center gap-3 rounded-xl border p-3 text-left ${
                          mediaType ===
                          type
                            ? "border-orange-400 bg-orange-50"
                            : "border-slate-200"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            mediaType ===
                            type
                              ? "bg-orange-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-xs font-black">
                            {label}
                          </p>

                          <p className="text-[10px] text-slate-500">
                            {type ===
                            "video"
                              ? "MP4 / WebM"
                              : "JPG / PNG / WebP"}
                          </p>
                        </div>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* MEDIA */}
              <div>
                <label className="text-xs font-black text-slate-700">
                  {mediaType ===
                  "video"
                    ? "Video File *"
                    : "Image File *"}
                </label>

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept={
                    mediaType ===
                    "video"
                      ? "video/*"
                      : "image/*"
                  }
                  onChange={(event) =>
                    setMediaFile(
                      event.target
                        .files?.[0] ||
                        null
                    )
                  }
                  className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                />

                {mediaFile && (
                  <p className="mt-2 text-[10px] font-semibold text-emerald-700">
                    Selected:{" "}
                    {
                      mediaFile.name
                    }
                  </p>
                )}
              </div>

              {/* THUMBNAIL */}
              {mediaType ===
                "video" && (
                <div>
                  <label className="text-xs font-black text-slate-700">
                    Thumbnail{" "}
                    <span className="font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>

                  <input
                    ref={
                      thumbnailInputRef
                    }
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setThumbnailFile(
                        event.target
                          .files?.[0] ||
                          null
                      )
                    }
                    className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs"
                  />
                </div>
              )}

              {/* SCHEDULE */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-orange-600" />

                  <div>
                    <p className="text-xs font-black">
                      Schedule
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Bangladesh Time (UTC+6)
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Start
                    </p>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={
                          startDate
                        }
                        onChange={(event) =>
                          setStartDate(
                            event.target
                              .value
                          )
                        }
                        className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs"
                      />

                      <input
                        type="time"
                        value={
                          startTime
                        }
                        onChange={(event) =>
                          setStartTime(
                            event.target
                              .value
                          )
                        }
                        className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Expiry
                    </p>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={
                          expiryDate
                        }
                        onChange={(event) =>
                          setExpiryDate(
                            event.target
                              .value
                          )
                        }
                        className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs"
                      />

                      <input
                        type="time"
                        value={
                          expiryTime
                        }
                        onChange={(event) =>
                          setExpiryTime(
                            event.target
                              .value
                          )
                        }
                        className="h-10 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PUBLISH */}
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <input
                  type="checkbox"
                  checked={
                    publishNow
                  }
                  onChange={(event) =>
                    setPublishNow(
                      event.target
                        .checked
                    )
                  }
                  className="mt-0.5 h-4 w-4 accent-orange-500"
                />

                <span>
                  <span className="block text-xs font-black">
                    Publish immediately
                  </span>

                  <span className="mt-1 block text-[10px] text-slate-500">
                    Start time থাকলে নির্ধারিত সময়ের আগে Scheduled থাকবে।
                  </span>
                </span>
              </label>

              {/* PROGRESS */}
              {saving &&
                uploadProgress && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs font-bold text-blue-700">
                    {
                      uploadProgress
                    }
                  </div>
                )}

              {/* ACTION */}
              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeUpload
                  }
                  disabled={saving}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-xs font-black text-slate-700 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#07152d] px-5 text-xs font-black text-white disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {publishNow
                        ? "Publish Content"
                        : "Save Draft"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL MONITOR */}
      {monitorMode &&
        selectedItem && (
          <div className="fixed inset-0 z-[200] flex flex-col bg-black">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#050b16] px-3 py-2 sm:px-5">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <Tv className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-white">
                    SHROMO TV
                  </p>

                  <p className="truncate text-[9px] text-slate-500">
                    {
                      selectedItem.title
                    }
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMonitorMode(
                    false
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-white"
              >
                <Minimize2 className="h-4 w-4" />

                <span className="hidden sm:inline">
                  Exit Monitor
                </span>
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center p-2 sm:p-5">
              <div className="relative w-full max-w-[1600px] overflow-hidden rounded-2xl border-[6px] border-[#151a24] bg-black shadow-2xl">
                <div className="relative aspect-video overflow-hidden bg-black">
                  {selectedItem.media_type ===
                  "video" ? (
                    <video
                      key={
                        selectedItem.media_url
                      }
                      src={
                        selectedItem.media_url
                      }
                      poster={
                        selectedItem.thumbnail_url ||
                        undefined
                      }
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <img
                      src={
                        selectedItem.media_url
                      }
                      alt={
                        selectedItem.title
                      }
                      className="h-full w-full object-contain"
                    />
                  )}

                  <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-white">
                    SHROMO TV
                  </div>
                </div>

                <div className="flex h-7 items-center justify-between bg-[#080d16] px-3">
                  <span className="text-[8px] font-black uppercase text-slate-500">
                    Digital Display
                  </span>

                  <span className="text-[8px] text-slate-600">
                    16:9
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
    </main>
  );
}