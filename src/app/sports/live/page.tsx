"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  CirclePlay,
  Clock3,
  Expand,
  Eye,
  Flag,
  Radio,
  Share2,
  Trophy,
  Tv,
  Users,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

type ChannelTab = "live" | "upcoming" | "replay";

export default function ShromoSportsLivePage() {
  const [activeTab, setActiveTab] = useState<ChannelTab>("live");
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      const player = document.getElementById("shromo-sports-player");

      if (!document.fullscreenElement && player) {
        await player.requestFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by browser permissions.
    }
  };

  const shareChannel = async () => {
    const shareData = {
      title: "SHROMO SPORTS",
      text: "Watch Shromobazar Sports Live",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Sports Channel link copied.");
      }
    } catch {
      // User cancelled share or browser blocked it.
    }
  };

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      {/* =========================================================
          TOP CHANNEL BAR
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07090e]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/sports"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
              aria-label="Back to Sports"
            >
              <ArrowLeft size={19} />
            </Link>

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-900/30">
                <Tv size={21} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-black tracking-tight sm:text-xl">
                    SHROMO SPORTS
                  </h1>

                  <span className="hidden rounded-full border border-orange-400/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300 sm:inline-flex">
                    Channel
                  </span>
                </div>

                <p className="truncate text-[11px] text-white/45">
                  Live • Events • Replay • Sports
                </p>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/sports"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Sports Hub
            </Link>

            <button
              type="button"
              onClick={shareChannel}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO / CHANNEL INTRO
      ========================================================= */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(249,115,22,0.18),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(37,99,235,0.15),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-7 pt-8 sm:px-6 sm:pb-10 sm:pt-12">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                Sports Channel
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60">
                Shromobazar
              </span>
            </div>

            <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
              SHROMO SPORTS
              <span className="block bg-gradient-to-r from-orange-400 via-white to-blue-400 bg-clip-text text-transparent">
                Live & Beyond
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
              Local game থেকে international sports — live match, upcoming
              events, replay, player এবং tournament experience এক জায়গায়।
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("live")}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400"
              >
                <CirclePlay size={17} />
                Watch Live
              </button>

              <button
                type="button"
                onClick={() => setShowSchedule((value) => !value)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <CalendarDays size={17} />
                Schedule
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MAIN PLAYER
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div
          id="shromo-sports-player"
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/50"
        >
          {/* Player top bar */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0b0e14] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-md bg-red-600 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                LIVE
              </span>

              <span className="text-sm font-semibold text-white/70">
                SHROMO SPORTS LIVE
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMuted((value) => !value)}
                className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Fullscreen"
              >
                <Expand size={18} />
              </button>
            </div>
          </div>

          {/* Main video/display area */}
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(30,41,59,0.5),#020409_65%)] sm:min-h-[480px]">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
              <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />
            </div>

            <div className="relative z-10 px-6 text-center">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
                <Radio size={34} className="text-orange-400" />
              </div>

              <h3 className="text-xl font-black sm:text-2xl">
                No Live Broadcast Right Now
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
                যখন কোনো verified sports event live হবে, এই জায়গাতেই
                broadcast/player display হবে।
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50">
                  Live Match
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50">
                  Scoreboard
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50">
                  Replay
                </span>
              </div>
            </div>
          </div>

          {/* Player footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0b0e14] px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-white/45">
              <Eye size={15} />
              <span>Live audience will appear here</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={shareChannel}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Share2 size={14} />
                Share
              </button>

              {isFullscreen && (
                <span className="text-[11px] text-orange-300">
                  Fullscreen
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CHANNEL NAVIGATION
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="flex overflow-x-auto rounded-xl border border-white/10 bg-[#0b0e14] p-1">
          {[
            {
              id: "live" as ChannelTab,
              label: "LIVE NOW",
              icon: Radio,
            },
            {
              id: "upcoming" as ChannelTab,
              label: "UPCOMING",
              icon: Clock3,
            },
            {
              id: "replay" as ChannelTab,
              label: "REPLAY",
              icon: CirclePlay,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-[120px] flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-black tracking-wide transition ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-white/45 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          CHANNEL CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        {activeTab === "live" && (
          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <ChannelEmptyCard
              icon={Radio}
              title="No live game at the moment"
              description="Verified organizers can later publish their live sports event here."
              badge="LIVE"
            />

            <div className="rounded-2xl border border-white/10 bg-[#0b0e14] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Sports Feed
                  </p>
                  <h3 className="mt-1 text-lg font-black">
                    What happens here?
                  </h3>
                </div>

                <Zap size={21} className="text-orange-400" />
              </div>

              <div className="space-y-3">
                <FeatureRow
                  icon={Trophy}
                  title="Live Match"
                  text="Verified sports event broadcast"
                />
                <FeatureRow
                  icon={Users}
                  title="Players & Teams"
                  text="Match participants and profiles"
                />
                <FeatureRow
                  icon={Eye}
                  title="Audience"
                  text="Public live viewing experience"
                />
                <FeatureRow
                  icon={Share2}
                  title="Share"
                  text="Share the live event publicly"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "upcoming" && (
          <ChannelEmptyCard
            icon={CalendarDays}
            title="No upcoming event published"
            description="Upcoming verified sports events will appear here with date, venue, teams and live status."
            badge="UPCOMING"
          />
        )}

        {activeTab === "replay" && (
          <ChannelEmptyCard
            icon={CirclePlay}
            title="No replay available yet"
            description="Completed public sports broadcasts and highlights will appear here."
            badge="REPLAY"
          />
        )}
      </section>

      {/* =========================================================
          SCHEDULE FOUNDATION
      ========================================================= */}
      {showSchedule && (
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                <CalendarDays className="text-orange-400" size={21} />
              </div>

              <div>
                <h3 className="font-black">Sports Schedule</h3>
                <p className="mt-1 text-sm leading-6 text-white/50">
                  এখনো কোনো public event schedule করা হয়নি। Event module
                  connect হলে verified tournament, local game এবং international
                  event এখানে automatically আসবে।
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          HOW THE CHANNEL WILL WORK
      ========================================================= */}
      <section className="border-t border-white/10 bg-[#080a0f]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">
              SHROMO SPORTS ECOSYSTEM
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Game → Live → Replay → Opportunity
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Sports শুধু দেখার জায়গা নয় — player, coach, referee, team,
              academy, tournament এবং audience সবাইকে একই ecosystem-এর মধ্যে
              আনা হবে।
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <RoadmapCard
              number="01"
              icon={Flag}
              title="Create Event"
              text="Organizer creates a verified sports event."
            />

            <RoadmapCard
              number="02"
              icon={Radio}
              title="Go Live"
              text="Approved broadcast becomes visible on Sports Channel."
            />

            <RoadmapCard
              number="03"
              icon={CirclePlay}
              title="Replay"
              text="Completed public broadcasts can become replay content."
            />

            <RoadmapCard
              number="04"
              icon={Trophy}
              title="Opportunity"
              text="Players, coaches and referees can connect with teams."
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-white/10 bg-[#05070b]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <span className="font-bold text-white/60">SHROMO SPORTS</span>
            <span className="mx-2">•</span>
            Shromobazar
          </div>

          <Link
            href="/sports"
            className="flex items-center gap-1 transition hover:text-white"
          >
            Back to Sports Hub
            <ChevronRight size={14} />
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* =============================================================
   COMPONENTS
============================================================= */

function ChannelEmptyCard({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: typeof Radio;
  title: string;
  description: string;
  badge: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e14] p-6 sm:p-8">
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Icon size={22} className="text-orange-400" />
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black tracking-wider text-white/40">
            {badge}
          </span>
        </div>

        <h3 className="text-xl font-black">{title}</h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Trophy;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
        <Icon size={17} className="text-orange-400" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 truncate text-xs text-white/40">{text}</p>
      </div>
    </div>
  );
}

function RoadmapCard({
  number,
  icon: Icon,
  title,
  text,
}: {
  number: string;
  icon: typeof Trophy;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b0e14] p-5 transition hover:border-orange-500/20">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10">
          <Icon size={19} className="text-orange-400" />
        </div>

        <span className="text-xs font-black text-white/20">{number}</span>
      </div>

      <h3 className="mt-4 font-black">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-white/40">{text}</p>
    </div>
  );
}