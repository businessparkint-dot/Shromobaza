"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
  UserRound,
  Users,
  Wrench,
  X,
} from "lucide-react";

type Worker = {
  id: string;
  name: string;
  role: string;
  category: string;
  subCategory: string;
  division: string;
  district: string;
  location: string;
  phone: string;
  experience: string;
  currentWork: string;
  skills: string[];
  about: string;
  rate: string;
  rating: number;
  completedJobs: number;
  verified: boolean;
  available: boolean;
  availability:
    | "এখনই পাওয়া যাবে"
    | "শীঘ্রই পাওয়া যাবে"
    | "ব্যস্ত";
};

type ApiWorker = {
  id?: string;
  profile_id?: string | null;

  /*
   * /api/workers এখন name এবং phone
   * top-level এ পাঠাচ্ছে।
   */
  name?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;

  category?: string | null;
  sub_category?: string | null;
  experience?: string | null;
  skills?: string | string[] | null;
  district?: string | null;
  location?: string | null;
  rating?: number | null;
  review_count?: number | null;

  profiles?: {
    id?: string;
    name?: string | null;
    phone?: string | null;
    location?: string | null;
    avatar_url?: string | null;
  } | null;
};

function normalizeWorker(item: ApiWorker): Worker {
  const profile = item.profiles ?? {};

  let skills: string[] = [];

  if (Array.isArray(item.skills)) {
    skills = item.skills
      .map((skill) => String(skill).trim())
      .filter(Boolean);
  } else if (typeof item.skills === "string") {
    try {
      const parsed = JSON.parse(item.skills);

      if (Array.isArray(parsed)) {
        skills = parsed
          .map((skill) => String(skill).trim())
          .filter(Boolean);
      } else {
        skills = item.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
    } catch {
      skills = item.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }
  }

  const rating =
    typeof item.rating === "number"
      ? item.rating
      : Number(item.rating ?? 0);

  const location =
    item.location ||
    item.district ||
    profile.location ||
    "";

  /*
   * IMPORTANT:
   * API-এর top-level name আগে নেওয়া হচ্ছে।
   * না থাকলে profiles.name থেকে নেওয়া হবে।
   */
  const workerName =
    item.name?.trim() ||
    profile.name?.trim() ||
    "নাম দেওয়া হয়নি";

  const workerPhone =
    item.phone?.trim() ||
    profile.phone?.trim() ||
    "";

  return {
    id:
      item.id ||
      item.profile_id ||
      crypto.randomUUID(),

    name: workerName,

    role:
      item.sub_category ||
      item.category ||
      "কর্মী",

    category:
      item.category ||
      "অন্যান্য",

    subCategory:
      item.sub_category ||
      "",

    division: "",

    district:
      item.district ||
      "",

    location,

    phone: workerPhone,

    experience:
      item.experience ||
      "অভিজ্ঞতা উল্লেখ করা হয়নি",

    currentWork: "",

    skills,

    about: "",

    rate: "",

    rating,

    completedJobs: 0,

    verified: false,

    available: true,

    availability:
      "এখনই পাওয়া যাবে",
  };
}

export default function WorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWorkers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/workers", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "কর্মীদের তথ্য পাওয়া যায়নি।"
          );
        }

        const apiWorkers: ApiWorker[] =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.workers)
              ? data.workers
              : [];

        const normalized =
          apiWorkers.map(normalizeWorker);

        if (!cancelled) {
          setWorkers(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setWorkers([]);

          setError(
            err instanceof Error
              ? err.message
              : "কর্মীদের তথ্য লোড করা যায়নি।"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWorkers();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        workers
          .map((worker) => worker.category)
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b, "bn")
    );
  }, [workers]);

  const locations = useMemo(() => {
    return Array.from(
      new Set(
        workers
          .map((worker) => worker.location)
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b, "bn")
    );
  }, [workers]);

  const filteredWorkers = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return workers.filter((worker) => {
      const searchableText = [
        worker.name,
        worker.role,
        worker.category,
        worker.subCategory,
        worker.division,
        worker.district,
        worker.location,
        worker.experience,
        worker.currentWork,
        worker.about,
        ...worker.skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !query ||
        searchableText.includes(query);

      const matchesLocation =
        !location ||
        worker.location === location ||
        worker.district === location;

      const matchesCategory =
        !category ||
        worker.category === category;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCategory
      );
    });
  }, [
    workers,
    search,
    location,
    category,
  ]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("");
  };

  const hasFilters =
    search.trim() !== "" ||
    location !== "" ||
    category !== "";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-orange-300 backdrop-blur">
              <Users className="h-4 w-4" />
              শ্রমবাজার Workforce Network
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              দক্ষ কর্মী খুঁজুন,
              <br />
              <span className="text-orange-500">
                সঠিক মানুষকে সঠিক কাজে
              </span>
              <br />
              যুক্ত করুন।
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              শ্রমবাজারের কেন্দ্রীয় workforce
              database থেকে দক্ষ কর্মী, শ্রমিক ও
              পেশাজীবীদের খুঁজে নিন। লোকেশন,
              ক্যাটাগরি এবং দক্ষতা অনুযায়ী সহজে
              অনুসন্ধান করুন।
            </p>
          </div>
        </div>
      </section>

      {/* SEARCH AREA */}
      <section className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <SlidersHorizontal className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                কর্মী খুঁজুন
              </h2>

              <p className="text-sm text-slate-500">
                আপনার প্রয়োজন অনুযায়ী ফিল্টার করুন
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            {/* SEARCH */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="নাম, দক্ষতা, পেশা দিয়ে খুঁজুন..."
                className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {/* LOCATION */}
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <select
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="">
                  সব লোকেশন
                </option>

                {locations.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* CATEGORY */}
            <div className="relative">
              <Wrench className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              >
                <option value="">
                  সব ক্যাটাগরি
                </option>

                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* CLEAR */}
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X className="h-4 w-4" />
              পরিষ্কার
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  মোট কর্মী
                </p>

                <p className="mt-1 text-3xl font-black text-slate-900">
                  {loading
                    ? "—"
                    : workers.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  পাওয়া গেছে
                </p>

                <p className="mt-1 text-3xl font-black text-slate-900">
                  {loading
                    ? "—"
                    : filteredWorkers.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Search className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  ক্যাটাগরি
                </p>

                <p className="mt-1 text-3xl font-black text-slate-900">
                  {loading
                    ? "—"
                    : categories.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Wrench className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <X className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-black text-red-900">
                  কর্মীদের তথ্য লোড করা যায়নি
                </h3>

                <p className="mt-1 text-sm leading-6 text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
                >
                  <div className="mb-5 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-200" />

                    <div className="flex-1">
                      <div className="h-4 w-32 rounded bg-slate-200" />
                      <div className="mt-2 h-3 w-24 rounded bg-slate-200" />
                    </div>
                  </div>

                  <div className="h-3 w-full rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-4/5 rounded bg-slate-200" />

                  <div className="mt-6 h-10 w-full rounded-xl bg-slate-200" />
                </div>
              )
            )}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          filteredWorkers.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Users className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-900">
                {workers.length === 0
                  ? "এখনও কোনো কর্মী নিবন্ধিত হয়নি"
                  : "আপনার অনুসন্ধানের সাথে কোনো কর্মী পাওয়া যায়নি"}
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-500">
                {workers.length === 0
                  ? "নতুন কর্মী নিবন্ধন করলে এখানে তাদের প্রোফাইল দেখা যাবে।"
                  : "অনুসন্ধানের শব্দ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।"}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  সব ফিল্টার পরিষ্কার করুন
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

        {/* WORKER CARDS */}
        {!loading &&
          filteredWorkers.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorkers.map((worker) => (
                <article
                  key={worker.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-900/10"
                >
                  <div className="p-6">
                    {/* PROFILE HEADER */}
                    <div className="flex items-start gap-4">
                      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg">
                        <UserRound className="h-8 w-8" />

                        {worker.available && (
                          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h2 className="truncate text-lg font-black text-slate-900">
                              {worker.name}
                            </h2>

                            <p className="mt-0.5 truncate text-sm font-semibold text-orange-600">
                              {worker.role}
                            </p>
                          </div>

                          {worker.verified && (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-500" />
                          )}
                        </div>

                        <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />

                          <span className="truncate">
                            {worker.location ||
                              "লোকেশন উল্লেখ করা হয়নি"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RATING */}
                    <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                        <span className="font-black text-slate-900">
                          {worker.rating > 0
                            ? worker.rating.toFixed(1)
                            : "নতুন"}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-slate-500">
                        {worker.completedJobs > 0
                          ? `${worker.completedJobs} কাজ সম্পন্ন`
                          : "কাজের ইতিহাস"}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <BriefcaseBusiness className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            অভিজ্ঞতা
                          </p>

                          <p className="truncate text-sm font-bold text-slate-700">
                            {worker.experience}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                          <Wrench className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            ক্যাটাগরি
                          </p>

                          <p className="truncate text-sm font-bold text-slate-700">
                            {worker.category}

                            {worker.subCategory
                              ? ` • ${worker.subCategory}`
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* SKILLS */}
                    {worker.skills.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {worker.skills
                          .slice(0, 4)
                          .map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* STATUS */}
                    <div className="mt-5 flex items-center justify-between">
                      <span
                        className={[
                          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black",
                          worker.available
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-2 w-2 rounded-full",
                            worker.available
                              ? "bg-emerald-500"
                              : "bg-slate-400",
                          ].join(" ")}
                        />

                        {worker.availability}
                      </span>

                      {worker.phone && (
                        <a
                          href={`tel:${worker.phone}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-orange-600"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          কল করুন
                        </a>
                      )}
                    </div>

                    {/* ACTION */}
                    <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
                      <Link
                        href={`/workers/${worker.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-500"
                      >
                        প্রোফাইল দেখুন

                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </Link>

                      {worker.phone && (
                        <a
                          href={`tel:${worker.phone}`}
                          aria-label={`${worker.name}-কে কল করুন`}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Phone className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}