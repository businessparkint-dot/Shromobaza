"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Phone,
  CheckCircle,
  Star,
  Briefcase,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { workers, hireRequests } from "@/lib/database";

type Props = {
  params: Promise<{ id: string }>;
};

type Review = {
  id: string;
  jobId: string;
  workerId: string;
  employerId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const REVIEWS_KEY = "shromobazar_reviews";

export default function WorkerProfilePage({ params }: Props) {
  const { id } = use(params);

  const worker = workers.find((item) => item.id === id);

  const [showHireForm, setShowHireForm] = useState(false);
  const [sent, setSent] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [message, setMessage] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);

  /* =========================
     LOAD REVIEWS
  ========================= */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_KEY);

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setReviews(parsed);
      }
    } catch {
      setReviews([]);
    }
  }, []);

  /* =========================
     WORKER REVIEWS
  ========================= */
  const workerReviews = useMemo(() => {
    return reviews.filter((review) => review.workerId === id);
  }, [reviews, id]);

  /* =========================
     AVERAGE RATING
  ========================= */
  const averageRating = useMemo(() => {
    if (workerReviews.length === 0) {
      return worker?.rating ?? 0;
    }

    const total = workerReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    return total / workerReviews.length;
  }, [workerReviews, worker]);

  /* =========================
     WORKER NOT FOUND
  ========================= */
  if (!worker) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Link
            href="/workers"
            className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-orange-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Worker তালিকায় ফিরে যান
          </Link>

          <div className="mt-8 rounded-3xl bg-white p-12 text-center shadow">
            <h1 className="text-2xl font-bold text-slate-900">
              Worker Profile পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-gray-500">
              এই Worker-এর তথ্য বর্তমানে পাওয়া যাচ্ছে না।
            </p>

            <Button className="mt-6" asChild>
              <Link href="/workers">সব Worker দেখুন</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  /* =========================
     HIRE REQUEST
  ========================= */
  const handleHireRequest = () => {
    if (!jobTitle.trim()) {
      alert("কাজের নাম দিন।");
      return;
    }

    if (!location.trim()) {
      alert("কাজের স্থান দিন।");
      return;
    }

    if (!salary.trim()) {
      alert("পারিশ্রমিক দিন।");
      return;
    }

    hireRequests.push({
      id: `hire-${Date.now()}`,
      workerId: worker.id,
      employerId: "employer-1",
      jobTitle: jobTitle.trim(),
      location: location.trim(),
      salary: salary.trim(),
      message: message.trim(),
      status: "pending",
    });

    setSent(true);
    setShowHireForm(false);
  };

  /* =========================
     CANCEL
  ========================= */
  const handleCancelHire = () => {
    setShowHireForm(false);
    setSent(false);
  };

  /* =========================
     NEW REQUEST
  ========================= */
  const handleNewRequest = () => {
    setJobTitle("");
    setLocation("");
    setSalary("");
    setMessage("");
    setSent(false);
    setShowHireForm(true);
  };

  /* =========================
     SKILLS
  ========================= */
  const skills =
    worker.skills && worker.skills.length > 0
      ? worker.skills
      : [worker.subCategory || worker.category];

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4">

        {/* BACK */}
        <Link
          href="/workers"
          className="mb-6 inline-flex items-center text-sm font-semibold text-slate-700 hover:text-orange-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Worker তালিকায় ফিরে যান
        </Link>

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

          {/* =====================================================
              PROFILE HEADER
          ===================================================== */}
          <div className="bg-slate-950 px-6 py-10 text-white sm:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* AVATAR */}
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white text-4xl font-bold text-slate-900">
                {worker.name.charAt(0)}
              </div>

              <div className="flex-1">

                {/* NAME */}
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold">
                    {worker.name}
                  </h1>

                  {worker.verified && (
                    <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-300">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      যাচাইকৃত
                    </span>
                  )}
                </div>

                {/* ROLE */}
                <p className="mt-2 text-xl font-semibold text-orange-300">
                  {worker.role}
                </p>

                {/* LOCATION */}
                <p className="mt-2 flex items-center text-white/70">
                  <MapPin className="mr-2 h-4 w-4" />
                  {worker.location}
                </p>

                {/* TAGS */}
                <div className="mt-4 flex flex-wrap gap-2">

                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                    {worker.category}
                  </span>

                  {worker.subCategory && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                      {worker.subCategory}
                    </span>
                  )}

                  <span className="rounded-full bg-white/10 px-3 py-1 text-sm">
                    ⭐ {averageRating.toFixed(1)}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      worker.available
                        ? "bg-green-500/20 text-green-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    ● {worker.availability}
                  </span>

                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              BODY
          ===================================================== */}
          <div className="p-6 sm:p-10">

            {/* STATS */}
            <div className="grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl bg-gray-50 p-5">
                <Clock className="h-6 w-6 text-orange-500" />

                <p className="mt-3 text-sm text-gray-500">
                  অভিজ্ঞতা
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {worker.experience}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <Briefcase className="h-6 w-6 text-orange-500" />

                <p className="mt-3 text-sm text-gray-500">
                  সম্পন্ন কাজ
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {worker.completedJobs} টি
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-5">
                <Star className="h-6 w-6 text-orange-500" />

                <p className="mt-3 text-sm text-gray-500">
                  Rating
                </p>

                <p className="mt-1 text-lg font-bold text-slate-900">
                  {averageRating.toFixed(1)} / 5
                </p>
              </div>

            </div>

            {/* ABOUT */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-slate-900">
                Worker সম্পর্কে
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {worker.about}
              </p>
            </section>

            {/* SKILLS */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-slate-900">
                দক্ষতা
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* CURRENT WORK */}
            <section className="mt-10">
              <h2 className="text-xl font-bold text-slate-900">
                বর্তমানে
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {worker.currentWork}
              </p>
            </section>

            {/* RATE */}
            <div className="mt-10 rounded-2xl border border-orange-200 bg-orange-50 p-6">
              <p className="text-sm text-gray-500">
                প্রত্যাশিত পারিশ্রমিক
              </p>

              <p className="mt-1 text-2xl font-bold text-orange-600">
                {worker.rate}
              </p>
            </div>

            {/* =====================================================
                REVIEWS
            ===================================================== */}
            <section className="mt-10 border-t pt-8">

              <h2 className="flex items-center text-xl font-bold text-slate-900">
                <MessageSquare className="mr-2 h-5 w-5 text-orange-500" />
                Employer Rating & Review
              </h2>

              {workerReviews.length === 0 ? (
                <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center">

                  <Star className="mx-auto h-10 w-10 text-gray-300" />

                  <h3 className="mt-3 font-bold text-slate-900">
                    এখনো কোনো Review নেই
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    কাজ সম্পন্ন হওয়ার পর Employer Review দিতে পারবেন।
                  </p>

                </div>
              ) : (
                <div className="mt-5 space-y-4">

                  {workerReviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-2xl border border-orange-100 bg-orange-50/50 p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">

                        <div>
                          <p className="font-semibold text-slate-900">
                            Employer Review
                          </p>

                          <div className="mt-2 flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= review.rating
                                    ? "fill-orange-500 text-orange-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <span className="text-xs text-gray-400">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString("bn-BD")}
                        </span>

                      </div>

                      <p className="mt-4 leading-7 text-gray-700">
                        “{review.comment}”
                      </p>
                    </div>
                  ))}

                </div>
              )}

            </section>

            {/* =====================================================
                CONTACT + HIRE
            ===================================================== */}
            <section className="mt-10 border-t pt-8">

              <h2 className="text-xl font-bold text-slate-900">
                Worker-এর সাথে যোগাযোগ করুন
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Worker-এর সাথে সরাসরি যোগাযোগ অথবা কাজের প্রস্তাব পাঠান।
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                {/* CALL */}
                <Button
                  size="lg"
                  className="w-full bg-green-600 font-bold text-white hover:bg-green-700 sm:w-auto"
                  asChild
                >
                  <a href={`tel:${worker.phone}`}>
                    <Phone className="mr-2 h-5 w-5" />
                    কল করুন
                  </a>
                </Button>

                {/* HIRE */}
                <Button
                  type="button"
                  size="lg"
                  className="w-full bg-orange-500 font-bold text-white hover:bg-orange-600 sm:w-auto"
                  onClick={() => {
                    setShowHireForm(true);
                    setSent(false);
                  }}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Hire করুন
                </Button>

                {/* MORE WORKERS */}
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link href="/workers">
                    আরও Worker খুঁজুন
                  </Link>
                </Button>

              </div>

            </section>

            {/* =====================================================
                HIRE FORM
            ===================================================== */}
            {showHireForm && !sent && (
              <section className="mt-10 rounded-3xl border-2 border-orange-200 bg-orange-50 p-6 sm:p-8">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                    <Briefcase className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {worker.name}-কে Hire করুন
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                      কাজের তথ্য দিন এবং Worker-এর কাছে Request পাঠান।
                    </p>
                  </div>

                </div>

                <div className="mt-6 space-y-5">

                  {/* JOB TITLE */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-800">
                      কাজের নাম *
                    </label>

                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="যেমন: বাসার Plumbing কাজ"
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* LOCATION */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-800">
                      কাজের স্থান *
                    </label>

                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="যেমন: মোহাম্মদপুর, ঢাকা"
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* SALARY */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-800">
                      পারিশ্রমিক *
                    </label>

                    <input
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="যেমন: ৳১২০০ / দিন"
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-800">
                      অতিরিক্ত তথ্য
                    </label>

                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="কাজ সম্পর্কে বিস্তারিত লিখুন..."
                      rows={4}
                      className="w-full rounded-xl border border-gray-300 bg-white p-4 text-slate-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col gap-3 sm:flex-row">

                    <Button
                      type="button"
                      size="lg"
                      onClick={handleHireRequest}
                      className="bg-orange-500 font-bold text-white hover:bg-orange-600"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Hire Request পাঠান
                    </Button>

                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      onClick={handleCancelHire}
                    >
                      বাতিল
                    </Button>

                  </div>

                </div>
              </section>
            )}

            {/* =====================================================
                SUCCESS
            ===================================================== */}
            {sent && (
              <section className="mt-10 rounded-3xl border-2 border-green-200 bg-green-50 p-6 sm:p-8">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-7 w-7 text-green-600" />
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-green-700">
                      Hire Request সফল হয়েছে
                    </h2>

                    <p className="mt-2 text-green-700">
                      {worker.name}-এর কাছে আপনার কাজের প্রস্তাব পাঠানো হয়েছে।
                    </p>

                    <p className="mt-1 text-sm text-green-600">
                      Worker Request গ্রহণ বা প্রত্যাখ্যান করতে পারবে।
                    </p>

                    <button
                      type="button"
                      onClick={handleNewRequest}
                      className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
                    >
                      আরেকটি Request পাঠান
                    </button>

                  </div>

                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}