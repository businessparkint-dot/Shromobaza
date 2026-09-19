"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Building2,
  ChevronDown,
  Clock3,
  ExternalLink,
  Globe2,
  RefreshCw,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

type ShareMarketRow = {
  id: number;
  symbol: string;
  company_name: string;
  market_name?: string | null;
  price?: number | null;
  change_value?: number | null;
  change_percent?: number | null;
  currency?: string | null;
  market_status?: string | null;
  source_url?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export default function ShareMarketPage() {
  const [rows, setRows] = useState<ShareMarketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [marketFilter, setMarketFilter] = useState("all");

  const loadMarket = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const supabase = getSupabase();

      const { data, error: queryError } = await supabase
        .from("share_market")
        .select(
          "id,symbol,company_name,market_name,price,change_value,change_percent,currency,market_status,source_url,is_active,created_at,updated_at",
        )
        .eq("is_active", true)
        .order("symbol", { ascending: true });

      if (queryError) {
        console.error("Share market query error:", queryError);

        setError(
          "Share Market data এখনো পাওয়া যাচ্ছে না। Supabase table এবং RLS policy check করুন।",
        );

        setRows([]);
        return;
      }

      setRows((data ?? []) as ShareMarketRow[]);
    } catch (err) {
      console.error("Share market loading error:", err);

      setError("Share Market data load করতে সমস্যা হয়েছে।");
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadMarket();
  }, []);

  const markets = useMemo(() => {
    const unique = new Set<string>();

    rows.forEach((row) => {
      if (row.market_name) {
        unique.add(row.market_name);
      }
    });

    return Array.from(unique).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        row.symbol.toLowerCase().includes(term) ||
        row.company_name.toLowerCase().includes(term) ||
        (row.market_name ?? "").toLowerCase().includes(term);

      const matchesMarket =
        marketFilter === "all" ||
        (row.market_name ?? "").toLowerCase() === marketFilter.toLowerCase();

      return matchesSearch && matchesMarket;
    });
  }, [rows, search, marketFilter]);

  const activeMarkets = useMemo(() => {
    return new Set(
      rows
        .map((row) => row.market_name)
        .filter(Boolean),
    ).size;
  }, [rows]);

  const gainers = useMemo(
    () =>
      rows.filter(
        (row) => Number(row.change_percent ?? 0) > 0,
      ).length,
    [rows],
  );

  const losers = useMemo(
    () =>
      rows.filter(
        (row) => Number(row.change_percent ?? 0) < 0,
      ).length,
    [rows],
  );

  const formatNumber = (value?: number | null) => {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value))
    ) {
      return "—";
    }

    return Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatChange = (value?: number | null) => {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value))
    ) {
      return "—";
    }

    const number = Number(value);

    if (number > 0) {
      return `+${formatNumber(number)}`;
    }

    return formatNumber(number);
  };

  const formatPercent = (value?: number | null) => {
    if (
      value === null ||
      value === undefined ||
      Number.isNaN(Number(value))
    ) {
      return "—";
    }

    const number = Number(value);

    if (number > 0) {
      return `+${formatNumber(number)}%`;
    }

    return `${formatNumber(number)}%`;
  };

  const getStatusLabel = (status?: string | null) => {
    const value = (status ?? "").toLowerCase();

    if (value === "open") return "OPEN";
    if (value === "closed") return "CLOSED";
    if (value === "pre-open") return "PRE-OPEN";
    if (value === "halted") return "HALTED";

    return status || "MARKET";
  };

  const getChangeClass = (value?: number | null) => {
    const number = Number(value ?? 0);

    if (number > 0) {
      return "text-emerald-600";
    }

    if (number < 0) {
      return "text-red-600";
    }

    return "text-slate-500";
  };

  const getChangeBg = (value?: number | null) => {
    const number = Number(value ?? 0);

    if (number > 0) {
      return "bg-emerald-50";
    }

    if (number < 0) {
      return "bg-red-50";
    }

    return "bg-slate-50";
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* TOP BAR */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <BarChart3 className="h-4 w-4" />
            Share Market
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-gradient-to-br from-[#071b33] via-[#102f52] to-[#173f69]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white/85">
                <TrendingUp className="h-3.5 w-3.5" />
                SHROMOBAZAR MARKET
              </div>

              <h1 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Share Market
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                কোম্পানি, শেয়ার মূল্য ও market movement এক জায়গায় দেখুন।
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadMarket(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#102f52] shadow-lg transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh Market"}
            </button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Listed
            </span>
            <div className="mt-2 text-2xl font-black">{rows.length}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Markets
            </span>
            <div className="mt-2 text-2xl font-black">{activeMarkets}</div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Gainers
            </span>
            <div className="mt-2 text-2xl font-black text-emerald-600">
              {gainers}
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Losers
            </span>
            <div className="mt-2 text-2xl font-black text-red-600">
              {losers}
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Company বা Symbol খুঁজুন..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none focus:border-[#173f69] focus:bg-white"
              />
            </div>

            <div className="relative">
              <select
                value={marketFilter}
                onChange={(event) => setMarketFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm font-semibold outline-none focus:border-[#173f69] focus:bg-white"
              >
                <option value="all">All Markets</option>

                {markets.map((market) => (
                  <option key={market} value={market}>
                    {market}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      {/* ERROR */}
      {error ? (
        <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-bold text-amber-900">
              Share Market data পাওয়া যায়নি
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-800">
              {error}
            </p>
          </div>
        </section>
      ) : null}

      {/* MARKET */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black">Market Watch</h2>

                <p className="mt-1 text-xs text-slate-500">
                  {loading
                    ? "Market data loading..."
                    : `${filteredRows.length}টি result দেখানো হচ্ছে`}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">
                <Clock3 className="h-3.5 w-3.5" />
                Shromobazar Market
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 p-4 sm:p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-slate-100"
                />
              ))}
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <BarChart3 className="h-7 w-7 text-slate-400" />
              </div>

              <h3 className="mt-4 text-lg font-black">
                এখনো Market Data নেই
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Supabase-এর{" "}
                <span className="font-bold text-slate-700">
                  share_market
                </span>{" "}
                table-এ active data যোগ করলে এখানে দেখা যাবে।
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[850px]">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200 text-left text-[11px] font-black uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-3">Company</th>
                      <th className="px-4 py-3">Market</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Change</th>
                      <th className="px-4 py-3 text-right">Change %</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-5 py-3 text-right">Source</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRows.map((row) => {
                      const change = Number(row.change_percent ?? 0);

                      return (
                        <tr
                          key={row.id}
                          className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173f69] text-white">
                                <Building2 className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">
                                <div className="truncate text-sm font-black">
                                  {row.company_name}
                                </div>

                                <div className="mt-0.5 text-xs font-bold text-[#173f69]">
                                  {row.symbol}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-xs font-semibold text-slate-600">
                            {row.market_name || "—"}
                          </td>

                          <td className="px-4 py-4 text-right text-sm font-black">
                            {row.currency || "BDT"}{" "}
                            {formatNumber(row.price)}
                          </td>

                          <td
                            className={`px-4 py-4 text-right text-sm font-bold ${getChangeClass(
                              row.change_value,
                            )}`}
                          >
                            {formatChange(row.change_value)}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <span
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black ${getChangeClass(
                                row.change_percent,
                              )} ${getChangeBg(row.change_percent)}`}
                            >
                              {change > 0 ? (
                                <TrendingUp className="h-3.5 w-3.5" />
                              ) : change < 0 ? (
                                <TrendingDown className="h-3.5 w-3.5" />
                              ) : null}

                              {formatPercent(row.change_percent)}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-center">
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
                              {getStatusLabel(row.market_status)}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            {row.source_url ? (
                              <a
                                href={row.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#173f69] hover:bg-slate-50"
                              >
                                Source
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredRows.map((row) => {
                  const change = Number(row.change_percent ?? 0);

                  return (
                    <div key={row.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#173f69] text-white">
                            <Building2 className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-sm font-black">
                              {row.company_name}
                            </div>

                            <div className="mt-0.5 text-xs font-bold text-[#173f69]">
                              {row.symbol}
                            </div>
                          </div>
                        </div>

                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-600">
                          {getStatusLabel(row.market_status)}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Price
                          </div>

                          <div className="mt-1 text-sm font-black">
                            {row.currency || "BDT"}{" "}
                            {formatNumber(row.price)}
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Change
                          </div>

                          <div
                            className={`mt-1 text-sm font-black ${getChangeClass(
                              row.change_value,
                            )}`}
                          >
                            {formatChange(row.change_value)}
                          </div>
                        </div>

                        <div
                          className={`rounded-xl p-3 ${getChangeBg(
                            row.change_percent,
                          )}`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Change %
                          </div>

                          <div
                            className={`mt-1 flex items-center gap-1 text-sm font-black ${getChangeClass(
                              row.change_percent,
                            )}`}
                          >
                            {change > 0 ? (
                              <TrendingUp className="h-3.5 w-3.5" />
                            ) : change < 0 ? (
                              <TrendingDown className="h-3.5 w-3.5" />
                            ) : null}

                            {formatPercent(row.change_percent)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-xs font-semibold text-slate-500">
                          {row.market_name || "Market"}
                        </div>

                        {row.source_url ? (
                          <a
                            href={row.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-[#173f69]"
                          >
                            Source
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* INFO */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#173f69] text-white">
              <Globe2 className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-black text-[#102f52]">
                Market Data সম্পর্কে
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Shromobazar এই section-এ market information display করবে।
                কোনো investment decision নেওয়ার আগে সংশ্লিষ্ট official market
                source যাচাই করুন।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-black">
              Shromobazar Share Market
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Market information ও future financial tools-এর জন্য dedicated
              space।
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>

            <Link
              href="/business"
              className="inline-flex items-center gap-2 rounded-xl bg-[#173f69] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#102f52]"
            >
              Business
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}