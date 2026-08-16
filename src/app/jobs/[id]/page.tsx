
"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Users,
  Wallet,
  FileText,
  Building2,
  CheckCircle,
} from "lucide-react";

import { jobs as defaultJobs, employers } from "@/lib/database";

type PostedJob = {
  id: string;
  employerId: string;
  title: string;
  location: string;
  salary: string;
  workersNeeded: number;
  description?: string;
  status?: string;
  createdAt?: string;
};

type JobDetails = {
  id: string;
  employerId: string;
  title: string;
  location: string;
  salary: string;
  workersNeeded: number;
  description?: string;
  status?: string;
  createdAt?: string;
};

const JOBS_STORAGE_KEY = "shromobazar_posted_jobs";

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(JOBS_STORAGE_KEY);

      let postedJobs: PostedJob[] = [];

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          postedJobs = parsed as PostedJob[];
        }
      }

      const localJob = postedJobs.find(
        (item) => item.id === id
      );

      if (localJob) {
        setJob({
          id: localJob.id,
          employerId: localJob.employerId,
          title: localJob.title,
          location: localJob.location,
          salary: localJob.salary,
          workersNeeded: localJob.workersNeeded ?? 1,
          description: localJob.description,
          status: localJob.status,
          createdAt: localJob.createdAt,
        });

        setLoading(false);
        return;
      }

      const databaseJob = defaultJobs.find(
        (item) => item.id === id
      );

      if (databaseJob) {
        setJob({
          id: databaseJob.id,
          employerId: databaseJob.employerId,
          title: databaseJob.title,
          location: databaseJob.location,
          salary: databaseJob.salary,
          workersNeeded: databaseJob.workersNeeded ?? 1,
          description: databaseJob.description,
          status: databaseJob.status,
          createdAt: databaseJob.createdAt,
        });
      } else {
        setJob(null);
      }
    } catch {
      const databaseJob = defaultJobs.find(
        (item) => item.id === id
      );

      if (databaseJob) {
        setJob({
          id: databaseJob.id,
          employerId: databaseJob.employerId,
          title: databaseJob.title,
          location: databaseJob.location,
          salary: databaseJob.salary,
          workersNeeded: databaseJob.workersNeeded ?? 1,
          description: databaseJob.description,
          status: databaseJob.status,
          createdAt: databaseJob.createdAt,
        });
      } else {
        setJob(null);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-500">
            Job তথ্য লোড হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <Briefcase className="h-8 w-8 text-orange-500" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-navy">
            কাজটি পাওয়া যায়নি
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            এই Job আর available নেই অথবা ID সঠিক নয়।
          </p>

          <p className="mt-3 text-xs text-gray-400">
            Job ID: {id}
          </p>

          <Link
            href="/jobs"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            সব কাজ দেখুন
          </Link>

        </div>
      </main>
    );
  }

  const employer = employers.find(
    (item) => item.id === job.employerId
  );

  const employerName =
    employer?.name || "Employer";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="mx-auto max-w-4xl">

        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          সব কাজ দেখুন
        </Link>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

          {/* HEADER */}
          <div className="bg-[#081B3A] px-6 py-8 text-white sm:px-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

              <div>

                <span className="inline-flex items-center rounded-full bg-green-400/15 px-3 py-1 text-xs font-semibold text-green-300">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Available
                </span>

                <h1 className="mt-4 text-3xl font-bold">
                  {job.title}
                </h1>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">

                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    {job.salary}
                  </span>

                </div>

              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-4 text-center">
                <Users className="mx-auto h-6 w-6" />

                <p className="mt-1 text-2xl font-bold">
                  {job.workersNeeded}
                </p>

                <p className="text-xs text-slate-300">
                  Worker প্রয়োজন
                </p>
              </div>

            </div>

          </div>

          {/* CONTENT */}
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_300px]">

            <div className="space-y-6">

              {/* DESCRIPTION */}
              <div className="rounded-2xl border border-gray-100 bg-white">

                <div className="flex items-center gap-3 border-b border-gray-100 p-5">

                  <div className="rounded-xl bg-blue-50 p-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>

                  <h2 className="text-xl font-bold text-navy">
                    কাজের বিস্তারিত
                  </h2>

                </div>

                <div className="p-5">

                  <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                    {job.description ||
                      "এই কাজের বিস্তারিত বিবরণ দেওয়া হয়নি।"}
                  </p>

                </div>

              </div>

              {/* JOB INFORMATION */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                <h3 className="font-bold text-navy">
                  কাজের তথ্য
                </h3>

                <div className="mt-4 space-y-4 text-sm text-gray-600">

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-orange" />

                    <span>
                      <strong className="text-navy">
                        স্থান:
                      </strong>{" "}
                      {job.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-orange" />

                    <span>
                      <strong className="text-navy">
                        পারিশ্রমিক:
                      </strong>{" "}
                      {job.salary}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-orange" />

                    <span>
                      <strong className="text-navy">
                        প্রয়োজন:
                      </strong>{" "}
                      {job.workersNeeded} জন
                    </span>
                  </div>

                </div>

              </div>

            </div>

            {/* EMPLOYER */}
            <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

              <p className="text-sm font-semibold text-gray-400">
                Employer
              </p>

              <div className="mt-4 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange text-lg font-bold text-white">
                  {employerName.charAt(0)}
                </div>

                <div>

                  <p className="font-bold text-navy">
                    {employerName}
                  </p>

                  <p className="text-sm text-gray-500">
                    নিয়োগকর্তা
                  </p>

                </div>

              </div>

              <div className="my-6 border-t border-gray-100" />

              <Link
                href={`/worker-application?jobId=${job.id}`}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-orange px-5 font-bold text-white transition hover:opacity-90"
              >
                এই কাজে Apply করুন
              </Link>

              <Link
                href="/jobs"
                className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 px-5 font-semibold text-navy transition hover:bg-gray-50"
              >
                অন্য Job দেখুন
              </Link>

              <div className="mt-5 rounded-xl bg-blue-50 p-4">

                <div className="flex gap-3">

                  <Building2 className="h-5 w-5 shrink-0 text-blue-600" />

                  <p className="text-xs leading-5 text-blue-700">
                    Apply করার আগে কাজের স্থান,
                    পারিশ্রমিক এবং কাজের বিবরণ ভালোভাবে
                    দেখে নিন।
                  </p>

                </div>

              </div>

            </aside>

          </div>

        </div>

      </div>

    </main>
  );
}
