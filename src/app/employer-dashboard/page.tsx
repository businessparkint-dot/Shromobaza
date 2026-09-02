"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
  RefreshCw,
  Star,
  UserRound,
  XCircle,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "worker_completed"
  | "completed";

type Profile = {
  id: string;
  name?: string;
  phone?: string;
  location?: string;
  user_type?: string;
  avatar_url?: string;
};

type Employer = {
  id: string;
  profileId: string;
  employerType?: string;
  companyName?: string;
  description?: string;
  profile?: Profile | null;
};

type Job = {
  id: string;
  employer_id: string;
  title: string;
  location?: string;
  salary?: string | number;
  workers_needed?: number;
  description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type Worker = {
  id: string;
  profile_id?: string;
  category?: string;
  sub_category?: string;
  experience?: string;
  skills?: string;
  district?: string;
  location?: string;
  rating?: number;
  review_count?: number;
  profiles?: Profile | null;
};

type Application = {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: ApplicationStatus;
  message?: string | null;
  appliedAt?: string;
  updatedAt?: string;
  job?: Job | null;
  worker?: Worker | null;
};

type DashboardResponse = {
  success: boolean;
  message?: string;
  employer?: Employer;
  jobs?: Job[];
  applications?: Application[];
  stats?: {
    jobs: number;
    applications: number;
    pending: number;
    accepted: number;
    rejected: number;
  };
};

function statusLabel(status: ApplicationStatus) {
  switch (status) {
    case "pending":
      return "অপেক্ষমাণ";
    case "accepted":
      return "গৃহীত";
    case "rejected":
      return "বাতিল";
    case "in_progress":
      return "কাজ চলছে";
    case "worker_completed":
      return "Worker কাজ সম্পন্ন করেছে";
    case "completed":
      return "কাজ সম্পন্ন";
    default:
      return status;
  }
}

function statusClass(status: ApplicationStatus) {
  switch (status) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "in_progress":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "worker_completed":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "completed":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function EmployerDashboardPage() {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = useCallback(async () => {
    if (!supabase) return null;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || null;
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      if (!token) {
        setError("আপনার login session পাওয়া যায়নি।");
        return;
      }

      const response = await fetch(
        "/api/employer-dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data =
        (await response.json()) as DashboardResponse;

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Employer Dashboard load করা যায়নি।"
        );
      }

      setEmployer(data.employer || null);
      setApplications(data.applications || []);
      setJobs(data.jobs || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Dashboard load করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const updateApplication = async (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      setActionLoading(applicationId);
      setError("");
      setSuccess("");

      const token = await getToken();

      if (!token) {
        setError("Login session পাওয়া যায়নি।");
        return;
      }

      const response = await fetch(
        `/api/employer-dashboard/applications/${applicationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Application update করা যায়নি।"
        );
      }

      setSuccess(
        status === "accepted"
          ? "Worker গ্রহণ করা হয়েছে।"
          : "Application বাতিল করা হয়েছে।"
      );

      await loadDashboard();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Application update করা যায়নি।"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const confirmCompletion = async (
    applicationId: string
  ) => {
    try {
      setActionLoading(applicationId);
      setError("");
      setSuccess("");

      const token = await getToken();

      if (!token) {
        setError("Login session পাওয়া যায়নি।");
        return;
      }

      const response = await fetch(
        "/api/worker-job-status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            applicationId,
            action: "employer_confirm",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Completion confirm করা যায়নি।"
        );
      }

      setSuccess(
        "কাজ সম্পন্ন হিসেবে নিশ্চিত হয়েছে। এখন Worker-কে Rating দিতে পারবেন।"
      );

      await loadDashboard();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Completion confirm করা যায়নি।"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const pending = useMemo(
    () =>
      applications.filter(
        (item) => item.status === "pending"
      ),
    [applications]
  );

  const active = useMemo(
    () =>
      applications.filter(
        (item) =>
          item.status === "accepted" ||
          item.status === "in_progress" ||
          item.status === "worker_completed"
      ),
    [applications]
  );

  const completed = useMemo(
    () =>
      applications.filter(
        (item) => item.status === "completed"
      ),
    [applications]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Employer Dashboard loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Employer Dashboard
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {employer?.profile?.name ||
                  employer?.companyName ||
                  "Employer"}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {employer?.profile?.location ||
                  "Location নেই"}
              </p>
            </div>

            <button
              onClick={loadDashboard}
              className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-white p-5">
            <BriefcaseBusiness className="mb-3 h-6 w-6 text-blue-600" />
            <p className="text-sm text-gray-500">
              মোট Jobs
            </p>
            <p className="mt-1 text-3xl font-bold">
              {jobs.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <Clock3 className="mb-3 h-6 w-6 text-amber-600" />
            <p className="text-sm text-gray-500">
              Pending Applications
            </p>
            <p className="mt-1 text-3xl font-bold">
              {pending.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <UserRound className="mb-3 h-6 w-6 text-emerald-600" />
            <p className="text-sm text-gray-500">
              Active Workers
            </p>
            <p className="mt-1 text-3xl font-bold">
              {active.length}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-5">
            <CheckCircle2 className="mb-3 h-6 w-6 text-purple-600" />
            <p className="text-sm text-gray-500">
              Completed Jobs
            </p>
            <p className="mt-1 text-3xl font-bold">
              {completed.length}
            </p>
          </div>
        </div>

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Worker Applications
            </h2>
            <p className="text-sm text-gray-500">
              Worker application গ্রহণ বা বাতিল করুন।
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
              কোনো application পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => {
                const workerName =
                  application.worker?.profiles?.name ||
                  "Worker";

                return (
                  <div
                    key={application.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">
                            {workerName}
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                              application.status
                            )}`}
                          >
                            {statusLabel(
                              application.status
                            )}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-gray-700">
                          {application.job?.title || "Job"}
                        </p>

                        <div className="mt-2 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                          <p className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {application.job?.location ||
                              "Location নেই"}
                          </p>

                          <p>
                            Salary:{" "}
                            <strong>
                              {application.job?.salary ||
                                "আলোচনা সাপেক্ষে"}
                            </strong>
                          </p>

                          <p>
                            Category:{" "}
                            {application.worker?.category ||
                              "নির্দিষ্ট নয়"}
                          </p>

                          <p>
                            Experience:{" "}
                            {application.worker?.experience ||
                              "উল্লেখ নেই"}
                          </p>
                        </div>

                        {application.message && (
                          <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-600">
                            {application.message}
                          </p>
                        )}
                      </div>

                      <div className="w-full md:w-auto">
                        {application.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              disabled={
                                actionLoading ===
                                application.id
                              }
                              onClick={() =>
                                updateApplication(
                                  application.id,
                                  "accepted"
                                )
                              }
                              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <CheckCircle2 className="mr-1 inline h-4 w-4" />
                              Accept
                            </button>

                            <button
                              disabled={
                                actionLoading ===
                                application.id
                              }
                              onClick={() =>
                                updateApplication(
                                  application.id,
                                  "rejected"
                                )
                              }
                              className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <XCircle className="mr-1 inline h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        )}

                        {application.status ===
                          "worker_completed" && (
                          <div>
                            <button
                              disabled={
                                actionLoading ===
                                application.id
                              }
                              onClick={() =>
                                confirmCompletion(
                                  application.id
                                )
                              }
                              className="w-full rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                              <CheckCircle2 className="mr-1 inline h-5 w-5" />
                              কাজ সম্পন্ন নিশ্চিত করুন
                            </button>
                          </div>
                        )}

                        {application.status ===
                          "completed" && (
                          <Link
                            href={`/rate-worker/${application.workerId}?applicationId=${application.id}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white hover:bg-amber-600 md:w-auto"
                          >
                            <Star className="h-5 w-5" />
                            Rate Worker
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              আমার Jobs
            </h2>
          </div>

          {jobs.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
              এখনো কোনো Job তৈরি করা হয়নি।
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border bg-white p-5"
                >
                  <h3 className="font-bold">
                    {job.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    <MapPin className="mr-1 inline h-4 w-4" />
                    {job.location || "Location নেই"}
                  </p>

                  <p className="mt-2 text-sm">
                    Salary:{" "}
                    <strong>
                      {job.salary || "আলোচনা সাপেক্ষে"}
                    </strong>
                  </p>

                  <div className="mt-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                      {job.status || "open"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}