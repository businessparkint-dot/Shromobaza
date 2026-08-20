"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  MapPin,
  ShieldCheck,
  Users,
  BriefcaseBusiness,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    window.location.href = `/workers${
      params.toString() ? `?${params.toString()}` : ""
    }`;
  };

  const handlePopularSearch = (skill: string) => {
    window.location.href = `/workers?q=${encodeURIComponent(skill)}`;
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] overflow-hidden bg-[#06101f]"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(37,99,235,0.32),transparent_30%),radial-gradient(circle_at_15%_35%,rgba(6,182,212,0.14),transparent_28%),radial-gradient(circle_at_55%_90%,rgba(249,115,22,0.16),transparent_32%),linear-gradient(135deg,#020617_0%,#071a36_48%,#06101f_100%)]" />

      {/* Blue glow */}
      <div className="absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-blue-600/20 blur-[120px]" />

      {/* Cyan glow */}
      <div className="absolute left-[35%] top-[15%] h-[260px] w-[260px] rounded-full bg-cyan-400/10 blur-[100px]" />

      {/* Orange glow */}
      <div className="absolute -left-40 bottom-0 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[110px]" />

      {/* =====================================================
          DECORATIVE LIGHTS
      ====================================================== */}

      <div className="absolute right-[12%] top-[18%] hidden h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_30px_rgba(103,232,249,0.8)] lg:block" />

      <div className="absolute right-[24%] top-[35%] hidden h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.8)] lg:block" />

      <div className="absolute left-[8%] top-[28%] hidden h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_25px_rgba(96,165,250,0.8)] lg:block" />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-5xl"
        >
          {/* =================================================
              TOP BADGE
          ================================================== */}

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-200 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
            বাংলাদেশের Labour & Skilled Workforce Platform
          </div>

          {/* =================================================
              HEADING
          ================================================== */}

          <h1 className="font-display text-[clamp(2.7rem,7vw,5.5rem)] font-bold leading-[1.04] tracking-tight text-white">
            দক্ষ কর্মী খুঁজুন।
            <br />

            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              কাজের সুযোগ খুঁজুন।
            </span>
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            দক্ষ শ্রমিক, মিস্ত্রি, টেকনিশিয়ান, ড্রাইভার,
            ইঞ্জিনিয়ার ও বিভিন্ন পেশাজীবীকে আপনার প্রয়োজনের
            জায়গায় সহজে খুঁজে নিন।
          </p>

          {/* =================================================
              SMALL TRUST ITEMS
          ================================================== */}

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              দক্ষ কর্মী
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur">
              <Users className="h-4 w-4 text-blue-300" />
              বিভিন্ন পেশা
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold text-white/75 backdrop-blur">
              <BriefcaseBusiness className="h-4 w-4 text-orange-300" />
              কাজের সুযোগ
            </div>
          </div>

          {/* =================================================
              BUTTONS
          ================================================== */}

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-12 bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-white shadow-lg shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600"
              asChild
            >
              <Link href="/workers">
                <Search className="mr-2 h-5 w-5" />
                কর্মী খুঁজুন
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="h-12 border-cyan-300/20 bg-cyan-300/5 px-6 text-white backdrop-blur-xl hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
              asChild
            >
              <Link href="/jobs">
                কাজ পোস্ট করুন
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* =================================================
              PREMIUM SEARCH
          ================================================== */}

          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-9 w-full max-w-5xl"
          >
            <div className="rounded-[26px] border border-white/15 bg-gradient-to-r from-white/10 via-blue-400/10 to-orange-400/10 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_auto]">
                {/* Search */}
                <div className="flex h-14 items-center rounded-2xl bg-white px-4 shadow-lg">
                  <Search className="mr-3 h-5 w-5 shrink-0 text-blue-600" />

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="শ্রমিক / পেশা / দক্ষতা"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Location */}
                <div className="flex h-14 items-center rounded-2xl bg-white px-4 shadow-lg">
                  <MapPin className="mr-3 h-5 w-5 shrink-0 text-orange-500" />

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="জেলা / এলাকা"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Search button */}
                <button
                  type="submit"
                  className="h-14 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 px-7 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:from-orange-600 hover:to-amber-600"
                >
                  <span className="inline-flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    খুঁজুন
                  </span>
                </button>
              </div>
            </div>
          </motion.form>

          {/* =================================================
              POPULAR SEARCH
          ================================================== */}

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 font-medium text-white/45">
              জনপ্রিয়:
            </span>

            {[
              "রাজমিস্ত্রি",
              "ইলেকট্রিশিয়ান",
              "প্লাম্বার",
              "ড্রাইভার",
              "ওয়েল্ডার",
              "AC Technician",
            ].map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handlePopularSearch(skill)}
                className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/70 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                {skill}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ====================================================== */}

      <motion.div
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 sm:block"
        animate={{ y: [0, 7, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/20 bg-white/[0.03] p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-cyan-300" />
        </div>
      </motion.div>
    </section>
  );
}