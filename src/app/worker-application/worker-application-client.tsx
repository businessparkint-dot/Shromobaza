"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  MapPin,
  Send,
  UserRound,
} from "lucide-react";

import { jobs } from "@/lib/database";

const APPLICATIONS_KEY = "shromobazar_applications";

export default function WorkerApplicationClient() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const job = jobs.find((item) => item.id === jobId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!jobId || !job) return;

    const application = {
      id: `APP-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      workerName: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem(APPLICATIONS_KEY);

      let applications: typeof application[] = [];

      if (existing) {
        const parsed = JSON.parse(existing);

        if (Array.isArray(parsed)) {
          applications = parsed;
        }
      }

      applications.push(application);

      localStorage.setItem(
        APPLICATIONS_KEY,
        JSON.stringify(applications)
      );

      setSubmitted(true);
    } catch {
      alert("আবেদন সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।");
    }
  };

  if (!jobId || !job) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
            <Briefcase className="h-8 w-8 text-orange-500" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Job পাওয়া যায়নি
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            সঠিক Job নির্বাচন করে আবার Apply করুন।
          </p>

          <Link
            href="/jobs"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            সব কাজ দেখুন
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-9 w-9 text-green-500" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            আবেদন সফল হয়েছে
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            আপনার আবেদনটি সফলভাবে জমা হয়েছে। নিয়োগকর্তা
            আপনার আবেদন পর্যালোচনা করবেন।
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left">
            <p className="text-xs font-semibold text-slate-400">
              আবেদন করা Job
            </p>

            <p className="mt-1 font-bold text-slate-900">
              {job.title}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/worker-dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Worker Dashboard
            </Link>

            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              আরও কাজ দেখুন
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/jobs/${job.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Job Details-এ ফিরে যান
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[#081B3A] p-6 text-white sm:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-400/15 px-3 py-1 text-xs font-bold text-green-300">
              <CheckCircle className="h-4 w-4" />
              Apply করার সুযোগ আছে
            </span>

            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
              {job.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>

              <span className="inline-flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {job.salary}
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                কাজের জন্য আবেদন করুন
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                আপনার সঠিক তথ্য দিয়ে আবেদনটি জমা দিন।
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                আপনার নাম
              </label>

              <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 focus-within:border-orange-400">
                <UserRound className="mr-3 h-5 w-5 text-slate-400" />

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার পূর্ণ নাম"
                  className="h-12 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                মোবাইল নম্বর
              </label>

              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-800 outline-none transition focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                আবেদন সম্পর্কে কিছু বলুন
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="আপনার অভিজ্ঞতা বা কাজ সম্পর্কে সংক্ষেপে লিখুন..."
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 active:scale-[0.99]"
            >
              <Send className="h-5 w-5" />
              আবেদন জমা দিন
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}