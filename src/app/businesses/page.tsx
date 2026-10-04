"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Business = {
  id: string;
  ownerId: string;
  businessType: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logoUrl: string;
  coverUrl: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  websiteUrl: string;
  isVerified: boolean;
  verificationLevel: string;
  status: string;
  createdAt: string | null;
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] =
    useState<Business[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBusinesses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/businesses",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Business load করা যায়নি।"
          );
        }

        setBusinesses(
          Array.isArray(result.businesses)
            ? result.businesses
            : []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Business load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return businesses.filter((business) => {
      if (
        typeFilter !== "all" &&
        business.businessType !== typeFilter
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        business.name,
        business.tagline,
        business.description,
        business.businessType,
        business.city,
        business.district,
        business.address,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [businesses, search, typeFilter]);

  function getTypeLabel(type: string) {
    switch (type) {
      case "shop":
        return "Shop";

      case "office":
        return "Office";

      default:
        return type || "Business";
    }
  }

  function getTypeClass(type: string) {
    switch (type) {
      case "shop":
        return "bg-orange-50 text-orange-700";

      case "office":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Hero */}
        <section className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-6 py-10 text-white shadow-lg sm:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-200">
              Shromobazar Business
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              ব্যবসা খুঁজুন
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Shromobazar-এর verified ও public
              Shop এবং Office এক জায়গায় দেখুন।
              প্রয়োজনীয় ব্যবসা বা সেবা সহজে খুঁজে নিন।
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Business name, city, district..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                সব Business
              </option>

              <option value="shop">
                Shop
              </option>

              <option value="office">
                Office
              </option>
            </select>
          </div>

          <div className="mt-3 text-xs font-semibold text-slate-500">
            {filteredBusinesses.length}টি Business
            পাওয়া গেছে
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-bold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-32 bg-slate-200" />

                  <div className="p-5">
                    <div className="h-5 w-2/3 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                    <div className="mt-5 h-12 rounded bg-slate-100" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredBusinesses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="text-5xl">
                🏢
              </div>

              <h2 className="mt-4 text-xl font-black text-slate-800">
                কোনো Business পাওয়া যায়নি
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Search অথবা filter পরিবর্তন করে আবার চেষ্টা করুন।
              </p>
            </div>
          )}

        {/* Business Cards */}
        {!loading &&
          filteredBusinesses.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredBusinesses.map(
                (business) => (
                  <article
                    key={business.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    {/* Cover */}
                    <div className="relative h-32 bg-gradient-to-r from-slate-800 to-blue-900">
                      {business.coverUrl && (
                        <img
                          src={business.coverUrl}
                          alt=""
                          className="h-full w-full object-cover opacity-80"
                        />
                      )}

                      <div className="absolute inset-0 bg-black/20" />

                      <div className="absolute left-4 top-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${getTypeClass(
                            business.businessType
                          )}`}
                        >
                          {getTypeLabel(
                            business.businessType
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">

                      <div className="-mt-12 mb-4 flex items-end justify-between">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-md">
                          {business.logoUrl ? (
                            <img
                              src={business.logoUrl}
                              alt={business.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">
                              🏢
                            </span>
                          )}
                        </div>

                        {business.isVerified && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-black text-slate-900">
                        {business.name ||
                          "Unnamed Business"}
                      </h2>

                      {business.tagline && (
                        <p className="mt-1 text-sm font-bold text-orange-600">
                          {business.tagline}
                        </p>
                      )}

                      {business.description && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {business.description}
                        </p>
                      )}

                      <div className="mt-4 rounded-xl bg-slate-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                          Location
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {[
                            business.address,
                            business.city,
                            business.district,
                          ]
                            .filter(Boolean)
                            .join(", ") ||
                            "Location not provided"}
                        </p>
                      </div>

                      {business.phone && (
                        <div className="mt-3 text-sm font-semibold text-slate-600">
                          📞 {business.phone}
                        </div>
                      )}

                      {business.email && (
                        <div className="mt-1 break-all text-sm font-semibold text-slate-600">
                          ✉️ {business.email}
                        </div>
                      )}
                    </div>
                  </article>
                )
              )}
            </div>
          )}
      </div>
    </main>
  );
}