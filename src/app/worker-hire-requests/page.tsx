"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  BriefcaseBusiness,
} from "lucide-react";

import { hireRequests, workers } from "@/lib/database";

type HireRequestStatus = "pending" | "accepted" | "rejected";

type HireRequest = {
  id: string;
  workerId: string;
  employerId: string;
  jobTitle: string;
  location: string;
  salary: string;
  message: string;
  status: HireRequestStatus;
};

const STORAGE_KEY = "shromobazar_hire_requests";

export default function WorkerHireRequestsPage() {
  const workerId = "worker-1";

  const [requests, setRequests] = useState<HireRequest[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch {
        setRequests(
          hireRequests.filter(
            (request) => request.workerId === workerId
          )
        );
      }
    } else {
      setRequests(
        hireRequests.filter(
          (request) => request.workerId === workerId
        )
      );
    }
  }, []);

  const saveRequests = (updatedRequests: HireRequest[]) => {
    setRequests(updatedRequests);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedRequests)
    );
  };

  const handleAccept = (requestId: string) => {
    const updatedRequests = requests.map((request) =>
      request.id === requestId
        ? {
            ...request,
            status: "accepted" as const,
          }
        : request
    );

    saveRequests(updatedRequests);
  };

  const handleReject = (requestId: string) => {
    const updatedRequests = requests.map((request) =>
      request.id === requestId
        ? {
            ...request,
            status: "rejected" as const,
          }
        : request
    );

    saveRequests(updatedRequests);
  };

  const myRequests = requests.filter(
    (request) => request.workerId === workerId
  );

  const worker = workers.find(
    (item) => item.id === workerId
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10">

        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm font-medium text-navy"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home এ ফিরে যান
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-navy">
              Hire Requests
            </h1>

            <p className="mt-2 text-gray-500">
              Employer আপনার কাছে যে Hire Request পাঠিয়েছে
              সেগুলো এখানে দেখতে পারবেন।
            </p>
          </div>

          {/* Main My Jobs Button */}
          <Link
            href="/worker-my-jobs"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-orange px-6 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <BriefcaseBusiness className="mr-2 h-5 w-5" />
            আমার কাজ
          </Link>

        </div>

        {/* Worker Info */}
        {worker && (
          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Worker
            </p>

            <h2 className="mt-1 text-xl font-bold text-navy">
              {worker.name}
            </h2>

            <p className="mt-1 text-orange">
              {worker.role}
            </p>
          </div>
        )}

        {/* Requests */}
        {myRequests.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <Clock className="mx-auto h-12 w-12 text-gray-300" />

            <h2 className="mt-4 text-xl font-bold text-navy">
              কোনো Hire Request নেই
            </h2>

            <p className="mt-2 text-gray-500">
              Employer Hire Request পাঠালে এখানে দেখা যাবে।
            </p>

          </div>
        ) : (

          <div className="space-y-6">

            {myRequests.map((request) => (
              <div
                key={request.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >

                {/* Request Header */}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <h2 className="text-2xl font-bold text-navy">
                      {request.jobTitle}
                    </h2>

                    <div className="mt-4 space-y-2 text-gray-500">

                      <p>
                        <MapPin className="mr-2 inline h-4 w-4" />
                        {request.location}
                      </p>

                      <p>
                        <Briefcase className="mr-2 inline h-4 w-4" />
                        {request.salary}
                      </p>

                    </div>
                  </div>

                  {/* Status */}
                  {request.status === "pending" && (
                    <span className="inline-flex w-fit items-center rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-600">
                      <Clock className="mr-2 h-4 w-4" />
                      Pending
                    </span>
                  )}

                  {request.status === "accepted" && (
                    <span className="inline-flex w-fit items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Accepted
                    </span>
                  )}

                  {request.status === "rejected" && (
                    <span className="inline-flex w-fit items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                      <XCircle className="mr-2 h-4 w-4" />
                      Rejected
                    </span>
                  )}

                </div>

                {/* Employer Message */}
                <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                  <p className="text-sm font-semibold text-navy">
                    Employer-এর Message
                  </p>

                  <p className="mt-2 leading-7 text-gray-600">
                    {request.message}
                  </p>

                </div>

                {/* Pending Actions */}
                {request.status === "pending" && (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                    <button
                      type="button"
                      onClick={() =>
                        handleAccept(request.id)
                      }
                      className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-green-600 px-6 font-semibold text-white transition hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Hire Request Accept
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleReject(request.id)
                      }
                      className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-red-200 bg-white px-6 font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <XCircle className="mr-2 h-5 w-5" />
                      Reject
                    </button>

                  </div>
                )}

                {/* Accepted */}
                {request.status === "accepted" && (
                  <div className="mt-6 rounded-2xl bg-green-50 p-5 text-green-700">

                    <div className="flex items-center font-semibold">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      আপনি এই Hire Request গ্রহণ করেছেন।
                    </div>

                    <p className="mt-2 text-sm">
                      আপনার কাজটি My Jobs-এ পাওয়া যাবে।
                    </p>

                  </div>
                )}

                {/* Rejected */}
                {request.status === "rejected" && (
                  <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-700">

                    <div className="flex items-center font-semibold">
                      <XCircle className="mr-2 h-5 w-5" />
                      আপনি এই Hire Request Reject করেছেন।
                    </div>

                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}