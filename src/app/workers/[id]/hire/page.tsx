"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquare,
  Phone,
  Wallet,
} from "lucide-react";

type Worker = {
  id: string;
  profileId?: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  category?: string;
  subCategory?: string;
  experience?: string;
  district?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  verified?: boolean;
};

type SupabaseSession = {
  access_token: string;
};

export default function HireWorkerPage() {
  const params = useParams();
  const router = useRouter();

  const workerId = Array.isArray(params?.id)
    ? params.id[0]
    : String(params?.id || "");

  const [worker, setWorker] = useState<Worker | null>(null);
  const [loadingWorker, setLoadingWorker] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");

  /*
   * Worker load
   */
  useEffect(() => {
    async function loadWorker() {
      if (!workerId) {
        setError("Worker ID পাওয়া যায়নি।");
        setLoadingWorker(false);
        return;
      }

      try {
        setLoadingWorker(true);
        setError("");

        const response = await fetch("/api/workers", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(
            data?.error || "Worker information load করা যায়নি।"
          );
        }

        const workers: Worker[] = Array.isArray(data.workers)
          ? data.workers
          : [];

        const foundWorker = workers.find(
          (item) => String(item.id) === String(workerId)
        );

        if (!foundWorker) {
          setError("এই Worker পাওয়া যায়নি।");
          setWorker(null);
          return;
        }

        setWorker(foundWorker);

        /*
         * Worker-এর location আগে থেকে থাকলে form-এ বসিয়ে দিই।
         */
        if (foundWorker.location || foundWorker.district) {
          setLocation(
            foundWorker.location || foundWorker.district || ""
          );
        }
      } catch (err) {
        console.error("LOAD WORKER ERROR:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Worker information load করা যায়নি।"
        );
      } finally {
        setLoadingWorker(false);
      }
    }

    loadWorker();
  }, [workerId]);

  /*
   * Supabase session থেকে access token নেওয়া
   *
   * এখানে browser-এর Supabase session endpoint ব্যবহার করা হচ্ছে।
   * আপনার existing authentication flow-এর cookie/session থাকলে
   * Supabase server session থেকে token পাওয়া যাবে।
   */
  async function getAccessToken(): Promise<string | null> {
    try {
      /*
       * প্রথমে Supabase browser client থাকলে সেটি ব্যবহার করার চেষ্টা।
       *
       * আপনার project-এ যদি src/lib/client.ts থেকে createClient export
       * করা থাকে, নিচের dynamic import সেটি ব্যবহার করবে।
       */
      const clientModule = await import("@/lib/client");

      const supabaseClient =
        (clientModule as any).supabase ||
        (clientModule as any).default;

      if (
        supabaseClient &&
        typeof supabaseClient.auth?.getSession === "function"
      ) {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        return session?.access_token || null;
      }
    } catch (clientError) {
      console.warn(
        "Supabase client session পাওয়া যায়নি:",
        clientError
      );
    }

    /*
     * Fallback:
     * যদি /lib/client.ts থেকে named/default client পাওয়া না যায়,
     * Supabase browser storage থেকে session খুঁজে বের করি।
     */
    try {
      const keys = Object.keys(window.localStorage);

      const supabaseAuthKey = keys.find(
        (key) =>
          key.startsWith("sb-") &&
          key.endsWith("-auth-token")
      );

      if (!supabaseAuthKey) {
        return null;
      }

      const rawSession = window.localStorage.getItem(
        supabaseAuthKey
      );

      if (!rawSession) {
        return null;
      }

      const parsed = JSON.parse(rawSession) as SupabaseSession;

      return parsed?.access_token || null;
    } catch (storageError) {
      console.warn(
        "Browser session read করা যায়নি:",
        storageError
      );

      return null;
    }
  }

  /*
   * Submit Hire Request
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!workerId) {
      setError("Worker ID পাওয়া যায়নি।");
      return;
    }

    if (!jobTitle.trim()) {
      setError("কাজের নাম দিন।");
      return;
    }

    if (!location.trim()) {
      setError("কাজের স্থান দিন।");
      return;
    }

    if (!salary.trim()) {
      setError("পারিশ্রমিক দিন।");
      return;
    }

    try {
      setSubmitting(true);

      /*
       * Logged-in user-এর Supabase access token
       */
      const accessToken = await getAccessToken();

      if (!accessToken) {
        setError(
          "আপনি Login করা নেই অথবা Login session পাওয়া যাচ্ছে না। আগে Login করুন।"
        );
        return;
      }

      /*
       * API route-এর expected field names:
       *
       * workerId
       * jobTitle
       * location
       * salary
       * message
       */
      const response = await fetch("/api/hire-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          workerId,
          jobTitle: jobTitle.trim(),
          location: location.trim(),
          salary: salary.trim(),
          message: message.trim(),
        }),
      });

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Hire Request API থেকে সঠিক response পাওয়া যায়নি।"
        );
      }

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.error || "Hire Request পাঠানো যায়নি।"
        );
      }

      setSuccess(
        data?.message ||
          "Hire Request সফলভাবে পাঠানো হয়েছে।"
      );

      /*
       * Form clear
       */
      setJobTitle("");
      setSalary("");
      setMessage("");

      /*
       * কিছুক্ষণ পরে applications/hire requests page-এ নেওয়া যেতে পারে।
       * আপাতত success message দেখাচ্ছি।
       */
    } catch (err) {
      console.error("HIRE SUBMIT ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Hire Request পাঠানো যায়নি।"
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * Loading
   */
  if (loadingWorker) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto flex max-w-3xl items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
          <div className="flex items-center gap-3 text-slate-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Worker information load হচ্ছে...</span>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error / worker not found
   */
  if (!worker) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href={
              workerId
                ? `/workers/${workerId}`
                : "/workers"
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Worker Profile-এ ফিরে যান
          </Link>

          <div className="rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              !
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              Worker পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              {error || "এই Worker-এর তথ্য পাওয়া যায়নি।"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back */}
        <Link
          href={`/workers/${worker.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Worker Profile-এ ফিরে যান
        </Link>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Worker Card */}
          <section className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-xl font-bold text-slate-700">
                {worker.avatarUrl ? (
                  <img
                    src={worker.avatarUrl}
                    alt={worker.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  worker.name?.charAt(0)?.toUpperCase() || "W"
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">
                    {worker.name}
                  </h1>

                  {worker.verified && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {worker.subCategory ||
                    worker.category ||
                    "দক্ষ কর্মী"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {(worker.phone || "").trim() && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{worker.phone}</span>
                </div>
              )}

              {(worker.location || worker.district || "").trim() && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>
                    {worker.location || worker.district}
                  </span>
                </div>
              )}

              {worker.experience && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
                  <span>{worker.experience}</span>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Worker ID
              </p>
              <p className="mt-1 break-all text-xs font-mono text-slate-700">
                {worker.id}
              </p>
            </div>
          </section>

          {/* Hire Form */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-900">
                {worker.name}-কে Hire করুন
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                কাজের তথ্য দিন। আপনার Hire Request সরাসরি এই
                Worker-এর কাছে যাবে।
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Job Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  কাজের নাম
                </label>

                <div className="relative">
                  <BriefcaseBusiness className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) =>
                      setJobTitle(e.target.value)
                    }
                    placeholder="যেমন: বাড়ি নির্মাণের কাজ"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  কাজের স্থান
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="যেমন: বাগেরহাট সদর"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Salary */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  পারিশ্রমিক
                </label>

                <div className="relative">
                  <Wallet className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    value={salary}
                    onChange={(e) =>
                      setSalary(e.target.value)
                    }
                    placeholder="যেমন: ১৫০০ টাকা/দিন"
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  অতিরিক্ত তথ্য
                  <span className="ml-1 font-normal text-slate-400">
                    (ঐচ্ছিক)
                  </span>
                </label>

                <div className="relative">
                  <MessageSquare className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />

                  <textarea
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    placeholder="কাজের বিস্তারিত, সময়কাল বা অন্য কোনো তথ্য লিখুন..."
                    rows={5}
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Request পাঠানো হচ্ছে...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Hire Request পাঠান
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />

              <p className="text-xs leading-5 text-slate-500">
                Request পাঠানোর পর Worker আপনার কাজের
                বিস্তারিত দেখতে পারবে এবং পরবর্তী পদক্ষেপ নেওয়া
                যাবে।
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}