"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";

type Order = {
  id: number;
  share_id: string;
  symbol: string;
  company_name: string;
  side: "BUY" | "SELL";
  order_type: "MARKET" | "LIMIT";
  quantity: number;
  filled_quantity: number;
  price: number | null;
  status: string;
  created_at: string;
};

type OrderBookProps = {
  shareId: string;
  symbol: string;
  companyName: string;
  currency?: string;
};

function money(value: number | null | undefined, currency = "BDT") {
  if (value == null) return "—";

  return `${currency} ${Number(value).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function remaining(order: Order) {
  return Math.max(
    0,
    Number(order.quantity || 0) -
      Number(order.filled_quantity || 0),
  );
}

export default function OrderBook({
  shareId,
  symbol,
  companyName,
  currency = "BDT",
}: OrderBookProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] =
    useState<"LIMIT" | "MARKET">("LIMIT");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(
        `/api/share-market/orders?shareId=${encodeURIComponent(
          shareId,
        )}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Order Book load করা যায়নি।",
        );
      }

      setOrders(
        Array.isArray(data?.orders) ? data.orders : [],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Order Book load করা যায়নি।",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [shareId]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function refresh() {
    setRefreshing(true);
    await loadOrders();
  }

  async function submitOrder() {
    setMessage("");
    setError("");

    const qty = Number(quantity);
    const selectedPrice =
      orderType === "MARKET" ? null : Number(price);

    if (!Number.isFinite(qty) || qty <= 0) {
      setError("সঠিক quantity দিন।");
      return;
    }

    if (
      orderType === "LIMIT" &&
      (!Number.isFinite(selectedPrice) ||
        Number(selectedPrice) <= 0)
    ) {
      setError("LIMIT order-এর জন্য valid price দিন।");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/share-market/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shareId,
            symbol,
            companyName,
            side,
            orderType,
            quantity: qty,
            price: selectedPrice,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Order submit করা যায়নি।",
        );
      }

      if (data?.match?.matched) {
        setMessage(
          `Trade executed: ${data.match.quantity} ${symbol} @ ${money(
            data.match.price,
            currency,
          )}`,
        );
      } else {
        setMessage(
          "Order Book-এ order successfully placed হয়েছে।",
        );
      }

      setQuantity("");
      setPrice("");

      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Order submit করা যায়নি।",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const buyOrders = orders
    .filter(
      (item) =>
        item.side === "BUY" &&
        ["OPEN", "PARTIAL"].includes(item.status) &&
        remaining(item) > 0,
    )
    .sort(
      (a, b) =>
        Number(b.price ?? 0) -
        Number(a.price ?? 0),
    );

  const sellOrders = orders
    .filter(
      (item) =>
        item.side === "SELL" &&
        ["OPEN", "PARTIAL"].includes(item.status) &&
        remaining(item) > 0,
    )
    .sort(
      (a, b) =>
        Number(a.price ?? 0) -
        Number(b.price ?? 0),
    );

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-600">
            ORDER BOOK
          </p>

          <h3 className="mt-1 text-xl font-black text-[#07152d]">
            {symbol}
          </h3>

          <p className="text-xs text-slate-500">
            {companyName}
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {/* BUY / SELL FORM */}

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <button
            type="button"
            onClick={() => setSide("BUY")}
            className={`rounded-xl px-4 py-3 text-sm font-black ${
              side === "BUY"
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-600"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowUp className="h-4 w-4" />
              BUY
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSide("SELL")}
            className={`rounded-xl px-4 py-3 text-sm font-black ${
              side === "SELL"
                ? "bg-red-600 text-white"
                : "bg-white text-slate-600"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowDown className="h-4 w-4" />
              SELL
            </span>
          </button>

          <select
            value={orderType}
            onChange={(e) =>
              setOrderType(
                e.target.value as "LIMIT" | "MARKET",
              )
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold outline-none"
          >
            <option value="LIMIT">LIMIT</option>
            <option value="MARKET">MARKET</option>
          </select>

          <input
            type="number"
            min="0"
            step="0.0001"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
          />

          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            disabled={orderType === "MARKET"}
            onChange={(e) => setPrice(e.target.value)}
            placeholder={
              orderType === "MARKET"
                ? "Market price"
                : "Price"
            }
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none disabled:bg-slate-100"
          />
        </div>

        <button
          type="button"
          onClick={submitOrder}
          disabled={submitting}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-white disabled:opacity-50 ${
            side === "BUY"
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />

          {submitting
            ? "Processing..."
            : `${side} ${symbol}`}
        </button>

        {message && (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* ORDER BOOK */}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {/* SELL */}

        <div className="rounded-2xl border border-red-100 overflow-hidden">
          <div className="flex items-center justify-between bg-red-50 px-4 py-3">
            <span className="text-sm font-black text-red-700">
              SELL ORDERS
            </span>

            <span className="text-[10px] font-bold text-red-500">
              {sellOrders.length} open
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <p className="p-5 text-center text-xs text-slate-400">
                Loading...
              </p>
            ) : sellOrders.length === 0 ? (
              <p className="p-5 text-center text-xs text-slate-400">
                No open sell orders
              </p>
            ) : (
              sellOrders.slice(0, 20).map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-3 px-4 py-3 text-xs"
                >
                  <span className="font-black text-red-600">
                    {money(order.price, currency)}
                  </span>

                  <span className="text-right font-bold text-slate-700">
                    {remaining(order).toLocaleString()}
                  </span>

                  <span className="text-right text-slate-400">
                    {order.order_type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BUY */}

        <div className="rounded-2xl border border-emerald-100 overflow-hidden">
          <div className="flex items-center justify-between bg-emerald-50 px-4 py-3">
            <span className="text-sm font-black text-emerald-700">
              BUY ORDERS
            </span>

            <span className="text-[10px] font-bold text-emerald-500">
              {buyOrders.length} open
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <p className="p-5 text-center text-xs text-slate-400">
                Loading...
              </p>
            ) : buyOrders.length === 0 ? (
              <p className="p-5 text-center text-xs text-slate-400">
                No open buy orders
              </p>
            ) : (
              buyOrders.slice(0, 20).map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-3 px-4 py-3 text-xs"
                >
                  <span className="font-black text-emerald-600">
                    {money(order.price, currency)}
                  </span>

                  <span className="text-right font-bold text-slate-700">
                    {remaining(order).toLocaleString()}
                  </span>

                  <span className="text-right text-slate-400">
                    {order.order_type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 text-[10px] leading-5 text-slate-400">
        Sandbox trading only. No real-money securities transaction is
        executed by this interface.
      </p>
    </section>
  );
}