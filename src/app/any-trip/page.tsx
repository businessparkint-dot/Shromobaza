"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bike,
  Car,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
  Sparkles,
  Truck,
  Zap,
  Navigation,
  Bell,
  UserRound,
} from "lucide-react";

const services = [
  {
    title: "Ride Share",
    subtitle: "শহরের যাতায়াত",
    icon: Car,
    href: "/any-trip/ride-share",
    badge: "RIDE",
    accent: "from-orange-500 to-amber-500",
  },
  {
    title: "Bike Ride",
    subtitle: "দ্রুত ছোট যাত্রা",
    icon: Bike,
    href: "/any-trip/ride-share?type=bike",
    badge: "BIKE",
    accent: "from-cyan-500 to-blue-500",
  },
  {
    title: "Car Ride",
    subtitle: "আরামদায়ক যাত্রা",
    icon: Car,
    href: "/any-trip/ride-share?type=car",
    badge: "CAR",
    accent: "from-violet-500 to-indigo-500",
  },
  {
    title: "Micro / Van",
    subtitle: "পরিবার ও গ্রুপ",
    icon: Truck,
    href: "/any-trip/ride-share?type=van",
    badge: "GROUP",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Parcel Delivery",
    subtitle: "পার্সেল পাঠান",
    icon: Package,
    href: "/any-trip/parcel",
    badge: "PARCEL",
    accent: "from-orange-500 to-red-500",
  },
  {
    title: "Shop Delivery",
    subtitle: "দোকানের পণ্য",
    icon: ShoppingBag,
    href: "/any-trip/parcel?type=shop",
    badge: "SHOP",
    accent: "from-pink-500 to-rose-500",
  },
  {
    title: "Express Delivery",
    subtitle: "দ্রুত ডেলিভারি",
    icon: Zap,
    href: "/any-trip/parcel?type=express",
    badge: "FAST",
    accent: "from-yellow-500 to-orange-500",
  },
  {
    title: "Business Delivery",
    subtitle: "ব্যবসার জন্য",
    icon: Truck,
    href: "/any-trip/parcel?type=business",
    badge: "BUSINESS",
    accent: "from-slate-600 to-slate-900",
  },
];

export default function AnyTripPage() {
  return (
    <main className="min-h-screen bg-slate-950 pb-16 text-white sm:pb-0">
      {/* =====================================================
          APP HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href="/"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:bg-white/10"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-sm font-black sm:text-lg">
                  ANY TRIP
                </h1>

                <span className="rounded-full bg-cyan-400/10 px-1.5 py-0.5 text-[6px] font-black text-cyan-300 sm:px-2 sm:text-[8px]">
                  SMART MOBILITY
                </span>
              </div>

              <p className="truncate text-[7px] text-slate-400 sm:text-[10px]">
                Ride ও Parcel Service এক জায়গায়
              </p>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-black text-slate-200 hover:bg-white/10"
            >
              Home
            </Link>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5"
            >
              <Bell className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5"
            >
              <UserRound className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile icons */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5"
            >
              <Bell className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5"
            >
              <UserRound className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN DISPLAY
      ===================================================== */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950 via-slate-950 to-orange-950" />

        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />

        {/* Speed lines */}
        <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 opacity-20 sm:block">
          <div className="mb-4 h-px w-72 bg-cyan-300" />
          <div className="mb-6 ml-12 h-px w-52 bg-orange-400" />
          <div className="mb-5 ml-4 h-px w-80 bg-cyan-300" />
          <div className="ml-20 h-px w-44 bg-orange-400" />
        </div>

        <div className="relative mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_330px]">
            {/* DISPLAY CONTENT */}
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-orange-400">
                <Sparkles className="h-3.5 w-3.5" />

                <span className="text-[7px] font-black uppercase tracking-[0.2em] sm:text-[9px]">
                  Move Smart
                </span>
              </div>

              <h2 className="text-2xl font-black leading-[1.05] sm:text-4xl lg:text-5xl">
                MOVE
                <span className="text-orange-400"> FASTER.</span>
                <br />
                GO
                <span className="text-cyan-400"> FARTHER.</span>
              </h2>

              <p className="mt-2 max-w-xl text-[9px] leading-4 text-slate-400 sm:mt-3 sm:text-sm sm:leading-6">
                আপনার যাত্রা, আপনার ডেলিভারি—দ্রুত, সহজ এবং এক জায়গা থেকে।
              </p>

              {/* APP SEARCH / LOCATION DISPLAY */}
              <div className="mt-4 max-w-xl rounded-xl border border-white/10 bg-black/25 p-2 backdrop-blur-md sm:mt-5 sm:rounded-2xl sm:p-3">
                <div className="grid gap-1.5 sm:grid-cols-2">
                  <div className="flex items-center gap-2 rounded-lg bg-white/[0.07] px-2.5 py-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-400" />

                    <div className="min-w-0">
                      <p className="text-[6px] font-bold uppercase text-slate-500">
                        Pickup
                      </p>

                      <p className="truncate text-[8px] font-bold text-white sm:text-[9px]">
                        আপনার অবস্থান
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-white/[0.07] px-2.5 py-2">
                    <Navigation className="h-3.5 w-3.5 shrink-0 text-orange-400" />

                    <div className="min-w-0">
                      <p className="text-[6px] font-bold uppercase text-slate-500">
                        Destination
                      </p>

                      <p className="truncate text-[8px] font-bold text-white sm:text-[9px]">
                        কোথায় যাবেন?
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/any-trip/ride-share"
                  className="mt-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-[8px] font-black text-white shadow-lg transition hover:bg-orange-400 sm:text-[9px]"
                >
                  <Car className="h-3 w-3" />
                  Ride শুরু করুন
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* DISPLAY SIDE VISUAL */}
            <div className="relative hidden lg:block">
              <div className="relative mx-auto h-48 w-full max-w-[320px] overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 via-white/[0.03] to-orange-500/10 p-4 shadow-2xl">
                <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-cyan-300/20" />

                <div className="absolute left-5 top-7 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />

                <div className="absolute bottom-8 right-8 h-3 w-3 rounded-full bg-orange-400 shadow-[0_0_18px_rgba(251,146,60,0.8)]" />

                <div className="absolute left-8 top-1/2 h-px w-48 rotate-[18deg] bg-gradient-to-r from-cyan-400/60 via-white/20 to-orange-400/60" />

                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-slate-950/70 p-3 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[7px] uppercase tracking-widest text-slate-500">
                        Any Trip
                      </p>

                      <p className="mt-1 text-xs font-black">
                        Ready to move
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
                      <Car className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES + SPEED PANEL
      ===================================================== */}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* SERVICES */}
          <section>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.18em] text-cyan-400 sm:text-[9px]">
                  Services
                </p>

                <h2 className="mt-1 text-sm font-black sm:text-xl">
                  আপনার প্রয়োজনের সেবা
                </h2>
              </div>

              <span className="text-[7px] text-slate-500 sm:text-[9px]">
                8 Services
              </span>
            </div>

            {/* PC = 4 × 2 */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 xl:grid-cols-4">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.055] p-2.5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09] hover:shadow-2xl sm:rounded-2xl sm:p-4"
                  >
                    <div
                      className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${service.accent}`}
                    />

                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${service.accent} shadow-lg sm:h-10 sm:w-10 sm:rounded-xl`}
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5" />
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[5px] font-black text-slate-400 sm:text-[7px]">
                        {service.badge}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-[9px] font-black sm:mt-3 sm:text-xs">
                      {service.title}
                    </h3>

                    <p className="mt-0.5 text-[6.5px] text-slate-400 sm:text-[9px]">
                      {service.subtitle}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between sm:mt-3">
                      <span className="text-[6px] font-bold text-cyan-400 sm:text-[8px]">
                        Explore
                      </span>

                      <ArrowRight className="h-2.5 w-2.5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white sm:h-3 sm:w-3" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* =================================================
              SPEED MOTIVATION PANEL
          ================================================= */}
          <aside className="relative overflow-hidden rounded-2xl border border-orange-400/20 bg-gradient-to-br from-[#111827] via-[#172033] to-[#082f49] p-5 shadow-[0_15px_45px_rgba(8,145,178,0.12)]">
            <div className="pointer-events-none absolute right-0 top-8 opacity-20">
              <div className="mb-4 h-px w-44 bg-cyan-300" />
              <div className="mb-5 ml-8 h-px w-32 bg-orange-400" />
              <div className="mb-4 ml-2 h-px w-52 bg-cyan-300" />
              <div className="ml-12 h-px w-28 bg-orange-400" />
            </div>

            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-orange-400/15 blur-3xl" />

            <div className="relative flex min-h-[250px] flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Zap className="h-4 w-4" />

                  <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                    Speed Matters
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                  MOVE
                  <br />
                  <span className="text-orange-400">FASTER.</span>
                  <br />
                  GO FARTHER.
                </h2>

                <p className="mt-4 text-[10px] leading-5 text-slate-400 sm:text-xs sm:leading-6">
                  সময় বাঁচান।
                  <br />
                  দ্রুত পৌঁছান।
                  <br />
                  নিজের কাজকে আরও সহজ করুন।
                </p>
              </div>

              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2 text-cyan-300">
                  <Clock3 className="h-4 w-4" />

                  <span className="text-[9px] font-black sm:text-[10px]">
                    Your time is valuable.
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[8px] font-black text-white sm:text-[9px]">
                    যাত্রা হোক সহজ,
                    <span className="text-orange-400">
                      {" "}
                      সেবা হোক দ্রুত।
                    </span>
                  </p>

                  <p className="mt-1 text-[7px] text-slate-500 sm:text-[8px]">
                    Ride • Delivery • Parcel
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* QUICK INFO */}
        <div className="mt-4 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center sm:rounded-xl sm:px-3">
            <MapPin className="mx-auto h-3.5 w-3.5 text-cyan-400 sm:h-4 sm:w-4" />
            <p className="mt-1 text-[7px] font-black text-white sm:text-[9px]">
              সহজ Location
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center sm:rounded-xl sm:px-3">
            <Zap className="mx-auto h-3.5 w-3.5 text-orange-400 sm:h-4 sm:w-4" />
            <p className="mt-1 text-[7px] font-black text-white sm:text-[9px]">
              দ্রুত Service
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center sm:rounded-xl sm:px-3">
            <Clock3 className="mx-auto h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4" />
            <p className="mt-1 text-[7px] font-black text-white sm:text-[9px]">
              সময় সাশ্রয়
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE APP BOTTOM NAV
      ===================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 px-2 py-1.5 backdrop-blur-xl sm:hidden">
        <div className="grid grid-cols-4">
          <Link
            href="/any-trip"
            className="flex flex-col items-center gap-0.5 py-1 text-cyan-400"
          >
            <Car className="h-4 w-4" />
            <span className="text-[6px] font-black">Home</span>
          </Link>

          <Link
            href="/any-trip/ride-share"
            className="flex flex-col items-center gap-0.5 py-1 text-slate-500"
          >
            <MapPin className="h-4 w-4" />
            <span className="text-[6px] font-black">Trips</span>
          </Link>

          <Link
            href="/any-trip/parcel"
            className="flex flex-col items-center gap-0.5 py-1 text-slate-500"
          >
            <Package className="h-4 w-4" />
            <span className="text-[6px] font-black">Orders</span>
          </Link>

          <Link
            href="/my-account"
            className="flex flex-col items-center gap-0.5 py-1 text-slate-500"
          >
            <UserRound className="h-4 w-4" />
            <span className="text-[6px] font-black">Account</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}