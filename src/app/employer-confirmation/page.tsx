"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  Building2,
  Briefcase,
  Star,
} from "lucide-react";

type PageProps = {
  searchParams: Promise<{
    workerId?: string;
    jobId?: string;
  }>;
};

export default function EmployerConfirmationPage({
  searchParams,
}: PageProps) {
  const [confirmed, setConfirmed] = useState(false);

  const params = use(searchParams);

  const workerId = params.workerId || "worker-001";
  const jobId = params.jobId || "job-001";

  const handleConfirm = () => {
    setConfirmed(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Back */}

        <Link
          href="/my-jobs"
          className="mb-6 inline-flex items-center text-sm font-medium text-navy hover:text-orange"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          My Jobs
        </Link>

        {/* Main Card */}

        <div className="rounded-3xl bg-white p-8 shadow-sm">

          {/* Header */}

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="mt-5 text-3xl font-bold text-navy">
              Employer Confirmation
            </h1>

            <p className="mt-2 text-gray-500">
              কাজটি শেষ হয়েছে। Worker-এর কাজ যাচাই করে Confirm করুন।
            </p>

          </div>

          {/* Job Information */}

          <div className="mt-8 rounded-2xl bg-gray-50 p-5">

            <h2 className="text-xl font-bold text-navy">
              রাজমিস্ত্রি প্রয়োজন
            </h2>

            <p className="mt-3 flex items-center text-gray-500">
              <Building2 className="mr-2 h-5 w-5" />
              Construction Company
            </p>

            <p className="mt-3 text-gray-500">
              মিরপুর, ঢাকা
            </p>

            <p className="mt-2 font-semibold text-navy">
              ৳১২০০ / দিন
            </p>

          </div>

          {/* Before Confirmation */}

          {!confirmed ? (
            <div className="mt-8">

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                <h3 className="font-bold text-yellow-700">
                  কাজ সম্পন্ন হয়েছে
                </h3>

                <p className="mt-2 text-sm leading-6 text-yellow-600">
                  Worker কাজটি সম্পন্ন করেছে।
                  কাজটি যাচাই করে Confirm করলে Worker-কে
                  Rating & Review দেওয়ার সুযোগ পাবেন।
                </p>

              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700"
              >
                <CheckCircle className="h-5 w-5" />
                কাজ Confirm করুন
              </button>

            </div>
          ) : (

            /* After Confirmation */

            <div className="mt-8">

              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

                <div className="flex items-center gap-3">

                  <CheckCircle className="h-7 w-7 text-green-600" />

                  <div>

                    <h3 className="font-bold text-green-700">
                      কাজ Confirm হয়েছে
                    </h3>

                    <p className="mt-1 text-sm text-green-600">
                      Job successfully completed.
                    </p>

                  </div>

                </div>

              </div>

              {/* Rating */}

              <Link
                href={`/rate-worker/${workerId}?jobId=${jobId}`}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange px-6 py-4 font-semibold text-white transition hover:opacity-90"
              >
                <Star
                  className="fill-white"
                  size={19}
                />
                Worker-কে Rating & Review দিন
              </Link>

              {/* Worker Profile */}

              <Link
                href={`/workers/${workerId}`}
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-200 px-6 py-4 font-semibold text-navy transition hover:bg-gray-50"
              >
                Worker Profile দেখুন
              </Link>

            </div>
          )}

        </div>

      </div>
    </main>
  );
}