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
  },
];

export function FeaturedWorkers() {
  return (
    <section id="workers" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                Skilled Workforce
              </p>

              <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                দক্ষ কর্মী খুঁজুন
              </h2>

              <p className="mt-4 text-base leading-relaxed text-navy/60 sm:text-lg">
                আপনার কাজের জন্য অভিজ্ঞ ও দক্ষ কর্মী খুঁজে নিন।
                যাচাইকৃত কর্মীদের তথ্য ধীরে ধীরে আমাদের workforce database-এর
                সঙ্গে যুক্ত করা হবে।
              </p>
            </div>

            <Link
              href="/workers"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-orange hover:text-navy"
            >
              সব কর্মী দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredWorkers.map((worker) => (
            <StaggerItem key={worker.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange/30 hover:shadow-lg">

                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-navy/5">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange/10 text-orange">
                    <UserRound className="h-12 w-12" />
                  </div>

                  {worker.verified && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-navy shadow-sm">
                      <BadgeCheck className="h-3.5 w-3.5 text-orange" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">

                  <h3 className="font-semibold text-navy">
                    {worker.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-orange">
                    {worker.role}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-navy/50">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {worker.location}
                    </span>

                    <span>{worker.experience}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-orange text-orange" />

                    <span className="text-sm font-semibold text-navy">
                      {worker.rating}
                    </span>

                    <span className="text-sm text-navy/40">
                      ({worker.reviews} reviews)
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {worker.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-auto pt-5">
                    <Button
                      className="w-full"
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

        <FadeIn>
          <div className="mt-10 text-center">
            <p className="text-sm text-navy/50">
              আপনার দক্ষতা আছে?
            </p>

            <Link
              href="#register-worker"
              className="mt-2 inline-flex items-center gap-2 font-semibold text-orange hover:text-navy"
            >
              শ্রমবাজারে নিবন্ধন করুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}