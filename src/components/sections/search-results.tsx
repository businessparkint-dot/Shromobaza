"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  MapPin,
  Search,
  Star,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Worker = {
  id: string;
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

const workers: Worker[] = [
  {
    id: "worker-1",
    name: "মোঃ রাকিব হাসান",
    role: "রাজমিস্ত্রি",
    district: "ঢাকা",
    upazila: "সাভার",
    experience: "৮+ বছর",
    rating: 4.9,
    reviews: 32,
    skills: ["ইটের কাজ", "প্লাস্টার", "টাইলস"],
    verified: true,
  },
  {
    id: "worker-2",
    name: "মোঃ সোহেল মিয়া",
    role: "ইলেকট্রিশিয়ান",
    district: "চট্টগ্রাম",
    upazila: "পটিয়া",
    experience: "৬+ বছর",
    rating: 4.8,
    reviews: 27,
    skills: ["হাউস ওয়্যারিং", "ইন্ডাস্ট্রিয়াল", "সোলার"],
    verified: true,
  },
  {
    id: "worker-3",
    name: "মোঃ কামাল হোসেন",
    role: "এসি টেকনিশিয়ান",
    district: "ঢাকা",
    upazila: "মিরপুর",
    experience: "৭+ বছর",
    rating: 4.9,
    reviews: 41,
    skills: ["এসি", "ফ্রিজ", "মেইনটেন্যান্স"],
    verified: true,
  },
  {
    id: "worker-4",
    name: "মোঃ জাহিদুল ইসলাম",
    role: "ড্রাইভার",
    district: "খুলনা",
    upazila: "খুলনা সদর",
    experience: "১০+ বছর",
    rating: 4.8,
    reviews: 36,
    skills: ["কার", "মাইক্রোবাস", "হাইওয়ে"],
    verified: true,
  },
  {
    id: "worker-5",
    name: "মোঃ আল আমিন",
    role: "প্লাম্বার",
    district: "ঢাকা",
    upazila: "উত্তরা",
    experience: "৫+ বছর",
    rating: 4.7,
    reviews: 21,
    skills: ["পাইপলাইন", "স্যানিটারি", "পাম্প"],
    verified: true,
  },
  {
    id: "worker-6",
    name: "মোঃ হাবিবুর রহমান",
    role: "ওয়েল্ডার",
    district: "নারায়ণগঞ্জ",
    upazila: "ফতুল্লা",
    experience: "৯+ বছর",
    rating: 4.8,
    reviews: 29,
    skills: ["MIG Welding", "Arc Welding", "Fabrication"],
    verified: true,
  },
];

export function SearchResults() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [searched, setSearched] = useState(false);

  /*
   * Hero Search Bar থেকে search data গ্রহণ
   */
  useEffect(() => {
    const handleHeroSearch = (event: Event) => {
      const customEvent = event as CustomEvent<{
        query: string;
        location: string;
      }>;

      setQuery(customEvent.detail.query);
      setLocation(customEvent.detail.location);
      setSearched(true);
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
   * Search filtering
   */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const l = location.trim().toLowerCase();

    /*
     * প্রথমবার page load হলে সব worker দেখাবে
     */
    if (!q && !l) {
      return workers;
    }

    return workers.filter((worker) => {
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
        !q || workerText.includes(q);

      const matchesLocation =
        !l || locationText.includes(l);

      return matchesQuery && matchesLocation;
    });
  }, [query, location]);

  /*
   * Clear search
   */
  const handleClear = () => {
    setQuery("");
    setLocation("");
    setSearched(false);
  };

  return (
    <section
      id="search-results"
      className="bg-navy/[0.02] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Results Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange">
              {searched
                ? "সার্চ ফলাফল"
                : "শ্রমিক তালিকা"}
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold text-navy sm:text-3xl">
              {searched
                ? "আপনার সার্চের ফলাফল"
                : "উপলব্ধ দক্ষ কর্মী"}
            </h2>

            <p className="mt-2 text-sm text-navy/50">
              {results.length} জন কর্মী পাওয়া গেছে
            </p>
          </div>

          {/* Search Info */}
          {(query || location) && (
            <div className="flex flex-wrap items-center gap-2 text-sm">

              {query && (
                <span className="rounded-full bg-orange/10 px-3 py-1.5 font-medium text-orange">
                  {query}
                </span>
              )}

              {location && (
                <span className="flex items-center gap-1 rounded-full bg-navy/5 px-3 py-1.5 font-medium text-navy/60">
                  <MapPin className="h-3.5 w-3.5" />
                  {location}
                </span>
              )}

              <button
                type="button"
                onClick={handleClear}
                className="font-semibold text-orange hover:underline"
              >
                Clear
              </button>

            </div>
          )}

        </div>

        {/* Worker Cards */}
        {results.length > 0 ? (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {results.map((worker) => (

              <article
                key={worker.id}
                className="group rounded-2xl border border-navy/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-lg"
              >

                {/* Worker Header */}
                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    {/* Avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange ring-4 ring-orange/5">
                      <UserRound className="h-7 w-7" />
                    </div>

                    {/* Name */}
                    <div>
                      <h3 className="font-bold text-navy">
                        {worker.name}
                      </h3>

                      <p className="mt-0.5 text-sm font-semibold text-orange">
                        {worker.role}
                      </p>
                    </div>

                  </div>

                  {/* Verified */}
                  {worker.verified && (
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50"
                      title="যাচাইকৃত কর্মী"
                    >
                      <BadgeCheck className="h-5 w-5 text-green-600" />
                    </div>
                  )}

                </div>

                {/* Location */}
                <div className="mt-5 flex items-center gap-2 text-sm text-navy/50">

                  <MapPin className="h-4 w-4 text-orange" />

                  <span>
                    {worker.district}
                  </span>

                  <span className="text-navy/20">
                    •
                  </span>

                  <span>
                    {worker.upazila}
                  </span>

                </div>

                {/* Rating & Experience */}
                <div className="mt-3 flex flex-wrap items-center gap-2">

                  <span className="inline-flex items-center gap-1 font-semibold text-navy">
                    <Star className="h-4 w-4 fill-orange text-orange" />
                    {worker.rating}
                  </span>

                  <span className="text-sm text-navy/40">
                    ({worker.reviews} রিভিউ)
                  </span>

                  <span className="text-sm text-navy/35">
                    • {worker.experience}
                  </span>

                </div>

                {/* Skills */}
                <div className="mt-4 flex flex-wrap gap-1.5">

                  {worker.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="font-medium"
                    >
                      {skill}
                    </Badge>
                  ))}

                </div>

                {/* Profile Button */}
                <Button
                  className="mt-5 w-full"
                  size="sm"
                  asChild
                >
                  <Link
                    href={`/workers?worker=${worker.id}`}
                  >
                    প্রোফাইল দেখুন
                  </Link>
                </Button>

              </article>

            ))}

          </div>

        ) : (

          /* No Results */
          <div className="rounded-2xl border border-dashed border-navy/15 bg-white p-12 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange/5">
              <Search className="h-8 w-8 text-orange/40" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-navy">
              কোনো কর্মী পাওয়া যায়নি
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-navy/50">
              অন্য পেশা, জেলা অথবা উপজেলা দিয়ে
              আবার চেষ্টা করুন।
            </p>

            <button
              type="button"
              onClick={handleClear}
              className="mt-4 font-semibold text-orange hover:underline"
            >
              আবার চেষ্টা করুন
            </button>

          </div>

        )}

      </div>
    </section>
  );
}