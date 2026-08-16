
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Clock,
  MapPin,
  Wallet,
} from "lucide-react";

import { jobs, applications as databaseApplications } from "@/lib/database";

const APPLICATIONS_STORAGE_KEY =
  "shromobazar_applications";

const POSTED_JOBS_STORAGE_KEY =
  "shromobazar_posted_jobs";

const COMPLETIONS_STORAGE_KEY =
  "shromobazar_job_completions";

type Application = {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  status: "pending" | "accepted" | "rejected";
  message?: string;
  appliedAt?: string;
};

type Job = {
  id: string;
  employerId?: string;
  title: string;
  location: string;
  salary: string;
  workersNeeded?: number;
  description?: string;
  status?: string;
  createdAt?: string;
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

export default function JobCompletePage() {
  const params = useParams();
  const router = useRouter();

  const applicationId =
    typeof params.applicationId === "string"
      ? params.applicationId
      : "";

  const [application, setApplication] =
    useState<Application | null>(null);

  const [job, setJob] =
    useState<Job | null>(null);

  const [completion, setCompletion] =
    useState<Completion | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    if (!applicationId) {
      setLoading(false);
      setError("Application ID পাওয়া যায়নি।");
      return;
    }

    try {
      /* =====================================
         APPLICATION LOAD
      ====================================== */

      let foundApplication:
        | Application
        | null = null;

      const savedApplications =
        localStorage.getItem(
          APPLICATIONS_STORAGE_KEY
        );

      if (savedApplications) {
        const parsed =
          JSON.parse(savedApplications);

        if (Array.isArray(parsed)) {
          foundApplication =
            parsed.find(
              (item: Application) =>
                item.id === applicationId
            ) || null;
        }
      }

      /*
       * যদি localStorage-এ না থাকে,
       * তাহলে database-এর application দেখবে।
       */

      if (!foundApplication) {
        const databaseApplication =
          databaseApplications.find(
            (item) =>
              item.id === applicationId
          );

        if (databaseApplication) {
          foundApplication =
            databaseApplication;
        }
      }

      if (!foundApplication) {
        setError(
          "Application পাওয়া যায়নি।"
        );
        setLoading(false);
        return;
      }

      setApplication(foundApplication);

      /* =====================================
         JOB LOAD
      ====================================== */

      let foundJob: Job | null = null;

      /*
       * প্রথমে localStorage-এর posted jobs
       */

      const savedJobs =
        localStorage.getItem(
          POSTED_JOBS_STORAGE_KEY
        );

      if (savedJobs) {
        const parsedJobs =
          JSON.parse(savedJobs);

        if (Array.isArray(parsedJobs)) {
          foundJob =
            parsedJobs.find(
              (item: Job) =>
                item.id ===
                foundApplication!.jobId
            ) || null;
        }
      }

      /*
       * না পেলে database jobs
       */

      if (!foundJob) {
        const databaseJob =
          jobs.find(
            (item) =>
              item.id ===
              foundApplication!.jobId
          );

        if (databaseJob) {
          foundJob = databaseJob;
        }
      }

      if (!foundJob) {
        setError(
          "এই Application-এর Job পাওয়া যায়নি।"
        );
        setLoading(false);
        return;
      }

      setJob(foundJob);

      /* =====================================
         COMPLETION LOAD
      ====================================== */

      const savedCompletions =
        localStorage.getItem(
          COMPLETIONS_STORAGE_KEY
        );

      if (savedCompletions) {
        const parsedCompletions =
          JSON.parse(savedCompletions);

        if (Array.isArray(parsedCompletions)) {
          const existing =
            parsedCompletions.find(
              (item: Completion) =>
                item.applicationId ===
                applicationId
            );

          if (existing) {
            setCompletion(existing);
          }
        }
      }

      setLoading(false);
    } catch {
      setError(
        "তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।"
      );

      setLoading(false);
    }
  }, [applicationId]);

  /* =====================================
     COMPLETE JOB REQUEST
  ====================================== */

  const handleCompleteRequest = () => {
    setError("");

    if (!application) {
      setError(
        "Application পাওয়া যায়নি।"
      );
      return;
    }

    if (!job) {
      setError(
        "Job পাওয়া যায়নি।"
      );
      return;
    }

    if (application.status !== "accepted") {
      setError(
        "শুধু Accepted Job-এর কাজ সম্পন্ন করা যাবে।"
      );
      return;
    }

    try {
      const savedCompletions =
        localStorage.getItem(
          COMPLETIONS_STORAGE_KEY
        );

      let existingCompletions:
        Completion[] = [];

      if (savedCompletions) {
        const parsed =
          JSON.parse(savedCompletions);

        if (Array.isArray(parsed)) {
          existingCompletions = parsed;
        }
      }

      const alreadyExists =
        existingCompletions.find(
          (item) =>
            item.applicationId ===
            application.id
        );

      if (alreadyExists) {
        setCompletion(alreadyExists);
        return;
      }

      const newCompletion: Completion = {
        applicationId: application.id,
        workerId: application.workerId,
        employerId: application.employerId,
        jobId: application.jobId,
        status: "requested",
        requestedAt:
          new Date().toISOString(),
      };

      const updatedCompletions = [
        newCompletion,
        ...existingCompletions,
      ];

      localStorage.setItem(
        COMPLETIONS_STORAGE_KEY,
        JSON.stringify(
          updatedCompletions
        )
      );

      setCompletion(newCompletion);
      setSuccess(true);

      setTimeout(() => {
        router.push(
          "/worker-my-jobs"
        );
      }, 1200);
    } catch {
      setError(
        "Completion Request সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।"
      );
    }
  };

  /* =====================================
     LOADING
  ====================================== */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl">

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-orange" />

            <p className="mt-5 font-semibold text-navy">
              Job-এর তথ্য লোড হচ্ছে...
            </p>

          </div>

        </div>
      </main>
    );
  }

  /* =====================================
     ERROR
  ====================================== */

  if (error || !application || !job) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">

        <div className="mx-auto max-w-xl">

          <Link
            href="/worker-my-jobs"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            আমার Jobs
          </Link>

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <Briefcase className="mx-auto h-14 w-14 text-gray-300" />

            <h1 className="mt-5 text-2xl font-bold text-navy">
              Job পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-gray-500">
              {error ||
                "Application অথবা Job সঠিকভাবে পাওয়া যায়নি।"}
            </p>

            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-left text-xs text-gray-500">
              <p>
                Application ID:
              </p>

              <p className="mt-1 break-all font-mono text-navy">
                {applicationId}
              </p>
            </div>

          </div>

        </div>

      </main>
    );
  }

  /* =====================================
     SUCCESS
  ====================================== */

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">

        <div className="mx-auto max-w-xl">

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-navy">
              কাজ সম্পন্ন করার Request পাঠানো হয়েছে
            </h1>

            <p className="mt-3 leading-7 text-gray-500">
              আপনার কাজ সম্পন্ন হওয়ার Request
              Employer-এর কাছে পাঠানো হয়েছে।
            </p>

            <p className="mt-5 text-sm font-semibold text-orange">
              Employer Confirmation-এর অপেক্ষায়...
            </p>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">

      <div className="mx-auto max-w-2xl">

        <Link
          href="/worker-my-jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          আমার Jobs
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          {/* Header */}

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-green-50 p-3">
              <CheckCircle className="h-7 w-7 text-green-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-navy">
                কাজের Details
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                কাজ শেষ হলে Employer-কে জানান।
              </p>
            </div>

          </div>

          {/* Job Card */}

          <div className="mt-8 rounded-2xl bg-gray-50 p-5">

            <h2 className="text-xl font-bold text-navy">
              {job.title}
            </h2>

            <div className="mt-5 space-y-3 text-sm text-gray-600">

              <div className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-orange" />
                {job.location}
              </div>

              <div className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-orange" />
                {job.salary}
              </div>

              <div className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5 text-orange" />
                {job.workersNeeded ?? 1} জন প্রয়োজন
              </div>

            </div>

          </div>

          {/* Description */}

          <div className="mt-6">

            <h3 className="font-bold text-navy">
              কাজের বিবরণ
            </h3>

            <p className="mt-2 leading-7 text-gray-600">
              {job.description}
            </p>

          </div>

          {/* Existing Request */}

          {completion?.status ===
            "requested" && (

            <div className="mt-7 rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

              <div className="flex items-start gap-3">

                <Clock className="mt-0.5 h-6 w-6 text-yellow-600" />

                <div>

                  <h3 className="font-bold text-yellow-700">
                    Employer Confirmation-এর অপেক্ষায়
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-yellow-700/80">
                    আপনি কাজ সম্পন্ন করার Request
                    পাঠিয়েছেন। Employer Confirm করলে
                    Job Completed হবে।
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Confirmed */}

          {completion?.status ===
            "confirmed" && (

            <div className="mt-7 rounded-2xl border border-green-200 bg-green-50 p-5">

              <div className="flex items-start gap-3">

                <CheckCircle className="mt-0.5 h-6 w-6 text-green-600" />

                <div>

                  <h3 className="font-bold text-green-700">
                    Job Completed
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-green-700/80">
                    Employer আপনার কাজ সম্পন্ন হওয়ার
                    বিষয়টি Confirm করেছেন।
                  </p>

                </div>

              </div>

              <Link
                href={`/rate-worker/${application.workerId}`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white"
              >
                Worker Rating & Review
              </Link>

            </div>
          )}

          {/* Complete Button */}

          {!completion && (

            <div className="mt-8">

              <p className="text-sm leading-7 text-gray-600">
                আপনি যদি এই কাজটি সম্পূর্ণ করে থাকেন,
                তাহলে নিচের button-এ click করে Employer-এর
                কাছে Completion Request পাঠান।
              </p>

              <button
                type="button"
                onClick={
                  handleCompleteRequest
                }
                className="mt-5 h-12 w-full rounded-xl bg-orange font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
              >
                কাজ সম্পন্ন হয়েছে
              </button>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}
