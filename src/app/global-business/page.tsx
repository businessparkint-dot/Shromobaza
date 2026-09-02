"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Handshake,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

type BusinessCategory =
  | "all"
  | "construction"
  | "technology"
  | "agriculture"
  | "manufacturing"
  | "services"
  | "trade";

type Business = {
  id: number;
  name: string;
  description: string;
  category: Exclude<BusinessCategory, "all">;
  location: string;
  country: string;
  members: string;
  rating: number;
  verified: boolean;
  opportunity: string;
};

const categories: {
  id: BusinessCategory;
  bn: string;
  en: string;
}[] = [
  { id: "all", bn: "সব ব্যবসা", en: "All Business" },
  { id: "construction", bn: "নির্মাণ", en: "Construction" },
  { id: "technology", bn: "প্রযুক্তি", en: "Technology" },
  { id: "agriculture", bn: "কৃষি", en: "Agriculture" },
  { id: "manufacturing", bn: "উৎপাদন", en: "Manufacturing" },
  { id: "services", bn: "সেবা", en: "Services" },
  { id: "trade", bn: "বাণিজ্য", en: "Trade" },
];

const initialBusinesses: Business[] = [
  {
    id: 1,
    name: "Business Park International",
    description:
      "Construction, maintenance, supply, service and consultancy focused business ecosystem.",
    category: "construction",
    location: "Dhaka",
    country: "Bangladesh",
    members: "250+",
    rating: 4.9,
    verified: true,
    opportunity: "Strategic Partnership",
  },
  {
    id: 2,
    name: "Digital Technology Network",
    description:
      "Technology professionals and companies collaborating on digital products and services.",
    category: "technology",
    location: "Dhaka",
    country: "Bangladesh",
    members: "180+",
    rating: 4.8,
    verified: true,
    opportunity: "Technology Partnership",
  },
  {
    id: 3,
    name: "Green Agriculture Hub",
    description:
      "Agriculture producers, suppliers and entrepreneurs working on sustainable food systems.",
    category: "agriculture",
    location: "Khulna",
    country: "Bangladesh",
    members: "320+",
    rating: 4.7,
    verified: true,
    opportunity: "Supply & Trade",
  },
  {
    id: 4,
    name: "Manufacturing Connect",
    description:
      "Manufacturers, suppliers and industrial service providers connecting across markets.",
    category: "manufacturing",
    location: "Chattogram",
    country: "Bangladesh",
    members: "145+",
    rating: 4.6,
    verified: false,
    opportunity: "Business Lead",
  },
  {
    id: 5,
    name: "Professional Services Network",
    description:
      "Consultants, agencies and professional service providers serving local and global clients.",
    category: "services",
    location: "Dhaka",
    country: "Bangladesh",
    members: "410+",
    rating: 4.8,
    verified: true,
    opportunity: "Client Opportunity",
  },
  {
    id: 6,
    name: "International Trade Circle",
    description:
      "Importers, exporters, distributors and trade professionals exploring new markets.",
    category: "trade",
    location: "Dubai",
    country: "UAE",
    members: "290+",
    rating: 4.9,
    verified: true,
    opportunity: "International Trade",
  },
];

const opportunities = [
  {
    title: "Find Business Partner",
    text: "আপনার business-এর জন্য partner, supplier বা strategic collaborator খুঁজুন।",
    icon: Handshake,
  },
  {
    title: "Find New Market",
    text: "নতুন শহর, দেশ ও customer market-এর business opportunity explore করুন।",
    icon: TrendingUp,
  },
  {
    title: "Business Services",
    text: "Professional service provider ও business support network-এর সঙ্গে যুক্ত হন।",
    icon: BriefcaseBusiness,
  },
];

export default function GlobalBusinessPage() {
  const [category, setCategory] = useState<BusinessCategory>("all");
  const [query, setQuery] = useState("");
  const [businesses, setBusinesses] = useState(initialBusinesses);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedBusiness, setSelectedBusiness] =
    useState<Business | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newBusiness, setNewBusiness] = useState({
    name: "",
    description: "",
    category: "services" as Exclude<BusinessCategory, "all">,
    location: "",
    country: "",
    opportunity: "",
  });

  const filteredBusinesses = useMemo(() => {
    const q = query.trim().toLowerCase();

    return businesses.filter((business) => {
      const categoryMatch =
        category === "all" || business.category === category;

      const searchMatch =
        !q ||
        business.name.toLowerCase().includes(q) ||
        business.description.toLowerCase().includes(q) ||
        business.location.toLowerCase().includes(q) ||
        business.country.toLowerCase().includes(q);

      return categoryMatch && searchMatch;
    });
  }, [businesses, category, query]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const submitBusiness = () => {
    if (
      !newBusiness.name.trim() ||
      !newBusiness.description.trim() ||
      !newBusiness.location.trim() ||
      !newBusiness.country.trim()
    ) {
      window.alert("দয়া করে প্রয়োজনীয় তথ্য পূরণ করুন।");
      return;
    }

    const createdBusiness: Business = {
      id: Date.now(),
      name: newBusiness.name,
      description: newBusiness.description,
      category: newBusiness.category,
      location: newBusiness.location,
      country: newBusiness.country,
      members: "New",
      rating: 0,
      verified: false,
      opportunity:
        newBusiness.opportunity.trim() || "Business Opportunity",
    };

    setBusinesses((current) => [createdBusiness, ...current]);

    setNewBusiness({
      name: "",
      description: "",
      category: "services",
      location: "",
      country: "",
      opportunity: "",
    });

    setShowCreateModal(false);

    window.alert(
      "Business profile তৈরি হয়েছে। পরবর্তী ধাপে verification-এর মাধ্যমে public directory-তে publish করা যাবে।"
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(6,182,212,0.18),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(37,99,235,0.20),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Globe2 className="h-4 w-4 text-cyan-400" />
            <span>Smart Explore</span>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <span>Global Business</span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200">
                <Sparkles className="h-4 w-4" />
                Business • Trade • Partnership
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Local Business থেকে
                <span className="block text-cyan-400">
                  Global Opportunity।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
                Global Business হলো ব্যবসা প্রতিষ্ঠান, উদ্যোক্তা, supplier,
                buyer, professional এবং strategic partner-দের এক জায়গায়
                connect করার জন্য Shromobazar-এর একটি future-ready business
                ecosystem।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("business-directory")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  Explore Businesses
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <Plus className="h-4 w-4" />
                  Add Business
                </button>
              </div>
            </div>

            {/* HERO BUSINESS CARD */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600">
                      Global Business Network
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-slate-950">
                      Connect • Discover • Grow
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
                    <Globe2 className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {[
                    ["৫,০০০+", "Businesses"],
                    ["৫০+", "Countries"],
                    ["১০,০০০+", "Connections"],
                    ["১,০০০+", "Opportunities"],
                  ].map(([number, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <p className="text-xl font-black text-slate-950">
                        {number}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white">
                  <ShieldCheck className="h-5 w-5 text-cyan-400" />

                  <p className="text-xs font-semibold leading-5 text-slate-300">
                    Business profiles • Trust • Discovery • Partnership
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-1">
              <Search className="h-5 w-5 text-slate-400" />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Business, industry, city বা country খুঁজুন..."
                className="h-12 min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OPPORTUNITIES */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">
              Business Opportunities
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              আপনার ব্যবসার পরবর্তী সুযোগ খুঁজুন
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600">
              Partner, market এবং professional service—business growth-এর
              প্রয়োজনীয় connection এক জায়গায়।
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {opportunities.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  onClick={() =>
                    window.alert(
                      `${item.title} — এই opportunity system পরবর্তী database phase-এ চালু করা হবে।`
                    )
                  }
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-1 hover:border-cyan-200 hover:bg-white hover:shadow-xl"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    {item.text}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-sm font-black text-cyan-600 transition group-hover:gap-2">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIRECTORY */}
      <section
        id="business-directory"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-600">
              Business Directory
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
              Discover Businesses
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600">
              Industry ও location অনুযায়ী business profile explore করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Handshake className="h-4 w-4 text-cyan-600" />

            <span className="text-sm font-bold text-slate-700">
              Saved: {favorites.length}
            </span>
          </div>
        </div>

        {/* FILTERS */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const active = category === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                    : "border-slate-200 bg-white text-slate-700 hover:border-cyan-300 hover:bg-cyan-50"
                }`}
              >
                <span className="block text-sm font-black">{item.bn}</span>

                <span
                  className={`block text-[11px] font-semibold ${
                    active ? "text-slate-300" : "text-slate-400"
                  }`}
                >
                  {item.en}
                </span>
              </button>
            );
          })}
        </div>

        {/* BUSINESS CARDS */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredBusinesses.map((business) => {
            const isFavorite = favorites.includes(business.id);

            return (
              <article
                key={business.id}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-800 to-cyan-950">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[18px] border-cyan-400/10" />

                  <div className="absolute -bottom-10 -left-5 h-36 w-36 rounded-full border-[18px] border-white/5" />

                  <div className="absolute left-5 top-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 backdrop-blur">
                    <Building2 className="h-7 w-7" />
                  </div>

                  {business.verified && (
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-950">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600" />
                      VERIFIED
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-700">
                        {business.category}
                      </span>

                      <h3 className="mt-3 text-xl font-black leading-7 text-slate-950">
                        {business.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleFavorite(business.id)}
                      className={`rounded-xl p-2 transition ${
                        isFavorite
                          ? "bg-cyan-50 text-cyan-600"
                          : "text-slate-300 hover:bg-slate-100 hover:text-slate-600"
                      }`}
                    >
                      <Star
                        className="h-5 w-5"
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {business.description}
                  </p>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <MapPin className="h-4 w-4 text-cyan-600" />
                      {business.location}, {business.country}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Users className="h-4 w-4 text-cyan-600" />
                      {business.members} network members
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <BriefcaseBusiness className="h-4 w-4 text-cyan-600" />
                      {business.opportunity}
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Rating
                      </p>

                      <div className="mt-1 flex items-center gap-1">
                        <Star
                          className="h-4 w-4 text-amber-400"
                          fill="currentColor"
                        />

                        <span className="text-sm font-black text-slate-800">
                          {business.rating || "New"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBusiness(business)}
                      className="inline-flex items-center gap-1 text-sm font-black text-cyan-600 transition group-hover:gap-2"
                    >
                      View Profile
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 text-xl font-black text-slate-800">
              কোনো business পাওয়া যায়নি
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500">
              অন্য keyword অথবা category দিয়ে চেষ্টা করুন।
            </p>
          </div>
        )}
      </section>

      {/* GLOBAL CONNECTION */}
      <section className="border-y border-slate-200 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950">
                <Globe2 className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                One Network.
                <span className="block text-cyan-400">
                  Global Possibilities.
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-300">
                ভবিষ্যতে Global Business module-এর মাধ্যমে local business
                থেকে international trade, supplier discovery, partnership,
                service marketplace এবং business intelligence-এর দিকে
                এগোনোর সুযোগ তৈরি করা যাবে।
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Building2,
                  title: "Business Profiles",
                  text: "একটি structured digital business identity।",
                },
                {
                  icon: Handshake,
                  title: "Partnership",
                  text: "Partner ও collaborator discovery।",
                },
                {
                  icon: TrendingUp,
                  title: "Market Opportunities",
                  text: "নতুন market ও business lead discovery।",
                },
                {
                  icon: ShieldCheck,
                  title: "Trust Network",
                  text: "Verification ও reputation ভিত্তিক ecosystem।",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.06] p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-lg font-black text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-slate-400">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-cyan-400 p-7 shadow-2xl sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-slate-950/70">
                <MessageCircle className="h-5 w-5" />

                <span className="text-sm font-black uppercase tracking-wider">
                  Build Your Business Network
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
                আপনার ব্যবসাকে Global Network-এর সঙ্গে যুক্ত করুন।
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-950/70">
                Business profile তৈরি করুন, opportunity দেখুন এবং ভবিষ্যতের
                global business ecosystem-এর অংশ হোন।
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800"
            >
              <Plus className="h-5 w-5" />
              Add Business
            </button>
          </div>
        </div>
      </section>

      {/* BUSINESS PROFILE MODAL */}
      {selectedBusiness && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-600">
                  Business Profile
                </p>

                <h2 className="text-xl font-black text-slate-950">
                  {selectedBusiness.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedBusiness(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-950 text-cyan-400">
                <Building2 className="h-10 w-10" />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700">
                  {selectedBusiness.category}
                </span>

                {selectedBusiness.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-3xl font-black text-slate-950">
                {selectedBusiness.name}
              </h2>

              <p className="mt-4 text-base font-medium leading-8 text-slate-600">
                {selectedBusiness.description}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Location
                  </p>

                  <p className="mt-1 font-black text-slate-800">
                    {selectedBusiness.location},{" "}
                    {selectedBusiness.country}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Network
                  </p>

                  <p className="mt-1 font-black text-slate-800">
                    {selectedBusiness.members}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Rating
                  </p>

                  <p className="mt-1 font-black text-slate-800">
                    {selectedBusiness.rating || "New"}
                  </p>
                </div>

                <div className="rounded-2xl bg-cyan-50 p-4">
                  <p className="text-xs font-black uppercase text-cyan-600">
                    Opportunity
                  </p>

                  <p className="mt-1 font-black text-cyan-800">
                    {selectedBusiness.opportunity}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  window.alert(
                    "Business connection request system পরবর্তী database phase-এ চালু করা হবে।"
                  )
                }
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
              >
                <Handshake className="h-4 w-4" />
                Connect Business
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BUSINESS MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-cyan-600">
                  Global Business
                </p>

                <h2 className="text-xl font-black text-slate-950">
                  Add Your Business
                </h2>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              <div>
                <label className="text-sm font-black text-slate-700">
                  Business Name
                </label>

                <input
                  value={newBusiness.name}
                  onChange={(e) =>
                    setNewBusiness({
                      ...newBusiness,
                      name: e.target.value,
                    })
                  }
                  placeholder="আপনার business-এর নাম"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-sm font-black text-slate-700">
                  Business Description
                </label>

                <textarea
                  value={newBusiness.description}
                  onChange={(e) =>
                    setNewBusiness({
                      ...newBusiness,
                      description: e.target.value,
                    })
                  }
                  placeholder="Business কী করে এবং কী ধরনের service/product দেয়..."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-black text-slate-700">
                    Category
                  </label>

                  <select
                    value={newBusiness.category}
                    onChange={(e) =>
                      setNewBusiness({
                        ...newBusiness,
                        category: e.target.value as Exclude<
                          BusinessCategory,
                          "all"
                        >,
                      })
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-cyan-500"
                  >
                    {categories
                      .filter((item) => item.id !== "all")
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.bn} — {item.en}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-black text-slate-700">
                    Opportunity
                  </label>

                  <input
                    value={newBusiness.opportunity}
                    onChange={(e) =>
                      setNewBusiness({
                        ...newBusiness,
                        opportunity: e.target.value,
                      })
                    }
                    placeholder="যেমন: Partnership"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-black text-slate-700">
                    City / Location
                  </label>

                  <input
                    value={newBusiness.location}
                    onChange={(e) =>
                      setNewBusiness({
                        ...newBusiness,
                        location: e.target.value,
                      })
                    }
                    placeholder="Dhaka"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-black text-slate-700">
                    Country
                  </label>

                  <input
                    value={newBusiness.country}
                    onChange={(e) =>
                      setNewBusiness({
                        ...newBusiness,
                        country: e.target.value,
                      })
                    }
                    placeholder="Bangladesh"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-cyan-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />

                  <p className="text-xs font-semibold leading-6 text-slate-700">
                    Business profile এখন local UI state-এ তৈরি হবে। ভবিষ্যতে
                    Supabase verification, company documents, reputation,
                    contacts এবং business analytics যুক্ত করা যাবে।
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={submitBusiness}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-black text-white hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  Create Business
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}