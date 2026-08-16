"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";

const popularSearches = [
  "রাজমিস্ত্রি",
  "ইলেকট্রিশিয়ান",
  "প্লাম্বার",
  "ড্রাইভার",
  "ওয়েল্ডার",
  "AC Technician",
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    if (typeof window === "undefined") return;

    const searchQuery = query.trim();
    const searchLocation = location.trim();

    window.dispatchEvent(
      new CustomEvent("shromobazar-search", {
        detail: {
          query: searchQuery,
          location: searchLocation,
        },
      })
    );

    const results = document.getElementById("search-results");

    if (results) {
      results.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.location.href = `/workers?search=${encodeURIComponent(
        searchQuery
      )}&location=${encodeURIComponent(searchLocation)}`;
    }
  };

  const handlePopularSearch = (value: string) => {
    setQuery(value);

    if (typeof window === "undefined") return;

    window.dispatchEvent(
      new CustomEvent("shromobazar-search", {
        detail: {
          query: value,
          location: location.trim(),
        },
      })
    );

    setTimeout(() => {
      const results = document.getElementById("search-results");

      if (results) {
        results.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        window.location.href = `/workers?search=${encodeURIComponent(
          value
        )}&location=${encodeURIComponent(location.trim())}`;
      }
    }, 100);
  };

  return (
    <section className="relative z-20 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            {/* What */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-400 focus-within:bg-white">
              <Search className="mr-3 h-5 w-5 shrink-0 text-orange-500" />

              <div className="w-full">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  কী খুঁজছেন?
                </p>

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="যেমন: রাজমিস্ত্রি"
                  className="mt-0.5 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-400 focus-within:bg-white">
              <MapPin className="mr-3 h-5 w-5 shrink-0 text-orange-500" />

              <div className="w-full">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  কোথায়?
                </p>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  placeholder="জেলা / উপজেলা"
                  className="mt-0.5 w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="flex min-h-[58px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.98]"
            >
              <Search className="h-5 w-5" />
              খুঁজুন
            </button>
          </div>

          {/* Popular Searches */}
          <div className="mt-3 flex flex-wrap items-center gap-2 px-1 pb-1">
            <span className="text-xs font-semibold text-slate-400">
              জনপ্রিয়:
            </span>

            {popularSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handlePopularSearch(item)}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}