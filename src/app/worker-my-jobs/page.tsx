
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  XCircle,
} from "lucide-react";

import { jobs as databaseJobs, applications as databaseApplications } from "@/lib/database";

const APPLICATIONS_STORAGE_KEY = "shromobazar_applications";
const POSTED_JOBS_STORAGE_KEY = "shromobazar_jobs";
const COMPLETIONS_STORAGE_KEY = "shromobazar_job_completions";

type ApplicationStatus = "pending" | "accepted" | "rejected";

type Application = {
  id: string;
  jobId: string;
  workerId: string;
  employerId?: string;
  status: ApplicationStatus;
  message?: string;
};

type Job = {
  id: string;
  title: string;
  location: string;
  salary: string;
  workersNeeded?: number;
  description?: string;
};

type Completion = {
  applicationId: string;
  workerCompleted: boolean;
  employerConfirmed: boolean;
};

export default function WorkerMyJobsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);

  useEffect(() => {
    try {
      const savedApplications = localStorage.getItem(
        APPLICATIONS_STORAGE_KEY
      );

      const savedJobs = localStorage.getItem(POSTED_JOBS_STORAGE_KEY);

      const savedCompletions = localStorage.getItem(
        COMPLETIONS_STORAGE_KEY
      );

      const parsedApplications: Application[] = savedApplications
        ? JSON.parse(savedApplications)
        : databaseApplications;

      const parsedJobs: Job[] = savedJobs
        ? JSON.parse(savedJobs)
        : databaseJobs;

      const parsedCompletions: Completion[] = savedCompletions
        ? JSON.parse(savedCompletions)
        : [];

      setApplications(
        Array.isArray(parsedApplications) ? parsedApplications : []
      );

      setJobs(Array.isArray(parsedJobs) ? parsedJobs : []);

      setCompletions(
        Array.isArray(parsedCompletions) ? parsedCompletions : []
      );
    } catch (error) {
      console.error("Worker My Jobs load error:", error);

      setApplications(databaseApplications as Application[]);
      setJobs(databaseJobs as Job[]);
      setCompletions([]);
    }
  }, []);

  /*
   * শুধু Worker-এর applications দেখানো হবে।
   *
   * একই application দুইবার থাকলেও একই application ID
   * একবারের বেশি দেখানো হবে না।
   */
  const uniqueApplications = useMemo(() => {
    const seen = new Set<string>();

    return applications.filter((application) => {
      if (!application?.id) return false;

      if (seen.has(application.id)) {
        return false;
      }

      seen.add(application.id);
      return true;
    });
  }, [applications]);

  const pendingApplications = uniqueApplications.filter(
    (application) => application.status === "pending"
  );

  const acceptedApplications = uniqueApplications.filter(
    (application) => application.status === "accepted"
  );

  const rejectedApplications = uniqueApplications.filter(
    (application) => application.status === "rejected"
  );

  function getJob(jobId: string) {
    return jobs.find((job) => job.id === jobId);
  }

  function getCompletion(applicationId: string) {
    return completions.find(
      (completion) => completion.applicationId === applicationId
    );
  }

  function renderStatus(status: ApplicationStatus) {
    if (status === "accepted") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          <CheckCircle className="h-4 w-4" />
          Accepted
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
          <XCircle className="h-4 w-4" />
          Rejected
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
        <Clock className="h-4 w-4" />
        Pending
      </span>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/worker-dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Worker Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                আমার Jobs
              </h1>

              <p className="mt-1 text-slate-600">
                আপনার Accepted, Pending এবং Rejected Jobs দেখুন।
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Accepted Jobs
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {acceptedApplications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Pending Jobs
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingApplications.length}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Rejected Jobs
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejectedApplications.length}
            </p>
          </div>

        </div>

        {/* Job List */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              Job List
            </h2>

            <p className="mt-1 text-slate-600">
              আপনার Job Applications-এর বর্তমান অবস্থা।
            </p>
          </div>

          {uniqueApplications.length === 0 ? (
            <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
              <BriefcaseBusiness className="mx-auto h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                এখনো কোনো Job নেই
              </h3>

              <p className="mt-2 text-slate-500">
                নতুন Job খুঁজে Apply করুন।
              </p>

              <Link
                href="/jobs"
                className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Job খুঁজুন
              </Link>
            </div>
          ) : (
            <div className="space-y-5">

              {uniqueApplications.map((application) => {
                const job = getJob(application.jobId);

                if (!job) return null;

                const completion = getCompletion(application.id);

                const workerCompleted =
                  completion?.workerCompleted === true;

                const employerConfirmed =
                  completion?.employerConfirmed === true;

                return (
                  <article
                    key={application.id}
                    className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                  >

                    {/* Job Header */}
                    <div className="border-b bg-slate-50 p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {job.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>

                            <span className="font-semibold text-slate-900">
                              {job.salary}
                            </span>
                          </div>
                        </div>

                        {renderStatus(application.status)}

                      </div>
                    </div>

                    {/* Job Body */}
                    <div className="p-5">

                      <div className="grid gap-5 sm:grid-cols-3">

                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            কাজের স্থান
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {job.location}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            পারিশ্রমিক
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {job.salary}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            প্রয়োজন
                          </p>

                          <p className="mt-1 font-semibold text-slate-900">
                            {job.workersNeeded ?? 1} জন
                          </p>
                        </div>

                      </div>

                      {job.description && (
                        <div className="mt-6">
                          <h4 className="font-bold text-slate-900">
                            কাজের বিবরণ
                          </h4>

                          <p className="mt-2 leading-7 text-slate-600">
                            {job.description}
                          </p>
                        </div>
                      )}

                      {application.message && (
                        <div className="mt-6">
                          <h4 className="font-bold text-slate-900">
                            আপনার Message
                          </h4>

                          <p className="mt-2 rounded-xl bg-slate-50 p-4 text-slate-600">
                            {application.message}
                          </p>
                        </div>
                      )}

                      {/* Accepted */}
                      {application.status === "accepted" && (
                        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">

                          <div className="flex items-center gap-2 font-bold text-green-700">
                            <CheckCircle className="h-5 w-5" />
                            আপনার Application Accepted
                          </div>

                          <p className="mt-1 text-sm text-green-700">
                            Employer আপনাকে এই Job-এর জন্য গ্রহণ করেছেন।
                          </p>

                        </div>
                      )}

                      {/* Completed */}
                      {workerCompleted && !employerConfirmed && (
                        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">

                          <div className="flex items-center gap-2 font-bold text-blue-700">
                            <Clock className="h-5 w-5" />
                            Employer Confirmation-এর অপেক্ষায়
                          </div>

                          <p className="mt-1 text-sm text-blue-700">
                            আপনি কাজ সম্পন্ন করেছেন। Employer এখন কাজটি
                            Confirm করবেন।
                          </p>

                        </div>
                      )}

                      {/* Employer Confirmed */}
                      {employerConfirmed && (
                        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4">

                          <div className="flex items-center gap-2 font-bold text-green-700">
                            <CheckCircle className="h-5 w-5" />
                            Job Completed
                          </div>

                          <p className="mt-1 text-sm text-green-700">
                            Employer আপনার কাজ সম্পন্ন হওয়ার বিষয়টি Confirm করেছেন।
                          </p>

                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-6 flex flex-wrap gap-3">

                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Job Details
                        </Link>

                        {/* ONLY ONE complete button */}
                        {application.status === "accepted" &&
                          !workerCompleted &&
                          !employerConfirmed && (
                            <Link
                              href={`/job-complete/${application.id}`}
                              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                            >
                              কাজ সম্পূর্ণ করুন
                            </Link>
                          )}

                        {/* Worker → Employer Rating */}
                        {employerConfirmed && (
                          <Link
                            href={`/rate-employer/${application.employerId ?? "employer-001"}`}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            <Star className="h-4 w-4" />
                            Employer-কে Rating দিন
                          </Link>
                        )}

                      </div>

                    </div>
                  </article>
                );
              })}

            </div>
          )}
        </section>
      </div>
    </main>
  );
}
