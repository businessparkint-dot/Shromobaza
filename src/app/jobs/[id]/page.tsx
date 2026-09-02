"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle,
  FileText,
  MapPin,
  Users,
  Wallet,
} from "lucide-react";

type Job = {
  id: string;
  employer_id: string;
  title: string;
  location: string | null;
  salary: string | null;
  workers_needed: number | null;
  description: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  employers?: {
    id: string;
    profile_id: string;
    employer_type: string | null;
    company_name: string | null;
    description: string | null;
  } | null;
};

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/jobs/${encodeURIComponent(id)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.details || data?.error || "Job load failed."
          );
        }

        setJob(data.job ?? null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Job load failed."
        );
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <Briefcase className="mx-auto h-10 w-10 text-orange-500" />
          <p className="mt-4 text-slate-500">
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
            <Briefcase className="h-8 w-8 text-orange-500" />
          </div>

          <h1 className="mt-6 text-2xl font-black text-slate-900">
            কাজটি পাওয়া যায়নি
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error ||
              "এই Job আর available নেই অথবা ID সঠিক নয়।"}
          </p>

          <p className="mt-3 break-all text-xs text-slate-400">
            Job ID: {id}
          </p>

          <Link
            href="/jobs"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            সব কাজ দেখুন
          </Link>
        </div>
      </main>
    );
  }

  const employerName =
    job.employers?.company_name || "Employer";

  const status =
    job.status === "open"
      ? "Available"
      : job.status || "Job";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-orange-500"
        >
          <ArrowLeft className="h-4 w-4" />
          সব কাজ দেখুন
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">

          {/* HERO */}
          <div className="bg-[#081B3A] px-6 py-8 text-white sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-400/15 px-3 py-1.5 text-xs font-bold text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  {status}
                </span>

                <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                  {job.title}
                </h1>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {job.location || "স্থান উল্লেখ নেই"}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    {job.salary || "পারিশ্রমিক উল্লেখ নেই"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 px-6 py-5 text-center">
                <Users className="mx-auto h-6 w-6 text-orange-300" />

                <p className="mt-1 text-3xl font-black">
                  {job.workers_needed || 1}
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
              <section className="rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 border-b border-slate-100 p-5">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>

                  <h2 className="text-xl font-black text-slate-900">
                    কাজের বিস্তারিত
                  </h2>
                </div>

                <div className="p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                    {job.description ||
                      "এই কাজের বিস্তারিত বিবরণ দেওয়া হয়নি।"}
                  </p>
                </div>
              </section>

              {/* INFORMATION */}
              <section className="rounded-2xl bg-slate-50 p-5">
                <h2 className="font-black text-slate-900">
                  কাজের তথ্য
                </h2>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-400">
                        স্থান
                      </p>
                      <p className="font-bold text-slate-800">
                        {job.location || "উল্লেখ নেই"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Wallet className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-400">
                        পারিশ্রমিক
                      </p>
                      <p className="font-bold text-slate-800">
                        {job.salary || "উল্লেখ নেই"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-400">
                        প্রয়োজন
                      </p>
                      <p className="font-bold text-slate-800">
                        {job.workers_needed || 1} জন
                      </p>
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* EMPLOYER */}
            <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Employer
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-lg font-black text-white">
                  {employerName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-black text-slate-900">
                    {employerName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {job.employers?.employer_type ||
                      "নিয়োগকর্তা"}
                  </p>
                </div>
              </div>

              {job.employers?.description && (
                <p className="mt-5 text-sm leading-6 text-slate-500">
                  {job.employers.description}
                </p>
              )}

              <div className="my-6 border-t border-slate-100" />

              <Link
                href={`/worker-application?jobId=${encodeURIComponent(
                  job.id
                )}`}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 font-black text-white transition hover:bg-orange-600"
              >
                এই কাজে Apply করুন
              </Link>

              <Link
                href="/jobs"
                className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 px-5 font-bold text-slate-800 transition hover:bg-slate-50"
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