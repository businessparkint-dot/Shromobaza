"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Film,
  Tv,
  Radio,
  Trophy,
  Clapperboard,
  Globe2,
  Sparkles,
  Video,
  Upload,
  Clock3,
  Wallet,
  BarChart3,
  ChevronRight,
  Search,
  Crown,
  Music2,
} from "lucide-react";

type EntertainmentItem = {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ElementType;
};

const entertainmentItems: EntertainmentItem[] = [
  {
    title: "Movies",
    subtitle: "Movies & trailers",
    href: "/entertainment/movies",
    icon: Film,
  },
  {
    title: "OTT",
    subtitle: "OTT content",
    href: "/entertainment/ott",
    icon: Tv,
  },
  {
    title: "Live",
    subtitle: "Live entertainment",
    href: "/entertainment/live",
    icon: Radio,
  },
  {
    title: "TV Serial",
    subtitle: "Popular serials",
    href: "/entertainment/tv-serial",
    icon: Tv,
  },
  {
    title: "Web Series",
    subtitle: "Web series",
    href: "/entertainment/web-series",
    icon: Globe2,
  },
  {
    title: "নাটক",
    subtitle: "Bangla drama",
    href: "/entertainment/natok",
    icon: Clapperboard,
  },
  {
    title: "Sports",
    subtitle: "Sports & live events",
    href: "/entertainment/sports",
    icon: Trophy,
  },
  {
    title: "Music",
    subtitle: "Music & audio",
    href: "/entertainment/music",
    icon: Music2,
  },
];

const creatorItems = [
  {
    title: "Create Content",
    subtitle: "Share your content",
    href: "/entertainment/creator/create",
    icon: Upload,
  },
  {
    title: "Creator Dashboard",
    subtitle: "Manage your content",
    href: "/entertainment/creator",
    icon: BarChart3,
  },
  {
    title: "Watch Time",
    subtitle: "Future earning metric",
    href: "/entertainment/creator/watch-time",
    icon: Clock3,
  },
  {
    title: "Earnings",
    subtitle: "Coming in future",
    href: "/entertainment/creator/earnings",
    icon: Wallet,
  },
];

export default function EntertainmentPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#07152d] text-white">
              <Play className="h-4 w-4 fill-current" />
            </div>

            <div>
              <p className="text-sm font-black text-[#07152d]">
                শ্রমবাজার
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                Entertainment
              </p>
            </div>
          </div>

          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-orange-500"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <section className="px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-6xl">
          {/* HERO */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[#07152d] px-5 py-7 text-white shadow-xl shadow-slate-300/30 sm:px-8 sm:py-9">
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold text-orange-300">
                <Sparkles className="h-3.5 w-3.5" />
                Entertainment Hub
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                বিনোদন, Live & Sports
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                Movies, OTT, Live, TV Serial, Web Series, নাটক ও
                Sports—সবকিছু এক জায়গায়।
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/entertainment/premium"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white transition hover:bg-orange-600"
                >
                  <Crown className="h-4 w-4" />
                  Premium
                </Link>

                <Link
                  href="/entertainment/live"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
                >
                  <Radio className="h-4 w-4" />
                  Watch Live
                </Link>
              </div>
            </div>
          </div>

          {/* CONTENT CATEGORIES */}
          <div className="mt-6">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-orange-500">
                  Explore
                </p>
                <h2 className="mt-1 text-lg font-black text-[#07152d]">
                  Entertainment
                </h2>
              </div>

              <span className="text-[11px] font-semibold text-slate-400">
                Free access
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {entertainmentItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>

                      <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-orange-400" />
                    </div>

                    <h3 className="mt-3 text-sm font-black text-[#07152d]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[11px] leading-4 text-slate-400">
                      {item.subtitle}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* FEATURED / LIVE STRIP */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/entertainment/live"
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-red-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Radio className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-red-500">
                  Live
                </p>
                <h3 className="mt-0.5 text-sm font-black text-[#07152d]">
                  Live Entertainment
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  Live content এখানে দেখানো যাবে।
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-red-500" />
            </Link>

            <Link
              href="/entertainment/sports"
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                <Trophy className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                  Sports
                </p>
                <h3 className="mt-0.5 text-sm font-black text-[#07152d]">
                  Sports & Events
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">
                  Sports content ও future live events।
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
            </Link>
          </div>

          {/* CREATOR ZONE */}
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07152d] text-white">
                  <Video className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-sm font-black text-[#07152d]">
                    Creator Zone
                  </h2>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Create & manage your content
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black text-slate-500">
                Future Monetization
              </span>
            </div>

            <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
              {creatorItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group bg-white p-4 transition hover:bg-slate-50"
                  >
                    <Icon className="h-5 w-5 text-slate-500 transition group-hover:text-orange-500" />

                    <h3 className="mt-3 text-xs font-black text-[#07152d]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-[10px] leading-4 text-slate-400">
                      {item.subtitle}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* MONETIZATION INFO */}
          <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3.5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-orange-500 shadow-sm">
                <Wallet className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-black text-[#07152d]">
                  Creator Monetization
                </p>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  বর্তমানে Entertainment সব users-এর জন্য free থাকবে।
                  ভবিষ্যতে advertising revenue ও platform revenue থেকে
                  monetization pool চালু করে eligible creators-দের
                  watch time ও platform policy অনুযায়ী revenue share দেওয়া
                  যাবে।
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-center gap-2 py-6 text-center text-[10px] text-slate-400">
            <Play className="h-3 w-3" />
            Shromobazar Entertainment
          </div>
        </div>
      </section>
    </main>
  );
}