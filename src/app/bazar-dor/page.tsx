"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  MapPin,
  RefreshCw,
  Search,
  Store,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

type BazarDorRow = {
  id: number;
  category: string;
  product_name: string;
  product_name_bn: string | null;
  market_name: string | null;
  market_name_bn: string | null;
  district: string | null;
  district_bn: string | null;
  price: number;
  previous_price: number | null;
  unit: string;
  currency: string;
  change_value: number;
  change_percent: number;
  price_type: string;
  source_name: string | null;
  source_url: string | null;
  source_type: string;
  market_status: string;
  is_active: boolean;
  notes: string | null;
  source_report_date: string | null;
  price_min: number | null;
  price_max: number | null;
  created_at: string;
  updated_at: string;
};

type HistoryRow = {
  id: number;
  bazar_dor_id: number;
  product_name: string;
  product_name_bn: string | null;
  market_name: string | null;
  market_name_bn: string | null;
  district: string | null;
  district_bn: string | null;
  price: number;
  previous_price: number | null;
  change_value: number | null;
  change_percent: number | null;
  unit: string;
  currency: string;
  price_type: string;
  source_name: string | null;
  source_url: string | null;
  recorded_at: string;
  source_report_date: string | null;
  price_min: number | null;
  price_max: number | null;
};

const DAM_SOURCE =
  "https://market.dam.gov.bd/market_daily_price_report/damweb/damweb/PublicPortal/?L=E";

const DAM_BANGLA_SOURCE =
  "https://market.dam.gov.bd/market_daily_price_report/damweb/damweb/PublicPortal/?L=B";

const DAM_GRAPH_SOURCE =
  "https://market.dam.gov.bd/price_graphical_report?L=E";

let supabaseClient: SupabaseClient | null = null;

function getSupabase() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase environment variables are missing."
    );
  }

  supabaseClient = createClient(url, key);

  return supabaseClient;
}

function formatMoney(
  value: number | null | undefined
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(
  value: string | null | undefined
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(
  value: string | null | undefined
) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getProductName(row: BazarDorRow) {
  return row.product_name_bn || row.product_name;
}

function getPriceTypeLabel(
  priceType: string
) {
  switch (priceType) {
    case "retail":
      return "Retail / খুচরা";

    case "wholesale":
      return "Wholesale / পাইকারি";

    case "growers":
      return "Growers / উৎপাদক";

    case "minimum":
      return "Minimum / সর্বনিম্ন";

    case "maximum":
      return "Maximum / সর্বোচ্চ";

    case "average":
      return "Average / গড়";

    default:
      return priceType || "Official";
  }
}

function getPriceLabel(row: BazarDorRow) {
  if (
    row.price_min !== null &&
    row.price_max !== null &&
    row.price_min !== row.price_max
  ) {
    return `৳${formatMoney(
      row.price_min
    )} – ৳${formatMoney(row.price_max)}`;
  }

  if (row.price_min !== null) {
    return `৳${formatMoney(row.price_min)}`;
  }

  return `৳${formatMoney(row.price)}`;
}

function getChangeClass(value: number) {
  if (value > 0) return "text-emerald-600";
  if (value < 0) return "text-rose-600";
  return "text-slate-500";
}

function getChangeIcon(value: number) {
  if (value > 0) {
    return <TrendingUp className="h-4 w-4" />;
  }

  if (value < 0) {
    return <TrendingDown className="h-4 w-4" />;
  }

  return null;
}

function getChangeText(row: BazarDorRow) {
  if (
    !row.change_value &&
    !row.change_percent
  ) {
    return "No change";
  }

  const amount =
    row.change_value > 0
      ? `+৳${formatMoney(
          Math.abs(row.change_value)
        )}`
      : `-৳${formatMoney(
          Math.abs(row.change_value)
        )}`;

  const percent =
    row.change_percent > 0
      ? `+${formatMoney(
          Math.abs(row.change_percent)
        )}%`
      : `${formatMoney(
          row.change_percent
        )}%`;

  return `${amount} (${percent})`;
}

function buildChartPoints(
  history: HistoryRow[]
) {
  const ordered = [...history].sort(
    (a, b) =>
      new Date(a.recorded_at).getTime() -
      new Date(b.recorded_at).getTime()
  );

  return ordered
    .map((item) => {
      const value =
        item.price_min !== null
          ? item.price_min
          : item.price;

      return {
        id: item.id,
        value,
        date:
          item.source_report_date ||
          item.recorded_at,
      };
    })
    .filter((item) =>
      Number.isFinite(item.value)
    );
}

export default function BazarDorPage() {
  const [rows, setRows] =
    useState<BazarDorRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("all");

  const [district, setDistrict] =
    useState("all");

  const [priceType, setPriceType] =
    useState("all");

  const [selectedProduct, setSelectedProduct] =
    useState<BazarDorRow | null>(null);

  const [selectedProductIndex, setSelectedProductIndex] =
    useState(-1);

  const [history, setHistory] =
    useState<HistoryRow[]>([]);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [historyError, setHistoryError] =
    useState("");

  const loadData = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const supabase = getSupabase();

        const {
          data,
          error: queryError,
        } = await supabase
          .from("bazar_dor")
          .select(
            [
              "id",
              "category",
              "product_name",
              "product_name_bn",
              "market_name",
              "market_name_bn",
              "district",
              "district_bn",
              "price",
              "previous_price",
              "unit",
              "currency",
              "change_value",
              "change_percent",
              "price_type",
              "source_name",
              "source_url",
              "source_type",
              "market_status",
              "is_active",
              "notes",
              "source_report_date",
              "price_min",
              "price_max",
              "created_at",
              "updated_at",
            ].join(",")
          )
          .eq("is_active", true)
          .order("product_name", {
            ascending: true,
          });

        if (queryError) {
          throw queryError;
        }

        setRows(
          (data ?? []) as unknown as BazarDorRow[]
         );
      } catch (err: any) {
        const errorMessage =
          err?.message ||
          err?.details ||
          err?.hint ||
          String(err) ||
          "বাজার দর লোড করা যায়নি।";

        const errorCode =
          err?.code || "";

        const errorDetails =
          err?.details || "";

        const errorHint =
          err?.hint || "";

        console.error(
          "Bazar Dor load error:",
          errorMessage,
          {
            code: errorCode,
            details: errorDetails,
            hint: errorHint,
          }
        );

        setError(
          [
            errorMessage,
            errorCode
              ? `Code: ${errorCode}`
              : "",
            errorDetails
              ? `Details: ${errorDetails}`
              : "",
            errorHint
              ? `Hint: ${errorHint}`
              : "",
          ]
            .filter(Boolean)
            .join(" | ")
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        rows
          .map((row) => row.category)
          .filter(Boolean)
      )
    ).sort();
  }, [rows]);

 const districts = useMemo(() => {
  return Array.from(
    new Set(
      rows
        .map((row) => row.district)
        .filter(
          (district): district is string =>
            Boolean(district)
        )
    )
  ).sort();
}, [rows]);

  const filteredRows = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !query ||
        row.product_name
          .toLowerCase()
          .includes(query) ||
        (row.product_name_bn || "")
          .toLowerCase()
          .includes(query) ||
        (row.market_name || "")
          .toLowerCase()
          .includes(query) ||
        (row.market_name_bn || "")
          .toLowerCase()
          .includes(query) ||
        (row.district || "")
          .toLowerCase()
          .includes(query) ||
        (row.district_bn || "")
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "all" ||
        row.category === category;

      const matchesDistrict =
        district === "all" ||
        row.district === district;

      const matchesPriceType =
        priceType === "all" ||
        row.price_type === priceType;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDistrict &&
        matchesPriceType
      );
    });
  }, [
    rows,
    search,
    category,
    district,
    priceType,
  ]);

  const rising = useMemo(
    () =>
      rows.filter(
        (row) => row.change_value > 0
      ).length,
    [rows]
  );

  const falling = useMemo(
    () =>
      rows.filter(
        (row) => row.change_value < 0
      ).length,
    [rows]
  );

  const latestUpdated = useMemo(() => {
    if (!rows.length) return null;

    return rows.reduce(
      (latest, row) => {
        const current = new Date(
          row.updated_at
        ).getTime();

        const previous = new Date(
          latest
        ).getTime();

        return current > previous
          ? row.updated_at
          : latest;
      },
      rows[0].updated_at
    );
  }, [rows]);

  const latestReportDate = useMemo(() => {
    const dates = rows
      .map(
        (row) => row.source_report_date
      )
      .filter(
        (date): date is string =>
          Boolean(date)
      )
      .sort(
        (a, b) =>
          new Date(b).getTime() -
          new Date(a).getTime()
      );

    return dates[0] || null;
  }, [rows]);

  const loadHistory = useCallback(
    async (
      product: BazarDorRow,
      productIndex = -1
    ) => {
      try {
        setSelectedProduct(product);
        setSelectedProductIndex(
          productIndex
        );
        setHistory([]);
        setHistoryError("");
        setHistoryLoading(true);

        const supabase = getSupabase();

        const {
          data,
          error: queryError,
        } = await supabase
          .from("bazar_dor_history")
          .select(
            [
              "id",
              "bazar_dor_id",
              "product_name",
              "product_name_bn",
              "market_name",
              "market_name_bn",
              "district",
              "district_bn",
              "price",
              "previous_price",
              "change_value",
              "change_percent",
              "unit",
              "currency",
              "price_type",
              "source_name",
              "source_url",
              "recorded_at",
              "source_report_date",
              "price_min",
              "price_max",
            ].join(",")
          )
          .eq(
            "bazar_dor_id",
            product.id
          )
          .order("recorded_at", {
            ascending: true,
          });

        if (queryError) {
          throw queryError;
        }

        setHistory(
           (data ?? []) as unknown as HistoryRow[]
          );
      } catch (err: any) {
        const errorMessage =
          err?.message ||
          err?.details ||
          err?.hint ||
          "Price history পাওয়া যায়নি।";

        console.error(
          "Bazar Dor history error:",
          {
            message: errorMessage,
            details: err?.details,
            hint: err?.hint,
            code: err?.code,
          }
        );

        setHistoryError(
          [
            errorMessage,
            err?.code
              ? `Code: ${err.code}`
              : "",
            err?.details
              ? `Details: ${err.details}`
              : "",
            err?.hint
              ? `Hint: ${err.hint}`
              : "",
          ]
            .filter(Boolean)
            .join(" | ")
        );
      } finally {
        setHistoryLoading(false);
      }
    },
    []
  );

  const closeHistory = useCallback(() => {
    setSelectedProduct(null);
    setSelectedProductIndex(-1);
    setHistory([]);
    setHistoryError("");
  }, []);

  const openPreviousProduct =
    useCallback(() => {
      if (
        selectedProductIndex <= 0
      ) {
        return;
      }

      const previousIndex =
        selectedProductIndex - 1;

      const previousProduct =
        filteredRows[previousIndex];

      if (!previousProduct) {
        return;
      }

      loadHistory(
        previousProduct,
        previousIndex
      );
    }, [
      selectedProductIndex,
      filteredRows,
      loadHistory,
    ]);

  const openNextProduct =
    useCallback(() => {
      if (
        selectedProductIndex < 0 ||
        selectedProductIndex >=
          filteredRows.length - 1
      ) {
        return;
      }

      const nextIndex =
        selectedProductIndex + 1;

      const nextProduct =
        filteredRows[nextIndex];

      if (!nextProduct) {
        return;
      }

      loadHistory(
        nextProduct,
        nextIndex
      );
    }, [
      selectedProductIndex,
      filteredRows,
      loadHistory,
    ]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        closeHistory();
      }

      if (
        event.key === "ArrowLeft" &&
        !historyLoading
      ) {
        openPreviousProduct();
      }

      if (
        event.key === "ArrowRight" &&
        !historyLoading
      ) {
        openNextProduct();
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
    selectedProduct,
    historyLoading,
    closeHistory,
    openPreviousProduct,
    openNextProduct,
  ]);

  const chartPoints = useMemo(
    () => buildChartPoints(history),
    [history]
  );

  const chart = useMemo(() => {
    if (!chartPoints.length) {
      return null;
    }

    const width = 760;
    const height = 260;

    const paddingLeft = 58;
    const paddingRight = 24;
    const paddingTop = 24;
    const paddingBottom = 46;

    const values = chartPoints.map(
      (point) => point.value
    );

    let min = Math.min(...values);
    let max = Math.max(...values);

    if (min === max) {
      min -= 1;
      max += 1;
    }

    const range = max - min;

    const xStep =
      chartPoints.length === 1
        ? 0
        : (width -
            paddingLeft -
            paddingRight) /
          (chartPoints.length - 1);

    const points = chartPoints.map(
      (point, index) => {
        const x =
          chartPoints.length === 1
            ? width / 2
            : paddingLeft +
              index * xStep;

        const y =
          paddingTop +
          (1 -
            (point.value - min) /
              range) *
            (height -
              paddingTop -
              paddingBottom);

        return {
          ...point,
          x,
          y,
        };
      }
    );

    const path = points
      .map(
        (point, index) =>
          `${
            index === 0 ? "M" : "L"
          } ${point.x} ${point.y}`
      )
      .join(" ");

    return {
      width,
      height,
      min,
      max,
      points,
      path,
    };
  }, [chartPoints]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                <Store className="h-3.5 w-3.5" />
                Official Market Information
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                আজকের বাজার দর
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Bangladesh market price
                information — বর্তমান বাজার
                দর, পরিবর্তন এবং official
                price history এক জায়গায়।
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadData(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Official source bar */}
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black text-emerald-900">
                Official Source:
                Department of Agricultural
                Marketing (DAM)
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-800">
                Shromobazar official DAM
                source থেকে market
                information দেখায়। নিজস্বভাবে
                কোনো বাজার দর বানানো বা
                অনুমান করা হয় না।
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={DAM_SOURCE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-sm ring-1 ring-emerald-200 hover:bg-emerald-100"
              >
                DAM English
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <a
                href={DAM_BANGLA_SOURCE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-sm ring-1 ring-emerald-200 hover:bg-emerald-100"
              >
                DAM বাংলা
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <a
                href={DAM_GRAPH_SOURCE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-800"
              >
                Official Graphical Report
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Last update */}
        <section className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <CalendarDays className="h-4 w-4 text-slate-400" />

            Last updated:

            <span className="font-black text-slate-800">
              {formatDateTime(
                latestUpdated
              )}
            </span>
          </div>

          <div className="text-xs font-semibold text-slate-500">
            Source report date:{" "}

            <span className="font-black text-slate-700">
              {formatDate(
                latestReportDate
              )}
            </span>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Listed Prices
            </p>

            <p className="mt-2 text-3xl font-black text-slate-900">
              {rows.length}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Current active records
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">
              Rising
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-700">
              {rising}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Compared with previous
              stored official value
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
              Falling
            </p>

            <p className="mt-2 text-3xl font-black text-rose-700">
              {falling}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Compared with previous
              stored official value
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search product, market, district..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            <label className="relative">
              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm font-semibold outline-none focus:border-slate-400"
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>

            <label className="relative">
              <select
                value={district}
                onChange={(event) =>
                  setDistrict(
                    event.target.value
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm font-semibold outline-none focus:border-slate-400"
              >
                <option value="all">
                  All Districts
                </option>

                {districts.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>

            <label className="relative">
              <select
                value={priceType}
                onChange={(event) =>
                  setPriceType(
                    event.target.value
                  )
                }
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-sm font-semibold outline-none focus:border-slate-400"
              >
                <option value="all">
                  All Price Types
                </option>

                <option value="retail">
                  Retail / খুচরা
                </option>

                <option value="wholesale">
                  Wholesale / পাইকারি
                </option>

                <option value="growers">
                  Growers / উৎপাদক
                </option>

                <option value="minimum">
                  Minimum / সর্বনিম্ন
                </option>

                <option value="maximum">
                  Maximum / সর্বোচ্চ
                </option>

                <option value="average">
                  Average / গড়
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </section>

        {/* Filter information */}
        {!loading &&
          filteredRows.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-semibold text-slate-500">
                Showing{" "}
                <span className="font-black text-slate-800">
                  {filteredRows.length}
                </span>{" "}
                of{" "}
                <span className="font-black text-slate-800">
                  {rows.length}
                </span>{" "}
                official price records
              </p>

              <p className="text-xs font-semibold text-slate-400">
                Product click করলে official
                price history/chart দেখুন।
              </p>
            </div>
          )}

        {/* Error */}
        {error && (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Loading / data */}
        {loading ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <RefreshCw className="mx-auto h-7 w-7 animate-spin text-slate-400" />

            <p className="mt-3 text-sm font-semibold text-slate-500">
              বাজার দর লোড হচ্ছে...
            </p>
          </section>
        ) : (
          <>
            {/* Desktop table */}
            <section className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Product
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Market
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Price
                      </th>

                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wide text-slate-500">
                        Movement
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-wide text-slate-500">
                        History
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRows.map(
                      (row, index) => (
                        <tr
                          key={row.id}
                          onClick={() =>
                            loadHistory(
                              row,
                              index
                            )
                          }
                          className="cursor-pointer border-b border-slate-100 transition hover:bg-slate-50"
                        >
                          <td className="px-5 py-4">
                            <div className="font-black text-slate-900">
                              {getProductName(
                                row
                              )}
                            </div>

                            <div className="mt-0.5 text-xs text-slate-400">
                              {
                                row.product_name
                              }
                            </div>

                            <div className="mt-1 text-[11px] font-black uppercase tracking-wide text-emerald-600">
                              {getPriceTypeLabel(
                                row.price_type
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />

                              {row.market_name_bn ||
                                row.market_name ||
                                row.district_bn ||
                                row.district ||
                                "Official market"}
                            </div>

                            {row.district && (
                              <div className="mt-1 text-xs text-slate-400">
                                {row.district}
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="text-base font-black text-slate-900">
                              {getPriceLabel(
                                row
                              )}
                            </div>

                            <div className="mt-1 text-xs font-semibold text-slate-400">
                              per {row.unit}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div
                              className={`flex items-center gap-1.5 text-sm font-bold ${getChangeClass(
                                row.change_value
                              )}`}
                            >
                              {getChangeIcon(
                                row.change_value
                              )}

                              {getChangeText(
                                row
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();

                                loadHistory(
                                  row,
                                  index
                                );
                              }}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-100"
                            >
                              View Chart
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Mobile cards */}
            <section className="mt-6 grid gap-3 md:hidden">
              {filteredRows.map(
                (row, index) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() =>
                      loadHistory(
                        row,
                        index
                      )
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black text-slate-900">
                          {getProductName(
                            row
                          )}
                        </div>

                        <div className="mt-0.5 text-xs text-slate-400">
                          {
                            row.product_name
                          }
                        </div>

                        <div className="mt-1 text-[11px] font-black uppercase tracking-wide text-emerald-600">
                          {getPriceTypeLabel(
                            row.price_type
                          )}
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-1 text-xs font-black ${getChangeClass(
                          row.change_value
                        )}`}
                      >
                        {getChangeIcon(
                          row.change_value
                        )}

                        {row.change_percent
                          ? `${
                              row.change_percent >
                              0
                                ? "+"
                                : ""
                            }${formatMoney(
                              row.change_percent
                            )}%`
                          : "—"}
                      </div>
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-xl font-black text-slate-900">
                          {getPriceLabel(
                            row
                          )}
                        </div>

                        <div className="mt-1 text-xs font-semibold text-slate-400">
                          per {row.unit}
                        </div>
                      </div>

                      <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-black text-slate-700">
                        Chart →
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />

                      {row.market_name_bn ||
                        row.market_name ||
                        row.district_bn ||
                        row.district ||
                        "Official market"}
                    </div>
                  </button>
                )
              )}
            </section>

            {filteredRows.length ===
              0 && (
              <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <Search className="mx-auto h-7 w-7 text-slate-300" />

                <p className="mt-3 text-sm font-bold text-slate-600">
                  কোনো বাজার দর পাওয়া
                  যায়নি।
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Search বা filter পরিবর্তন
                  করে আবার দেখুন।
                </p>
              </section>
            )}
          </>
        )}

        {/* Official notice */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-2.5">
              <Store className="h-5 w-5 text-emerald-600" />
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Official Information Notice
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                উপরের বাজার দর
                Department of Agricultural
                Marketing (DAM)-এর official
                market information-এর ভিত্তিতে
                প্রদর্শনের জন্য রাখা হয়েছে।
                Shromobazar নিজে থেকে কোনো
                price estimate বা fake
                historical value তৈরি করে না।
              </p>

              <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold">
                <a
                  href={DAM_SOURCE}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline"
                >
                  Official DAM Source
                </a>

                <a
                  href={DAM_GRAPH_SOURCE}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline"
                >
                  DAM Graphical Report
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* History modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-5">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-4xl sm:rounded-3xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-black text-slate-900">
                    {getProductName(
                      selectedProduct
                    )}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    {
                      selectedProduct.product_name
                    }
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />

                      {selectedProduct.market_name_bn ||
                        selectedProduct.market_name ||
                        selectedProduct.district_bn ||
                        selectedProduct.district ||
                        "Official market"}
                    </span>

                    <span>
                      Current:{" "}

                      <strong className="text-slate-900">
                        {getPriceLabel(
                          selectedProduct
                        )}
                      </strong>
                    </span>

                    <span className="font-black text-emerald-600">
                      {getPriceTypeLabel(
                        selectedProduct.price_type
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    closeHistory
                  }
                  className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {/* Product navigation */}
              {selectedProductIndex >= 0 &&
                filteredRows.length > 0 && (
                  <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        disabled={
                          selectedProductIndex <=
                          0
                        }
                        onClick={
                          openPreviousProduct
                        }
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ← Previous Product
                      </button>

                      <div className="text-center">
                        <div className="text-xs font-bold text-slate-400">
                          Product
                        </div>

                        <div className="mt-1 text-sm font-black text-slate-800">
                          {selectedProductIndex +
                            1}{" "}
                          of{" "}
                          {filteredRows.length}
                        </div>

                        <div className="mt-0.5 text-[10px] font-semibold text-slate-400">
                          ← → keyboard navigation
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={
                          selectedProductIndex >=
                          filteredRows.length -
                            1
                        }
                        onClick={
                          openNextProduct
                        }
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next Product →
                      </button>
                    </div>
                  </div>
                )}

              {historyLoading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
                  <RefreshCw className="mx-auto h-7 w-7 animate-spin text-slate-400" />

                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    Official price history
                    loading...
                  </p>
                </div>
              ) : historyError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
                  {historyError}
                </div>
              ) : chart ? (
                <>
                  {/* Chart */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="font-black text-slate-900">
                          Official Price
                          History
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          Stored official DAM
                          observations only.
                        </p>
                      </div>

                      <div className="text-xs font-bold text-slate-500">
                        {
                          chartPoints.length
                        }{" "}
                        recorded point
                        {chartPoints.length ===
                        1
                          ? ""
                          : "s"}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <svg
                        viewBox={`0 0 ${chart.width} ${chart.height}`}
                        className="h-auto min-w-[620px] w-full"
                        role="img"
                        aria-label="Official price history chart"
                      >
                        <line
                          x1="58"
                          y1="24"
                          x2="58"
                          y2="214"
                          stroke="currentColor"
                          className="text-slate-300"
                        />

                        <line
                          x1="58"
                          y1="214"
                          x2="736"
                          y2="214"
                          stroke="currentColor"
                          className="text-slate-300"
                        />

                        <text
                          x="8"
                          y="30"
                          className="fill-slate-500 text-[12px]"
                        >
                          ৳
                          {formatMoney(
                            chart.max
                          )}
                        </text>

                        <text
                          x="8"
                          y="218"
                          className="fill-slate-500 text-[12px]"
                        >
                          ৳
                          {formatMoney(
                            chart.min
                          )}
                        </text>

                        <path
                          d={chart.path}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-emerald-600"
                        />

                        {chart.points.map(
                          (point) => (
                            <g
                              key={
                                point.id
                              }
                            >
                              <circle
                                cx={point.x}
                                cy={point.y}
                                r="5"
                                className="fill-emerald-600"
                              />

                              <title>
                                {formatDate(
                                  point.date
                                )}{" "}
                                — ৳
                                {formatMoney(
                                  point.value
                                )}
                              </title>
                            </g>
                          )
                        )}
                      </svg>
                    </div>
                  </div>

                  {/* History table */}
                  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
                      <span>Date</span>

                      <span>
                        Official Range
                      </span>

                      <span className="text-right">
                        Source
                      </span>
                    </div>

                    {[...history]
                      .reverse()
                      .map(
                        (item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-3 border-b border-slate-100 px-4 py-3 text-xs last:border-0"
                          >
                            <span className="font-semibold text-slate-600">
                              {formatDate(
                                item.source_report_date ||
                                  item.recorded_at
                              )}
                            </span>

                            <span>
                              <span className="block font-black text-slate-900">
                                {item.price_min !==
                                  null &&
                                item.price_max !==
                                  null ? (
                                  <>
                                    ৳
                                    {formatMoney(
                                      item.price_min
                                    )}{" "}
                                    – ৳
                                    {formatMoney(
                                      item.price_max
                                    )}
                                  </>
                                ) : (
                                  `৳${formatMoney(
                                    item.price
                                  )}`
                                )}
                              </span>

                              <span className="mt-0.5 block text-[10px] font-black uppercase tracking-wide text-emerald-600">
                                {getPriceTypeLabel(
                                  item.price_type
                                )}
                              </span>
                            </span>

                            <span className="text-right font-semibold text-slate-500">
                              DAM
                            </span>
                          </div>
                        )
                      )}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />

                  <h3 className="mt-3 font-black text-slate-800">
                    Official history is
                    not available yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                    এই product-এর জন্য
                    Shromobazar database-এ
                    এখনো পর্যাপ্ত official DAM
                    history জমা হয়নি। তাই
                    কোনো অনুমান বা fake chart
                    দেখানো হচ্ছে না।
                  </p>

                  <a
                    href={DAM_GRAPH_SOURCE}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"
                  >
                    View Official DAM Graph
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {/* Source */}
              <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="text-xs font-black uppercase tracking-wide text-emerald-700">
                  Source
                </div>

                <div className="mt-1 text-sm font-bold text-emerald-900">
                  Department of Agricultural
                  Marketing (DAM)
                </div>

                <div className="mt-1 text-xs leading-5 text-emerald-800">
                  Official report data.
                  Historical chart contains
                  only values actually recorded
                  in Shromobazar from the
                  official source.
                </div>

                <a
                  href={
                    selectedProduct.source_url ||
                    DAM_SOURCE
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:underline"
                >
                  Open official source
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-emerald-800">
                  <span>
                    Report date:{" "}
                    <strong>
                      {formatDate(
                        selectedProduct.source_report_date
                      )}
                    </strong>
                  </span>

                  <span>
                    Unit:{" "}
                    <strong>
                      {selectedProduct.unit}
                    </strong>
                  </span>

                  <span>
                    Type:{" "}
                    <strong>
                      {getPriceTypeLabel(
                        selectedProduct.price_type
                      )}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Bottom navigation */}
              {selectedProductIndex >= 0 &&
                filteredRows.length > 0 && (
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      disabled={
                        selectedProductIndex <=
                        0 ||
                        historyLoading
                      }
                      onClick={
                        openPreviousProduct
                      }
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    <div className="text-center text-xs font-bold text-slate-400">
                      {selectedProductIndex +
                        1}{" "}
                      /{" "}
                      {filteredRows.length}
                    </div>

                    <button
                      type="button"
                      disabled={
                        selectedProductIndex >=
                          filteredRows.length -
                            1 ||
                        historyLoading
                      }
                      onClick={
                        openNextProduct
                      }
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      <footer className="mt-10 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs font-semibold text-slate-400 sm:px-6 lg:px-8">
          Shromobazar — Official Market
          Information View
        </div>
      </footer>
    </main>
  );
}