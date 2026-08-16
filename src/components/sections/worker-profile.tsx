"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const worker = {
  id: "worker-1",
  name: "মোঃ রাকিব হাসান",
  role: "রাজমিস্ত্রি",
  location: "সাভার, ঢাকা",
  experience: "৮+ বছর",
  rating: "4.9",
  reviews: 32,
  verified: true,
  available: true,

  skills: [
    "ইটের কাজ",
    "প্লাস্টার",
    "টাইলস",
    "বিল্ডিং নির্মাণ",
    "ফিনিশিং",
  ],

  workTypes: [
    "Full-time",
    "Contract",
    "Project-based",
  ],

  about:
    "অভিজ্ঞ ও দক্ষ রাজমিস্ত্রি। আবাসিক ও বাণিজ্যিক ভবন নির্মাণ, ইটের কাজ, প্লাস্টার এবং টাইলসের কাজে দীর্ঘদিনের অভিজ্ঞতা রয়েছে।",

  languages: ["বাংলা", "হিন্দি"],

  phone: "01XXXXXXXXX",
};

export function WorkerProfile() {
  return (
    <section
      id="worker-worker-1"
      className="bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="#workers"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-navy/60 transition-colors hover:text-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          কর্মীদের তালিকায় ফিরে যান
        </Link>

        {/* Main profile card */}
        <div className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm">

          {/* Header */}
          <div className="relative bg-navy px-6 py-10 sm:px-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* Profile avatar */}
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
                <UserRound className="h-14 w-14" />
              </div>

              {/* Name */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
                    {worker.name}
                  </h1>

                  {worker.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                      <BadgeCheck className="h-4 w-4 text-orange" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-2 text-lg font-medium text-orange">
                  {worker.role}
                </p>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/70">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {worker.location}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4" />
                    {worker.experience}
                  </span>
                </div>
              </div>

              {/* Availability */}
              <div className="shrink-0">
                {worker.available && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    কাজের জন্য Available
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Profile content */}
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_300px]">

            {/* Left */}
            <div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-2 rounded-xl bg-orange/10 px-4 py-3">
                  <Star className="h-5 w-5 fill-orange text-orange" />
                  <span className="font-bold text-navy">
                    {worker.rating}
                  </span>
                  <span className="text-sm text-navy/50">
                    ({worker.reviews} reviews)
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl bg-navy/5 px-4 py-3 text-sm font-medium text-navy/70">
                  <ShieldCheck className="h-5 w-5 text-orange" />
                  পরিচয় ও দক্ষতা যাচাইযোগ্য
                </div>
              </div>

              {/* About */}
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-navy">
                  কর্মীর সম্পর্কে
                </h2>

                <p className="mt-4 leading-8 text-navy/60">
                  {worker.about}
                </p>
              </div>

              {/* Skills */}
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-navy">
                  দক্ষতা
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {worker.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1.5"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Work type */}
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-navy">
                  কাজের ধরন
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {worker.workTypes.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-2 rounded-xl border border-navy/10 p-4"
                    >
                      <BriefcaseBusiness className="h-5 w-5 text-orange" />
                      <span className="text-sm font-medium text-navy">
                        {type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold text-navy">
                  ভাষা
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {worker.languages.map((language) => (
                    <span
                      key={language}
                      className="rounded-full bg-navy/5 px-4 py-2 text-sm font-medium text-navy/70"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Right contact card */}
            <aside>
              <div className="sticky top-24 rounded-2xl border border-navy/10 bg-slate-50 p-5">

                <p className="text-sm text-navy/50">
                  এই কর্মীকে নিয়োগ করতে চান?
                </p>

                <h3 className="mt-2 text-xl font-bold text-navy">
                  সরাসরি যোগাযোগ করুন
                </h3>

                <div className="mt-6 space-y-3">

                  <Button
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link href="#hire-worker">
                      Hire করুন
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link href={`tel:${worker.phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      যোগাযোগ করুন
                    </Link>
                  </Button>

                </div>

                <div className="mt-6 border-t border-navy/10 pt-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />

                    <p className="text-xs leading-5 text-navy/50">
                      কর্মীর পরিচয় ও দক্ষতা যাচাই করার পরেই
                      নিয়োগের সিদ্ধান্ত নিন।
                    </p>
                  </div>
                </div>

              </div>
            </aside>

          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 rounded-2xl border border-orange/20 bg-orange/5 p-6 text-center sm:p-8">
          <h2 className="font-display text-2xl font-bold text-navy">
            আপনিও কি দক্ষ কর্মী?
          </h2>

          <p className="mt-2 text-sm text-navy/60">
            শ্রমবাজারে আপনার profile তৈরি করুন এবং কাজের সুযোগ পান।
          </p>

          <Link
            href="#register-worker"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-orange hover:text-navy"
          >
            কর্মী হিসেবে নিবন্ধন করুন
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}