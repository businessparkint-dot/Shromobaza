"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  Clock,
  Globe2,
  Heart,
  Lightbulb,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

type KnowledgeItem = {
  id: number;
  title: string;
  category: string;
  description: string;
  author: string;
  readTime: string;
  rating: number;
  views: string;
  badge?: string;
  emoji: string;
};

const categories = [
  "সব",
  "দক্ষতা",
  "ব্যবসা",
  "প্রযুক্তি",
  "ক্যারিয়ার",
  "কৃষি",
  "স্বাস্থ্য",
  "ইতিহাস",
  "জীবন ও সমাজ",
];

const knowledgeItems: KnowledgeItem[] = [
  {
    id: 1,
    title: "কীভাবে একটি ছোট ব্যবসা শুরু করবেন",
    category: "ব্যবসা",
    description:
      "ছোট মূলধন থেকে ব্যবসার ধারণা, পরিকল্পনা, customer research এবং sustainable growth-এর প্রাথমিক ধারণা।",
    author: "Shromobazar Knowledge",
    readTime: "8 min",
    rating: 4.9,
    views: "12.4K",
    badge: "Popular",
    emoji: "💼",
  },
  {
    id: 2,
    title: "ডিজিটাল যুগে প্রয়োজনীয় দক্ষতা",
    category: "দক্ষতা",
    description:
      "বর্তমান workforce-এ communication, digital literacy, problem solving এবং practical skills-এর গুরুত্ব।",
    author: "Skill Research Team",
    readTime: "6 min",
    rating: 4.8,
    views: "9.8K",
    badge: "Featured",
    emoji: "🧠",
  },
  {
    id: 3,
    title: "কৃষিতে আধুনিক প্রযুক্তির ব্যবহার",
    category: "কৃষি",
    description:
      "Smart farming, data, irrigation technology এবং sustainable agriculture নিয়ে প্রাথমিক ধারণা।",
    author: "Agri Knowledge",
    readTime: "10 min",
    rating: 4.7,
    views: "7.2K",
    emoji: "🌱",
  },
  {
    id: 4,
    title: "AI ও ভবিষ্যতের চাকরির বাজার",
    category: "প্রযুক্তি",
    description:
      "Artificial Intelligence কীভাবে কাজের ধরন পরিবর্তন করছে এবং কোন ধরনের দক্ষতা ভবিষ্যতে গুরুত্বপূর্ণ হতে পারে।",
    author: "Technology Desk",
    readTime: "9 min",
    rating: 4.9,
    views: "18.6K",
    badge: "Trending",
    emoji: "🤖",
  },
  {
    id: 5,
    title: "সফল Career Planning-এর ভিত্তি",
    category: "ক্যারিয়ার",
    description:
      "নিজের দক্ষতা, লক্ষ্য, অভিজ্ঞতা ও market demand বিবেচনা করে career path তৈরি করার framework।",
    author: "Career Guide",
    readTime: "7 min",
    rating: 4.8,
    views: "8.5K",
    emoji: "🎯",
  },
  {
    id: 6,
    title: "স্বাস্থ্যকর জীবনযাপনের মৌলিক ধারণা",
    category: "স্বাস্থ্য",
    description:
      "দৈনন্দিন জীবন, খাদ্যাভ্যাস, ঘুম, physical activity ও preventive health সম্পর্কে সাধারণ জ্ঞান।",
    author: "Health Knowledge",
    readTime: "5 min",
    rating: 4.7,
    views: "15.1K",
    emoji: "❤️",
  },
  {
    id: 7,
    title: "সভ্যতার ইতিহাস থেকে শিক্ষা",
    category: "ইতিহাস",
    description:
      "মানব সভ্যতার পরিবর্তন, innovation এবং সামাজিক উন্নয়নের কিছু গুরুত্বপূর্ণ শিক্ষা।",
    author: "Civilization Desk",
    readTime: "11 min",
    rating: 4.9,
    views: "6.9K",
    emoji: "🏛️",
  },
  {
    id: 8,
    title: "সমাজে জ্ঞান ও সহযোগিতার ভূমিকা",
    category: "জীবন ও সমাজ",
    description:
      "একটি উন্নত সমাজ গঠনে শিক্ষা, সহযোগিতা, দায়িত্ববোধ এবং community participation-এর গুরুত্ব।",
    author: "Social Knowledge",
    readTime: "6 min",
    rating: 4.8,
    views: "5.7K",
    emoji: "🤝",
  },
];

const featuredPaths = [
  {
    title: "Career & Skills",
    text: "কাজের জন্য প্রয়োজনীয় practical skills ও career knowledge।",
    icon: Award,
    tone: "blue",
  },
  {
    title: "Business Knowledge",
    text: "Business, entrepreneurship ও market সম্পর্কে জানুন।",
    icon: TrendingUp,
    tone: "emerald",
  },
  {
    title: "Technology",
    text: "AI, digital technology ও future skills অন্বেষণ করুন।",
    icon: Lightbulb,
    tone: "violet",
  },
];

const toneClasses: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-blue-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
};

export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState("সব");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<KnowledgeItem | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase().trim();

    return knowledgeItems.filter((item) => {
      const categoryMatch =
        activeCategory === "সব" || item.category === activeCategory;

      const searchMatch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  const toggleSave = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-950 to-emerald-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.15),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-2 text-sm font-bold text-indigo-300">
                <BookOpen className="h-4 w-4" />
                Shromobazar Knowledge
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
                জ্ঞান শিখুন,
                <br />
                <span className="text-indigo-400">
                  দক্ষতা বাড়ান, এগিয়ে যান।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Career, business, technology, agriculture, health, society
                এবং everyday life—প্রয়োজনীয় knowledge সহজভাবে খুঁজে পাওয়ার
                একটি global knowledge ecosystem।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("knowledge")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-400 px-5 py-3 font-black text-indigo-950 transition hover:bg-indigo-300"
                >
                  <Search className="h-5 w-5" />
                  Explore Knowledge
                </button>

                <button
                  onClick={() => setShowShare(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
                >
                  <Sparkles className="h-5 w-5" />
                  Share Knowledge
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-4">
                <Stat icon="📚" value="1,000+" label="Knowledge Topics" />
                <Stat icon="🧠" value="250+" label="Skill Guides" />
                <Stat icon="🌍" value="Global" label="Knowledge Base" />
                <Stat icon="👥" value="Community" label="Contributors" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LEARNING PATHS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-widest text-indigo-600">
            Learning Paths
          </p>

          <h2 className="mt-1 text-3xl font-black">
            কোথা থেকে শুরু করবেন?
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredPaths.map((path) => {
            const Icon = path.icon;

            return (
              <button
                key={path.title}
                onClick={() => setSearch(path.title.split(" ")[0])}
                className={`group rounded-2xl border p-6 text-left transition hover:-translate-y-1 hover:shadow-lg ${toneClasses[path.tone]}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>

                  <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </div>

                <h3 className="mt-5 text-xl font-black">{path.title}</h3>

                <p className="mt-2 text-sm leading-7 opacity-75">
                  {path.text}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* SEARCH */}
      <section className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Knowledge, skill, business, technology বা career খুঁজুন..."
              className="w-full rounded-xl bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </section>

      {/* KNOWLEDGE GRID */}
      <section
        id="knowledge"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-indigo-600">
              Knowledge Library
            </p>

            <h2 className="mt-1 text-3xl font-black">
              Learn Something Useful
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredItems.length}টি knowledge resource পাওয়া গেছে
            </p>
          </div>

          {saved.length > 0 && (
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
              <Bookmark className="h-4 w-4" />
              {saved.length} Saved
            </div>
          )}
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item) => {
              const isSaved = saved.includes(item.id);

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
                    <span className="text-6xl transition duration-300 group-hover:scale-110">
                      {item.emoji}
                    </span>

                    {item.badge && (
                      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-indigo-700 shadow-sm">
                        {item.badge}
                      </span>
                    )}

                    <button
                      onClick={() => toggleSave(item.id)}
                      className={`absolute right-3 top-3 rounded-full p-2 shadow-sm transition ${
                        isSaved
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-slate-400 hover:text-indigo-600"
                      }`}
                      aria-label="Save knowledge"
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          isSaved ? "fill-white" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-5">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                      {item.category}
                    </span>

                    <h3 className="mt-2 line-clamp-2 text-lg font-black">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {item.readTime}
                      </span>

                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {item.rating}
                      </span>

                      <span>{item.views} views</span>
                    </div>

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-black text-white transition hover:bg-indigo-600"
                    >
                      Read Knowledge
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
            <Search className="mx-auto h-12 w-12 text-slate-300" />

            <h3 className="mt-4 text-xl font-black">
              কোনো knowledge পাওয়া যায়নি
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              অন্য keyword অথবা category দিয়ে চেষ্টা করুন।
            </p>
          </div>
        )}
      </section>

      {/* KNOWLEDGE COMMUNITY */}
      <section className="border-y border-indigo-100 bg-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-black text-indigo-700">
                <Users className="h-4 w-4" />
                Community Knowledge
              </div>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                আপনি যা জানেন,
                <br />
                <span className="text-indigo-600">
                  তা অন্যদের শেখান।
                </span>
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                ভবিষ্যতে verified experts, professionals, teachers,
                researchers ও community contributors নিজেদের knowledge,
                guides এবং educational resources publish করতে পারবেন।
              </p>
            </div>

            <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                  <Globe2 className="h-7 w-7" />
                </div>

                <div>
                  <h3 className="font-black">
                    Global Knowledge Network
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Local knowledge থেকে global learning ecosystem তৈরি
                    করার লক্ষ্য।
                  </p>

                  <button
                    onClick={() => setShowShare(true)}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-black text-indigo-700"
                  >
                    Become a Contributor
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURE ECOSYSTEM */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-400/10 px-4 py-2 text-sm font-bold text-indigo-300">
                <Sparkles className="h-4 w-4" />
                Future Ecosystem
              </div>

              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                Knowledge থেকে
                <br />
                <span className="text-indigo-400">
                  Skills, Books & Research।
                </span>
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Knowledge module ভবিষ্যতে Research & Concept, Creator &
                Books Library, Courses, Experts, Chat এবং News Feed-এর সঙ্গে
                connected ecosystem হিসেবে কাজ করবে।
              </p>
            </div>

            <button
              onClick={() =>
                window.alert(
                  "Knowledge ecosystem ready. Research, Books, Creator ও Course modules পরবর্তী ধাপে connected হবে।"
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-400 px-6 py-4 font-black text-indigo-950 hover:bg-indigo-300"
            >
              Explore Future
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ARTICLE MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-indigo-600">
                  {selectedItem.category}
                </p>

                <h3 className="mt-1 text-xl font-black">
                  {selectedItem.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-4xl">
                  {selectedItem.emoji}
                </div>

                <div>
                  <p className="font-black">{selectedItem.author}</p>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {selectedItem.readTime}
                    </span>

                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {selectedItem.rating}
                    </span>

                    <span>{selectedItem.views} views</span>
                  </div>
                </div>
              </div>

              <p className="leading-8 text-slate-600">
                {selectedItem.description}
              </p>

              <div className="rounded-2xl bg-indigo-50 p-5">
                <p className="text-sm leading-7 text-indigo-900">
                  এই knowledge resource-এর পূর্ণ article, references,
                  multimedia content, author profile এবং discussion
                  ভবিষ্যতে central Knowledge Database থেকে load হবে।
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => toggleSave(selectedItem.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-black hover:bg-slate-50"
                >
                  <Bookmark className="h-5 w-5" />
                  {saved.includes(selectedItem.id)
                    ? "Saved"
                    : "Save Knowledge"}
                </button>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-black text-white hover:bg-indigo-700"
                >
                  Close
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-indigo-600">
                  Contributor
                </p>

                <h3 className="mt-1 text-xl font-black">
                  Share Your Knowledge
                </h3>
              </div>

              <button
                onClick={() => {
                  setShowShare(false);
                  setSubmitted(false);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-8 w-8" />
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    Submission Ready
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    আপনার knowledge submission গ্রহণের UI প্রস্তুত।
                    পরবর্তী ধাপে verification ও database connection যুক্ত
                    করা হবে।
                  </p>
                </div>
              ) : (
                <>
                  <FormInput
                    label="Knowledge Title"
                    placeholder="যেমন: কীভাবে একজন দক্ষ electrician হওয়া যায়"
                  />

                  <FormInput
                    label="Category"
                    placeholder="Skills / Business / Technology"
                  />

                  <FormInput
                    label="Your Name / Organization"
                    placeholder="আপনার নাম বা প্রতিষ্ঠানের নাম"
                  />

                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">
                      Knowledge Summary
                    </span>

                    <textarea
                      rows={5}
                      placeholder="আপনার knowledge, experience বা research সম্পর্কে লিখুন..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                    />
                  </label>

                  <button
                    onClick={() => setSubmitted(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-black text-white hover:bg-indigo-700"
                  >
                    Submit Knowledge
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-400">{label}</p>
    </div>
  );
}

function FormInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <input
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
    </label>
  );
}