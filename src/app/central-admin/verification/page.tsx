"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShieldCheck,
  Clock3,
  CircleCheck,
  CircleX,
  UserRound,
  Building2,
  BriefcaseBusiness,
  RefreshCw,
  Globe2,
  Check,
  X,
} from "lucide-react";

type VerificationStatus =
  | "all"
  | "pending"
  | "verified"
  | "rejected";

type VerificationType =
  | "all"
  | "worker"
  | "employer"
  | "business"
  | "global_opportunity";

type VerificationItem = {
  id: string;
  name: string;
  type: Exclude<VerificationType, "all">;
  status: Exclude<VerificationStatus, "all">;
  submittedAt: string;
  note: string;

  ownerId?: string;
  businessType?: string;
  opportunityType?: string;
  verificationLevel?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  country?: string;
  sector?: string;
  offering?: string;
  requirement?: string;
  fundingRequired?: number | null;
  fundingCurrency?: string;
  website?: string;
  isPublic?: boolean;
  isVerified?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type VerificationApiResponse = {
  success: boolean;
  verificationItems?: Array<{
    id?: string;
    ownerId?: string;
    name?: string;
    description?: string;
    type?: string;
    status?: string;
    businessType?: string;
    opportunityType?: string;
    verificationLevel?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    district?: string;
    country?: string;
    sector?: string;
    offering?: string;
    requirement?: string;
    fundingRequired?: number | null;
    fundingCurrency?: string;
    website?: string;
    isPublic?: boolean;
    isVerified?: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
  }>;
  summary?: {
    total?: number;
    pending?: number;
    verified?: number;
    rejected?: number;
  };
  error?: string;
};

function statusLabel(status: VerificationItem["status"]) {
  if (status === "verified") return "Verified";
  if (status === "rejected") return "Rejected";
  return "Pending";
}

function typeLabel(type: VerificationItem["type"]) {
  if (type === "worker") return "Worker";
  if (type === "employer") return "Employer";
  if (type === "global_opportunity") {
    return "Global Opportunity";
  }

  return "Business / Office";
}

function typeIcon(type: VerificationItem["type"]) {
  if (type === "worker") {
    return <UserRound size={17} />;
  }

  if (type === "employer") {
    return <BriefcaseBusiness size={17} />;
  }

  if (type === "global_opportunity") {
    return <Globe2 size={17} />;
  }

  return <Building2 size={17} />;
}

function opportunityTypeLabel(value?: string) {
  if (value === "bangladesh_to_world") {
    return "Bangladesh → World";
  }

  if (value === "world_to_bangladesh") {
    return "World → Bangladesh";
  }

  if (value === "partnership_jv") {
    return "Partnership / JV";
  }

  if (value === "investment") {
    return "Investment";
  }

  return value || "Global Opportunity";
}

export default function VerificationPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<VerificationStatus>("all");
  const [typeFilter, setTypeFilter] =
    useState<VerificationType>("all");

  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actionLoadingId, setActionLoadingId] =
    useState<string | null>(null);

  const [actionError, setActionError] =
    useState("");

  async function loadVerificationData() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verification", {
        method: "GET",
        cache: "no-store",
      });

      const data =
        (await response.json()) as VerificationApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Verification data load করা যায়নি।"
        );
      }

      const rawItems = Array.isArray(
        data.verificationItems
      )
        ? data.verificationItems
        : [];

      const mappedItems: VerificationItem[] =
        rawItems.map((item) => {
          const status: VerificationItem["status"] =
            item.status === "verified"
              ? "verified"
              : item.status === "rejected"
                ? "rejected"
                : "pending";

          const apiType =
            item.type === "worker"
              ? "worker"
              : item.type === "employer"
                ? "employer"
                : item.type ===
                    "global_opportunity"
                  ? "global_opportunity"
                  : "business";

          const isGlobal =
            apiType === "global_opportunity";

          return {
            id: String(item.id ?? ""),
            name:
              item.name ||
              (isGlobal
                ? "Unnamed Global Opportunity"
                : "Unnamed Business"),
            type: apiType,
            status,
            submittedAt:
              item.createdAt ||
              new Date().toISOString(),
            note: isGlobal
              ? item.description ||
                "Global Opportunity verification request"
              : item.verificationLevel
                ? `Verification level: ${item.verificationLevel}`
                : "Business verification request",

            ownerId: item.ownerId,

            businessType:
              item.businessType || "",

            opportunityType:
              item.opportunityType || "",

            verificationLevel:
              item.verificationLevel || "basic",

            phone: item.phone || "",
            email: item.email || "",
            address: item.address || "",
            city: item.city || "",
            district: item.district || "",
            country: item.country || "",
            sector: item.sector || "",
            offering: item.offering || "",
            requirement: item.requirement || "",

            fundingRequired:
              item.fundingRequired ?? null,

            fundingCurrency:
              item.fundingCurrency || "BDT",

            website:
              item.website || "",

            isPublic:
              item.isPublic ?? false,

            isVerified:
              item.isVerified ?? false,

            createdAt:
              item.createdAt ?? null,

            updatedAt:
              item.updatedAt ?? null,
          };
        });

      setItems(mappedItems);
    } catch (err) {
      console.error(
        "VERIFICATION PAGE ERROR:",
        err
      );

      setItems([]);

      setError(
        err instanceof Error
          ? err.message
          : "Verification data load করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadVerificationData();
  }, []);

  async function handleGlobalAction(
    id: string,
    action: "verify" | "reject"
  ) {
    if (actionLoadingId) return;

    setActionLoadingId(id);
    setActionError("");

    try {
      const response = await fetch(
        "/api/central-admin/global-opportunities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Global Opportunity action সম্পন্ন করা যায়নি।"
        );
      }

      await loadVerificationData();
    } catch (err) {
      console.error(
        "GLOBAL OPPORTUNITY ACTION ERROR:",
        err
      );

      setActionError(
        err instanceof Error
          ? err.message
          : "Global Opportunity action সম্পন্ন করা যায়নি।"
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.name
          .toLowerCase()
          .includes(query) ||
        item.id
          .toLowerCase()
          .includes(query) ||
        item.note
          .toLowerCase()
          .includes(query) ||
        (item.phone || "")
          .toLowerCase()
          .includes(query) ||
        (item.email || "")
          .toLowerCase()
          .includes(query) ||
        (item.city || "")
          .toLowerCase()
          .includes(query) ||
        (item.district || "")
          .toLowerCase()
          .includes(query) ||
        (item.country || "")
          .toLowerCase()
          .includes(query) ||
        (item.sector || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        item.status === statusFilter;

      const matchesType =
        typeFilter === "all" ||
        item.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    items,
    search,
    statusFilter,
    typeFilter,
  ]);

  const total = items.length;

  const pending = items.filter(
    (item) =>
      item.status === "pending"
  ).length;

  const verified = items.filter(
    (item) =>
      item.status === "verified"
  ).length;

  const rejected = items.filter(
    (item) =>
      item.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={21} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Verification & Trust
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Identity and trust verification management
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              void loadVerificationData();
            }}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {/* Summary */}
        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Total
              </p>

              <ShieldCheck
                size={19}
                className="text-slate-400"
              />
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {loading ? "—" : total}
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-amber-600">
                Pending
              </p>

              <Clock3
                size={19}
                className="text-amber-500"
              />
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {loading ? "—" : pending}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-emerald-600">
                Verified
              </p>

              <CircleCheck
                size={19}
                className="text-emerald-500"
              />
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {loading ? "—" : verified}
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-red-600">
                Rejected
              </p>

              <CircleX
                size={19}
                className="text-red-500"
              />
            </div>

            <p className="mt-2 text-2xl font-bold text-slate-900">
              {loading ? "—" : rejected}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search name, ID, country, sector..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target
                    .value as VerificationStatus
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400"
            >
              <option value="all">
                All Status
              </option>
              <option value="pending">
                Pending
              </option>
              <option value="verified">
                Verified
              </option>
              <option value="rejected">
                Rejected
              </option>
            </select>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(
                  event.target
                    .value as VerificationType
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-emerald-400"
            >
              <option value="all">
                All Types
              </option>
              <option value="worker">
                Worker
              </option>
              <option value="employer">
                Employer
              </option>
              <option value="business">
                Business / Office
              </option>
              <option value="global_opportunity">
                Global Opportunity
              </option>
            </select>
          </div>
        </section>

        {/* Results */}
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Verification Requests
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {loading
                  ? "Loading verification records..."
                  : `Showing ${filteredItems.length} of ${total}`}
              </p>
            </div>
          </div>

          {actionError && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {actionError}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <RefreshCw
                  size={27}
                  className="animate-spin"
                />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                Loading verification data...
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Central Admin থেকে verification
                records load হচ্ছে।
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <CircleX size={27} />
              </div>

              <h3 className="mt-4 text-base font-bold text-red-700">
                Verification data load হয়নি
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  void loadVerificationData();
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={27} />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900">
                No verification requests found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                বর্তমান filter অনুযায়ী কোনো
                verification record পাওয়া যায়নি।
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredItems.map((item) => {
                const isGlobal =
                  item.type ===
                  "global_opportunity";

                const isActionLoading =
                  actionLoadingId === item.id;

                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    className={`rounded-2xl border bg-white p-4 shadow-sm ${
                      isGlobal
                        ? "border-sky-200"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isGlobal
                              ? "bg-sky-50 text-sky-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {typeIcon(item.type)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900">
                              {item.name}
                            </h3>

                            {isGlobal && (
                              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700">
                                Global Opportunity
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>
                              {typeLabel(item.type)}
                            </span>

                            <span>·</span>

                            <span>
                              {item.id}
                            </span>
                          </div>

                          {isGlobal &&
                            item.opportunityType && (
                              <p className="mt-2 text-xs font-semibold text-sky-700">
                                {opportunityTypeLabel(
                                  item.opportunityType
                                )}
                              </p>
                            )}

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.note}
                          </p>

                          {(item.country ||
                            item.city ||
                            item.district) && (
                            <p className="mt-1 text-xs text-slate-400">
                              {[
                                item.city,
                                item.district,
                                item.country,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}

                          {isGlobal &&
                            item.sector && (
                              <p className="mt-1 text-xs text-slate-400">
                                Sector:{" "}
                                {item.sector}
                              </p>
                            )}

                          {isGlobal &&
                            item.fundingRequired !==
                              null &&
                            item.fundingRequired !==
                              undefined && (
                              <p className="mt-1 text-xs text-slate-400">
                                Funding:{" "}
                                {item.fundingRequired.toLocaleString()}{" "}
                                {item.fundingCurrency ||
                                  "BDT"}
                              </p>
                            )}

                          {!isGlobal &&
                            item.businessType && (
                              <p className="mt-1 text-xs text-slate-400">
                                Business type:{" "}
                                {item.businessType}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                            item.status ===
                            "verified"
                              ? "bg-emerald-50 text-emerald-700"
                              : item.status ===
                                  "rejected"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {statusLabel(
                            item.status
                          )}
                        </span>

                        {isGlobal &&
                          item.status ===
                            "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  void handleGlobalAction(
                                    item.id,
                                    "verify"
                                  );
                                }}
                                disabled={
                                  isActionLoading
                                }
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isActionLoading ? (
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Check
                                    size={14}
                                  />
                                )}

                                Verify
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  void handleGlobalAction(
                                    item.id,
                                    "reject"
                                  );
                                }}
                                disabled={
                                  isActionLoading
                                }
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isActionLoading ? (
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <X size={14} />
                                )}

                                Reject
                              </button>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
