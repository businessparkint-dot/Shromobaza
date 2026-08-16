
"use client";

import Link from "next/link";
import {
  Users,
  Briefcase,
  Globe2,
  Scale,
  Stethoscope,
  GraduationCap,
  Laptop,
  HardHat,
  Hammer,
  Wrench,
  ArrowRight,
} from "lucide-react";

import { workers } from "@/lib/database";

const categories = [
  {
    name: "ইঞ্জিনিয়ার",
    icon: HardHat,
    description: "দক্ষ ইঞ্জিনিয়ার খুঁজুন",
  },
  {
    name: "মিস্ত্রি",
    icon: Hammer,
    description: "অভিজ্ঞ মিস্ত্রি খুঁজুন",
  },
  {
    name: "টেকনিশিয়ান",
    icon: Wrench,
    description: "দক্ষ টেকনিশিয়ান খুঁজুন",
  },
  {
    name: "আইনজীবী",
    icon: Scale,
    description: "আইনজীবী ও উকিল খুঁজুন",
  },
  {
    name: "ডাক্তার",
    icon: Stethoscope,
    description: "বিশেষজ্ঞ ডাক্তার খুঁজুন",
  },
  {
    name: "টিউশন শিক্ষক",
    icon: GraduationCap,
    description: "অভিজ্ঞ শিক্ষক খুঁজুন",
  },
  {
    name: "IT ও ডিজিটাল এক্সপার্ট",
    icon: Laptop,
    description: "IT ও ডিজিটাল বিশেষজ্ঞ",
  },
  {
    name: "বিদেশে কর্মরত শ্রমিক",
    icon: Globe2,
    description: "বিদেশে কর্মরত বাংলাদেশি",
  },
];

export default function AppPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* HERO */}
      <section className="bg-[#081B3A] px-4 pb-16 pt-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
            শ্রমবাজার App
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            দক্ষ মানুষ খুঁজুন,
            <br />
            কাজের সুযোগ তৈরি করুন
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            ইঞ্জিনিয়ার, শ্রমিক, মিস্ত্রি, টেকনিশিয়ান, ডাক্তার,
            আইনজীবীসহ বিভিন্ন পেশার মানুষকে এক জায়গায় খুঁজে নিন।
          </p>

          <div className="mt-7 flex flex-wrap gap-3">

            <Link
              href="/workers"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              শ্রমিক খুঁজুন
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              কাজ খুঁজুন
              <Briefcase size={17} />
            </Link>

          </div>

        </div>
      </section>

      {/* QUICK STATS */}
      <section className="-mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
            <Users className="mb-3 h-6 w-6 text-blue-600" />

            <p className="text-2xl font-bold text-slate-900">
              {workers.length}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              নিবন্ধিত সদস্য
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
            <Briefcase className="mb-3 h-6 w-6 text-blue-600" />

            <p className="text-2xl font-bold text-slate-900">
              Jobs
            </p>

            <p className="mt-1 text-sm text-slate-500">
              কাজের সুযোগ
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
            <Globe2 className="mb-3 h-6 w-6 text-blue-600" />

            <p className="text-2xl font-bold text-slate-900">
              BD + Global
            </p>

            <p className="mt-1 text-sm text-slate-500">
              দেশ ও বিদেশ
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-lg">
            <Users className="mb-3 h-6 w-6 text-blue-600" />

            <p className="text-2xl font-bold text-slate-900">
              12+
            </p>

            <p className="mt-1 text-sm text-slate-500">
              পেশার ক্যাটাগরি
            </p>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          <div className="mb-8 flex items-end justify-between">

            <div>
              <p className="text-sm font-bold tracking-wide text-blue-600">
                EXPLORE
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                ক্যাটাগরি থেকে খুঁজুন
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                আপনার প্রয়োজন অনুযায়ী পেশাজীবী খুঁজে নিন।
              </p>
            </div>

            <Link
              href="/workers"
              className="hidden items-center gap-1 text-sm font-bold text-blue-600 transition hover:text-blue-700 sm:flex"
            >
              সব দেখুন
              <ArrowRight size={17} />
            </Link>

          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/workers?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                >

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={25} />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    {category.name}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {category.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600">
                    দেখুন

                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>

                </Link>
              );
            })}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#081B3A] p-7 text-white sm:p-10">

          <div className="max-w-2xl">

            <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
              Skilled Workforce
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              আপনার দক্ষতা দিয়ে কাজ শুরু করুন
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              শ্রমবাজারে আপনার প্রোফাইল তৈরি করুন এবং আপনার
              দক্ষতার সঙ্গে মিল থাকা কাজের সুযোগ খুঁজে নিন।
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <Link
                href="/workers"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                শ্রমিক খুঁজুন
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Jobs দেখুন
                <Briefcase size={16} />
              </Link>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
}
