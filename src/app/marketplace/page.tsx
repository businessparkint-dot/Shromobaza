"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Home,
  Package,
  Palette,
  Plus,
  Search,
  ShoppingBag,
  Store,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

import { supabase } from "@/lib/client";

/* =========================================================
   TYPES
========================================================= */

type ShopProfile = {
  id: string;
  shop_name: string | null;
  shop_type:
    | "retail"
    | "wholesale"
    | "retail_wholesale"
    | null;
  category: string | null;
  location: string | null;
  delivery_area: string | null;
  minimum_order_quantity: number | null;
  has_warehouse: boolean | null;
  reseller_supply: boolean | null;
  logo_url: string | null;
  description: string | null;
  phone: string | null;
  verified: boolean | null;
  active: boolean | null;
  subscription_plan: string | null;
};

type BusinessProfile = {
  id: string;
  business_name: string | null;
  business_type:
    | "company"
    | "office_consultancy"
    | "agency"
    | "online_business"
    | null;
  category: string | null;
  location: string | null;
  service_area: string | null;
  description: string | null;
  phone: string | null;
  logo_url: string | null;
  verified: boolean | null;
  active: boolean | null;
  subscription_plan: string | null;
};

type MarketCard = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  icon: typeof Wrench;
  tag: string;
  featured?: boolean;
};

type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/* =========================================================
   MARKET SPACES
========================================================= */

const MARKET_CARDS: MarketCard[] = [
  {
    title: "Workers",
    subtitle: "কর্মী বাজার",
    description:
      "মিস্ত্রি, টেকনিশিয়ান, ড্রাইভার, শ্রমিক, ইঞ্জিনিয়ারসহ দক্ষ কর্মী খুঁজুন।",
    href: "/workers",
    icon: Wrench,
    tag: "WORK",
    featured: true,
  },
  {
    title: "Employers",
    subtitle: "কাজদাতা বাজার",
    description:
      "কাজ, চাকরি ও প্রয়োজনীয় কর্মী খোঁজার জন্য Employer space।",
    href: "/jobs",
    icon: BriefcaseBusiness,
    tag: "HIRE",
    featured: true,
  },
  {
    title: "Shops",
    subtitle: "দোকান ও পণ্য বাজার",
    description:
      "Retail, Wholesale, Supplier, Manufacturer ও Reseller-এর জন্য Shop market।",
    href: "/open-your-shop",
    icon: Store,
    tag: "SHOP",
    featured: true,
  },
  {
    title: "Offices & Companies",
    subtitle: "অফিস ও কোম্পানি",
    description:
      "Company, Consultancy, Agency ও Online Business-এর জন্য Business space।",
    href: "/open-your-office",
    icon: Building2,
    tag: "BUSINESS",
    featured: true,
  },
  {
    title: "Wholesale Market",
    subtitle: "পাইকারি বাজার",
    description:
      "Bulk Buyer, Supplier, Manufacturer ও Reseller-এর জন্য পাইকারি বাজার।",
    href: "#wholesale-market",
    icon: Package,
    tag: "BULK",
    featured: true,
  },
  {
    title: "Art & Brain Market",
    subtitle: "সৃজনশীল বাজার",
    description:
      "Creative skill, knowledge, art, digital work ও creator services-এর market।",
    href: "/art-of-brain",
    icon: Palette,
    tag: "CREATIVE",
  },
  {
    title: "Players Market",
    subtitle: "Sports Market",
    description:
      "Player, Coach, Scout, Team, Academy ও Sports opportunity-এর ecosystem।",
    href: "/sports",
    icon: Users,
    tag: "SPORTS",
  },
  {
    title: "Buy Requests",
    subtitle: "আমি কিনতে চাই",
    description:
      "আপনার প্রয়োজনীয় পণ্য বা সেবা চেয়ে Buy Request প্রকাশ করুন।",
    href: "/buy-requests",
    icon: ShoppingBag,
    tag: "BUY",
  },
  {
    title: "Health & Medical",
    subtitle: "স্বাস্থ্য ও চিকিৎসা",
    description:
      "Health service, hospital, diagnostic ও medical connection খুঁজুন।",
    href: "/health",
    icon: HeartPulse,
    tag: "HEALTH",
  },
  {
    title: "Education Market",
    subtitle: "শিক্ষা ও শেখার বাজার",
    description:
      "Student, Teacher, Institute, Course ও Learning opportunity-এর ecosystem।",
    href: "/education",
    icon: GraduationCap,
    tag: "EDUCATION",
  },
  {
    title: "Global Market",
    subtitle: "আন্তর্জাতিক বাজার",
    description:
      "Global workforce, buyer-seller, import-export ও international business।",
    href: "/connect-global-market",
    icon: Globe2,
    tag: "GLOBAL",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function getShopTypeLabel(
  type: ShopProfile["shop_type"],
) {
  if (type === "wholesale") return "Wholesale";
  if (type === "retail_wholesale") return "Retail + Wholesale";
  return "Retail";
}

function getBusinessTypeLabel(
  type: BusinessProfile["business_type"],
) {
  if (type === "company") return "Company";
  if (type === "office_consultancy")
    return "Office / Consultancy";
  if (type === "agency") return "Agency";
  if (type === "online_business")
    return "Online Business";

  return "Business";
}

/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

function SectionTitle({
  eyebrow,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div>
      <p className="text-xs font-black tracking-[0.2em] text-orange-600">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  buttonText,
}: {
  icon: typeof Store;
  title: string;
  description: string;
  href: string;
  buttonText: string;
}) {
  return (
    <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <Icon className="mx-auto h-10 w-10 text-slate-300" />

      <h3 className="mt-4 text-lg font-black text-slate-900">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        {description}
      </p>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-500"
      >
        {buttonText}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [shops, setShops] = useState<ShopProfile[]>([]);
  const [businesses, setBusinesses] = useState<
    BusinessProfile[]
  >([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     LOAD MARKET DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadMarketData() {
      setLoading(true);

      try {
        const [shopsResult, businessesResult] =
          await Promise.all([
            supabase
              .from("shop_profiles")
              .select(
                `
                  id,
                  shop_name,
                  shop_type,
                  category,
                  location,
                  delivery_area,
                  minimum_order_quantity,
                  has_warehouse,
                  reseller_supply,
                  logo_url,
                  description,
                  phone,
                  verified,
                  active,
                  subscription_plan,
                  created_at
                `,
              )
              .eq("active", true)
              .order("created_at", {
                ascending: false,
              })
              .limit(24),

            supabase
              .from("business_profiles")
              .select(
                `
                  id,
                  business_name,
                  business_type,
                  category,
                  location,
                  service_area,
                  description,
                  phone,
                  logo_url,
                  verified,
                  active,
                  subscription_plan,
                  created_at
                `,
              )
              .eq("active", true)
              .order("created_at", {
                ascending: false,
              })
              .limit(24),
          ]);

        if (!mounted) return;

        if (shopsResult.error) {
          console.error(
            "Marketplace shop_profiles error:",
            shopsResult.error.message,
          );

          setShops([]);
        } else {
          setShops(
            (shopsResult.data || []) as ShopProfile[],
          );
        }

        if (businessesResult.error) {
          console.error(
            "Marketplace business_profiles error:",
            businessesResult.error.message,
          );

          setBusinesses([]);
        } else {
          setBusinesses(
            (businessesResult.data ||
              []) as BusinessProfile[],
          );
        }
      } catch (error) {
        console.error(
          "Marketplace loading error:",
          error,
        );

        if (mounted) {
          setShops([]);
          setBusinesses([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMarketData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredShops = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return shops;

    return shops.filter((shop) =>
      [
        shop.shop_name,
        shop.category,
        shop.location,
        shop.delivery_area,
        shop.description,
        shop.shop_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [shops, search]);

  const filteredBusinesses = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return businesses;

    return businesses.filter((business) =>
      [
        business.business_name,
        business.category,
        business.location,
        business.service_area,
        business.description,
        business.business_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [businesses, search]);

  const wholesaleShops = useMemo(
    () =>
      filteredShops.filter(
        (shop) =>
          shop.shop_type === "wholesale" ||
          shop.shop_type === "retail_wholesale",
      ),
    [filteredShops],
  );

  const retailShops = useMemo(
    () =>
      filteredShops.filter(
        (shop) =>
          shop.shop_type === "retail" ||
          shop.shop_type === "retail_wholesale",
      ),
    [filteredShops],
  );

  /* =======================================================
     TOTAL COUNTS
  ======================================================= */

  const marketStats = [
    {
      label: "Registered Shops",
      value: shops.length,
      icon: Store,
    },
    {
      label: "Business Spaces",
      value: businesses.length,
      icon: Building2,
    },
    {
      label: "Wholesale Ready",
      value: wholesaleShops.length,
      icon: Package,
    },
    {
      label: "Market Spaces",
      value: MARKET_CARDS.length,
      icon: Globe2,
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ===================================================
          TOP BAR
      =================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-orange-600"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <div className="text-center">
            <p className="text-[10px] font-bold tracking-[0.28em] text-orange-600">
              SHROMOBAZAR
            </p>

            <p className="text-sm font-black tracking-tight">
              MARKETPLACE
            </p>
          </div>

          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
          >
            <Handshake className="h-4 w-4" />
            <span className="hidden xs:inline">
              Connect
            </span>
          </Link>
        </div>
      </section>

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-orange-300 backdrop-blur">
              <Zap className="h-3.5 w-3.5" />
              ONE MARKET • MANY OPPORTUNITIES
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Marketplace
              <span className="block text-orange-400">
                সব বাজার এক জায়গায়
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              কাজ, কর্মী, ব্যবসা, পণ্য, সেবা, শিক্ষা,
              স্বাস্থ্য, খেলাধুলা এবং আন্তর্জাতিক সুযোগ—
              সবকিছুকে একটি connected marketplace-এর মধ্যে
              নিয়ে আসাই Shromobazar-এর লক্ষ্য।
            </p>

            {/* SEARCH */}

            <div className="mt-8 flex max-w-3xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Shop, Company, Office, Product, Service বা Category খুঁজুন..."
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white px-12 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>

              <Link
                href="/buy-requests"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 text-sm font-black text-white transition hover:bg-orange-400"
              >
                <ShoppingBag className="h-5 w-5" />
                আমি কিনতে চাই
              </Link>
            </div>

            {/* HERO QUICK LINKS */}

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/workers"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                কর্মী খুঁজুন
              </Link>

              <Link
                href="/jobs"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                কাজ খুঁজুন
              </Link>

              <Link
                href="/open-your-shop"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Shop খুলুন
              </Link>

              <Link
                href="/open-your-office"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Office খুলুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          STATS
      =================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4 px-4 sm:px-6 lg:px-8">
          {marketStats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-5 sm:px-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-lg font-black text-slate-900">
                    {item.value}
                  </p>

                  <p className="text-[10px] font-bold leading-4 text-slate-500 sm:text-xs">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================
          MARKET HUB
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <SectionTitle
            eyebrow="MARKET HUB"
            title="কোন বাজারে যেতে চান?"
            description="আপনার প্রয়োজন অনুযায়ী সরাসরি সংশ্লিষ্ট market space-এ যান।"
          />

          <div className="rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200">
            {MARKET_CARDS.length} Market Spaces
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MARKET_CARDS.map((market) => {
            const Icon = market.icon;

            return (
              <Link
                key={market.title}
                href={market.href}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-orange-400 transition group-hover:bg-orange-500 group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black tracking-wider text-slate-500">
                    {market.tag}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black">
                  {market.title}
                </h3>

                <p className="mt-1 text-sm font-bold text-orange-600">
                  {market.subtitle}
                </p>

                <p className="mt-3 min-h-[52px] text-sm leading-6 text-slate-500">
                  {market.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-black text-slate-900">
                  Explore Market
                  <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===================================================
          SHOPS
      =================================================== */}

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="SHOP MARKET"
              title="দোকান ও পণ্য বাজার"
              description="Retail, Wholesale, Supplier, Manufacturer এবং Reseller-এর registered market spaces এখানে দেখা যাবে।"
            />

            <div className="flex flex-wrap gap-2">
              <Link
                href="/open-your-shop"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-black text-white transition hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Open Your Shop
              </Link>

              <Link
                href="/buy-requests"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
              >
                <ShoppingBag className="h-4 w-4" />
                Buy Requests
              </Link>
            </div>
          </div>

          {/* SHOP FILTER SUMMARY */}

          {!loading && filteredShops.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                {filteredShops.length} Shops
              </div>

              <div className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
                {retailShops.length} Retail
              </div>

              <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                {wholesaleShops.length} Wholesale
              </div>
            </div>
          )}

          {loading ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-52 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : filteredShops.length === 0 ? (
            <EmptyState
              icon={Store}
              title={
                search
                  ? "এই search-এর সাথে কোনো Shop পাওয়া যায়নি"
                  : "এখনো কোনো Shop পাওয়া যায়নি"
              }
              description={
                search
                  ? "অন্য Shop name, category, location বা keyword দিয়ে আবার চেষ্টা করুন।"
                  : "আপনার Shop খুলে এই marketplace-এ যুক্ত হতে পারেন।"
              }
              href="/open-your-shop"
              buttonText="Open Your Shop"
            />
          ) : (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filteredShops
                  .slice(0, 12)
                  .map((shop) => (
                    <Link
                      key={shop.id}
                      href={`/open-your-shop/profile?id=${shop.id}`}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                    >
                      <div className="relative flex h-32 items-center justify-center overflow-hidden bg-slate-100">
                        {shop.logo_url ? (
                          <img
                            src={shop.logo_url}
                            alt={
                              shop.shop_name ||
                              "Shop"
                            }
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <Store className="h-10 w-10 text-slate-300" />
                        )}

                        {shop.verified && (
                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[10px] font-black text-blue-600 shadow-sm">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-1 text-sm font-black">
                          {shop.shop_name ||
                            "Unnamed Shop"}
                        </h3>

                        <p className="mt-1 text-xs font-bold text-orange-600">
                          {getShopTypeLabel(
                            shop.shop_type,
                          )}
                        </p>

                        <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                          {shop.category ||
                            "General Market"}
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                          {shop.location ||
                            "Location not added"}
                        </p>

                        {shop.reseller_supply && (
                          <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                            Reseller Supply
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
              </div>

              {filteredShops.length > 12 && (
                <div className="mt-6 text-center">
                  <p className="text-xs font-bold text-slate-400">
                    আরও Shop registration হলে
                    marketplace-এ যুক্ত হবে।
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===================================================
          WHOLESALE
      =================================================== */}

      <section
        id="wholesale-market"
        className="bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-orange-400">
                WHOLESALE MARKET
              </p>

              <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                পাইকারি বাজার — Supplier থেকে Bulk Buyer
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Manufacturer, Supplier, Wholesale Shop,
                Reseller এবং Bulk Buyer-কে একই ecosystem-এর
                মধ্যে connect করার জন্য এই market space।
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Bulk Order",
                  "Supplier",
                  "Manufacturer",
                  "Reseller",
                  "Warehouse",
                  "Delivery Area",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <Package className="h-10 w-10 text-orange-400" />

              <p className="mt-4 text-3xl font-black text-white">
                {wholesaleShops.length}
              </p>

              <p className="mt-1 text-sm font-bold text-slate-400">
                Wholesale-enabled registered shops
              </p>

              <Link
                href="/open-your-shop"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-400"
              >
                Open Wholesale Shop
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          BUSINESS
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionTitle
            eyebrow="BUSINESS MARKET"
            title="Offices & Companies"
            description="Company, Office/Consultancy, Agency এবং Online Business-এর registered profiles এখানে পাওয়া যাবে।"
          />

          <Link
            href="/open-your-office"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black text-white transition hover:bg-orange-500"
          >
            <Plus className="h-4 w-4" />
            Open Your Office
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-2xl bg-white ring-1 ring-slate-200"
              />
            ))}
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <EmptyState
            icon={Building2}
            title={
              search
                ? "এই search-এর সাথে কোনো Business পাওয়া যায়নি"
                : "এখনো কোনো Office / Company পাওয়া যায়নি"
            }
            description={
              search
                ? "অন্য company, category, location বা keyword দিয়ে আবার চেষ্টা করুন।"
                : "আপনার Office বা Company registration করে এই market-এ যুক্ত করতে পারেন।"
            }
            href="/open-your-office"
            buttonText="Open Your Office"
          />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredBusinesses
              .slice(0, 12)
              .map((business) => (
                <Link
                  key={business.id}
                  href={`/open-your-office/profile?id=${business.id}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                      {business.logo_url ? (
                        <img
                          src={business.logo_url}
                          alt={
                            business.business_name ||
                            "Business"
                          }
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-slate-300" />
                      )}
                    </div>

                    {business.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-black text-blue-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 line-clamp-1 text-base font-black">
                    {business.business_name ||
                      "Unnamed Business"}
                  </h3>

                  <p className="mt-1 text-xs font-bold text-orange-600">
                    {getBusinessTypeLabel(
                      business.business_type,
                    )}
                  </p>

                  <p className="mt-3 line-clamp-1 text-xs text-slate-500">
                    {business.category || "Business"}
                  </p>

                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                    {business.location ||
                      "Location not added"}
                  </p>
                </Link>
              ))}
          </div>
        )}
      </section>

      {/* ===================================================
          QUICK CONNECTIONS
      =================================================== */}

      <section className="border-y border-slate-200 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-xs font-black tracking-[0.2em] text-orange-400">
              QUICK CONNECTIONS
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Marketplace থেকে সরাসরি যান
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/workers",
                label: "Find Workers",
                icon: Wrench,
              },
              {
                href: "/jobs",
                label: "Find Jobs",
                icon: BriefcaseBusiness,
              },
              {
                href: "/art-of-brain",
                label: "Art & Brain",
                icon: Palette,
              },
              {
                href: "/sports",
                label: "Players Market",
                icon: Users,
              },
              {
                href: "/health",
                label: "Health",
                icon: HeartPulse,
              },
              {
                href: "/education",
                label: "Education",
                icon: GraduationCap,
              },
              {
                href: "/buy-requests",
                label: "Buy Requests",
                icon: ShoppingBag,
              },
              {
                href: "/connect-global-market",
                label: "Global Market",
                icon: Globe2,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 text-white transition hover:bg-white/10"
                >
                  <span className="flex items-center gap-3 text-sm font-bold">
                    <Icon className="h-5 w-5 text-orange-400" />
                    {item.label}
                  </span>

                  <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================
          CREATE YOUR SPACE
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-blue-50">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <p className="text-xs font-black tracking-[0.2em] text-orange-600">
                BUILD YOUR MARKET SPACE
              </p>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                আপনার নিজের Shop বা Office খুলুন
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                আপনার পণ্য, service, company বা consultancy-কে
                Shromobazar ecosystem-এর মধ্যে নিয়ে আসুন।
                Marketplace browsing আর নিজের business space—
                দুটো আলাদা এবং পরিষ্কারভাবে রাখা হয়েছে।
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                  Retail
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                  Wholesale
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                  Company
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                  Consultancy
                </span>

                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                  Agency
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/open-your-shop"
                className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
              >
                <Store className="h-4 w-4" />
                Open Your Shop
              </Link>

              <Link
                href="/open-your-office"
                className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                <Building2 className="h-4 w-4" />
                Open Your Office
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-black tracking-tight text-slate-900">
              SHROMOBAZAR
            </p>

            <p className="mt-1 text-xs text-slate-500">
              কাজ • কর্মী • ব্যবসা • সেবা • বাজার
            </p>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
            <Link
              href="/"
              className="transition hover:text-orange-600"
            >
              Home
            </Link>

            <Link
              href="/chat"
              className="transition hover:text-orange-600"
            >
              Chat
            </Link>

            <Link
              href="/wallet"
              className="transition hover:text-orange-600"
            >
              Wallet
            </Link>

            <Link
              href="/status-feed"
              className="transition hover:text-orange-600"
            >
              Status
            </Link>

            <Link
              href="/open-your-shop"
              className="transition hover:text-orange-600"
            >
              Open Shop
            </Link>

            <Link
              href="/open-your-office"
              className="transition hover:text-orange-600"
            >
              Open Office
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}