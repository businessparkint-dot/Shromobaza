
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Star,
  UserRound,
} from "lucide-react";

import { workers } from "@/lib/database";

const REVIEWS_STORAGE_KEY =
  "shromobazar_worker_reviews";

type WorkerReview = {
  id: string;
  workerId: string;
  employerId: string;
  rating: number;
  review: string;
  createdAt: string;
};

export default function RateWorkerPage() {
  const params = useParams();
  const router = useRouter();

  const workerId = String(params.id);

  const worker = workers.find(
    (item) => item.id === workerId
  );

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!worker) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl">

          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

            <UserRound className="mx-auto h-14 w-14 text-gray-300" />

            <h1 className="mt-5 text-2xl font-bold text-navy">
              Worker পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-gray-500">
              Worker ID সঠিক নয় অথবা Worker আর available নেই।
            </p>

            <Link
              href="/workers"
              className="mt-6 inline-flex rounded-xl bg-orange px-6 py-3 font-semibold text-white"
            >
              সব Worker দেখুন
            </Link>

          </div>

        </div>
      </main>
    );
  }

  const handleSubmit = () => {
    setError("");

    if (rating === 0) {
      setError(
        "অনুগ্রহ করে ১ থেকে ৫ Star-এর মধ্যে একটি Rating দিন।"
      );
      return;
    }

    if (!review.trim()) {
      setError(
        "অনুগ্রহ করে আপনার Review লিখুন।"
      );
      return;
    }

    if (review.trim().length < 2) {
      setError(
        "Review একটু বিস্তারিত লিখুন।"
      );
      return;
    }

    const newReview: WorkerReview = {
      id: `review-${Date.now()}`,
      workerId,
      employerId: "employer-1",
      rating,
      review: review.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const savedReviews =
        localStorage.getItem(
          REVIEWS_STORAGE_KEY
        );

      let existingReviews: WorkerReview[] = [];

      if (savedReviews) {
        const parsed =
          JSON.parse(savedReviews);

        if (Array.isArray(parsed)) {
          existingReviews = parsed;
        }
      }

      const updatedReviews = [
        ...existingReviews,
        newReview,
      ];

      localStorage.setItem(
        REVIEWS_STORAGE_KEY,
        JSON.stringify(updatedReviews)
      );

      setSuccess(true);

      setTimeout(() => {
        router.push(
          `/workers/${workerId}`
        );
      }, 1200);
    } catch {
      setError(
        "Rating সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।"
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
              Rating সফল হয়েছে
            </h1>

            <p className="mt-3 text-gray-500">
              {worker.name}-এর জন্য আপনার Rating & Review সফলভাবে সংরক্ষণ করা হয়েছে।
            </p>

            <div className="mt-6 rounded-2xl bg-gray-50 p-5">

              <p className="text-sm font-semibold text-gray-500">
                আপনার Rating
              </p>

              <div className="mt-3 flex justify-center gap-1">
                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-6 w-6 ${
                      index < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-4 font-semibold text-navy">
                {review}
              </p>

            </div>

            <p className="mt-5 text-sm font-semibold text-orange">
              Worker Profile-এ নেওয়া হচ্ছে...
            </p>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="mx-auto max-w-xl">

        {/* Back */}

        <Link
          href={`/workers/${workerId}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          Worker Profile
        </Link>

        {/* Card */}

        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm sm:p-8">

          {/* Worker */}

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange/10 text-2xl font-bold text-orange">
              {worker.name?.charAt(0)}
            </div>

            <h1 className="mt-4 text-2xl font-bold text-navy">
              {worker.name}
            </h1>

            <p className="mt-1 text-gray-500">
              {worker.category}
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {worker.district}
            </p>

          </div>

          {/* Heading */}

          <div className="mt-8 text-center">

            <h2 className="text-xl font-bold text-navy">
              Rating & Review দিন
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              এই Worker-এর কাজের অভিজ্ঞতা সম্পর্কে আপনার মতামত জানান।
            </p>

          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Stars */}

          <div className="mt-8">

            <p className="text-center text-sm font-semibold text-navy">
              আপনার Rating
            </p>

            <div className="mt-4 flex justify-center gap-2">

              {Array.from({
                length: 5,
              }).map((_, index) => {

                const starNumber =
                  index + 1;

                const active =
                  starNumber <=
                  (hoverRating || rating);

                return (
                  <button
                    key={starNumber}
                    type="button"
                    onClick={() =>
                      setRating(
                        starNumber
                      )
                    }
                    onMouseEnter={() =>
                      setHoverRating(
                        starNumber
                      )
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    className="rounded-lg p-1 transition hover:scale-110"
                    aria-label={`${starNumber} Star`}
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

            <p className="mt-3 text-center text-sm font-semibold text-gray-500">
              {rating === 0
                ? "Rating নির্বাচন করুন"
                : `${rating} / 5 Star`}
            </p>

          </div>

          {/* Review */}

          <div className="mt-8">

            <label
              htmlFor="review"
              className="text-sm font-semibold text-navy"
            >
              আপনার Review
            </label>

            <textarea
              id="review"
              value={review}
              onChange={(event) =>
                setReview(
                  event.target.value
                )
              }
              rows={5}
              className="mt-2 w-full rounded-2xl border border-gray-200 bg-white p-4 text-navy outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/10"
              placeholder="যেমন: কাজ খুব ভালো হয়েছে, সময়মতো কাজ সম্পন্ন করেছেন।"
            />

            <p className="mt-2 text-right text-xs text-gray-400">
              {review.length} characters
            </p>

          </div>

          {/* Submit */}

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange font-semibold text-white transition hover:opacity-90 active:scale-[0.99]"
          >
            <Star className="h-5 w-5" />
            Rating & Review Submit করুন
          </button>

        </div>

      </div>

    </main>
  );
}