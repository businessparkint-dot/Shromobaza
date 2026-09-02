"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CalendarDays,
  Clapperboard,
  FlaskConical,
  Globe2,
  Handshake,
  Landmark,
  MapPin,
  MessageCircle,
  Plane,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Trophy,
  UserRound,
  Users,
  Utensils,
  WalletCards,
  Wrench,
} from "lucide-react";

/* =========================================================
   POPULAR WORKER CATEGORIES
========================================================= */

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
   SMART MENU
   সব feature এখন OPEN / LIVE ROUTE
========================================================= */

const smartOptions = [
  {
    bn: "চাকরি",
    en: "Jobs",
    href: "/jobs",
    icon: BriefcaseBusiness,
    tone: "amber",
  },
  {
    bn: "কর্মী",
    en: "Workers",
    href: "/workers",
    icon: Users,
    tone: "blue",
  },
  {
    bn: "মার্কেটপ্লেস",
    en: "Marketplace",
    href: "/marketplace",
    icon: ShoppingBag,
    tone: "emerald",
  },
  {
    bn: "চ্যাট",
    en: "Chat",
    href: "/chat",
    icon: MessageCircle,
    tone: "cyan",
  },
  {
    bn: "সোশ্যাল হাব",
    en: "Social Hub",
    href: "/status-feed",
    icon: Users,
    tone: "violet",
  },
  {
    bn: "এন্টারটেইনমেন্ট",
    en: "Entertainment",
    href: "/entertainment",
    icon: Clapperboard,
    tone: "rose",
  },
  {
    bn: "স্বাস্থ্য",
    en: "Health",
    href: "/health",
    icon: "🩺",
    tone: "medical",
  },
  {
    bn: "গবেষণা ও ধারণা",
    en: "Research",
    href: "/research-market",
    icon: FlaskConical,
    tone: "purple",
  },
  {
    bn: "স্মার্ট স্পোর্টস",
    en: "Smart Sports",
    href: "/sports",
    icon: Trophy,
    tone: "gold",
  },
  {
    bn: "ফুড মার্কেট",
    en: "Food Market",
    href: "/food",
    icon: Utensils,
    tone: "orange",
  },
  {
    bn: "ধর্ম ও সভ্যতা",
    en: "Religion & Civilization",
    href: "/religion-civilization",
    icon: Landmark,
    tone: "peace",
  },
  {
    bn: "Good Work World",
    en: "Good Work World",
    href: "/good-work",
    icon: Handshake,
    tone: "emerald",
  },
  {
    bn: "গ্লোবাল বিজনেস",
    en: "Global Business",
    href: "/global-business",
    icon: Globe2,
    tone: "cyan",
  },
  {
    bn: "জ্ঞান",
    en: "Knowledge",
    href: "/knowledge",
    icon: BookOpen,
    tone: "indigo",
  },
  {
    bn: "ক্রিয়েটর ও বই",
    en: "Creator & Books",
    href: "/creator-books",
    icon: BookOpen,
    tone: "violet",
  },
  {
    bn: "প্রবাসী নেটওয়ার্ক",
    en: "Probashi Network",
    href: "/probashi-network",
    icon: Plane,
    tone: "sky",
  },
  {
    bn: "ইভেন্টস",
    en: "Events",
    href: "/events",
    icon: CalendarDays,
    tone: "rose",
  },
];

/* =========================================================
   SMART MENU COLORS
========================================================= */

const smartToneClasses: Record<string, string> = {
  blue: "border-blue-200 bg-blue-50/90 text-blue-700 hover:border-blue-400 hover:bg-blue-100",

  amber:
    "border-amber-200 bg-amber-50/90 text-amber-700 hover:border-amber-400 hover:bg-amber-100",

  emerald:
    "border-emerald-200 bg-emerald-50/90 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100",

  cyan: "border-cyan-200 bg-cyan-50/90 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-100",

  purple:
    "border-purple-200 bg-purple-50/90 text-purple-700 hover:border-purple-400 hover:bg-purple-100",

  medical:
    "border-sky-200 bg-gradient-to-br from-white via-sky-50 to-blue-50 text-[#075985] hover:border-sky-400 hover:shadow-[0_10px_30px_rgba(14,165,233,0.16)]",

  indigo:
    "border-indigo-200 bg-indigo-50/90 text-indigo-700 hover:border-indigo-400 hover:bg-indigo-100",

  violet:
    "border-violet-200 bg-violet-50/90 text-violet-700 hover:border-violet-400 hover:bg-violet-100",

  gold:
    "border-yellow-200 bg-yellow-50/90 text-yellow-700 hover:border-yellow-400 hover:bg-yellow-100",

  peace:
    "border-emerald-300 bg-gradient-to-br from-[#F0FDF4] via-[#ECFDF5] to-[#D1FAE5] text-[#065F46] hover:border-[#059669] hover:shadow-[0_10px_30px_rgba(5,150,105,0.18)]",

  orange:
    "border-orange-200 bg-orange-50/90 text-orange-700 hover:border-orange-400 hover:bg-orange-100",

  sky: "border-sky-200 bg-sky-50/90 text-sky-700 hover:border-sky-400 hover:bg-sky-100",

  rose: "border-rose-200 bg-rose-50/90 text-rose-700 hover:border-rose-400 hover:bg-rose-100",
};

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

/* =========================================================
   HOW IT WORKS
========================================================= */

const howItWorks = [
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
];

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  /* =======================================================
     WORKER SEARCH
  ======================================================= */

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
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

  /* =======================================================
     APP BUTTON
     App এখনো আলাদা install package না থাকায় informative alert
  ======================================================= */

  const handleAppInstall = () => {
    window.alert(
      "Shromobazar App — Mobile App experience প্রস্তুত করা হচ্ছে। Web platform এখনই ব্যবহার করতে পারেন।"
    );
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* =========================================================
          HERO
      ========================================================== */}

      <section className="relative overflow-hidden bg-[#07152d]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#c2410c]/20 blur-3xl sm:h-80 sm:w-80" />

          <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#14532d]/20 blur-3xl sm:h-96 sm:w-96" />

          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-700/10 blur-3xl sm:h-72 sm:w-72" />
        </div>

        <div className="relative mx-auto max-w-7xl px-3 pb-10 pt-3 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8 lg:pb-24 lg:pt-10">
          {/* =====================================================
              SMART MENU BAR
          ====================================================== */}

          <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.06] p-2 shadow-xl backdrop-blur-xl sm:mb-8 sm:p-2.5">
            <div className="flex items-center gap-2 overflow-x-auto overscroll-x-contain px-0.5 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* SMART MENU LABEL */}

              <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[10px] font-black text-white shadow-sm sm:px-4 sm:text-xs">
                <Globe2 className="h-4 w-4 text-orange-300" />

                <span>Smart Menu</span>
              </div>

              {/* ALL SMART OPTIONS */}

              {smartOptions.map((item) => {
                const tone = smartToneClasses[item.tone];

                const content = (
                  <>
                    {typeof item.icon === "string" ? (
                      <span className="text-base leading-none">
                        {item.icon}
                      </span>
                    ) : (
                      <item.icon className="h-4 w-4 shrink-0" />
                    )}

                    <span className="whitespace-nowrap">{item.en}</span>
                  </>
                );

                return (
                  <Link
                    key={item.en}
                    href={item.href}
                    className={`group flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-[10px] font-extrabold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:px-3.5 sm:text-xs ${tone}`}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              HERO CONTENT + SEARCH
          ====================================================== */}

          <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-12">
            {/* ===================================================
                HERO CONTENT
            ==================================================== */}

            <div className="min-w-0">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-semibold text-orange-200 backdrop-blur sm:px-4 sm:text-xs">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-orange-400 sm:h-4 sm:w-4" />

                <span>Bangladesh&apos;s Modern Workforce Platform</span>
              </div>

              <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                কাজ, কর্মী ও ব্যবসা—
                <br />
                <span className="text-orange-500">
                  একসাথে, এক জায়গায়।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
                <span className="font-bold text-white">শ্রমবাজার</span>{" "}
                একটি আধুনিক{" "}
                <span className="font-bold text-orange-400">
                  Global Workforce &amp; Business Ecosystem
                </span>
                , যেখানে শ্রমিক, পেশাজীবী, নিয়োগকর্তা, ক্রেতা, বিক্রেতা ও
                ব্যবসা প্রতিষ্ঠান কাজ, দক্ষ কর্মী, পণ্য, সেবা ও ব্যবসার সুযোগ
                খুঁজে পেতে এবং সংযুক্ত হতে পারে।
              </p>

              {/* CTA */}

              <div className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:flex sm:flex-row sm:gap-3">
                <Link
                  href="/workers"
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-[#ea580c] px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-[#c2410c] sm:px-6 sm:py-4"
                >
                  <Search className="h-5 w-5" />

                  কর্মী খুঁজুন

                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/jobs"
                  className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15 sm:px-6 sm:py-4"
                >
                  <BriefcaseBusiness className="h-5 w-5" />

                  কাজ খুঁজুন
                </Link>
              </div>

              {/* FEATURES */}

              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-slate-200 sm:mt-8 sm:flex sm:flex-wrap sm:gap-x-6 sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                  Worker Profile
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                  Job &amp; Hiring
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                  Marketplace
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                  Social Hub
                </span>
              </div>
            </div>

            {/* ===================================================
                SEARCH CARD
            ==================================================== */}

            <div className="relative min-w-0">
              <div className="absolute -inset-3 rounded-[2rem] bg-orange-500/10 blur-3xl sm:-inset-5 sm:rounded-[2.5rem]" />

              <div className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-2 shadow-2xl backdrop-blur-xl sm:rounded-[2rem] sm:p-4">
                <div className="rounded-[1.25rem] bg-white p-4 shadow-2xl sm:rounded-[1.5rem] sm:p-7">
                  {/* Search Header */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100">
                          <Search className="h-4 w-4 text-[#c2410c]" />
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#c2410c] sm:text-xs sm:tracking-[0.15em]">
                          Workforce Search
                        </p>
                      </div>

                      <h2 className="mt-2 text-xl font-black leading-tight text-[#07152d] sm:mt-3 sm:text-2xl">
                        আপনার প্রয়োজনের মানুষ
                      </h2>

                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        দক্ষ Worker বা Professional খুঁজে নিন
                      </p>
                    </div>

                    <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#07152d] text-white shadow-lg sm:flex">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Search Form */}

                  <form onSubmit={handleSearch} className="mt-5 sm:mt-6">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 transition focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-lg sm:p-4">
                      <label
                        htmlFor="workforce-search"
                        className="flex items-center gap-2 text-[11px] font-bold text-slate-500 sm:text-xs"
                      >
                        <Search className="h-3.5 w-3.5 text-orange-500" />

                        আমি খুঁজছি
                      </label>

                      <input
                        id="workforce-search"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Mason, Technician, Driver..."
                        className="mt-2 w-full border-0 bg-transparent p-0 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 sm:text-base"
                      />
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                      <div className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 transition focus-within:border-orange-400 focus-within:bg-white focus-within:shadow-lg sm:px-4">
                        <MapPin className="h-5 w-5 shrink-0 text-[#7f1d1d]" />

                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="কোন এলাকায়?"
                          className="w-full min-w-0 border-0 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0"
                        />
                      </div>

                      <button
                        type="submit"
                        className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ea580c] to-[#c2410c] px-6 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:px-7"
                      >
                        <Search className="h-4 w-4" />

                        Search
                      </button>
                    </div>
                  </form>

                  {/* Popular Searches */}

                  <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                    {["Mason", "Electrician", "Driver", "Engineer"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSearchTerm(item)}
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-semibold text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-[#c2410c] sm:px-3 sm:text-xs"
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>

                  {/* Featured Worker */}

                  <div className="mt-5 rounded-2xl bg-[#07152d] p-3.5 sm:mt-6 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white sm:h-12 sm:w-12">
                        <UserRound className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">
                          Skilled Professional
                        </p>

                        <p className="mt-1 text-[10px] text-slate-300 sm:text-xs">
                          Verified Workforce Profile
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 text-xs font-bold text-orange-300">
                        <Star className="h-3.5 w-3.5 fill-current" />

                        5.0
                      </div>
                    </div>
                  </div>
                </div>

                {/* QUICK LINKS */}

                <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
                  <Link
                    href="/jobs"
                    className="rounded-2xl bg-[#7f1d1d] p-2.5 text-center transition hover:-translate-y-0.5 hover:shadow-lg sm:p-3"
                  >
                    <p className="text-sm font-black text-white sm:text-lg">
                      Jobs
                    </p>

                    <p className="mt-0.5 text-[9px] text-red-100 sm:mt-1 sm:text-[11px]">
                      Find work
                    </p>
                  </Link>

                  <Link
                    href="/workers"
                    className="rounded-2xl bg-[#14532d] p-2.5 text-center transition hover:-translate-y-0.5 hover:shadow-lg sm:p-3"
                  >
                    <p className="text-sm font-black text-white sm:text-lg">
                      Workers
                    </p>

                    <p className="mt-0.5 text-[9px] text-green-100 sm:mt-1 sm:text-[11px]">
                      Hire talent
                    </p>
                  </Link>

                  <Link
                    href="/marketplace"
                    className="rounded-2xl bg-[#c2410c] p-2.5 text-center transition hover:-translate-y-0.5 hover:shadow-lg sm:p-3"
                  >
                    <p className="text-sm font-black text-white sm:text-lg">
                      Market
                    </p>

                    <p className="mt-0.5 text-[9px] text-orange-100 sm:mt-1 sm:text-[11px]">
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
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-3 py-5 text-center sm:px-6 sm:py-7"
            >
              <p className="text-xl font-black text-[#07152d] sm:text-3xl">
                {stat.value}
              </p>

              <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          NOTICES
      ========================================================== */}

      <section className="bg-slate-50 px-4 py-12 sm:px-8 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#c2410c]">
                <Bell className="h-4 w-4" />

                বিজ্ঞপ্তি
              </div>

              <h2 className="mt-3 text-2xl font-black leading-tight text-[#07152d] sm:text-3xl">
                নতুন সুযোগ ও আপডেট
              </h2>

              <p className="mt-2 text-xs leading-6 text-slate-500 sm:text-sm">
                Social Hub, Job এবং Marketplace-এর গুরুত্বপূর্ণ আপডেট দেখুন।
              </p>
            </div>

            <Link
              href="/status-feed"
              className="inline-flex w-fit items-center gap-2 text-xs font-bold text-[#7f1d1d] sm:text-sm"
            >
              Social Hub

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 md:grid-cols-3">
            {notices.map((notice) => {
              const Icon = notice.icon;

              return (
                <Link
                  key={notice.title}
                  href={notice.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl sm:p-5"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white sm:h-12 sm:w-12 ${notice.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-[#07152d] sm:text-base">
                        {notice.title}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
                        {notice.text}
                      </p>
                    </div>

                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
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

      <section className="bg-white px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c2410c] sm:text-sm sm:tracking-[0.18em]">
                Popular Categories
              </p>

              <h2 className="mt-2.5 text-2xl font-black leading-tight tracking-tight text-[#07152d] sm:mt-3 sm:text-4xl">
                আপনার প্রয়োজনের দক্ষ মানুষ
              </h2>

              <p className="mt-2.5 max-w-2xl text-xs leading-6 text-slate-500 sm:mt-3 sm:text-base sm:leading-7">
                লেবার, মিস্ত্রি, টেকনিশিয়ান, ডাক্তার, ইঞ্জিনিয়ার,
                ড্রাইভার, আইনজীবীসহ বিভিন্ন পেশার মানুষ খুঁজে নিন।
              </p>
            </div>

            <Link
              href="/workers"
              className="inline-flex w-fit items-center gap-2 text-xs font-bold text-[#7f1d1d] sm:text-sm"
            >
              সব Worker দেখুন

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.title}
                  href="/workers"
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:rounded-3xl sm:p-5"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm sm:h-14 sm:w-14 sm:rounded-2xl ${category.color}`}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-black text-slate-900 sm:text-base">
                        {category.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">
                        {category.subtitle}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
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

      <section className="bg-slate-50 px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#14532d] sm:text-sm sm:tracking-[0.18em]">
              Create Opportunity
            </p>

            <h2 className="mt-2.5 text-2xl font-black leading-tight text-[#07152d] sm:mt-3 sm:text-4xl">
              আপনার প্রয়োজনীয় পোস্ট দিন
            </h2>

            <p className="mx-auto mt-2.5 max-w-2xl text-xs leading-6 text-slate-500 sm:mt-3 sm:text-base sm:leading-7">
              কাজ দিতে, পণ্য বা সেবা বিক্রি করতে অথবা কোনো পণ্য
              কিনতে চাইলে আলাদা পোস্ট তৈরি করুন।
            </p>
          </div>

          <div className="mt-7 grid gap-3.5 sm:mt-10 sm:gap-5 md:grid-cols-3">
            {/* JOB POST */}

            <Link
              href="/post-job"
              className="group rounded-[1.5rem] bg-[#07152d] p-5 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem] sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 sm:h-14 sm:w-14 sm:rounded-2xl">
                <BriefcaseBusiness className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <h3 className="mt-5 text-xl font-black sm:mt-6 sm:text-2xl">
                Job Post দিন
              </h3>

              <p className="mt-2.5 text-xs leading-6 text-blue-100 sm:mt-3 sm:text-sm sm:leading-7">
                আপনার প্রতিষ্ঠানের প্রয়োজনীয় Worker বা
                Professional-এর জন্য Job Post করুন।
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-orange-300 sm:mt-6 sm:text-sm">
                Job Post করুন

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>

            {/* SELL POST */}

            <Link
              href="/marketplace"
              className="group rounded-[1.5rem] bg-[#c2410c] p-5 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem] sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 sm:h-14 sm:w-14 sm:rounded-2xl">
                <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <h3 className="mt-5 text-xl font-black sm:mt-6 sm:text-2xl">
                Sell Post দিন
              </h3>

              <p className="mt-2.5 text-xs leading-6 text-orange-100 sm:mt-3 sm:text-sm sm:leading-7">
                আপনার পণ্য বা সেবা Marketplace-এ পোস্ট করে
                ক্রেতার কাছে পৌঁছে দিন।
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white sm:mt-6 sm:text-sm">
                Sell Post করুন

                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>

            {/* BUY REQUEST */}

            <Link
              href="/buy-requests"
              className="group rounded-[1.5rem] bg-[#14532d] p-5 text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2rem] sm:p-7"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 sm:h-14 sm:w-14 sm:rounded-2xl">
                <Search className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>

              <h3 className="mt-5 text-xl font-black sm:mt-6 sm:text-2xl">
                Buy Post দিন
              </h3>

              <p className="mt-2.5 text-xs leading-6 text-green-100 sm:mt-3 sm:text-sm sm:leading-7">
                আপনি কী কিনতে চান বা কোন পণ্য প্রয়োজন—
                Buy Post দিয়ে জানিয়ে দিন।
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-green-100 sm:mt-6 sm:text-sm">
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

      <section className="bg-white px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#14532d] sm:text-sm sm:tracking-[0.18em]">
              How Shromobazar Works
            </p>

            <h2 className="mt-2.5 text-2xl font-black leading-tight text-[#07152d] sm:mt-3 sm:text-4xl">
              কাজের সংযোগ এখন আরও সহজ
            </h2>
          </div>

          <div className="mt-8 grid gap-3.5 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {howItWorks.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-white sm:h-12 sm:w-12 ${item.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-3xl font-black text-slate-100 sm:text-4xl">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-[#07152d] sm:mt-7 sm:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-6 text-slate-500 sm:mt-3 sm:text-sm sm:leading-7">
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

      <section className="bg-slate-50 px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[1.5rem] bg-[#07152d] p-5 shadow-2xl sm:rounded-[2rem] sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_.85fr] lg:items-center lg:gap-10">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl">
                  <Store className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-orange-400 sm:mt-6 sm:text-sm sm:tracking-[0.18em]">
                  Marketplace Business
                </p>

                <h2 className="mt-2.5 text-2xl font-black leading-tight text-white sm:mt-3 sm:text-4xl">
                  নিজের Shop বা Office তৈরি করুন।
                </h2>

                <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
                  আপনার ব্যবসা, পণ্য বা professional service-এর জন্য
                  Shromobazar-এ নিজের digital presence তৈরি করুন।
                </p>

                <div className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-7 sm:flex sm:flex-row sm:gap-3">
                  <Link
                    href="/marketplace"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-4 py-3 text-xs font-bold text-white transition hover:bg-orange-700 sm:px-5 sm:py-3.5 sm:text-sm"
                  >
                    <Store className="h-4 w-4" />

                    Open Your Shop
                  </Link>

                  <Link
                    href="/marketplace"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#7f1d1d] px-4 py-3 text-xs font-bold text-white transition hover:bg-red-800 sm:px-5 sm:py-3.5 sm:text-sm"
                  >
                    <Building2 className="h-4 w-4" />

                    Open Your Office
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                <div className="rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                  <Store className="h-6 w-6 text-[#c2410c] sm:h-7 sm:w-7" />

                  <p className="mt-3 text-sm font-black text-[#07152d] sm:mt-4">
                    Your Shop
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                    পণ্য ও সেবা প্রদর্শন
                  </p>
                </div>

                <div className="rounded-xl bg-[#14532d] p-4 text-white sm:rounded-2xl sm:p-5">
                  <Building2 className="h-6 w-6 sm:h-7 sm:w-7" />

                  <p className="mt-3 text-sm font-black sm:mt-4">
                    Your Office
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-green-100 sm:text-xs">
                    Business presence
                  </p>
                </div>

                <div className="rounded-xl bg-[#7f1d1d] p-4 text-white sm:rounded-2xl sm:p-5">
                  <ShoppingBag className="h-6 w-6 sm:h-7 sm:w-7" />

                  <p className="mt-3 text-sm font-black sm:mt-4">
                    Sell
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-red-100 sm:text-xs">
                    পণ্য ও সেবা
                  </p>
                </div>

                <div className="rounded-xl bg-[#c2410c] p-4 text-white sm:rounded-2xl sm:p-5">
                  <Search className="h-6 w-6 sm:h-7 sm:w-7" />

                  <p className="mt-3 text-sm font-black sm:mt-4">
                    Buy
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-orange-100 sm:text-xs">
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

      <section className="bg-[#07152d] px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400 sm:text-sm sm:tracking-[0.18em]">
                One Ecosystem
              </p>

              <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-4xl">
                শুধু Job নয়,

                <span className="block text-orange-400">
                  একটি সম্পূর্ণ Ecosystem
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-xs leading-7 text-slate-300 sm:text-base sm:leading-8">
                Worker, Employer, Buyer, Seller এবং Business—
                সবাই প্রয়োজনীয় digital tools একটি platform থেকেই
                ব্যবহার করতে পারবে।
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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
                    className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09] sm:rounded-3xl sm:p-6"
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-white sm:h-12 sm:w-12 ${iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-sm font-black text-white sm:mt-5">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-300 sm:text-sm">
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

      <section className="bg-white px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#8b2f09] via-[#b83b0a] to-[#6d1830] p-5 shadow-2xl sm:rounded-[2rem] sm:p-10 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-10">
              {/* PHONE */}

              <div className="flex justify-center">
                <div className="relative h-60 w-32 rounded-[1.75rem] border-4 border-white/80 bg-[#07152d] p-2 shadow-2xl sm:h-72 sm:w-40 sm:rounded-[2rem]">
                  <div className="flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white sm:rounded-[1.5rem]">
                    <div className="h-6 bg-[#07152d] sm:h-7" />

                    <div className="flex flex-1 flex-col items-center justify-center p-3 text-center sm:p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white shadow-lg sm:h-12 sm:w-12">
                        <Smartphone className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>

                      <p className="mt-3 text-xs font-black text-[#07152d] sm:text-sm">
                        Shromobazar
                      </p>

                      <p className="mt-1 text-[8px] text-slate-500 sm:text-[9px]">
                        Workforce Platform
                      </p>

                      <div className="mt-3 flex gap-1 sm:mt-4">
                        <span className="h-1.5 w-5 rounded-full bg-orange-500 sm:w-6" />

                        <span className="h-1.5 w-3 rounded-full bg-purple-500" />

                        <span className="h-1.5 w-3 rounded-full bg-green-500" />
                      </div>
                    </div>

                    <div className="h-7 bg-gradient-to-r from-[#14532d] to-[#244b78] sm:h-8" />
                  </div>
                </div>
              </div>

              {/* APP CONTENT */}

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-100 sm:text-sm sm:tracking-[0.18em]">
                  Shromobazar App
                </p>

                <h2 className="mt-2.5 text-2xl font-black leading-tight text-white sm:mt-3 sm:text-4xl">
                  আপনার কাজ ও ব্যবসা

                  <span className="block text-orange-100">
                    হাতের মুঠোয়।
                  </span>
                </h2>

                <p className="mt-3 text-xs leading-6 text-orange-50 sm:mt-4 sm:text-base sm:leading-7">
                  Job, Worker, Marketplace, Chat, Social Hub এবং
                  আপনার প্রয়োজনীয় digital services আরও সহজে ব্যবহার করুন।
                </p>

                <button
                  type="button"
                  onClick={handleAppInstall}
                  className="mt-5 inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-xs font-black text-[#c2410c] shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50 sm:mt-7 sm:w-auto sm:px-6 sm:py-4 sm:text-sm"
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

      <section className="bg-[#07152d] px-4 py-14 text-center sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400 sm:text-sm sm:tracking-[0.18em]">
            Shromobazar
          </p>

          <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:mt-4 sm:text-4xl">
            কাজ, কর্মী ও ব্যবসার জন্য

            <span className="block text-orange-400">
              একটি জায়গা।
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-slate-300 sm:mt-5 sm:text-base sm:leading-7">
            শ্রমবাজারের সঙ্গে যুক্ত হোন এবং বাংলাদেশের
            workforce ecosystem-এর নতুন অভিজ্ঞতার অংশ হয়ে উঠুন।
          </p>

          <div className="mt-6 grid gap-2.5 sm:mt-8 sm:flex sm:flex-row sm:justify-center sm:gap-3">
            <Link
              href="/register"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-6 py-3.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-orange-700 sm:text-sm"
            >
              নিবন্ধন করুন

              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/workers"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-white/10 sm:text-sm"
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