"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Store,
  Users,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";

const categories = [
  "সব",
  "কাপড়",
  "জুতা",
  "Electronics",
  "Bags",
  "Cosmetics",
  "Home Items",
  "Food",
  "Street Food",
  "Kids",
  "Tools",
  "Other",
];

const liveShops = [
  {
    id: "live-1",
    shop: "Dhaka Fashion Corner",
    category: "কাপড়",
    location: "Mirpur, Dhaka",
    viewers: 128,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "live-2",
    shop: "Smart Gadget House",
    category: "Electronics",
    location: "New Market, Dhaka",
    viewers: 86,
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "live-3",
    shop: "Street Food Live",
    category: "Street Food",
    location: "Dhanmondi, Dhaka",
    viewers: 214,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "live-4",
    shop: "Urban Shoes BD",
    category: "জুতা",
    location: "Gulistan, Dhaka",
    viewers: 63,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
];

const shops = [
  {
    id: "shop-1",
    name: "Royal Fashion",
    category: "কাপড়",
    location: "Mirpur, Dhaka",
    followers: "2.4K",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "shop-2",
    name: "Tech Point",
    category: "Electronics",
    location: "Farmgate, Dhaka",
    followers: "1.8K",
    image:
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "shop-3",
    name: "Urban Bag House",
    category: "Bags",
    location: "New Market, Dhaka",
    followers: "980",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "shop-4",
    name: "Beauty Zone",
    category: "Cosmetics",
    location: "Uttara, Dhaka",
    followers: "1.2K",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
  },
];

const ads = [
  {
    id: "ad-1",
    type: "image",
    src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1800&q=90",
    href: "#",
  },
  {
    id: "ad-2",
    type: "image",
    src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=90",
    href: "#",
  },
  {
    id: "ad-3",
    type: "image",
    src: "https://images.unsplash.com/photo-1607082348824-0a96f2a8b6f1?auto=format&fit=crop&w=1800&q=90",
    href: "#",
  },
];

export default function FootpathPage() {
  const [selectedCategory, setSelectedCategory] = useState("সব");
  const [adIndex, setAdIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  const currentAd = ads[adIndex];

  const nextAd = () => {
    setAdIndex((current) => (current + 1) % ads.length);
  };

  const previousAd = () => {
    setAdIndex((current) => (current - 1 + ads.length) % ads.length);
  };

  const filteredLive =
    selectedCategory === "সব"
      ? liveShops
      : liveShops.filter((item) => item.category === selectedCategory);

  const filteredShops =
    selectedCategory === "সব"
      ? shops
      : shops.filter((item) => item.category === selectedCategory);

  return (
    <main className="min-h-screen bg-slate-50 pb-16 text-slate-900 sm:pb-0">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-2 px-2.5 sm:h-14 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <Link
              href="/"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 sm:h-9 sm:w-9"
              aria-label="Back"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-[11px] font-black leading-tight sm:text-lg">
                Footpath Live Bazaar
              </h1>

              <p className="truncate text-[7px] font-medium text-slate-500 sm:text-[10px]">
                অনলাইন ফুটপাত বাজার
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="hidden shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-black text-slate-700 shadow-sm transition hover:bg-slate-50 sm:block"
          >
            Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1800px] px-2 py-2.5 sm:px-6 sm:py-5 lg:px-8">
 {/* =====================================================
    AD DISPLAY + MOTIVATIONAL PANEL
===================================================== */}
<section className="mb-3 sm:mb-5">
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_250px] sm:gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
    
    {/* AD DISPLAY */}
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm sm:rounded-2xl sm:p-1">
      <div className="relative aspect-[2/1] max-h-[230px] overflow-hidden rounded-[10px] bg-slate-950 sm:aspect-[5/2] sm:rounded-xl">
        <Link
          href={currentAd.href}
          className="absolute inset-0 block"
          aria-label="Advertisement"
        >
          <img
            src={currentAd.src}
            alt=""
            className="h-full w-full object-cover"
          />
        </Link>

        <button
          type="button"
          onClick={previousAd}
          aria-label="Previous advertisement"
          className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-black/40 text-white backdrop-blur-sm sm:left-2 sm:h-8 sm:w-8"
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        <button
          type="button"
          onClick={nextAd}
          aria-label="Next advertisement"
          className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md bg-black/40 text-white backdrop-blur-sm sm:right-2 sm:h-8 sm:w-8"
        >
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>

        <Link
          href="/ad-post-request"
          className="absolute bottom-1.5 right-1.5 rounded-md bg-black/50 px-2 py-1 text-[6px] font-black text-white backdrop-blur-sm sm:bottom-2 sm:right-2 sm:px-2.5 sm:py-1.5 sm:text-[8px]"
        >
          Ad Post Request
        </Link>

        <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/35 px-1.5 py-1 backdrop-blur-md">
          {ads.map((ad, index) => (
            <button
              key={ad.id}
              type="button"
              onClick={() => setAdIndex(index)}
              aria-label={`Advertisement ${index + 1}`}
              className={`h-1 rounded-full transition-all ${
                index === adIndex
                  ? "w-4 bg-white"
                  : "w-1 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* MOTIVATIONAL PANEL */}
    <div className="relative hidden overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4 shadow-sm sm:flex sm:min-h-[150px] sm:flex-col sm:justify-center lg:p-5">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-200/30 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-20 w-20 rounded-full bg-amber-200/30 blur-2xl" />

      <div className="relative">
        <span className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-orange-700 lg:text-[9px]">
          Shromobazar
        </span>

        <h2 className="mt-2 text-base font-black leading-tight text-slate-900 lg:text-lg">
          আপনার পণ্য,
          <br />
          আপনার বাজার
        </h2>

        <p className="mt-1.5 text-[9px] leading-4 text-slate-500 lg:text-[10px]">
          ছোট ব্যবসা, বড় সম্ভাবনা।
          <br />
          Online-এ নিজের পরিচয় তৈরি করুন।
        </p>

        <Link
          href="/open-your-shop"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-[8px] font-black text-white shadow-sm transition hover:bg-orange-600 lg:text-[9px]"
        >
          আজই Shop খুলুন
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  </div>
</section>

        {/* =====================================================
            SEARCH + SOUND
        ===================================================== */}
        <section className="mb-3 flex gap-1.5 sm:mb-5 sm:gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 shadow-sm sm:rounded-xl sm:px-3 sm:py-2.5">
            <Search className="h-3 w-3 shrink-0 text-slate-400 sm:h-3.5 sm:w-3.5" />

            <input
              type="text"
              placeholder="দোকান, পণ্য বা বাজার খুঁজুন..."
              className="w-full bg-transparent text-[9px] outline-none placeholder:text-slate-400 sm:text-xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setSoundOn((value) => !value)}
            className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-[8px] font-black shadow-sm transition hover:bg-slate-50 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[10px]"
          >
            {soundOn ? (
              <Volume2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            ) : (
              <VolumeX className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            )}

            <span className="hidden min-[380px]:inline">
              {soundOn ? "Sound ON" : "Sound OFF"}
            </span>
          </button>
        </section>

        {/* =====================================================
            CATEGORY NAVIGATOR
        ===================================================== */}
        <section className="mb-4 sm:mb-6">
          <div className="mb-1.5 flex items-end justify-between sm:mb-2.5">
            <div>
              <h2 className="text-sm font-black sm:text-lg">
                বাজারের বিভাগ
              </h2>

              <p className="mt-0.5 text-[8px] text-slate-500 sm:text-[10px]">
                আপনার পছন্দের category বেছে নিন
              </p>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none sm:gap-1.5">
            {categories.map((category) => {
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-md px-2.5 py-1.5 text-[8px] font-black transition sm:rounded-lg sm:px-3 sm:py-2 sm:text-[10px] ${
                    active
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            LIVE BAZAAR
        ===================================================== */}
        <section className="mb-5 sm:mb-8">
          <div className="mb-2.5 flex items-end justify-between gap-2 sm:mb-4">
            <div className="min-w-0">
              <div className="mb-0.5 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>

                <span className="text-[7px] font-black uppercase tracking-wide text-red-600 sm:text-[10px]">
                  Live Now
                </span>
              </div>

              <h2 className="text-base font-black sm:text-xl">
                আজকের Live Bazaar
              </h2>

              <p className="mt-0.5 text-[8px] text-slate-500 sm:text-[10px]">
                প্রতিদিন সন্ধ্যা ৬টা–রাত ১০টা
              </p>
            </div>

            <Link
              href="/footpath/live"
              className="inline-flex shrink-0 items-center gap-0.5 text-[8px] font-black text-orange-600 sm:text-[10px]"
            >
              সব Live
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {filteredLive.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-7 text-center sm:rounded-2xl sm:p-10">
              <Video className="mx-auto h-6 w-6 text-slate-400" />

              <p className="mt-2 text-[10px] font-bold text-slate-500 sm:text-sm">
                এই category-তে এখন কোনো Live নেই।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
              {filteredLive.map((live) => (
                <Link
                  key={live.id}
                  href={`/footpath/live/${live.id}`}
                  className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={live.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute left-1 top-1 rounded bg-red-600 px-1 py-0.5 text-[5px] font-black text-white shadow sm:left-1.5 sm:top-1.5 sm:px-1.5 sm:text-[7px]">
                      LIVE
                    </div>

                    <div className="absolute bottom-1 right-1 flex items-center gap-0.5 rounded bg-black/55 px-1 py-0.5 text-[5px] font-bold text-white backdrop-blur-sm sm:text-[7px]">
                      <Users className="h-1.5 w-1.5 sm:h-2.5 sm:w-2.5" />
                      {live.viewers}
                    </div>
                  </div>

                  <div className="p-1 sm:p-1.5">
                    <h3 className="truncate text-[7px] font-black sm:text-[10px]">
                      {live.shop}
                    </h3>

                    <div className="mt-0.5 flex items-center gap-0.5 truncate text-[5.5px] text-slate-500 sm:text-[7px]">
                      <MapPin className="h-1.5 w-1.5 shrink-0 sm:h-2 sm:w-2" />
                      {live.location}
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-1">
                      <span className="max-w-[70%] truncate rounded bg-orange-50 px-1 py-0.5 text-[5px] font-black text-orange-700 sm:text-[6.5px]">
                        {live.category}
                      </span>

                      <span className="hidden items-center gap-0.5 text-[7px] font-black text-slate-500 sm:inline-flex">
                        Watch
                        <ArrowRight className="h-2 w-2" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            FOOTPATH SHOPS
        ===================================================== */}
        <section className="mb-5 sm:mb-8">
          <div className="mb-2.5 flex items-end justify-between gap-2 sm:mb-4">
            <div className="min-w-0">
              <div className="mb-0.5 flex items-center gap-1 text-orange-600">
                <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5" />

                <span className="text-[7px] font-black uppercase tracking-wide sm:text-[10px]">
                  Shops
                </span>
              </div>

              <h2 className="text-base font-black sm:text-xl">
                Footpath Shops
              </h2>

              <p className="mt-0.5 text-[8px] text-slate-500 sm:text-[10px]">
                প্রতিটি seller-এর নিজস্ব digital shop profile
              </p>
            </div>
          </div>

          {filteredShops.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-7 text-center sm:rounded-2xl sm:p-10">
              <Store className="mx-auto h-6 w-6 text-slate-400" />

              <p className="mt-2 text-[10px] font-bold text-slate-500 sm:text-sm">
                এই category-তে কোনো shop পাওয়া যায়নি।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-3 sm:gap-2.5 lg:grid-cols-5 xl:grid-cols-8 2xl:grid-cols-10">
              {filteredShops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/footpath/shop/${shop.id}`}
                  className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:rounded-lg"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={shop.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-1 sm:p-1.5">
                    <h3 className="truncate text-[7px] font-black sm:text-[10px]">
                      {shop.name}
                    </h3>

                    <div className="mt-0.5 flex items-center gap-0.5 truncate text-[5.5px] text-slate-500 sm:text-[7px]">
                      <MapPin className="h-1.5 w-1.5 shrink-0 sm:h-2 sm:w-2" />
                      {shop.location}
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-1">
                      <span className="max-w-[62%] truncate rounded bg-slate-100 px-1 py-0.5 text-[5px] font-black text-slate-600 sm:text-[6.5px]">
                        {shop.category}
                      </span>

                      <span className="truncate text-[5px] font-bold text-slate-500 sm:text-[7px]">
                        {shop.followers}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            OPEN YOUR SHOP
        ===================================================== */}
        <section className="mb-5 overflow-hidden rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-3.5 text-white shadow-lg sm:mb-8 sm:rounded-2xl sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="min-w-0">
              <p className="text-[7px] font-black uppercase tracking-[0.18em] text-orange-300 sm:text-[9px]">
                Seller Opportunity
              </p>

              <h2 className="mt-1 text-base font-black sm:text-xl">
                নিজের Footpath Shop খুলুন
              </h2>

              <p className="mt-1 max-w-2xl text-[8px] leading-4 text-white/65 sm:mt-1.5 sm:text-xs sm:leading-5">
                নিজের shop profile তৈরি করুন, product দেখান, customer-এর সাথে
                connect করুন এবং নির্দিষ্ট সময়ে Live-এ যান।
              </p>
            </div>

            <Link
              href="/open-your-shop"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-[8px] font-black text-white shadow-md transition hover:bg-orange-400 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-[10px]"
            >
              Open Your Shop
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </Link>
          </div>
        </section>
      </div>

      {/* =====================================================
          MOBILE LIVE BUTTON
      ===================================================== */}
      <div className="fixed bottom-2.5 left-2.5 right-2.5 z-30 sm:hidden">
        <Link
          href="/footpath/live"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2.5 text-[10px] font-black text-white shadow-xl"
        >
          <Video className="h-3 w-3" />
          Live Bazaar
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </main>
  );
}