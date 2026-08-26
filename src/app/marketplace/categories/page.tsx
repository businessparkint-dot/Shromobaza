"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, Grid3X3 } from "lucide-react";

const categories = [
  "Electronics",
  "Clothing",
  "Food",
  "Home & Furniture",
  "Construction",
  "Services",
  "Agriculture",
  "Vehicles",
  "Other",
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-7 sm:px-6">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-xs font-black text-slate-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Marketplace
        </Link>

        <div className="mt-7">
          <h1 className="text-2xl font-black text-[#07152d]">
            Categories
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Browse marketplace categories.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/marketplace/posts?category=${encodeURIComponent(category)}`}
              className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:bg-orange-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white">
                <Grid3X3 className="h-4 w-4" />
              </div>

              <span className="flex-1 text-xs font-black text-slate-700">
                {category}
              </span>

              <ChevronRight className="h-4 w-4 text-slate-300" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}