"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  Edit3,
  Eye,
  EyeOff,
  Filter,
  LineChart,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import { createBrowserClient } from "@supabase/ssr";

type ShareMarketRow = {
  id: string;
  symbol: string;
  company_name: string;
  market_name?: string | null;

  price?: number | null;
  open_price?: number | null;
  high_price?: number | null;
  low_price?: number | null;

  change_value?: number | null;
  change_percent?: number | null;

  volume?: number | null;
  turnover?: number | null;
  trade_count?: number | null;

  currency?: string | null;
  market_status?: string | null;
  source_url?: string | null;
  is_active?: boolean | null;

  created_at?: string | null;
  updated_at?: string | null;
};

type FormState = {
  symbol: string;
  company_name: string;
  market_name: string;

  price: string;
  open_price: string;
  high_price: string;
  low_price: string;

  change_value: string;
  change_percent: string;

  volume: string;
  turnover: string;
  trade_count: string;

  currency: string;
  market_status: string;
  source_url: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  symbol: "",
  company_name: "",
  market_name: "",

  price: "",
  open_price: "",
  high_price: "",
  low_price: "",

  change_value: "",
  change_percent: "",

  volume: "",
  turnover: "",
  trade_count: "",

  currency: "BDT",
  market_status: "open",
  source_url: "",
  is_active: true,
};

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createBrowserClient(url, key);
}

function formatNumber(value?: number | null, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function formatInteger(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status?: string | null) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "open") return "Open";
  if (normalized === "closed") return "Closed";
  if (normalized === "pre_open") return "Pre-open";
  if (normalized === "halted") return "Halted";

  return status || "Unknown";
}

function getStatusClass(status?: string | null) {
  const normalized = (status || "").toLowerCase();

  if (normalized === "open") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (normalized === "closed") {
    return "bg-slate-100 text-slate-600 ring-slate-200";
  }

  if (normalized === "halted") {
    return "bg-red-50 text-red-700 ring-red-200";
  }

  return "bg-amber-50 text-amber-700 ring-amber-200";
}

function numberOrNull(value: string) {
  const trimmed = value.trim();

  if (trimmed === "") return null;

  const number = Number(trimmed);

  if (Number.isNaN(number)) {
    throw new Error("একটি বা একাধিক numeric value সঠিক নয়।");
  }

  return number;
}

export default function CentralAdminShareMarketPage() {
  const [rows, setRows] = useState<ShareMarketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [marketFilter, setMarketFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>(emptyForm);

  const loadMarket = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = getSupabase();

      const { data, error: queryError } = await supabase
        .from("share_market")
        .select(
          `
            id,
            symbol,
            company_name,
            market_name,
            price,
            open_price,
            high_price,
            low_price,
            change_value,
            change_percent,
            volume,
            turnover,
            trade_count,
            currency,
            market_status,
            source_url,
            is_active,
            created_at,
            updated_at
          `,
        )
        .order("symbol", { ascending: true });

      if (queryError) {
        throw new Error(queryError.message);
      }

      setRows((data || []) as ShareMarketRow[]);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Share Market data load করা যায়নি।";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarket();
  }, [loadMarket]);

  const markets = useMemo(() => {
    return Array.from(
      new Set(
        rows
          .map((row) => row.market_name?.trim())
          .filter((value): value is string => Boolean(value)),
      ),
    ).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !keyword ||
        row.symbol.toLowerCase().includes(keyword) ||
        row.company_name.toLowerCase().includes(keyword) ||
        (row.market_name || "").toLowerCase().includes(keyword);

      const matchesMarket =
        marketFilter === "all" || row.market_name === marketFilter;

      const normalizedStatus = (row.market_status || "").toLowerCase();

      const matchesStatus =
        statusFilter === "all" || normalizedStatus === statusFilter;

      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" && row.is_active !== false) ||
        (activeFilter === "inactive" && row.is_active === false);

      return (
        matchesSearch &&
        matchesMarket &&
        matchesStatus &&
        matchesActive
      );
    });
  }, [rows, search, marketFilter, statusFilter, activeFilter]);

  const stats = useMemo(() => {
    const listed = rows.length;

    const active = rows.filter((row) => row.is_active !== false).length;

    const gainers = rows.filter(
      (row) => Number(row.change_percent || 0) > 0,
    ).length;

    const losers = rows.filter(
      (row) => Number(row.change_percent || 0) < 0,
    ).length;

    const unchanged = rows.filter(
      (row) => Number(row.change_percent || 0) === 0,
    ).length;

    const totalVolume = rows.reduce(
      (sum, row) => sum + Number(row.volume || 0),
      0,
    );

    const totalTurnover = rows.reduce(
      (sum, row) => sum + Number(row.turnover || 0),
      0,
    );

    return {
      listed,
      active,
      gainers,
      losers,
      unchanged,
      totalVolume,
      totalTurnover,
    };
  }, [rows]);

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    resetForm();
  };

  const openAddForm = () => {
    setSuccess("");
    setError("");
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (row: ShareMarketRow) => {
    setSuccess("");
    setError("");

    setEditingId(row.id);

    setForm({
      symbol: row.symbol || "",
      company_name: row.company_name || "",
      market_name: row.market_name || "",

      price:
        row.price === null || row.price === undefined
          ? ""
          : String(row.price),

      open_price:
        row.open_price === null || row.open_price === undefined
          ? ""
          : String(row.open_price),

      high_price:
        row.high_price === null || row.high_price === undefined
          ? ""
          : String(row.high_price),

      low_price:
        row.low_price === null || row.low_price === undefined
          ? ""
          : String(row.low_price),

      change_value:
        row.change_value === null || row.change_value === undefined
          ? ""
          : String(row.change_value),

      change_percent:
        row.change_percent === null || row.change_percent === undefined
          ? ""
          : String(row.change_percent),

      volume:
        row.volume === null || row.volume === undefined
          ? ""
          : String(row.volume),

      turnover:
        row.turnover === null || row.turnover === undefined
          ? ""
          : String(row.turnover),

      trade_count:
        row.trade_count === null || row.trade_count === undefined
          ? ""
          : String(row.trade_count),

      currency: row.currency || "BDT",
      market_status: row.market_status || "open",
      source_url: row.source_url || "",
      is_active: row.is_active !== false,
    });

    setShowForm(true);
  };

  const handleInput =
    (field: keyof FormState) =>
    (
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const value =
        event.target instanceof HTMLInputElement &&
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;

      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));
    };

  const saveHistorySnapshot = async (
    shareId: string,
    payload: {
      symbol: string;
      company_name: string;
      market_name: string | null;
      currency: string;
      open_price: number | null;
      high_price: number | null;
      low_price: number | null;
      close_price: number | null;
      price: number | null;
      change_value: number | null;
      change_percent: number | null;
      volume: number | null;
      turnover: number | null;
      trade_count: number | null;
      market_status: string;
      source_url: string | null;
    },
  ) => {
    const supabase = getSupabase();

    const { error: historyError } = await supabase
      .from("share_market_history")
      .insert({
        share_id: shareId,
        ...payload,
        recorded_at: new Date().toISOString(),
      });

    if (historyError) {
      throw new Error(
        `Share saved হয়েছে, কিন্তু history snapshot save হয়নি: ${historyError.message}`,
      );
    }
  };

  const saveRow = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const symbol = form.symbol.trim().toUpperCase();
    const companyName = form.company_name.trim();

    if (!symbol) {
      setError("Symbol দিন।");
      return;
    }

    if (!companyName) {
      setError("Company name দিন।");
      return;
    }

    setSaving(true);

    try {
      const supabase = getSupabase();

      const price = numberOrNull(form.price);
      const openPrice = numberOrNull(form.open_price);
      const highPrice = numberOrNull(form.high_price);
      const lowPrice = numberOrNull(form.low_price);

      const changeValue = numberOrNull(form.change_value);
      const changePercent = numberOrNull(form.change_percent);

      const volume = numberOrNull(form.volume);
      const turnover = numberOrNull(form.turnover);
      const tradeCount = numberOrNull(form.trade_count);

      if (
        highPrice !== null &&
        lowPrice !== null &&
        highPrice < lowPrice
      ) {
        throw new Error("High Price, Low Price-এর চেয়ে কম হতে পারবে না।");
      }

      const payload = {
        symbol,
        company_name: companyName,
        market_name: form.market_name.trim() || null,

        price,
        open_price: openPrice,
        high_price: highPrice,
        low_price: lowPrice,

        change_value: changeValue,
        change_percent: changePercent,

        volume,
        turnover,
        trade_count: tradeCount,

        currency: form.currency.trim() || "BDT",
        market_status: form.market_status,
        source_url: form.source_url.trim() || null,
        is_active: form.is_active,
      };

      let savedId = editingId;

      if (editingId) {
        const { error: updateError } = await supabase
          .from("share_market")
          .update(payload)
          .eq("id", editingId);

        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { data: insertedData, error: insertError } = await supabase
          .from("share_market")
          .insert(payload)
          .select("id")
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }

        savedId = String(insertedData.id);
      }

      if (!savedId) {
        throw new Error("Share ID পাওয়া যায়নি।");
      }

      await saveHistorySnapshot(savedId, {
        symbol,
        company_name: companyName,
        market_name: form.market_name.trim() || null,
        currency: form.currency.trim() || "BDT",

        open_price: openPrice,
        high_price: highPrice,
        low_price: lowPrice,

        close_price: price,
        price,

        change_value: changeValue,
        change_percent: changePercent,

        volume,
        turnover,
        trade_count: tradeCount,

        market_status: form.market_status,
        source_url: form.source_url.trim() || null,
      });

      setSuccess(
        editingId
          ? `${symbol} successfully updated হয়েছে এবং history snapshot তৈরি হয়েছে।`
          : `${symbol} successfully added হয়েছে এবং প্রথম history snapshot তৈরি হয়েছে।`,
      );

      closeForm();
      await loadMarket();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Share Market data save করা যায়নি।";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (row: ShareMarketRow) => {
    setError("");
    setSuccess("");

    try {
      const supabase = getSupabase();

      const nextValue = row.is_active === false;

      const { error: updateError } = await supabase
        .from("share_market")
        .update({
          is_active: nextValue,
        })
        .eq("id", row.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess(
        `${row.symbol} ${nextValue ? "active" : "inactive"} করা হয়েছে।`,
      );

      await loadMarket();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Status update করা যায়নি।";

      setError(message);
    }
  };

  const deleteRow = async (row: ShareMarketRow) => {
    const confirmed = window.confirm(
      `${row.symbol} — ${row.company_name}\n\nএই Share Market entry permanently delete করতে চান?`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const supabase = getSupabase();

      const { error: deleteError } = await supabase
        .from("share_market")
        .delete()
        .eq("id", row.id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setSuccess(`${row.symbol} delete করা হয়েছে।`);

      await loadMarket();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Entry delete করা যায়নি।";

      setError(message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/central-admin"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              title="Central Admin"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 shrink-0 text-indigo-600" />

                <h1 className="truncate text-lg font-extrabold tracking-tight sm:text-xl">
                  Share Market
                </h1>
              </div>

              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Central Admin • Market Monitoring & Data Management
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={loadMarket}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />

              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              <span>Add Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <X className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="font-bold">Action failed</p>
              <p className="mt-0.5 break-words">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="font-bold">Success</p>
              <p className="mt-0.5">{success}</p>
            </div>
          </div>
        )}

        {/* =====================================================
            INFO
        ====================================================== */}
        <section className="mb-6 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/60 to-slate-50 shadow-sm">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Admin Market Control
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Share Market Monitoring Center
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Listing, current price, Open/High/Low, daily change,
                Volume, Turnover, Trades, source এবং visibility এখান
                থেকে manage করা যাবে। প্রতিটি save/update-এর সময়
                database history snapshot তৈরি হবে।
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm lg:min-w-[270px]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Activity className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Current Listing
                  </p>

                  <p className="text-xl font-black text-slate-900">
                    {stats.active} Active
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATS
        ====================================================== */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <BarChart3 className="h-5 w-5" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Listed
              </span>
            </div>

            <p className="mt-4 text-2xl font-black">
              {stats.listed}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Total entries
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-500">
                Active
              </span>
            </div>

            <p className="mt-4 text-2xl font-black text-emerald-700">
              {stats.active}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Public listings
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>

              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            </div>

            <p className="mt-4 text-2xl font-black text-emerald-700">
              {stats.gainers}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Gainers
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <TrendingDown className="h-5 w-5" />
              </div>

              <ArrowDownRight className="h-4 w-4 text-red-500" />
            </div>

            <p className="mt-4 text-2xl font-black text-red-700">
              {stats.losers}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Losers
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <LineChart className="h-5 w-5" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wide text-amber-500">
                Flat
              </span>
            </div>

            <p className="mt-4 text-2xl font-black text-amber-700">
              {stats.unchanged}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Unchanged
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Activity className="h-5 w-5" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-500">
                Volume
              </span>
            </div>

            <p className="mt-4 truncate text-xl font-black text-indigo-700">
              {formatInteger(stats.totalVolume)}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Total listed volume
            </p>
          </div>
        </section>

        {/* =====================================================
            FILTERS
        ====================================================== */}
        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />

            <span className="text-sm font-bold text-slate-800">
              Search & Filters
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search symbol, company or market..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <select
              value={marketFilter}
              onChange={(event) => setMarketFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">All Markets</option>

              {markets.map((market) => (
                <option key={market} value={market}>
                  {market}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">All Market Status</option>
              <option value="open">Open</option>
              <option value="pre_open">Pre-open</option>
              <option value="closed">Closed</option>
              <option value="halted">Halted</option>
            </select>

            <select
              value={activeFilter}
              onChange={(event) => setActiveFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">All Visibility</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setMarketFilter("all");
                setStatusFilter("all");
                setActiveFilter("all");
              }}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </section>

        {/* =====================================================
            MARKET TABLE
        ====================================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Market Listings
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                Showing {filteredRows.length} of {rows.length} entries
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
              <CircleDollarSign className="h-4 w-4" />
              Data source: share_market
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center px-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                <RefreshCw className="h-5 w-5 animate-spin" />
                Loading Share Market...
              </div>
            </div>
          ) : filteredRows.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <BarChart3 className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-base font-extrabold text-slate-800">
                No Share Market entries found
              </h3>

              <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                Filter পরিবর্তন করুন অথবা নতুন company/share entry যোগ করুন।
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Add Share
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1450px] w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-5 py-3 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Share
                    </th>

                    <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Market
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Open
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      High
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Low
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Current
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Change
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Volume
                    </th>

                    <th className="px-4 py-3 text-right text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Turnover
                    </th>

                    <th className="px-4 py-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Trades
                    </th>

                    <th className="px-4 py-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-4 py-3 text-center text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Visibility
                    </th>

                    <th className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Updated
                    </th>

                    <th className="px-5 py-3 text-right text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((row) => {
                    const changePercent = Number(
                      row.change_percent || 0,
                    );

                    const positive = changePercent > 0;
                    const negative = changePercent < 0;

                    return (
                      <tr
                        key={row.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-xs font-black text-indigo-700">
                              {row.symbol.slice(0, 4)}
                            </div>

                            <div className="min-w-0">
                              <p className="font-extrabold text-slate-900">
                                {row.symbol}
                              </p>

                              <p className="max-w-[220px] truncate text-xs font-medium text-slate-500">
                                {row.company_name}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-slate-700">
                            {row.market_name || "—"}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-right font-bold text-slate-700">
                          {formatNumber(row.open_price)}
                        </td>

                        <td className="px-4 py-4 text-right font-bold text-emerald-700">
                          {formatNumber(row.high_price)}
                        </td>

                        <td className="px-4 py-4 text-right font-bold text-red-700">
                          {formatNumber(row.low_price)}
                        </td>

                        <td className="px-4 py-4 text-right">
                          <p className="font-black text-slate-900">
                            {row.currency || "BDT"}{" "}
                            {formatNumber(row.price)}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-right">
                          <div
                            className={`inline-flex flex-col items-end ${
                              positive
                                ? "text-emerald-600"
                                : negative
                                  ? "text-red-600"
                                  : "text-slate-500"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1 text-sm font-extrabold">
                              {positive ? (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              ) : negative ? (
                                <ArrowDownRight className="h-3.5 w-3.5" />
                              ) : null}

                              {row.change_value === null ||
                              row.change_value === undefined
                                ? "—"
                                : `${positive ? "+" : ""}${formatNumber(
                                    row.change_value,
                                  )}`}
                            </span>

                            <span className="text-xs font-bold">
                              {positive ? "+" : ""}
                              {formatNumber(row.change_percent)}%
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-right font-bold text-slate-700">
                          {formatInteger(row.volume)}
                        </td>

                        <td className="px-4 py-4 text-right font-bold text-slate-700">
                          {formatNumber(row.turnover)}
                        </td>

                        <td className="px-4 py-4 text-center font-bold text-slate-700">
                          {formatInteger(row.trade_count)}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold ring-1 ${getStatusClass(
                              row.market_status,
                            )}`}
                          >
                            {getStatusLabel(row.market_status)}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => toggleActive(row)}
                            title={
                              row.is_active === false
                                ? "Activate"
                                : "Deactivate"
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold transition ${
                              row.is_active === false
                                ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {row.is_active === false ? (
                              <>
                                <EyeOff className="h-3.5 w-3.5" />
                                Inactive
                              </>
                            ) : (
                              <>
                                <Eye className="h-3.5 w-3.5" />
                                Active
                              </>
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <p className="whitespace-nowrap text-xs font-medium text-slate-500">
                            {formatDate(row.updated_at || row.created_at)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {row.source_url && (
                              <a
                                href={row.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                                title="Open source"
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => openEditForm(row)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteRow(row)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* =====================================================
            HISTORY WORKSPACE
        ====================================================== */}
        <section className="mt-6 rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <LineChart className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-800">
                Real Market History
              </h3>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
                প্রতিটি Add/Update-এর সময় বর্তমান market data-এর একটি
                database snapshot রাখা হচ্ছে। পর্যাপ্ত verified snapshot
                জমলে public Share Market page-এ date-wise chart ও history
                table দেখানো যাবে।
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                No fabricated historical data
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FUTURE WORKSPACE
        ====================================================== */}
        <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-extrabold text-slate-800">
                Trading & KYC Workspace
              </h3>

              <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">
                ভবিষ্যৎ ধাপে এখানে KYC review, investor profile, buy/sell
                request, order monitoring, portfolio এবং transaction
                records-এর admin workspace যুক্ত করা যাবে। Actual securities
                trading হলে সেটি অনুমোদিত broker/exchange বা regulated
                financial infrastructure-এর সঙ্গে সংযুক্ত করতে হবে।
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {editingId ? "Edit Share" : "Add Share"}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {editingId
                    ? "Existing market listing এবং current data update করুন।"
                    : "New market listing এবং current market data তৈরি করুন।"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={saveRow} className="p-5 sm:p-6">
              {/* BASIC */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />

                  <h3 className="text-sm font-black text-slate-800">
                    Basic Market Information
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Symbol *
                    </label>

                    <input
                      value={form.symbol}
                      onChange={handleInput("symbol")}
                      placeholder="Example: BEXIMCO"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold uppercase outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Company Name *
                    </label>

                    <input
                      value={form.company_name}
                      onChange={handleInput("company_name")}
                      placeholder="Company name"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Market
                    </label>

                    <input
                      value={form.market_name}
                      onChange={handleInput("market_name")}
                      placeholder="Example: DSE / CSE"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Currency
                    </label>

                    <input
                      value={form.currency}
                      onChange={handleInput("currency")}
                      placeholder="BDT"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium uppercase outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              {/* PRICE */}
              <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <CircleDollarSign className="h-4 w-4 text-indigo-600" />

                  <div>
                    <h3 className="text-sm font-black text-slate-800">
                      Price Information
                    </h3>

                    <p className="text-xs text-slate-500">
                      Verified market data থাকলে এখানে দিন।
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Open Price
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={form.open_price}
                      onChange={handleInput("open_price")}
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-emerald-700">
                      High Price
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={form.high_price}
                      onChange={handleInput("high_price")}
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border border-emerald-100 bg-white px-3 text-sm font-medium outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-red-700">
                      Low Price
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={form.low_price}
                      onChange={handleInput("low_price")}
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border border-red-100 bg-white px-3 text-sm font-medium outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-indigo-700">
                      Current / Close
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={form.price}
                      onChange={handleInput("price")}
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border border-indigo-100 bg-white px-3 text-sm font-bold outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              {/* CHANGE */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />

                  <h3 className="text-sm font-black text-slate-800">
                    Daily Change
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Change Value
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={form.change_value}
                      onChange={handleInput("change_value")}
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Change Percent
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={form.change_percent}
                      onChange={handleInput("change_percent")}
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              {/* TRADING */}
              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-indigo-600" />

                  <div>
                    <h3 className="text-sm font-black text-slate-800">
                      Trading Activity
                    </h3>

                    <p className="text-xs text-slate-500">
                      Market activity data.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Volume
                    </label>

                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={form.volume}
                      onChange={handleInput("volume")}
                      placeholder="0"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Turnover
                    </label>

                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={form.turnover}
                      onChange={handleInput("turnover")}
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Number of Trades
                    </label>

                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={form.trade_count}
                      onChange={handleInput("trade_count")}
                      placeholder="0"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              {/* STATUS + SOURCE */}
              <div className="mb-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Market Status
                    </label>

                    <select
                      value={form.market_status}
                      onChange={handleInput("market_status")}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="open">Open</option>
                      <option value="pre_open">Pre-open</option>
                      <option value="closed">Closed</option>
                      <option value="halted">Halted</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-extrabold text-slate-700">
                      Source URL
                    </label>

                    <input
                      type="url"
                      value={form.source_url}
                      onChange={handleInput("source_url")}
                      placeholder="https://..."
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              {/* VISIBILITY */}
              <div>
                <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={handleInput("is_active")}
                    className="h-4 w-4 rounded border-slate-300"
                  />

                  <span>
                    <span className="block text-sm font-extrabold text-slate-800">
                      Active listing
                    </span>

                    <span className="mt-0.5 block text-xs text-slate-500">
                      Active থাকলে public Share Market page-এ listing
                      দেখা যাবে।
                    </span>
                  </span>
                </label>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      {editingId ? "Update Share" : "Save Share"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}