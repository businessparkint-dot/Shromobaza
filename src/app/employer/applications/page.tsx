"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";

import {
  applications,
  jobs,
  workers,
} from "@/lib/database";

export default function EmployerApplicationsPage() {
  const [applicationList, setApplicationList] = useState(
    applications
  );

  const job = jobs[0];

  const getWorker = (workerId: string) => {
    return workers.find(
      (worker) => worker.id === workerId
    );
  };

  const handleStatus = (
    applicationId: string,
    status: "accepted" | "rejected"
  ) => {
    const updatedApplications = applicationList.map(
      (application) =>
        application.id === applicationId
          ? {
              ...application,
              status,
            }
          : application
    );

    setApplicationList(updatedApplications);

    const databaseApplication = applications.find(
      (application) =>
        application.id === applicationId
    );

    if (databaseApplication) {
      databaseApplication.status = status;
    }
  };

  const jobApplications = applicationList.filter(
    (application) =>
      application.jobId === job.id
  );

  return (
    <main className="min-h-screen bg-gray-50 py-10">

      <div className="mx-auto max-w-5xl px-4">

        <Link
          href="/employer"
          className="mb-6 inline-flex items-center text-sm font-medium text-navy"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Employer Dashboard
        </Link>


        <div className="mb-8">

          <h1 className="text-3xl font-bold text-navy">
            Job Applications
          </h1>

          <p className="mt-2 text-gray-500">
            আপনার পোস্ট করা কাজে যারা আবেদন করেছে
            তাদের তালিকা।
          </p>

        </div>


        <div className="rounded-3xl bg-white p-6 shadow-sm">

          <div className="border-b pb-5">

            <h2 className="text-xl font-bold text-navy">
              {job.title}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              মোট আবেদন: {jobApplications.length} জন
            </p>

          </div>


          <div className="mt-6 space-y-4">

            {jobApplications.length === 0 ? (

              <div className="py-12 text-center">

                <User className="mx-auto h-10 w-10 text-gray-300" />

                <h3 className="mt-3 font-semibold text-navy">
                  এখনো কোনো Application নেই
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Worker আবেদন করলে এখানে দেখা যাবে।
                </p>

              </div>

            ) : (

              jobApplications.map((application) => {

                const worker = getWorker(
                  application.workerId
                );

                if (!worker) {
                  return null;
                }

                return (

                  <div
                    key={application.id}
                    className="rounded-2xl border border-navy/10 p-5"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      <div className="flex gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-xl font-bold text-white">
                          {worker.name.charAt(0)}
                        </div>


                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="font-bold text-navy">
                              {worker.name}
                            </h3>

                            {worker.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}

                          </div>


                          <p className="mt-1 font-medium text-orange">
                            {worker.role}
                          </p>


                          <p className="mt-1 flex items-center text-sm text-gray-500">

                            <MapPin className="mr-1 h-4 w-4" />

                            {worker.location}

                          </p>


                          <div className="mt-2 flex flex-wrap gap-2">

                            {worker.skills.map(
                              (skill) => (

                                <span
                                  key={skill}
                                  className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                                >
                                  {skill}
                                </span>

                              )
                            )}

                          </div>

                        </div>

                      </div>


                      <div className="flex flex-col gap-3 sm:flex-row">

                        <Link
                          href={`/workers?worker=${worker.id}`}
                          className="inline-flex h-10 items-center justify-center rounded-xl border border-navy/15 px-4 text-sm font-medium text-navy"
                        >
                          Profile দেখুন
                        </Link>


                        {application.status ===
                          "pending" && (

                          <>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatus(
                                  application.id,
                                  "accepted"
                                )
                              }
                              className="inline-flex h-10 items-center justify-center rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Accept
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleStatus(
                                  application.id,
                                  "rejected"
                                )
                              }
                              className="inline-flex h-10 items-center justify-center rounded-xl bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </button>

                          </>

                        )}

                      </div>

                    </div>


                    <div className="mt-4 border-t pt-4">

                      {application.status ===
                        "pending" && (

                        <div className="flex items-center gap-2 text-sm text-yellow-600">

                          <Clock className="h-4 w-4" />

                          Application Status:

                          <span className="font-semibold">
                            Pending
                          </span>

                        </div>

                      )}


                      {application.status ===
                        "accepted" && (

                        <div className="flex items-center gap-2 text-sm text-green-600">

                          <CheckCircle className="h-4 w-4" />

                          Application Status:

                          <span className="font-semibold">
                            Accepted
                          </span>

                        </div>

                      )}


                      {application.status ===
                        "rejected" && (

                        <div className="flex items-center gap-2 text-sm text-red-600">

                          <XCircle className="h-4 w-4" />

                          Application Status:

                          <span className="font-semibold">
                            Rejected
                          </span>

                        </div>

                      )}

                    </div>

                  </div>

                );
              })

            )}

          </div>

        </div>

      </div>

    </main>
  );
}