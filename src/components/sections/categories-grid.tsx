"use client";

import Link from "next/link";
import {
  ArrowRight,
  HardHat,
  Zap,
  Wrench,
  Snowflake,
  Flame,
  Hammer,
  Car,
  Laptop,
  GraduationCap,
  HeartPulse,
  Building2,
} from "lucide-react";

import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/fade-in";

const categories = [
  {
    id: "construction",
    name: "নির্মাণ শ্রমিক",
    description: "নির্মাণ ও সাইটের দক্ষ কর্মী",
    icon: HardHat,
  },
  {
    id: "mason",
    name: "রাজমিস্ত্রি",
    description: "দক্ষ রাজমিস্ত্রি ও মিস্ত্রি",
    icon: Hammer,
  },
  {
    id: "electrician",
    name: "ইলেকট্রিশিয়ান",
    description: "বাড়ি ও বাণিজ্যিক কাজ",
    icon: Zap,
  },
  {
    id: "plumber",
    name: "প্লাম্বার",
    description: "পাইপলাইন ও স্যানিটারি কাজ",
    icon: Wrench,
  },
  {
    id: "technician",
    name: "AC / Fridge Technician",
    description: "AC, ফ্রিজ ও ইলেকট্রনিক্স",
    icon: Snowflake,
  },
  {
    id: "welder",
    name: "ওয়েল্ডার",
    description: "ওয়েল্ডিং ও মেটাল কাজ",
    icon: Flame,
  },
  {
    id: "carpenter",
    name: "কাঠমিস্ত্রি",
    description: "কাঠ ও ফার্নিচারের কাজ",
    icon: Hammer,
  },
  {
    id: "driver",
    name: "ড্রাইভার",
    description: "বিভিন্ন ধরনের যানবাহন চালক",
    icon: Car,
  },
  {
    id: "it",
    name: "IT Professional",
    description: "টেকনোলজি ও সফটওয়্যার",
    icon: Laptop,
  },
  {
    id: "teacher",
    name: "Teacher",
    description: "শিক্ষক ও প্রশিক্ষক",
    icon: GraduationCap,
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "স্বাস্থ্যসেবা পেশাজীবী",
    icon: HeartPulse,
  },
  {
    id: "engineer",
    name: "Engineer",
    description: "বিভিন্ন ক্ষেত্রের প্রকৌশলী",
    icon: Building2,
  },
];

export function CategoriesGrid() {
  return (
    <section
      id="categories"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange">
                Find the right professional
              </p>

              <h2 className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                আপনার প্রয়োজনের দক্ষ কর্মী খুঁজুন
              </h2>

              <p className="mt-4 text-base leading-relaxed text-navy/60 sm:text-lg">
                নির্মাণ শ্রমিক থেকে শুরু করে টেকনিশিয়ান, ড্রাইভার,
                ইঞ্জিনিয়ার ও অন্যান্য পেশাজীবী—এক প্ল্যাটফর্মেই খুঁজে নিন।
              </p>
            </div>

            <Link
              href="#all-categories"
              className="inline-flex shrink-0 items-center gap-2 font-semibold text-orange transition-colors hover:text-navy"
            >
              সব ক্যাটাগরি দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>

        <StaggerContainer className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <StaggerItem key={category.id}>
                <Link
                  href={`#category-${category.id}`}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange sm:p-6"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10 text-orange transition-all duration-300 group-hover:bg-orange group-hover:text-white">
                    <Icon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <h3 className="font-semibold text-navy">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-navy/50">
                      {category.description}
                    </p>
                  </div>

                  <span className="mt-auto flex items-center gap-1 text-sm font-medium text-orange opacity-0 transition-opacity group-hover:opacity-100">
                    খুঁজুন
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}