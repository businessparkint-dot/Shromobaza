"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronRight,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type MarketCategory = {
  title: string;
  subtitle: string;
  icon: React.ElementType;
};

const categories: MarketCategory[] = [
  {
    title: "পাইকারি পণ্য",
    subtitle: "Wholesale products খুঁজুন",
    icon: Package,
  },
  {
    title: "Supplier / পাইকার",
    subtitle: "পাইকারি ব্যবসায়ী খুঁজুন",
    icon: Store,
  },
  {
    title: "Bulk Buyer",
    subtitle: "বড় অর্ডারের buyer খুঁজুন",
    icon: ShoppingCart,
  },
  {
    title: "ব্যবসা প্রতিষ্ঠান",
    subtitle: "দোকান ও প্রতিষ্ঠানের সাথে যুক্ত হন",
    icon: Building2,
  },
];

const marketTypes = [
  "ঢাকা",
  "চট্টগ্রাম",
  "নারায়ণগঞ্জ",
  "খুলনা",
  "রাজশাহী",
  "সিলেট",
  "বরিশাল",
  "রংপুর",
];

export default function WholesaleMarketPage() {
  const [search, setSearch] = useState("");

  const filteredMarkets = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return marketTypes;

    return marketTypes.filter((market) =>
      market.toLowerCase().includes(value),
    );
  }, [search]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* TOP BAR */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            Marketplace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#071b33] via-[#0c3155] to-[#c2410c]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-wide text-white">
              🇧🇩 CORE MARKET
            </div>

            <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Bangladesh Wholesale
              <span className="block text-orange-300">
                Business Market
              </span>
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              বাংলাদেশের পাইকার, supplier, দোকানদার, retailer,
              প্রতিষ্ঠান এবং bulk buyer-দের business connection-এর
              জন্য একটি dedicated market।
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[#0c3155] shadow-lg transition hover:bg-slate-100"
              >
                পণ্য খুঁজুন
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/buy-requests"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                আমি কিনতে চাই
                <ShoppingCart className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS PURPOSE */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-xs font-black tracking-widest text-orange-600">
                BUSINESS NETWORK
              </div>

              <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                পাইকারি ব্যবসার দুই দিককে এক জায়গায়
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                Seller/Supplier তার পণ্য ও wholesale offer প্রকাশ করবে।
                Buyer/Retailer প্রয়োজনীয় পণ্য ও quantity জানাবে।
                এরপর দুই পক্ষ সরাসরি business connection তৈরি করতে পারবে।
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-orange-50 p-5 text-center">
              <Users className="mx-auto h-9 w-9 text-orange-600" />
              <div className="mt-2 text-sm font-black text-orange-700">
                Seller ↔ Buyer
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Business Connection
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE OPTIONS */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href="/marketplace"
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-[#0c3155] transition group-hover:bg-orange-100 group-hover:text-orange-600">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {item.subtitle}
                </p>

                <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-orange-600">
                  Explore
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEARCH */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-black tracking-widest text-[#0c3155]">
              FIND BUSINESS
            </div>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              কোন বাজার বা এলাকায় ব্যবসা খুঁজছেন?
            </h2>

            <div className="relative mt-5">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="জেলা / বাজারের নাম লিখুন..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {filteredMarkets.map((market) => (
              <button
                key={market}
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
              >
                <MapPin className="h-4 w-4" />
                {market}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS FLOW */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#071b33] p-6 text-white sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <div className="text-xs font-black tracking-widest text-orange-300">
              HOW IT CAN GROW
            </div>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              একটি wholesale business ecosystem
            </h2>

            <p className="mt-4 leading-7 text-white/75">
              আজ পণ্য ও supplier discovery। ভবিষ্যতে verified business,
              bulk order, logistics, market information এবং global buyer
              connection—ধাপে ধাপে যুক্ত করা যাবে।
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Supplier", "পাইকারি বিক্রেতা"],
              ["Buyer", "দোকান / প্রতিষ্ঠান"],
              ["Bulk Order", "বড় পরিমাণের চাহিদা"],
              ["Logistics", "ভবিষ্যৎ delivery connection"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="font-black">{title}</div>
                <div className="mt-2 text-sm text-white/65">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              আপনার পাইকারি ব্যবসা শুরু করুন
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Shop, Business এবং Marketplace-এর সাথে যুক্ত হয়ে
              wholesale business presence তৈরি করুন।
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0c3155] px-5 py-3 font-bold text-white transition hover:bg-[#071b33]"
            >
              Marketplace
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/global-business"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 font-bold text-white transition hover:bg-orange-700"
            >
              Open Business
              <Building2 className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-5 text-xs text-slate-500 sm:px-6 lg:px-8">
          <Truck className="h-4 w-4" />
          Bangladesh Wholesale Business Market — Shromobazar Core Market
        </div>
      </div>
    </main>
  );
}