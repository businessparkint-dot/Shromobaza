"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Grid3X3,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Settings,
  Share2,
  ShoppingBag,
  Store,
  Tag,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import { supabase } from "@/lib/client";

/* =========================================================
   TYPES
========================================================= */

type BusinessType = "shop" | "office";

type PostType =
  | "sell"
  | "buy"
  | "job"
  | "update"
  | "event";

type PostVisibility =
  | "public"
  | "network"
  | "private";

type PostStatus =
  | "draft"
  | "published"
  | "archived"
  | "deleted";

type Business = {
  id: string;
  owner_id: string;
  business_type: BusinessType;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  district: string | null;
  website_url: string | null;
  is_public: boolean;
  is_verified: boolean;
  verification_level: string;
  status: string;
  created_at: string;
  updated_at: string;
};

type BusinessService = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_from: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type BusinessPost = {
  id: string;
  business_id: string;
  author_id: string;
  post_type: PostType;
  caption: string | null;
  visibility: PostVisibility;
  status: PostStatus;
  created_at: string;
  updated_at: string;
};

type BusinessSettings = {
  id: string;
  business_id: string;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  show_products: boolean;
  show_services: boolean;
  show_contact: boolean;
  showroom_layout: string | null;
  created_at: string;
  updated_at: string;
};

type NavigationItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type DashboardItem = {
  label: string;
  value: string;
  icon: LucideIcon;
};

/* =========================================================
   HELPERS
========================================================= */

function getErrorMessage(error: unknown): string {
  if (!error) {
    return "Unknown error";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object") {
    const item = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    return (
      item.message ||
      item.details ||
      item.hint ||
      item.code ||
      "Unknown error"
    );
  }

  return "Unknown error";
}

function formatDate(value: string): string {
  try {
    return new Intl.DateTimeFormat("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function formatPrice(value: number | null): string {
  if (value === null || Number.isNaN(value)) {
    return "Contact";
  }

  return `৳${value.toLocaleString("en-BD")}`;
}

function businessLabel(
  type: BusinessType
): string {
  return type === "shop" ? "SHOP" : "OFFICE";
}

function businessTitle(
  type: BusinessType
): string {
  return type === "shop"
    ? "Digital Shop"
    : "Business Office";
}

/* =========================================================
   BUSINESS ICON
========================================================= */

function BusinessIcon({
  type,
  className = "h-6 w-6",
}: {
  type: BusinessType;
  className?: string;
}) {
  if (type === "shop") {
    return <Store className={className} />;
  }

  return <Building2 className={className} />;
}

/* =========================================================
   POST TYPE
========================================================= */

function postTypeLabel(type: PostType): string {
  switch (type) {
    case "sell":
      return "Offer";

    case "buy":
      return "Buy Request";

    case "job":
      return "Job";

    case "event":
      return "Event";

    default:
      return "Business Update";
  }
}

/* =========================================================
   POST ICON
========================================================= */

function PostTypeIcon({
  type,
}: {
  type: PostType;
}) {
  if (type === "sell") {
    return <Package className="h-4 w-4" />;
  }

  if (type === "buy") {
    return <ShoppingBag className="h-4 w-4" />;
  }

  if (type === "job") {
    return <BriefcaseBusiness className="h-4 w-4" />;
  }

  if (type === "event") {
    return <Clock3 className="h-4 w-4" />;
  }

  return <Share2 className="h-4 w-4" />;
}

/* =========================================================
   PAGE
========================================================= */

export default function EmartBusinessPage() {
  const params = useParams();

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
        ? params.slug[0]
        : "";

  const [business, setBusiness] =
    useState<Business | null>(null);

  const [services, setServices] =
    useState<BusinessService[]>([]);

  const [posts, setPosts] =
    useState<BusinessPost[]>([]);

  const [settings, setSettings] =
    useState<BusinessSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [pageError, setPageError] =
    useState("");

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [showPostModal, setShowPostModal] =
    useState(false);

  const [savingPost, setSavingPost] =
    useState(false);

  const [postType, setPostType] =
    useState<PostType>("update");

  const [postCaption, setPostCaption] =
    useState("");

  const [activeSection, setActiveSection] =
    useState("home");

  /* =======================================================
     LOAD BUSINESS
  ======================================================= */

  const loadBusiness = useCallback(
    async () => {
      if (!slug) {
        return;
      }

      setLoading(true);
      setPageError("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setCurrentUserId(
          user?.id ?? null
        );

        const {
          data: businessData,
          error: businessError,
        } = await supabase
          .from("businesses")
          .select(
            `
              id,
              owner_id,
              business_type,
              name,
              slug,
              tagline,
              description,
              logo_url,
              cover_url,
              phone,
              email,
              address,
              city,
              district,
              website_url,
              is_public,
              is_verified,
              verification_level,
              status,
              created_at,
              updated_at
            `
          )
          .eq("slug", slug)
          .eq("is_public", true)
          .eq("status", "active")
          .maybeSingle();

        if (businessError) {
          throw businessError;
        }

        if (!businessData) {
          setBusiness(null);
          setServices([]);
          setPosts([]);
          setSettings(null);
          setPageError(
            "এই business/storefront পাওয়া যায়নি।"
          );
          return;
        }

        const loadedBusiness =
          businessData as Business;

        setBusiness(loadedBusiness);

        /* SERVICES */

        const {
          data: serviceData,
          error: serviceError,
        } = await supabase
          .from("business_services")
          .select(
            `
              id,
              business_id,
              name,
              description,
              image_url,
              price_from,
              is_active,
              created_at,
              updated_at
            `
          )
          .eq(
            "business_id",
            loadedBusiness.id
          )
          .eq("is_active", true)
          .order("created_at", {
            ascending: false,
          });

        if (!serviceError) {
          setServices(
            (serviceData ||
              []) as BusinessService[]
          );
        } else {
          setServices([]);
        }

        /* POSTS */

        const {
          data: postData,
          error: postError,
        } = await supabase
          .from("business_posts")
          .select(
            `
              id,
              business_id,
              author_id,
              post_type,
              caption,
              visibility,
              status,
              created_at,
              updated_at
            `
          )
          .eq(
            "business_id",
            loadedBusiness.id
          )
          .eq("status", "published")
          .order("created_at", {
            ascending: false,
          })
          .limit(20);

        if (!postError) {
          setPosts(
            (postData ||
              []) as BusinessPost[]
          );
        } else {
          setPosts([]);
        }

        /* SETTINGS */

        const {
          data: settingsData,
          error: settingsError,
        } = await supabase
          .from("business_settings")
          .select(
            `
              id,
              business_id,
              primary_color,
              secondary_color,
              accent_color,
              show_products,
              show_services,
              show_contact,
              showroom_layout,
              created_at,
              updated_at
            `
          )
          .eq(
            "business_id",
            loadedBusiness.id
          )
          .maybeSingle();

        if (!settingsError && settingsData) {
          setSettings(
            settingsData as BusinessSettings
          );
        } else {
          setSettings(null);
        }
      } catch (error) {
        console.error(
          "Emart business load error:",
          error
        );

        setPageError(
          getErrorMessage(error)
        );
      } finally {
        setLoading(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    void loadBusiness();
  }, [loadBusiness]);

  /* =======================================================
     BUSINESS OWNER
  ======================================================= */

  const isOwner =
    Boolean(
      business &&
        currentUserId &&
        business.owner_id === currentUserId
    );

  /* =======================================================
     COLORS
  ======================================================= */

  const primaryColor =
    settings?.primary_color ||
    "#0f172a";

  const secondaryColor =
    settings?.secondary_color ||
    "#f8fafc";

  const accentColor =
    settings?.accent_color ||
    "#16a34a";

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigation: NavigationItem[] =
    useMemo(() => {
      if (business?.business_type === "shop") {
        return [
          {
            id: "home",
            label: "Home",
            icon: Store,
          },
          {
            id: "products",
            label: "Products",
            icon: Package,
          },
          {
            id: "services",
            label: "Services",
            icon: ShoppingBag,
          },
          {
            id: "posts",
            label: "Updates",
            icon: Share2,
          },
          {
            id: "contact",
            label: "Contact",
            icon: MessageCircle,
          },
        ];
      }

      return [
        {
          id: "home",
          label: "Home",
          icon: Building2,
        },
        {
          id: "about",
          label: "About",
          icon: Building2,
        },
        {
          id: "services",
          label: "Services",
          icon: BriefcaseBusiness,
        },
        {
          id: "posts",
          label: "Updates",
          icon: Share2,
        },
        {
          id: "contact",
          label: "Contact",
          icon: MessageCircle,
        },
      ];
    }, [business]);

  /* =======================================================
     DASHBOARD
  ======================================================= */

  const dashboardItems: DashboardItem[] =
    useMemo(
      () => [
        {
          label: "Services",
          value: String(services.length),
          icon: BriefcaseBusiness,
        },
        {
          label: "Updates",
          value: String(posts.length),
          icon: Share2,
        },
        {
          label: "Status",
          value: "Active",
          icon: CheckCircle2,
        },
      ],
      [services.length, posts.length]
    );

  /* =======================================================
     SCROLL
  ======================================================= */

  function scrollToSection(
    id: string
  ) {
    setActiveSection(id);

    const element =
      document.getElementById(id);

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  /* =======================================================
     CREATE BUSINESS POST
  ======================================================= */

  async function handleCreatePost(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!business) {
      return;
    }

    if (!currentUserId) {
      alert(
        "Post করার জন্য আগে login করুন।"
      );
      return;
    }

    if (!isOwner) {
      alert(
        "শুধু business owner post করতে পারবেন।"
      );
      return;
    }

    if (!postCaption.trim()) {
      alert(
        "Post-এর content লিখুন।"
      );
      return;
    }

    setSavingPost(true);

    try {
      const { error } =
        await supabase
          .from("business_posts")
          .insert({
            business_id: business.id,
            author_id: currentUserId,
            post_type: postType,
            caption: postCaption.trim(),
            visibility: "public",
            status: "published",
          });

      if (error) {
        throw error;
      }

      setPostCaption("");
      setPostType("update");
      setShowPostModal(false);

      await loadBusiness();
    } catch (error) {
      console.error(
        "Create business post error:",
        error
      );

      alert(
        getErrorMessage(error)
      );
    } finally {
      setSavingPost(false);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="h-72 animate-pulse rounded-3xl bg-white shadow-sm" />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>

          <div className="mt-6 h-96 animate-pulse rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  /* =======================================================
     NOT FOUND / ERROR
  ======================================================= */

  if (!business) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-5">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Store className="h-7 w-7 text-slate-500" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Business not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {pageError ||
                "এই storefront বর্তমানে পাওয়া যাচ্ছে না।"}
            </p>

            <Link
              href="/marketplace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: secondaryColor,
      }}
    >
      {/* ===================================================
          TOP BAR
      =================================================== */}

      <div className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-6">
          <Link
            href="/marketplace"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Back to Marketplace"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-900">
              {business.name}
            </p>

            <p className="truncate text-xs text-slate-400">
              {businessTitle(
                business.business_type
              )}
            </p>
          </div>

          <Link
            href="/status-feed"
            className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex"
          >
            <Share2 className="h-4 w-4" />
            Social Hub
          </Link>

          <Link
            href="/chat"
            className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-3 text-sm font-bold text-white hover:bg-slate-700"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">
              Connect
            </span>
          </Link>
        </div>
      </div>

      {/* ===================================================
          HERO
      =================================================== */}

      <section
        id="home"
        className="scroll-mt-24"
      >
        <div className="relative overflow-hidden border-b border-slate-200 bg-slate-900">
          <div className="absolute inset-0">
            {business.cover_url ? (
              <img
                src={business.cover_url}
                alt=""
                className="h-full w-full object-cover opacity-40"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700" />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-slate-900/40" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-black tracking-wider text-white"
                  style={{
                    backgroundColor:
                      accentColor,
                  }}
                >
                  {businessLabel(
                    business.business_type
                  )}
                </span>

                {business.is_verified && (
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <div className="mt-6 flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/20 bg-white shadow-xl">
                  {business.logo_url ? (
                    <img
                      src={business.logo_url}
                      alt={business.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BusinessIcon
                      type={
                        business.business_type
                      }
                      className="h-9 w-9 text-slate-600"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {business.name}
                  </h1>

                  {business.tagline && (
                    <p className="mt-2 text-base leading-7 text-slate-200 sm:text-lg">
                      {business.tagline}
                    </p>
                  )}
                </div>
              </div>

              {business.description && (
                <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  {business.description}
                </p>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    scrollToSection(
                      business.business_type ===
                        "shop"
                        ? "products"
                        : "services"
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-900 hover:bg-slate-100"
                >
                  <Grid3X3 className="h-4 w-4" />
                  Explore
                </button>

                <Link
                  href={`/chat?business=${business.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur hover:bg-white/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Business
                </Link>
              </div>

              {(business.city ||
                business.district) && (
                <div className="mt-6 flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="h-4 w-4" />

                  <span>
                    {[
                      business.city,
                      business.district,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          NAVIGATION
      =================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 lg:px-6">
          <div className="flex min-w-max items-center gap-1 py-2">
            {navigation.map(
              (item: NavigationItem) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      scrollToSection(
                        item.id
                      )
                    }
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                      activeSection === item.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          OWNER PANEL
      =================================================== */}

      {isOwner && (
        <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Business Owner
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Manage {business.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your storefront is connected to
                  your Shromobazar account.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setShowPostModal(true)
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Update
                </button>

                <Link
                  href="/wallet"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Wallet className="h-4 w-4" />
                  Wallet
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================
          STATS
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {dashboardItems.map(
            (item: DashboardItem) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-slate-100 p-3">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>

                    <span className="text-2xl font-black text-slate-900">
                      {item.value}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    {item.label}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* ===================================================
          ABOUT
      =================================================== */}

      <section
        id="about"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 lg:px-6"
      >
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3">
              <Building2 className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                About
              </p>

              <h2 className="text-2xl font-black text-slate-900">
                About this business
              </h2>
            </div>
          </div>

          <p className="mt-5 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {business.description ||
              "এই business এখনো বিস্তারিত description যোগ করেনি।"}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {business.city && (
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                <MapPin className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-xs text-slate-400">
                    Location
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    {business.city}
                  </p>
                </div>
              </div>
            )}

            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 hover:bg-slate-100"
              >
                <Phone className="h-5 w-5 text-slate-500" />

                <div>
                  <p className="text-xs text-slate-400">
                    Phone
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    {business.phone}
                  </p>
                </div>
              </a>
            )}

            {business.email && (
              <a
                href={`mailto:${business.email}`}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 hover:bg-slate-100"
              >
                <Mail className="h-5 w-5 text-slate-500" />

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">
                    Email
                  </p>

                  <p className="truncate text-sm font-bold text-slate-800">
                    {business.email}
                  </p>
                </div>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          PRODUCTS / SERVICES
      =================================================== */}

      <section
        id={
          business.business_type ===
          "shop"
            ? "products"
            : "services"
        }
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-4 lg:px-6"
      >
        <div className="mb-5">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
            {business.business_type ===
            "shop"
              ? "Showroom"
              : "Professional Services"}
          </p>

          <h2 className="mt-1 text-2xl font-black text-slate-900">
            {business.business_type ===
            "shop"
              ? "Products & Services"
              : "Services"}
          </h2>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Package className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 font-black text-slate-900">
              No items published yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Business owner এখনো কোনো
              service/product publish করেনি।
            </p>

            {isOwner && (
              <button
                type="button"
                onClick={() =>
                  setShowPostModal(true)
                }
                className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700"
              >
                Create Business Update
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map(
              (service) => (
                <article
                  key={service.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-44 overflow-hidden bg-slate-100">
                    {service.image_url ? (
                      <img
                        src={
                          service.image_url
                        }
                        alt={
                          service.name
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-black text-slate-900">
                      {service.name}
                    </h3>

                    {service.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                        {
                          service.description
                        }
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span className="text-sm font-black text-slate-800">
                        {formatPrice(
                          service.price_from
                        )}
                      </span>

                      <Link
                        href={`/chat?business=${business.id}`}
                        className="rounded-xl px-3 py-2 text-xs font-black text-white"
                        style={{
                          backgroundColor:
                            primaryColor,
                        }}
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>

      {/* ===================================================
          UPDATES
      =================================================== */}

      <section
        id="posts"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 lg:px-6"
      >
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
              Business Feed
            </p>

            <h2 className="mt-1 text-2xl font-black text-slate-900">
              Latest Updates
            </h2>
          </div>

          <Link
            href="/status-feed"
            className="hidden items-center gap-1 text-sm font-bold text-slate-600 hover:text-slate-900 sm:flex"
          >
            Social Hub
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <Share2 className="mx-auto h-7 w-7 text-slate-300" />

            <h3 className="mt-4 font-black text-slate-900">
              No business updates yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              নতুন update এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <PostTypeIcon
                      type={
                        post.post_type
                      }
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-900">
                      {postTypeLabel(
                        post.post_type
                      )}
                    </p>

                    <p className="text-xs text-slate-400">
                      {formatDate(
                        post.created_at
                      )}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                    {postTypeLabel(
                      post.post_type
                    )}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {post.caption ||
                    "Business update"}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400">
                    Shromobazar Business Feed
                  </span>

                  <Link
                    href="/status-feed"
                    className="text-xs font-bold text-slate-700 hover:text-slate-900"
                  >
                    View Social Hub
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ===================================================
          CONTACT
      =================================================== */}

      <section
        id="contact"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-12 lg:px-6"
      >
        <div className="overflow-hidden rounded-3xl bg-slate-900">
          <div className="grid lg:grid-cols-2">
            <div className="p-7 lg:p-10">
              <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                Contact
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                Connect with{" "}
                {business.name}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                Business, customer, worker,
                buyer এবং partner—সবাই
                Shromobazar-এর unified
                ecosystem-এর মাধ্যমে connect
                করতে পারবে।
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/chat?business=${business.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-900 hover:bg-slate-100"
                >
                  <MessageCircle className="h-4 w-4" />
                  Shromo Connect
                </Link>

                {business.website_url && (
                  <a
                    href={
                      business.website_url
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white hover:bg-white/20"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-white/10 p-7 lg:border-l lg:border-t-0 lg:p-10">
              <div className="space-y-3">
                {business.phone && (
                  <a
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 hover:bg-white/10"
                  >
                    <Phone className="h-5 w-5 text-slate-300" />

                    <div>
                      <p className="text-xs text-slate-500">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-bold text-white">
                        {business.phone}
                      </p>
                    </div>
                  </a>
                )}

                {business.email && (
                  <a
                    href={`mailto:${business.email}`}
                    className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 hover:bg-white/10"
                  >
                    <Mail className="h-5 w-5 text-slate-300" />

                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        Email
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-white">
                        {business.email}
                      </p>
                    </div>
                  </a>
                )}

                {(business.address ||
                  business.city ||
                  business.district) && (
                  <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />

                    <div>
                      <p className="text-xs text-slate-500">
                        Address
                      </p>

                      <p className="mt-1 text-sm leading-6 font-bold text-white">
                        {[
                          business.address,
                          business.city,
                          business.district,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div>
            <p className="font-black text-slate-900">
              {business.name}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Powered by Shromobazar
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/marketplace"
              className="rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Marketplace
            </Link>

            <Link
              href="/status-feed"
              className="rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Social Hub
            </Link>

            <Link
              href="/chat"
              className="rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Chat
            </Link>

            <Link
              href="/wallet"
              className="rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Wallet
            </Link>
          </div>
        </div>
      </footer>

      {/* ===================================================
          CREATE POST MODAL
      =================================================== */}

      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-black text-slate-900">
                  Create Business Update
                </h2>

                <p className="mt-0.5 text-xs text-slate-400">
                  {business.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPostModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={
                handleCreatePost
              }
              className="space-y-5 p-5"
            >
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Post Type
                </label>

                <select
                  value={postType}
                  onChange={(event) =>
                    setPostType(
                      event.target
                        .value as PostType
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                >
                  <option value="update">
                    Business Update
                  </option>

                  <option value="sell">
                    Product / Offer
                  </option>

                  <option value="buy">
                    Buy Request
                  </option>

                  <option value="job">
                    Job
                  </option>

                  <option value="event">
                    Event
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">
                  Content
                </label>

                <textarea
                  value={postCaption}
                  onChange={(event) =>
                    setPostCaption(
                      event.target.value
                    )
                  }
                  rows={7}
                  placeholder="Product, service, offer, job বা business update লিখুন..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-slate-500"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                এই post আপনার business-এর
                public storefront এবং
                business feed-এ প্রকাশিত হবে।
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowPostModal(false)
                  }
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    savingPost ||
                    !postCaption.trim()
                  }
                  className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingPost
                    ? "Publishing..."
                    : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}