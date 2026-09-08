"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Globe2,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Store,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type BusinessType =
  | "shop"
  | "office"
  | "business"
  | "company"
  | "institute"
  | "service"
  | "factory"
  | "hotel"
  | "agency"
  | "professional"
  | "organization"
  | "other";

type Business = {
  id: string;
  owner_id: string;
  business_type: string;
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
  verification_level: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

type BusinessPost = {
  id: string;
  business_id: string;
  author_id: string;
  post_type: string;
  caption: string | null;
  visibility: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  business?: Business;
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

const BUSINESS_TYPES: {
  value: BusinessType;
  label: string;
  description: string;
}[] = [
  {
    value: "shop",
    label: "Shop",
    description: "Products, online store & marketplace",
  },
  {
    value: "office",
    label: "Office",
    description: "Company, agency or professional office",
  },
  {
    value: "business",
    label: "Business",
    description: "General business profile",
  },
  {
    value: "company",
    label: "Company",
    description: "Registered or growing company",
  },
  {
    value: "institute",
    label: "Institute",
    description: "Education, training or learning",
  },
  {
    value: "service",
    label: "Service Center",
    description: "Professional or technical services",
  },
  {
    value: "factory",
    label: "Factory",
    description: "Manufacturing and production",
  },
  {
    value: "hotel",
    label: "Hotel / Resort",
    description: "Hotel, resort or hospitality",
  },
  {
    value: "agency",
    label: "Travel / Visa Agency",
    description: "Travel, tourism or visa services",
  },
  {
    value: "professional",
    label: "Professional",
    description: "Individual professional service",
  },
  {
    value: "organization",
    label: "Organization",
    description: "Association, organization or institution",
  },
  {
    value: "other",
    label: "Other",
    description: "Other type of business",
  },
];

const CATEGORIES = [
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

function getBusinessTypeLabel(type: string) {
  return (
    BUSINESS_TYPES.find((item) => item.value === type)?.label ||
    type.charAt(0).toUpperCase() + type.slice(1)
  );
}

function getBusinessIcon(type: string) {
  switch (type) {
    case "shop":
      return Store;
    case "office":
    case "company":
    case "business":
      return Building2;
    case "institute":
      return UserRound;
    case "service":
      return Settings;
    case "agency":
      return Globe2;
    default:
      return Building2;
  }
}

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

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [myBusinesses, setMyBusinesses] = useState<Business[]>([]);
  const [posts, setPosts] = useState<BusinessPost[]>([]);
  const [services, setServices] = useState<BusinessService[]>([]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeType, setActiveType] = useState<"all" | "shop" | "office">(
    "all"
  );

  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const [businessType, setBusinessType] = useState<BusinessType>("shop");
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");

  const [postBusinessId, setPostBusinessId] = useState("");
  const [postType, setPostType] = useState("update");
  const [postCaption, setPostCaption] = useState("");

  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadMarketplace();
  }, []);

  async function loadMarketplace() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: publicBusinesses, error: businessError } = await supabase
        .from("businesses")
        .select("*")
        .eq("is_public", true)
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (businessError) {
        console.error("Marketplace businesses:", businessError);
      }

      const loadedBusinesses = (publicBusinesses || []) as Business[];
      setBusinesses(loadedBusinesses);

      const { data: publicPosts, error: postsError } = await supabase
        .from("business_posts")
        .select("*")
        .eq("visibility", "public")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Marketplace posts:", postsError);
      }

      const loadedPosts = (publicPosts || []) as BusinessPost[];

      const postsWithBusinesses = loadedPosts.map((post) => ({
        ...post,
        business: loadedBusinesses.find(
          (business) => business.id === post.business_id
        ),
      }));

      setPosts(postsWithBusinesses);

      if (user) {
        const { data: ownedBusinesses, error: ownedError } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: true });

        if (ownedError) {
          console.error("My businesses:", ownedError);
        }

        const mine = (ownedBusinesses || []) as Business[];
        setMyBusinesses(mine);

        if (mine.length > 0) {
          setPostBusinessId((current) => current || mine[0].id);
        }

        if (mine.length > 0) {
          const { data: ownedServices, error: servicesError } =
            await supabase
              .from("business_services")
              .select("*")
              .in(
                "business_id",
                mine.map((business) => business.id)
              )
              .eq("is_active", true)
              .order("created_at", { ascending: false });

          if (!servicesError) {
            setServices((ownedServices || []) as BusinessService[]);
          } else {
            console.error("My business services:", servicesError);
            setServices([]);
          }
        } else {
          setServices([]);
        }
      } else {
        setMyBusinesses([]);
        setServices([]);
      }
    } catch (error) {
      console.error("Marketplace load error:", error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateBusiness(type: BusinessType) {
    setBusinessType(type);
    setBusinessName("");
    setTagline("");
    setDescription("");
    setShowBusinessModal(true);
  }

  async function openPostModal() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Post করতে আগে Login করুন।");
        return;
      }

      if (myBusinesses.length === 0) {
        alert("Post করতে আগে আপনার Shop / Office / Business তৈরি করুন।");
        openCreateBusiness("shop");
        return;
      }

      const firstBusiness = myBusinesses[0];

      setPostBusinessId(firstBusiness.id);
      setPostType("update");
      setPostCaption("");
      setShowPostModal(true);
    } catch (error) {
      console.error("Open post modal error:", error);
      alert("Post window open করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  async function createBusiness(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!businessName.trim()) {
      alert("Please enter your business name.");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first.");
        return;
      }

      const { data: existingBusiness, error: existingError } = await supabase
        .from("businesses")
        .select("id,name,business_type")
        .eq("owner_id", user.id)
        .eq("business_type", businessType)
        .limit(1)
        .maybeSingle();

      if (existingError) {
        console.error("Business check:", existingError);
      }

      if (existingBusiness) {
        alert(
          `You already have a ${getBusinessTypeLabel(
            businessType
          )}. You can manage it from My Businesses.`
        );
        setShowBusinessModal(false);
        await loadMarketplace();
        return;
      }

      const baseSlug = slugify(businessName) || `business-${Date.now()}`;

      const businessPayload = {
        owner_id: user.id,
        business_type: businessType,
        name: businessName.trim(),
        slug: `${baseSlug}-${Date.now().toString().slice(-6)}`,
        tagline: tagline.trim() || null,
        description: description.trim() || null,
        is_public: true,
        is_verified: false,
        verification_level: "basic",
        status: "active",
      };

      const { data: createdBusiness, error: createError } = await supabase
        .from("businesses")
        .insert(businessPayload)
        .select("*")
        .single();

      if (createError) {
        console.error("Create business:", createError);
        alert(`Business তৈরি করা যায়নি: ${createError.message}`);
        return;
      }

      const { error: settingsError } = await supabase
        .from("business_settings")
        .insert({
          business_id: createdBusiness.id,
          primary_color: "#0f172a",
          secondary_color: "#ffffff",
          accent_color: "#16a34a",
          show_products: businessType === "shop",
          show_services: true,
          show_contact: true,
          showroom_layout: "modern",
        });

      if (settingsError) {
        console.warn("Business settings:", settingsError);
      }

      alert(
        `${getBusinessTypeLabel(
          businessType
        )} successfully created.`
      );

      setShowBusinessModal(false);
      setBusinessName("");
      setTagline("");
      setDescription("");

      await loadMarketplace();
    } catch (error) {
      console.error("Create business error:", error);

      if (error instanceof Error) {
        alert(`Business তৈরি করা যায়নি: ${error.message}`);
      } else {
        alert("Business তৈরি করা যায়নি। আবার চেষ্টা করুন।");
      }
    } finally {
      setSaving(false);
    }
  }

  async function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!postBusinessId) {
      alert("Please select a business.");
      return;
    }

    if (!postCaption.trim()) {
      alert("Please write something for your post.");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Post করতে আগে Login করুন।");
        setShowPostModal(false);
        return;
      }

      const { data: ownedBusiness, error: ownerCheckError } =
        await supabase
          .from("businesses")
          .select("id,name,business_type")
          .eq("id", postBusinessId)
          .eq("owner_id", user.id)
          .maybeSingle();

      if (ownerCheckError) {
        console.error("Business ownership check:", ownerCheckError);
        alert(
          `Business verify করা যায়নি: ${ownerCheckError.message}`
        );
        return;
      }

      if (!ownedBusiness) {
        alert("এই Business থেকে Post করার অনুমতি আপনার নেই।");
        return;
      }

      const { error } = await supabase
        .from("business_posts")
        .insert({
          business_id: ownedBusiness.id,
          author_id: user.id,
          post_type: postType,
          caption: postCaption.trim(),
          visibility: "public",
          status: "published",
        });

      if (error) {
        console.error("Create post:", error);
        alert(`Post publish করা যায়নি: ${error.message}`);
        return;
      }

      alert("Post published successfully.");

      setShowPostModal(false);
      setPostCaption("");
      setPostType("update");

      await loadMarketplace();
    } catch (error) {
      console.error("Create post error:", error);

      if (error instanceof Error) {
        alert(`Post publish করা যায়নি: ${error.message}`);
      } else {
        alert("Post publish করা যায়নি। আবার চেষ্টা করুন।");
      }
    } finally {
      setSaving(false);
    }
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return businesses.filter((business) => {
      const matchesType =
        activeType === "all" ||
        (activeType === "shop" && business.business_type === "shop") ||
        (activeType === "office" &&
          ["office", "company", "business", "agency"].includes(
            business.business_type
          ));

      const searchableText = [
        business.name,
        business.tagline,
        business.description,
        business.city,
        business.district,
        business.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query || searchableText.includes(query);

      const matchesCategory =
        activeCategory === "All Categories" ||
        searchableText.includes(activeCategory.toLowerCase());

      return matchesType && matchesSearch && matchesCategory;
    });
  }, [businesses, search, activeCategory, activeType]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-7 w-7 text-emerald-600" />
                <h1 className="text-2xl font-bold text-slate-900">
                  Marketplace
                </h1>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Shop, business, office, services and people — all in one
                marketplace.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/status-feed"
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Social Hub
              </Link>

              <Link
                href="/wallet"
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Wallet className="h-4 w-4" />
                Wallet
              </Link>

              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ACTION STRIP */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <button
            type="button"
            onClick={() => openCreateBusiness("shop")}
            className="group flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-100"
          >
            <div>
              <div className="font-bold text-emerald-900">
                OPEN YOUR SHOP
              </div>
              <div className="mt-1 text-xs text-emerald-700">
                Sell products in Marketplace
              </div>
            </div>
            <Store className="h-6 w-6 text-emerald-600" />
          </button>

          <button
            type="button"
            onClick={() => openCreateBusiness("office")}
            className="group flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-left transition hover:border-blue-300 hover:bg-blue-100"
          >
            <div>
              <div className="font-bold text-blue-900">
                OPEN YOUR OFFICE
              </div>
              <div className="mt-1 text-xs text-blue-700">
                Company, agency or professional office
              </div>
            </div>
            <Building2 className="h-6 w-6 text-blue-600" />
          </button>

          <button
            type="button"
            onClick={() => openCreateBusiness("business")}
            className="group flex items-center justify-between rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4 text-left transition hover:border-violet-300 hover:bg-violet-100"
          >
            <div>
              <div className="font-bold text-violet-900">
                OPEN YOUR BUSINESS
              </div>
              <div className="mt-1 text-xs text-violet-700">
                Create your own business profile
              </div>
            </div>
            <Globe2 className="h-6 w-6 text-violet-600" />
          </button>

          <button
            type="button"
            onClick={openPostModal}
            className="group flex items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-left transition hover:border-orange-300 hover:bg-orange-100"
          >
            <div>
              <div className="font-bold text-orange-900">
                CREATE A POST
              </div>
              <div className="mt-1 text-xs text-orange-700">
                Publish through your business
              </div>
            </div>
            <Plus className="h-6 w-6 text-orange-600" />
          </button>
        </div>
      </section>

      {/* SEARCH */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 p-5 sm:p-7">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search shops, offices, businesses, services..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-800 py-4 pl-12 pr-4 text-white outline-none placeholder:text-slate-400 focus:border-emerald-400"
              />
            </div>

            <div className="flex rounded-2xl bg-slate-800 p-1">
              {[
                ["all", "All"],
                ["shop", "Shops"],
                ["office", "Offices"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setActiveType(
                      value as "all" | "shop" | "office"
                    )
                  }
                  className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                    activeType === value
                      ? "bg-white text-slate-900"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${
                  activeCategory === category
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MY BUSINESSES */}
      <section className="mx-auto max-w-7xl px-4 pb-7 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              My Businesses
            </h2>
            <p className="text-sm text-slate-500">
              Manage all your Shop, Office and Business profiles from one
              account.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openCreateBusiness("business")}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Business
          </button>
        </div>

        {myBusinesses.length === 0 ? (
          <div className="rounded-3xl border border-dashed bg-white p-8 text-center">
            <Building2 className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-3 font-bold text-slate-900">
              No business profile yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Open a Shop, Office or Business using the same registration
              form.
            </p>

            <button
              type="button"
              onClick={() => openCreateBusiness("business")}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Create Business
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myBusinesses.map((business) => {
              const Icon = getBusinessIcon(business.business_type);

              return (
                <div
                  key={business.id}
                  className="rounded-3xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <Icon className="h-6 w-6 text-slate-700" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {business.name}
                        </h3>

                        <p className="text-xs text-slate-500">
                          {getBusinessTypeLabel(
                            business.business_type
                          )}
                        </p>
                      </div>
                    </div>

                    {business.is_verified && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    )}
                  </div>

                  {business.tagline && (
                    <p className="mt-4 line-clamp-2 text-sm text-slate-600">
                      {business.tagline}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={`/emart/${business.slug}`}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Open
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/chat?business=${business.slug}`}
                      className="inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PUBLIC DIRECTORY */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Explore Businesses
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Discover shops, offices, companies and service providers.
            </p>
          </div>

          <span className="text-sm text-slate-500">
            {filteredBusinesses.length} found
          </span>
        </div>

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-3xl bg-white"
              />
            ))}
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="rounded-3xl border border-dashed bg-white p-10 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-3 font-bold text-slate-900">
              No businesses found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business) => {
              const Icon = getBusinessIcon(business.business_type);
              const isFavorite = favorites.includes(business.id);

              return (
                <article
                  key={business.id}
                  className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-200">
                    {business.cover_url ? (
                      <img
                        src={business.cover_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Icon className="h-12 w-12 text-slate-300" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleFavorite(business.id)}
                      className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="-mt-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-slate-100 shadow-sm">
                        {business.logo_url ? (
                          <img
                            src={business.logo_url}
                            alt={business.name}
                            className="h-full w-full rounded-xl object-cover"
                          />
                        ) : (
                          <Icon className="h-7 w-7 text-slate-600" />
                        )}
                      </div>

                      <div className="min-w-0 pt-1">
                        <div className="flex items-center gap-1">
                          <h3 className="truncate font-bold text-slate-900">
                            {business.name}
                          </h3>

                          {business.is_verified && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          )}
                        </div>

                        <p className="text-xs font-medium text-emerald-600">
                          {getBusinessTypeLabel(
                            business.business_type
                          )}
                        </p>
                      </div>
                    </div>

                    {business.tagline && (
                      <p className="mt-4 line-clamp-2 text-sm text-slate-600">
                        {business.tagline}
                      </p>
                    )}

                    {(business.city || business.district) && (
                      <p className="mt-3 text-xs text-slate-500">
                        {[business.city, business.district]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}

                    <div className="mt-5 flex gap-2">
                      <Link
                        href={`/emart/${business.slug}`}
                        className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        View Business
                      </Link>

                      <Link
                        href={`/chat?business=${business.slug}`}
                        className="flex items-center justify-center rounded-xl border px-4 py-2.5 text-slate-700 hover:bg-slate-50"
                        aria-label="Chat"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* BUSINESS POSTS */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">
            Business Posts
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Business updates can later flow into Social Hub.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed bg-white p-8 text-center">
            <p className="text-sm text-slate-500">
              No public business posts yet.
            </p>

            <button
              type="button"
              onClick={openPostModal}
              className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {posts.slice(0, 10).map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {post.business?.name || "Business"}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {post.business
                        ? getBusinessTypeLabel(
                            post.business.business_type
                          )
                        : "Business"}{" "}
                      • {formatDate(post.created_at)}
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {post.post_type}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {post.caption}
                </p>

                <div className="mt-5 flex gap-2">
                  {post.business && (
                    <>
                      <Link
                        href={`/emart/${post.business.slug}`}
                        className="flex-1 rounded-xl border px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        View Business
                      </Link>

                      <Link
                        href={`/chat?business=${post.business.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat
                      </Link>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER CONNECTIONS */}
      <section className="border-t bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <Link
            href="/status-feed"
            className="rounded-2xl border p-5 transition hover:bg-slate-50"
          >
            <Globe2 className="h-6 w-6 text-violet-600" />

            <h3 className="mt-3 font-bold text-slate-900">
              Social Hub
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Share business updates and discover community content.
            </p>
          </Link>

          <Link
            href="/chat"
            className="rounded-2xl border p-5 transition hover:bg-slate-50"
          >
            <MessageCircle className="h-6 w-6 text-blue-600" />

            <h3 className="mt-3 font-bold text-slate-900">
              Shromo Connect
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Connect customers, workers, employers and businesses.
            </p>
          </Link>

          <Link
            href="/wallet"
            className="rounded-2xl border p-5 transition hover:bg-slate-50"
          >
            <Wallet className="h-6 w-6 text-emerald-600" />

            <h3 className="mt-3 font-bold text-slate-900">
              Shromo Wallet
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Financial layer for future orders, deals and transactions.
            </p>
          </Link>

          <Link
            href="/global-business"
            className="rounded-2xl border p-5 transition hover:bg-slate-50"
          >
            <Building2 className="h-6 w-6 text-orange-600" />

            <h3 className="mt-3 font-bold text-slate-900">
              Global Business
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Explore the wider Business Park ecosystem.
            </p>
          </Link>
        </div>
      </section>

      {/* BUSINESS MODAL */}
      {showBusinessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Open Your Business
                </h2>

                <p className="text-xs text-slate-500">
                  Shop, Office or Business — one registration format.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBusinessModal(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={createBusiness}
              className="space-y-5 p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Business Type
                </label>

                <div className="grid gap-2 sm:grid-cols-2">
                  {BUSINESS_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setBusinessType(type.value)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        businessType === type.value
                          ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-bold text-slate-900">
                        {type.label}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {type.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Business Name *
                </label>

                <input
                  required
                  value={businessName}
                  onChange={(event) =>
                    setBusinessName(event.target.value)
                  }
                  placeholder="Enter your business name"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tagline
                </label>

                <input
                  value={tagline}
                  onChange={(event) =>
                    setTagline(event.target.value)
                  }
                  placeholder="Short description about your business"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Tell customers about your business..."
                  rows={4}
                  className="w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBusinessModal(false)}
                  className="flex-1 rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : `Create ${getBusinessTypeLabel(
                        businessType
                      )}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Business Post
                </h2>

                <p className="text-xs text-slate-500">
                  Publish from one of your business profiles.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={createPost}
              className="space-y-5 p-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Publish From
                </label>

                <div className="relative">
                  <select
                    value={postBusinessId}
                    onChange={(event) =>
                      setPostBusinessId(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 outline-none focus:border-emerald-500"
                  >
                    {myBusinesses.map((business) => (
                      <option
                        key={business.id}
                        value={business.id}
                      >
                        {business.name} —{" "}
                        {getBusinessTypeLabel(
                          business.business_type
                        )}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Post Type
                </label>

                <select
                  value={postType}
                  onChange={(event) =>
                    setPostType(event.target.value)
                  }
                  className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-emerald-500"
                >
                  <option value="update">Business Update</option>
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                  <option value="offer">Offer</option>
                  <option value="announcement">
                    Announcement
                  </option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Post
                </label>

                <textarea
                  required
                  value={postCaption}
                  onChange={(event) =>
                    setPostCaption(event.target.value)
                  }
                  placeholder="Write your business update..."
                  rows={6}
                  className="w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                This post is saved in the existing{" "}
                <strong>business_posts</strong> table. Later we can connect
                this flow directly with Social Hub without changing this
                registration system.
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 rounded-xl border px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving ? "Publishing..." : "Publish Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}