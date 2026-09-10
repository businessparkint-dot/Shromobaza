"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Loader2,
  MapPin,
  Search as SearchIcon,
  Star,
  UserRound,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Worker = {
  id: string;
  profileId?: string;
  name: string;
  role: string;
  district: string;
  upazila: string;
  experience: string;
  rating: number;
  reviews: number;
  skills: string[];
  verified: boolean;
};

type ApiWorker = {
  id?: string;
  profile_id?: string;
  profileId?: string;

  name?: string;
  full_name?: string;

  role?: string;
  category?: string;
  sub_category?: string;

  district?: string;
  upazila?: string;
  location?: string;

  experience?: string | number;
  rating?: number | string;
  review_count?: number | string;
  reviews?: number | string;

  skills?: string[] | string;

  verified?: boolean;
  is_verified?: boolean;
};

type ApiResponse = {
  workers?: ApiWorker[];
  data?: ApiWorker[];
  results?: ApiWorker[];
  error?: string;
};

function normalizeSkills(value: ApiWorker["skills"]): string[] {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeWorker(worker: ApiWorker): Worker {
  const ratingNumber = Number(worker.rating ?? 0);
  const reviewsNumber = Number(
    worker.review_count ?? worker.reviews ?? 0
  );

  return {
    id: String(worker.id ?? ""),
    profileId:
      worker.profile_id ??
      worker.profileId ??
      undefined,

    name:
      worker.name ??
      worker.full_name ??
      "নাম দেওয়া হয়নি",

    role:
      worker.role ??
      worker.category ??
      worker.sub_category ??
      "দক্ষ কর্মী",

    district:
      worker.district ??
      "",

    upazila:
      worker.upazila ??
      "",

    experience:
      worker.experience
        ? String(worker.experience)
        : "অভিজ্ঞতা উল্লেখ নেই",

    rating: Number.isFinite(ratingNumber)
      ? ratingNumber
      : 0,

    reviews: Number.isFinite(reviewsNumber)
      ? reviewsNumber
      : 0,

    skills: normalizeSkills(worker.skills),

    verified:
      Boolean(
        worker.verified ??
          worker.is_verified ??
          false
      ),
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const [inputQuery, setInputQuery] = useState("");
  const [inputLocation, setInputLocation] = useState("");

  const [workers, setWorkers] = useState<Worker[]>([]);

  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  /*
   * ---------------------------------------------------------
   * Read search query from URL
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const urlQuery =
      params.get("q")?.trim() ?? "";

    const urlLocation =
      params.get("location")?.trim() ?? "";

    setQuery(urlQuery);
    setLocation(urlLocation);

    setInputQuery(urlQuery);
    setInputLocation(urlLocation);

    setSearched(
      Boolean(urlQuery || urlLocation)
    );
  }, []);

  /*
   * ---------------------------------------------------------
   * Load real workers from existing API
   * ---------------------------------------------------------
   */
  useEffect(() => {
    let mounted = true;

    async function loadWorkers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/central-admin/workers",
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Worker API returned ${response.status}`
          );
        }

        const json =
          (await response.json()) as ApiResponse;

        if (!mounted) return;

        if (json.error) {
          throw new Error(json.error);
        }

        const rawWorkers =
          json.workers ??
          json.data ??
          json.results ??
          [];

        const normalized =
          rawWorkers
            .map(normalizeWorker)
            .filter((worker) => worker.id);

        setWorkers(normalized);
      } catch (err) {
        if (!mounted) return;

        console.error(
          "Search workers error:",
          err
        );

        setWorkers([]);

        setError(
          "কর্মীদের তথ্য এখন লোড করা যাচ্ছে না।"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadWorkers();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * Support existing Hero Search custom event
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const handleHeroSearch = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<{
          query?: string;
          location?: string;
        }>;

      const nextQuery =
        customEvent.detail?.query?.trim() ?? "";

      const nextLocation =
        customEvent.detail?.location?.trim() ?? "";

      setQuery(nextQuery);
      setLocation(nextLocation);

      setInputQuery(nextQuery);
      setInputLocation(nextLocation);

      setSearched(
        Boolean(nextQuery || nextLocation)
      );
    };

    window.addEventListener(
      "shromobazar-search",
      handleHeroSearch
    );

    return () => {
      window.removeEventListener(
        "shromobazar-search",
        handleHeroSearch
      );
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * Search filtering
   * ---------------------------------------------------------
   */
  const results = useMemo(() => {
    const q =
      query.trim().toLowerCase();

    const l =
      location.trim().toLowerCase();

    if (!q && !l) {
      return workers;
    }

    return workers.filter(
      (worker) => {
        const workerText = [
          worker.name,
          worker.role,
          worker.district,
          worker.upazila,
          worker.experience,
          ...worker.skills,
        ]
          .join(" ")
          .toLowerCase();

        const locationText = [
          worker.district,
          worker.upazila,
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery =
          !q ||
          workerText.includes(q);

        const matchesLocation =
          !l ||
          locationText.includes(l);

        return (
          matchesQuery &&
          matchesLocation
        );
      }
    );
  }, [workers, query, location]);

  /*
   * ---------------------------------------------------------
   * Search submit
   * ---------------------------------------------------------
   */
  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const nextQuery =
      inputQuery.trim();

    const nextLocation =
      inputLocation.trim();

    setQuery(nextQuery);
    setLocation(nextLocation);

    setSearched(
      Boolean(
        nextQuery ||
          nextLocation
      )
    );

    const params =
      new URLSearchParams();

    if (nextQuery) {
      params.set(
        "q",
        nextQuery
      );
    }

    if (nextLocation) {
      params.set(
        "location",
        nextLocation
      );
    }

    const nextUrl =
      params.toString()
        ? `/search?${params.toString()}`
        : "/search";

    window.history.replaceState(
      {},
      "",
      nextUrl
    );
  };

  /*
   * ---------------------------------------------------------
   * Clear
   * ---------------------------------------------------------
   */
  const handleClear = () => {
    setQuery("");
    setLocation("");

    setInputQuery("");
    setInputLocation("");

    setSearched(false);

    window.history.replaceState(
      {},
      "",
      "/search"
    );
  };

  /*
   * ---------------------------------------------------------
   * Profile URL
   * ---------------------------------------------------------
   *
   * Existing worker page is kept as the fallback because
   * your current project already uses /workers.
   * ---------------------------------------------------------
   */
  const getWorkerUrl = (
    worker: Worker
  ) => {
    return `/workers?worker=${encodeURIComponent(
      worker.id
    )}`;
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* =====================================================
          TOP BAR
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            হোমে ফিরে যান
          </Link>

        </div>
      </section>

      {/* =====================================================
          SEARCH HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 sm:pb-12 sm:pt-14 lg:px-8">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
              <SearchIcon className="h-3.5 w-3.5" />
              SHROMOBAZAR SEARCH
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              খুঁজুন কাজ, কর্মী,
              <br />
              ব্যবসা ও সেবা
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              আপনার প্রয়োজন অনুযায়ী দক্ষ কর্মী,
              কাজ ও ভবিষ্যতের অন্যান্য সেবা খুঁজে
              পাওয়ার জন্য সার্চ করুন।
            </p>

          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-7 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5 sm:p-3"
          >
            <div className="grid gap-2 md:grid-cols-[1fr_240px_auto]">

              {/* Query */}
              <div className="flex items-center rounded-xl bg-slate-50 px-4">
                <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-orange-500" />

                <input
                  value={inputQuery}
                  onChange={(event) =>
                    setInputQuery(
                      event.target.value
                    )
                  }
                  placeholder="কর্মী, কাজ, ব্যবসা, পণ্য বা সেবা খুঁজুন…"
                  className="h-12 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />

                {inputQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setInputQuery("")
                    }
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center rounded-xl bg-slate-50 px-4">
                <MapPin className="mr-3 h-5 w-5 shrink-0 text-orange-500" />

                <input
                  value={inputLocation}
                  onChange={(event) =>
                    setInputLocation(
                      event.target.value
                    )
                  }
                  placeholder="জেলা / উপজেলা"
                  className="h-12 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="h-12 rounded-xl px-7 font-bold"
              >
                <SearchIcon className="mr-2 h-4 w-4" />
                সার্চ
              </Button>

            </div>
          </form>

        </div>
      </section>

      {/* =====================================================
          RESULTS
      ====================================================== */}
      <section className="border-t border-slate-200 bg-slate-50 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Result Header */}
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                {searched
                  ? "সার্চ ফলাফল"
                  : "শ্রমিক / কর্মী"}
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {searched
                  ? "আপনার খোঁজার ফলাফল"
                  : "উপলব্ধ দক্ষ কর্মী"}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {loading
                  ? "তথ্য লোড হচ্ছে…"
                  : `${results.length} জন কর্মী পাওয়া গেছে`}
              </p>

            </div>

            {/* Active filters */}
            {(query || location) && (
              <div className="flex flex-wrap items-center gap-2">

                {query && (
                  <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700">
                    {query}
                  </span>
                )}

                {location && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    <MapPin className="h-3.5 w-3.5" />
                    {location}
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-bold text-orange-600 hover:underline"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>

              </div>
            )}

          </div>

          {/* =================================================
              LOADING
          ================================================== */}
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">

              <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />

              <p className="mt-4 text-sm font-semibold text-slate-600">
                কর্মীদের তথ্য লোড হচ্ছে…
              </p>

            </div>
          )}

          {/* =================================================
              API ERROR
          ================================================== */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-white p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <SearchIcon className="h-6 w-6 text-red-400" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                তথ্য পাওয়া যাচ্ছে না
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-5 font-bold text-orange-600 hover:underline"
              >
                আবার চেষ্টা করুন
              </button>

            </div>
          )}

          {/* =================================================
              RESULTS
          ================================================== */}
          {!loading &&
            !error &&
            results.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {results.map(
                  (worker) => (
                    <article
                      key={worker.id}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                    >

                      {/* Worker Header */}
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 ring-4 ring-orange-50/70">
                            <UserRound className="h-7 w-7" />
                          </div>

                          <div className="min-w-0">

                            <h3 className="truncate font-bold text-slate-900">
                              {worker.name}
                            </h3>

                            <p className="mt-0.5 truncate text-sm font-bold text-orange-600">
                              {worker.role}
                            </p>

                          </div>

                        </div>

                        {worker.verified && (
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50"
                            title="যাচাইকৃত কর্মী"
                          >
                            <BadgeCheck className="h-5 w-5 text-emerald-600" />
                          </div>
                        )}

                      </div>

                      {/* Location */}
                      {(worker.district ||
                        worker.upazila) && (
                        <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">

                          <MapPin className="h-4 w-4 shrink-0 text-orange-500" />

                          <span>
                            {worker.district ||
                              "জেলা নেই"}
                          </span>

                          {worker.upazila && (
                            <>
                              <span className="text-slate-300">
                                •
                              </span>

                              <span>
                                {worker.upazila}
                              </span>
                            </>
                          )}

                        </div>
                      )}

                      {/* Rating */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">

                        <span className="inline-flex items-center gap-1 font-bold text-slate-800">

                          <Star className="h-4 w-4 fill-orange-400 text-orange-400" />

                          {worker.rating > 0
                            ? worker.rating.toFixed(
                                1
                              )
                            : "নতুন"}

                        </span>

                        {worker.reviews > 0 && (
                          <span className="text-sm text-slate-400">
                            ({worker.reviews} রিভিউ)
                          </span>
                        )}

                        <span className="text-sm text-slate-400">
                          • {worker.experience}
                        </span>

                      </div>

                      {/* Skills */}
                      {worker.skills.length >
                        0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">

                          {worker.skills
                            .slice(0, 5)
                            .map(
                              (
                                skill
                              ) => (
                                <Badge
                                  key={
                                    skill
                                  }
                                  variant="secondary"
                                  className="font-medium"
                                >
                                  {skill}
                                </Badge>
                              )
                            )}

                        </div>
                      )}

                      {/* Profile */}
                      <Button
                        className="mt-5 w-full rounded-xl font-bold"
                        size="sm"
                        asChild
                      >
                        <Link
                          href={getWorkerUrl(
                            worker
                          )}
                        >
                          <UserRound className="mr-2 h-4 w-4" />
                          প্রোফাইল দেখুন
                        </Link>
                      </Button>

                    </article>
                  )
                )}

              </div>
            )}

          {/* =================================================
              NO RESULTS
          ================================================== */}
          {!loading &&
            !error &&
            results.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                  <SearchIcon className="h-8 w-8 text-orange-400" />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  কোনো কর্মী পাওয়া যায়নি
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  অন্য পেশা, জেলা অথবা উপজেলা দিয়ে
                  আবার চেষ্টা করুন।
                </p>

                <button
                  type="button"
                  onClick={handleClear}
                  className="mt-5 font-bold text-orange-600 hover:underline"
                >
                  সব কর্মী দেখুন
                </button>

              </div>
            )}

        </div>
      </section>

      {/* =====================================================
          FUTURE UNIVERSAL SEARCH
      ====================================================== */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <BriefcaseBusiness className="h-5 w-5 text-orange-500" />
                  Universal Search
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Shromobazar-এর পরবর্তী ধাপে একই Search থেকে
                  কর্মী, Jobs, Marketplace, Business এবং Services
                  খুঁজে পাওয়া যাবে।
                </p>

              </div>

              <Link
                href="/"
                className="shrink-0 text-sm font-bold text-orange-600 hover:underline"
              >
                Home
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}