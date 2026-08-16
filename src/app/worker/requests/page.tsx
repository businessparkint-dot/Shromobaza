"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Star,
  CheckCircle,
  Briefcase,
  ArrowLeft,
  Phone,
  SlidersHorizontal,
} from "lucide-react";

import { workers } from "@/lib/database";

export default function WorkersPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("সব");
  const [location, setLocation] = useState("সব");

  const categories = useMemo(() => {
    const list = workers.map((worker) => worker.category);
    return ["সব", ...Array.from(new Set(list))];
  }, []);

  const locations = useMemo(() => {
    const list = workers.map((worker) => worker.location);
    return ["সব", ...Array.from(new Set(list))];
  }, []);

  const filteredWorkers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return workers.filter((worker) => {
      const matchesSearch =
        !query ||
        worker.name.toLowerCase().includes(query) ||
        worker.category.toLowerCase().includes(query) ||
        worker.location.toLowerCase().includes(query) ||
        worker.currentWork.toLowerCase().includes(query);

      const matchesCategory =
        category === "সব" || worker.category === category;

      const matchesLocation =
        location === "সব" || worker.location === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [search, category, location]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-orange-600"
          >
            <ArrowLeft size={18} />
            হোমে ফিরে যান
          </Link>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">
                <Briefcase size={15} />
                শ্রমবাজার
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                দক্ষ কর্মী খুঁজুন
              </h1>

              <p className="mt-2 text-slate-600">
                ইঞ্জিনিয়ার, মিস্ত্রি, টেকনিশিয়ান, ডাক্তার, আইনজীবীসহ বিভিন্ন
                পেশার মানুষ খুঁজে নিন।
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white">
              <p className="text-xs text-slate-300">মোট প্রোফাইল</p>
              <p className="text-2xl font-bold">{workers.length}+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_180px]">
            {/* Search */}
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="নাম, পেশা, এলাকা বা কাজ দিয়ে খুঁজুন..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === "সব" ? "সব ক্যাটাগরি" : item}
                </option>
              ))}
            </select>

            {/* Location */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item === "সব" ? "সব এলাকা" : item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <SlidersHorizontal size={16} />
            <span>{filteredWorkers.length} জন পাওয়া গেছে</span>
          </div>
        </div>
      </section>

      {/* Workers */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredWorkers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Search className="mx-auto mb-4 text-slate-300" size={42} />

            <h2 className="text-xl font-bold text-slate-800">
              কোনো প্রোফাইল পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              অন্য নাম, ক্যাটাগরি বা এলাকা দিয়ে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Card Top */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-5 pb-5 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xl font-bold text-slate-900 shadow">
                      {worker.name.charAt(0)}
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                      <CheckCircle size={13} />
                      যাচাইকৃত
                    </div>
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-white">
                    {worker.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-blue-200">
                    {worker.category}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin
                        size={17}
                        className="shrink-0 text-orange-500"
                      />
                      <span>{worker.location}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Briefcase
                        size={17}
                        className="shrink-0 text-orange-500"
                      />
                      <span>{worker.experience} অভিজ্ঞতা</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Star
                        size={17}
                        className="shrink-0 fill-yellow-400 text-yellow-400"
                      />
                      <span>প্রফেশনাল প্রোফাইল</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      দক্ষতা
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(worker.skills ?? []).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                        >
                          {skill}
                        </span>
                      ))}

                      {/* skills না থাকলে category দেখাবে */}
                      {(!worker.skills || worker.skills.length === 0) && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {worker.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Current Work */}
                  <div className="mt-5 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-400">
                      বর্তমানে কর্মরত
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {worker.currentWork}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${worker.phone}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
                    >
                      <Phone size={16} />
                      কল করুন
                    </a>

                    <Link
                      href={`/workers/${worker.id}`}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                      প্রোফাইল দেখুন
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}