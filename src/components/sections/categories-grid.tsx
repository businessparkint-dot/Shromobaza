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
  PackageCheck,
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
    count: "১২০+ কর্মী",
    tone: "blue",
  },
  {
    id: "mason",
    name: "রাজমিস্ত্রি",
    description: "দক্ষ রাজমিস্ত্রি ও মিস্ত্রি",
    icon: Hammer,
    count: "২৫০+ কর্মী",
    tone: "slate",
  },
  {
    id: "electrician",
    name: "ইলেকট্রিশিয়ান",
    description: "বাড়ি ও বাণিজ্যিক বৈদ্যুতিক কাজ",
    icon: Zap,
    count: "১৮০+ কর্মী",
    tone: "amber",
  },
  {
    id: "plumber",
    name: "প্লাম্বার",
    description: "পাইপলাইন ও স্যানিটারি কাজ",
    icon: Wrench,
    count: "১৪০+ কর্মী",
    tone: "cyan",
  },
  {
    id: "technician",
    name: "এসি / ফ্রিজ টেকনিশিয়ান",
    description: "এসি, ফ্রিজ ও ইলেকট্রনিক্স",
    icon: Snowflake,
    count: "৯০+ কর্মী",
    tone: "sky",
  },
  {
    id: "welder",
    name: "ওয়েল্ডার",
    description: "ওয়েল্ডিং ও মেটালের কাজ",
    icon: Flame,
    count: "৭৫+ কর্মী",
    tone: "orange",
  },
  {
    id: "carpenter",
    name: "কাঠমিস্ত্রি",
    description: "কাঠ ও ফার্নিচারের কাজ",
    icon: Hammer,
    count: "১১০+ কর্মী",
    tone: "violet",
  },
  {
    id: "driver",
    name: "ড্রাইভার",
    description: "বিভিন্ন ধরনের যানবাহনের চালক",
    icon: Car,
    count: "২০০+ কর্মী",
    tone: "indigo",
  },
  {
    id: "it",
    name: "আইটি পেশাজীবী",
    description: "প্রযুক্তি, সফটওয়্যার ও ডিজিটাল সেবা",
    icon: Laptop,
    count: "৬০+ কর্মী",
    tone: "blue",
  },
  {
    id: "teacher",
    name: "শিক্ষক ও প্রশিক্ষক",
    description: "শিক্ষক, প্রশিক্ষক ও শিক্ষা পেশাজীবী",
    icon: GraduationCap,
    count: "৮০+ কর্মী",
    tone: "emerald",
  },
  {
    id: "healthcare",
    name: "স্বাস্থ্যসেবা পেশাজীবী",
    description: "স্বাস্থ্যসেবা ও চিকিৎসা সহায়তাকারী",
    icon: HeartPulse,
    count: "৫০+ কর্মী",
    tone: "rose",
  },
  {
    id: "engineer",
    name: "ইঞ্জিনিয়ার",
    description: "বিভিন্ন ক্ষেত্রের প্রকৌশলী",
    icon: Building2,
    count: "৭০+ কর্মী",
    tone: "indigo",
  },
  {
    id: "supplier",
    name: "সরবরাহকারী ও সেবা প্রদানকারী",
    description: "পণ্য, সরঞ্জাম ও বিভিন্ন সেবা প্রদানকারী",
    icon: PackageCheck,
    count: "৯০+ সেবা",
    tone: "cyan",
  },
];

const toneStyles: Record<
  string,
  {
    icon: string;
    iconHover: string;
    badge: string;
    line: string;
  }
> = {
  blue: {
    icon: "bg-blue-50 text-blue-600",
    iconHover: "group-hover:bg-blue-600 group-hover:text-white",
    badge: "bg-blue-50 text-blue-600",
    line: "from-blue-500 to-cyan-400",
  },

  slate: {
    icon: "bg-slate-100 text-slate-700",
    iconHover: "group-hover:bg-slate-800 group-hover:text-white",
    badge: "bg-slate-100 text-slate-600",
    line: "from-slate-700 to-blue-500",
  },

  amber: {
    icon: "bg-amber-50 text-amber-600",
    iconHover: "group-hover:bg-amber-500 group-hover:text-white",
    badge: "bg-amber-50 text-amber-600",
    line: "from-amber-400 to-orange-400",
  },

  cyan: {
    icon: "bg-cyan-50 text-cyan-600",
    iconHover: "group-hover:bg-cyan-600 group-hover:text-white",
    badge: "bg-cyan-50 text-cyan-600",
    line: "from-cyan-500 to-blue-500",
  },

  sky: {
    icon: "bg-sky-50 text-sky-600",
    iconHover: "group-hover:bg-sky-600 group-hover:text-white",
    badge: "bg-sky-50 text-sky-600",
    line: "from-sky-500 to-blue-500",
  },

  orange: {
    icon: "bg-orange-50 text-orange-500",
    iconHover: "group-hover:bg-orange-500 group-hover:text-white",
    badge: "bg-orange-50 text-orange-600",
    line: "from-orange-500 to-amber-400",
  },

  violet: {
    icon: "bg-violet-50 text-violet-600",
    iconHover: "group-hover:bg-violet-600 group-hover:text-white",
    badge: "bg-violet-50 text-violet-600",
    line: "from-violet-500 to-blue-500",
  },

  indigo: {
    icon: "bg-indigo-50 text-indigo-600",
    iconHover: "group-hover:bg-indigo-600 group-hover:text-white",
    badge: "bg-indigo-50 text-indigo-600",
    line: "from-indigo-500 to-blue-500",
  },

  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    iconHover: "group-hover:bg-emerald-600 group-hover:text-white",
    badge: "bg-emerald-50 text-emerald-600",
    line: "from-emerald-500 to-cyan-500",
  },

  rose: {
    icon: "bg-rose-50 text-rose-600",
    iconHover: "group-hover:bg-rose-600 group-hover:text-white",
    badge: "bg-rose-50 text-rose-600",
    line: "from-rose-500 to-orange-400",
  },
};

export function CategoriesGrid() {
  return (
    <section
      id="categories"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-24"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* SECTION HEADER */}
        <FadeIn>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-blue-600" />

                <span className="text-xs font-bold tracking-[0.12em] text-blue-700">
                  দক্ষ কর্মী ও পেশাজীবী
                </span>
              </div>

              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                আপনার প্রয়োজনের
                <span className="text-blue-600"> সঠিক কর্মী </span>
                খুঁজে নিন
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                নির্মাণ শ্রমিক থেকে শুরু করে টেকনিশিয়ান, ড্রাইভার,
                ইঞ্জিনিয়ার, শিক্ষক, আইটি পেশাজীবী ও বিভিন্ন পেশার
                দক্ষ কর্মী—এক প্ল্যাটফর্মেই খুঁজে নিন আপনার প্রয়োজনের মানুষ।
              </p>

            </div>

            <Link
              href="/workers"
              className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              সব কর্মী দেখুন

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

          </div>
        </FadeIn>

        {/* CATEGORY CARDS */}
        <StaggerContainer className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">

          {categories.map((category) => {
            const Icon = category.icon;
            const style = toneStyles[category.tone];

            return (
              <StaggerItem key={category.id}>

                <Link
                  href={`/workers?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] sm:p-6"
                >

                  {/* Premium top line */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${style.line} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Decorative circle */}
                  <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-150" />

                  {/* Icon + count */}
                  <div className="relative z-10 flex items-start justify-between">

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${style.icon} ${style.iconHover}`}
                    >
                      <Icon
                        className="h-7 w-7"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${style.badge}`}
                    >
                      {category.count}
                    </span>

                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-5">

                    <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-700 sm:text-lg">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                      {category.description}
                    </p>

                  </div>

                  {/* Action */}
                  <div className="relative z-10 mt-auto pt-5">

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors group-hover:text-blue-600">
                      কর্মী দেখুন

                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>

                  </div>

                </Link>

              </StaggerItem>
            );
          })}

        </StaggerContainer>

      </div>
    </section>
  );
}