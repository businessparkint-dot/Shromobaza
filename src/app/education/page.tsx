"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Search,
  PlayCircle,
  Users,
  Library,
  Award,
  Plus,
} from "lucide-react";

type EducationItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "course" | "class" | "lecture" | "book" | "research";
  access: "free" | "paid";
  price?: number;
  teacher: string;
  students: string;
};

const categories = [
  "All",
  "Courses",
  "Classes",
  "Lectures",
  "Books",
  "Research",
  "Skills",
];

const demoItems: EducationItem[] = [
  {
    id: "1",
    title: "Basic Computer & Digital Skills",
    description:
      "Learn computer basics, internet, email and essential digital skills.",
    category: "Skills",
    type: "course",
    access: "free",
    teacher: "Shromo Academy",
    students: "1.2K",
  },
  {
    id: "2",
    title: "English Communication",
    description:
      "Practical English speaking and communication lessons for everyday life.",
    category: "Classes",
    type: "class",
    access: "paid",
    price: 500,
    teacher: "English Mentor",
    students: "840",
  },
  {
    id: "3",
    title: "Construction Site Safety",
    description:
      "Important safety knowledge for workers, supervisors and construction professionals.",
    category: "Courses",
    type: "course",
    access: "free",
    teacher: "Industry Expert",
    students: "620",
  },
  {
    id: "4",
    title: "Business & Entrepreneurship",
    description:
      "Learn practical business planning, marketing and entrepreneurship.",
    category: "Lectures",
    type: "lecture",
    access: "paid",
    price: 800,
    teacher: "Business Mentor",
    students: "1.5K",
  },
];

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return demoItems.filter((item) => {
      const categoryMatch =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const searchMatch =
        !keyword ||
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.teacher.toLowerCase().includes(keyword);

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, search]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              <GraduationCap className="h-4 w-4" />
              SHROMO EDUCATION
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Learn. Create. Grow.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
              Courses, classes, lectures, books, research and practical
              knowledge—all in one connected education platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#discover"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Explore Education
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="#publish"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-3 font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
                Teach / Publish
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpen,
              value: "Courses",
              label: "Learn practical skills",
            },
            {
              icon: PlayCircle,
              value: "Lectures",
              label: "Learn from experts",
            },
            {
              icon: Library,
              value: "Books",
              label: "Knowledge library",
            },
            {
              icon: Award,
              value: "Research",
              label: "Ideas & discoveries",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.value}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      {item.value}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DISCOVER */}
      <section
        id="discover"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Discover
            </p>

            <h2 className="mt-2 text-3xl font-black text-slate-900">
              Knowledge for Everyone
            </h2>

            <p className="mt-2 max-w-2xl text-slate-600">
              Find useful learning resources, teachers, courses and knowledge.
            </p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, teachers, books..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-md"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* ITEMS */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-indigo-100 via-violet-100 to-purple-100">
                {item.type === "course" ? (
                  <BookOpen className="h-14 w-14 text-indigo-600" />
                ) : item.type === "lecture" ? (
                  <PlayCircle className="h-14 w-14 text-violet-600" />
                ) : item.type === "book" ? (
                  <Library className="h-14 w-14 text-purple-600" />
                ) : (
                  <GraduationCap className="h-14 w-14 text-indigo-600" />
                )}

                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                  {item.access === "free"
                    ? "FREE"
                    : `৳${item.price?.toLocaleString("en-BD")}`}
                </span>
              </div>

              <div className="p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                    {item.category}
                  </span>

                  <span className="text-xs text-slate-400">
                    {item.type}
                  </span>
                </div>

                <h3 className="line-clamp-2 text-lg font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <Users className="h-4 w-4" />
                  {item.students} learners
                </div>

                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-sm font-bold text-slate-700">
                    {item.teacher}
                  </p>

                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    View & Learn
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-bold text-slate-800">
              No learning content found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another search or category.
            </p>
          </div>
        )}
      </section>

      {/* TEACH / PUBLISH */}
      <section
        id="publish"
        className="border-t border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 p-8 sm:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm">
                  <GraduationCap className="h-4 w-4" />
                  FOR TEACHERS & CREATORS
                </div>

                <h2 className="mt-4 text-3xl font-black text-slate-900">
                  Turn Your Knowledge Into Value
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Teachers, instructors, researchers and creators can publish
                  courses, classes, lectures, books and research and reach
                  learners through Shromo Education.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5" />
                Publish Your Knowledge
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER NOTE */}
      <section className="bg-slate-900 px-4 py-10 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h3 className="text-2xl font-black">
            Shromo Education
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            A connected education ecosystem for learners, teachers,
            creators, researchers and institutions.
          </p>
        </div>
      </section>
    </main>
  );
}
