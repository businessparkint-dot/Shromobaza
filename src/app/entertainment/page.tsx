"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";

import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Film,
  Globe2,
  Headphones,
  Home,
  Maximize2,
  Music2,
  Newspaper,
  Play,
  Radio,
  Satellite,
  ShieldCheck,
  Trophy,
  Tv,
  Video,
  X,
  Zap,
} from "lucide-react";

type Channel = {
  id: string;
  name: string;
  banglaName: string;
  youtubeId: string;
  logoText: string;
  description: string;
};

type ShromoChannel = {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
};

const shromoChannels: ShromoChannel[] = [
  {
    id: "shromo-tv",
    name: "Shromo TV",
    icon: Tv,
    description: "Shromobazar's own TV channel",
  },
  {
    id: "shromo-sports",
    name: "Shromo Sports",
    icon: Trophy,
    description: "Sports, matches & updates",
  },
  {
    id: "shromo-news",
    name: "Shromo News",
    icon: Newspaper,
    description: "News from Bangladesh & the world",
  },
  {
    id: "shromo-songs",
    name: "Shromo Songs",
    icon: Music2,
    description: "Songs, music & entertainment",
  },
  {
    id: "shromo-entertainment",
    name: "Shromo Entertainment",
    icon: Clapperboard,
    description: "Shows, videos & entertainment",
  },
  {
    id: "shromo-events",
    name: "Shromo Events",
    icon: CalendarDays,
    description: "Events, programs & special shows",
  },
];

const freeTvChannels: Channel[] = [
  {
    id: "somoy-tv",
    name: "SOMOY TV",
    banglaName: "সময় টিভি",
    youtubeId: "T-l3aiJd3pI",
    logoText: "SOMOY",
    description: "Official SOMOY TV live stream",
  },
  {
    id: "jamuna-tv",
    name: "Jamuna TV",
    banglaName: "যমুনা টিভি",
    youtubeId: "rd-XAjBEaq4",
    logoText: "JAMUNA",
    description: "Official Jamuna TV live stream",
  },
  {
    id: "channel-24",
    name: "Channel 24",
    banglaName: "চ্যানেল ২৪",
    youtubeId: "ij5P5ccbjik",
    logoText: "24",
    description: "Official Channel 24 live stream",
  },
  {
    id: "independent-tv",
    name: "Independent TV",
    banglaName: "ইনডিপেনডেন্ট টিভি",
    youtubeId: "v3KLE8iynCE",
    logoText: "ITV",
    description: "Independent TV live stream",
  },
  {
    id: "ekattor-tv",
    name: "Ekattor TV",
    banglaName: "একাত্তর টিভি",
    youtubeId: "tAidYvp9xLk",
    logoText: "71",
    description: "Ekattor TV live stream",
  },
  {
    id: "rtv",
    name: "RTV",
    banglaName: "আরটিভি",
    youtubeId: "AF5wnXMbDso",
    logoText: "RTV",
    description: "Official RTV live stream",
  },
];

const comingSoonItems = [
  {
    title: "Movies",
    icon: Film,
    description: "Movies and cinema",
  },
  {
    title: "Turkish Series",
    icon: Tv,
    description: "Turkish drama and series",
  },
  {
    title: "OTT",
    icon: Video,
    description: "Web series and OTT",
  },
  {
    title: "Live Sports",
    icon: Trophy,
    description: "Live games and sports",
  },
  {
    title: "Music",
    icon: Headphones,
    description: "Songs and music videos",
  },
  {
    title: "Events",
    icon: CalendarDays,
    description: "Live events and programs",
  },
];

function getYoutubeUrl(youtubeId: string) {
  return (
    `https://www.youtube-nocookie.com/embed/${youtubeId}` +
    `?autoplay=1` +
    `&rel=0` +
    `&modestbranding=1` +
    `&controls=1` +
    `&playsinline=1`
  );
}

export default function EntertainmentPage() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(
    null,
  );

  const selectedIndex = useMemo(() => {
    if (!selectedChannel) return -1;

    return freeTvChannels.findIndex(
      (channel) => channel.id === selectedChannel.id,
    );
  }, [selectedChannel]);

  const previousChannel =
    selectedIndex > 0 ? freeTvChannels[selectedIndex - 1] : null;

  const nextChannel =
    selectedIndex >= 0 && selectedIndex < freeTvChannels.length - 1
      ? freeTvChannels[selectedIndex + 1]
      : null;

  function openPreviousChannel() {
    if (previousChannel) {
      setSelectedChannel(previousChannel);
    }
  }

  function openNextChannel() {
    if (nextChannel) {
      setSelectedChannel(nextChannel);
    }
  }

  useEffect(() => {
    if (!selectedChannel) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedChannel(null);
      }

      if (event.key === "ArrowLeft" && previousChannel) {
        setSelectedChannel(previousChannel);
      }

      if (event.key === "ArrowRight" && nextChannel) {
        setSelectedChannel(nextChannel);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedChannel, previousChannel, nextChannel]);

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#05070b]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-5">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition hover:bg-white/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 shadow-lg shadow-orange-500/10">
              <span className="text-lg font-black italic text-white">S</span>
            </div>

            <span className="text-base font-extrabold text-orange-400">
              Shromobazar
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            <Home className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-orange-600 via-orange-500 to-[#090d17]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.16),transparent_35%)]" />

        <div className="relative mx-auto flex max-w-7xl items-center gap-4 px-3 py-5 sm:px-5 sm:py-7">
          <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 sm:flex">
            <Radio className="h-6 w-6 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="rounded-full border border-white/20 bg-black/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
                Entertainment Hub
              </span>

              <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white/80 sm:inline">
                TV • Movies • Music • Sports
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Entertainment, TV & Live Streaming
            </h1>

            <p className="mt-1 max-w-2xl text-xs text-white/75 sm:text-sm">
              Shromo TV, Free TV, Movies, Turkish Series, OTT, Live Sports,
              Music & Events — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK NAV */}
      <section className="border-b border-white/10 bg-[#080b12]">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-3 py-3 sm:px-5">
          {[
            "Live TV",
            "Shromo TV",
            "Movies",
            "Turkish Series",
            "OTT",
            "Sports",
            "Music",
            "Events",
          ].map((item, index) => (
            <span
              key={item}
              className={[
                "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-bold transition",
                index === 0
                  ? "border-orange-400/40 bg-orange-500/15 text-orange-300"
                  : "border-white/10 bg-white/[0.03] text-slate-400",
              ].join(" ")}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* SHROMO TV */}
      <section className="mx-auto max-w-7xl px-3 py-7 sm:px-5 sm:py-9">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2 text-orange-400">
              <Tv className="h-4 w-4" />

              <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                Shromobazar Original
              </span>
            </div>

            <h2 className="text-xl font-black sm:text-2xl">Shromo TV</h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Our own TV channels — coming soon
            </p>
          </div>

          <span className="hidden rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-1 text-[9px] font-black text-orange-300 sm:block">
            COMING SOON
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          {shromoChannels.map((channel) => {
            const Icon = channel.icon;

            return (
              <button
                key={channel.id}
                type="button"
                className="group overflow-hidden rounded-xl border border-white/10 bg-[#0b1019] p-2.5 text-left transition hover:-translate-y-0.5 hover:border-orange-400/30 hover:bg-[#0e1420]"
              >
                <div className="relative aspect-[1.6/1] overflow-hidden rounded-lg border border-white/10 bg-slate-950">
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-950 via-slate-950 to-orange-950">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-orange-500 shadow-lg">
                      <Icon className="h-4 w-4 text-white" />
                    </div>

                    <span className="mt-1.5 text-[8px] font-black uppercase tracking-wider text-white/80">
                      Shromo
                    </span>
                  </div>

                  <div className="absolute left-1.5 top-1.5 rounded bg-orange-500 px-1.5 py-0.5 text-[7px] font-black text-white">
                    SOON
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition group-hover:opacity-100">
                    <div className="flex items-center gap-1 text-[8px] font-bold text-white">
                      <Play className="h-2.5 w-2.5 fill-white" />
                      Coming Soon
                    </div>
                  </div>
                </div>

                <h3 className="mt-2 truncate text-xs font-extrabold">
                  {channel.name}
                </h3>

                <p className="mt-0.5 line-clamp-1 text-[9px] text-slate-500">
                  {channel.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* FREE TV */}
      <section className="border-y border-white/10 bg-[#080c13]">
        <div className="mx-auto max-w-7xl px-3 py-7 sm:px-5 sm:py-9">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2 text-blue-400">
                <Satellite className="h-4 w-4" />

                <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                  Live Channels
                </span>
              </div>

              <h2 className="text-xl font-black sm:text-2xl">Free TV</h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Choose a channel to open the full player
              </p>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black text-emerald-300 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              LIVE
            </div>
          </div>

          {/* CHANNEL CARDS */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {freeTvChannels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => setSelectedChannel(channel)}
                className="group text-left"
                aria-label={`${channel.name} live`}
              >
                <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black shadow-lg shadow-black/20 transition duration-200 group-hover:-translate-y-1 group-hover:border-orange-400/60 group-hover:shadow-orange-500/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-black to-slate-900" />

                  <div className="absolute inset-[8%] flex items-center justify-center rounded-lg border border-white/5 bg-gradient-to-br from-slate-950 to-black">
                    <div className="text-center">
                      <div className="text-base font-black tracking-tight text-white sm:text-lg">
                        {channel.logoText}
                      </div>

                      <div className="mt-0.5 text-[6px] font-bold uppercase tracking-[0.18em] text-slate-600">
                        LIVE TV
                      </div>
                    </div>
                  </div>

                  {/* LIVE BADGE */}
                  <div className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-md bg-red-600 px-1.5 py-1 text-[7px] font-black text-white shadow-lg">
                    <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
                    LIVE
                  </div>

                  {/* PLAY */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                    <div className="flex h-9 w-9 scale-90 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur transition group-hover:scale-100 group-hover:opacity-100">
                      <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
                    </div>
                  </div>
                </div>

                <div className="mt-1.5 px-0.5">
                  <p className="truncate text-[11px] font-extrabold text-white">
                    {channel.name}
                  </p>

                  <p className="truncate text-[9px] text-slate-600">
                    {channel.banglaName}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-500/10 bg-blue-500/5 p-3 text-[10px] leading-4 text-slate-500">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" />

            <p>
              Free TV uses publicly available official live sources.
              Availability and embedding may depend on each source's settings
              and permissions.
            </p>
          </div>
        </div>
      </section>

      {/* MORE ENTERTAINMENT */}
      <section className="mx-auto max-w-7xl px-3 py-7 sm:px-5 sm:py-9">
        <div className="mb-4">
          <div className="mb-1 flex items-center gap-2 text-orange-400">
            <Globe2 className="h-4 w-4" />

            <span className="text-[10px] font-black uppercase tracking-[0.16em]">
              Entertainment
            </span>
          </div>

          <h2 className="text-xl font-black sm:text-2xl">
            Movies, Series & More
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            More entertainment services will be activated gradually.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {comingSoonItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                type="button"
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0b1019] p-3 text-left transition hover:-translate-y-0.5 hover:border-orange-400/30"
              >
                <div className="absolute right-2.5 top-2.5 rounded-full bg-orange-500/10 px-1.5 py-0.5 text-[7px] font-black text-orange-300">
                  SOON
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition group-hover:bg-orange-500/10">
                  <Icon className="h-4 w-4 text-orange-400" />
                </div>

                <h3 className="mt-3 text-xs font-extrabold text-white">
                  {item.title}
                </h3>

                <p className="mt-0.5 text-[9px] text-slate-600">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-3 py-6 text-center text-[10px] text-slate-600 sm:px-5">
          <div className="flex items-center justify-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-orange-500">
              <span className="text-xs font-black italic text-white">S</span>
            </div>

            <span className="font-bold text-orange-400">Shromobazar</span>
          </div>

          <p>
            Entertainment • Free TV • Shromo TV • Sports • Movies • Music •
            Events
          </p>

          <p>
            © {new Date().getFullYear()} Shromobazar. All rights reserved.
          </p>
        </div>
      </footer>

      {/* FULL TV PLAYER */}
      {selectedChannel && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-0 backdrop-blur-md sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedChannel(null);
            }
          }}
        >
          <div className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden bg-[#05070b] shadow-2xl sm:h-auto sm:max-h-[96vh] sm:rounded-2xl sm:border sm:border-white/10">
            {/* PLAYER HEADER */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#090d15] px-3 py-2.5 sm:px-4">
              <div className="flex min-w-0 items-center gap-2">
                {/* BACK */}
                <button
                  type="button"
                  onClick={() => setSelectedChannel(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                  aria-label="Back to channels"
                  title="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />

                    <h2 className="truncate text-sm font-extrabold text-white sm:text-base">
                      {selectedChannel.name}
                    </h2>

                    <span className="rounded bg-red-600 px-1.5 py-0.5 text-[7px] font-black text-white">
                      LIVE
                    </span>
                  </div>

                  <p className="mt-0.5 truncate text-[8px] text-slate-500 sm:text-[10px]">
                    {selectedChannel.banglaName}
                  </p>
                </div>
              </div>

              {/* CLOSE */}
              <button
                type="button"
                onClick={() => setSelectedChannel(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:bg-red-500/15 hover:text-white"
                aria-label="Close player"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* VIDEO */}
            <div className="relative w-full bg-black">
              <div className="aspect-video w-full">
                <iframe
                  key={selectedChannel.id}
                  src={getYoutubeUrl(selectedChannel.youtubeId)}
                  title={`${selectedChannel.name} Live`}
                  className="h-full w-full border-0"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              </div>

              {/* FULLSCREEN HINT / ICON */}
              <div className="pointer-events-none absolute right-3 top-3 hidden rounded-lg bg-black/50 p-2 text-white/70 backdrop-blur sm:block">
                <Maximize2 className="h-4 w-4" />
              </div>
            </div>

            {/* PLAYER ACTION BAR */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#090d15] px-3 py-2.5 sm:px-4">
              <div className="flex min-w-0 items-center gap-2">
                <Radio className="h-3.5 w-3.5 shrink-0 text-orange-400" />

                <span className="truncate text-[9px] text-slate-500 sm:text-xs">
                  Live TV • {selectedChannel.banglaName}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* PREVIOUS */}
                <button
                  type="button"
                  onClick={openPreviousChannel}
                  disabled={!previousChannel}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 text-[9px] font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  title={
                    previousChannel
                      ? `Previous: ${previousChannel.name}`
                      : "No previous channel"
                  }
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* BACK TO LIST */}
                <button
                  type="button"
                  onClick={() => setSelectedChannel(null)}
                  className="inline-flex h-8 items-center gap-1 rounded-lg bg-orange-500 px-2.5 text-[9px] font-black text-white transition hover:bg-orange-400"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Channels</span>
                </button>

                {/* NEXT */}
                <button
                  type="button"
                  onClick={openNextChannel}
                  disabled={!nextChannel}
                  className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 text-[9px] font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  title={
                    nextChannel
                      ? `Next: ${nextChannel.name}`
                      : "No next channel"
                  }
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* PLAYER INFO */}
            <div className="hidden border-t border-white/5 bg-black/20 px-4 py-2 text-[9px] text-slate-600 sm:block">
              YouTube player controls provide play/pause, volume, seek where
              supported, captions and fullscreen according to the source.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}