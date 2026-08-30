"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  History,
  Loader2,
  Wallet,
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
  const [error, setError] = useState("");

  useEffect(() => {
    loadWallet();
  }, []);

  async function loadWallet() {
    setLoading(true);
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

  function isCredit(type: string) {
    return (
      type === "credit" ||
      type === "deposit" ||
      type === "refund" ||
      type === "bonus"
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />

          <p className="mt-3 text-sm font-bold text-slate-500">
            Wallet loading...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-black text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
              <Wallet className="h-5 w-5" />
            </div>

            <div className="leading-none">
              <p className="text-sm font-black text-[#07152d]">
                My Wallet
              </p>

              <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Shromobazar
              </p>
            </div>
          </div>

          <div className="w-16 sm:w-20" />
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
        {/* =====================================================
            TITLE
        ====================================================== */}
        <div className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
            Financial Center
          </p>

          <h1 className="mt-2 text-2xl font-black tracking-tight text-[#07152d] sm:text-3xl">
            My Wallet
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            আপনার Shromobazar wallet balance এবং transaction history
            এখানে দেখতে পারবেন।
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
            {error}
          </div>
        )}

        {/* =====================================================
            BALANCE CARD
        ====================================================== */}
        <div className="overflow-hidden rounded-[2rem] bg-[#07152d] p-6 text-white shadow-xl sm:p-8">
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

          {/* =====================================================
              ACTION BUTTONS
          ====================================================== */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-black text-white opacity-70"
            >
              <ArrowDownLeft className="h-4 w-4" />
              Add Money
            </button>

            <button
              type="button"
              disabled
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 text-xs font-black text-white opacity-70"
            >
              <ArrowUpRight className="h-4 w-4" />
              Withdraw
            </button>
          </div>
        </div>

        {/* =====================================================
            FEATURES
        ====================================================== */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <WalletFeature
            icon={<Wallet className="h-5 w-5" />}
            title="Wallet Balance"
            text="আপনার বর্তমান wallet balance"
          />

          <WalletFeature
            icon={<History className="h-5 w-5" />}
            title="Transactions"
            text="আপনার সকল wallet activity"
          />

          <WalletFeature
            icon={<ArrowUpRight className="h-5 w-5" />}
            title="Payments"
            text="Future subscription payments"
          />
        </div>

        {/* =====================================================
            TRANSACTIONS
        ====================================================== */}
        <div className="mt-7 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-black text-[#07152d]">
                Transaction History
              </h2>

              <p className="mt-1 text-[10px] text-slate-400">
                Recent wallet transactions
              </p>
            </div>

            <History className="h-5 w-5 text-slate-300" />
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
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {transactions.map((transaction) => {
                const credit = isCredit(transaction.type);

                return (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-3 px-5 py-4 sm:px-6"
                  >
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
                        {formatDate(transaction.created_at)}
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

                      <p className="mt-1 text-[9px] font-bold uppercase text-slate-400">
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* =====================================================
            COMMISSION-FREE POLICY
        ====================================================== */}
        <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50 p-5">
          <h3 className="text-sm font-black text-[#07152d]">
            Commission-Free Platform
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-600">
            Shromobazar marketplace ও workforce transactions-এর উপর
            commission নেওয়ার business model ব্যবহার করবে না।
            ভবিষ্যৎ platform revenue subscription এবং premium
            services-এর মাধ্যমে পরিচালিত হবে।
          </p>
        </div>
      </section>
    </main>
  );
}

function WalletFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-black text-[#07152d]">
        {title}
      </h3>

      <p className="mt-1 text-[11px] leading-5 text-slate-400">
        {text}
      </p>
    </div>
  );
}