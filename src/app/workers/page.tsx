"use client";

import { useEffect, useMemo, useState } from "react";
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

import { workers as defaultWorkers, type Worker } from "@/lib/database";

const WORKERS_STORAGE_KEY = "shromobazar_workers";

export default function WorkersPage() {
  const [registeredWorkers, setRegisteredWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("সব");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setSearch(params.get("q") || "");
    setLocation(params.get("location") || "");

    try {
      const saved = localStorage.getItem(WORKERS_STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setRegisteredWorkers(parsed);
        }
      }
    } catch {
      setRegisteredWorkers([]);
    }
  }, []);

  const allWorkers = useMemo(() => {
    const combined = [...defaultWorkers, ...registeredWorkers];

    return Array.from(
      new Map(combined.map((worker) => [worker.id, worker])).values()
    );
  }, [registeredWorkers]);

  const categories = useMemo(() => {
    return [
      "সব",
      ...Array.from(
        new Set(allWorkers.map((worker) => worker.category).filter(Boolean))
      ),
    ];
  }, [allWorkers]);

  const filteredWorkers = useMemo(() => {
    const q = search.toLowerCase().trim();
    const loc = location.toLowerCase().trim();

    return allWorkers.filter((worker) => {
      const searchableText = [
        worker.name,
        worker.role,
        worker.category,
        worker.subCategory,
        worker.division,
        worker.district,
        worker.location,
        worker.currentWork,
        worker.about,
        ...worker.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchableText.includes(q);

      const matchesLocation =
        !loc ||
        worker.district.toLowerCase().includes(loc) ||
        worker.location.toLowerCase().includes(loc) ||
        worker.division.toLowerCase().includes(loc);

      const matchesCategory =
        category === "সব" || worker.category === category;

      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [allWorkers, search, location, category]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("সব");

    window.history.replaceState({}, "", "/workers");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-500"
          >
            <ArrowLeft size={18} />
            হোমে ফিরে যান
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-600">
                <Briefcase size={15} />
                শ্রমবাজার
              </div>

              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                দক্ষ কর্মী খুঁজুন
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                পেশা, দক্ষতা, জেলা অথবা এলাকার মাধ্যমে প্রয়োজনীয় কর্মী খুঁজে
                নিন।
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 px-6 py-4 text-white shadow-lg shadow-blue-900/10">
              <p className="text-xs text-blue-100">মোট প্রোফাইল</p>
              <p className="text-3xl font-bold">{allWorkers.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_220px]">
              <div className="flex h-12 items-center rounded-xl bg-white px-4 shadow-sm">
                <Search className="mr-3 h-5 w-5 text-blue-500" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="নাম, পেশা বা দক্ষতা"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <div className="flex h-12 items-center rounded-xl bg-white px-4 shadow-sm">
                <MapPin className="mr-3 h-5 w-5 text-orange-500" />

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="জেলা / এলাকা"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 rounded-xl bg-white px-4 text-sm font-semibold text-slate-700 outline-none"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "সব" ? "সব ক্যাটাগরি" : item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-500">
              <SlidersHorizontal size={16} />
              <span>{filteredWorkers.length} জন পাওয়া গেছে</span>
            </div>

            {(search || location || category !== "সব") && (
              <button
                onClick={clearFilters}
                className="font-semibold text-orange-600 hover:text-orange-700"
              >
                Filter পরিষ্কার করুন
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Workers */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredWorkers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <Search className="mx-auto mb-4 text-slate-300" size={44} />

            <h2 className="text-xl font-bold text-slate-800">
              কোনো কর্মী পাওয়া যায়নি
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              অন্য পেশা, দক্ষতা অথবা এলাকা দিয়ে চেষ্টা করুন।
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
            >
              সব Filter পরিষ্কার করুন
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="bg-gradient-to-br from-blue-800 via-blue-900 to-slate-950 px-5 pb-5 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl font-bold text-white shadow-lg">
                      {worker.name.charAt(0)}
                    </div>

                    {worker.verified ? (
                      <div className="flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                        <CheckCircle size={13} />
                        যাচাইকৃত
                      </div>
                    ) : (
                      <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
                        নতুন
                      </div>
                    )}
                  </div>

                  <h2 className="mt-4 text-lg font-bold text-white">
                    {worker.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-blue-200">
                    {worker.role}
                  </p>
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <MapPin size={17} className="text-orange-500" />
                      {worker.location}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Briefcase size={17} className="text-orange-500" />
                      {worker.experience} অভিজ্ঞতা
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Star
                        size={17}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      {worker.rating > 0
                        ? `${worker.rating.toFixed(1)} Rating`
                        : "নতুন প্রোফাইল"}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {worker.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-400">
                      বর্তমানে
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-700">
                      {worker.currentWork}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-slate-400">
                      প্রত্যাশিত পারিশ্রমিক
                    </p>

                    <p className="mt-1 font-bold text-orange-600">
                      {worker.rate}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${worker.phone}`}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 font-semibold text-slate-700 hover:bg-orange-50"
                    >
                      <Phone size={16} />
                      কল করুন
                    </a>

                    <Link
                      href={`/workers/${worker.id}`}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 font-semibold text-white hover:bg-orange-600"
                    >
                      প্রোফাইল
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