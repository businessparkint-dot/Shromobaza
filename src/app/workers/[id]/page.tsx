"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  User,
  UserCheck,
  XCircle,
} from "lucide-react";

type Worker = {
  id: string;
  profileId: string;
  name: string;
  category: string;
  subCategory: string;
  location: string;
  district: string;
  experience: string;
  phone: string;
  avatarUrl: string;
  verified: boolean;
  description: string;
  skills: string[];
  currentWork: string;
  rating: number;
  reviewCount: number;
  available: boolean;
};

type ApiProfile =
  | {
      id?: string;
      name?: string | null;
      phone?: string | null;
      location?: string | null;
      avatar_url?: string | null;
    }
  | null;

type ApiWorker = {
  id?: string;
  profile_id?: string | null;
  profileId?: string | null;

  name?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;

  category?: string | null;
  sub_category?: string | null;
  subCategory?: string | null;

  experience?: string | null;
  skills?: string | string[] | null;
  district?: string | null;
  location?: string | null;

  rating?: number | null;
  review_count?: number | null;
  reviewCount?: number | null;

  profiles?: ApiProfile | ApiProfile[] | null;
};

type LocalReview = {
  id?: string;
  workerId?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

function getProfile(item: ApiWorker): NonNullable<ApiProfile> {
  const profile = item.profiles;

  if (Array.isArray(profile)) {
    return profile[0] ?? {};
  }

  return profile ?? {};
}

function parseSkills(
  skills: string | string[] | null | undefined
): string[] {
  if (Array.isArray(skills)) {
    return skills
      .map((skill) => String(skill).trim())
      .filter(Boolean);
  }

  if (!skills) {
    return [];
  }

  return skills
    .split(/[,|;\n]+/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function normalizeWorker(item: ApiWorker): Worker {
  const profile = getProfile(item);

  const profileId =
    item.profileId ||
    item.profile_id ||
    profile.id ||
    item.id ||
    "";

  const category =
    item.category?.trim() ||
    "Worker";

  const subCategory =
    item.subCategory?.trim() ||
    item.sub_category?.trim() ||
    "";

  const skills = parseSkills(item.skills);

  const rating =
    typeof item.rating === "number"
      ? item.rating
      : Number(item.rating ?? 0) || 0;

  const reviewCount =
    typeof item.reviewCount === "number"
      ? item.reviewCount
      : typeof item.review_count === "number"
        ? item.review_count
        : Number(item.review_count ?? 0) || 0;

  return {
    id: item.id || profileId,
    profileId,

    name:
      item.name?.trim() ||
      profile.name?.trim() ||
      "নাম দেওয়া হয়নি",

    category,

    subCategory,

    location:
      item.location?.trim() ||
      profile.location?.trim() ||
      item.district?.trim() ||
      "লোকেশন উল্লেখ করা হয়নি",

    district:
      item.district?.trim() ||
      "",

    experience:
      item.experience?.trim() ||
      "অভিজ্ঞতা উল্লেখ করা হয়নি",

    phone:
      item.phone?.trim() ||
      profile.phone?.trim() ||
      "",

    avatarUrl:
      item.avatarUrl?.trim() ||
      profile.avatar_url?.trim() ||
      "",

    verified: false,

    description:
      "এই Worker শ্রমবাজারের workforce network-এর একজন নিবন্ধিত সদস্য।",

    skills,

    currentWork: "",

    rating,

    reviewCount,

    available: true,
  };
}

function formatRating(rating: number): string {
  if (!Number.isFinite(rating)) {
    return "0.0";
  }

  return rating.toFixed(1);
}

function formatDate(value?: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function WorkerProfilePage() {
  const params = useParams();

  const workerId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
        ? params.id[0]
        : "";

  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState<LocalReview[]>([]);

  useEffect(() => {
    if (!workerId) {
      return;
    }

    let cancelled = false;

    async function loadWorker() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/workers/${encodeURIComponent(workerId)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ||
              data?.message ||
              "Worker তথ্য পাওয়া যায়নি।"
          );
        }

        const apiWorker: ApiWorker =
          data?.worker ??
          data?.data ??
          data;

        if (!apiWorker || typeof apiWorker !== "object") {
          throw new Error("Worker তথ্য সঠিকভাবে পাওয়া যায়নি।");
        }

        const normalized = normalizeWorker(apiWorker);

        if (!cancelled) {
          setWorker(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Worker তথ্য লোড করতে সমস্যা হয়েছে।";

          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWorker();

    return () => {
      cancelled = true;
    };
  }, [workerId]);

  useEffect(() => {
    if (!workerId || typeof window === "undefined") {
      return;
    }

    try {
      const stored = localStorage.getItem(
        "shromobazar_worker_reviews"
      );

      if (!stored) {
        setReviews([]);
        return;
      }

      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        setReviews([]);
        return;
      }

      const workerReviews = parsed.filter(
        (review: LocalReview) =>
          String(review?.workerId ?? "") === String(workerId)
      );

      setReviews(workerReviews);
    } catch {
      setReviews([]);
    }
  }, [workerId]);

  const ratingStats = useMemo(() => {
    if (!worker) {
      return {
        rating: 0,
        count: 0,
      };
    }

    if (reviews.length === 0) {
      return {
        rating: worker.rating,
        count: worker.reviewCount,
      };
    }

    const validRatings = reviews
      .map((review) => Number(review.rating))
      .filter(
        (rating) =>
          Number.isFinite(rating) &&
          rating >= 1 &&
          rating <= 5
      );

    if (validRatings.length === 0) {
      return {
        rating: worker.rating,
        count: worker.reviewCount,
      };
    }

    const total = validRatings.reduce(
      (sum, rating) => sum + rating,
      0
    );

    return {
      rating: total / validRatings.length,
      count: validRatings.length,
    };
  }, [worker, reviews]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 h-10 w-32 animate-pulse rounded-xl bg-slate-200" />

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-40 animate-pulse bg-slate-200" />

            <div className="p-6 sm:p-8">
              <div className="-mt-20 mb-5 h-32 w-32 animate-pulse rounded-full border-4 border-white bg-slate-200" />

              <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />

              <div className="mt-3 h-5 w-40 animate-pulse rounded-lg bg-slate-200" />

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !worker) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-4 py-10">
          <div className="w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Worker পাওয়া যায়নি
            </h1>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              {error ||
                "এই Worker-এর তথ্য বর্তমানে পাওয়া যাচ্ছে না।"}
            </p>

            <Link
              href="/workers"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Worker তালিকায় ফিরে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 sm:py-8">
        {/* Back */}
        <div className="mb-6">
          <Link
            href="/workers"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Worker তালিকায় ফিরে যান
          </Link>
        </div>

        {/* Main Profile Card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Cover */}
          <div className="relative h-36 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 sm:h-44">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_35%)]" />

            <div className="absolute bottom-4 right-4">
              {worker.verified ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-bold text-emerald-700 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Verified Worker
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                  <UserCheck className="h-4 w-4" />
                  Registered Worker
                </div>
              )}
            </div>
          </div>

          <div className="px-5 pb-7 sm:px-8 sm:pb-8">
            {/* Avatar + Basic Info */}
            <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-lg sm:h-36 sm:w-36">
                  {worker.avatarUrl ? (
                    <img
                      src={worker.avatarUrl}
                      alt={worker.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100">
                      <User className="h-14 w-14 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {worker.name}
                    </h1>

                    {worker.verified && (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">
                      {worker.category}
                    </span>

                    {worker.subCategory && (
                      <>
                        <span className="text-slate-300">•</span>

                        <span>
                          {worker.subCategory}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="pb-1">
                {worker.available ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    এখন কাজের জন্য Available
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    বর্তমানে ব্যস্ত
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                    <MapPin className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      লোকেশন
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {worker.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Clock3 className="h-5 w-5 text-slate-700" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      অভিজ্ঞতা
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {worker.experience}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Star className="h-5 w-5 fill-current text-amber-500" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Rating
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {formatRating(ratingStats.rating)}{" "}
                      <span className="font-normal text-slate-500">
                        ({ratingStats.count})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact / Actions */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {worker.phone ? (
                <a
                  href={`tel:${worker.phone}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  <Phone className="h-4 w-4" />
                  কল করুন
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-5 py-3 text-sm font-bold text-slate-500"
                >
                  <Phone className="h-4 w-4" />
                  ফোন নম্বর নেই
                </button>
              )}

              <Link
                href={`/workers/${worker.id}/hire`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                <Briefcase className="h-4 w-4" />
                Hire করুন
              </Link>

              <Link
                href={`/rate-worker/${worker.id}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
              >
                <Star className="h-4 w-4" />
                Rating দিন
              </Link>
            </div>
          </div>
        </section>

        {/* Details */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* About */}
          <section className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <User className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Worker সম্পর্কে
                </h2>

                <p className="text-sm text-slate-500">
                  প্রোফাইল ও কাজের তথ্য
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm leading-8 text-slate-600">
              {worker.description}
            </p>

            {worker.currentWork && (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  বর্তমানে যে কাজ করছেন
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {worker.currentWork}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-medium text-slate-500">
                  পেশা / Category
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {worker.category}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-medium text-slate-500">
                  Sub Category
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {worker.subCategory || "উল্লেখ করা হয়নি"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-medium text-slate-500">
                  জেলা
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {worker.district || worker.location}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-medium text-slate-500">
                  যোগাযোগ
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {worker.phone || "ফোন নম্বর দেওয়া হয়নি"}
                </p>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <Briefcase className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Skills
                </h2>

                <p className="text-sm text-slate-500">
                  কাজের দক্ষতা
                </p>
              </div>
            </div>

            {worker.skills.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {worker.skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-500">
                  এখনো কোনো Skill যোগ করা হয়নি।
                </p>
              </div>
            )}

            <div className="mt-8 rounded-2xl bg-slate-900 p-5 text-white">
              <p className="text-sm font-semibold">
                এই Worker-কে কাজ দিতে চান?
              </p>

              <p className="mt-2 text-xs leading-6 text-slate-300">
                Worker-এর availability দেখে সরাসরি Hire Request পাঠাতে পারেন।
              </p>

              <Link
                href={`/workers/${worker.id}/hire`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                <Briefcase className="h-4 w-4" />
                Hire Request পাঠান
              </Link>
            </div>
          </section>
        </div>

        {/* Rating & Reviews */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Rating & Reviews
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                এই Worker-এর কাজের অভিজ্ঞতা সম্পর্কে মতামত
              </p>
            </div>

            <Link
              href={`/rate-worker/${worker.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
            >
              <Star className="h-4 w-4" />
              Rating দিন
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-6 rounded-2xl bg-slate-50 p-6 sm:flex-row sm:items-center">
            <div className="text-center sm:min-w-36">
              <div className="text-4xl font-bold text-slate-900">
                {formatRating(ratingStats.rating)}
              </div>

              <div className="mt-2 flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(ratingStats.rating)
                        ? "fill-current text-amber-500"
                        : "text-slate-300"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {ratingStats.count}টি Review
              </p>
            </div>

            <div className="hidden h-20 w-px bg-slate-200 sm:block" />

            <div className="text-sm leading-7 text-slate-600">
              Worker-এর rating এবং review ভবিষ্যতে completed job-এর পর
              আরও শক্তিশালীভাবে database থেকে হিসাব করা হবে।
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="mt-6 space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={review.id || `${review.workerId}-${index}`}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Number(review.rating || 0)
                                ? "fill-current text-amber-500"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>

                      {review.comment && (
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {review.comment}
                        </p>
                      )}
                    </div>

                    {review.createdAt && (
                      <span className="text-xs text-slate-400">
                        {formatDate(review.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {reviews.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Star className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 font-semibold text-slate-700">
                এখনো কোনো Review নেই
              </p>

              <p className="mt-1 text-sm text-slate-500">
                কাজ সম্পন্ন হওয়ার পর Customer/Employer Review দিতে পারবেন।
              </p>
            </div>
          )}
        </section>

        {/* Footer info */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-xs text-slate-500 shadow-sm">
          Shromobazar — Global Workforce Platform
        </div>
      </div>
    </main>
  );
}