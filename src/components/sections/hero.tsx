"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    window.location.href = `/workers${
      params.toString() ? `?${params.toString()}` : ""
    }`;
  }

  function handlePopularSearch(term: string) {
    window.location.href = `/workers?search=${encodeURIComponent(term)}`;
  }

  return (
    <section className="relative overflow-hidden bg-[#07152d] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute right-[-100px] top-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14 lg:pt-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          {/* LEFT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-slate-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Bangladesh&apos;s Modern Workforce Platform
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="max-w-2xl text-[2.25rem] font-black leading-[1.08] tracking-[-0.025em] sm:text-4xl lg:text-[3.55rem]"
            >
              কাজ, কর্মী ও ব্যবসা—
              <br />
              <span className="text-orange-500">
                একসাথে, এক জায়গায়।
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7"
            >
              শ্রমবাজার একটি আধুনিক Global Workforce &amp; Business
              Ecosystem, যেখানে শ্রমিক, পেশাজীবী, নিয়োগকর্তা, ক্রেতা,
              বিক্রেতা ও ব্যবসা প্রতিষ্ঠান কাজ, দক্ষ কর্মী, পণ্য, সেবা
              ও ব্যবসার সুযোগ খুঁজে পেতে এবং সংযুক্ত হতে পারে।
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-5 flex flex-wrap gap-2"
            >
              <Link
                href="/workers"
                className="group inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/15 transition hover:bg-orange-400"
              >
                কর্মী খুঁজুন
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/[0.09]"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                কাজ খুঁজুন
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400"
            >
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-cyan-400" />
                Worker Profiles
              </span>

              <span className="inline-flex items-center gap-1.5">
                <BriefcaseBusiness className="h-3.5 w-3.5 text-orange-400" />
                Job &amp; Hiring
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Trusted Platform
              </span>
            </motion.div>
          </div>

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur-xl sm:p-5">
              <div className="mb-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-orange-400">
                  Workforce Search
                </p>

                <h2 className="mt-1.5 text-xl font-black sm:text-2xl">
                  আপনার প্রয়োজনের মানুষ
                </h2>

                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  দক্ষ Worker বা Professional খুঁজে নিন
                </p>
              </div>

              <form onSubmit={handleSearch} className="space-y-2.5">
                <div className="rounded-xl border border-white/10 bg-[#081a35] px-3 py-2.5">
                  <label className="mb-1 block text-[10px] font-semibold text-slate-500">
                    আমি খুঁজছি
                  </label>

                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-500" />

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder="Mason, Technician, Driver..."
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-[#081a35] px-3 py-2.5">
                  <label className="mb-1 block text-[10px] font-semibold text-slate-500">
                    কোন এলাকায়?
                  </label>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />

                    <input
                      type="text"
                      value={location}
                      onChange={(event) =>
                        setLocation(event.target.value)
                      }
                      placeholder="Dhaka, Chattogram, Khulna..."
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black transition hover:bg-orange-400"
                >
                  <Search className="h-4 w-4" />
                  Search
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>

              <div className="mt-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Popular
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {["Mason", "Electrician", "Driver", "Engineer"].map(
                    (item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handlePopularSearch(item)}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-300"
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-orange-400">
                  <Users className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white">
                    Skilled Professional
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Verified Workforce Profile
                  </p>
                </div>

                <span className="text-xs font-bold text-yellow-400">
                  ★ 5.0
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-1.5">
                <Link
                  href="/jobs"
                  className="rounded-lg border border-white/10 py-2 text-center text-[11px] font-bold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Jobs
                </Link>

                <Link
                  href="/workers"
                  className="rounded-lg border border-white/10 py-2 text-center text-[11px] font-bold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Workers
                </Link>

                <Link
                  href="/marketplace"
                  className="rounded-lg border border-white/10 py-2 text-center text-[11px] font-bold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Market
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}