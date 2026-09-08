"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Grid3X3,
  MessageCircle,
  Search,
  ShoppingBag,
  Store,
  Tag,
  UserRound,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type BusinessType = "shop" | "office";

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

type BusinessPost = {
  id: string;
  business_id: string;
  author_id: string;
  post_type: "sell" | "buy" | "job" | "update" | "event";
  caption: string | null;
  visibility: "public" | "network" | "private";
  status: "draft" | "published" | "archived" | "deleted";
  created_at: string;
  business?: Business | null;
};

const categories = [
  "All Categories",
  "Electronics",
  "Clothing",
  "Food",
  "Home & Furniture",
  "Construction",
  "Services",
  "Agriculture",
  "Vehicles",
  "Other",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function formatDate(value: string) {
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

function businessLabel(type: BusinessType) {
  return type === "shop" ? "SHOP" : "OFFICE";
}

function businessIcon(type: BusinessType) {
  return type === "shop" ? (
    <Store className="h-5 w-5" />
  ) : (
    <Building2 className="h-5 w-5" />
  );
}

function getErrorMessage(error: unknown) {
  if (!error) return "Unknown database error";

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
      "Unknown database error"
    );
  }

  return "Unknown database error";
}

function BusinessCard({
  business,
  onChat,
}: {
  business: Business;
  onChat: (business: Business) => void;
}) {
  const isShop = business.business_type === "shop";

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200">
        {business.cover_url ? (
          <img
            src={business.cover_url}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              {isShop ? (
                <ShoppingBag className="h-8 w-8 text-slate-500" />
              ) : (
                <BriefcaseBusiness className="h-8 w-8 text-slate-500" />
              )}
            </div>
          </div>
        )}

        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
          {businessLabel(business.business_type)}
        </div>

        {business.is_verified && (
          <div className="absolute right-3 top-3 rounded-full bg-white/95 p-1.5 shadow-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
        )}
      </div>

      <div className="relative px-4 pb-4">
        <div className="-mt-8 mb-3 flex items-end justify-between">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-slate-500">
                {businessIcon(business.business_type)}
              </div>
            )}
          </div>
        </div>

        <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
          {business.name}
        </h3>

        {business.tagline && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {business.tagline}
          </p>
        )}

        {(business.city || business.district) && (
          <p className="mt-2 text-xs text-slate-400">
            {[business.city, business.district]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Link
            href={`/emart/${business.slug}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Visit
            <ChevronRight className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => onChat(business)}
            className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2.5 text-slate-700 transition hover:bg-slate-50"
            title="Shromo Connect"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: BusinessPost }) {
  const business = post.business;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 p-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
          {business?.business_type === "office" ? (
            <Building2 className="h-5 w-5 text-slate-500" />
          ) : (
            <Store className="h-5 w-5 text-slate-500" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900">
            {business?.name || "Business"}
          </p>

          <p className="text-xs text-slate-400">
            {business?.business_type === "office"
              ? "Office"
              : "Shop"}{" "}
            • {formatDate(post.created_at)}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {post.post_type === "sell"
            ? "Sell"
            : post.post_type === "buy"
              ? "Buy"
              : post.post_type === "job"
                ? "Job"
                : post.post_type === "event"
                  ? "Event"
                  : "Update"}
        </span>
      </div>

      <div className="p-4">
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {post.caption || "Business update"}
        </p>

        {business && (
          <Link
            href={`/emart/${business.slug}`}
            className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <span>View business</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [posts, setPosts] = useState<BusinessPost[]>([]);
  const [myBusiness, setMyBusiness] =
    useState<Business | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingShop, setSavingShop] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const [pageError, setPageError] = useState("");

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] = useState<
    "all" | "shop" | "office" | "notifications"
  >("all");

  const [activeCategory, setActiveCategory] =
    useState("All Categories");

  const [showShopModal, setShowShopModal] =
    useState(false);

  const [showPostModal, setShowPostModal] =
    useState(false);

  const [shopName, setShopName] = useState("");
  const [shopCategory, setShopCategory] =
    useState("Other");
  const [shopTagline, setShopTagline] =
    useState("");
  const [shopDescription, setShopDescription] =
    useState("");

  const [postType, setPostType] =
    useState<BusinessPost["post_type"]>("sell");

  const [postCaption, setPostCaption] =
    useState("");

  async function loadMarketplace() {
    setLoading(true);
    setPageError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.warn(
          "Auth session:",
          getErrorMessage(authError)
        );
      }

      /* BUSINESSES */
      const {
        data: businessData,
        error: businessError,
      } = await supabase
        .from("businesses")
        .select("*")
        .eq("is_public", true)
        .eq("status", "active")
        .order("created_at", {
          ascending: true,
        });

      if (businessError) {
        setBusinesses([]);
        setPageError(
          `Businesses: ${getErrorMessage(
            businessError
          )}`
        );
      } else {
        setBusinesses(
          (businessData || []) as Business[]
        );
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
            created_at
          `
        )
        .eq("status", "published")
        .eq("visibility", "public")
        .order("created_at", {
          ascending: false,
        });

      if (postError) {
        setPosts([]);

        setPageError(
          (current) =>
            current ||
            `Posts: ${getErrorMessage(postError)}`
        );
      } else {
        const cleanPosts =
          (postData || []) as BusinessPost[];

        const businessMap = new Map(
          (businessData || []).map((item) => [
            item.id,
            item as Business,
          ])
        );

        const postsWithBusinesses =
          cleanPosts.map((post) => ({
            ...post,
            business:
              businessMap.get(post.business_id) ||
              null,
          }));

        setPosts(postsWithBusinesses);
      }

      /* OWN SHOP */
      if (user) {
        const {
          data: ownBusiness,
          error: ownError,
        } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", user.id)
          .eq("business_type", "shop")
          .maybeSingle();

        if (ownError) {
          setPageError(
            (current) =>
              current ||
              `Your Shop: ${getErrorMessage(
                ownError
              )}`
          );

          setMyBusiness(null);
        } else {
          setMyBusiness(
            (ownBusiness as Business | null) ||
              null
          );
        }
      } else {
        setMyBusiness(null);
      }
    } catch (error) {
      setPageError(
        `Marketplace: ${getErrorMessage(error)}`
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMarketplace();
  }, []);

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return businesses.filter((business) => {
      if (
        activeTab !== "all" &&
        activeTab !== "notifications" &&
        business.business_type !== activeTab
      ) {
        return false;
      }

      if (
        activeCategory !== "All Categories"
      ) {
        const categoryText =
          `${business.tagline || ""} ${
            business.description || ""
          }`.toLowerCase();

        if (
          !categoryText.includes(
            activeCategory.toLowerCase()
          )
        ) {
          return false;
        }
      }

      if (!query) {
        return true;
      }

      const text = [
        business.name,
        business.tagline,
        business.description,
        business.city,
        business.district,
        business.business_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [
    businesses,
    activeTab,
    activeCategory,
    search,
  ]);

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      if (
        activeTab === "shop" &&
        post.business?.business_type !== "shop"
      ) {
        return false;
      }

      if (
        activeTab === "office" &&
        post.business?.business_type !== "office"
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const text = [
        post.caption,
        post.post_type,
        post.business?.name,
        post.business?.tagline,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [posts, activeTab, search]);

  async function createShop(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!shopName.trim()) {
      alert("Shop name দিন।");
      return;
    }

    setSavingShop(true);
    setPageError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        alert(
          `Login session error:\n${getErrorMessage(
            authError
          )}`
        );
        return;
      }

      if (!user) {
        alert("আগে Login করুন।");
        return;
      }

      const {
        data: existingShop,
        error: existingError,
      } = await supabase
        .from("businesses")
        .select("id, name")
        .eq("owner_id", user.id)
        .eq("business_type", "shop")
        .maybeSingle();

      if (existingError) {
        const message =
          getErrorMessage(existingError);

        setPageError(`Shop check: ${message}`);

        alert(
          `Shop check করা যায়নি:\n${message}`
        );

        return;
      }

      if (existingShop) {
        alert(
          `আপনার একটি Shop already আছে: ${existingShop.name}`
        );

        setShowShopModal(false);

        await loadMarketplace();

        return;
      }

      const baseSlug =
        slugify(shopName) ||
        `shop-${Date.now().toString(36)}`;

      const uniqueSlug = `${baseSlug}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      const tagline =
        shopTagline.trim()
          ? `${shopCategory} • ${shopTagline.trim()}`
          : shopCategory;

      const {
        data: createdBusiness,
        error: createError,
      } = await supabase
        .from("businesses")
        .insert({
          owner_id: user.id,
          business_type: "shop",
          name: shopName.trim(),
          slug: uniqueSlug,
          tagline,
          description:
            shopDescription.trim() || null,
          is_public: true,
          is_verified: false,
          verification_level: "basic",
          status: "active",
        })
        .select("*")
        .single();

      if (createError || !createdBusiness) {
        const message =
          getErrorMessage(createError);

        setPageError(
          `Create Shop: ${message}`
        );

        alert(
          `Shop তৈরি হয়নি:\n${message}`
        );

        return;
      }

      /* DEFAULT BUSINESS SETTINGS */
      const {
        error: settingsError,
      } = await supabase
        .from("business_settings")
        .insert({
          business_id: createdBusiness.id,
          primary_color: "#0f172a",
          secondary_color: "#334155",
          accent_color: "#2563eb",
          show_products: true,
          show_services: true,
          show_contact: true,
          showroom_layout: "modern",
        });

      if (settingsError) {
        console.warn(
          "Business settings creation failed:",
          getErrorMessage(settingsError)
        );
      }

      setMyBusiness(
        createdBusiness as Business
      );

      setShopName("");
      setShopCategory("Other");
      setShopTagline("");
      setShopDescription("");

      /* CLOSE FORM AFTER SUCCESS */
      setShowShopModal(false);

      await loadMarketplace();

      alert(
        "আপনার Shop সফলভাবে তৈরি হয়েছে।"
      );
    } catch (error) {
      const message =
        getErrorMessage(error);

      setPageError(
        `Create Shop: ${message}`
      );

      alert(
        `Shop তৈরি করতে সমস্যা হয়েছে:\n${message}`
      );
    } finally {
      setSavingShop(false);
    }
  }

  async function createPost(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!postCaption.trim()) {
      alert("Post-এর লেখা দিন।");
      return;
    }

    setSavingPost(true);
    setPageError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        alert(
          `Login session error:\n${getErrorMessage(
            authError
          )}`
        );
        return;
      }

      if (!user) {
        alert("আগে Login করুন।");
        return;
      }

      if (!myBusiness) {
        alert(
          "Post করতে আগে আপনার Shop তৈরি করুন।"
        );

        setShowPostModal(false);
        setShowShopModal(true);

        return;
      }

      const {
        error: postError,
      } = await supabase
        .from("business_posts")
        .insert({
          business_id: myBusiness.id,
          author_id: user.id,
          post_type: postType,
          caption: postCaption.trim(),
          visibility: "public",
          status: "published",
        });

      if (postError) {
        const message =
          getErrorMessage(postError);

        setPageError(
          `Create Post: ${message}`
        );

        alert(
          `Post তৈরি হয়নি:\n${message}`
        );

        return;
      }

      setPostCaption("");
      setPostType("sell");
      setShowPostModal(false);

      await loadMarketplace();

      alert("Post successfully published.");
    } catch (error) {
      const message =
        getErrorMessage(error);

      setPageError(
        `Create Post: ${message}`
      );

      alert(
        `Post তৈরি করতে সমস্যা হয়েছে:\n${message}`
      );
    } finally {
      setSavingPost(false);
    }
  }

  function closeShopModal() {
    if (savingShop) return;

    setShowShopModal(false);

    setShopName("");
    setShopCategory("Other");
    setShopTagline("");
    setShopDescription("");
  }

  function openBusinessChat(
    business: Business
  ) {
    window.location.href =
      `/chat?business=${encodeURIComponent(
        business.slug
      )}`;
  }

  function selectTab(
    tab:
      | "all"
      | "shop"
      | "office"
      | "notifications"
  ) {
    setActiveTab(tab);

    if (tab === "notifications") {
      window.location.href =
        "/notifications";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-6">

          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-black text-slate-900"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShoppingBag className="h-5 w-5" />
            </div>

            <div className="hidden sm:block">
              <div className="text-base leading-none">
                SHROMOBAZAR
              </div>

              <div className="mt-1 text-[10px] font-medium tracking-widest text-slate-400">
                MARKETPLACE
              </div>
            </div>
          </Link>

          <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
            <button
              type="button"
              onClick={() =>
                selectTab("all")
              }
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${
                activeTab === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Posts
            </button>

            <button
              type="button"
              onClick={() =>
                selectTab("shop")
              }
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${
                activeTab === "shop"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Shop
            </button>

            <button
              type="button"
              onClick={() =>
                selectTab("office")
              }
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold ${
                activeTab === "office"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Office
            </button>

            <button
              type="button"
              onClick={() =>
                selectTab("notifications")
              }
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">

          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
              <Grid3X3 className="h-4 w-4" />
              BUY • SELL • DISCOVER
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              Shromo Marketplace
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Shops, Offices, Products, Services,
              Jobs and Business Posts — সবকিছু
              এক connected marketplace ecosystem-এর
              মধ্যে।
            </p>
          </div>

          {/* DATABASE ERROR */}
          {pageError && (
            <div className="mt-6 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-red-800">
                    Marketplace database সমস্যা
                  </p>

                  <p className="mt-1 break-words text-sm leading-6 text-red-700">
                    {pageError}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadMarketplace}
                  className="shrink-0 rounded-lg bg-red-700 px-3 py-2 text-xs font-bold text-white hover:bg-red-800"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* SEARCH */}
          <div className="mt-7 flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2">

            <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search shops, offices, products, services..."
              className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setShowPostModal(true)
              }
              className="hidden rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700 sm:block"
            >
              + Post
            </button>
          </div>

          {/* CATEGORIES */}
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === category
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ACTION STRIP */}
      <section className="mx-auto max-w-7xl px-4 pt-6 lg:px-6">
        <div className="grid gap-4 md:grid-cols-3">

          {/* OPEN SHOP */}
          <button
            type="button"
            onClick={() =>
              setShowShopModal(true)
            }
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-slate-100 p-3">
                <Store className="h-6 w-6 text-slate-700" />
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
            </div>

            <h2 className="mt-4 font-bold text-slate-900">
              OPEN YOUR SHOP
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              নিজের digital shop তৈরি করুন।
            </p>
          </button>

          {/* OPEN OFFICE */}
          <Link
            href="/global-business"
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-slate-100 p-3">
                <Building2 className="h-6 w-6 text-slate-700" />
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
            </div>

            <h2 className="mt-4 font-bold text-slate-900">
              OPEN YOUR OFFICE
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Company/Office-এর digital showroom তৈরি করুন।
            </p>
          </Link>

          {/* CONNECT */}
          <Link
            href="/chat"
            className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-xl bg-slate-100 p-3">
                <MessageCircle className="h-6 w-6 text-slate-700" />
              </div>

              <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
            </div>

            <h2 className="mt-4 font-bold text-slate-900">
              SHROMO CONNECT
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Business, customer, worker ও buyer-এর
              সাথে connect করুন।
            </p>
          </Link>
        </div>
      </section>

      {/* MY BUSINESS */}
      {myBusiness && (
        <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Shop
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {myBusiness.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {myBusiness.tagline ||
                    "Your Shromobazar business"}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/emart/${myBusiness.slug}`}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-700"
                >
                  Open My Shop
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setShowPostModal(true)
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BUSINESSES */}
      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="mb-5 flex items-end justify-between">

          <div>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-slate-500" />

              <h2 className="text-2xl font-black text-slate-900">
                {activeTab === "shop"
                  ? "Shops"
                  : activeTab === "office"
                    ? "Offices"
                    : "Businesses"}
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {filteredBusinesses.length} business
              {filteredBusinesses.length === 1
                ? ""
                : "es"}{" "}
              found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Store className="h-6 w-6 text-slate-400" />
            </div>

            <h3 className="mt-4 font-bold text-slate-900">
              No businesses found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              এখনো কোনো matching Shop/Office নেই।
              আপনি চাইলে নিজের Shop খুলতে পারেন।
            </p>

            <button
              type="button"
              onClick={() =>
                setShowShopModal(true)
              }
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              Open Your Shop
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBusinesses.map(
              (business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onChat={openBusinessChat}
                />
              )
            )}
          </div>
        )}
      </section>

      {/* POSTS */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">

          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Connected Posts
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Business-এর published posts এক জায়গায়।
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowPostModal(true)
              }
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              + Create Post
            </button>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
                />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">

              <p className="font-semibold text-slate-700">
                এখনো কোনো public business post নেই।
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Shop তৈরি করার পরে আপনার প্রথম post
                publish করতে পারবেন।
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map(
                (post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <section className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 md:flex-row md:items-center md:justify-between lg:px-6">

          <div>
            <p className="font-bold">
              Shromobazar Marketplace
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Work • Market • Business • Connect
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              Home
            </Link>

            <Link
              href="/chat"
              className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              Connect
            </Link>

            <Link
              href="/notifications"
              className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              Notifications
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
            >
              <UserRound className="h-4 w-4" />
              Account
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP MODAL */}
      {showShopModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeShopModal();
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div className="min-w-0">
                <h2 className="text-lg font-black text-slate-900">
                  Open Your Shop
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  আপনার digital shop-এর basic information দিন।
                </p>
              </div>

              {/* CLOSE */}
              <button
                type="button"
                onClick={closeShopModal}
                disabled={savingShop}
                aria-label="Close"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={createShop}
              className="max-h-[calc(100vh-150px)] space-y-4 overflow-y-auto p-5"
            >

              {/* SHOP NAME */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Shop Name *
                </label>

                <input
                  value={shopName}
                  onChange={(event) =>
                    setShopName(
                      event.target.value
                    )
                  }
                  placeholder="যেমন: Rahman Electronics"
                  disabled={savingShop}
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Shop Category
                </label>

                <select
                  value={shopCategory}
                  onChange={(event) =>
                    setShopCategory(
                      event.target.value
                    )
                  }
                  disabled={savingShop}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-500 disabled:bg-slate-100"
                >
                  {categories
                    .filter(
                      (item) =>
                        item !==
                        "All Categories"
                    )
                    .map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              {/* TAGLINE */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Tagline
                </label>

                <input
                  value={shopTagline}
                  onChange={(event) =>
                    setShopTagline(
                      event.target.value
                    )
                  }
                  placeholder="Short description"
                  disabled={savingShop}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={shopDescription}
                  onChange={(event) =>
                    setShopDescription(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="আপনার Shop সম্পর্কে লিখুন..."
                  disabled={savingShop}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-100"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 border-t border-slate-100 pt-4">

                {/* CANCEL / BACK */}
                <button
                  type="button"
                  onClick={closeShopModal}
                  disabled={savingShop}
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  Cancel / Back
                </button>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={
                    savingShop ||
                    !shopName.trim()
                  }
                  className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {savingShop ? (
                    "Creating..."
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Create Shop
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] leading-5 text-slate-400">
                Cancel / Back চাপলে কোনো তথ্য save হবে না।
                Create Shop চাপলেই Shop তৈরি হবে।
              </p>
            </form>
          </div>
        </div>
      )}

      {/* POST MODAL */}
      {showPostModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowPostModal(false);
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">

              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Create Business Post
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  আপনার Shop-এর public post publish করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowPostModal(false)
                }
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={createPost}
              className="space-y-4 p-5"
            >
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Post Type
                </label>

                <select
                  value={postType}
                  onChange={(event) =>
                    setPostType(
                      event.target
                        .value as BusinessPost["post_type"]
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                >
                  <option value="sell">
                    Sell
                  </option>

                  <option value="buy">
                    Buy Request
                  </option>

                  <option value="job">
                    Job
                  </option>

                  <option value="update">
                    Business Update
                  </option>

                  <option value="event">
                    Event
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Post
                </label>

                <textarea
                  value={postCaption}
                  onChange={(event) =>
                    setPostCaption(
                      event.target.value
                    )
                  }
                  rows={7}
                  placeholder="আপনার product, service, job, offer বা business update লিখুন..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {!myBusiness && (
                <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Post করার জন্য আগে একটি Shop তৈরি করতে হবে।
                </div>
              )}

              <div className="flex gap-3 pt-2">

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
                  disabled={savingPost}
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
