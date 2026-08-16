"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
} from "lucide-react";

import {
  applications,
  jobs,
  employers,
} from "@/lib/database";

export default function WorkerApplicationsPage() {
  const workerId = "worker-1";

  const myApplications = applications.filter(
    (application) =>
      application.workerId === workerId
  );

  const getJob = (jobId: string) => {
    return jobs.find(
      (job) => job.id === jobId
    );
  };

  const getEmployer = (employerId: string) => {
    return employers.find(
      (employer) => employer.id === employerId
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">

      <div className="mx-auto max-w-5xl px-4">

        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm font-medium text-navy"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home
        </Link>


        <div className="mb-8">

          <h1 className="text-3xl font-bold text-navy">
            My Applications
          </h1>

          <p className="mt-2 text-gray-500">
            আপনি যেসব কাজে আবেদন করেছেন
            সেগুলোর বর্তমান অবস্থা এখানে দেখতে পারবেন।
          </p>

        </div>


        <div className="space-y-5">

          {myApplications.length === 0 ? (

            <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

              <Clock className="mx-auto h-12 w-12 text-gray-300" />

              <h2 className="mt-4 text-xl font-bold text-navy">
                এখনো কোনো Application নেই
              </h2>

              <p className="mt-2 text-gray-500">
                কোনো Job-এ Apply করলে এখানে দেখা যাবে।
              </p>

              <Link
                href="/jobs"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-orange px-6 font-semibold text-white"
              >
                Job খুঁজুন
              </Link>

            </div>

          ) : (

            myApplications.map((application) => {

              const job = getJob(
                application.jobId
              );

              if (!job) {
                return null;
              }

              const employer = getEmployer(
                job.employerId
              );

              return (

                <div
                  key={application.id}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex-1">

                      <h2 className="text-xl font-bold text-navy">
                        {job.title}
                      </h2>


                      {employer && (

                        <p className="mt-2 flex items-center font-medium text-orange">

                          <Building2 className="mr-2 h-4 w-4" />

                          {employer.name}

                        </p>

                      )}


                      <div className="mt-4 space-y-2 text-sm text-gray-500">

                        <p>

                          <MapPin className="mr-2 inline h-4 w-4" />

                          {job.location}

                        </p>


                        <p>

                          <Wallet className="mr-2 inline h-4 w-4" />

                          {job.salary}

                        </p>

                      </div>

                    </div>


                    <div>

                      {application.status ===
                        "pending" && (

                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-600">

                          <Clock className="mr-2 h-4 w-4" />

                          Pending

                        </span>

                      )}


                      {application.status ===
                        "accepted" && (

                        <span className="inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">

                          <CheckCircle className="mr-2 h-4 w-4" />

                          Accepted

                        </span>

                      )}


                      {application.status ===
                        "rejected" && (

                        <span className="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">

                          <XCircle className="mr-2 h-4 w-4" />

                          Rejected

                        </span>

                      )}

                    </div>

                  </div>


                  <div className="mt-6 border-t pt-5">

                    {application.status ===
                      "pending" && (

                      <p className="text-sm text-yellow-600">
                        আপনার আবেদনটি Employer-এর
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

                </div>

              );
            })

          )}

        </div>

      </div>

    </main>
  );
}