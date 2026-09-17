"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Share2,
  Tv,
} from "lucide-react";

type TVItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  tag: string;
  mediaType?: "image" | "video";
  mediaUrl?: string;
};

const fallbackItems: TVItem[] = [
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
    description:
      "ছোট ব্যবসা থেকে বড় উদ্যোগ—আরও মানুষের কাছে পৌঁছে দিন।",
    tag: "MARKET • BUSINESS",
  },
  {
    id: "future-story",
    label: "SHROMO FUTURE",
    title: "শ্রম থেকে সম্ভাবনা",
    description:
      "মানুষ, কাজ, ব্যবসা ও জ্ঞানকে এক ecosystem-এ যুক্ত করার স্বপ্ন।",
    tag: "VISION • FUTURE",
  },
];

function normalizeTVItem(item: any, index: number): TVItem {
  const mediaType =
    item?.media_type === "video" ? "video" : "image";

  return {
    id: String(item?.id ?? `tv-${index}`),
    label:
      typeof item?.label === "string" && item.label.trim()
        ? item.label
        : "SHROMO TV",
    title:
      typeof item?.title === "string" && item.title.trim()
        ? item.title
        : "SHROMO TV",
    description:
      typeof item?.description === "string"
        ? item.description
        : "",
    tag:
      typeof item?.tag === "string" && item.tag.trim()
        ? item.tag
        : "SHROMO TV",
    mediaType,
    mediaUrl:
      typeof item?.media_url === "string" && item.media_url.trim()
        ? item.media_url
        : undefined,
  };
}

export default function ShromoTV() {
  const [current, setCurrent] = useState(0);
  const [tvItems, setTvItems] =
    useState<TVItem[]>(fallbackItems);
  const [loadingMedia, setLoadingMedia] = useState(true);

  /*
   * Load approved SHROMO TV content.
   *
   * If the API is unavailable, the original fallback cards
   * remain available so the Home page never becomes empty.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadTV() {
      try {
        setLoadingMedia(true);

        const response = await fetch("/api/shromo-tv", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load SHROMO TV.");
        }

        const result = await response.json();

        const rawItems = Array.isArray(result)
          ? result
          : Array.isArray(result?.items)
            ? result.items
            : Array.isArray(result?.tv)
              ? result.tv
              : Array.isArray(result?.contents)
                ? result.contents
                : [];

        const publishedItems = rawItems
          .filter((item: any) => {
            if (typeof item?.published === "boolean") {
              return item.published;
            }

            return true;
          })
          .map(normalizeTVItem)
          .filter((item: TVItem) => item.title);

        if (!cancelled && publishedItems.length > 0) {
          setTvItems(publishedItems);
          setCurrent(0);
        }
      } catch (error) {
        console.error("SHROMO TV load error:", error);

        if (!cancelled) {
          setTvItems(fallbackItems);
          setCurrent(0);
        }
      } finally {
        if (!cancelled) {
          setLoadingMedia(false);
        }
      }
    }

    loadTV();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Auto rotate TV content.
   */
  useEffect(() => {
    if (tvItems.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrent((value) =>
        value === tvItems.length - 1 ? 0 : value + 1,
      );
    }, 8000);

    return () => window.clearInterval(timer);
  }, [tvItems.length]);

  const item = tvItems[current] ?? fallbackItems[0];

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
          <div className="flex min-w-0 items-center gap-2">
            <Tv className="h-4 w-4 shrink-0 text-orange-400" />

            <span className="shrink-0 text-xs font-black tracking-[0.14em] text-white">
              SHROMO TV
            </span>

            <span className="hidden truncate text-[10px] text-slate-600 sm:inline">
              Stories • Promotions • Opportunities
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Share2 className="h-3 w-3" />
            Share
          </button>
        </div>

        {/* TV BODY */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#101827] shadow-xl">
          <div className="flex min-h-[180px] items-stretch sm:min-h-[205px] lg:min-h-[225px]">
            {/* SCREEN */}
            <div className="relative min-w-0 flex-1 overflow-hidden bg-[#0b1729]">
              {/* MEDIA BACKGROUND */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(249,115,22,0.16),transparent_35%)]" />

              {item.mediaUrl ? (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0b1729]">
                  {item.mediaType === "video" ? (
                    <video
                      key={item.mediaUrl}
                      src={item.mediaUrl}
                      className="h-full w-full object-contain"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      key={item.mediaUrl}
                      src={item.mediaUrl}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  )}

                  {/* Soft overlay for readable text */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/10" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_70%_45%,rgba(249,115,22,0.18),transparent_35%),linear-gradient(120deg,#0b1729,#111827,#0b1220)]">
                  <div className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-orange-400/30 bg-orange-500/10">
                      <Tv className="h-5 w-5 text-orange-400" />
                    </div>

                    <p className="text-[10px] font-bold tracking-[0.2em] text-slate-500">
                      SHROMO TV
                    </p>

                    {loadingMedia && (
                      <p className="mt-1 text-[9px] text-slate-600">
                        Loading content...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TEXT CONTENT */}
              <div className="relative z-10 flex h-full min-h-[180px] items-center px-5 py-5 sm:min-h-[205px] sm:px-8 lg:min-h-[225px]">
                <div className="max-w-2xl">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[8px] font-black text-white shadow-lg">
                      NOW SHOWING
                    </span>

                    <span className="text-[9px] font-bold tracking-widest text-slate-300/70">
                      {item.tag}
                    </span>
                  </div>

                  <h2 className="max-w-xl text-lg font-black leading-tight text-white drop-shadow-lg sm:text-xl lg:text-2xl">
                    {item.title}
                  </h2>

                  {item.description && (
                    <p className="mt-1.5 max-w-lg text-xs text-slate-200/75 drop-shadow sm:text-sm">
                      {item.description}
                    </p>
                  )}

                  {item.label && (
                    <div className="mt-3 text-[9px] font-black tracking-[0.18em] text-orange-300/80">
                      {item.label}
                    </div>
                  )}
                </div>
              </div>

              {/* PLAY */}
              <Link
                href="/shromo-tv"
                aria-label="Open SHROMO TV"
                className="absolute right-5 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-lg backdrop-blur transition hover:scale-105 hover:bg-orange-500 sm:right-8"
              >
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              </Link>
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

              <div className="flex flex-col gap-1.5">
                {tvItems.map((tvItem, index) => (
                  <button
                    key={tvItem.id}
                    type="button"
                    aria-label={`Show ${index + 1}`}
                    onClick={() => setCurrent(index)}
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      index === current
                        ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
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