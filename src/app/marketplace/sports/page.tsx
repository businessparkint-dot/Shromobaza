"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronRight,
  Trophy,
  Users,
  ShieldCheck,
  Radio,
  CalendarDays,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";

const SPORTS_ITEMS = [
  {
    title: "Players",
    description:
      "Find players by sport, level, position and location.",
    icon: Users,
    href: "/sports",
  },
  {
    title: "Coaches",
    description:
      "Find coaches and sports professionals for teams and training.",
    icon: UserRound,
    href: "/sports",
  },
  {
    title: "Referees",
    description:
      "Connect with referees and match officials.",
    icon: ShieldCheck,
    href: "/sports",
  },
  {
    title: "Hire / Connect",
    description:
      "Send a sports hire or connection request to an available profile.",
    icon: BriefcaseBusiness,
    href: "/sports",
  },
];

export default function SportsMarketPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/marketplace"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label="Back to Marketplace"
            >
              <ArrowLeft size={17} />
            </Link>

            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Trophy size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[10px] font-black uppercase tracking-wider text-orange-500">
                  Shromobazar Marketplace
                </p>

                <h1 className="truncate text-lg font-black">
                  Sports Market
                </h1>
              </div>
            </div>
          </div>

          <Link
            href="/sports"
            className="shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
          >
            Open Sports
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-black text-orange-700">
              <Trophy size={14} />
              SPORTS MARKET
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Find Sports Talent.
              <br />
              <span className="text-orange-500">
                Hire. Connect. Play.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Players, coaches, referees and other sports professionals
              can create their sports identity and connect with teams,
              organisers and opportunities through Shromobazar.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/sports"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
              >
                Explore Sports Profiles
                <ChevronRight size={16} />
              </Link>

              <Link
                href="/sports"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Create Sports Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARKET CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-orange-500">
            Sports Marketplace
          </p>

          <h2 className="mt-1 text-2xl font-black">
            Explore Sports Services
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Everything connects to the existing Sports identity system.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPORTS_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 font-black">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-xs font-black text-orange-600">
                  Open
                  <ChevronRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* EXISTING SPORTS FEATURES */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/sports/live"
            className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white transition hover:bg-slate-900"
          >
            <Radio size={22} className="text-orange-400" />

            <h3 className="mt-4 font-black">
              Sports Live
            </h3>

            <p className="mt-1 text-xs leading-5 text-white/50">
              Open the existing Sports Live section.
            </p>

            <span className="mt-4 inline-flex text-xs font-black text-orange-400">
              Open →
            </span>
          </Link>

          <Link
            href="/sports/event"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-200 hover:bg-orange-50/30"
          >
            <CalendarDays size={22} className="text-orange-500" />

            <h3 className="mt-4 font-black">
              Sports Events
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Create and explore sports event functionality.
            </p>

            <span className="mt-4 inline-flex text-xs font-black text-orange-600">
              Open →
            </span>
          </Link>

          <Link
            href="/sports"
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-orange-200 hover:bg-orange-50/30"
          >
            <Users size={22} className="text-orange-500" />

            <h3 className="mt-4 font-black">
              Sports Directory
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Browse public sports profiles and connect with talent.
            </p>

            <span className="mt-4 inline-flex text-xs font-black text-orange-600">
              Open →
            </span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <span className="font-black text-slate-700">
              SPORTS MARKET
            </span>

            <span className="mx-2">•</span>

            Shromobazar
          </div>

          <Link
            href="/marketplace"
            className="font-bold transition hover:text-slate-700"
          >
            Back to Marketplace
          </Link>
        </div>
      </footer>
    </main>
  );
}