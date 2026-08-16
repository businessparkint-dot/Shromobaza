import Link from "next/link";
import {
  MapPin,
  Wallet,
  Users,
  ArrowLeft,
  Briefcase,
} from "lucide-react";

import { jobs, employers } from "@/lib/database";

type PageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export default async function JobDetailsPage({
  params,
}: PageProps) {
  const { jobId } = await params;

  const job = jobs.find((item) => item.id === jobId);

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">

          <Link
            href="/jobs"
            className="inline-flex items-center text-sm font-medium text-orange"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            সব কাজ দেখুন
          </Link>

          <div className="mt-6 rounded-3xl border border-red-100 bg-white p-8 shadow-sm">

            <h1 className="text-3xl font-bold text-navy">
              কাজটি পাওয়া যায়নি
            </h1>

            <p className="mt-3 text-navy/60">
              এই Job আর available নেই অথবা ID সঠিক নয়।
            </p>

            <p className="mt-3 text-sm text-navy/40">
              Job ID: {jobId}
            </p>

            <Link
              href="/jobs"
              className="mt-6 inline-flex rounded-xl bg-orange px-5 py-3 font-semibold text-white"
            >
              সব কাজ দেখুন
            </Link>

          </div>

        </div>
      </main>
    );
  }

  const employer = employers.find(
    (item) => item.id === job.employerId
  );

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">

      <div className="mx-auto max-w-3xl">

        {/* Back */}

        <Link
          href="/jobs"
          className="inline-flex items-center text-sm font-medium text-orange"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          সব কাজ দেখুন
        </Link>

        {/* Job Card */}

        <div className="mt-6 rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">

          {/* Title */}

          <h1 className="text-3xl font-bold text-navy">
            {job.title}
          </h1>

          <p className="mt-2 text-lg font-semibold text-orange">
            {employer?.name || "Employer"}
          </p>

          {/* Job Information */}

          <div className="mt-6 space-y-3 text-navy/60">

            <p>
              <MapPin className="mr-2 inline h-5 w-5" />
              {job.location}
            </p>

            <p>
              <Wallet className="mr-2 inline h-5 w-5" />
              {job.salary}
            </p>

            <p>
              <Users className="mr-2 inline h-5 w-5" />
              প্রয়োজন: {job.workersNeeded || 1} জন
            </p>

            <p>
              <Briefcase className="mr-2 inline h-5 w-5" />
              ক্যাটাগরি: {job.category || "সাধারণ"}
            </p>

          </div>

          {/* Description */}

          <div className="mt-8">

            <h2 className="text-xl font-bold text-navy">
              কাজের বিবরণ
            </h2>

            <p className="mt-3 leading-7 text-navy/60">
              {job.description ||
                "এই কাজের জন্য দক্ষ ও অভিজ্ঞ কর্মী প্রয়োজন।"}
            </p>

          </div>

          {/* Requirements */}

          <div className="mt-8">

            <h2 className="text-xl font-bold text-navy">
              প্রয়োজনীয় যোগ্যতা
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-5 text-navy/60">
              <li>
                সংশ্লিষ্ট কাজে অভিজ্ঞতা থাকতে হবে
              </li>

              <li>
                সময়মতো কাজ সম্পন্ন করার সক্ষমতা থাকতে হবে
              </li>

              <li>
                দায়িত্বশীলভাবে কাজ করতে হবে
              </li>
            </ul>

          </div>

          {/* Apply */}

          <Link
            href={`/worker-application?jobId=${job.id}`}
            className="mt-10 flex h-12 w-full items-center justify-center rounded-xl bg-orange font-semibold text-white transition hover:opacity-90"
          >
            এই কাজে Apply করুন
          </Link>

        </div>

      </div>

    </main>
  );
}