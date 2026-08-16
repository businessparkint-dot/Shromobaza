
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Building2,
  CheckCircle,
  PlayCircle,
  Briefcase,
} from "lucide-react";

import { applications, jobs, employers } from "@/lib/database";

type WorkStatus = "accepted" | "working" | "completed";

type WorkStatusMap = Record<string, WorkStatus>;

export default function MyJobsPage() {
  const workerId = "worker-001";

  const [workStatuses, setWorkStatuses] =
    useState<WorkStatusMap>({});

  /* =========================
     LOAD SAVED STATUS
  ========================= */

  useEffect(() => {
    const saved = localStorage.getItem(
      "shromobazar_work_status"
    );

    if (!saved) return;

    try {
      setWorkStatuses(JSON.parse(saved));
    } catch {
      setWorkStatuses({});
    }
  }, []);

  /* =========================
     ACCEPTED APPLICATIONS
  ========================= */

  const acceptedApplications = applications.filter(
    (application) =>
      application.workerId === workerId &&
      application.status === "accepted"
  );

  /* =========================
     START JOB
  ========================= */

  const handleStartJob = (applicationId: string) => {
    const updatedStatuses: WorkStatusMap = {
      ...workStatuses,
      [applicationId]: "working",
    };

    setWorkStatuses(updatedStatuses);

    localStorage.setItem(
      "shromobazar_work_status",
      JSON.stringify(updatedStatuses)
    );
  };

  /* =========================
     COMPLETE JOB
  ========================= */

  const handleCompleteJob = (applicationId: string) => {
    const updatedStatuses: WorkStatusMap = {
      ...workStatuses,
      [applicationId]: "completed",
    };

    setWorkStatuses(updatedStatuses);

    localStorage.setItem(
      "shromobazar_work_status",
      JSON.stringify(updatedStatuses)
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          href="/worker-dashboard"
          className="mb-6 inline-flex items-center text-sm font-medium text-navy transition hover:text-orange"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Worker Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">
            My Jobs
          </h1>

          <p className="mt-2 text-gray-500">
            আপনার Accepted Jobs এখানে দেখতে পারবেন।
          </p>
        </div>

        {/* No Accepted Job */}
        {acceptedApplications.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <Briefcase className="mx-auto h-14 w-14 text-gray-300" />

            <h2 className="mt-5 text-xl font-bold text-navy">
              এখনো কোনো Accepted Job নেই
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              কোনো Job-এ Apply করুন এবং Employer Accept করলে
              সেটি এখানে দেখা যাবে।
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex items-center rounded-xl bg-orange px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Job খুঁজুন
            </Link>

          </div>
        ) : (

          /* Accepted Jobs */
          <div className="space-y-6">

            {acceptedApplications.map((application) => {

              const job = jobs.find(
                (item) => item.id === application.jobId
              );

              if (!job) return null;

              const employer = employers.find(
                (item) => item.id === job.employerId
              );

              const currentStatus =
                workStatuses[application.id] || "accepted";

              return (
                <div
                  key={application.id}
                  className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm"
                >

                  {/* Top */}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                      <h2 className="text-2xl font-bold text-navy">
                        {job.title}
                      </h2>

                      <p className="mt-2 flex items-center font-medium text-orange">
                        <Building2 className="mr-2 h-4 w-4" />
                        {employer?.name || "Employer"}
                      </p>

                    </div>

                    {/* Status */}
                    {currentStatus === "accepted" && (
                      <span className="inline-flex w-fit items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accepted
                      </span>
                    )}

                    {currentStatus === "working" && (
                      <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                        <PlayCircle className="mr-2 h-4 w-4" />
                        কাজ চলছে
                      </span>
                    )}

                    {currentStatus === "completed" && (
                      <span className="inline-flex w-fit items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-600">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        কাজ সম্পন্ন
                      </span>
                    )}

                  </div>

                  {/* Job Information */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">

                    {/* Location */}
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <div className="flex items-center text-gray-400">
                        <MapPin className="mr-2 h-5 w-5" />

                        <span className="text-sm">
                          Location
                        </span>
                      </div>

                      <p className="mt-2 font-semibold text-navy">
                        {job.location}
                      </p>

                    </div>

                    {/* Salary */}
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <div className="flex items-center text-gray-400">
                        <Wallet className="mr-2 h-5 w-5" />

                        <span className="text-sm">
                          Salary
                        </span>
                      </div>

                      <p className="mt-2 font-semibold text-navy">
                        {job.salary}
                      </p>

                    </div>

                    {/* Workers */}
                    <div className="rounded-2xl bg-gray-50 p-4">

                      <div className="flex items-center text-gray-400">
                        <Briefcase className="mr-2 h-5 w-5" />

                        <span className="text-sm">
                          Workers
                        </span>
                      </div>

                      <p className="mt-2 font-semibold text-navy">
                        {job.workersNeeded || 1} জন
                      </p>

                    </div>

                  </div>

                  {/* Description */}
                  <div className="mt-6">

                    <h3 className="font-bold text-navy">
                      কাজের বিবরণ
                    </h3>

                    <p className="mt-2 leading-7 text-gray-500">
                      {job.description ||
                        "এই কাজের জন্য দক্ষ ও অভিজ্ঞ কর্মী প্রয়োজন।"}
                    </p>

                  </div>

                  {/* Employer Accepted */}
                  {currentStatus === "accepted" && (
                    <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">

                      <div className="flex items-center gap-3">

                        <CheckCircle className="h-5 w-5 text-green-600" />

                        <div>
                          <p className="font-semibold text-green-700">
                            Employer Accepted
                          </p>

                          <p className="mt-1 text-sm text-green-600">
                            আপনি এখন কাজ শুরু করতে পারেন।
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Working */}
                  {currentStatus === "working" && (
                    <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">

                      <div className="flex items-center gap-3">

                        <PlayCircle className="h-5 w-5 text-blue-600" />

                        <div>
                          <p className="font-semibold text-blue-700">
                            কাজ চলছে
                          </p>

                          <p className="mt-1 text-sm text-blue-600">
                            এই Job-এর কাজ বর্তমানে চলছে।
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Completed */}
                  {currentStatus === "completed" && (
                    <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-4">

                      <div className="flex items-center gap-3">

                        <CheckCircle className="h-5 w-5 text-purple-600" />

                        <div>
                          <p className="font-semibold text-purple-700">
                            কাজ সম্পন্ন হয়েছে
                          </p>

                          <p className="mt-1 text-sm text-purple-600">
                            Employer confirmation-এর জন্য অপেক্ষা করুন।
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                    {/* Start Job */}
                    {currentStatus === "accepted" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleStartJob(application.id)
                        }
                        className="inline-flex items-center justify-center rounded-xl bg-orange px-5 py-3 font-semibold text-white transition hover:opacity-90"
                      >
                        <PlayCircle className="mr-2 h-5 w-5" />
                        কাজ শুরু করুন
                      </button>
                    )}

                    {/* Complete Job */}
                    {currentStatus === "working" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCompleteJob(application.id)
                        }
                        className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        কাজ সম্পন্ন করুন
                      </button>
                    )}

                    {/* Job Details */}
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-navy/10 px-5 py-3 font-semibold text-navy transition hover:bg-gray-50"
                    >
                      Job Details
                    </Link>

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
