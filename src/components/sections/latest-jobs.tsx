"use client";

import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock,
  MapPin,
} from "lucide-react";

import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/fade-in";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const latestJobs = [
  {
    id: "job-1",
    title: "দক্ষ রাজমিস্ত্রি প্রয়োজন",
    company: "নির্মাণ প্রতিষ্ঠান",
    location: "ঢাকা",
    type: "পূর্ণকালীন",
    posted: "আজ",
    tags: ["রাজমিস্ত্রি", "নির্মাণ", "অভিজ্ঞতা ৩+ বছর"],
    salary: "আলোচনা সাপেক্ষে",
  },
  {
    id: "job-2",
    title: "ইলেকট্রিশিয়ান প্রয়োজন",
    company: "নির্মাণ ও উন্নয়ন প্রতিষ্ঠান",
    location: "চট্টগ্রাম",
    type: "চুক্তিভিত্তিক",
    posted: "আজ",
    tags: ["ইলেকট্রিক্যাল", "ওয়্যারিং", "মেইনটেন্যান্স"],
    salary: "৳১,২০০+/দিন",
  },
  {
    id: "job-3",
    title: "AC ও Refrigeration Technician",
    company: "সার্ভিস ও মেইনটেন্যান্স প্রতিষ্ঠান",
    location: "ঢাকা",
    type: "পূর্ণকালীন",
    posted: "১ দিন আগে",
    tags: ["AC", "Refrigerator", "Technician"],
    salary: "৳২৫,০০০–৳৩৫,০০০",
  },
  {
    id: "job-4",
    title: "অভিজ্ঞ ড্রাইভার প্রয়োজন",
    company: "ব্যক্তিগত নিয়োগকর্তা",
    location: "খুলনা",
    type: "পূর্ণকালীন",
    posted: "১ দিন আগে",
    tags: ["ড্রাইভার", "কার", "ড্রাইভিং লাইসেন্স"],
    salary: "৳১৮,০০০–৳২৫,০০০",
  },
];

export function LatestJobs() {
  return (
    <section
      id="jobs"
      className="bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div className="max-w-2xl">

              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                কাজের সুযোগ
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#081B3A] sm:text-4xl">
                নতুন কাজের সুযোগ
              </h2>

              <p className="mt-4 text-base leading-relaxed text-slate-500 sm:text-lg">
                আপনার দক্ষতা অনুযায়ী নতুন কাজ খুঁজুন এবং সরাসরি
                নিয়োগকর্তার কাছে আবেদন করুন।
              </p>

            </div>

            <Link
              href="/jobs"
              className="inline-flex shrink-0 items-center gap-2 font-bold text-blue-600 transition-colors hover:text-orange-500"
            >
              সব কাজ দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>
        </FadeIn>

        {/* =====================================================
            JOB LIST
        ====================================================== */}

        <StaggerContainer className="mt-12 space-y-4">

          {latestJobs.map((job) => (
            <StaggerItem key={job.id}>

              <article
                className="
                  group
                  flex
                  flex-col
                  gap-5
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  p-5
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:border-blue-200
                  hover:shadow-lg
                  sm:flex-row
                  sm:items-center
                  sm:p-6
                "
              >

                {/* =================================================
                    JOB ICON
                ================================================== */}

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <BriefcaseBusiness className="h-7 w-7" />
                </div>

                {/* =================================================
                    JOB INFORMATION
                ================================================== */}

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="font-bold text-[#081B3A] transition-colors group-hover:text-blue-600">

                      <Link
                        href={`/jobs/${job.id}`}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        {job.title}
                      </Link>

                    </h3>

                    <Badge variant="secondary">
                      {job.type}
                    </Badge>

                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {job.company}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-400">

                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.posted}
                    </span>

                  </div>

                  {/* TAGS */}

                  <div className="mt-3 flex flex-wrap gap-1.5">

                    {job.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                      >
                        {tag}
                      </Badge>
                    ))}

                  </div>

                </div>

                {/* =================================================
                    SALARY + APPLY
                ================================================== */}

                <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">

                  <span className="text-base font-bold text-[#081B3A] sm:text-lg">
                    {job.salary}
                  </span>

                  <Button
                    size="sm"
                    asChild
                  >
                    <Link href={`/jobs/${job.id}`}>
                      আবেদন করুন
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>

                </div>

              </article>

            </StaggerItem>
          ))}

        </StaggerContainer>

        {/* =====================================================
            VIEW ALL JOB NOTICES
        ====================================================== */}

        <FadeIn>

          <div className="mt-10 flex justify-center">

            <Link
              href="/jobs"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-6
                py-3
                text-sm
                font-bold
                text-[#081B3A]
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-blue-600
                hover:shadow-md
              "
            >
              বিজ্ঞপ্তি দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </FadeIn>

      </div>
    </section>
  );
}