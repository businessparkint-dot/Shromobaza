"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
} from "lucide-react";

type Account = {
  id: string | null;
  name: string;
  phone: string;
  email: string;
  location: string;
  country: string;
  region: string;
  city: string;
  district: string;
  user_type: string;
  account_type: string;
  nid: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export default function CentralAdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadAccounts(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch("/api/central-admin/accounts", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Accounts load করা যায়নি।");
      }

      setAccounts(data.accounts ?? []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Accounts load করতে সমস্যা হয়েছে।"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  const filteredAccounts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return accounts;
    }

    return accounts.filter((account) => {
      const searchableText = [
        account.name,
        account.phone,
        account.email,
        account.location,
        account.country,
        account.region,
        account.city,
        account.district,
        account.user_type,
        account.account_type,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [accounts, search]);

  function formatDate(value: string | null) {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  }

  function getLocation(account: Account) {
    return [
      account.city,
      account.region,
      account.country,
    ]
      .filter(Boolean)
      .join(", ");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/central-admin"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
              >
                <ArrowLeft size={19} />
              </Link>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Users size={22} />
              </div>

              <div>
                <h1 className="text-xl font-black text-slate-900">
                  Users & Accounts
                </h1>
                <p className="text-sm text-slate-500">
                  Shromobazar Master Account Management
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => loadAccounts(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Total Accounts
                </p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {accounts.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Showing
                </p>
                <p className="mt-2 text-3xl font-black text-slate-900">
                  {filteredAccounts.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <UserRound size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Account Type
                </p>
                <p className="mt-2 text-lg font-black text-slate-900">
                  Master Account
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <ShieldCheck size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="নাম, ফোন, email, location, country বা account type দিয়ে খুঁজুন..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-slate-400"
            />

            <p className="mt-3 text-sm font-semibold text-slate-500">
              Accounts loading...
            </p>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <Users
              size={34}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-lg font-black text-slate-800">
              কোনো Account পাওয়া যায়নি
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search পরিবর্তন করে আবার চেষ্টা করুন।
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAccounts.map((account, index) => {
              const location = getLocation(account);

              return (
                <div
                  key={account.id ?? `account-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <UserRound size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-base font-black text-slate-900">
                        {account.name}
                      </h2>

                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                          Master Account
                        </span>

                        {account.user_type && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                            {account.user_type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2.5 text-sm">
                    {account.phone && (
                      <div className="flex items-start gap-2 text-slate-600">
                        <Phone size={15} className="mt-0.5 shrink-0" />
                        <span className="break-all">
                          {account.phone}
                        </span>
                      </div>
                    )}

                    {account.email && (
                      <div className="flex items-start gap-2 text-slate-600">
                        <Mail size={15} className="mt-0.5 shrink-0" />
                        <span className="break-all">
                          {account.email}
                        </span>
                      </div>
                    )}

                    {location && (
                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin size={15} className="mt-0.5 shrink-0" />
                        <span>{location}</span>
                      </div>
                    )}

                    {account.location && !location && (
                      <div className="flex items-start gap-2 text-slate-600">
                        <MapPin size={15} className="mt-0.5 shrink-0" />
                        <span>{account.location}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-slate-500">
                      <CalendarDays
                        size={15}
                        className="mt-0.5 shrink-0"
                      />
                      <span>
                        Registered: {formatDate(account.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        Account ID
                      </span>

                      <span className="max-w-[180px] truncate text-xs font-mono text-slate-500">
                        {account.id ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}