"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Globe2,
  Handshake,
  Landmark,
  MapPin,
  MessageCircle,
  PackageSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

/* =========================================================
   TYPES
========================================================= */

type BusinessCategory =
  | "all"
  | "construction"
  | "engineering"
  | "trading"
  | "manufacturing"
  | "education"
  | "consultancy"
  | "services"
  | "agriculture";

type Business = {
  id: string;
  owner_id?: string | null;
  name: string;
  business_type?: string | null;
  category: string;
  location: string;
  country: string;
  description: string;
  phone?: string | null;
  email?: string | null;
  is_public?: boolean;
  is_verified?: boolean;
  verification_level?: string | null;
  status?: string | null;
  created_at?: string | null;
};

/* =========================================================
   CATEGORIES
========================================================= */

const categories: {
  id: BusinessCategory;
  bn: string;
  en: string;
}[] = [
  {
    id: "all",
    bn: "সব ব্যবসা",
    en: "All Businesses",
  },
  {
    id: "construction",
    bn: "নির্মাণ",
    en: "Construction",
  },
  {
    id: "engineering",
    bn: "ইঞ্জিনিয়ারিং",
    en: "Engineering",
  },
  {
    id: "trading",
    bn: "বাণিজ্য",
    en: "Trading",
  },
  {
    id: "manufacturing",
    bn: "উৎপাদন",
    en: "Manufacturing",
  },
  {
    id: "education",
    bn: "শিক্ষা",
    en: "Education",
  },
  {
    id: "consultancy",
    bn: "পরামর্শ",
    en: "Consultancy",
  },
  {
    id: "services",
    bn: "সেবা",
    en: "Services",
  },
  {
    id: "agriculture",
    bn: "কৃষি",
    en: "Agriculture",
  },
];

/* =========================================================
   GLOBAL CONNECTION ENTRY POINTS
========================================================= */

const connectionItems = [
  {
    icon: Globe2,
    title: "বাংলাদেশ → বিশ্ব",
    titleEn: "Bangladesh to the World",
    text:
      "বাংলাদেশি business, product, supplier, professional ও service-এর জন্য international market ও global connection তৈরি করুন।",
    href: "/global-business/bangladesh-to-world",
  },
  {
    icon: Landmark,
    title: "বিশ্ব → বাংলাদেশ",
    titleEn: "World to Bangladesh",
    text:
      "Foreign buyer, business, partner, institution ও investor-এর জন্য Bangladesh-এর business ecosystem খুঁজুন।",
    href: "/global-business/world-to-bangladesh",
  },
  {
    icon: Users,
    title: "People & Professionals",
    titleEn: "Find People & Professionals",
    text:
      "Worker, engineer, consultant, expert ও professional খুঁজে connection তৈরি করুন।",
    href: "/workers",
  },
  {
    icon: PackageSearch,
    title: "Supplier & Buyer",
    titleEn: "Find Supplier & Buyer",
    text:
      "Supplier, buyer, marketplace product ও business request-এর সঙ্গে connect করুন।",
    href: "/marketplace",
  },
  {
    icon: Handshake,
    title: "Partnership / JV",
    titleEn: "Partnership & Joint Venture",
    text:
      "Strategic partner, collaboration ও joint-venture connection-এর জন্য Global partnership entry point।",
    href: "/global-business/partnership-jv",
  },
  {
    icon: TrendingUp,
    title: "Investment",
    titleEn: "Investment Opportunities",
    text:
      "Verified business/project opportunity যুক্ত হলে structured investment connection-এর entry point হিসেবে ব্যবহার হবে।",
    href: "/global-business/investment",
  },
];

/* =========================================================
   OFFICIAL INTERNATIONAL OPPORTUNITIES
========================================================= */

const internationalSources = [
  {
    icon: Landmark,
    name: "World Bank",
    subtitle: "Business Opportunities",
    description:
      "World Bank-এর official procurement and business opportunity notices.",
    href: "https://projects.worldbank.org/en/projects-operations/opportunities",
  },
  {
    icon: Globe2,
    name: "United Nations",
    subtitle: "UN Global Marketplace",
    description:
      "UN system-এর official procurement opportunities ও supplier connection.",
    href: "https://www.ungm.org/Public/Notice",
  },
  {
    icon: BriefcaseBusiness,
    name: "Asian Development Bank",
    subtitle: "Procurement Opportunities",
    description:
      "ADB-এর official project procurement and consulting opportunities.",
    href: "https://www.adb.org/business/project-procurement/business-opportunities",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function normalizeCategory(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function formatLocation(business: Business) {
  const location = business.location?.trim();
  const country = business.country?.trim();

  if (location && country) {
    return `${location}, ${country}`;
  }

  return location || country || "Location not provided";
}

/* =========================================================
   PAGE
========================================================= */

export default function GlobalBusinessPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<BusinessCategory>("all");

  const [selectedBusiness, setSelectedBusiness] =
    useState<Business | null>(null);

  const [favorites, setFavorites] = useState<string[]>([]);

  /* =======================================================
     LOAD REAL BUSINESS DATA
  ======================================================= */

  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const { data, error } = await supabase
        .from("businesses")
        .select(
          [
            "id",
            "owner_id",
            "business_type",
            "name",
            "phone",
            "email",
            "address",
            "city",
            "district",
            "is_public",
            "is_verified",
            "verification_level",
            "status",
            "created_at",
            "updated_at",
          ].join(","),
        )
        .eq("is_public", true)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      const rows = Array.isArray(data) ? data : [];

      const mapped: Business[] = rows.map((row: any) => ({
        id: String(row.id),
        owner_id: row.owner_id ?? null,
        name: row.name || "Unnamed Business",
        business_type: row.business_type || "services",
        category: normalizeCategory(
          row.business_type || "services",
        ),
        location:
          row.city ||
          row.district ||
          row.address ||
          "",
        country: "Bangladesh",
        description:
          row.address ||
          "Business profile available on Shromobazar.",
        phone: row.phone ?? null,
        email: row.email ?? null,
        is_public: Boolean(row.is_public),
        is_verified: Boolean(row.is_verified),
        verification_level:
          row.verification_level ?? null,
        status: row.status ?? null,
        created_at: row.created_at ?? null,
      }));

      setBusinesses(mapped);
    } catch (error) {
      setBusinesses([]);

      setLoadError(
        error instanceof Error
          ? error.message
          : "Business directory load করা যায়নি।",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBusinesses();
  }, [loadBusinesses]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredBusinesses = useMemo(() => {
    const q = query.trim().toLowerCase();

    return businesses.filter((business) => {
      const businessCategory =
        normalizeCategory(business.category);

      const categoryMatch =
        category === "all" ||
        businessCategory === category;

      const searchMatch =
        !q ||
        business.name.toLowerCase().includes(q) ||
        businessCategory.includes(q) ||
        business.location.toLowerCase().includes(q) ||
        business.country.toLowerCase().includes(q) ||
        business.description.toLowerCase().includes(q);

      return categoryMatch && searchMatch;
    });
  }, [businesses, category, query]);

  /* =======================================================
     FAVORITE
  ======================================================= */

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  /* =======================================================
     SCROLL
  ======================================================= */

  const goToDirectory = () => {
    document
      .getElementById("global-directory")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#06142d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(14,116,144,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
          {/* breadcrumb */}

          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 sm:text-xs">
            <Globe2 className="h-4 w-4 text-cyan-300" />

            <span>Shromobazar</span>

            <ChevronRight className="h-3.5 w-3.5 opacity-50" />

            <span className="text-cyan-200">
              Global Connection
            </span>
          </div>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* left */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-cyan-200 sm:text-[9px]">
                <Sparkles className="h-3.5 w-3.5" />
                Global Business & Connection
              </div>

              <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Bangladesh
                <span className="text-cyan-300">
                  {" "}
                  ↔{" "}
                </span>
                World
                <span className="block text-orange-400">
                  Connect • Discover • Grow
                </span>
              </h1>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Bangladesh-এর business, people, supplier, buyer,
                professional, product ও opportunity-এর সঙ্গে
                international business, market, partner ও
                institution-এর smart connection তৈরি করার জন্য
                Shromobazar-এর Global Hub।
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={goToDirectory}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-[9px] font-black text-[#06142d] transition hover:bg-cyan-300 sm:px-5"
                >
                  Find Businesses
                  <Search className="h-3.5 w-3.5" />
                </button>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-[9px] font-black text-white transition hover:bg-white/[0.1] sm:px-5"
                >
                  Create Global Profile
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* right visual */}

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-3 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-white p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-600">
                      GLOBAL GATEWAY
                    </p>

                    <h2 className="mt-2 text-xl font-black text-[#07152d] sm:text-2xl">
                      Two-way connection
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                    <Globe2 className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                    <p className="text-[9px] font-black uppercase tracking-wider text-cyan-700">
                      🇧🇩 Bangladesh → World
                    </p>

                    <p className="mt-1 text-xs font-bold leading-5 text-slate-700">
                      Export • Business • People • Supplier • Partner
                    </p>
                  </div>

                  <div className="flex justify-center text-lg font-black text-cyan-600">
                    ↕
                  </div>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <p className="text-[9px] font-black uppercase tracking-wider text-blue-700">
                      🌍 World → Bangladesh
                    </p>

                    <p className="mt-1 text-xs font-bold leading-5 text-slate-700">
                      Buyer • Business • Partner • Investor • Institution
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-950 px-3 py-2.5 text-[8px] font-bold text-slate-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  Verified information first
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONNECTION GRID
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-600 sm:text-[9px]">
              GLOBAL CONNECTION
            </p>

            <h2 className="mt-1.5 text-xl font-black text-[#07152d] sm:text-2xl">
              What do you want to connect?
            </h2>

            <p className="mt-1.5 max-w-2xl text-[9px] leading-5 text-slate-500 sm:text-sm">
              Bangladesh থেকে বাইরে এবং বাইরে থেকে Bangladesh—দুই
              দিকের connection-এর জন্য সহজ entry point।
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {connectionItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.titleEn}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-cyan-600" />
                  </div>

                  <h3 className="mt-4 text-sm font-black text-[#07152d]">
                    {item.title}
                  </h3>

                  <p className="mt-0.5 text-[8px] font-bold text-cyan-600">
                    {item.titleEn}
                  </p>

                  <p className="mt-2 text-[9px] leading-5 text-slate-500">
                    {item.text}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          OFFICIAL INTERNATIONAL OPPORTUNITIES
      ====================================================== */}

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-orange-700">
                  <Landmark className="h-3.5 w-3.5" />
                  Official International Sources
                </div>

                <h2 className="mt-3 text-xl font-black text-[#07152d] sm:text-2xl">
                  Global Opportunities
                </h2>

                <p className="mt-1.5 max-w-2xl text-[9px] leading-5 text-slate-500 sm:text-sm">
                  International procurement ও business opportunities-এর
                  জন্য সরাসরি official source-এ যান।
                </p>
              </div>

              <span className="text-[8px] font-bold text-slate-400">
                Official source • External site
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {internationalSources.map((source) => {
                const Icon = source.icon;

                return (
                  <a
                    key={source.name}
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>

                      <ExternalLink className="h-4 w-4 text-slate-300 transition group-hover:text-orange-500" />
                    </div>

                    <h3 className="mt-4 text-sm font-black text-[#07152d]">
                      {source.name}
                    </h3>

                    <p className="mt-0.5 text-[8px] font-black text-orange-600">
                      {source.subtitle}
                    </p>

                    <p className="mt-2 text-[9px] leading-5 text-slate-500">
                      {source.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1 text-[8px] font-black text-orange-600">
                      Open Official Source
                      <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-[8px] leading-4 text-slate-500">
                Shromobazar নিজে tender submission করে না এবং
                কোনো investment return বা financial outcome guarantee করে না।
                Official opportunity-এর participation instructions সংশ্লিষ্ট
                official source-এই follow করতে হবে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          REAL BUSINESS DIRECTORY
      ====================================================== */}

      <section
        id="global-directory"
        className="scroll-mt-20 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-600 sm:text-[9px]">
                LIVE BUSINESS DIRECTORY
              </p>

              <h2 className="mt-1.5 text-xl font-black text-[#07152d] sm:text-2xl">
                Find Businesses
              </h2>

              <p className="mt-1.5 max-w-2xl text-[9px] leading-5 text-slate-500 sm:text-sm">
                Shromobazar-এর public business profiles থেকে
                searchable global directory।
              </p>
            </div>

            <button
              type="button"
              onClick={loadBusinesses}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[8px] font-black text-slate-600 transition hover:bg-slate-50"
            >
              Refresh Directory
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* search */}

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <div className="flex items-center gap-2 rounded-xl bg-white px-3">
              <Search className="h-4 w-4 text-slate-400" />

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Business, category, city বা country..."
                className="h-11 min-w-0 flex-1 bg-transparent text-[10px] font-semibold text-slate-800 outline-none placeholder:text-slate-400 sm:text-xs"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* category */}

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => {
              const active = category === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-[8px] font-black transition ${
                    active
                      ? "bg-[#07152d] text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700"
                  }`}
                >
                  {item.bn}
                  <span
                    className={`ml-1 ${
                      active
                        ? "text-slate-300"
                        : "text-slate-400"
                    }`}
                  >
                    / {item.en}
                  </span>
                </button>
              );
            })}
          </div>

          {/* loading */}

          {loading && (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />

              <p className="mt-4 text-sm font-black text-slate-600">
                Business directory লোড হচ্ছে...
              </p>
            </div>
          )}

          {/* error */}

          {!loading && loadError && (
            <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-2 text-red-500">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-black text-red-800">
                    Directory data load করা যায়নি
                  </h3>

                  <p className="mt-1 text-[9px] leading-5 text-red-700">
                    {loadError}
                  </p>

                  <p className="mt-2 text-[8px] leading-4 text-red-600">
                    Public business listing available হলে এখানেই
                    automatically দেখাবে। Fake business data ব্যবহার করা হচ্ছে না।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* business cards */}

          {!loading &&
            !loadError &&
            filteredBusinesses.length > 0 && (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBusinesses.map((business) => {
                  const favorite = favorites.includes(
                    business.id,
                  );

                  return (
                    <article
                      key={business.id}
                      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#06142d] via-[#0b2144] to-[#063b4a] p-4">
                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full border-[16px] border-cyan-300/10" />

                        <div className="relative flex items-start justify-between gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-cyan-300">
                            <Building2 className="h-5 w-5" />
                          </div>

                          <div className="flex items-center gap-2">
                            {business.is_verified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[7px] font-black text-emerald-700">
                                <CheckCircle2 className="h-3 w-3" />
                                VERIFIED
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() =>
                                toggleFavorite(business.id)
                              }
                              className="rounded-lg bg-white/10 p-1.5 text-white transition hover:bg-white/20"
                            >
                              <Star
                                className="h-3.5 w-3.5"
                                fill={
                                  favorite
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            </button>
                          </div>
                        </div>

                        <p className="relative mt-5 text-[7px] font-black uppercase tracking-[0.15em] text-cyan-200">
                          {business.category ||
                            "Business"}
                        </p>

                        <h3 className="relative mt-1 text-base font-black text-white">
                          {business.name}
                        </h3>
                      </div>

                      <div className="p-4">
                        <p className="line-clamp-3 text-[9px] leading-5 text-slate-500">
                          {business.description}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-[8px] font-bold text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-cyan-600" />
                          {formatLocation(business)}
                        </div>

                        {business.business_type && (
                          <div className="mt-2 flex items-center gap-2 text-[8px] font-bold text-slate-500">
                            <BriefcaseBusiness className="h-3.5 w-3.5 text-cyan-600" />
                            {business.business_type}
                          </div>
                        )}

                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[7px] font-black ${
                              business.is_verified
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {business.is_verified
                              ? "Verified"
                              : "Public Profile"}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedBusiness(
                                business,
                              )
                            }
                            className="inline-flex items-center gap-1 text-[8px] font-black text-cyan-700 transition group-hover:gap-1.5"
                          >
                            View Profile
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

          {/* empty */}

          {!loading &&
            !loadError &&
            filteredBusinesses.length === 0 && (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <Building2 className="mx-auto h-9 w-9 text-slate-300" />

                <h3 className="mt-4 text-sm font-black text-slate-700">
                  এখনো কোনো matching public business নেই
                </h3>

                <p className="mx-auto mt-2 max-w-md text-[9px] leading-5 text-slate-500">
                  Shromobazar নিজে কোনো business listing তৈরি করছে না।
                  Verified/public business profile যুক্ত হলে এখানে দেখা যাবে।
                </p>

                <Link
                  href="/register"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#07152d] px-4 py-2.5 text-[8px] font-black text-white"
                >
                  Create Business Profile
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
        </div>
      </section>

      {/* =====================================================
          TRUST / SAFETY
      ====================================================== */}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <h3 className="mt-3 text-sm font-black text-[#07152d]">
                  Trust & Verification
                </h3>

                <p className="mt-1 text-[9px] leading-5 text-slate-500">
                  Public business profile ও verification information
                  আলাদা করে দেখা যাবে।
                </p>
              </div>

              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Handshake className="h-5 w-5" />
                </div>

                <h3 className="mt-3 text-sm font-black text-[#07152d]">
                  Direct Connection
                </h3>

                <p className="mt-1 text-[9px] leading-5 text-slate-500">
                  Business owner-এর সঙ্গে available connection route
                  ব্যবহার করে যোগাযোগের ভিত্তি তৈরি হবে।
                </p>
              </div>

              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Globe2 className="h-5 w-5" />
                </div>

                <h3 className="mt-3 text-sm font-black text-[#07152d]">
                  Global Expansion
                </h3>

                <p className="mt-1 text-[9px] leading-5 text-slate-500">
                  ভবিষ্যতে country, market, buyer, supplier ও
                  international partner layer আরও গভীর হবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="bg-[#06142d]">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-5 rounded-[1.75rem] border border-cyan-300/15 bg-gradient-to-r from-cyan-400/10 via-white/[0.03] to-blue-400/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-cyan-300">
                GLOBAL BUSINESS
              </p>

              <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                আপনার business-কে World-এর সঙ্গে connect করুন।
              </h2>

              <p className="mt-2 max-w-2xl text-[9px] leading-5 text-slate-400 sm:text-xs">
                একটি public business identity তৈরি করুন এবং
                future global connection ecosystem-এর অংশ হন।
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-[9px] font-black text-[#06142d] transition hover:bg-cyan-300"
            >
              Create Global Profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          BUSINESS DETAIL MODAL
      ====================================================== */}

      {selectedBusiness && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[1.75rem] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
              <div className="min-w-0">
                <p className="text-[7px] font-black uppercase tracking-[0.15em] text-cyan-600">
                  Business Profile
                </p>

                <h2 className="truncate text-base font-black text-[#07152d]">
                  {selectedBusiness.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBusiness(null)
                }
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#06142d] text-cyan-300">
                  <Building2 className="h-7 w-7" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[7px] font-black text-cyan-700">
                      {selectedBusiness.category ||
                        "Business"}
                    </span>

                    {selectedBusiness.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[7px] font-black text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h2 className="mt-2 text-xl font-black text-[#07152d]">
                    {selectedBusiness.name}
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-[10px] leading-6 text-slate-600">
                {selectedBusiness.description}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 text-[9px] font-black text-slate-700">
                    {formatLocation(selectedBusiness)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                    Business Type
                  </p>

                  <p className="mt-1 text-[9px] font-black text-slate-700">
                    {selectedBusiness.business_type ||
                      selectedBusiness.category ||
                      "Business"}
                  </p>
                </div>
              </div>

              {selectedBusiness.phone && (
                <div className="mt-3 rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-[9px] font-black text-slate-700">
                    {selectedBusiness.phone}
                  </p>
                </div>
              )}

              {selectedBusiness.email && (
                <div className="mt-3 rounded-2xl bg-slate-50 p-3.5">
                  <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all text-[9px] font-black text-slate-700">
                    {selectedBusiness.email}
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                {selectedBusiness.owner_id ? (
                  <Link
                    href={`/chat?userId=${encodeURIComponent(
                      selectedBusiness.owner_id,
                    )}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#07152d] px-4 py-3 text-[8px] font-black text-white transition hover:bg-slate-800"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Connect / Chat
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-[8px] font-black text-slate-400">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Owner connection unavailable
                  </span>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedBusiness(null)
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-[8px] font-black text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}