"use client";

import Link from "next/link";
import {
  UserRound,
  Briefcase,
  Store,
  Users,
  ArrowRight,
  UserPlus,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center">
          <p className="text-sm font-bold text-orange-500">
            শ্রমবাজার
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            আপনার ড্যাশবোর্ড নির্বাচন করুন
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            আপনি কোন ধরনের ব্যবহারকারী হিসেবে শ্রমবাজার ব্যবহার করতে চান,
            সেই অনুযায়ী আপনার ড্যাশবোর্ড নির্বাচন করুন।
          </p>
        </div>

        {/* DASHBOARD OPTIONS */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">

          {/* WORKER */}
          <Link
            href="/worker-dashboard"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
              <UserRound className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              কর্মী
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              নিজের দক্ষতা ও প্রোফাইল তৈরি করুন, কাজ খুঁজুন এবং
              কাজের জন্য আবেদন করুন।
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-500">
              কর্মী ড্যাশবোর্ড
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* SHOPKEEPER / EMPLOYER */}
          <Link
            href="/employer-dashboard"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Store className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Shopkeeper / Employer
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              কর্মী খুঁজুন, কাজ পোস্ট করুন এবং আপনার নিয়োগ কার্যক্রম
              পরিচালনা করুন।
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
              Employer Dashboard
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

          {/* CUSTOMER */}
          <Link
            href="/"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <Users className="h-7 w-7" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              সাধারণ গ্রাহক
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              প্রয়োজন অনুযায়ী কর্মী ও সেবা খুঁজে নিন এবং শ্রমবাজার
              প্ল্যাটফর্ম ব্যবহার করুন।
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-600">
              সেবা খুঁজুন
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>

        </div>

        {/* REGISTRATION CTA */}
        <div className="mt-8 rounded-3xl bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-white">
                এখনো নিবন্ধন করেননি?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                কর্মী, Shopkeeper/Employer অথবা সাধারণ গ্রাহক হিসেবে
                আপনার account তৈরি করুন।
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              <UserPlus className="h-4 w-4" />
              নিবন্ধন করুন
            </Link>

          </div>
        </div>

      </div>
    </main>
  );
}