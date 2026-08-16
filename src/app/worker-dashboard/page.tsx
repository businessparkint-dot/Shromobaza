"use client";

import Link from "next/link";
import {
  UserRound,
  MapPin,
  Star,
  Briefcase,
  CheckCircle,
  Clock,
  Search,
  ArrowRight,
} from "lucide-react";

export default function WorkerDashboard() {
  const applications = [
    {
      title: "দক্ষ রাজমিস্ত্রি প্রয়োজন",
      company: "Construction Company",
      status: "অপেক্ষমাণ",
      type: "pending",
    },
    {
      title: "Building Maintenance",
      company: "ABC Developer",
      status: "গৃহীত",
      type: "accepted",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* TOP HEADER */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-orange-500">
              শ্রমবাজার
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
              কর্মী ড্যাশবোর্ড
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              আপনার প্রোফাইল, দক্ষতা ও কাজের আবেদন এক জায়গায় দেখুন।
            </p>
          </div>

          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
          >
            <Search className="h-4 w-4" />
            নতুন কাজ খুঁজুন
          </Link>
        </div>

        {/* PROFILE + SKILLS + APPLICATIONS */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* PROFILE */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <UserRound className="h-8 w-8" />
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                <CheckCircle className="h-3.5 w-3.5" />
                যাচাইকৃত
              </span>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              মোঃ রাকিব হাসান
            </h2>

            <p className="mt-1 font-semibold text-orange-500">
              রাজমিস্ত্রি
            </p>

            <div className="mt-6 space-y-4 text-sm text-slate-500">

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                ঢাকা
              </div>

              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-slate-400" />
                অভিজ্ঞতা: ৮+ বছর
              </div>

              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 fill-orange-500 text-orange-500" />
                <span className="font-bold text-slate-700">
                  4.9
                </span>
                <span>৩২টি রিভিউ</span>
              </div>

            </div>

            <Link
              href="/workers?worker=worker-1"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            >
              প্রোফাইল দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>

          </section>

          {/* SKILLS */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              আমার দক্ষতা
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              আপনার প্রধান কাজের দক্ষতাগুলো।
            </p>

            <div className="mt-6 space-y-3">

              <div className="rounded-2xl bg-orange-50 p-4">
                <p className="font-bold text-orange-700">
                  ইটের কাজ
                </p>
                <p className="mt-1 text-xs text-orange-600">
                  রাজমিস্ত্রির প্রধান দক্ষতা
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-700">
                  প্লাস্টার
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  দেয়াল ও ভবনের কাজ
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-700">
                  টাইলস
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  ফ্লোর ও ওয়াল টাইলস
                </p>
              </div>

            </div>

          </section>

          {/* APPLICATIONS */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-slate-900">
              আমার আবেদন
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              আপনার করা কাজের আবেদনের অবস্থা।
            </p>

            <div className="mt-5 space-y-4">

              {applications.map((application) => (
                <div
                  key={application.title}
                  className="rounded-2xl bg-slate-50 p-4"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {application.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {application.company}
                      </p>
                    </div>

                    {application.type === "accepted" ? (
                      <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 shrink-0 text-orange-500" />
                    )}

                  </div>

                  {application.type === "accepted" ? (
                    <span className="mt-4 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                      {application.status}
                    </span>
                  ) : (
                    <span className="mt-4 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                      {application.status}
                    </span>
                  )}

                </div>
              ))}

            </div>

          </section>

        </div>

        {/* STATISTICS */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              মোট আবেদন
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              ২
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              গৃহীত আবেদন
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              ১
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              অপেক্ষমাণ আবেদন
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              ১
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="mt-6 rounded-3xl bg-slate-900 p-6 sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-white">
                নতুন কাজ খুঁজছেন?
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                আপনার দক্ষতার সঙ্গে মিল আছে এমন নতুন কাজ খুঁজে আবেদন করুন।
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              কাজ খুঁজুন
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </div>
    </main>
  );
}