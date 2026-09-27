"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  LineChart,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";
/* =========================================================
   TYPES
========================================================= */

type Share = {
  id: number;
  symbol: string;
  company_name: string;
  market?: string | null;

  current_price?: number | null;
  price?: number | null;
  ltp?: number | null;

  previous_close?: number | null;
  previous_price?: number | null;

  change_value?: number | null;
  change_percent?: number | null;

  volume?: number | null;
  turnover?: number | null;
  total_trades?: number | null;

  sector?: string | null;
  is_active?: boolean | null;

  source_name?: string | null;
  source_url?: string | null;
  source_type?: string | null;

  market_date?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

type ShareHistory = {
  id: number;
  share_id: number;

  symbol?: string | null;
  company_name?: string | null;

  price?: number | null;
  current_price?: number | null;
  ltp?: number | null;

  previous_close?: number | null;
  change_value?: number | null;
  change_percent?: number | null;

  volume?: number | null;
  turnover?: number | null;

  recorded_at?: string | null;
  market_date?: string | null;

  source_name?: string | null;
  source_url?: string | null;
};

type OrderBookRow = {
  id: number;
  share_id: number;
  symbol?: string | null;
  company_name?: string | null;
  side?: string | null;
  order_type?: string | null;
  quantity?: number | null;
  remaining_quantity?: number | null;
  price?: number | null;
  status?: string | null;
  created_at?: string | null;
};

/* =========================================================
   OFFICIAL SOURCES
========================================================= */

const OFFICIAL_DSE_URL = "https://www.dse.com.bd/";
const OFFICIAL_CSE_URL = "https://www.cse.com.bd/";
const OFFICIAL_BSEC_URL = "https://sec.gov.bd/";

/*
 * Only these source names/types are allowed to appear
 * as verified market data.
 *
 * Business Park / Shromobazar seeded/demo records are
 * intentionally excluded.
 */
const OFFICIAL_SOURCE_WORDS = [
  "dse",
  "dhaka stock exchange",
  "dhaka stock exchange plc",
  "cse",
  "chittagong stock exchange",
  "chittagong stock exchange plc",
  "bsec",
  "bangladesh securities and exchange commission",
];

function isOfficialMarketSource(share: Share) {
  const source = `${share.source_name || ""} ${
    share.source_type || ""
  }`.toLowerCase();

  return OFFICIAL_SOURCE_WORDS.some((word) =>
    source.includes(word)
  );
}

/* =========================================================
   HELPERS
========================================================= */

function numeric(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

function optionalNumeric(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function currentPrice(share: Share) {
  return (
    optionalNumeric(share.current_price) ??
    optionalNumeric(share.price) ??
    optionalNumeric(share.ltp) ??
    0
  );
}

function currentChange(share: Share) {
  return (
    optionalNumeric(share.change_value) ??
    0
  );
}

function currentChangePercent(share: Share) {
  return (
    optionalNumeric(share.change_percent) ??
    0
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number) {
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatMoney(value: number) {
  return `৳${formatNumber(value)}`;
}

function dateLabel(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function dateTimeLabel(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function sourceLabel(share?: Share | null) {
  if (!share) return "Official market source";

  if (share.source_name) {
    return share.source_name;
  }

  return "Official market source";
}

function changeClass(value: number) {
  if (value > 0) {
    return "text-emerald-600";
  }

  if (value < 0) {
    return "text-red-600";
  }

  return "text-slate-500";
}

function changeBg(value: number) {
  if (value > 0) {
    return "bg-emerald-50";
  }

  if (value < 0) {
    return "bg-red-50";
  }

  return "bg-slate-100";
}

function historyPrice(row: ShareHistory) {
  return (
    optionalNumeric(row.price) ??
    optionalNumeric(row.current_price) ??
    optionalNumeric(row.ltp) ??
    0
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ShareMarketPage() {
  const [shares, setShares] = useState<Share[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");

  const [selectedShare, setSelectedShare] =
    useState<Share | null>(null);

  const [history, setHistory] = useState<ShareHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [orderBook, setOrderBook] = useState<OrderBookRow[]>([]);
  const [orderBookLoading, setOrderBookLoading] =
    useState(false);

  const [activeTab, setActiveTab] = useState<
    "watch" | "gainers" | "losers" | "active"
  >("watch");

  /* =======================================================
     LOAD REAL OFFICIAL MARKET DATA
  ======================================================= */

  const loadShares = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        const { data, error: queryError } = await supabase
          .from("share_market")
          .select("*")
          .order("symbol", { ascending: true });

        if (queryError) {
          throw queryError;
        }

        /*
         * IMPORTANT:
         * Do not expose Shromobazar / Business Park demo rows
         * as real stock-market data.
         */
        const officialRows = ((data || []) as Share[])
          .filter((row) => row.is_active !== false)
          .filter((row) => isOfficialMarketSource(row))
          .filter((row) => Boolean(row.symbol));

        setShares(officialRows);
      } catch (err) {
        console.error("Share Market load error:", err);

        setShares([]);

        setError(
          err instanceof Error
            ? err.message
            : "Share Market data load করা যায়নি।"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    void loadShares();
  }, [loadShares]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredShares = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return shares;
    }

    return shares.filter((share) => {
      return (
        share.symbol?.toLowerCase().includes(keyword) ||
        share.company_name
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [shares, query]);

  /* =======================================================
     MARKET GROUPS
  ======================================================= */

  const gainers = useMemo(() => {
    return [...filteredShares]
      .filter((item) => currentChange(item) > 0)
      .sort(
        (a, b) =>
          currentChangePercent(b) -
          currentChangePercent(a)
      );
  }, [filteredShares]);

  const losers = useMemo(() => {
    return [...filteredShares]
      .filter((item) => currentChange(item) < 0)
      .sort(
        (a, b) =>
          currentChangePercent(a) -
          currentChangePercent(b)
      );
  }, [filteredShares]);

  const mostActive = useMemo(() => {
    return [...filteredShares].sort(
      (a, b) =>
        numeric(b.volume) - numeric(a.volume)
    );
  }, [filteredShares]);

  const visibleShares = useMemo(() => {
    if (activeTab === "gainers") {
      return gainers;
    }

    if (activeTab === "losers") {
      return losers;
    }

    if (activeTab === "active") {
      return mostActive;
    }

    return filteredShares;
  }, [
    activeTab,
    filteredShares,
    gainers,
    losers,
    mostActive,
  ]);

  /* =======================================================
     LOAD HISTORY
  ======================================================= */

  const loadHistory = useCallback(
    async (share: Share) => {
      try {
        setSelectedShare(share);
        setHistory([]);
        setHistoryLoading(true);

        const { data, error: historyError } =
          await supabase
            .from("share_market_history")
            .select("*")
            .eq("share_id", share.id)
            .order("recorded_at", {
              ascending: true,
            });

        if (historyError) {
          throw historyError;
        }

        const officialHistory = (
          (data || []) as ShareHistory[]
        ).filter((row) => {
          const source = `${row.source_name || ""}`.toLowerCase();

          return OFFICIAL_SOURCE_WORDS.some((word) =>
            source.includes(word)
          );
        });

        setHistory(officialHistory);
      } catch (err) {
        console.error(
          "Share Market history error:",
          err
        );

        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }

      await loadOrderBook(share.id);
    },
    [supabase]
  );

  /* =======================================================
     ORDER BOOK
  ======================================================= */

  const loadOrderBook = useCallback(
    async (shareId: number) => {
      try {
        setOrderBookLoading(true);

        const { data, error: orderError } =
          await supabase
            .from("share_orders")
            .select(
              "id, share_id, symbol, company_name, side, order_type, quantity, remaining_quantity, price, status, created_at"
            )
            .eq("share_id", shareId)
            .in("status", ["OPEN", "PARTIAL"])
            .order("price", {
              ascending: false,
            });

        if (orderError) {
          /*
           * Public users may not have permission to see the
           * order book. That is not a page-breaking error.
           */
          console.warn(
            "Order book unavailable:",
            orderError
          );

          setOrderBook([]);
          return;
        }

        setOrderBook(
          ((data || []) as OrderBookRow[])
        );
      } catch (err) {
        console.warn("Order book error:", err);
        setOrderBook([]);
      } finally {
        setOrderBookLoading(false);
      }
    },
    [supabase]
  );

  /* =======================================================
     SELECTED SHARE NAVIGATION
  ======================================================= */

  const selectedIndex = selectedShare
    ? visibleShares.findIndex(
        (share) => share.id === selectedShare.id
      )
    : -1;

  const previousShare =
    selectedIndex > 0
      ? visibleShares[selectedIndex - 1]
      : null;

  const nextShare =
    selectedIndex >= 0 &&
    selectedIndex < visibleShares.length - 1
      ? visibleShares[selectedIndex + 1]
      : null;

  const openPrevious = () => {
    if (previousShare) {
      void loadHistory(previousShare);
    }
  };

  const openNext = () => {
    if (nextShare) {
      void loadHistory(nextShare);
    }
  };

  /* =======================================================
     KEYBOARD
  ======================================================= */

  useEffect(() => {
    if (!selectedShare) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedShare(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();

        if (previousShare) {
          void loadHistory(previousShare);
        }
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();

        if (nextShare) {
          void loadHistory(nextShare);
        }
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    selectedShare,
    previousShare,
    nextShare,
    loadHistory,
  ]);

  /* =======================================================
     MARKET DATE
  ======================================================= */

  const latestOfficialMarketDate = useMemo(() => {
    const dates = shares
      .map(
        (item) =>
          item.market_date ||
          item.updated_at ||
          null
      )
      .filter(Boolean) as string[];

    if (!dates.length) {
      return null;
    }

    dates.sort(
      (a, b) =>
        new Date(b).getTime() -
        new Date(a).getTime()
    );

    return dates[0];
  }, [shares]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="border-b border-slate-200 bg-[#07152d]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-slate-300">
                <BarChart3 className="h-3.5 w-3.5" />
                Share Market
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                শেয়ার বাজার
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                Official market information দেখুন —
                company, price, change, volume ও
                historical chart এক জায়গায়।
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[9px] font-bold text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Official-source only
                </span>

                {latestOfficialMarketDate && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-bold text-slate-300">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Latest source date:{" "}
                    {dateLabel(
                      latestOfficialMarketDate
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={OFFICIAL_DSE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#07152d] shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                DSE Official
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <a
                href={OFFICIAL_CSE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/10"
              >
                CSE Official
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <a
                href={OFFICIAL_BSEC_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-black text-white transition hover:bg-white/10"
              >
                BSEC
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* SEARCH + REFRESH */}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Company বা symbol search..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#17365d] focus:ring-2 focus:ring-[#17365d]/10"
            />
          </div>

          <button
            type="button"
            onClick={() => void loadShares(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            Refresh Market Data
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ===================================================
            MARKET SOURCE NOTICE
        ==================================================== */}

        {!loading && shares.length === 0 && (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <h2 className="font-black text-amber-900">
                  Official market data এখনো connected নয়
                </h2>

                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Shromobazar কোনো নিজের বানানো
                  company/price/chart-কে real share
                  market data হিসেবে দেখাচ্ছে না।
                  DSE/CSE verified source থেকে data
                  আসার পরেই এখানে market rows
                  দেখানো হবে।
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={OFFICIAL_DSE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#07152d] px-4 py-2.5 text-xs font-black text-white"
                  >
                    DSE Official
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href={OFFICIAL_CSE_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-700 ring-1 ring-slate-200"
                  >
                    CSE Official
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-3xl bg-white ring-1 ring-slate-200"
                />
              )
            )}
          </div>
        ) : (
          <>
            {/* =================================================
                TABS
            ================================================== */}

            {shares.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                {[
                  {
                    id: "watch" as const,
                    label: "Market Watch",
                    icon: LineChart,
                  },
                  {
                    id: "gainers" as const,
                    label: "Top Gainers",
                    icon: TrendingUp,
                  },
                  {
                    id: "losers" as const,
                    label: "Top Losers",
                    icon: TrendingDown,
                  },
                  {
                    id: "active" as const,
                    label: "Most Active",
                    icon: BarChart3,
                  },
                ].map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveTab(tab.id)
                      }
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition ${
                        activeTab === tab.id
                          ? "bg-[#07152d] text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* =================================================
    SHARE GRID — COMPACT 5-ROW MARKET WATCH
================================================= */}

{visibleShares.length > 0 && (
  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    {/* TABLE HEADER */}

    <div className="hidden border-b border-slate-100 bg-slate-50 px-4 py-2.5 sm:grid sm:grid-cols-[1.7fr_1fr_1fr_1fr_auto] sm:items-center sm:gap-3">
      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        Company
      </span>

      <span className="text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
        Price
      </span>

      <span className="text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
        Change
      </span>

      <span className="text-right text-[9px] font-black uppercase tracking-wider text-slate-400">
        Volume
      </span>

      <span className="w-16" />
    </div>

    {/* ONLY FIRST 5 ROWS */}

    <div className="divide-y divide-slate-100">
      {visibleShares.slice(0, 5).map((share) => {
        const price = currentPrice(share);
        const change = currentChange(share);
        const changePercent =
          currentChangePercent(share);

        return (
          <button
            key={share.id}
            type="button"
            onClick={() => void loadHistory(share)}
            className="group block w-full text-left transition hover:bg-slate-50"
          >
            {/* DESKTOP / TABLE ROW */}

            <div className="hidden px-4 py-2.5 sm:grid sm:grid-cols-[1.7fr_1fr_1fr_1fr_auto] sm:items-center sm:gap-3">
              {/* COMPANY */}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-xs font-black text-[#07152d]">
                    {share.symbol}
                  </span>

                  <span className="truncate text-[10px] font-semibold text-slate-500">
                    {share.company_name}
                  </span>
                </div>

                <span className="mt-0.5 block text-[8px] font-bold text-slate-400">
                  {share.market || "DSE"}
                </span>
              </div>

              {/* PRICE */}

              <div className="text-right">
                <p className="text-xs font-black text-[#07152d]">
                  {formatMoney(price)}
                </p>
              </div>

              {/* CHANGE */}

              <div className="text-right">
                <span
                  className={`inline-flex items-center rounded-lg px-2 py-1 text-[9px] font-black ${changeBg(
                    change
                  )} ${changeClass(change)}`}
                >
                  {change > 0
                    ? "+"
                    : ""}
                  {formatNumber(changePercent)}%
                </span>
              </div>

              {/* VOLUME */}

              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500">
                  {numeric(share.volume) > 0
                    ? formatInteger(
                        numeric(
                          share.volume
                        )
                      )
                    : "—"}
                </p>
              </div>

              {/* ACTION */}

              <div className="flex w-16 justify-end">
                <span className="rounded-lg bg-slate-50 px-2 py-1 text-[8px] font-black text-[#17365d] transition group-hover:bg-[#07152d] group-hover:text-white">
                  Chart →
                </span>
              </div>
            </div>

            {/* MOBILE COMPACT ROW */}

            <div className="flex items-center gap-3 px-3 py-2.5 sm:hidden">
              {/* SYMBOL */}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-xs font-black text-[#07152d]">
                    {share.symbol}
                  </span>

                  <span className="truncate text-[9px] font-semibold text-slate-500">
                    {share.company_name}
                  </span>
                </div>

                <span className="mt-0.5 block text-[8px] font-bold text-slate-400">
                  {share.market || "DSE"}
                </span>
              </div>

              {/* PRICE */}

              <div className="shrink-0 text-right">
                <p className="text-xs font-black text-[#07152d]">
                  {formatMoney(price)}
                </p>
              </div>

              {/* CHANGE */}

              <div className="shrink-0">
                <span
                  className={`inline-flex min-w-[54px] justify-center rounded-lg px-1.5 py-1 text-[8px] font-black ${changeBg(
                    change
                  )} ${changeClass(change)}`}
                >
                  {change > 0
                    ? "+"
                    : ""}
                  {formatNumber(
                    changePercent
                  )}
                  %
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>

    {/* FOOTER */}

    {visibleShares.length > 5 && (
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center">
        <span className="text-[9px] font-bold text-slate-400">
          Showing 5 of{" "}
          {visibleShares.length}{" "}
          market records
        </span>
      </div>
    )}
  </div>
)}


            {/* =================================================
                NO RESULT
            ================================================== */}

            {shares.length > 0 &&
              visibleShares.length === 0 && (
                <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center">
                  <Search className="mx-auto h-8 w-8 text-slate-300" />

                  <p className="mt-3 font-black text-slate-700">
                    কোনো market result পাওয়া যায়নি
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    অন্য symbol বা company name দিয়ে
                    search করুন।
                  </p>
                </div>
              )}
          </>
        )}

        {/* ===================================================
            DATA INTEGRITY FOOTER
        ==================================================== */}

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-black text-[#07152d]">
                  Market information policy
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                  Shromobazar নিজস্ব share price তৈরি
                  করে না। Official exchange/regulatory
                  source থেকে verified data পাওয়া গেলে
                  সেটিই প্রদর্শিত হবে।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
              <Clock3 className="h-3.5 w-3.5" />
              Source-driven market display
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SHARE DETAIL MODAL
      ====================================================== */}

      {selectedShare && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/70 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedShare(null);
            }
          }}
        >
          <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="border-b border-slate-200 bg-[#07152d] px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-lg font-black text-white">
                      {selectedShare.symbol}
                    </span>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black text-emerald-300">
                      OFFICIAL SOURCE
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-slate-300">
                    {selectedShare.company_name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedShare(null)
                  }
                  className="rounded-xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6">
              {/* =================================================
                  PRICE SUMMARY
              ================================================== */}

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Current Price
                  </p>

                  <p className="mt-2 text-xl font-black text-[#07152d]">
                    {formatMoney(
                      currentPrice(selectedShare)
                    )}
                  </p>
                </div>

                <div
                  className={`rounded-2xl border border-slate-200 p-4 ${changeBg(
                    currentChange(selectedShare)
                  )}`}
                >
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Change
                  </p>

                  <p
                    className={`mt-2 text-xl font-black ${changeClass(
                      currentChange(selectedShare)
                    )}`}
                  >
                    {currentChange(selectedShare) > 0
                      ? "+"
                      : ""}
                    {formatNumber(
                      currentChange(selectedShare)
                    )}
                  </p>

                  <p
                    className={`mt-1 text-xs font-bold ${changeClass(
                      currentChange(selectedShare)
                    )}`}
                  >
                    {currentChangePercent(
                      selectedShare
                    ) > 0
                      ? "+"
                      : ""}
                    {formatNumber(
                      currentChangePercent(
                        selectedShare
                      )
                    )}
                    %
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Volume
                  </p>

                  <p className="mt-2 text-xl font-black text-[#07152d]">
                    {formatInteger(
                      numeric(selectedShare.volume)
                    )}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Turnover
                  </p>

                  <p className="mt-2 text-xl font-black text-[#07152d]">
                    {formatMoney(
                      numeric(selectedShare.turnover)
                    )}
                  </p>
                </div>
              </div>

              {/* =================================================
                  REAL MARKET DATE / SOURCE
              ================================================== */}

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <CalendarDays className="h-4 w-4" />

                    <span className="text-[9px] font-black uppercase tracking-wider">
                      Market Date
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-black text-[#07152d]">
                    {selectedShare.market_date
                      ? dateLabel(
                          selectedShare.market_date
                        )
                      : "Not supplied by source"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock3 className="h-4 w-4" />

                    <span className="text-[9px] font-black uppercase tracking-wider">
                      Last Source Update
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-black text-[#07152d]">
                    {selectedShare.updated_at
                      ? dateTimeLabel(
                          selectedShare.updated_at
                        )
                      : "Not supplied by source"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="h-4 w-4" />

                    <span className="text-[9px] font-black uppercase tracking-wider">
                      Source
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-black text-[#07152d]">
                    {sourceLabel(selectedShare)}
                  </p>

                  {selectedShare.source_url && (
                    <a
                      href={selectedShare.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Official source
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* =================================================
                  HISTORY CHART
              ================================================== */}

              <div className="mt-6 rounded-3xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-[#17365d]" />

                    <div>
                      <h2 className="text-sm font-black text-[#07152d]">
                        Price History
                      </h2>

                      <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                        Official historical records only
                      </p>
                    </div>
                  </div>
                </div>

                {historyLoading ? (
                  <div className="p-10 text-center">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-[#17365d]" />

                    <p className="mt-3 text-xs font-bold text-slate-400">
                      History load হচ্ছে...
                    </p>
                  </div>
                ) : history.length > 0 ? (
                  <div className="p-5">
                    {/* SIMPLE SVG-LIKE CSS CHART */}

                    <div className="relative h-64 overflow-hidden rounded-2xl bg-[#f8fafc] p-4">
                      <div className="absolute inset-x-4 top-1/4 border-t border-dashed border-slate-200" />
                      <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-slate-200" />
                      <div className="absolute inset-x-4 top-3/4 border-t border-dashed border-slate-200" />

                      <div className="flex h-full items-end gap-1">
                        {history.map(
                          (row, index) => {
                            const prices =
                              history.map(
                                historyPrice
                              );

                            const min =
                              Math.min(...prices);

                            const max =
                              Math.max(...prices);

                            const value =
                              historyPrice(row);

                            const range =
                              max - min || 1;

                            const height =
                              18 +
                              ((value - min) /
                                range) *
                                72;

                            return (
                              <div
                                key={
                                  row.id ||
                                  `${row.recorded_at}-${index}`
                                }
                                className="group relative flex min-w-0 flex-1 items-end"
                              >
                                <div
                                  className="w-full rounded-t-md bg-[#17365d] transition group-hover:bg-orange-500"
                                  style={{
                                    height: `${height}%`,
                                  }}
                                  title={`${dateLabel(
                                    row.market_date ||
                                      row.recorded_at
                                  )} — ${formatMoney(
                                    value
                                  )}`}
                                />
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[560px] text-left">
                        <thead>
                          <tr className="border-b border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-400">
                            <th className="px-3 py-2">
                              Date
                            </th>
                            <th className="px-3 py-2">
                              Price
                            </th>
                            <th className="px-3 py-2">
                              Change
                            </th>
                            <th className="px-3 py-2">
                              Volume
                            </th>
                            <th className="px-3 py-2">
                              Source
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {history
                            .slice()
                            .reverse()
                            .map((row) => {
                              const change =
                                optionalNumeric(
                                  row.change_value
                                ) ?? 0;

                              return (
                                <tr
                                  key={row.id}
                                  className="border-b border-slate-50 text-xs"
                                >
                                  <td className="px-3 py-3 font-semibold text-slate-600">
                                    {dateLabel(
                                      row.market_date ||
                                        row.recorded_at
                                    )}
                                  </td>

                                  <td className="px-3 py-3 font-black text-[#07152d]">
                                    {formatMoney(
                                      historyPrice(row)
                                    )}
                                  </td>

                                  <td
                                    className={`px-3 py-3 font-black ${changeClass(
                                      change
                                    )}`}
                                  >
                                    {change > 0
                                      ? "+"
                                      : ""}
                                    {formatNumber(
                                      change
                                    )}
                                  </td>

                                  <td className="px-3 py-3 font-semibold text-slate-500">
                                    {formatInteger(
                                      numeric(
                                        row.volume
                                      )
                                    )}
                                  </td>

                                  <td className="px-3 py-3 font-semibold text-slate-500">
                                    {row.source_name ||
                                      "Official source"}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <LineChart className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-black text-slate-600">
                      Official history is not available yet
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      History source-এ আসার পর chart
                      automatically এখানে দেখাবে।
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  ORDER BOOK
              ================================================== */}

              <div className="mt-5 rounded-3xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-sm font-black text-[#07152d]">
                    Order Book
                  </h2>

                  <p className="mt-1 text-[10px] font-semibold text-slate-400">
                    Available open orders only
                  </p>
                </div>

                {orderBookLoading ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-4 border-slate-200 border-t-[#17365d]" />
                  </div>
                ) : orderBook.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-400">
                          <th className="px-4 py-3">
                            Side
                          </th>
                          <th className="px-4 py-3">
                            Price
                          </th>
                          <th className="px-4 py-3">
                            Quantity
                          </th>
                          <th className="px-4 py-3">
                            Remaining
                          </th>
                          <th className="px-4 py-3">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {orderBook.map((order) => {
                          const isBuy =
                            String(
                              order.side || ""
                            ).toUpperCase() ===
                            "BUY";

                          return (
                            <tr
                              key={order.id}
                              className="border-b border-slate-50 text-xs"
                            >
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[9px] font-black ${
                                    isBuy
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-red-50 text-red-700"
                                  }`}
                                >
                                  {isBuy
                                    ? "BUY"
                                    : "SELL"}
                                </span>
                              </td>

                              <td className="px-4 py-3 font-black text-[#07152d]">
                                {formatMoney(
                                  numeric(
                                    order.price
                                  )
                                )}
                              </td>

                              <td className="px-4 py-3 font-semibold text-slate-600">
                                {formatInteger(
                                  numeric(
                                    order.quantity
                                  )
                                )}
                              </td>

                              <td className="px-4 py-3 font-semibold text-slate-600">
                                {formatInteger(
                                  numeric(
                                    order.remaining_quantity
                                  )
                                )}
                              </td>

                              <td className="px-4 py-3 font-semibold text-slate-500">
                                {order.status ||
                                  "OPEN"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm font-black text-slate-600">
                      Open order book data নেই
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Public exchange order-book data
                      available হলে এখানে দেখাবে।
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  PRODUCT NAVIGATION
              ================================================== */}

              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={openPrevious}
                  disabled={!previousShare}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Market Watch
                  </p>

                  <p className="mt-1 text-xs font-black text-[#07152d]">
                    {selectedIndex >= 0
                      ? `${selectedIndex + 1} / ${visibleShares.length}`
                      : "—"}
                  </p>

                  <p className="mt-1 text-[9px] font-semibold text-slate-400">
                    ← → keyboard navigation
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openNext}
                  disabled={!nextShare}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* =================================================
                  OFFICIAL LINKS
              ================================================== */}

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <a
                  href={OFFICIAL_DSE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#07152d] px-4 py-2.5 text-xs font-black text-white"
                >
                  DSE Official
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <a
                  href={OFFICIAL_CSE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700"
                >
                  CSE Official
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <a
                  href={OFFICIAL_BSEC_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700"
                >
                  BSEC
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <Link
                  href="/"
                  className="ml-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-600"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}