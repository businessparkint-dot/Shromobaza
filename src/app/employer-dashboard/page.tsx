
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  UserRound,
  XCircle,
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
  const employerId = "employer-1";

  const [mounted, setMounted] = useState(false);

  const [localApplications, setLocalApplications] =
    useState<Application[]>(
      databaseApplications as Application[]
    );

  const [postedJobs, setPostedJobs] =
    useState<Job[]>([]);

  const [completions, setCompletions] =
    useState<Completion[]>([]);

  useEffect(() => {
    setMounted(true);

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
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const applications = useMemo(() => {
    return localApplications.filter(
      (application) =>
        application.employerId === employerId
    );
  }, [localApplications]);

  const allJobs = [
    ...postedJobs,
    ...(jobs as Job[]),
  ];

  const getJob = (jobId: string) => {
    return allJobs.find(
      (job) => job.id === jobId
    );
  };

  const getWorker = (workerId: string) => {
    return workers.find(
      (worker) => worker.id === workerId
    );
  };

  const getCompletion = (
    applicationId: string
  ) => {
    return completions.find(
      (completion) =>
        completion.applicationId ===
        applicationId
    );
  };

  const pendingCount = applications.filter(
    (application) =>
      application.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (application) =>
      application.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (application) =>
      application.status === "rejected"
  ).length;

  /* =====================================
     ACCEPT / REJECT
  ====================================== */

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
    } catch {
      // Ignore storage error
    }
  };

  /* =====================================
     CONFIRM JOB COMPLETE
  ====================================== */

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
                status: "confirmed" as const,
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
    } catch {
      // Ignore storage error
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Back */}

        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        {/* Header */}

        <div>
          <h1 className="text-3xl font-bold text-navy">
            Employer Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            আপনার Job এবং Worker Applications পরিচালনা করুন।
          </p>
        </div>

        {/* Statistics */}

        <div className="mt-8 grid gap-4 sm:grid-cols-4">

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              মোট Applications
            </p>

            <p className="mt-2 text-3xl font-bold text-navy">
              {applications.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Accepted
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {acceptedCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejectedCount}
            </p>
          </div>

        </div>

        {/* Applications */}

        <section className="mt-10">

          <h2 className="text-2xl font-bold text-navy">
            Worker Applications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            আপনার Job-এর জন্য আসা Worker Applications দেখুন।
          </p>

          {applications.length === 0 ? (

            <div className="mt-5 rounded-3xl bg-white p-12 text-center shadow-sm">

              <Briefcase className="mx-auto h-14 w-14 text-gray-300" />

              <h3 className="mt-5 text-xl font-bold text-navy">
                এখনো কোনো Application নেই
              </h3>

              <p className="mt-2 text-gray-500">
                আপনার Job-এ Worker Apply করলে এখানে দেখা যাবে।
              </p>

              <Link
                href="/jobs"
                className="mt-6 inline-flex rounded-xl bg-orange px-6 py-3 font-semibold text-white"
              >
                Jobs দেখুন
              </Link>

            </div>

          ) : (

            <div className="mt-5 space-y-5">

              {applications.map(
                (application) => {

                  const job =
                    getJob(
                      application.jobId
                    );

                  const worker =
                    getWorker(
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
                    <div
                      key={application.id}
                      className="rounded-3xl bg-white p-6 shadow-sm"
                    >

                      {/* Job Header */}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <h3 className="text-xl font-bold text-navy">
                            {job.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">

                            <span className="inline-flex items-center">
                              <MapPin className="mr-2 h-4 w-4" />
                              {job.location}
                            </span>

                            <span>
                              {job.salary}
                            </span>

                          </div>

                        </div>

                        {application.status ===
                          "accepted" && (
                          <span className="inline-flex w-fit items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accepted
                          </span>
                        )}

                        {application.status ===
                          "pending" && (
                          <span className="inline-flex w-fit items-center rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-600">
                            <Clock className="mr-2 h-4 w-4" />
                            Pending
                          </span>
                        )}

                        {application.status ===
                          "rejected" && (
                          <span className="inline-flex w-fit items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Rejected
                          </span>
                        )}

                      </div>

                      {/* Worker */}

                      {worker && (

                        <div className="mt-6 rounded-2xl bg-gray-50 p-5">

                          <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange/10 text-lg font-bold text-orange">
                              {worker.name
                                ?.charAt(0)}
                            </div>

                            <div>

                              <h4 className="font-bold text-navy">
                                {worker.name}
                              </h4>

                              <p className="text-sm text-gray-500">
                                {worker.category}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                {worker.district}
                              </p>

                            </div>

                          </div>

                          <Link
                            href={`/workers/${worker.id}`}
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange"
                          >
                            <UserRound className="h-4 w-4" />
                            Worker Profile
                          </Link>

                        </div>
                      )}

                      {/* Message */}

                      {application.message && (

                        <div className="mt-5">

                          <h4 className="font-bold text-navy">
                            Worker Message
                          </h4>

                          <p className="mt-2 rounded-2xl bg-blue-50 p-4 text-sm text-blue-700">
                            {application.message}
                          </p>

                        </div>
                      )}

                      {/* Completion Request */}

                      {completion?.status ===
                        "requested" && (

                        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                          <div className="flex items-start gap-3">

                            <Clock className="mt-1 h-6 w-6 shrink-0 text-yellow-600" />

                            <div className="flex-1">

                              <h4 className="font-bold text-yellow-800">
                                Worker কাজ সম্পন্ন করার Request পাঠিয়েছে
                              </h4>

                              <p className="mt-2 text-sm leading-6 text-yellow-700">
                                Worker জানিয়েছে যে কাজটি সম্পন্ন হয়েছে।
                                আপনি কাজটি যাচাই করে Confirm করতে পারেন।
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  confirmJobComplete(
                                    application.id
                                  )
                                }
                                className="mt-4 inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:opacity-90"
                              >
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Confirm Job Complete
                              </button>

                            </div>

                          </div>

                        </div>
                      )}

                      {/* Completed */}

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
                                Employer কাজটি সম্পন্ন হয়েছে বলে Confirm করেছেন।
                              </p>

                            </div>

                          </div>

                        </div>
                      )}

                      {/* Actions */}

                      <div className="mt-6 flex flex-wrap gap-3">

                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-navy hover:bg-gray-50"
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
                              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:opacity-90"
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
                              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white hover:opacity-90"
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
                            className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-3 font-semibold text-white hover:opacity-90"
                          >
                            <Star className="h-4 w-4" />
                            Worker-কে Rating দিন
                          </Link>
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

        {/* Bottom Links */}

        <div className="mt-10 grid gap-4 sm:grid-cols-2">

          <Link
            href="/jobs"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <Briefcase className="h-7 w-7 text-orange" />

            <h3 className="mt-4 font-bold text-navy">
              আমার Jobs
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              আপনার Job এবং Worker Applications দেখুন।
            </p>
          </Link>

          <Link
            href="/workers"
            className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <UserRound className="h-7 w-7 text-orange" />

            <h3 className="mt-4 font-bold text-navy">
              Worker খুঁজুন
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              নতুন Worker খুঁজে তাদের Profile দেখুন।
            </p>
          </Link>

        </div>

      </div>
    </main>
  );
}
