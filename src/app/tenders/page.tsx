"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ExternalLink,
  FileText,
  MapPin,
  Search,
} from "lucide-react";

type Tender = {
  id: string;
  detailId: string | null;
  title: string;
  organization: string;
  category: string;
  location: string;
  publishedDate: string;
  deadline: string;
  officialUrl: string;
};

type ApiResponse = {
  success: boolean;
  page: number;
  count: number;
  data: Tender[];
  source?: string;
  sourceUrl?: string;
  error?: string;
};

export default function TendersPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTenders = useCallback(
    async (targetPage: number, keyword = "") => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("page", String(targetPage));

        if (keyword.trim()) {
          params.set("search", keyword.trim());
        }

        const response = await fetch(
          `/api/tenders?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

        const result: ApiResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Tender notice load করা যাচ্ছে না।"
          );
        }

        setTenders(result.data || []);
      } catch (err) {
        setTenders([]);

        setError(
          err instanceof Error
            ? err.message
            : "Tender notice load করা যাচ্ছে না।"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadTenders(page, activeSearch);
  }, [page, activeSearch, loadTenders]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPage(1);
    setActiveSearch(search.trim());
  }

  function clearSearch() {
    setSearch("");
    setActiveSearch("");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Link
                href="/business"
                className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Business
              </Link>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <FileText className="h-6 w-6" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Tender Notice
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    সরকারি tender opportunity — BPPA public notice
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://www.bppa.gov.bd/advertisement-notices/advertisement-works.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700"
            >
              BPPA Official
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSearch}
          className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Tender, organization বা location search করুন..."
                className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              <Search className="h-4 w-4" />
              Search
            </button>

            {activeSearch && (
              <button
                type="button"
                onClick={clearSearch}
                className="h-11 rounded-lg border border-slate-300 px-5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </section>

      {/* INFO */}
      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <strong>Live public notice:</strong> তথ্য BPPA-এর public
          tender listing থেকে নেওয়া হচ্ছে। Tender submit/participate করতে
          official e-GP system ব্যবহার করতে হবে।
        </div>
      </section>

      {/* LIST */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* TABLE HEADER */}
          <div className="hidden grid-cols-[60px_minmax(0,1fr)_220px_150px_130px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
            <div>No.</div>
            <div>Tender Notice</div>
            <div>Procuring Entity</div>
            <div>Location</div>
            <div>Closing</div>
          </div>

          {loading ? (
            <div className="space-y-0">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse border-b border-slate-100 px-5 py-5"
                >
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-1/2 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="px-5 py-12 text-center">
              <div className="text-sm font-semibold text-red-600">
                Tender load করা যায়নি
              </div>

              <p className="mt-2 text-sm text-slate-500">
                {error}
              </p>

              <button
                onClick={() => loadTenders(page, activeSearch)}
                className="mt-5 rounded-lg bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                আবার চেষ্টা করুন
              </button>
            </div>
          ) : tenders.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 text-base font-semibold text-slate-700">
                এই page-এ কোনো tender পাওয়া যায়নি
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Search পরিবর্তন করুন অথবা পরের page দেখুন।
              </p>
            </div>
          ) : (
            tenders.map((tender, index) => (
              <div
                key={tender.id}
                className="border-b border-slate-100 px-4 py-4 transition hover:bg-slate-50 md:px-5"
              >
                {/* DESKTOP */}
                <div className="hidden grid-cols-[60px_minmax(0,1fr)_220px_150px_130px] items-center gap-4 md:grid">
                  <div className="text-sm font-semibold text-slate-400">
                    {(page - 1) * 10 + index + 1}
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={
                        tender.detailId
                          ? `/tenders/${tender.detailId}`
                          : tender.officialUrl
                      }
                      className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800 hover:text-blue-700"
                    >
                      {tender.title}
                    </Link>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Published:{" "}
                      {tender.publishedDate || "N/A"}
                    </div>
                  </div>

                  <div className="text-xs leading-5 text-slate-600">
                    {tender.organization || "N/A"}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-600">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="line-clamp-2">
                      {tender.location || "Bangladesh"}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-700">
                    {tender.deadline || "N/A"}
                  </div>
                </div>

                {/* MOBILE */}
                <div className="md:hidden">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      #{(page - 1) * 10 + index + 1}
                    </span>

                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">
                      WORKS
                    </span>
                  </div>

                  <Link
                    href={
                      tender.detailId
                        ? `/tenders/${tender.detailId}`
                        : tender.officialUrl
                    }
                    className="block text-sm font-semibold leading-5 text-slate-800 hover:text-blue-700"
                  >
                    {tender.title}
                  </Link>

                  <div className="mt-3 space-y-2 text-xs text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-600">
                        Procuring Entity:
                      </span>{" "}
                      {tender.organization || "N/A"}
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {tender.location || "Bangladesh"}
                    </div>

                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Closing: {tender.deadline || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        <div className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-xs text-slate-500">
            BPPA public Works notices — Page{" "}
            <strong>{page}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white">
              {page}
            </div>

            <button
              type="button"
              disabled={loading || tenders.length === 0}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}