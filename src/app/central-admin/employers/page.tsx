"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

type Employer = {
  id: string;
  profileId: string | null;
  employerType: string;
  companyName: string;
  description: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  avatarUrl: string | null;
  userType: string;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function CentralAdminEmployersPage() {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/central-admin/employers",
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Employers load করা যায়নি।"
        );
      }

      setEmployers(result.employers || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Employers load করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployers();
  }, [loadEmployers]);

  const filteredEmployers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return employers;
    }

    return employers.filter((employer) =>
      [
        employer.name,
        employer.companyName,
        employer.employerType,
        employer.phone,
        employer.email,
        employer.location,
        employer.description,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(query)
        )
    );
  }, [employers, search]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Link
              href="/central-admin"
              className="mt-1 rounded-xl border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <Building2
                  size={22}
                  className="text-blue-600"
                />

                <h1 className="text-2xl font-bold text-slate-900">
                  Employers
                </h1>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Registered employer accounts and organizations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadEmployers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                loading ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Employers
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {employers.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Building2 size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Showing
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {filteredEmployers.length}
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Users size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Employer, company, phone, email বা location দিয়ে search করুন..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Employers load হচ্ছে...
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredEmployers.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Building2
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-semibold text-slate-700">
                কোনো Employer পাওয়া যায়নি।
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Search পরিবর্তন করে আবার চেষ্টা করুন।
              </p>
            </div>
          )}

        {/* Employer Cards */}
        {!loading &&
          filteredEmployers.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredEmployers.map(
                (employer) => (
                  <div
                    key={employer.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600">
                        {employer.avatarUrl ? (
                          <img
                            src={employer.avatarUrl}
                            alt={employer.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 size={22} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-base font-bold text-slate-900">
                            {employer.companyName ||
                              employer.name}
                          </h2>

                          {employer.employerType && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                              {employer.employerType}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          Owner / Account:{" "}
                          <span className="font-medium text-slate-700">
                            {employer.name}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2.5 text-sm">
                      {employer.phone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone
                            size={15}
                            className="text-slate-400"
                          />
                          <span>
                            {employer.phone}
                          </span>
                        </div>
                      )}

                      {employer.email && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail
                            size={15}
                            className="text-slate-400"
                          />
                          <span className="break-all">
                            {employer.email}
                          </span>
                        </div>
                      )}

                      {employer.location && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin
                            size={15}
                            className="text-slate-400"
                          />
                          <span>
                            {employer.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {employer.description && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                        {employer.description}
                      </p>
                    )}

                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-400">
                          ID: {employer.id}
                        </span>

                        <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                          Registered Employer
                        </span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </main>
  );
}