"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Wallet,
  Briefcase,
} from "lucide-react";

import { workers } from "@/lib/database";

const STORAGE_KEY = "shromobazar_hire_requests";

type HireRequest = {
  id: string;
  workerId: string;
  employerId: string;
  jobTitle: string;
  location: string;
  salary: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
};

export default function EmployerHireRequestsPage() {
  const [requests, setRequests] = useState<HireRequest[]>([]);

  useEffect(() => {
    const loadRequests = () => {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setRequests([]);
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        setRequests(parsed);
      } catch {
        setRequests([]);
      }
    };

    loadRequests();

    window.addEventListener("storage", loadRequests);

    return () => {
      window.removeEventListener("storage", loadRequests);
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Back */}

        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm font-medium text-navy"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Home এ ফিরে যান
        </Link>

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">
            My Hire Requests
          </h1>

          <p className="mt-2 text-gray-500">
            Worker-দের পাঠানো আপনার Hire Request-এর বর্তমান Status এখানে দেখুন।
          </p>
        </div>

        {/* Empty */}

        {requests.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

            <Briefcase className="mx-auto h-12 w-12 text-gray-300" />

            <h2 className="mt-4 text-xl font-bold text-navy">
              কোনো Hire Request নেই
            </h2>

            <p className="mt-2 text-gray-500">
              কোনো Worker-কে Hire Request পাঠালে এখানে দেখা যাবে।
            </p>

            <Link
              href="/workers"
              className="mt-6 inline-flex rounded-xl bg-orange px-6 py-3 font-semibold text-white"
            >
              Worker খুঁজুন
            </Link>

          </div>
        ) : (

          <div className="space-y-5">

            {requests.map((request) => {

              const worker = workers.find(
                (item) => item.id === request.workerId
              );

              return (
                <div
                  key={request.id}
                  className="rounded-3xl bg-white p-6 shadow-sm"
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    {/* Worker */}

                    <div className="flex items-start gap-4">

                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy text-xl font-bold text-white">
                        {worker?.name?.charAt(0) || "W"}
                      </div>

                      <div>

                        <h2 className="text-xl font-bold text-navy">
                          {worker?.name || "Worker"}
                        </h2>

                        <p className="mt-1 font-medium text-orange">
                          {worker?.role || "Worker"}
                        </p>

                      </div>

                    </div>

                    {/* Status */}

                    <div>

                      {request.status === "pending" && (
                        <span className="inline-flex items-center rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-600">
                          <Clock className="mr-2 h-4 w-4" />
                          Pending
                        </span>
                      )}

                      {request.status === "accepted" && (
                        <span className="inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-600">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accepted
                        </span>
                      )}

                      {request.status === "rejected" && (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                          <XCircle className="mr-2 h-4 w-4" />
                          Rejected
                        </span>
                      )}

                    </div>

                  </div>

                  {/* Job Information */}

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl bg-slate-50 p-4">

                      <Briefcase className="h-5 w-5 text-orange" />

                      <p className="mt-2 text-xs text-gray-500">
                        কাজের নাম
                      </p>

                      <p className="mt-1 font-semibold text-navy">
                        {request.jobTitle}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">

                      <MapPin className="h-5 w-5 text-orange" />

                      <p className="mt-2 text-xs text-gray-500">
                        কাজের ঠিকানা
                      </p>

                      <p className="mt-1 font-semibold text-navy">
                        {request.location}
                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">

                      <Wallet className="h-5 w-5 text-orange" />

                      <p className="mt-2 text-xs text-gray-500">
                        পারিশ্রমিক
                      </p>

                      <p className="mt-1 font-semibold text-navy">
                        {request.salary}
                      </p>

                    </div>

                  </div>

                  {/* Message */}

                  <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-4">

                    <p className="text-sm font-semibold text-navy">
                      কাজের বিবরণ
                    </p>

                    <p className="mt-2 leading-7 text-gray-600">
                      {request.message}
                    </p>

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