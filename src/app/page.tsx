"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  Globe2,
  Handshake,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Store,
  UserRound,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";

const categories = [
  {
    title: "লেবার ও মিস্ত্রি",
    subtitle: "রাজমিস্ত্রি, কাঠমিস্ত্রি ও সহকারী",
    icon: Building2,
    color: "bg-[#17365d]",
  },
  {
    title: "টেকনিশিয়ান",
    subtitle: "ইলেকট্রিশিয়ান, প্লাম্বার ও টেকনিক্যাল কর্মী",
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
    title: "ইঞ্জিনিয়ার",
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
    subtitle: "আরও সকল পেশার কর্মী দেখুন",
    icon: Users,
    color: "bg-[#7f1d1d]",
  },
];

/* =========================================================
   MAIN ECOSYSTEM
   Social Hub এখন /status-feed-এর একমাত্র Social entry
========================================================= */

const ecosystemItems = [
  {
    icon: BriefcaseBusiness,
    title: "Jobs",
    text: "চাকরি ও কাজের সুযোগ",
    href: "/jobs",
    color: "bg-gradient-to-br from-blue-600 to-blue-800",
  },
  {
    icon: UserRound,
    title: "Workers",
    text: "দক্ষ কর্মী খুঁজুন",
    href: "/workers",
    color: "bg-gradient-to-br from-emerald-600 to-green-800",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    text: "পণ্য ও সেবা",
    href: "/marketplace",
    color: "bg-gradient-to-br from-orange-500 to-red-600",
  },
  {
    icon: MessageCircle,
    title: "Chat",
    text: "সরাসরি যোগাযোগ",
    href: "/chat",
    color: "bg-gradient-to-br from-cyan-500 to-blue-700",
  },
  {
    icon: Users,
    title: "Social Hub",
    text: "Connect & Share",
    href: "/status-feed",
    color: "bg-gradient-to-br from-violet-500 to-purple-700",
  },
  {
    icon: Clapperboard,
    title: "Entertainment",
    text: "Social, Video & Entertainment",
    href: "/entertainment",
    color:
      "bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700",
  },
];

/* =========================================================
   NOTICES
========================================================= */

const notices = [
  {
    title: "Social Hub",
    text: "Community-এর নতুন update, post ও গুরুত্বপূর্ণ তথ্য দেখুন।",
    href: "/status-feed",
    icon: Users,
    color: "bg-[#7c3aed]",
  },
  {
    title: "নতুন Job Post দেখুন",
    text: "আপনার এলাকার নতুন কাজ ও চাকরির সুযোগ খুঁজে নিন।",
    href: "/jobs",
    icon: BriefcaseBusiness,
    color: "bg-[#17365d]",
  },
  {
    title: "Marketplace",
    text: "পণ্য ও সেবার নতুন বিজ্ঞপ্তি দেখুন।",
    href: "/marketplace",
    icon: ShoppingBag,
    color: "bg-[#c2410c]",
  },
];

/* =========================================================
   PLATFORM FEATURES
========================================================= */

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
      "Job, hiring, marketplace, chat, social hub ও business tools এক জায়গায়।",
  },
];

/* =========================================================
   STATS
========================================================= */

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

    window.location.href = params.toString()
      ? `/workers?${params.toString()}`
      : "/workers";
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden bg-[#07152d]">

        {/* Background Glow */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#c2410c]/20 blur-3xl" />

          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#14532d]/20 blur-3xl" />

          <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-8 lg:pb-24 lg:pt-10">

          {/* =====================================================
              PREMIUM ECOSYSTEM BAR
          ====================================================== */}

          <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.055] p-1.5 shadow-2xl backdrop-blur-xl">

            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">

              {ecosystemItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                  >

                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-lg ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-9 ${item.color}`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>

                    <div className="min-w-0">
                      <p className="whitespace-nowrap text-[10px] font-extrabold leading-tight text-white sm:text-[11px]">
                        {item.title}
                      </p>

                      <p className="hidden whitespace-nowrap text-[9px] leading-tight text-slate-400 xl:block">
                        {item.text}
                      </p>
                    </div>

                  </Link>
                );
              })}

            </div>
          </div>

          {/* =====================================================
              HERO GRID
          ====================================================== */}

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">

            {/* HERO CONTENT */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-orange-200 backdrop-blur">
                <Sparkles className="h-4 w-4 text-orange-400" />

                Bangladesh&apos;s Modern Workforce Platform
              </div>

              <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">

                কাজ, কর্মী ও ব্যবসা

                <span className="block text-orange-400">
                  একসাথে এক জায়গায়।
                </span>

              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                শ্রমবাজার হলো শ্রমিক, পেশাজীবী, Employer, Buyer,
                Seller এবং Business-এর জন্য একটি আধুনিক digital
                ecosystem—যেখানে কাজ, কর্মী ও ব্যবসার সুযোগ
                এক জায়গা থেকে পাওয়া যায়।
              </p>

              {/* CTA BUTTONS */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/workers"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ea580c] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-[#c2410c]"
                >
                  <Search className="h-5 w-5" />

                  কর্মী খুঁজুন

                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/jobs"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <BriefcaseBusiness className="h-5 w-5" />

                  কাজ খুঁজুন
                </Link>

              </div>

              {/* HERO FEATURES */}

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Worker Profile
                </span>

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Job & Hiring
                </span>

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Marketplace
                </span>

                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Social Hub
                </span>

              </div>
            </div>

            {/* ===================================================
                PREMIUM SEARCH
            ==================================================== */}

            <div className="relative">

              <div className="absolute -inset-5 rounded-[2.5rem] bg-orange-500/10 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.08] p-3 shadow-2xl backdrop-blur-xl sm:p-4">

                <div className="rounded-[1.5rem] bg-white p-5 shadow-2xl sm:p-7">

                  {/* Search Header */}

                  <div className="flex items-center justify-between">

                    <div>

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                          <Search className="h-4 w-4 text-[#c2410c]" />
                        </div>

                        <p className="text-xs font-black uppercase tracking-[0.15em] text-[#c2410c]">
                          Workforce Search
                        </p>

                      </div>

                      <h2 className="mt-3 text-2xl font-black text-[#07152d]">
                        আপনার প্রয়োজনের মানুষ
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        দক্ষ Worker বা Professional খুঁজে নিন
                      </p>

                    </div>

                    <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#07152d] text-white shadow-lg sm:flex">
                      <Users className="h-5 w-5" />
                    </div>

                  </div>

                  {/* Search Form */}

                  <form onSubmit={handleSearch} className="mt-6">

                    {/* Search Field */}

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-lg">

                      <label
                        htmlFor="workforce-search"
                        className="flex items-center gap-2 text-xs font-bold text-slate-500"
                      >
                        <Search className="h-3.5 w-3.5 text-orange-500" />
                        আমি খুঁজছি
                      </label>

                      <input
                        id="workforce-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Mason, Technician, Driver, Engineer..."
                        className="mt-2 w-full border-0 bg-transparent p-0 text-base font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0"
                      />

                    </div>

                    {/* Location + Button */}

                    <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">

                      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-lg">

                        <MapPin className="h-5 w-5 shrink-0 text-[#7f1d1d]" />

                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="কোন এলাকায়?"
                          className="w-full border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
                        />

                      </div>

                      <button
                        type="submit"
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#c2410c] px-7 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                      >
                        <Search className="h-4 w-4" />
                        Search
                      </button>

                    </div>
                  </form>

                  {/* Popular Searches */}

                  <div className="mt-5 flex flex-wrap gap-2">

                    {["Mason", "Electrician", "Driver", "Engineer"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSearchTerm(item)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-[#c2410c]"
                        >
                          {item}
                        </button>
                      )
                    )}

                  </div>

                  {/* Featured Worker */}

                  <div className="mt-6 rounded-2xl bg-[#07152d] p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <UserRound className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="font-bold text-white">
                          Skilled Professional
                        </p>

                        <p className="mt-1 text-xs text-slate-300">
                          Verified Workforce Profile
                        </p>

                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-orange-300">

                        <Star className="h-3.5 w-3.5 fill-current" />

                        5.0

                      </div>

                    </div>

                  </div>

                </div>

                {/* QUICK LINKS */}

                <div className="mt-4 grid grid-cols-3 gap-3">

                  <Link
                    href="/jobs"
                    className="rounded-2xl bg-[#7f1d1d] p-3 text-center transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <p className="text-lg font-black text-white">
                      Jobs
                    </p>

                    <p className="mt-1 text-[11px] text-red-100">
                      Find work
                    </p>
                  </Link>

                  <Link
                    href="/workers"
                    className="rounded-2xl bg-[#14532d] p-3 text-center transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <p className="text-lg font-black text-white">
                      Workers
                    </p>

                    <p className="mt-1 text-[11px] text-green-100">
                      Hire talent
                    </p>
                  </Link>

                  <Link
                    href="/marketplace"
                    className="rounded-2xl bg-[#c2410c] p-3 text-center transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <p className="text-lg font-black text-white">
                      Market
                    </p>

                    <p className="mt-1 text-[11px] text-orange-100">
                      Grow business
                    </p>
                  </Link>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================== */}

      <section className="border-b border-slate-200 bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-4 py-7 text-center sm:px-6"
            >
              <p className="text-2xl font-black text-[#07152d] sm:text-3xl">
                {stat.value}
              </p>

              <p className="mt-1 text-xs font-semibold text-slate-500 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* =========================================================
          NOTICES
      ========================================================== */}

      <section className="bg-slate-50 px-5 py-14 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#c2410c]">

                <Bell className="h-4 w-4" />

                বিজ্ঞপ্তি

              </div>

              <h2 className="mt-3 text-3xl font-black text-[#07152d]">
                নতুন সুযোগ ও আপডেট
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Social Hub, Job এবং Marketplace-এর গুরুত্বপূর্ণ আপডেট দেখুন।
              </p>

            </div>

            <Link
              href="/status-feed"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#7f1d1d]"
            >
              Social Hub
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">

            {notices.map((notice) => {

              const Icon = notice.icon;

              return (
                <Link
                  key={notice.title}
                  href={notice.href}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white ${notice.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1">

                      <h3 className="font-black text-[#07152d]">
                        {notice.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {notice.text}
                      </p>

                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />

                  </div>

                </Link>
              );

            })}

          </div>

        </div>
      </section>

      {/* =========================================================
          CATEGORIES
      ========================================================== */}

      <section className="bg-white px-5 py-20 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c2410c]">
                Popular Categories
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#07152d] sm:text-4xl">
                আপনার প্রয়োজনের দক্ষ মানুষ
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                লেবার, মিস্ত্রি, টেকনিশিয়ান, ডাক্তার, ইঞ্জিনিয়ার,
                ড্রাইভার, আইনজীবীসহ বিভিন্ন পেশার মানুষ খুঁজে নিন।
              </p>

            </div>

            <Link
              href="/workers"
              className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#7f1d1d]"
            >
              সব Worker দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {categories.map((category) => {

              const Icon = category.icon;

              return (
                <Link
                  key={category.title}
                  href="/workers"
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                >

                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm ${category.color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="font-black text-slate-900">
                        {category.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {category.subtitle}
                      </p>

                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />

                  </div>

                </Link>
              );

            })}

          </div>

        </div>
      </section>

      {/* =========================================================
          CREATE OPPORTUNITY
      ========================================================== */}

      <section className="bg-slate-50 px-5 py-20 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#14532d]">
              Create Opportunity
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#07152d] sm:text-4xl">
              আপনার প্রয়োজনীয় পোস্ট দিন
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              কাজ দিতে, পণ্য বা সেবা বিক্রি করতে অথবা কোনো পণ্য
              কিনতে চাইলে আলাদা পোস্ট তৈরি করুন।
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            {/* JOB POST */}

            <Link
              href="/post-job"
              className="group rounded-[2rem] bg-[#07152d] p-7 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <BriefcaseBusiness className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Job Post দিন
              </h3>

              <p className="mt-3 text-sm leading-7 text-blue-100">
                আপনার প্রতিষ্ঠানের প্রয়োজনীয় Worker বা
                Professional-এর জন্য Job Post করুন।
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-300">
                Job Post করুন
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>

            </Link>

            {/* SELL POST */}

            <Link
              href="/marketplace"
              className="group rounded-[2rem] bg-[#c2410c] p-7 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <ShoppingBag className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Sell Post দিন
              </h3>

              <p className="mt-3 text-sm leading-7 text-orange-100">
                আপনার পণ্য বা সেবা Marketplace-এ পোস্ট করে
                ক্রেতার কাছে পৌঁছে দিন।
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white">
                Sell Post করুন
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>

            </Link>

            {/* BUY POST */}

            <Link
              href="/buy-requests"
              className="group rounded-[2rem] bg-[#14532d] p-7 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Search className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Buy Post দিন
              </h3>

              <p className="mt-3 text-sm leading-7 text-green-100">
                আপনি কী কিনতে চান বা কোন পণ্য প্রয়োজন—
                Buy Post দিয়ে জানিয়ে দিন।
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-green-100">
                Buy Post করুন
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>

            </Link>

          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}

      <section className="bg-white px-5 py-20 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#14532d]">
              How Shromobazar Works
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#07152d] sm:text-4xl">
              কাজের সংযোগ এখন আরও সহজ
            </h2>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {[
              {
                number: "01",
                icon: UserRound,
                title: "একটি Profile তৈরি করুন",
                text: "একবার নিবন্ধন করে নিজের প্রয়োজন অনুযায়ী platform-এর বিভিন্ন সুবিধা ব্যবহার করুন।",
                color: "bg-[#07152d]",
              },
              {
                number: "02",
                icon: Search,
                title: "সঠিক সুযোগ খুঁজুন",
                text: "Worker, Job, Sell Post অথবা Buy Post—আপনার প্রয়োজনের সুযোগ খুঁজে নিন।",
                color: "bg-[#c2410c]",
              },
              {
                number: "03",
                icon: Handshake,
                title: "যোগাযোগ ও কাজ শুরু করুন",
                text: "সরাসরি যোগাযোগ, hiring, buying বা selling-এর মাধ্যমে কাজ এগিয়ে নিন।",
                color: "bg-[#14532d]",
              },
            ].map((item) => {

              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex items-center justify-between">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${item.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-4xl font-black text-slate-100">
                      {item.number}
                    </span>

                  </div>

                  <h3 className="mt-7 text-xl font-black text-[#07152d]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {item.text}
                  </p>

                </div>
              );

            })}

          </div>
        </div>
      </section>

      {/* =========================================================
          MARKETPLACE BUSINESS
      ========================================================== */}

      <section className="bg-slate-50 px-5 py-20 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="overflow-hidden rounded-[2rem] bg-[#07152d] p-7 shadow-2xl sm:p-10 lg:p-12">

            <div className="grid gap-10 lg:grid-cols-[1fr_.85fr] lg:items-center">

              <div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-lg">
                  <Store className="h-7 w-7" />
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
                  Marketplace Business
                </p>

                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  নিজের Shop বা Office তৈরি করুন।
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  আপনার ব্যবসা, পণ্য বা professional service-এর জন্য
                  Shromobazar-এ নিজের digital presence তৈরি করুন।
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-700"
                  >
                    <Store className="h-4 w-4" />
                    Open Your Shop
                  </Link>

                  <Link
                    href="/marketplace"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7f1d1d] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-red-800"
                  >
                    <Building2 className="h-4 w-4" />
                    Open Your Office
                  </Link>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-2xl bg-white p-5 shadow-sm">

                  <Store className="h-7 w-7 text-[#c2410c]" />

                  <p className="mt-4 font-black text-[#07152d]">
                    Your Shop
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    পণ্য ও সেবা প্রদর্শন
                  </p>

                </div>

                <div className="rounded-2xl bg-[#14532d] p-5 text-white">

                  <Building2 className="h-7 w-7" />

                  <p className="mt-4 font-black">
                    Your Office
                  </p>

                  <p className="mt-1 text-xs text-green-100">
                    Business presence
                  </p>

                </div>

                <div className="rounded-2xl bg-[#7f1d1d] p-5 text-white">

                  <ShoppingBag className="h-7 w-7" />

                  <p className="mt-4 font-black">
                    Sell
                  </p>

                  <p className="mt-1 text-xs text-red-100">
                    পণ্য ও সেবা
                  </p>

                </div>

                <div className="rounded-2xl bg-[#c2410c] p-5 text-white">

                  <Search className="h-7 w-7" />

                  <p className="mt-4 font-black">
                    Buy
                  </p>

                  <p className="mt-1 text-xs text-orange-100">
                    প্রয়োজনীয় পণ্য
                  </p>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          PLATFORM FEATURES
      ========================================================== */}

      <section className="bg-[#07152d] px-5 py-20 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
                One Ecosystem
              </p>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">

                শুধু Job নয়,

                <span className="block text-orange-400">
                  একটি সম্পূর্ণ Ecosystem
                </span>

              </h2>

              <p className="mt-5 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
                Worker, Employer, Buyer, Seller এবং Business—
                সবাই প্রয়োজনীয় digital tools একটি platform থেকেই
                ব্যবহার করতে পারবে।
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {features.map((feature, index) => {

                const Icon = feature.icon;

                const iconBg =
                  index === 0
                    ? "bg-[#14532d]"
                    : index === 1
                      ? "bg-[#c2410c]"
                      : index === 2
                        ? "bg-[#7f1d1d]"
                        : "bg-[#244b78]";

                return (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-white/10 bg-white/[0.07] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09]"
                  >

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 font-black text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {feature.description}
                    </p>

                  </div>
                );

              })}

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          APP SECTION
      ========================================================== */}

      <section className="bg-white px-5 py-20 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#8b2f09] via-[#b83b0a] to-[#6d1830] p-7 shadow-2xl sm:p-10 lg:p-12">

            <div className="grid items-center gap-10 lg:grid-cols-[.85fr_1.15fr]">

              {/* PHONE MOCKUP */}

              <div className="flex justify-center">

                <div className="relative h-64 w-36 rounded-[2rem] border-4 border-white/80 bg-[#07152d] p-2 shadow-2xl sm:h-72 sm:w-40">

                  <div className="flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white">

                    <div className="h-7 bg-[#07152d]" />

                    <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white shadow-lg">
                        <Smartphone className="h-6 w-6" />
                      </div>

                      <p className="mt-3 text-sm font-black text-[#07152d]">
                        Shromobazar
                      </p>

                      <p className="mt-1 text-[9px] text-slate-500">
                        Workforce Platform
                      </p>

                      <div className="mt-4 flex gap-1">
                        <span className="h-1.5 w-6 rounded-full bg-orange-500" />
                        <span className="h-1.5 w-3 rounded-full bg-purple-500" />
                        <span className="h-1.5 w-3 rounded-full bg-green-500" />
                      </div>

                    </div>

                    <div className="h-8 bg-gradient-to-r from-[#14532d] to-[#244b78]" />

                  </div>
                </div>
              </div>

              {/* APP CONTENT */}

              <div>

                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-100">
                  Shromobazar App
                </p>

                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">

                  আপনার কাজ ও ব্যবসা

                  <span className="block text-orange-100">
                    হাতের মুঠোয়।
                  </span>

                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-orange-50 sm:text-base">
                  Job, Worker, Marketplace, Chat, Social Hub এবং
                  আপনার প্রয়োজনীয় digital services আরও সহজে ব্যবহার করুন।
                </p>

                <button
                  type="button"
                  className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-sm font-black text-[#c2410c] shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50"
                >
                  <Smartphone className="h-5 w-5" />
                  App Install করুন
                  <ArrowRight className="h-4 w-4" />
                </button>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}

      <section className="bg-[#07152d] px-5 py-20 text-center sm:px-8">

        <div className="mx-auto max-w-3xl">

          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
            Shromobazar
          </p>

          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">

            কাজ, কর্মী ও ব্যবসার জন্য

            <span className="block text-orange-400">
              একটি জায়গা।
            </span>

          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            শ্রমবাজারের সঙ্গে যুক্ত হোন এবং বাংলাদেশের
            workforce ecosystem-এর নতুন অভিজ্ঞতার অংশ হয়ে উঠুন।
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              নিবন্ধন করুন
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/workers"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              <Users className="h-4 w-4" />
              Workforce দেখুন
            </Link>

          </div>

        </div>
      </section>

    </main>
  );
}