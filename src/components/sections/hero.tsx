"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, MapPin } from "lucide-react";
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
      className="relative min-h-[92vh] overflow-hidden bg-[#050b18]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.16),transparent_30%),linear-gradient(135deg,#020617_0%,#07152f_48%,#030712_100%)]" />

      {/* Blue glow */}
      <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[110px]" />

      {/* Orange glow */}
      <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[100px]" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-300 backdrop-blur">
            বাংলাদেশ-এর Labour & Skilled Workforce Platform
          </div>

          {/* Heading */}
          <h1 className="font-display text-[clamp(2.7rem,7vw,5.5rem)] font-bold leading-[1.05] tracking-tight text-white">
            শ্রমিক খুঁজুন।
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              কাজ খুঁজুন।
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl">
            দক্ষ শ্রমিক, মিস্ত্রি, টেকনিশিয়ান, ড্রাইভার,
            ইঞ্জিনিয়ার ও বিভিন্ন পেশাজীবীকে আপনার প্রয়োজনের
            জায়গায় সহজে খুঁজে নিন।
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"
              asChild
            >
              <Link href="/workers">
                <Search className="mr-2 h-5 w-5" />
                শ্রমিক খুঁজুন
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/jobs">
                কাজ পোস্ট করুন
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Premium Search */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-9 w-full max-w-4xl"
          >
            <div className="rounded-3xl border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_auto]">
                {/* Search */}
                <div className="flex h-14 items-center rounded-2xl bg-white px-4 shadow-lg">
                  <Search className="mr-3 h-5 w-5 shrink-0 text-blue-500" />

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

                {/* Search Button */}
                <button
                  type="submit"
                  className="h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-7 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700"
                >
                  <span className="inline-flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    খুঁজুন
                  </span>
                </button>
              </div>
            </div>
          </motion.form>

          {/* Popular */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="mr-1 text-white/50">জনপ্রিয়:</span>

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
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-300"
              >
                {skill}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll */}
      <motion.div
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 sm:block"
        animate={{ y: [0, 8, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/20 p-1">
          <div className="mx-auto h-2 w-1 rounded-full bg-orange-500" />
        </div>
      </motion.div>
    </section>
  );
}