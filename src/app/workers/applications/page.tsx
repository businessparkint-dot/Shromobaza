"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  Loader2,
  AlertCircle,
  RefreshCw,
  BriefcaseBusiness,
} from "lucide-react";

import { supabase } from "@/lib/client";

type Application = {
  id: string;
  jobId: string;
  employerId: string;
  status: "pending" | "accepted" | "rejected" | string;
  message: string | null;
  appliedAt: string;
  updatedAt: string;

  job: {
    id: string;
    title: string;
    location: string | null;
    salary: string | null;
    workers_needed: number | null;
    description: string | null;
    status: string | null;
  } | null;

  employer: {
    id: string;
    employer_type: string | null;
    company_name: string | null;
    description: string | null;
    profile_id: string | null;
  } | null;
};

type DashboardResponse = {
  worker: {
    id: string;
    profileId: string;
    name: string;
    phone: string;
    location: string;
    district: string;
    category: string;
    subCategory: string;
  };

  applications: Application[];

  stats: {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
  };
};

function formatDate(date: string) {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "accepted":
      return "Accepted";

    case "rejected":
      return "Rejected";

    case "pending":
    default:
      return "Pending";
  }
}

function statusClasses(status: string) {
  switch (status) {
    case "accepted":
      return "bg-green-50 text-green-600";

    case "rejected":
      return "bg-red-50 text-red-600";

    case "pending":
    default:
      return "bg-yellow-50 text-yellow-600";
  }
}

export default function WorkerApplicationsPage() {
  const [data, setData] =
    useState<DashboardResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError(
          "My Applications দেখতে আগে Login করুন।"
        );
        return;
      }

      const response = await fetch(
        "/api/worker-dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let result: any;

      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          text
            ? `Server response: ${text.slice(0, 200)}`
            : "Server থেকে সঠিক response পাওয়া যায়নি।"
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "My Applications লোড করা যায়নি।"
        );
      }

      setData(result);
    } catch (err) {
      console.error(
        "Load worker applications error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "My Applications লোড করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />

          <p className="mt-4 font-medium text-slate-500">
            My Applications লোড হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  /*
   * Error
   */
  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            My Applications লোড করা যায়নি
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <button
              type="button"
              onClick={loadApplications}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <RefreshCw className="h-4 w-4" />
              আবার চেষ্টা করুন
            </button>

            <Link
              href="/worker-dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700"
            >
              Dashboard
            </Link>

          </div>
        </div>
      </main>
    );
  }

  const applications = data.applications || [];
  const worker = data.worker;
  const stats = data.stats;

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="mx-auto max-w-5xl px-4">

        {/* BACK */}
        <Link
          href="/worker-dashboard"
          className="mb-6 inline-flex items-center text-sm font-medium text-slate-700 transition hover:text-orange-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Worker Dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm font-bold text-orange-500">
              শ্রমবাজার
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              My Applications
            </h1>

            <p className="mt-2 text-gray-500">
              আপনি যেসব কাজে আবেদন করেছেন সেগুলোর
              বর্তমান অবস্থা এখানে দেখতে পারবেন।
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={loadApplications}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>

            <Link
              href="/worker-my-jobs"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 px-5 font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              <BriefcaseBusiness className="mr-2 h-4 w-4" />
              আমার কাজ
            </Link>

          </div>
        </div>

        {/* WORKER INFO */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm text-slate-400">
            Worker
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {worker.name}
          </h2>

          <p className="mt-1 font-semibold text-orange-500">
            {worker.subCategory ||
              worker.category ||
              "Worker"}
          </p>

          {worker.location && (
            <p className="mt-2 text-sm text-slate-500">
              {worker.location}
            </p>
          )}

        </div>

        {/* STATS */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              মোট Application
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Accepted
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {stats.accepted}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {stats.pending}
            </p>
          </div>

        </div>

        {/* APPLICATIONS */}
        {applications.length === 0 ? (

          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <Clock className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              এখনো কোনো Application নেই
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-gray-500">
              কোনো Job-এ Apply করলে অথবা কোনো Hire
              Request তৈরি হলে এখানে Application status
              দেখা যাবে।
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-orange-500 px-6 font-semibold text-white transition hover:bg-orange-600"
            >
              Job খুঁজুন
            </Link>

          </div>

        ) : (

          <div className="space-y-5">

            {applications.map((application) => {

              const job = application.job;

              const employer =
                application.employer;

              const employerName =
                employer?.company_name ||
                "নিয়োগকর্তা";

              const jobTitle =
                job?.title ||
                "কাজের তথ্য পাওয়া যায়নি";

              return (
                <div
                  key={application.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md"
                >

                  {/* TOP */}
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                        <Building2 className="h-6 w-6" />
                      </div>

                      <div>

                        <h2 className="text-xl font-bold text-slate-900">
                          {jobTitle}
                        </h2>

                        <p className="mt-2 flex items-center font-semibold text-orange-500">
                          <Building2 className="mr-2 h-4 w-4" />
                          {employerName}
                        </p>

                      </div>
                    </div>

                    {/* STATUS */}
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-semibold ${statusClasses(
                        application.status
                      )}`}
                    >

                      {application.status ===
                        "accepted" ? (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      ) : application.status ===
                        "rejected" ? (
                        <XCircle className="mr-2 h-4 w-4" />
                      ) : (
                        <Clock className="mr-2 h-4 w-4" />
                      )}

                      {statusLabel(
                        application.status
                      )}

                    </span>

                  </div>

                  {/* JOB INFO */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    {job?.location && (
                      <div className="rounded-2xl bg-slate-50 p-4">

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <MapPin className="h-4 w-4" />
                          লোকেশন
                        </div>

                        <p className="mt-2 text-sm font-bold text-slate-700">
                          {job.location}
                        </p>

                      </div>
                    )}

                    {job?.salary && (
                      <div className="rounded-2xl bg-slate-50 p-4">

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                          <Wallet className="h-4 w-4" />
                          বেতন
                        </div>

                        <p className="mt-2 text-sm font-bold text-slate-700">
                          {job.salary}
                        </p>

                      </div>
                    )}

                  </div>

                  {/* MESSAGE */}
                  {application.message && (
                    <div className="mt-5 rounded-2xl bg-slate-50 p-5">

                      <p className="text-sm font-bold text-slate-700">
                        Message
                      </p>

                      <p className="mt-2 leading-7 text-gray-600">
                        {application.message}
                      </p>

                    </div>
                  )}

                  {/* STATUS MESSAGE */}
                  <div className="mt-6 border-t border-slate-100 pt-5">

                    {application.status ===
                      "pending" && (
                      <p className="text-sm font-medium text-yellow-600">
                        আপনার Applicationটি Employer-এর
                        অনুমোদনের অপেক্ষায় আছে।
                      </p>
                    )}

                    {application.status ===
                      "accepted" && (
                      <p className="text-sm font-medium text-green-600">
                        অভিনন্দন! Employer আপনার
                        Application গ্রহণ করেছে।
                      </p>
                    )}

                    {application.status ===
                      "rejected" && (
                      <p className="text-sm font-medium text-red-600">
                        এই Applicationটি Employer
                        গ্রহণ করেনি।
                      </p>
                    )}

                  </div>

                  {/* DATE + JOB LINK */}
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-slate-400">
                      Application:
                      {" "}
                      {formatDate(
                        application.appliedAt
                      )}
                    </p>

                    {job?.id && (
                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                      >
                        Job দেখুন
                      </Link>
                    )}

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