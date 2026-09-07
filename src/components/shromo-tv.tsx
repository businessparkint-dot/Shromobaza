"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Share2,
  Tv,
} from "lucide-react";

const tvItems = [
  {
    id: "worker-story",
    label: "SHROMO WORK",
    title: "একজন মানুষের দক্ষতা, একটি নতুন সুযোগ",
    description: "দক্ষ মানুষকে সঠিক কাজের সঙ্গে যুক্ত করার গল্প।",
    tag: "WORK • OPPORTUNITY",
  },
  {
    id: "market-story",
    label: "SHROMO MARKET",
    title: "আপনার পণ্য, আপনার ব্যবসা, আপনার বাজার",
    description: "ছোট ব্যবসা থেকে বড় উদ্যোগ—আরও মানুষের কাছে পৌঁছে দিন।",
    tag: "MARKET • BUSINESS",
  },
  {
    id: "future-story",
    label: "SHROMO FUTURE",
    title: "শ্রম থেকে সম্ভাবনা",
    description: "মানুষ, কাজ, ব্যবসা ও জ্ঞানকে এক ecosystem-এ যুক্ত করার স্বপ্ন।",
    tag: "VISION • FUTURE",
  },
];

export default function ShromoTV() {
  const [current, setCurrent] = useState(0);

  const item = tvItems[current];

  function previous() {
    setCurrent((value) =>
      value === 0 ? tvItems.length - 1 : value - 1,
    );
  }

  function next() {
    setCurrent((value) =>
      value === tvItems.length - 1 ? 0 : value + 1,
    );
  }

  async function handleShare() {
    const url = `${window.location.origin}/shromo-tv`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "SHROMO TV",
          text: item.title,
          url,
        });
      } catch {
        // User cancelled sharing.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard unavailable.
    }
  }

  return (
    <section className="bg-slate-950 px-3 pb-4 pt-0 sm:px-6 sm:pb-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* TV HEADER */}
        <div className="mb-1.5 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Tv className="h-4 w-4 text-orange-400" />

            <span className="text-xs font-black tracking-[0.14em] text-white">
              SHROMO TV
            </span>

            <span className="hidden text-[10px] text-slate-600 sm:inline">
              Stories • Promotions • Opportunities
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Share2 className="h-3 w-3" />
            Share
          </button>
        </div>

        {/* TV BODY */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#101827] shadow-xl">
          <div className="flex min-h-[145px] items-center sm:min-h-[165px] lg:min-h-[180px]">
            {/* SCREEN */}
            <div className="relative flex min-w-0 flex-1 items-center overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 px-5 py-5 sm:px-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(249,115,22,0.12),transparent_35%)]" />

              <div className="relative max-w-2xl">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[8px] font-black text-white">
                    NOW SHOWING
                  </span>

                  <span className="text-[9px] font-bold tracking-widest text-slate-500">
                    {item.tag}
                  </span>
                </div>

                <h2 className="max-w-xl text-lg font-black leading-tight text-white sm:text-xl lg:text-2xl">
                  {item.title}
                </h2>

                <p className="mt-1.5 max-w-lg text-xs text-slate-400 sm:text-sm">
                  {item.description}
                </p>
              </div>

              {/* PLAY */}
              <button
                type="button"
                aria-label="Play SHROMO TV"
                className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:scale-105 hover:bg-orange-500 sm:right-8"
              >
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </button>
            </div>

            {/* CONTROL STRIP */}
            <div className="flex w-11 shrink-0 flex-col items-center justify-center gap-2 border-l border-white/10 bg-[#0b1220]">
              <button
                type="button"
                onClick={previous}
                aria-label="Previous"
                className="rounded-md p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex flex-col gap-1">
                {tvItems.map((tvItem, index) => (
                  <button
                    key={tvItem.id}
                    type="button"
                    aria-label={`Show ${index + 1}`}
                    onClick={() => setCurrent(index)}
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      index === current
                        ? "bg-orange-500"
                        : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="rounded-md p-1.5 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* TV STAND — VERY THIN */}
        <div className="mx-auto h-1 w-28 rounded-b-full bg-slate-800 sm:w-36" />
        <div className="mx-auto h-0.5 w-20 bg-slate-900 sm:w-28" />

        {/* FULL TV LINK */}
        <div className="mt-2 flex justify-end">
          <Link
            href="/shromo-tv"
            className="text-[10px] font-bold text-orange-400 transition hover:text-orange-300"
          >
            Open SHROMO TV →
          </Link>
        </div>
      </div>
    </section>
  );
}