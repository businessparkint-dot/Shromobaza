"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

type Worker = {
  id: string;
  name?: string;
  category?: string;
  location?: string;
  district?: string;
  rating?: number;
  review_count?: number;
};

export default function RateWorkerPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const workerId = String(params.id || "");
  const applicationId =
    searchParams.get("applicationId") || "";

  const [worker, setWorker] = useState<Worker | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadWorker = async () => {
      try {
        setLoading(true);
        setError("");

        if (!workerId) {
          throw new Error("Worker ID পাওয়া যায়নি।");
        }

        const response = await fetch(
          `/api/workers/${workerId}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Worker profile load করা যায়নি।"
          );
        }

        const source = data.worker || data;

        setWorker({
          id: source.id,
          name: source.name,
          category: source.category,
          location: source.location,
          district: source.district,
          rating: Number(source.rating || 0),
          review_count: Number(
            source.review_count || source.reviewCount || 0
          ),
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Worker profile load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    };

    loadWorker();
  }, [workerId]);

  const submitRating = async () => {
    try {
      setError("");
      setSuccess("");

      if (!applicationId) {
        setError(
          "এই Rating-এর সাথে কোনো completed application পাওয়া যায়নি।"
        );
        return;
      }

      if (rating < 1 || rating > 5) {
        setError("দয়া করে 1 থেকে 5 Star-এর মধ্যে Rating দিন।");
        return;
      }

      setSubmitting(true);

      if (!supabase) {
        throw new Error(
          "Supabase configuration পাওয়া যায়নি।"
        );
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "আপনার login session পাওয়া যায়নি।"
        );
      }

      const response = await fetch(
        "/api/worker-ratings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            applicationId,
            rating,
            review: review.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Rating সংরক্ষণ করা যায়নি।"
        );
      }

      setSuccess(
        "Rating ও Review সফলভাবে সংরক্ষণ হয়েছে।"
      );

      setTimeout(() => {
        router.push(`/workers/${workerId}`);
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Rating সংরক্ষণ করা যায়নি।"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" />
          Worker profile loading...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/employer-dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Employer Dashboard
        </Link>

        <div className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Star className="h-10 w-10 text-emerald-600" />
            </div>

            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Worker-কে Rating দিন
            </h1>

            <p className="mt-2 text-gray-500">
              আপনার কাজের অভিজ্ঞতা অন্য Employer-দের জন্যও গুরুত্বপূর্ণ।
            </p>
          </div>

          {worker && (
            <div className="mb-6 rounded-2xl border bg-gray-50 p-5">
              <h2 className="text-xl font-bold">
                {worker.name || "Worker"}
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                {worker.category || "Worker"}
              </p>

              <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {worker.location ||
                  worker.district ||
                  "Location নেই"}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              {success}
            </div>
          )}

          <div>
            <label className="mb-3 block text-sm font-bold text-gray-800">
              আপনার Rating
            </label>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => {
                const active =
                  value <=
                  (hoverRating || rating);

                return (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() =>
                      setHoverRating(value)
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    onClick={() =>
                      setRating(value)
                    }
                    className="rounded-lg p-1 transition-transform hover:scale-110"
                    aria-label={`${value} star`}
                  >
                    <Star
                      className={`h-10 w-10 ${
                        active
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {rating === 0
                ? "Star নির্বাচন করুন"
                : `${rating} / 5`}
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="review"
              className="mb-2 block text-sm font-bold text-gray-800"
            >
              Review
            </label>

            <textarea
              id="review"
              value={review}
              onChange={(event) =>
                setReview(event.target.value)
              }
              rows={5}
              maxLength={1000}
              placeholder="Worker-এর কাজের মান, সময়ানুবর্তিতা ও আচরণ সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {review.length}/1000
            </p>
          </div>

          <button
            type="button"
            disabled={
              submitting ||
              rating < 1 ||
              !applicationId
            }
            onClick={submitRating}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3.5 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                সংরক্ষণ হচ্ছে...
              </>
            ) : (
              <>
                <Star className="h-5 w-5" />
                Rating ও Review Submit করুন
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}