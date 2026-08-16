
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

import { workers as databaseWorkers } from "@/lib/database";

const REVIEWS_STORAGE_KEY = "shromobazar_worker_reviews";

type Worker = {
  id: string;
  name: string;
  category?: string;
  location?: string;
  experience?: string;
  expectedSalary?: string;
  phone?: string;
  verified?: boolean;
  description?: string;
  bio?: string;
  skills?: string[];
  currentWork?: string;
  rating?: number;
};

type Review = {
  id: string;
  workerId: string;
  rating: number;
  review: string;
  reviewerName?: string;
  reviewerRole?: string;
  verified?: boolean;
  createdAt: string;
};

export default function WorkerProfilePage() {
  const params = useParams();
  const workerId = String(params.id);

  const [worker, setWorker] = useState<Worker | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    try {
      const foundWorker = (databaseWorkers as Worker[]).find(
        (item) => item.id === workerId
      );

      setWorker(foundWorker ?? null);

      const savedReviews = localStorage.getItem(
        REVIEWS_STORAGE_KEY
      );

      if (savedReviews) {
        const parsed: Review[] = JSON.parse(savedReviews);

        if (Array.isArray(parsed)) {
          setReviews(
            parsed.filter(
              (review) => review.workerId === workerId
            )
          );
        }
      }
    } catch (error) {
      console.error("Worker profile error:", error);
    }
  }, [workerId]);

  const ratingStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: worker?.rating ?? 0,
        total: 0,
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      };
    }

    const five = reviews.filter((r) => r.rating === 5).length;
    const four = reviews.filter((r) => r.rating === 4).length;
    const three = reviews.filter((r) => r.rating === 3).length;
    const two = reviews.filter((r) => r.rating === 2).length;
    const one = reviews.filter((r) => r.rating === 1).length;

    const average =
      reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      ) / reviews.length;

    return {
      average: Number(average.toFixed(1)),
      total: reviews.length,
      five,
      four,
      three,
      two,
      one,
    };
  }, [reviews, worker]);

  if (!worker) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12">

          <Link
            href="/workers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            সব Worker দেখুন
          </Link>

          <div className="mt-8 rounded-2xl border bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Worker পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-slate-500">
              এই Worker-এর তথ্য পাওয়া যায়নি।
            </p>
          </div>

        </div>
      </main>
    );
  }

  const skills = worker.skills ?? [
    "ইটের কাজ",
    "প্লাস্টার",
    "সিমেন্টের কাজ",
    "বাড়ি নির্মাণ",
  ];

  return (
    <main className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/workers"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          সব Worker দেখুন
        </Link>

        {/* Profile Header */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">

            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-3xl font-bold text-blue-700">
              {worker.name?.charAt(0) ?? "W"}
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="text-3xl font-bold text-slate-900">
                  {worker.name}
                </h1>

                {worker.verified !== false && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    যাচাইকৃত
                  </span>
                )}

              </div>

              <p className="mt-2 text-lg font-semibold text-blue-600">
                {worker.category ?? "দক্ষ Worker"}
              </p>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">

                {worker.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {worker.location}
                  </span>
                )}

                {worker.experience && (
                  <span>
                    {worker.experience} অভিজ্ঞতা
                  </span>
                )}

                <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                  <Star className="h-4 w-4 fill-current" />
                  {ratingStats.average > 0
                    ? ratingStats.average.toFixed(1)
                    : "নতুন"}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* Main Content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* About */}
          <section className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">

            <h2 className="text-xl font-bold text-slate-900">
              Worker সম্পর্কে
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {worker.description ??
                worker.bio ??
                "এই Worker দীর্ঘদিন ধরে বিভিন্ন নির্মাণ ও masonry কাজে অভিজ্ঞ।"}
            </p>

            <h2 className="mt-8 text-xl font-bold text-slate-900">
              দক্ষতা
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">

              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                >
                  {skill}
                </span>
              ))}

            </div>

            {worker.currentWork && (
              <>
                <h2 className="mt-8 text-xl font-bold text-slate-900">
                  বর্তমানে
                </h2>

                <p className="mt-3 text-slate-600">
                  {worker.currentWork}
                </p>
              </>
            )}

          </section>

          {/* Worker Details */}
          <aside className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              Worker Details
            </h2>

            {worker.expectedSalary && (
              <div className="mt-5">

                <p className="text-sm text-slate-500">
                  প্রত্যাশিত পারিশ্রমিক
                </p>

                <p className="mt-1 text-xl font-bold text-slate-900">
                  {worker.expectedSalary}
                </p>

              </div>
            )}

            {worker.location && (
              <div className="mt-5">

                <p className="text-sm text-slate-500">
                  অবস্থান
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {worker.location}
                </p>

              </div>
            )}

            {worker.experience && (
              <div className="mt-5">

                <p className="text-sm text-slate-500">
                  অভিজ্ঞতা
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {worker.experience}
                </p>

              </div>
            )}

            {/* Actions — ONLY HERE */}
            <div className="mt-6 flex flex-col gap-3">

              {worker.phone && (
                <a
                  href={`tel:${worker.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Phone className="h-5 w-5" />
                  কল করুন
                </a>
              )}

              {/* Employer → Worker Rating */}
              <Link
                href={`/rate-worker/${worker.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white transition hover:bg-amber-600"
              >
                <Star className="h-5 w-5" />
                Worker-কে Rating দিন
              </Link>

              {/* Hire — ONLY ONE */}
              <Link
                href={`/workers/${worker.id}/hire`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <BriefcaseBusiness className="h-5 w-5" />
                Hire করুন
              </Link>

            </div>

          </aside>

        </div>

        {/* Rating & Reviews — ONLY ONE */}
        <section className="mt-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-center gap-2">

            <Star className="h-6 w-6 fill-amber-400 text-amber-400" />

            <h2 className="text-2xl font-bold text-slate-900">
              Rating & Reviews
            </h2>

          </div>

          <p className="mt-2 text-slate-600">
            এই Worker সম্পর্কে Employer-এর মতামত
          </p>

          <div className="mt-6 grid gap-8 md:grid-cols-3">

            {/* Average */}
            <div className="rounded-2xl bg-slate-50 p-6 text-center">

              <div className="text-4xl font-bold text-slate-900">
                {ratingStats.average > 0
                  ? ratingStats.average.toFixed(1)
                  : "0.0"}
              </div>

              <div className="mt-2 flex justify-center gap-1">

                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(ratingStats.average)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }`}
                  />
                ))}

              </div>

              <p className="mt-2 text-sm text-slate-500">
                {ratingStats.total} Ratings
              </p>

            </div>

            {/* Rating Bars */}
            <div className="space-y-3 md:col-span-2">

              {[
                ["5★", ratingStats.five],
                ["4★", ratingStats.four],
                ["3★", ratingStats.three],
                ["2★", ratingStats.two],
                ["1★", ratingStats.one],
              ].map(([label, count]) => (

                <div
                  key={label}
                  className="flex items-center gap-3"
                >

                  <span className="w-8 text-sm font-semibold text-slate-700">
                    {label}
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{
                        width:
                          ratingStats.total > 0
                            ? `${(Number(count) / ratingStats.total) * 100}%`
                            : "0%",
                      }}
                    />

                  </div>

                  <span className="w-6 text-right text-sm text-slate-500">
                    {count}
                  </span>

                </div>

              ))}

            </div>

          </div>

          {/* Reviews */}
          <div className="mt-8 border-t pt-8">

            <h3 className="text-xl font-bold text-slate-900">
              Reviews
            </h3>

            {reviews.length === 0 ? (
              <div className="mt-5 rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                এখনো কোনো Review নেই।
              </div>
            ) : (
              <div className="mt-5 space-y-4">

                {reviews.map((review) => (

                  <div
                    key={review.id}
                    className="rounded-xl border border-slate-200 p-5"
                  >

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="font-bold text-slate-900">
                            {review.reviewerName ??
                              "Verified Employer"}
                          </span>

                          {review.verified !== false && (
                            <span className="text-xs font-semibold text-green-600">
                              Verified Employer
                            </span>
                          )}

                        </div>

                        {review.reviewerRole && (
                          <p className="mt-1 text-sm text-slate-500">
                            {review.reviewerRole}
                          </p>
                        )}

                      </div>

                      <div className="flex items-center gap-1">

                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}

                      </div>

                    </div>

                    {review.review && (
                      <p className="mt-4 text-slate-700">
                        “{review.review}”
                      </p>
                    )}

                    <p className="mt-3 text-xs text-slate-400">
                      {review.createdAt}
                    </p>

                  </div>

                ))}

              </div>
            )}

          </div>

        </section>

        {/* Bottom navigation — NO HIRE BUTTON HERE */}
        <div className="mt-6">

          <Link
            href="/workers"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
            সব Worker দেখুন
          </Link>

        </div>

      </div>

    </main>
  );
}
