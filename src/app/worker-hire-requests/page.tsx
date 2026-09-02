"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  UserRound,
  XCircle,
} from "lucide-react";
import { createClient } from "@/lib/client";

type HireRequest = {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: string;
  message: string;
  appliedAt: string;
  updatedAt?: string;

  job: {
    id: string;
    title: string;
    location: string;
    salary: string;
    workersNeeded: number;
    description: string;
    status: string;
  } | null;

  employer: {
    id: string;
    employerType: string;
    companyName: string;
    description: string;
    profileId: string;
    name: string;
    phone: string;
    location: string;
    avatarUrl: string | null;
  } | null;
};

type WorkerInfo = {
  id: string;
  profileId: string;
  category: string;
  subCategory: string;
};

export default function WorkerHireRequestsPage() {
  const supabase = createClient();

  const [requests, setRequests] = useState<HireRequest[]>([]);
  const [worker, setWorker] = useState<WorkerInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Login required. আবার Login করুন।");
        return;
      }

      const response = await fetch(
        "/api/worker-hire-requests",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Hire Requests লোড করা যায়নি।"
        );
      }

      setWorker(data.worker || null);
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Hire Requests লোড করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateRequest(
    applicationId: string,
    status: "accepted" | "rejected"
  ) {
    try {
      setActionLoading(applicationId);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Login required.");
        return;
      }

      const response = await fetch(
        "/api/worker-hire-requests",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Hire Request update করা যায়নি।"
        );
      }

      await loadRequests();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Request update করা যায়নি।"
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/worker-dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Hire Requests
            </h1>

            <p className="text-sm text-slate-500">
              আপনার কাছে আসা কাজের অনুরোধগুলো দেখুন
            </p>
          </div>
        </div>

        {/* Worker info */}
        {worker && (
          <div className="mb-6 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <UserRound className="h-6 w-6 text-slate-600" />
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Worker Account
                </p>

                <p className="text-xs text-slate-500">
                  Worker ID: {worker.id}
                </p>

                {worker.category && (
                  <p className="text-sm text-slate-600">
                    {worker.category}
                    {worker.subCategory
                      ? ` • ${worker.subCategory}`
                      : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />

            <p className="text-sm text-slate-500">
              Hire Requests লোড হচ্ছে...
            </p>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
            <BriefcaseBusiness className="mx-auto mb-4 h-12 w-12 text-slate-300" />

            <h2 className="text-lg font-semibold text-slate-800">
              কোনো Pending Hire Request নেই
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              নতুন কোনো Employer আপনাকে Hire Request
              পাঠালে এখানে দেখা যাবে।
            </p>

            <button
              onClick={loadRequests}
              className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {requests.map((request) => (
              <div
                key={request.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
              >
                {/* Top */}
                <div className="border-b bg-slate-50 px-5 py-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-5 w-5 text-amber-600" />

                        <h2 className="text-lg font-bold text-slate-900">
                          {request.job?.title ||
                            "Hire Request"}
                        </h2>
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        Request ID: {request.id}
                      </p>
                    </div>

                    <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Job */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        কাজের তথ্য
                      </p>

                      <p className="font-semibold text-slate-900">
                        {request.job?.title ||
                          "কাজের নাম নেই"}
                      </p>

                      {request.job?.location && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4" />
                          {request.job.location}
                        </div>
                      )}

                      {request.job?.salary && (
                        <p className="mt-2 text-sm font-medium text-slate-700">
                          বেতন: {request.job.salary}
                        </p>
                      )}

                      {request.job?.description && (
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {request.job.description}
                        </p>
                      )}
                    </div>

                    {/* Employer */}
                    <div className="rounded-xl border p-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Employer
                      </p>

                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                          {request.employer?.avatarUrl ? (
                            <img
                              src={
                                request.employer.avatarUrl
                              }
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserRound className="h-5 w-5 text-slate-500" />
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {request.employer
                              ?.companyName ||
                              request.employer?.name ||
                              "Employer"}
                          </p>

                          {request.employer
                            ?.employerType && (
                            <p className="text-xs text-slate-500">
                              {
                                request.employer
                                  .employerType
                              }
                            </p>
                          )}
                        </div>
                      </div>

                      {request.employer?.phone && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="h-4 w-4" />
                          {request.employer.phone}
                        </div>
                      )}

                      {request.employer?.location && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="h-4 w-4" />
                          {request.employer.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  {request.message && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="mb-1 text-xs font-semibold text-slate-400">
                        Employer Message
                      </p>

                      <p className="text-sm leading-6 text-slate-700">
                        {request.message}
                      </p>
                    </div>
                  )}

                  {/* Date */}
                  {request.appliedAt && (
                    <p className="mt-4 text-xs text-slate-400">
                      Request sent:{" "}
                      {new Date(
                        request.appliedAt
                      ).toLocaleString("en-BD")}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() =>
                        updateRequest(
                          request.id,
                          "accepted"
                        )
                      }
                      disabled={
                        actionLoading === request.id
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-5 w-5" />

                      {actionLoading === request.id
                        ? "Processing..."
                        : "Accept Hire Request"}
                    </button>

                    <button
                      onClick={() =>
                        updateRequest(
                          request.id,
                          "rejected"
                        )
                      }
                      disabled={
                        actionLoading === request.id
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle className="h-5 w-5" />

                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}