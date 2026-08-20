"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  Star,
  UserRound,
} from "lucide-react";

import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const featuredWorkers = [
  {
    id: "worker-1",
    name: "মোঃ রাকিব হাসান",
    role: "রাজমিস্ত্রি",
    location: "ঢাকা",
    experience: "৮+ বছর",
    rating: "4.9",
    reviews: 32,
    skills: ["ইটের কাজ", "প্লাস্টার", "টাইলস"],
    verified: true,
    accent: "from-blue-600 to-cyan-500",
    soft: "bg-blue-50",
  },
  {
    id: "worker-2",
    name: "মোঃ সোহেল মিয়া",
    role: "ইলেকট্রিশিয়ান",
    location: "চট্টগ্রাম",
    experience: "৬+ বছর",
    rating: "4.8",
    reviews: 27,
    skills: ["House Wiring", "Industrial", "Solar"],
    verified: true,
    accent: "from-cyan-500 to-teal-500",
    soft: "bg-cyan-50",
  },
  {
    id: "worker-3",
    name: "মোঃ কামাল হোসেন",
    role: "AC & Refrigeration Technician",
    location: "ঢাকা",
    experience: "৭+ বছর",
    rating: "4.9",
    reviews: 41,
    skills: ["AC", "Fridge", "Maintenance"],
    verified: true,
    accent: "from-violet-500 to-blue-600",
    soft: "bg-violet-50",
  },
  {
    id: "worker-4",
    name: "মোঃ জাহিদুল ইসলাম",
    role: "ড্রাইভার",
    location: "খুলনা",
    experience: "১০+ বছর",
    rating: "4.8",
    reviews: 36,
    skills: ["Car", "Microbus", "Highway"],
    verified: true,
    accent: "from-orange-500 to-amber-500",
    soft: "bg-orange-50",
  },
];

export function FeaturedWorkers() {
  return (
    <section
      id="workers"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-24"
    >
      {/* =====================================================
          BACKGROUND ACCENTS
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            SECTION HEADER
        ================================================== */}

        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Skilled Workforce
              </div>

              <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                দক্ষ কর্মী খুঁজুন
              </h2>

              <p className="mt-4 text-base leading-relaxed text-navy/60 sm:text-lg">
                আপনার কাজের জন্য অভিজ্ঞ ও দক্ষ কর্মী খুঁজে নিন।
                যাচাইকৃত কর্মীদের তথ্য ধীরে ধীরে আমাদের workforce
                database-এর সঙ্গে যুক্ত করা হবে।
              </p>

            </div>

            <Link
              href="/workers"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 font-semibold text-blue-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              সব কর্মী দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>

        {/* =================================================
            WORKER CARDS
        ================================================== */}

        <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredWorkers.map((worker) => (
            <StaggerItem key={worker.id}>

              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl">

                {/* =========================================
                    PROFILE HEADER
                ========================================== */}

                <div
                  className={`relative h-36 overflow-hidden bg-gradient-to-br ${worker.accent}`}
                >
                  {/* Decorative circles */}
                  <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />

                  <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10" />

                  <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                    Skilled Worker
                  </div>

                  {/* Profile icon */}
                  <div className="absolute bottom-[-32px] left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
                    <div
                      className={`flex h-full w-full items-center justify-center rounded-full ${worker.soft}`}
                    >
                      <UserRound className="h-10 w-10 text-blue-600" />
                    </div>
                  </div>

                  {/* Verified */}
                  {worker.verified && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/30 bg-white/95 px-2.5 py-1.5 text-[11px] font-bold text-blue-700 shadow-sm">
                      <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
                      Verified
                    </div>
                  )}
                </div>

                {/* =========================================
                    PROFILE INFORMATION
                ========================================== */}

                <div className="flex flex-1 flex-col px-5 pb-5 pt-12">

                  <div className="text-center">
                    <h3 className="font-bold text-navy">
                      {worker.name}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-blue-600">
                      {worker.role}
                    </p>
                  </div>

                  {/* Location + Experience */}
                  <div className="mt-4 flex items-center justify-center gap-3 text-xs text-navy/50">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-blue-500" />
                      {worker.location}
                    </span>

                    <span className="h-3 w-px bg-slate-200" />

                    <span>{worker.experience}</span>
                  </div>

                  {/* Rating */}
                  <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

                    <span className="text-sm font-bold text-navy">
                      {worker.rating}
                    </span>

                    <span className="text-xs text-navy/45">
                      ({worker.reviews} reviews)
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {worker.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="border-0 bg-slate-100 text-slate-600"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Button */}
                  <div className="mt-auto pt-5">
                    <Button
                      className="w-full rounded-xl bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
                      size="sm"
                      asChild
                    >
                      <Link href={`/workers?worker=${worker.id}`}>
                        Profile দেখুন
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                </div>
              </article>

            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}