"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

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
  isPublic: boolean;
  isVerified: boolean;
  verificationLevel: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function CentralAdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<
    Business[]
  >([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("all");
  const [statusFilter, setStatusFilter] =
    useState("all");
  const [verificationFilter, setVerificationFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);
  const [error, setError] = useState("");

  const loadBusinesses = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(
          "/api/central-admin/businesses",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Business/Office load করা যায়নি।"
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
            : "Business/Office load করা যায়নি।"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const officeCount = businesses.filter(
    (item) => item.businessType === "office"
  ).length;

  const shopCount = businesses.filter(
    (item) => item.businessType === "shop"
  ).length;

  const verifiedCount = businesses.filter(
    (item) => item.isVerified
  ).length;

  const activeCount = businesses.filter(
    (item) => item.status === "active"
  ).length;

  const types = useMemo(() => {
    return Array.from(
      new Set(
        businesses
          .map((item) => item.businessType)
          .filter(Boolean)
      )
    );
  }, [businesses]);

  const statuses = useMemo(() => {
    return Array.from(
      new Set(
        businesses
          .map((item) => item.status)
          .filter(Boolean)
      )
    );
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return businesses.filter((business) => {
      if (
        typeFilter !== "all" &&
        business.businessType !== typeFilter
      ) {
        return false;
      }

      if (
        statusFilter !== "all" &&
        business.status !== statusFilter
      ) {
        return false;
      }

      if (
        verificationFilter === "verified" &&
        !business.isVerified
      ) {
        return false;
      }

      if (
        verificationFilter === "unverified" &&
        business.isVerified
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
        business.ownerId,
        business.phone,
        business.email,
        business.address,
        business.city,
        business.district,
        business.status,
        business.verificationLevel,
        business.slug,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [
    businesses,
    search,
    typeFilter,
    statusFilter,
    verificationFilter,
  ]);

  function formatDate(value: string | null) {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleString(
        "bn-BD",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );
    } catch {
      return value;
    }
  }

  function getBusinessTypeLabel(
    type: string
  ) {
    switch (type) {
      case "office":
        return "Office";
      case "shop":
        return "Shop";
      default:
        return type || "Unknown";
    }
  }

  function getBusinessTypeClass(
    type: string
  ) {
    switch (type) {
      case "office":
        return "bg-emerald-50 text-emerald-700";
      case "shop":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700";

      case "inactive":
        return "bg-slate-100 text-slate-600";

      case "suspended":
        return "bg-red-50 text-red-600";

      case "pending":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-purple-50 text-purple-700";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <Link
                href="/central-admin"
                className="transition hover:text-blue-600"
              >
                Central Admin
              </Link>

              <span>/</span>

              <span className="font-semibold text-slate-700">
                Business / Office
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Business & Office Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Shromobazar-এর Shop ও Office এক জায়গা থেকে দেখুন ও monitor করুন।
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadBusinesses(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Businesses"}
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Total
            </p>

            <p className="mt-2 text-2xl font-black text-slate-900">
              {businesses.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              Office
            </p>

            <p className="mt-2 text-2xl font-black text-emerald-700">
              {officeCount}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
              Shop
            </p>

            <p className="mt-2 text-2xl font-black text-orange-700">
              {shopCount}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
              Verified
            </p>

            <p className="mt-2 text-2xl font-black text-blue-700">
              {verifiedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
              Active
            </p>

            <p className="mt-2 text-2xl font-black text-purple-700">
              {activeCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Business name, owner ID, city..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                সব Type
              </option>

              {types.map((type) => (
                <option
                  key={type}
                  value={type}
                >
                  {getBusinessTypeLabel(type)}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                সব Status
              </option>

              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <select
              value={verificationFilter}
              onChange={(event) =>
                setVerificationFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="all">
                সব Verification
              </option>

              <option value="verified">
                Verified
              </option>

              <option value="unverified">
                Unverified
              </option>
            </select>
          </div>

          <div className="mt-3 text-xs font-semibold text-slate-500">
            Showing{" "}
            <span className="text-slate-900">
              {filteredBusinesses.length}
            </span>{" "}
            of{" "}
            <span className="text-slate-900">
              {businesses.length}
            </span>{" "}
            businesses
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-bold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => loadBusinesses()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 lg:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-5 w-2/3 rounded bg-slate-200" />
                <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-5 h-20 rounded bg-slate-100" />
                <div className="mt-3 h-10 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredBusinesses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="text-4xl">🏢</div>

              <h2 className="mt-3 text-lg font-black text-slate-800">
                কোনো Business পাওয়া যায়নি
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search বা filter পরিবর্তন করে আবার দেখুন।
              </p>
            </div>
          )}

        {/* Businesses */}
        {!loading &&
          filteredBusinesses.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredBusinesses.map(
                (business) => (
                  <article
                    key={business.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  >
                    {/* Cover */}
                    <div className="relative h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700">
                      {business.coverUrl && (
                        <img
                          src={business.coverUrl}
                          alt=""
                          className="h-full w-full object-cover opacity-80"
                        />
                      )}

                      <div className="absolute inset-0 bg-black/20" />

                      <div className="absolute left-5 top-5 flex gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${getBusinessTypeClass(
                            business.businessType
                          )}`}
                        >
                          {getBusinessTypeLabel(
                            business.businessType
                          )}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                            business.status
                          )}`}
                        >
                          {business.status ||
                            "Unknown"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="-mt-12 mb-4 flex items-end justify-between gap-3">
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

                        <div className="pb-1">
                          {business.isVerified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                              ✓ Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h2 className="break-words text-xl font-black text-slate-900">
                          {business.name ||
                            "Unnamed Business"}
                        </h2>

                        {business.tagline && (
                          <p className="mt-1 text-sm font-semibold text-orange-600">
                            {business.tagline}
                          </p>
                        )}

                        {business.description && (
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                            {business.description}
                          </p>
                        )}
                      </div>

                      {/* Info */}
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-3">
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
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Verification
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {business.verificationLevel ||
                              "—"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Phone
                          </p>

                          <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                            {business.phone || "—"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Email
                          </p>

                          <p className="mt-1 break-all text-sm font-semibold text-slate-700">
                            {business.email || "—"}
                          </p>
                        </div>
                      </div>

                      {/* Owner */}
                      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-blue-500">
                          Owner ID
                        </p>

                        <p className="mt-1 break-all font-mono text-xs font-semibold text-blue-800">
                          {business.ownerId ||
                            "—"}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div className="text-[11px] text-slate-400">
                          Created:{" "}
                          <span className="font-semibold">
                            {formatDate(
                              business.createdAt
                            )}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                          ID:{" "}
                          <span className="font-mono">
                            {business.id}
                          </span>
                        </div>
                      </div>
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