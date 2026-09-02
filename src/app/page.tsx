"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clapperboard,
  FlaskConical,
  Globe2,
  GraduationCap,
  Handshake,
  HeartPulse,
  Landmark,
  Lightbulb,
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

const categories = [
  {
    title: "লেবার ও মিস্ত্রি",
    subtitle: "দক্ষ ও অভিজ্ঞ কর্মী",
    icon: Wrench,
    href: "/workers",
  },
  {
    title: "টেকনিশিয়ান",
    subtitle: "ইলেকট্রিক, AC, মেশিনসহ",
    icon: BriefcaseBusiness,
    href: "/workers",
  },
  {
    title: "ড্রাইভার",
    subtitle: "পেশাদার ও যাচাইযোগ্য",
    icon: UserRound,
    href: "/workers",
  },
  {
    title: "ইঞ্জিনিয়ার",
    subtitle: "টেকনিক্যাল ও প্রফেশনাল",
    icon: Building2,
    href: "/workers",
  },
  {
    title: "ডাক্তার ও স্বাস্থ্যসেবা",
    subtitle: "স্বাস্থ্য ও চিকিৎসা সেবা",
    icon: HeartPulse,
    href: "/health",
  },
  {
    title: "আইনজীবী",
    subtitle: "আইনি সহায়তা ও পরামর্শ",
    icon: Landmark,
    href: "#",
  },
  {
    title: "অন্যান্য পেশা",
    subtitle: "আরও অনেক দক্ষতা",
    icon: Users,
    href: "/workers",
  },
];

const smartOptions = [
  {
    title: "Workers",
    label: "কর্মী",
    description: "Find & Hire",
    icon: Users,
    href: "/workers",
    active: true,
    badge: "",
  },
  {
    title: "Jobs",
    label: "চাকরি",
    description: "Find Work",
    icon: BriefcaseBusiness,
    href: "/jobs",
    active: true,
    badge: "",
  },
  {
    title: "Marketplace",
    label: "মার্কেট",
    description: "Buy & Sell",
    icon: ShoppingBag,
    href: "/marketplace",
    active: true,
    badge: "",
  },
  {
    title: "Global Business",
    label: "গ্লোবাল বিজনেস",
    description: "Foreign Company • Investor",
    icon: Globe2,
    href: "#",
    active: false,
    badge: "SOON",
  },
  {
    title: "Research & Concept",
    label: "গবেষণা",
    description: "Idea & Innovation",
    icon: FlaskConical,
    href: "/research-market",
    active: true,
    badge: "NEW",
  },
  {
    title: "Health",
    label: "স্বাস্থ্য",
    description: "Smart Health",
    icon: HeartPulse,
    href: "/health",
    active: true,
    badge: "NEW",
  },
  {
    title: "Knowledge",
    label: "জ্ঞান",
    description: "Learn & Teach",
    icon: GraduationCap,
    href: "#",
    active: false,
    badge: "SOON",
  },
  {
    title: "Creator & Books",
    label: "ক্রিয়েটর",
    description: "Books & Content",
    icon: BookOpen,
    href: "#",
    active: false,
    badge: "SOON",
  },
  {
    title: "Smart Sports",
    label: "স্পোর্টস",
    description: "Teams & Players",
    icon: Trophy,
    href: "#",
    active: false,
    badge: "SOON",
  },
  {
    title: "Religion & Civilization",
    label: "জ্ঞান ও সভ্যতা",
    description: "Knowledge & Service",
    icon: Landmark,
    href: "#",
    active: false,
    badge: "SOON",
  },
  {
    title: "Food Market",
    label: "ফুড মার্কেট",
    description: "Food & Agriculture",
    icon: Utensils,
    href: "#",
    active: false,
    badge: "SOON",
  },
  {
    title: "Probashi Network",
    label: "প্রবাসী",
    description: "Global Bangladesh",
    icon: Plane,
    href: "#",
    active: false,
    badge: "SOON",
  },
  {
    title: "Events",
    label: "ইভেন্ট",
    description: "Events & Competitions",
    icon: CalendarDays,
    href: "#",
    active: false,
    badge: "SOON",
  },
];

const ecosystemItems = [
  {
    title: "Jobs",
    description: "কাজের সুযোগ",
    icon: BriefcaseBusiness,
    href: "/jobs",
  },
  {
    title: "Workers",
    description: "দক্ষ কর্মী",
    icon: Users,
    href: "/workers",
  },
  {
    title: "Marketplace",
    description: "কেনা-বেচা",
    icon: ShoppingBag,
    href: "/marketplace",
  },
  {
    title: "Chat",
    description: "সরাসরি যোগাযোগ",
    icon: MessageCircle,
    href: "#",
  },
  {
    title: "Social Hub",
    description: "কমিউনিটি",
    icon: Bell,
    href: "#",
  },
  {
    title: "Entertainment",
    description: "মিডিয়া ও বিনোদন",
    icon: Clapperboard,
    href: "#",
  },
];

const notices = [
  {
    tag: "Social Hub",
    title: "আপনার কাজ, দক্ষতা ও অভিজ্ঞতা সবার সামনে তুলে ধরুন",
    icon: MessageCircle,
  },
  {
    tag: "Job Post",
    title: "নতুন কাজের সুযোগ খুঁজুন অথবা আপনার প্রয়োজনের কাজ পোস্ট করুন",
    icon: BriefcaseBusiness,
  },
  {
    tag: "Marketplace",
    title: "পণ্য, সেবা ও ব্যবসার সুযোগ এক জায়গায়",
    icon: ShoppingBag,
  },
];

const features = [
  {
    title: "বিশ্বস্ত Workforce",
    description: "কর্মী ও নিয়োগদাতার জন্য structured profile ও যোগাযোগ ব্যবস্থা।",
    icon: ShieldCheck,
  },
  {
    title: "কাজের সুযোগ",
    description: "চাকরি, কাজ ও project opportunity সহজে খুঁজে পাওয়া।",
    icon: BriefcaseBusiness,
  },
  {
    title: "Marketplace",
    description: "পণ্য, সেবা, shop ও business opportunity-এর জন্য digital market।",
    icon: ShoppingBag,
  },
  {
    title: "Smart Platform",
    description: "কাজের পাশাপাশি জ্ঞান, ব্যবসা, যোগাযোগ ও ভবিষ্যৎ সুযোগ।",
    icon: Sparkles,
  },
];

const stats = [
  {
    value: "01",
    label: "Unified Platform",
  },
  {
    value: "24/7",
    label: "Digital Access",
  },
  {
    value: "∞",
    label: "Growth Opportunity",
  },
  {
    value: "100%",
    label: "Workforce Focused",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Profile তৈরি করুন",
    description: "আপনার দক্ষতা, পেশা, অভিজ্ঞতা ও প্রয়োজনীয় তথ্য যুক্ত করুন।",
    icon: UserRound,
  },
  {
    step: "02",
    title: "সুযোগ খুঁজুন",
    description: "কাজ, কর্মী, পণ্য, সেবা ও ভবিষ্যতের নতুন সুযোগ খুঁজে নিন।",
    icon: Search,
  },
  {
    step: "03",
    title: "যোগাযোগ ও কাজ শুরু করুন",
    description: "সঠিক মানুষের সাথে যোগাযোগ করে বাস্তব কাজ বা ব্যবসার সম্পর্ক তৈরি করুন।",
    icon: Handshake,
  },
];

const globalBusinessItems = [
  {
    title: "Foreign Company",
    description: "বাংলাদেশের workforce, supplier ও service provider খুঁজুন।",
    icon: Building2,
  },
  {
    title: "International Investor",
    description: "Investment opportunity ও সম্ভাবনাময় project খুঁজে নিন।",
    icon: WalletCards,
  },
  {
    title: "Global Partner",
    description: "International partnership ও business collaboration তৈরি করুন।",
    icon: Handshake,
  },
  {
    title: "Global Talent",
    description: "দক্ষ workforce ও professional talent-এর সাথে যুক্ত হন।",
    icon: Globe2,
  },
];

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    window.location.href = `/workers?${params.toString()}`;
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#07111f] text-white">
        <div className="absolute inset-0">
          <div className="absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-orange-500/20 blur-[120px]" />
          <div className="absolute right-[-10%] top-[10%] h-[460px] w-[460px] rounded-full bg-emerald-500/15 blur-[130px]" />
          <div className="absolute bottom-[-25%] left-[35%] h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
          {/* SMART OPTION BAR */}
          <div className="mb-10 overflow-hidden">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Sparkles className="h-4 w-4 text-orange-400" />
              Shromobazar Ecosystem
            </div>

            <div className="flex gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {smartOptions.map((option) => {
                const Icon = option.icon;

                if (!option.active) {
                  return (
                    <div
                      key={option.title}
                      className="group relative min-w-[150px] shrink-0 cursor-default rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 opacity-75 transition hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      {option.badge && (
                        <span className="absolute right-2 top-2 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-slate-300">
                          {option.badge}
                        </span>
                      )}

                      <Icon className="mb-2 h-5 w-5 text-slate-300 transition group-hover:text-white" />

                      <div className="text-sm font-bold">{option.label}</div>
                      <div className="mt-0.5 text-[11px] text-slate-400">
                        {option.description}
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={option.title}
                    href={option.href}
                    className="group relative min-w-[150px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 transition hover:-translate-y-0.5 hover:border-orange-400/40 hover:bg-white/[0.1]"
                  >
                    {option.badge && (
                      <span className="absolute right-2 top-2 rounded-full bg-orange-400/15 px-2 py-0.5 text-[9px] font-bold tracking-wide text-orange-300">
                        {option.badge}
                      </span>
                    )}

                    <Icon className="mb-2 h-5 w-5 text-orange-300 transition group-hover:scale-110" />

                    <div className="text-sm font-bold">{option.label}</div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      {option.description}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr]">
            {/* HERO COPY */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-slate-300">
                <Globe2 className="h-4 w-4 text-emerald-300" />
                Global Workforce Platform
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                কাজ থেকে জ্ঞান,
                <span className="block bg-gradient-to-r from-orange-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent">
                  জ্ঞান থেকে সুযোগ।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                কাজ, জ্ঞান, ব্যবসা, কর্মী, marketplace এবং নতুন সুযোগ—
                একসাথে একটি smart digital ecosystem।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/workers"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
                >
                  কর্মী খুঁজুন
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/[0.1]"
                >
                  কাজ খুঁজুন
                  <BriefcaseBusiness className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Worker Profile", UserRound],
                  ["Job & Hiring", BriefcaseBusiness],
                  ["Marketplace", ShoppingBag],
                  ["Global Business", Globe2],
                ].map(([label, Icon]) => {
                  const ItemIcon = Icon as typeof UserRound;

                  return (
                    <div
                      key={label as string}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-center"
                    >
                      <ItemIcon className="mx-auto mb-2 h-4 w-4 text-orange-300" />
                      <div className="text-[11px] font-semibold text-slate-300">
                        {label as string}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SEARCH CARD */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-orange-500/20 via-transparent to-emerald-500/20 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <Search className="h-5 w-5 text-orange-300" />
                    Workforce Search
                  </div>
                  <p className="mt-2 text-xs leading-6 text-slate-400">
                    পেশা, দক্ষতা অথবা location দিয়ে আপনার প্রয়োজনের মানুষ খুঁজুন।
                  </p>
                </div>

                <form onSubmit={handleSearch} className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="যেমন: Mason, Electrician, Driver..."
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                    />
                  </div>

                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="Location"
                      className="h-12 w-full rounded-xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-orange-400/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-black text-slate-900 transition hover:bg-orange-50"
                  >
                    Search Workforce
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                <div className="mt-6">
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Popular Searches
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Mason", "Electrician", "Driver", "Engineer"].map(
                      (item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSearch(item)}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300 transition hover:border-orange-400/30 hover:text-white"
                        >
                          {item}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10">
                    <Star className="h-4 w-4 text-emerald-300" />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white">
                      Featured Workforce
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-400">
                      দক্ষ মানুষকে visibility দেওয়ার জন্য smart profile system
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-slate-100 px-5 py-4 text-center first:border-0 lg:border-l"
            >
              <div className="text-2xl font-black text-slate-900 sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SMART ECOSYSTEM */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
              <Sparkles className="h-3.5 w-3.5" />
              Smart Ecosystem
            </div>

            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              শুধু চাকরি নয়—
              <span className="block text-orange-600">
                একটি পূর্ণাঙ্গ সুযোগের প্ল্যাটফর্ম।
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Workforce থেকে marketplace, research, health, knowledge,
              global business এবং ভবিষ্যতের আরও অনেক vertical একই ecosystem-এর
              মধ্যে যুক্ত হবে।
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystemItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 transition group-hover:bg-orange-50">
                      <Icon className="h-5 w-5 text-slate-700 group-hover:text-orange-600" />
                    </div>

                    <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                  </div>

                  <h3 className="mt-5 font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* NOTICES */}
      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Latest Updates
              </div>
              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                Platform Updates
              </h2>
            </div>

            <Link
              href="#"
              className="inline-flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-orange-600"
            >
              সব দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {notices.map((notice) => {
              const Icon = notice.icon;

              return (
                <div
                  key={notice.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                      <Icon className="h-5 w-5 text-orange-600" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                      {notice.tag}
                    </span>
                  </div>

                  <p className="mt-5 text-sm font-bold leading-6 text-slate-800">
                    {notice.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Workforce Categories
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              আপনার প্রয়োজনের দক্ষ মানুষ খুঁজুন
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              বিভিন্ন পেশা ও দক্ষতার মানুষকে একটি structured digital profile-এর
              মাধ্যমে খুঁজে পাওয়ার ব্যবস্থা।
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 transition group-hover:bg-orange-50">
                    <Icon className="h-6 w-6 text-slate-700 group-hover:text-orange-600" />
                  </div>

                  <h3 className="mt-5 font-black text-slate-900">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {category.subtitle}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-xs font-bold text-orange-600 opacity-0 transition group-hover:opacity-100">
                    দেখুন
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* GLOBAL BUSINESS */}
      <section className="bg-[#07111f] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-emerald-300">
                <Globe2 className="h-4 w-4" />
                Global Business
              </div>

              <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                বাংলাদেশ থেকে
                <span className="block text-emerald-300">
                  বিশ্বের সাথে business connection।
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Foreign Company, International Investor, Global Partner,
                International Employer এবং Global Talent—ভবিষ্যতে Shromobazar
                তাদের জন্যও একটি structured digital gateway তৈরি করবে।
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold text-slate-300">
                  Foreign Company
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold text-slate-300">
                  Investor
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold text-slate-300">
                  International Partner
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {globalBusinessItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:bg-white/[0.08]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10">
                      <Icon className="h-5 w-5 text-emerald-300" />
                    </div>

                    <h3 className="mt-5 font-black">{item.title}</h3>

                    <p className="mt-2 text-xs leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CREATE OPPORTUNITY */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-slate-900 p-7 text-white sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange-300">
                  Create Opportunity
                </div>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  শুধু সুযোগ খুঁজবেন না,
                  <span className="block text-orange-300">
                    সুযোগ তৈরি করুন।
                  </span>
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-300">
                  কাজ পোস্ট করুন, পণ্য বিক্রি করুন অথবা আপনি যে পণ্যটি কিনতে
                  চান সেটির জন্য buy request তৈরি করুন।
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Link
                  href="/jobs"
                  className="group rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:bg-white/[0.09]"
                >
                  <BriefcaseBusiness className="h-6 w-6 text-orange-300" />
                  <h3 className="mt-5 font-black">Job Post</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-400">
                    কর্মী প্রয়োজন? কাজ পোস্ট করুন।
                  </p>
                  <ArrowRight className="mt-5 h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-orange-300" />
                </Link>

                <Link
                  href="/marketplace"
                  className="group rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:bg-white/[0.09]"
                >
                  <Store className="h-6 w-6 text-emerald-300" />
                  <h3 className="mt-5 font-black">Sell Post</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-400">
                    আপনার পণ্য বা service marketplace-এ দিন।
                  </p>
                  <ArrowRight className="mt-5 h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-emerald-300" />
                </Link>

                <Link
                  href="/marketplace"
                  className="group rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition hover:bg-white/[0.09]"
                >
                  <ShoppingBag className="h-6 w-6 text-purple-300" />
                  <h3 className="mt-5 font-black">Buy Post</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-400">
                    আপনি কী কিনতে চান তা জানান।
                  </p>
                  <ArrowRight className="mt-5 h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-purple-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
              How It Works
            </div>

            <h2 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
              সহজভাবে শুরু করুন
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {howItWorks.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
                      <Icon className="h-5 w-5 text-orange-600" />
                    </div>

                    <span className="text-4xl font-black text-slate-100">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="mt-6 font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MARKETPLACE BUSINESS */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-[2rem] bg-gradient-to-br from-orange-50 to-amber-50 p-7 sm:p-9">
              <Store className="h-8 w-8 text-orange-600" />

              <h2 className="mt-6 text-3xl font-black text-slate-900">
                Open Your Shop
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                আপনার পণ্য ও service-এর জন্য digital shop তৈরি করুন এবং
                marketplace-এর মাধ্যমে customers-এর কাছে পৌঁছান।
              </p>

              <Link
                href="/marketplace"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Marketplace দেখুন
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Open Your Office",
                  description: "আপনার service বা professional business-এর digital presence তৈরি করুন।",
                  icon: Building2,
                },
                {
                  title: "Your Shop",
                  description: "পণ্য ও service customer-এর সামনে তুলে ধরুন।",
                  icon: Store,
                },
                {
                  title: "Sell",
                  description: "Marketplace-এ আপনার পণ্য বা service publish করুন।",
                  icon: ShoppingBag,
                },
                {
                  title: "Buy",
                  description: "প্রয়োজনীয় পণ্য বা service-এর জন্য request তৈরি করুন।",
                  icon: Handshake,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200 p-5"
                  >
                    <Icon className="h-6 w-6 text-slate-700" />
                    <h3 className="mt-5 font-black text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600">
                Platform Features
              </div>

              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                একটি connected digital ecosystem
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-600">
                Shromobazar-এর লক্ষ্য শুধু worker ও job matching নয়। ভবিষ্যতে
                knowledge, creator, research, sports, food, probashi, global
                business এবং community-কে একটি ecosystem-এর মধ্যে আনা।
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                      <Icon className="h-5 w-5 text-orange-600" />
                    </div>

                    <h3 className="mt-5 font-black text-slate-900">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* APP SECTION */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-7 text-white sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-orange-300">
                  <Smartphone className="h-5 w-5" />
                  Digital Platform
                </div>

                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                  আপনার কাজ ও সুযোগ
                  <span className="block text-orange-300">
                    সবসময় আপনার সাথে।
                  </span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
                  Profile, jobs, workforce, marketplace, communication এবং
                  ভবিষ্যতের ecosystem services—একটি connected experience-এর
                  দিকে এগিয়ে যাচ্ছে Shromobazar।
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Smart Profile
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Jobs & Hiring
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-xs font-semibold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Marketplace
                  </div>
                </div>
              </div>

              <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] sm:h-40 sm:w-40">
                <Globe2 className="h-16 w-16 text-orange-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100">
            <Sparkles className="h-7 w-7 text-orange-600" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            আপনার দক্ষতা,
            <span className="block text-orange-600">
              আপনার সুযোগ, আপনার ভবিষ্যৎ।
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Shromobazar-এর সাথে আপনার profile তৈরি করুন, কাজ খুঁজুন, কর্মী
            খুঁজুন, business তৈরি করুন এবং ভবিষ্যতের global ecosystem-এর অংশ
            হোন।
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
            >
              শুরু করুন
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/workers"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-800 transition hover:border-orange-200 hover:text-orange-600"
            >
              Workforce দেখুন
              <Users className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}