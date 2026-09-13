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
  Landmark,
  Lightbulb,
  MapPin,
  Search,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  Wrench,
  FileText,
} from "lucide-react";

type BusinessCategory = {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  description: string;
};

type Business = {
  id: string;
  name: string;
  category: string;
  location: string;
  description?: string;
  verified?: boolean;
};

const businessCategories: BusinessCategory[] = [
  {
    id: "construction",
    name: "নির্মাণ ও কনস্ট্রাকশন",
    nameEn: "Construction",
    icon: Building2,
    description: "Construction, contractor, engineering ও project services",
  },
  {
    id: "engineering",
    name: "ইঞ্জিনিয়ারিং",
    nameEn: "Engineering",
    icon: Wrench,
    description: "Civil, electrical, mechanical ও technical services",
  },
  {
    id: "trading",
    name: "ট্রেডিং ও সরবরাহ",
    nameEn: "Trading & Supply",
    icon: ShoppingBag,
    description: "পণ্য সরবরাহ, wholesale, distribution ও trading",
  },
  {
    id: "manufacturing",
    name: "ম্যানুফ্যাকচারিং",
    nameEn: "Manufacturing",
    icon: Store,
    description: "কারখানা, উৎপাদন ও industrial business",
  },
  {
    id: "education",
    name: "শিক্ষা ও প্রশিক্ষণ",
    nameEn: "Education & Training",
    icon: GraduationCap,
    description: "Institute, coaching, training ও professional education",
  },
  {
    id: "consultancy",
    name: "কনসালটেন্সি",
    nameEn: "Consultancy",
    icon: Lightbulb,
    description: "Business, legal, technical ও professional consultancy",
  },
  {
    id: "services",
    name: "সেবা ও প্রফেশনাল",
    nameEn: "Professional Services",
    icon: BriefcaseBusiness,
    description: "বিভিন্ন professional ও business services",
  },
  {
    id: "agriculture",
    name: "কৃষি ও খাদ্য",
    nameEn: "Agriculture & Food",
    icon: Landmark,
    description: "Agriculture, food, fisheries ও agro business",
  },
];

const exploreItems = [
  {
    title: "কাজ ও কর্মী",
    description: "কাজের জন্য দক্ষ কর্মী ও পেশাজীবী খুঁজুন",
    href: "/workers",
    icon: Users,
  },
  {
    title: "ব্যবসা খুঁজুন",
    description: "দেশের বিভিন্ন business ও service provider খুঁজুন",
    href: "/business",
    icon: Search,
  },
  {
    title: "Marketplace",
    description: "পণ্য ও ব্যবসায়িক সুযোগের marketplace",
    href: "/marketplace",
    icon: ShoppingBag,
  },
  {
    title: "আমি কিনতে চাই",
    description: "আপনার প্রয়োজনীয় পণ্য বা সেবার request দিন",
    href: "/buy-requests",
    icon: Handshake,
  },
];

const businesses: Business[] = [];

export default function BusinessPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("all");

  const [businessList, setBusinessList] =
    useState<Business[]>(businesses);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Future Supabase/API business directory integration.
    // Keeping this isolated so the page remains stable
    // until live business data is connected.
    setBusinessList(businesses);
  }, []);

  const filteredBusinesses = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return businessList.filter((business) => {
      const matchesCategory =
        selectedCategory === "all" ||
        business.category === selectedCategory;

      const matchesSearch =
        !keyword ||
        business.name.toLowerCase().includes(keyword) ||
        business.category.toLowerCase().includes(keyword) ||
        business.location.toLowerCase().includes(keyword) ||
        (business.description || "")
          .toLowerCase()
          .includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [businessList, search, selectedCategory]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
              <Globe2 className="h-4 w-4" />
              Bangladesh Business Network
            </div>

            <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              কাজ, কর্মী ও ব্যবসার
              <span className="block text-orange-400">
                একটি সংযুক্ত প্ল্যাটফর্ম
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Shromobazar-এ ব্যবসা, প্রতিষ্ঠান, উদ্যোক্তা,
              contractor, service provider ও skilled workforce
              এক জায়গায় যুক্ত হতে পারে।
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/tenders"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                <FileText className="h-4 w-4" />
                Tender Notice
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#business-directory"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                <Search className="h-4 w-4" />
                Business খুঁজুন
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BUSINESS SEARCH
      ========================================================== */}
      <section
        id="business-directory"
        className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="lg:w-1/3">
              <h2 className="text-lg font-bold text-slate-900">
                Business Directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                ব্যবসা ও service provider খুঁজুন
              </p>
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Business, service, location search করুন..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              সব বিভাগ
            </button>

            {businessCategories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category.id)
                  }
                  className={`inline-flex whitespace-nowrap items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition ${
                    selectedCategory === category.id
                      ? "bg-blue-700 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          TENDER OPPORTUNITY
      ========================================================== */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-blue-50 to-white p-5 sm:p-6">
            <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <FileText className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Tender Opportunity
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                    সরকারি tender notice, procuring entity,
                    location ও closing information এক জায়গায়
                    দেখুন।
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 font-semibold text-green-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Public Notice
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1">
                      BPPA Source
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1">
                      Live Opportunity
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/tenders"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                <FileText className="h-4 w-4" />
                Tender Notice
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BUSINESS CATEGORIES
      ========================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Business Network
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Business Categories
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              আপনার business বা service-এর category বেছে নিন
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {businessCategories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(category.id);

                  document
                    .getElementById("business-directory")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  {category.name}
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {category.description}
                </p>

                <p className="mt-3 text-[11px] font-semibold text-slate-400">
                  {category.nameEn}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          EXPLORE
      ========================================================== */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Explore Shromobazar
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              ব্যবসার সাথে আরও সুযোগ
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Business ecosystem-এর অন্য অংশগুলোতেও সরাসরি যান
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {exploreItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================
          LIVE BUSINESS DIRECTORY
      ========================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Directory
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Registered Businesses
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Shromobazar-এর business directory
            </p>
          </div>

          {loading && (
            <span className="text-xs text-slate-400">
              Loading...
            </span>
          )}
        </div>

        <div className="mt-5">
          {filteredBusinesses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
              <Store className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 text-base font-bold text-slate-700">
                এখনো কোনো business listing নেই
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Business registration ও live directory data
                connect হলে এই জায়গায় verified businessগুলো
                দেখাবে।
              </p>

              <Link
                href="/register"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800"
              >
                Business Register করুন
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBusinesses.map((business) => (
                <div
                  key={business.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {business.name}
                      </h3>

                      <p className="mt-1 text-xs text-blue-700">
                        {business.category}
                      </p>
                    </div>

                    {business.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {business.location}
                  </div>

                  {business.description && (
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      {business.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          BUSINESS IDENTITY
      ========================================================== */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Business Identity
              </p>

              <h2 className="mt-2 text-3xl font-black leading-tight text-white">
                আপনার ব্যবসার জন্য
                <span className="block text-orange-400">
                  একটি digital identity
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                Shromobazar-এর business profile ব্যবহার করে
                আপনার company, shop, office, consultancy,
                institute বা service business-এর পরিচয় তুলে
                ধরতে পারবেন।
              </p>

              <Link
                href="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600"
              >
                Business শুরু করুন
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureBox
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Trust & Verification"
                description="ব্যবসার পরিচয় ও verification information প্রদর্শনের সুযোগ।"
              />

              <FeatureBox
                icon={<Store className="h-5 w-5" />}
                title="Shop / Office"
                description="এক account থেকে business space তৈরি করার ভিত্তি।"
              />

              <FeatureBox
                icon={<Users className="h-5 w-5" />}
                title="Workforce"
                description="প্রয়োজনে skilled worker ও professional খুঁজুন।"
              />

              <FeatureBox
                icon={<Handshake className="h-5 w-5" />}
                title="Business Network"
                description="Buyer, seller, business ও service provider-এর সাথে connect করুন।"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          GLOBAL VISION
      ========================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <Globe2 className="h-4 w-4" />
                Bangladesh → Global
              </div>

              <h2 className="mt-4 text-3xl font-black leading-tight text-slate-900">
                Local business থেকে
                <span className="block text-blue-700">
                  Global Business Network
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                Shromobazar-এর লক্ষ্য শুধু একটি local directory
                নয়। কাজ, কর্মী, পণ্য, service ও business
                opportunity-কে একটি connected digital ecosystem-এ
                নিয়ে আসা।
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="space-y-4">
                <VisionStep
                  number="01"
                  title="Discover"
                  text="কাজ, কর্মী, business ও opportunity খুঁজুন"
                />

                <VisionStep
                  number="02"
                  title="Connect"
                  text="Buyer, seller, employer ও service provider-এর সাথে যোগাযোগ করুন"
                />

                <VisionStep
                  number="03"
                  title="Grow"
                  text="Business profile, shop, office ও premium tools ব্যবহার করে grow করুন"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-white sm:text-4xl">
            আপনার Business আজই যুক্ত করুন
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-100">
            একটি account থেকে আপনার business identity তৈরি
            করুন এবং Shromobazar-এর growing ecosystem-এর অংশ
            হন।
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-800 transition hover:bg-blue-50"
            >
              Register Business
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/tenders"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/15"
            >
              <FileText className="h-4 w-4" />
              Tender Notice
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =============================================================
   SMALL COMPONENTS
============================================================= */

function FeatureBox({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-orange-400">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold text-white">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function VisionStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-xs font-bold text-white">
        {number}
      </div>

      <div>
        <h3 className="text-sm font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}