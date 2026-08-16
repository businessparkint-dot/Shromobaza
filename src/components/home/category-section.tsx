"use client";

import Link from "next/link";
import {
  HardHat,
  Hammer,
  Truck,
  Wrench,
  Package,
  Building2,
  Users,
  Globe2,
  Scale,
  Stethoscope,
  GraduationCap,
  Laptop,
  ArrowRight,
} from "lucide-react";

import { workers } from "@/lib/database";

const categories = [
  {
    name: "ইঞ্জিনিয়ার",
    title: "ইঞ্জিনিয়ার ডিপার্টমেন্ট",
    description: "সিভিল, কম্পিউটার, অটোমোবাইল ও অন্যান্য ইঞ্জিনিয়ার",
    icon: HardHat,
  },
  {
    name: "মিস্ত্রি",
    title: "মিস্ত্রি",
    description: "রাজমিস্ত্রি, টাইলস, রং, ইলেকট্রিক, স্যানিটারি ও অন্যান্য",
    icon: Hammer,
  },
  {
    name: "অপারেটর",
    title: "অপারেটর",
    description: "পাইল, এক্সকাভেটর, কম্পিউটার ও যানবাহন অপারেটর",
    icon: Truck,
  },
  {
    name: "টেকনিশিয়ান",
    title: "টেকনিশিয়ান",
    description: "অটোমোবাইল, CCTV, AC, মেডিকেল ও অন্যান্য টেকনিশিয়ান",
    icon: Wrench,
  },
  {
    name: "সরবরাহকারী ও সার্ভিস",
    title: "সরবরাহকারী ও সার্ভিস",
    description: "নির্মাণ, পোশাক, ইট, বালি, সিমেন্ট ও বিভিন্ন সার্ভিস",
    icon: Package,
  },
  {
    name: "কন্ট্রাক্টর ও নিয়োগদাতা",
    title: "কন্ট্রাক্টর ও নিয়োগদাতা",
    description: "ঠিকাদার, সাব-কন্ট্রাক্টর ও নিয়োগদাতা",
    icon: Building2,
  },
  {
    name: "দেশীয় শ্রমিক",
    title: "দেশের অভ্যন্তরীণ শ্রমিক",
    description: "নির্মাণ, কৃষি, গার্মেন্টস, পরিবহন ও সাধারণ শ্রমিক",
    icon: Users,
  },
  {
    name: "বিদেশে কর্মরত শ্রমিক",
    title: "বিদেশে কর্মরত শ্রমিক",
    description: "UAE, Saudi Arabia ও অন্যান্য দেশে কর্মরত বাংলাদেশি",
    icon: Globe2,
  },
  {
    name: "আইনজীবী",
    title: "আইনজীবী ও উকিল",
    description: "সিভিল, ক্রিমিনাল ও অন্যান্য আইনজীবী",
    icon: Scale,
  },
  {
    name: "ডাক্তার",
    title: "ডাক্তার",
    description: "বিভিন্ন বিশেষজ্ঞ ডাক্তার ও চিকিৎসা পেশাজীবী",
    icon: Stethoscope,
  },
  {
    name: "টিউশন শিক্ষক",
    title: "টিউশন শিক্ষক",
    description: "ইংরেজি, বিজ্ঞান, হিসাববিজ্ঞানসহ বিভিন্ন শিক্ষক",
    icon: GraduationCap,
  },
  {
    name: "IT ও ডিজিটাল এক্সপার্ট",
    title: "IT ও ডিজিটাল এক্সপার্ট",
    description: "IT, ডিজিটাল মার্কেটিং ও গ্রাফিক্স ডিজাইনার",
    icon: Laptop,
  },
];

export default function CategorySection() {
  return (
    <section className="w-full bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            শ্রমবাজার ক্যাটাগরি
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            আপনার প্রয়োজনের পেশাজীবী খুঁজুন
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            দক্ষ শ্রমিক, ইঞ্জিনিয়ার, টেকনিশিয়ান, ডাক্তার, আইনজীবীসহ
            বিভিন্ন পেশার মানুষকে সহজেই খুঁজে নিন।
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            const count = workers.filter((worker) => {
              if (category.name === "দেশীয় শ্রমিক") {
                return (
                  worker.category.includes("শ্রমিক") ||
                  worker.category.includes("গার্মেন্টস")
                );
              }

              if (category.name === "বিদেশে কর্মরত শ্রমিক") {
                return (
                  worker.location.includes("UAE") ||
                  worker.location.includes("Saudi") ||
                  worker.location.includes("KSA")
                );
              }

              return (
                worker.category
                  .toLowerCase()
                  .includes(category.name.toLowerCase())
              );
            }).length;

            return (
              <Link
                key={category.name}
                href={`/workers?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group"
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl">

                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={28} strokeWidth={1.8} />
                    </div>

                    <ArrowRight
                      size={20}
                      className="text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-600"
                    />
                  </div>

                  {/* Text */}
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {category.title}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>

                  {/* Count */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-medium text-slate-500">
                      নিবন্ধিত পেশাজীবী
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                      {count} জন
                    </span>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}