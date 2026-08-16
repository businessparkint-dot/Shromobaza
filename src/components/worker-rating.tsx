
"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, MessageSquare } from "lucide-react";

type WorkerRating = {
  id: string;
  workerId: string;
  rating: number;
  review: string;
  createdAt: string;
};

type WorkerRatingProps = {
  workerId: string;
};

export function WorkerRating({
  workerId,
}: WorkerRatingProps) {
  const [ratings, setRatings] = useState<WorkerRating[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(
      "shromobazar_worker_ratings"
    );

    if (!saved) {
      setRatings([]);
      return;
    }

    try {
      const parsed: WorkerRating[] = JSON.parse(saved);

      setRatings(
        parsed.filter(
          (item) => item.workerId === workerId
        )
      );
    } catch {
      setRatings([]);
    }
  }, [workerId]);

  const averageRating = useMemo(() => {
    if (ratings.length === 0) return 0;

    const total = ratings.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    return total / ratings.length;
  }, [ratings]);

  const ratingCounts = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: ratings.filter(
        (item) => item.rating === star
      ).length,
    }));
  }, [ratings]);

  const renderStars = (
    value: number,
    size = "h-5 w-5"
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= Math.round(value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-50">
          <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-navy">
            Rating & Reviews
          </h2>

          <p className="text-sm text-gray-500">
            Worker-এর কাজ সম্পর্কে Employer-এর মতামত
          </p>
        </div>

      </div>

      {ratings.length === 0 ? (

        /* No Rating */
        <div className="mt-6 rounded-2xl bg-gray-50 p-8 text-center">

          <Star className="mx-auto h-12 w-12 text-gray-300" />

          <h3 className="mt-4 font-bold text-navy">
            এখনো কোনো Rating নেই
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            কাজ সম্পন্ন হওয়ার পর Employer Worker-কে
            Rating ও Review দিতে পারবেন।
          </p>

        </div>

      ) : (

        <>
          {/* Rating Summary */}
          <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr]">

            {/* Average */}
            <div className="rounded-2xl bg-gray-50 p-5 text-center">

              <p className="text-4xl font-bold text-navy">
                {averageRating.toFixed(1)}
              </p>

              <div className="mt-2 flex justify-center">
                {renderStars(averageRating)}
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {ratings.length}{" "}
                {ratings.length === 1
                  ? "Rating"
                  : "Ratings"}
              </p>

            </div>

            {/* Breakdown */}
            <div className="space-y-3">

              {ratingCounts.map(
                ({ star, count }) => {

                  const percentage =
                    ratings.length > 0
                      ? (count / ratings.length) * 100
                      : 0;

                  return (
                    <div
                      key={star}
                      className="flex items-center gap-3"
                    >

                      <span className="w-8 text-sm font-medium text-navy">
                        {star}★
                      </span>

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">

                        <div
                          className="h-full rounded-full bg-yellow-400 transition-all"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <span className="w-6 text-right text-sm text-gray-500">
                        {count}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* Reviews */}
          <div className="mt-8">

            <h3 className="flex items-center font-bold text-navy">

              <MessageSquare className="mr-2 h-5 w-5" />

              Reviews

            </h3>

            <div className="mt-4 space-y-4">

              {ratings
                .slice()
                .reverse()
                .map((item) => (

                  <div
                    key={item.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                  >

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                      {renderStars(item.rating, "h-4 w-4")}

                      <span className="text-xs text-gray-400">
                        {new Date(
                          item.createdAt
                        ).toLocaleDateString(
                          "bn-BD"
                        )}
                      </span>

                    </div>

                    {item.review ? (
                      <p className="mt-3 leading-7 text-gray-600">
                        “{item.review}”
                      </p>
                    ) : (
                      <p className="mt-3 text-sm italic text-gray-400">
                        কোনো Review লেখা হয়নি।
                      </p>
                    )}

                    <p className="mt-3 text-xs font-medium text-gray-400">
                      Verified Employer Review
                    </p>

                  </div>

                ))}

            </div>

          </div>
        </>
      )}

    </section>
  );
}
