"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  History,
  Loader2,
  MessageCircle,
  RefreshCw,
  ShoppingBag,
  Wallet,
  XCircle,
  Activity,
  CreditCard,
  ReceiptText,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/client";

type WalletData = {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
};

type Transaction = {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  reference_id: string | null;
  status: string;
  created_at: string;
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet(isRefresh = false) {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error("Wallet দেখতে আগে Login করুন।");
      }

      // --------------------------------------------------
      // FIND EXISTING WALLET
      // --------------------------------------------------
      let { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .select("id,user_id,balance,currency")
        .eq("user_id", user.id)
        .maybeSingle();

      if (walletError) {
        throw new Error(walletError.message);
      }

      // --------------------------------------------------
      // CREATE WALLET IF NOT EXISTS
      // --------------------------------------------------
      if (!walletData) {
        const { data: newWallet, error: createError } = await supabase
          .from("wallets")
          .insert({
            user_id: user.id,
            balance: 0,
            currency: "BDT",
          })
          .select("id,user_id,balance,currency")
          .single();

        if (createError) {
          throw new Error(createError.message);
        }

        walletData = newWallet;
      }

      setWallet(walletData);

      // --------------------------------------------------
      // LOAD TRANSACTIONS
      // --------------------------------------------------
      const { data: transactionData, error: transactionError } =
        await supabase
          .from("wallet_transactions")
          .select(
            "id,type,amount,description,reference_id,status,created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50);

      if (transactionError) {
        throw new Error(transactionError.message);
      }

      setTransactions(transactionData ?? []);
    } catch (err) {
      console.error("Wallet error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Wallet load করা যায়নি।"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function formatAmount(amount: number) {
    return `৳${Number(amount).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function isCredit(type: string) {
    return (
      type === "credit" ||
      type === "deposit" ||
      type === "refund" ||
      type === "bonus"
    );
  }

  function getStatusIcon(status: string) {
    const normalized = status.toLowerCase();

    if (
      normalized === "completed" ||
      normalized === "success" ||
      normalized === "successful"
    ) {
      return <CheckCircle2 className="h-3 w-3" />;
    }

    if (
      normalized === "failed" ||
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return <XCircle className="h-3 w-3" />;
    }

    return <Activity className="h-3 w-3" />;
  }

  function getStatusClass(status: string) {
    const normalized = status.toLowerCase();

    if (
      normalized === "completed" ||
      normalized === "success" ||
      normalized === "successful"
    ) {
      return "bg-green-50 text-green-600";
    }

    if (
      normalized === "failed" ||
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return "bg-red-50 text-red-600";
    }

    return "bg-amber-50 text-amber-600";
  }

  const summary = useMemo(() => {
    let credits = 0;
    let debits = 0;

    for (const transaction of transactions) {
      const amount = Math.abs(Number(transaction.amount) || 0);

      if (isCredit(transaction.type)) {
        credits += amount;
      } else {
        debits += amount;
      }
    }

    return {
      credits,
      debits,
      count: transactions.length,
    };
  }, [transactions]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
            <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
          </div>

          <p className="mt-4 text-sm font-black text-slate-600">
            Wallet loading...
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            আপনার financial information প্রস্তুত করা হচ্ছে
          </p>
        </div>
      </main>
    );
  }

  if (error && !wallet) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-5xl items-center px-4 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-black text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>
        </header>

        <section className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4 py-10">
          <div className="w-full rounded-[2rem] border border-red-100 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Wallet className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-xl font-black text-[#07152d]">
              Wallet unavailable
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#07152d] px-6 text-xs font-black text-white transition hover:bg-orange-500"
            >
              Login
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-black text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>

            <div className="leading-none">
              <p className="text-sm font-black text-[#07152d]">
                My Wallet
              </p>

              <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Shromobazar Financial Center
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => loadWallet(true)}
            disabled={refreshing}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-500 disabled:opacity-60"
            aria-label="Refresh wallet"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        {/* =====================================================
            TITLE
        ====================================================== */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
              Financial Center
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#07152d] sm:text-3xl">
              My Wallet
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              আপনার Shromobazar wallet balance, payment activity এবং
              transaction history এক জায়গায়।
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />

            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Wallet Active
            </span>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => loadWallet(true)}
              className="shrink-0 rounded-lg bg-white px-3 py-2 text-[10px] font-black text-red-600 shadow-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* =====================================================
            BALANCE + QUICK STATS
        ====================================================== */}
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          {/* BALANCE */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[#07152d] p-6 text-white shadow-xl sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-300">
                    Available Balance
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tight sm:text-5xl">
                      {formatAmount(wallet?.balance ?? 0)}
                    </span>
                  </div>

                  <p className="mt-2 text-[11px] text-slate-400">
                    Currency: {wallet?.currency || "BDT"}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Wallet className="h-6 w-6 text-orange-400" />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled
                  className="flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-black text-white opacity-70"
                  title="Payment integration will be connected later"
                >
                  <ArrowDownLeft className="h-4 w-4" />
                  Add Money
                </button>

                <button
                  type="button"
                  disabled
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 text-xs font-black text-white opacity-70"
                  title="Withdrawal integration will be connected later"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Withdraw
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
                <CreditCard className="h-3.5 w-3.5" />
                Payment gateway connection will be added safely later.
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-4">
            <WalletStat
              icon={<ArrowDownLeft className="h-5 w-5" />}
              label="Total Credit"
              value={formatAmount(summary.credits)}
              tone="green"
            />

            <WalletStat
              icon={<ArrowUpRight className="h-5 w-5" />}
              label="Total Debit"
              value={formatAmount(summary.debits)}
              tone="red"
            />

            <WalletStat
              icon={<History className="h-5 w-5" />}
              label="Transactions"
              value={String(summary.count)}
              tone="orange"
            />

            <WalletStat
              icon={<Activity className="h-5 w-5" />}
              label="Currency"
              value={wallet?.currency || "BDT"}
              tone="blue"
            />
          </div>
        </div>

        {/* =====================================================
            ECOSYSTEM LINKS
        ====================================================== */}
        <div className="mt-6">
          <div className="mb-3">
            <p className="text-xs font-black text-[#07152d]">
              Shromobazar Financial Connections
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Marketplace, jobs এবং communication-এর সাথে Wallet
              ধীরে ধীরে connected financial layer হিসেবে কাজ করবে।
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <WalletLink
              href="/marketplace"
              icon={<ShoppingBag className="h-5 w-5" />}
              title="Marketplace"
              text="Buy & sell activity"
            />

            <WalletLink
              href="/jobs"
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              title="Jobs & Hire"
              text="Work & hiring activity"
            />

            <WalletLink
              href="/chat"
              icon={<MessageCircle className="h-5 w-5" />}
              title="Chat"
              text="Deal communication"
            />

            <WalletLink
              href="/status-feed"
              icon={<Users className="h-5 w-5" />}
              title="Social Hub"
              text="Community & updates"
            />
          </div>
        </div>

        {/* =====================================================
            TRANSACTIONS
        ====================================================== */}
        <div className="mt-7 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-black text-[#07152d]">
                Transaction History
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                সর্বশেষ ৫০টি wallet transaction
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <History className="h-4 w-4" />
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="p-8 text-center sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                <History className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-sm font-black text-slate-700">
                No transactions yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
                আপনার wallet-এ কোনো transaction এখনো হয়নি।
                Marketplace, job বা future payment activity এখানে
                দেখা যাবে।
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((transaction) => {
                const credit = isCredit(transaction.type);

                return (
                  <div
                    key={transaction.id}
                    className="px-5 py-4 transition hover:bg-slate-50/70 sm:px-6"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          credit
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {credit ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black text-slate-700">
                          {transaction.description ||
                            transaction.type}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {formatDateTime(transaction.created_at)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-xs font-black ${
                            credit
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {credit ? "+" : "-"}
                          {formatAmount(
                            Math.abs(Number(transaction.amount))
                          )}
                        </p>

                        <div
                          className={`mt-1 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[8px] font-black uppercase ${getStatusClass(
                            transaction.status
                          )}`}
                        >
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </div>
                      </div>
                    </div>

                    {transaction.reference_id && (
                      <div className="ml-[52px] mt-2 flex items-center gap-1.5 text-[9px] text-slate-400">
                        <ReceiptText className="h-3 w-3" />
                        Reference:{" "}
                        <span className="font-bold text-slate-500">
                          {transaction.reference_id}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =====================================================
            FUTURE PAYMENT CENTER
        ====================================================== */}
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <CreditCard className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-black text-[#07152d]">
                  Payments
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  ভবিষ্যতে wallet-এর সাথে payment gateway,
                  subscription এবং premium services connect করা
                  যাবে।
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Planned
              </p>

              <p className="mt-1 text-xs font-bold text-slate-600">
                Subscription • Premium Visibility • Services
              </p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <ReceiptText className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-black text-[#07152d]">
                  Invoice & Deal Record
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Marketplace বা workforce deal complete হলে
                  transaction record এবং invoice layer-এর সাথে
                  Wallet যুক্ত করা যাবে।
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Architecture
              </p>

              <p className="mt-1 text-xs font-bold text-slate-600">
                Deal → Chat → Wallet → Invoice → Completion
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            COMMISSION-FREE POLICY
        ====================================================== */}
        <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-orange-100 bg-orange-50 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-sm font-black text-[#07152d]">
                Commission-Free Platform
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                Shromobazar marketplace ও workforce transactions-এর
                উপর commission নেওয়ার business model ব্যবহার করবে
                না। Platform revenue subscription, premium visibility
                এবং অন্যান্য value-added services-এর মাধ্যমে
                পরিচালিত হবে।
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <div className="py-8 text-center">
          <p className="text-[10px] font-bold text-slate-400">
            Shromobazar Wallet • Secure Financial Layer
          </p>
        </div>
      </section>
    </main>
  );
}

function WalletStat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "green" | "red" | "orange" | "blue";
}) {
  const toneClass = {
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-500",
    blue: "bg-blue-50 text-blue-600",
  }[tone];

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-[10px] font-bold text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-black text-[#07152d]">
        {value}
      </p>
    </div>
  );
}

function WalletLink({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 transition group-hover:bg-orange-50 group-hover:text-orange-500">
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-xs font-black text-[#07152d]">
            {title}
          </h3>

          <p className="mt-1 truncate text-[10px] text-slate-400">
            {text}
          </p>
        </div>
      </div>
    </Link>
  );
}
