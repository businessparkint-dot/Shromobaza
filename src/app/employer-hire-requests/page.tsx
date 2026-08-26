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
  Phone,
  MessageCircle,
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

type WorkerInfo = {
  id: string;
  name?: string;
  role?: string;
  phone?: string;
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

        if (Array.isArray(parsed)) {
          setRequests(parsed);
        } else {
          setRequests([]);
        }
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

  const getWorker = (workerId: string): WorkerInfo | undefined => {
    return workers.find(
      (item) => item.id === workerId
    ) as WorkerInfo | undefined;
  };

  const getPhone = (workerId: string) => {
    const worker = getWorker(workerId);
    return worker?.phone?.trim() || "";
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Home এ ফিরে যান
        </Link>

        {/* Header */}
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
            <Briefcase className="h-4 w-4" />
            Hiring
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#07152d] sm:text-4xl">
            My Hire Requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            আপনার পাঠানো Hire Request এবং Worker-এর সঙ্গে যোগাযোগের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* Empty */}
        {requests.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Briefcase className="h-7 w-7 text-slate-400" />
            </div>

            <h2 className="mt-5 text-xl font-black text-[#07152d]">
              কোনো Hire Request নেই
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              কোনো Worker-কে Hire Request পাঠালে তার বর্তমান Status এখানে দেখা যাবে।
            </p>

            <Link
              href="/workers"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              <Briefcase className="h-4 w-4" />
              Worker খুঁজুন
            </Link>

          </div>
        ) : (

          <div className="space-y-5">

            {requests.map((request) => {
              const worker = getWorker(request.workerId);
              const phone = getPhone(request.workerId);

              return (
                <div
                  key={request.id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
                >

                  {/* Worker Header */}
                  <div className="border-b border-slate-100 p-5 sm:p-6">

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                      {/* Worker */}
                      <div className="flex items-start gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#07152d] text-lg font-black text-white">
                          {worker?.name?.charAt(0)?.toUpperCase() || "W"}
                        </div>

                        <div className="min-w-0">

                          <h2 className="text-lg font-black text-[#07152d]">
                            {worker?.name || "Worker"}
                          </h2>

                          <p className="mt-1 text-sm font-bold text-orange-500">
                            {worker?.role || "Worker"}
                          </p>

                          {/* Phone */}
                          {phone && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">

                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                                <Phone className="h-3.5 w-3.5 text-green-600" />
                                {phone}
                              </span>

                              <a
                                href={`tel:${phone}`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-black text-white transition hover:bg-green-700"
                              >
                                <Phone className="h-3.5 w-3.5" />
                                Call
                              </a>

                              <Link
                                href="/chat"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#07152d] px-3 py-2 text-xs font-black text-white transition hover:bg-slate-800"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                Chat
                              </Link>

                            </div>
                          )}

                        </div>
                      </div>

                      {/* Status */}
                      <div className="shrink-0">

                        {request.status === "pending" && (
                          <span className="inline-flex items-center rounded-full bg-yellow-50 px-4 py-2 text-xs font-black text-yellow-600">
                            <Clock className="mr-2 h-4 w-4" />
                            Pending
                          </span>
                        )}

                        {request.status === "accepted" && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-4 py-2 text-xs font-black text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accepted
                          </span>
                        )}

                        {request.status === "rejected" && (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600">
                            <XCircle className="mr-2 h-4 w-4" />
                            Rejected
                          </span>
                        )}

                      </div>

                    </div>
                  </div>

                  {/* Job Information */}
                  <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <Briefcase className="h-5 w-5 text-orange-500" />

                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        কাজের নাম
                      </p>

                      <p className="mt-1 text-sm font-black text-[#07152d]">
                        {request.jobTitle}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <MapPin className="h-5 w-5 text-orange-500" />

                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        কাজের ঠিকানা
                      </p>

                      <p className="mt-1 text-sm font-black text-[#07152d]">
                        {request.location}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <Wallet className="h-5 w-5 text-orange-500" />

                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        পারিশ্রমিক
                      </p>

                      <p className="mt-1 text-sm font-black text-[#07152d]">
                        {request.salary}
                      </p>
                    </div>

                  </div>

                  {/* Message */}
                  <div className="mx-5 mb-5 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:mx-6 sm:mb-6">

                    <p className="text-xs font-black text-[#07152d]">
                      কাজের বিবরণ
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
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