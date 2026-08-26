"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Globe2,
  Handshake,
  MapPin,
  MessageCircle,
  Newspaper,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  UserRound,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";

const categories = [
  {
    title: "লেবার ও মিস্ত্রি",
    subtitle: "রাজমিস্ত্রি, কাঠ মিস্ত্রি ও সহকারী",
    icon: Building2,
    color: "bg-[#17365d]",
  },
  {
    title: "টেকনিশিয়ান",
    subtitle: "ইলেকট্রিশিয়ান, প্লাম্বার ও টেকনিক্যাল",
    icon: Wrench,
    color: "bg-[#c2410c]",
  },
  {
    title: "ড্রাইভার",
    subtitle: "অভিজ্ঞ ড্রাইভার ও পরিবহন কর্মী",
    icon: BriefcaseBusiness,
    color: "bg-[#7f1d1d]",
  },
  {
    title: "ইঞ্জিনিয়ার",
    subtitle: "Civil, Electrical ও অন্যান্য Engineer",
    icon: Globe2,
    color: "bg-[#14532d]",
  },
  {
    title: "ডাক্তার ও স্বাস্থ্যসেবা",
    subtitle: "Doctor, Nurse ও স্বাস্থ্য পেশাজীবী",
    icon: UserRound,
    color: "bg-[#17365d]",
  },
  {
    title: "আইনজীবী",
    subtitle: "Legal ও Professional Services",
    icon: ShieldCheck,
    color: "bg-[#c2410c]",
  },
  {
    title: "অন্যান্য পেশা",
    subtitle: "আরও সকল পেশার Worker দেখুন",
    icon: Users,
    color: "bg-[#7f1d1d]",
  },
];

const ecosystemItems = [
  {
    icon: BriefcaseBusiness,
    title: "Job",
    text: "চাকরি ও কাজের সুযোগ",
    href: "/jobs",
    color: "bg-[#17365d]",
  },
  {
    icon: UserRound,
    title: "Worker",
    text: "দক্ষ কর্মী খুঁজুন",
    href: "/workers",
    color: "bg-[#14532d]",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    text: "পণ্য ও সেবা",
    href: "/marketplace",
    color: "bg-[#c2410c]",
  },
  {
    icon: MessageCircle,
    title: "Chat",
    text: "সরাসরি যোগাযোগ",
    href: "/chat",
    color: "bg-[#7f1d1d]",
  },
  {
    icon: Newspaper,
    title: "News Feed",
    text: "আপডেট ও খবর",
    href: "/status-feed",
    color: "bg-[#17365d]",
  },
  {
    icon: Clapperboard,
    title: "Entertainment",
    text: "ভিডিও ও বিনোদন",
    href: "/entertainment",
    color: "bg-[#14532d]",
  },
];

const quickFeatures = [
  {
    icon: BriefcaseBusiness,
    title: "নতুন Job Post দেখুন",
    text: "আপনার এলাকার নতুন কাজ ও চাকরির সুযোগ খুঁজে নিন।",
    href: "/jobs",
    color: "bg-[#17365d]",
  },
  {
    icon: ShoppingBag,
    title: "নতুন Sell Post দেখুন",
    text: "পণ্য ও সেবা বিক্রির নতুন বিজ্ঞপ্তি দেখুন।",
    href: "/marketplace",
    color: "bg-[#c2410c]",
  },
  {
    icon: Search,
    title: "নতুন Buy Post দেখুন",
    text: "কেউ কী কিনতে চাইছে তা দেখুন এবং সুযোগ নিন।",
    href: "/buy-requests",
    color: "bg-[#14532d]",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "বিশ্বস্ত Workforce",
    description:
      "দক্ষ কর্মী ও পেশাজীবীদের জন্য একটি সংগঠিত ও আধুনিক workforce platform।",
  },
  {
    icon: Handshake,
    title: "কাজের সুযোগ",
    description:
      "Worker ও Employer-এর মধ্যে সরাসরি কাজের সুযোগ তৈরি করুন।",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "পণ্য, সেবা ও ব্যবসার জন্য নিজের digital presence তৈরি করুন।",
  },
  {
    icon: WalletCards,
    title: "Smart Platform",
    description:
      "Job, hiring, marketplace, chat, news ও business tools এক জায়গায়।",
  },
];

const stats = [
  { value: "01", label: "Unified Platform" },
  { value: "24/7", label: "Digital Access" },
  { value: "∞", label: "Growth Opportunity" },
  { value: "100%", label: "Workforce Focused" },
];

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const search = searchTerm.trim();
    const place = location.trim();

    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (place) {
      params.set("location", place);
    }

    if (!search && !place) {
      window.location.href = "/workers";
      return;
    }

    window.location.href = `/workers?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#07152d]">

        <div className="absolute inset-0">
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#c2410c]/20 blur-3xl" />
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#14532d]/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7f1d1d]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">

          {/* =================================================
              FIXED WORKFORCE ECOSYSTEM BAR
          ================================================= */}

          <div className="mb-10 rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-xl">

            <div className="mb-3 flex items-center justify-center gap-2 text-sm font-black text-orange-300 sm:justify-start">
              <Sparkles className="h-4 w-4" />
              Workforce Ecosystem
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">

              {ecosystemItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex min-h-[66px] items-center gap-2 rounded-xl border border-white/5 bg-white/[0.04] px-3 py-2.5 text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${item.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-black">
                        {item.title}
                      </p>

                      <p className="truncate text-[10px] text-slate-400">
                        {item.text}
                      </p>
                    </div>

                    <ChevronRight className="ml-auto hidden h-3.5 w-3.5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 sm:block" />
                  </Link>
                );
              })}

            </div>
          </div>

          {/* =================================================
              HERO CONTENT
          ================================================= */}

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-300">
                <Globe2 className="h-3.5 w-3.5" />
                Bangladesh's Modern Workforce Platform
              </div>

              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                কাজ, কর্মী ও ব্যবসা
                <span className="block text-orange-400">
                  একসাথে এক জায়গায়।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-blue-100/75 sm:text-base">
                শ্রমবাজার হলো শ্রমিক, পেশাজীবী, Employer, Buyer, Seller এবং
                Business-এর জন্য একটি আধুনিক digital ecosystem—যেখানে কাজ,
                কর্মী ও ব্যবসার সুযোগ এক জায়গা থেকে পাওয়া যায়।
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/workers"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-6 text-sm font-black text-white shadow-lg shadow-orange-950/30 transition hover:bg-[#a9360a]"
                >
                  <Users className="h-4 w-4" />
                  কর্মী খুঁজুন
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/jobs"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15"
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                  কাজ খুঁজুন
                </Link>

                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-orange-400/30 px-6 text-sm font-black text-orange-300 transition hover:bg-orange-500/10"
                >
                  নিবন্ধন করুন
                </Link>

              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-blue-100/55">

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Worker Profiles
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Job & Hiring
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Marketplace
                </span>

                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Community
                </span>

              </div>

            </div>

            {/* HERO SEARCH CARD */}

            <div className="relative">

              <div className="absolute -inset-5 rounded-[2rem] bg-orange-500/10 blur-3xl" />

              <div className="relative rounded-3xl border border-white/10 bg-white p-5 shadow-2xl sm:p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17365d] text-white">
                    <Search className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-orange-600">
                      Workforce Search
                    </p>

                    <h2 className="text-xl font-black text-slate-900">
                      আপনার প্রয়োজনের মানুষ
                    </h2>
                  </div>

                </div>

                <form
                  onSubmit={handleSearch}
                  className="mt-5 space-y-3"
                >

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      আমি খুঁজছি
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-orange-400 focus-within:bg-white">

                      <Search className="mr-2.5 h-5 w-5 text-slate-400" />

                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="যেমন: রাজমিস্ত্রি, ইলেকট্রিশিয়ান..."
                        className="w-full bg-transparent text-sm outline-none"
                      />

                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-slate-600">
                      কোথায়
                    </label>

                    <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-orange-400 focus-within:bg-white">

                      <MapPin className="mr-2.5 h-5 w-5 text-slate-400" />

                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="জেলা / এলাকা"
                        className="w-full bg-transparent text-sm outline-none"
                      />

                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#17365d] text-sm font-black text-white shadow-lg transition hover:bg-[#102b4d]"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </button>

                </form>

                <div className="mt-5 grid grid-cols-3 gap-2">

                  <Link
                    href="/jobs"
                    className="rounded-xl bg-slate-50 p-3 text-center transition hover:bg-orange-50"
                  >
                    <BriefcaseBusiness className="mx-auto h-5 w-5 text-[#17365d]" />
                    <p className="mt-1 text-[10px] font-black text-slate-700">
                      Jobs
                    </p>
                  </Link>

                  <Link
                    href="/workers"
                    className="rounded-xl bg-slate-50 p-3 text-center transition hover:bg-green-50"
                  >
                    <UserRound className="mx-auto h-5 w-5 text-[#14532d]" />
                    <p className="mt-1 text-[10px] font-black text-slate-700">
                      Workers
                    </p>
                  </Link>

                  <Link
                    href="/marketplace"
                    className="rounded-xl bg-slate-50 p-3 text-center transition hover:bg-orange-50"
                  >
                    <ShoppingBag className="mx-auto h-5 w-5 text-[#c2410c]" />
                    <p className="mt-1 text-[10px] font-black text-slate-700">
                      Market
                    </p>
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="border-b border-slate-100 bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-4 py-7 text-center sm:py-8"
            >
              <p className="text-2xl font-black text-[#17365d] sm:text-3xl">
                {stat.value}
              </p>

              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="bg-slate-50 py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                Workforce Categories
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                আপনার প্রয়োজনের দক্ষ মানুষ
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                বিভিন্ন পেশা ও দক্ষতার কর্মী খুঁজে নিন এক জায়গা থেকে।
              </p>
            </div>

            <Link
              href="/workers"
              className="inline-flex items-center gap-1 text-sm font-black text-[#17365d]"
            >
              সব Worker দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.title}
                  href="/workers"
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md ${category.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-base font-black text-slate-900">
                    {category.title}
                  </h3>

                  <p className="mt-2 min-h-[42px] text-xs leading-5 text-slate-500">
                    {category.subtitle}
                  </p>

                  <div className="mt-4 flex items-center text-xs font-black text-orange-600">
                    Worker দেখুন
                    <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                  </div>

                </Link>
              );
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK POSTS
      ====================================================== */}

      <section className="bg-white py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="text-center">

            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
              Latest Opportunities
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              নতুন সুযোগ এক নজরে
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Job, Sell এবং Buy post-এর মাধ্যমে নতুন সুযোগ খুঁজে নিন।
            </p>

          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">

            {quickFeatures.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${item.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>

                  <div className="mt-5 flex items-center text-sm font-black text-orange-600">
                    দেখুন
                    <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
                  </div>

                </Link>
              );
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="bg-[#07152d] py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-5 sm:px-8">

          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-400">
                Why Shromobazar
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl">
                শুধু Job Platform নয়,
                <span className="block text-orange-400">
                  একটি পূর্ণাঙ্গ Workforce Ecosystem
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-blue-100/65">
                শ্রম, কর্মসংস্থান, ব্যবসা, marketplace এবং যোগাযোগকে একটি
                unified digital platform-এর মধ্যে নিয়ে আসাই শ্রমবাজারের লক্ষ্য।
              </p>

              <Link
                href="/register"
                className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-[#c2410c] px-5 text-sm font-black text-white transition hover:bg-[#a9360a]"
              >
                এখনই নিবন্ধন করুন
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm"
                  >

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-base font-black text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-blue-100/55">
                      {feature.description}
                    </p>

                  </div>
                );
              })}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section className="bg-slate-50 py-16 sm:py-20">

        <div className="mx-auto max-w-5xl px-5 sm:px-8">

          <div className="relative overflow-hidden rounded-3xl bg-[#17365d] px-6 py-10 text-center shadow-2xl sm:px-10 sm:py-14">

            <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-green-500/20 blur-3xl" />

            <div className="relative">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-300">
                <Star className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-3xl font-black text-white sm:text-4xl">
                শ্রমবাজারের সাথে যুক্ত হন
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-blue-100/65">
                আপনার পেশা, কাজ, ব্যবসা বা সেবার জন্য একটি unified digital
                identity তৈরি করুন।
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-7 text-sm font-black text-white transition hover:bg-[#a9360a]"
                >
                  নিবন্ধন করুন
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/workers"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-7 text-sm font-black text-white transition hover:bg-white/15"
                >
                  Worker দেখুন
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}