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
    title: "ইলেকট্রিশিয়ান প্রয়োজন",
    company: "নির্মাণ ও উন্নয়ন প্রতিষ্ঠান",
    location: "চট্টগ্রাম",
    type: "চুক্তিভিত্তিক",
    posted: "আজ",
    tags: ["ইলেকট্রিক্যাল", "ওয়্যারিং", "মেইনটেন্যান্স"],
    salary: "৳১,২০০+/দিন",
  },
  {
    id: "job-3",
    title: "এসি ও রেফ্রিজারেশন টেকনিশিয়ান",
    company: "সার্ভিস ও মেইনটেন্যান্স প্রতিষ্ঠান",
    location: "ঢাকা",
    type: "পূর্ণকালীন",
    posted: "১ দিন আগে",
    tags: ["এসি", "রেফ্রিজারেটর", "টেকনিশিয়ান"],
    salary: "৳২৫,০০০–৳৩৫,০০০",
  },
  {
    id: "job-4",
    title: "অভিজ্ঞ ড্রাইভার প্রয়োজন",
    company: "ব্যক্তিগত নিয়োগকর্তা",
    location: "খুলনা",
    type: "পূর্ণকালীন",
    posted: "১ দিন আগে",
    tags: ["ড্রাইভার", "কার", "ড্রাইভিং লাইসেন্স"],
    salary: "৳১৮,০০০–৳২৫,০০০",
  },
];

export function LatestJobs() {
  return (
    <section id="jobs" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                কাজের সুযোগ
              </p>

              <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                নতুন কাজের সুযোগ
              </h2>

              <p className="mt-4 text-base leading-relaxed text-navy/60 sm:text-lg">
                আপনার দক্ষতা অনুযায়ী নতুন কাজ খুঁজুন এবং সরাসরি
                নিয়োগকর্তার কাছে আবেদন করুন।
              </p>

            </div>

            <Link
              href="#all-jobs"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-orange transition-colors hover:text-navy"
            >
              সব কাজ দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-12 space-y-4">
          {latestJobs.map((job) => (
            <StaggerItem key={job.id}>
              <article className="group flex flex-col gap-5 rounded-2xl border border-navy/10 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange/30 hover:shadow-lg sm:flex-row sm:items-center sm:p-6">

                {/* Job icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange">
                  <BriefcaseBusiness className="h-7 w-7" />
                </div>

                {/* Job information */}
                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-navy transition-colors group-hover:text-orange">
                      <Link
                        href={`#job-${job.id}`}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                      >
                        {job.title}
                      </Link>
                    </h3>

                    <Badge variant="orange">
                      {job.type}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm text-navy/60">
                    {job.company}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-navy/50">

                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.posted}
                    </span>

                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                </div>

                {/* Salary + Apply */}
                <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">

                  <span className="font-display text-base font-bold text-navy sm:text-lg">
                    {job.salary}
                  </span>

                  <Button size="sm" asChild>
                    <Link href={`#job-${job.id}`}>
                      আবেদন করুন
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>

                </div>

              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn>
          <div className="mt-10 text-center">

            <p className="text-sm text-navy/50">
              আপনি কি কর্মী খুঁজছেন?
            </p>

            <Link
              href="#post-job"
              className="mt-2 inline-flex items-center gap-2 font-semibold text-orange hover:text-navy"
            >
              আপনার কাজের বিজ্ঞপ্তি পোস্ট করুন
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>
        </FadeIn>

      </div>
    </section>
  );
}