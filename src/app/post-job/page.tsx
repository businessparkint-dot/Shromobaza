
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  MapPin,
  Wallet,
  Users,
  FileText,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

type PostedJob = {
  id: string;
  employerId: string;
  title: string;
  location: string;
  salary: string;
  workersNeeded: number;
  description: string;
  status: "open";
  createdAt: string;
};

const JOBS_STORAGE_KEY = "shromobazar_posted_jobs";

export default function PostJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [workersNeeded, setWorkersNeeded] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("কাজের নাম দিন।");
      return;
    }

    if (!workersNeeded.trim()) {
      setError("প্রয়োজনীয় কর্মী সংখ্যা দিন।");
      return;
    }

    if (!location.trim()) {
      setError("কাজের স্থান দিন।");
      return;
    }

    if (!salary.trim()) {
      setError("বেতন / পারিশ্রমিক দিন।");
      return;
    }

    if (!description.trim()) {
      setError("কাজের বিস্তারিত বিবরণ দিন।");
      return;
    }

    const workerCount = Number(workersNeeded);

    if (
      Number.isNaN(workerCount) ||
      workerCount <= 0
    ) {
      setError("কর্মী সংখ্যা সঠিকভাবে দিন।");
      return;
    }

    const newJob: PostedJob = {
      id: `job-${Date.now()}`,
      employerId: "employer-1",
      title: title.trim(),
      location: location.trim(),
      salary: salary.trim(),
      workersNeeded: workerCount,
      description: description.trim(),
      status: "open",
      createdAt: new Date().toISOString(),
    };

    try {
      const savedJobs = localStorage.getItem(
        JOBS_STORAGE_KEY
      );

      let existingJobs: PostedJob[] = [];

      if (savedJobs) {
        const parsed = JSON.parse(savedJobs);

        if (Array.isArray(parsed)) {
          existingJobs = parsed;
        }
      }

      const updatedJobs = [
        newJob,
        ...existingJobs,
      ];

      localStorage.setItem(
        JOBS_STORAGE_KEY,
        JSON.stringify(updatedJobs)
      );

      setSuccess(true);

      setTimeout(() => {
        router.push("/jobs");
      }, 1000);
    } catch {
      setError(
        "Job সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।"
      );
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl">

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-navy">
              Job সফলভাবে পোস্ট হয়েছে
            </h1>

            <p className="mt-3 text-gray-500">
              আপনার Job এখন Worker-রা দেখতে এবং Apply করতে পারবে।
            </p>

            <p className="mt-5 text-sm font-semibold text-orange">
              Jobs পেজে নেওয়া হচ্ছে...
            </p>

          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">

      <div className="mx-auto max-w-2xl">

        {/* Back */}

        <Link
          href="/employer-dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          Employer Dashboard
        </Link>

        {/* Card */}

        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">

          {/* Header */}

          <div>
            <h1 className="text-3xl font-bold text-navy">
              কাজের বিজ্ঞপ্তি পোস্ট করুন
            </h1>

            <p className="mt-2 text-navy/60">
              আপনার প্রয়োজন অনুযায়ী দক্ষ কর্মী খুঁজে নিন।
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Job Title */}

            <div>
              <label
                htmlFor="job-title"
                className="text-sm font-semibold text-navy"
              >
                কাজের নাম
              </label>

              <div className="relative mt-2">

                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-navy/40" />

                <input
                  id="job-title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"
                  placeholder="যেমন: রাজমিস্ত্রি প্রয়োজন"
                />

              </div>
            </div>

            {/* Workers */}

            <div>
              <label
                htmlFor="workers-needed"
                className="text-sm font-semibold text-navy"
              >
                প্রয়োজনীয় কর্মী সংখ্যা
              </label>

              <div className="relative mt-2">

                <Users className="absolute left-3 top-3 h-5 w-5 text-navy/40" />

                <input
                  id="workers-needed"
                  type="number"
                  min="1"
                  value={workersNeeded}
                  onChange={(event) =>
                    setWorkersNeeded(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"
                  placeholder="যেমন: ৫"
                />

              </div>
            </div>

            {/* Location */}

            <div>
              <label
                htmlFor="location"
                className="text-sm font-semibold text-navy"
              >
                কাজের স্থান
              </label>

              <div className="relative mt-2">

                <MapPin className="absolute left-3 top-3 h-5 w-5 text-navy/40" />

                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"
                  placeholder="যেমন: মিরপুর, ঢাকা"
                />

              </div>
            </div>

            {/* Salary */}

            <div>
              <label
                htmlFor="salary"
                className="text-sm font-semibold text-navy"
              >
                বেতন / পারিশ্রমিক
              </label>

              <div className="relative mt-2">

                <Wallet className="absolute left-3 top-3 h-5 w-5 text-navy/40" />

                <input
                  id="salary"
                  type="text"
                  value={salary}
                  onChange={(event) =>
                    setSalary(event.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"
                  placeholder="যেমন: ১২০০ টাকা/দিন"
                />

              </div>
            </div>

            {/* Description */}

            <div>
              <label
                htmlFor="description"
                className="text-sm font-semibold text-navy"
              >
                কাজের বিস্তারিত বিবরণ
              </label>

              <div className="relative mt-2">

                <FileText className="absolute left-3 top-3 h-5 w-5 text-navy/40" />

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"
                  placeholder="কাজের বিস্তারিত লিখুন..."
                />

              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-orange font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
            >
              Job Post করুন
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}