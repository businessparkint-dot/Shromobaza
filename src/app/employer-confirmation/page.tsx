"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle,
  Loader2,
  MapPin,
  Star,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

type Application = {
  id: string;
  status: string;
  worker_id: string;
  employer_id: string;
  job_id: string;
  job?: {
    id: string;
    title: string;
    location: string | null;
    salary: number | null;
    description: string | null;
  } | null;
  worker?: {
    id: string;
    profile_id: string | null;
    name: string | null;
    phone: string | null;
    location: string | null;
    category: string | null;
  } | null;
};

export default function EmployerConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const applicationId =
    searchParams.get("applicationId") ||
    (params.applicationId as string) ||
    "";

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  async function getToken() {
    if (!supabase) {
      throw new Error("Supabase configuration পাওয়া যায়নি।");
    }

    const { data, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    const token = data.session?.access_token;

    if (!token) {
      throw new Error("আপনি লগইন করা নেই।");
    }

    return token;
  }

  async function loadApplication() {
    if (!applicationId) {
      setError("Application ID পাওয়া যায়নি।");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(
        `/api/worker-dashboard?applicationId=${encodeURIComponent(
          applicationId
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      /*
       * Worker dashboard API সাধারণত নিজের worker-এর applications দেয়।
       * তাই application details-এর জন্য সরাসরি Supabase client দিয়ে
       * public-readable application data নেওয়া হচ্ছে না।
       *
       * Confirmation-এর মূল security check server-side
       * /api/worker-job-status route-এ হবে।
       */

      if (!response.ok) {
        throw new Error("Application তথ্য লোড করা যায়নি।");
      }

      const data = await response.json();

      const foundApplication = data.applications?.find(
        (item: any) => item.id === applicationId
      );

      if (foundApplication) {
        setApplication({
          id: foundApplication.id,
          status: foundApplication.status,
          worker_id: foundApplication.workerId,
          employer_id: foundApplication.employerId,
          job_id: foundApplication.jobId,
          job: foundApplication.job
            ? {
                id: foundApplication.job.id,
                title: foundApplication.job.title,
                location: foundApplication.job.location,
                salary: foundApplication.job.salary,
                description: foundApplication.job.description,
              }
            : null,
          worker: foundApplication.worker
            ? {
                id: foundApplication.worker.id,
                profile_id: foundApplication.worker.profileId,
                name: foundApplication.worker.name,
                phone: foundApplication.worker.phone,
                location: foundApplication.worker.location,
                category: foundApplication.worker.category,
              }
            : null,
        });

        if (foundApplication.status === "completed") {
          setConfirmed(true);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Application তথ্য লোড করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!applicationId) {
      setError("Application ID পাওয়া যায়নি।");
      return;
    }

    try {
      setConfirming(true);
      setError("");
      setSuccess("");

      const token = await getToken();

      const response = await fetch("/api/worker-job-status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationId,
          action: "employer_confirm",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "কাজ Confirm করা যায়নি।"
        );
      }

      setConfirmed(true);
      setSuccess(
        data?.message || "কাজ সফলভাবে Confirm হয়েছে।"
      );

      await loadApplication();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "কাজ Confirm করা যায়নি।"
      );
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-orange" />
          <p className="mt-4 text-gray-500">
            তথ্য লোড হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  const workerId =
    application?.worker_id ||
    application?.worker?.id ||
    "";

  const workerName =
    application?.worker?.name || "Worker";

  const jobTitle =
    application?.job?.title || "কাজ";

  const jobLocation =
    application?.job?.location ||
    application?.worker?.location ||
    "লোকেশন দেওয়া হয়নি";

  const salary = application?.job?.salary;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <Link
          href="/employer-dashboard"
          className="mb-6 inline-flex items-center text-sm font-medium text-navy hover:text-orange"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Employer Dashboard
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          {/* Header */}
          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              {confirmed ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Briefcase className="h-8 w-8 text-green-600" />
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold text-navy">
              Employer Confirmation
            </h1>

            <p className="mt-2 text-gray-500">
              Worker-এর সম্পন্ন করা কাজ যাচাই করে Confirm করুন।
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Application Information */}
          <div className="mt-8 rounded-2xl bg-gray-50 p-5">

            <h2 className="text-xl font-bold text-navy">
              কাজের তথ্য
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-5 w-5 text-orange" />
                <div>
                  <p className="text-xs text-gray-400">
                    কাজ
                  </p>
                  <p className="font-semibold text-navy">
                    {jobTitle}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-5 w-5 text-orange" />
                <div>
                  <p className="text-xs text-gray-400">
                    Worker
                  </p>
                  <p className="font-semibold text-navy">
                    {workerName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-orange" />
                <div>
                  <p className="text-xs text-gray-400">
                    লোকেশন
                  </p>
                  <p className="font-semibold text-navy">
                    {jobLocation}
                  </p>
                </div>
              </div>

              {salary !== null && salary !== undefined && (
                <div>
                  <p className="text-xs text-gray-400">
                    পারিশ্রমিক
                  </p>
                  <p className="font-semibold text-navy">
                    ৳{Number(salary).toLocaleString("en-BD")}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Confirmation */}
          {!confirmed ? (
            <div className="mt-8">

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">

                <h3 className="font-bold text-yellow-700">
                  কাজ সম্পন্ন হয়েছে
                </h3>

                <p className="mt-2 text-sm leading-6 text-yellow-700">
                  Worker কাজটি সম্পন্ন করেছে। কাজটি যাচাই করে
                  Confirm করলে application সম্পূর্ণ হবে এবং
                  Worker-কে Rating & Review দেওয়ার সুযোগ পাবেন।
                </p>

              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={confirming}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {confirming ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Confirm হচ্ছে...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    কাজ Confirm করুন
                  </>
                )}
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
              {workerId && (
                <Link
                  href={`/rate-worker/${workerId}?applicationId=${encodeURIComponent(
                    applicationId
                  )}`}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange px-6 py-4 font-semibold text-white transition hover:opacity-90"
                >
                  <Star
                    className="fill-white"
                    size={19}
                  />
                  Worker-কে Rating & Review দিন
                </Link>
              )}

              {/* Worker Profile */}
              {workerId && (
                <Link
                  href={`/workers/${workerId}`}
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-200 px-6 py-4 font-semibold text-navy transition hover:bg-gray-50"
                >
                  Worker Profile দেখুন
                </Link>
              )}

              <button
                type="button"
                onClick={() => router.push("/employer-dashboard")}
                className="mt-3 w-full rounded-xl border border-gray-200 px-6 py-4 font-semibold text-navy transition hover:bg-gray-50"
              >
                Employer Dashboard
              </button>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}
