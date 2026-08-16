
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Star } from "lucide-react";

const EMPLOYER_REVIEWS_KEY =
  "shromobazar_employer_reviews";

type EmployerReview = {
  id: string;
  employerId: string;
  workerId: string;
  rating: number;
  review: string;
  createdAt: string;
};

export default function RateEmployerPage() {
  const params = useParams();
  const router = useRouter();

  const employerId = String(params.id);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [existingReview, setExistingReview] =
    useState<EmployerReview | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        EMPLOYER_REVIEWS_KEY
      );

      if (!saved) return;

      const reviews: EmployerReview[] =
        JSON.parse(saved);

      const found = reviews.find(
        (item) =>
          item.employerId === employerId &&
          item.workerId === "worker-001"
      );

      if (found) {
        setExistingReview(found);
        setRating(found.rating);
        setReview(found.review);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [employerId]);

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (rating < 1) {
      alert("দয়া করে Rating দিন।");
      return;
    }

    try {
      const saved = localStorage.getItem(
        EMPLOYER_REVIEWS_KEY
      );

      const reviews: EmployerReview[] = saved
        ? JSON.parse(saved)
        : [];

      const reviewData: EmployerReview = {
        id:
          existingReview?.id ||
          `employer-review-${Date.now()}`,
        employerId,
        workerId: "worker-001",
        rating,
        review: review.trim(),
        createdAt:
          existingReview?.createdAt ||
          new Date().toISOString(),
      };

      const updatedReviews = reviews.filter(
        (item) =>
          !(
            item.employerId === employerId &&
            item.workerId === "worker-001"
          )
      );

      updatedReviews.push(reviewData);

      localStorage.setItem(
        EMPLOYER_REVIEWS_KEY,
        JSON.stringify(updatedReviews)
      );

      setExistingReview(reviewData);
      setSubmitted(true);
    } catch {
      alert("Rating save করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">

        <Link
          href="/worker-my-jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          আমার Jobs
        </Link>

        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">

          <div className="text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
              <Star className="h-8 w-8 text-orange-500" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Employer-কে Rating দিন
            </h1>

            <p className="mt-2 text-slate-500">
              আপনার কাজের অভিজ্ঞতা সম্পর্কে Employer-এর জন্য
              Rating ও Review দিন।
            </p>

          </div>

          {submitted ? (

            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">

              <CheckCircle className="mx-auto h-10 w-10 text-green-600" />

              <h2 className="mt-3 text-xl font-bold text-green-800">
                Rating সফলভাবে দেওয়া হয়েছে
              </h2>

              <p className="mt-2 text-sm text-green-700">
                আপনার Rating ও Review সংরক্ষণ করা হয়েছে।
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push("/worker-my-jobs")
                }
                className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
              >
                আমার Jobs
              </button>

            </div>

          ) : (

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >

              <label className="font-semibold text-slate-900">
                আপনার Rating
              </label>

              <div className="mt-4 flex justify-center gap-2">

                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setRating(value)
                    }
                    className="rounded-lg p-1"
                    aria-label={`${value} star`}
                  >
                    <Star
                      className={`h-9 w-9 ${
                        value <= rating
                          ? "fill-orange-400 text-orange-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}

              </div>

              <p className="mt-2 text-center text-sm font-semibold text-slate-600">
                {rating > 0
                  ? `${rating} / 5`
                  : "Rating নির্বাচন করুন"}
              </p>

              <div className="mt-7">

                <label
                  htmlFor="review"
                  className="font-semibold text-slate-900"
                >
                  Review
                </label>

                <textarea
                  id="review"
                  value={review}
                  onChange={(event) =>
                    setReview(event.target.value)
                  }
                  placeholder="Employer সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />

              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
              >
                Rating Submit করুন
              </button>

            </form>
          )}

        </div>
      </div>
    </main>
  );
}
