"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  UserRound,
  XCircle,
  ArrowRight,
  RefreshCw,
  Users,
} from "lucide-react";

import {
  applications as databaseApplications,
  jobs,
  workers,
} from "@/lib/database";

const APPLICATIONS_STORAGE_KEY =
  "shromobazar_applications";

const POSTED_JOBS_STORAGE_KEY =
  "shromobazar_posted_jobs";

const COMPLETIONS_STORAGE_KEY =
  "shromobazar_job_completions";

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected";

type Application = {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: ApplicationStatus;
  message?: string;
  appliedAt?: string;
};

type Completion = {
  applicationId: string;
  workerId: string;
  employerId: string;
  jobId: string;
  status: "requested" | "confirmed";
  requestedAt: string;
  confirmedAt?: string;
};

type Job = {
  id: string;
  employerId?: string;
  title: string;
  location: string;
  salary: string;
  workersNeeded?: number;
  description: string;
  status?: string;
  createdAt?: string;
};

export default function EmployerDashboardPage() {
  /*
   * Temporary demo employer ID.
   *
   * Later this will come directly from
   * Supabase authenticated user.
   */
  const employerId = "employer-1";

  const [localApplications, setLocalApplications] =
    useState<Application[]>(
      databaseApplications as Application[]
    );

  const [postedJobs, setPostedJobs] =
    useState<Job[]>([]);

  const [completions, setCompletions] =
    useState<Completion[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  /*
   * ==========================================
   * LOAD LOCAL DATA
   * ==========================================
   */

  const loadDashboardData = (
    showRefresh = false
  ) => {
    if (showRefresh) {
      setRefreshing(true);
    }

    try {
      const savedApplications =
        localStorage.getItem(
          APPLICATIONS_STORAGE_KEY
        );

      if (savedApplications) {
        const parsed =
          JSON.parse(savedApplications);

        if (Array.isArray(parsed)) {
          setLocalApplications(parsed);
        }
      }

      const savedJobs =
        localStorage.getItem(
          POSTED_JOBS_STORAGE_KEY
        );

      if (savedJobs) {
        const parsed =
          JSON.parse(savedJobs);

        if (Array.isArray(parsed)) {
          setPostedJobs(parsed);
        }
      }

      const savedCompletions =
        localStorage.getItem(
          COMPLETIONS_STORAGE_KEY
        );

      if (savedCompletions) {
        const parsed =
          JSON.parse(savedCompletions);

        if (Array.isArray(parsed)) {
          setCompletions(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Dashboard data loading error:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  /*
   * ==========================================
   * APPLICATIONS
   * ==========================================
   */

  const applications = useMemo(() => {
    return localApplications.filter(
      (application) =>
        application.employerId === employerId
    );
  }, [localApplications]);

  /*
   * ==========================================
   * JOBS
   * ==========================================
   */

  const allJobs = useMemo(() => {
    return [
      ...postedJobs,
      ...(jobs as Job[]),
    ];
  }, [postedJobs]);

  const getJob = (jobId: string) => {
    return allJobs.find(
      (job) => job.id === jobId
    );
  };

  /*
   * ==========================================
   * WORKERS
   * ==========================================
   */

  const getWorker = (workerId: string) => {
    return workers.find(
      (worker) => worker.id === workerId
    );
  };

  /*
   * ==========================================
   * COMPLETIONS
   * ==========================================
   */

  const getCompletion = (
    applicationId: string
  ) => {
    return completions.find(
      (completion) =>
        completion.applicationId ===
        applicationId
    );
  };

  /*
   * ==========================================
   * STATISTICS
   * ==========================================
   */

  const pendingCount =
    applications.filter(
      (application) =>
        application.status === "pending"
    ).length;

  const acceptedCount =
    applications.filter(
      (application) =>
        application.status === "accepted"
    ).length;

  const rejectedCount =
    applications.filter(
      (application) =>
        application.status === "rejected"
    ).length;

  const myJobsCount = postedJobs.filter(
    (job) =>
      !job.employerId ||
      job.employerId === employerId
  ).length;

  /*
   * ==========================================
   * UPDATE APPLICATION
   * ==========================================
   */

  const updateApplicationStatus = (
    applicationId: string,
    status: ApplicationStatus
  ) => {
    const updatedApplications =
      localApplications.map(
        (application) =>
          application.id === applicationId
            ? {
                ...application,
                status,
              }
            : application
      );

    setLocalApplications(
      updatedApplications
    );

    try {
      localStorage.setItem(
        APPLICATIONS_STORAGE_KEY,
        JSON.stringify(
          updatedApplications
        )
      );
    } catch (error) {
      console.error(
        "Application storage error:",
        error
      );
    }
  };

  /*
   * ==========================================
   * CONFIRM JOB COMPLETE
   * ==========================================
   */

  const confirmJobComplete = (
    applicationId: string
  ) => {
    const updatedCompletions =
      completions.map(
        (completion) =>
          completion.applicationId ===
          applicationId
            ? {
                ...completion,
                status:
                  "confirmed" as const,
                confirmedAt:
                  new Date().toISOString(),
              }
            : completion
      );

    setCompletions(
      updatedCompletions
    );

    try {
      localStorage.setItem(
        COMPLETIONS_STORAGE_KEY,
        JSON.stringify(
          updatedCompletions
        )
      );
    } catch (error) {
      console.error(
        "Completion storage error:",
        error
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">

        {/* =====================================
            HEADER
        ====================================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-bold text-orange-500">
                শ্রমবাজার
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                নিয়োগকর্তা ড্যাশবোর্ড
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                আপনার Job, Worker Application,
                Hiring এবং কাজ সম্পন্ন হওয়ার
                কার্যক্রম এক জায়গা থেকে পরিচালনা করুন।
              </p>
            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  loadDashboardData(true)
                }
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={
                    refreshing
                      ? "h-4 w-4 animate-spin"
                      : "h-4 w-4"
                  }
                />

                Refresh
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-500"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Link>

            </div>
          </div>
        </header>

        {/* =====================================
            ACCOUNT PROFILE
        ====================================== */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-6 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                <Building2 className="h-8 w-8" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  Unified Account
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  আমার Account
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  একই Account থেকে Worker,
                  Employer, Customer এবং
                  Marketplace-এর প্রয়োজনীয়
                  সুবিধা ব্যবহার করা যাবে।
                </p>
              </div>

            </div>

            <Link
              href="/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <UserRound className="h-4 w-4" />
              Profile
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </section>

        {/* =====================================
            DASHBOARD STATISTICS
        ====================================== */}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="আমার Jobs"
            value={myJobsCount}
            description="Posted / managed jobs"
            icon={
              <Briefcase className="h-6 w-6" />
            }
            iconClass="bg-orange-50 text-orange-500"
          />

          <StatCard
            title="Applications"
            value={applications.length}
            description="Worker applications"
            icon={
              <Users className="h-6 w-6" />
            }
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            title="Accepted"
            value={acceptedCount}
            description="Workers accepted"
            icon={
              <CheckCircle className="h-6 w-6" />
            }
            iconClass="bg-green-50 text-green-600"
          />

          <StatCard
            title="Pending"
            value={pendingCount}
            description="Need your action"
            icon={
              <Clock className="h-6 w-6" />
            }
            iconClass="bg-yellow-50 text-yellow-600"
          />

        </section>

        {/* =====================================
            APPLICATION SUMMARY
        ====================================== */}

        <section className="mt-6 grid gap-4 sm:grid-cols-3">

          <MiniStat
            title="Pending"
            value={pendingCount}
            className="text-yellow-600"
          />

          <MiniStat
            title="Accepted"
            value={acceptedCount}
            className="text-green-600"
          />

          <MiniStat
            title="Rejected"
            value={rejectedCount}
            className="text-red-600"
          />

        </section>

        {/* =====================================
            APPLICATIONS
        ====================================== */}

        <section className="mt-10">

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Worker Applications
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              আপনার Job-এর জন্য Worker-রা
              Apply করলে এখানে দেখা যাবে।
            </p>
          </div>

          {loading ? (
            <div className="mt-5 rounded-3xl bg-white p-12 text-center shadow-sm">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-orange-500" />

              <p className="mt-4 text-sm text-slate-500">
                Dashboard loading...
              </p>
            </div>
          ) : applications.length === 0 ? (
            <div className="mt-5 rounded-3xl bg-white p-12 text-center shadow-sm">

              <Briefcase className="mx-auto h-14 w-14 text-slate-300" />

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                এখনো কোনো Application নেই
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                আপনার Job-এ Worker Apply করলে
                Application এখানে দেখা যাবে।
              </p>

              <Link
                href="/jobs"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                <Briefcase className="h-4 w-4" />
                Jobs দেখুন
              </Link>

            </div>
          ) : (
            <div className="mt-5 space-y-5">

              {applications.map(
                (application) => {
                  const job = getJob(
                    application.jobId
                  );

                  const worker = getWorker(
                    application.workerId
                  );

                  const completion =
                    getCompletion(
                      application.id
                    );

                  if (!job) {
                    return null;
                  }

                  return (
                    <article
                      key={application.id}
                      className="rounded-3xl bg-white p-6 shadow-sm"
                    >

                      {/* JOB HEADER */}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {job.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">

                            <span className="inline-flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              {job.location}
                            </span>

                            <span>
                              {job.salary}
                            </span>

                          </div>
                        </div>

                        <StatusBadge
                          status={
                            application.status
                          }
                        />

                      </div>

                      {/* WORKER */}

                      {worker && (
                        <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div className="flex items-center gap-4">

                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-lg font-bold text-orange-500">
                                {worker.name?.charAt(
                                  0
                                ) || "W"}
                              </div>

                              <div>
                                <h4 className="font-bold text-slate-900">
                                  {worker.name}
                                </h4>

                                <p className="text-sm text-slate-500">
                                  {worker.category}
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  {worker.district}
                                </p>
                              </div>

                            </div>

                            <Link
                              href={`/workers/${worker.id}`}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500"
                            >
                              <UserRound className="h-4 w-4" />
                              Worker Profile
                            </Link>

                          </div>

                        </div>
                      )}

                      {/* MESSAGE */}

                      {application.message && (
                        <div className="mt-5">
                          <h4 className="font-bold text-slate-900">
                            Worker Message
                          </h4>

                          <p className="mt-2 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-700">
                            {application.message}
                          </p>
                        </div>
                      )}

                      {/* COMPLETION REQUEST */}

                      {completion?.status ===
                        "requested" && (
                        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                          <div className="flex items-start gap-3">

                            <Clock className="mt-1 h-6 w-6 shrink-0 text-yellow-600" />

                            <div className="flex-1">

                              <h4 className="font-bold text-yellow-800">
                                কাজ সম্পন্ন করার Request
                              </h4>

                              <p className="mt-2 text-sm leading-6 text-yellow-700">
                                Worker জানিয়েছে যে
                                কাজটি সম্পন্ন হয়েছে।
                                যাচাই করে Confirm করুন।
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  confirmJobComplete(
                                    application.id
                                  )
                                }
                                className="mt-4 inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                              >
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Confirm Job Complete
                              </button>

                            </div>

                          </div>

                        </div>
                      )}

                      {/* COMPLETED */}

                      {completion?.status ===
                        "confirmed" && (
                        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">

                          <div className="flex items-start gap-3">

                            <CheckCircle className="mt-1 h-6 w-6 shrink-0 text-green-600" />

                            <div>
                              <h4 className="font-bold text-green-800">
                                Job Completed
                              </h4>

                              <p className="mt-2 text-sm text-green-700">
                                Employer কাজটি
                                সম্পন্ন হয়েছে বলে
                                Confirm করেছেন।
                              </p>
                            </div>

                          </div>

                        </div>
                      )}

                      {/* ACTIONS */}

                      <div className="mt-6 flex flex-wrap gap-3">

                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <Briefcase className="h-4 w-4" />
                          Job Details
                        </Link>

                        {application.status ===
                          "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateApplicationStatus(
                                  application.id,
                                  "accepted"
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Accept Worker
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                updateApplicationStatus(
                                  application.id,
                                  "rejected"
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject Worker
                            </button>
                          </>
                        )}

                        {application.status ===
                          "accepted" && (
                          <Link
                            href={`/rate-worker/${application.workerId}`}
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
                          >
                            <Star className="h-4 w-4" />
                            Worker-কে Rating দিন
                          </Link>
                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </section>

        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <QuickAction
            href="/jobs"
            icon={
              <Briefcase className="h-7 w-7 text-orange-500" />
            }
            title="আমার Jobs"
            description="আপনার Job এবং Applications পরিচালনা করুন।"
          />

          <QuickAction
            href="/workers"
            icon={
              <UserRound className="h-7 w-7 text-blue-600" />
            }
            title="Worker খুঁজুন"
            description="দক্ষ Worker খুঁজে Profile দেখুন।"
          />

          <QuickAction
            href="/profile"
            icon={
              <Building2 className="h-7 w-7 text-green-600" />
            }
            title="আমার Profile"
            description="আপনার Unified Account Profile দেখুন ও Edit করুন।"
          />

        </section>

      </div>
    </main>
  );
}

/*
 * ==========================================
 * STAT CARD
 * ==========================================
 */

function StatCard({
  title,
  value,
  description,
  icon,
  iconClass,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/*
 * ==========================================
 * MINI STAT
 * ==========================================
 */

function MiniStat({
  title,
  value,
  className,
}: {
  title: string;
  value: number;
  className: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p
        className={`mt-2 text-3xl font-black ${className}`}
      >
        {value}
      </p>

    </div>
  );
}

/*
 * ==========================================
 * STATUS BADGE
 * ==========================================
 */

function StatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  if (status === "accepted") {
    return (
      <span className="inline-flex w-fit items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
        <CheckCircle className="mr-2 h-4 w-4" />
        Accepted
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex w-fit items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
        <XCircle className="mr-2 h-4 w-4" />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex w-fit items-center rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-600">
      <Clock className="mr-2 h-4 w-4" />
      Pending
    </span>
  );
}

/*
 * ==========================================
 * QUICK ACTION
 * ==========================================
 */

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      {icon}

      <h3 className="mt-4 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-500">
        Open
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}