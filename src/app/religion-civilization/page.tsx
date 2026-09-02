"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Clock3,
  Globe2,
  Landmark,
  Library,
  Map,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

type Category =
  | "all"
  | "religion"
  | "civilization"
  | "history"
  | "heritage"
  | "philosophy";

type KnowledgeItem = {
  id: number;
  title: string;
  subtitle: string;
  category: Exclude<Category, "all">;
  icon: React.ElementType;
  tag: string;
  readTime: string;
  featured?: boolean;
};

const categories: {
  id: Category;
  bn: string;
  en: string;
}[] = [
  { id: "all", bn: "সবকিছু", en: "Explore All" },
  { id: "religion", bn: "ধর্ম", en: "Religion" },
  { id: "civilization", bn: "সভ্যতা", en: "Civilization" },
  { id: "history", bn: "ইতিহাস", en: "History" },
  { id: "heritage", bn: "ঐতিহ্য", en: "Heritage" },
  { id: "philosophy", bn: "দর্শন", en: "Philosophy" },
];

const knowledgeItems: KnowledgeItem[] = [
  {
    id: 1,
    title: "মানবসভ্যতার দীর্ঘ যাত্রা",
    subtitle:
      "প্রাচীন নগর, কৃষি, জ্ঞান, বাণিজ্য ও সামাজিক কাঠামোর মাধ্যমে সভ্যতার বিকাশ।",
    category: "civilization",
    icon: Landmark,
    tag: "Civilization",
    readTime: "8 min",
    featured: true,
  },
  {
    id: 2,
    title: "ধর্ম ও মানবসমাজ",
    subtitle:
      "মানুষের নৈতিকতা, সংস্কৃতি, সমাজ ও মূল্যবোধ গঠনে ধর্মের ঐতিহাসিক ভূমিকা।",
    category: "religion",
    icon: BookOpen,
    tag: "Religion",
    readTime: "7 min",
  },
  {
    id: 3,
    title: "প্রাচীন বিশ্বের জ্ঞানকেন্দ্র",
    subtitle:
      "গ্রন্থাগার, শিক্ষাকেন্দ্র, গবেষণা ও জ্ঞান সংরক্ষণের ঐতিহাসিক ধারার পরিচিতি।",
    category: "history",
    icon: Library,
    tag: "History",
    readTime: "6 min",
  },
  {
    id: 4,
    title: "বিশ্বের সাংস্কৃতিক ঐতিহ্য",
    subtitle:
      "স্থাপত্য, ভাষা, শিল্প, সংগীত ও লোকজ সংস্কৃতির মাধ্যমে মানুষের পরিচয়।",
    category: "heritage",
    icon: Globe2,
    tag: "Heritage",
    readTime: "9 min",
  },
  {
    id: 5,
    title: "নৈতিকতা, দর্শন ও জীবন",
    subtitle:
      "মানুষের ভালো-মন্দ, ন্যায়, দায়িত্ব ও জীবনের উদ্দেশ্য নিয়ে বিভিন্ন দার্শনিক ভাবনা।",
    category: "philosophy",
    icon: Sparkles,
    tag: "Philosophy",
    readTime: "10 min",
  },
  {
    id: 6,
    title: "সভ্যতার উত্থান ও পরিবর্তন",
    subtitle:
      "অর্থনীতি, প্রযুক্তি, পরিবেশ ও রাজনৈতিক পরিবর্তনের সঙ্গে সভ্যতার রূপান্তর।",
    category: "civilization",
    icon: Map,
    tag: "Civilization",
    readTime: "8 min",
  },
];

const civilizations = [
  {
    name: "মেসোপটেমিয়া",
    en: "Mesopotamia",
    period: "c. 3500 BCE",
    description:
      "নগরসভ্যতা, লিখনপদ্ধতি, আইন ও প্রাথমিক প্রশাসনিক কাঠামোর গুরুত্বপূর্ণ কেন্দ্র।",
  },
  {
    name: "প্রাচীন মিশর",
    en: "Ancient Egypt",
    period: "c. 3100 BCE",
    description:
      "নাইল নদীকেন্দ্রিক সমাজ, স্থাপত্য, জ্ঞান, শিল্প ও প্রশাসনের এক বিস্ময়কর ঐতিহ্য।",
  },
  {
    name: "সিন্ধু সভ্যতা",
    en: "Indus Civilization",
    period: "c. 2500 BCE",
    description:
      "পরিকল্পিত নগর, পানি ব্যবস্থাপনা, কারুশিল্প ও দীর্ঘ দূরত্বের বাণিজ্যের জন্য পরিচিত।",
  },
  {
    name: "প্রাচীন গ্রিস",
    en: "Ancient Greece",
    period: "c. 800 BCE",
    description:
      "দর্শন, রাজনীতি, বিজ্ঞান, সাহিত্য ও শিল্পের ইতিহাসে গভীর প্রভাব রেখেছে।",
  },
];

export default function ReligionCivilizationPage() {
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return knowledgeItems.filter((item) => {
      const categoryMatch =
        category === "all" || item.category === category;

      const searchMatch =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle.toLowerCase().includes(normalized) ||
        item.tag.toLowerCase().includes(normalized);

      return categoryMatch && searchMatch;
    });
  }, [category, query]);

  const toggleSaved = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

  return (
    <main className="min-h-screen bg-[#F8FFFC] text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#065F46]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.25),transparent_32%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.10),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-emerald-100">
            <Landmark className="h-4 w-4" />
            <span>Smart Explore</span>
            <ChevronRight className="h-4 w-4 opacity-60" />
            <span>Religion & Civilization</span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-50 backdrop-blur">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                Knowledge • Culture • Civilization
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                ধর্ম, ইতিহাস ও সভ্যতার
                <span className="block text-emerald-300">
                  জ্ঞানভান্ডার এক জায়গায়।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-emerald-50/85 sm:text-lg">
                পৃথিবীর বিভিন্ন ধর্ম, সভ্যতা, ইতিহাস, ঐতিহ্য ও দর্শন সম্পর্কে
                শেখা, অনুসন্ধান এবং জ্ঞান ভাগাভাগির জন্য একটি শান্তিপূর্ণ
                knowledge platform।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("explore")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[#065F46] shadow-xl transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  Explore Knowledge
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setShowTimeline(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <Clock3 className="h-4 w-4" />
                  Civilization Timeline
                </button>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[1.5rem] bg-[#ECFDF5] p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#059669]">
                        Global Knowledge
                      </p>
                      <h2 className="mt-2 text-2xl font-black text-[#065F46]">
                        Explore Human Civilization
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-[#D1FAE5] p-3 text-[#065F46]">
                      <Globe2 className="h-7 w-7" />
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-2 gap-3">
                    {[
                      ["ধর্ম", "Religion"],
                      ["সভ্যতা", "Civilization"],
                      ["ইতিহাস", "History"],
                      ["ঐতিহ্য", "Heritage"],
                    ].map(([bn, en]) => (
                      <div
                        key={en}
                        className="rounded-2xl border border-emerald-100 bg-white p-4"
                      >
                        <p className="font-black text-[#065F46]">{bn}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-500">
                          {en}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#065F46] p-4 text-white">
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                    <p className="text-xs font-semibold leading-5 text-emerald-50">
                      Respectful • Educational • Peaceful • Evidence-aware
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-1">
              <Search className="h-5 w-5 text-slate-400" />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ধর্ম, সভ্যতা, ইতিহাস, ঐতিহ্য বা দর্শন খুঁজুন..."
                className="h-12 min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Explore */}
      <section id="explore" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#059669]">
              Explore Knowledge
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#065F46] sm:text-4xl">
              জ্ঞান অনুসন্ধান করুন
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600">
              আপনার আগ্রহ অনুযায়ী বিষয় বেছে নিন এবং বিভিন্ন জ্ঞানভিত্তিক
              কনটেন্ট explore করুন।
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
            <Bookmark className="h-4 w-4 text-[#059669]" />
            <span className="text-sm font-bold text-slate-700">
              Saved: {saved.length}
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const active = category === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-[#059669] bg-[#059669] text-white shadow-lg shadow-emerald-900/10"
                    : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-[#ECFDF5]"
                }`}
              >
                <span className="block text-sm font-black">{item.bn}</span>
                <span
                  className={`block text-[11px] font-semibold ${
                    active ? "text-emerald-100" : "text-slate-400"
                  }`}
                >
                  {item.en}
                </span>
              </button>
            );
          })}
        </div>

        {/* Knowledge cards */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isSaved = saved.includes(item.id);

            return (
              <article
                key={item.id}
                className={`group relative overflow-hidden rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  item.featured
                    ? "border-emerald-200 ring-1 ring-emerald-100"
                    : "border-slate-100"
                }`}
              >
                {item.featured && (
                  <div className="absolute right-4 top-4 rounded-full bg-[#D1FAE5] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#065F46]">
                    Featured
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <button
                    onClick={() => toggleSaved(item.id)}
                    className={`rounded-xl p-2 transition ${
                      isSaved
                        ? "bg-[#D1FAE5] text-[#059669]"
                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    }`}
                    aria-label="Save item"
                  >
                    <Bookmark
                      className="h-5 w-5"
                      fill={isSaved ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <div className="mt-5">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-600">
                    {item.tag}
                  </span>

                  <h3 className="mt-3 text-xl font-black leading-7 text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <Clock3 className="h-4 w-4" />
                    {item.readTime}
                  </div>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="inline-flex items-center gap-1 text-sm font-black text-[#059669] transition group-hover:gap-2"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-white p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-emerald-300" />
            <h3 className="mt-4 text-xl font-black text-slate-800">
              কোনো ফলাফল পাওয়া যায়নি
            </h3>
            <p className="mt-2 text-sm font-medium text-slate-500">
              অন্য কোনো keyword দিয়ে আবার চেষ্টা করুন।
            </p>
          </div>
        )}
      </section>

      {/* Civilization section */}
      <section className="border-y border-emerald-100 bg-[#ECFDF5]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#065F46] text-white">
                <Landmark className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-[#065F46]">
                Civilization Explorer
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                প্রাচীন ও ঐতিহাসিক সভ্যতাগুলোর বিকাশ, সংস্কৃতি, জ্ঞান,
                প্রযুক্তি ও সামাজিক কাঠামো সম্পর্কে জানুন।
              </p>

              <button
                onClick={() => setShowTimeline(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#065F46] px-5 py-3 text-sm font-black text-white transition hover:bg-[#047857]"
              >
                View Timeline
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {civilizations.map((item, index) => (
                <div
                  key={item.name}
                  className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D1FAE5] text-sm font-black text-[#065F46]">
                      {index + 1}
                    </span>

                    <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-black text-[#059669]">
                      {item.period}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-xs font-bold text-[#059669]">
                    {item.en}
                  </p>

                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-[#065F46] p-7 shadow-2xl sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-emerald-300">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-black uppercase tracking-wider">
                  Knowledge Community
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                জ্ঞান শিখুন, আলোচনা করুন, ভাগ করে নিন।
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                ভবিষ্যতে গবেষক, শিক্ষক, শিক্ষার্থী ও জ্ঞান অন্বেষণকারীরা
                আলোচনা, reference এবং educational content শেয়ার করতে পারবেন।
              </p>
            </div>

            <button
              onClick={() =>
                window.alert(
                  "Knowledge Community — এই ফিচারটি পরবর্তী ধাপে চালু করা হবে।"
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-[#065F46] transition hover:bg-emerald-50"
            >
              <Users className="h-5 w-5" />
              Join Community
            </button>
          </div>
        </div>
      </section>

      {/* Footer info */}
      <section className="border-t border-emerald-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-center sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:text-left lg:px-8">
          <div className="flex items-center justify-center gap-2 lg:justify-start">
            <ShieldCheck className="h-5 w-5 text-[#059669]" />
            <p className="text-xs font-semibold text-slate-500">
              Educational & respectful knowledge environment
            </p>
          </div>

          <div className="flex items-center justify-center gap-5 text-xs font-bold text-slate-400">
            <span>Research</span>
            <span>History</span>
            <span>Culture</span>
            <span>Knowledge</span>
          </div>
        </div>
      </section>

      {/* Read modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#059669]">
                  <selectedItem.icon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#059669]">
                    {selectedItem.tag}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    {selectedItem.readTime} read
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-3xl font-black leading-tight text-[#065F46]">
                {selectedItem.title}
              </h2>

              <p className="mt-5 text-base font-medium leading-8 text-slate-600">
                {selectedItem.subtitle}
              </p>

              <div className="mt-7 rounded-2xl border border-emerald-100 bg-[#ECFDF5] p-5">
                <p className="text-sm font-bold leading-7 text-[#065F46]">
                  এই section-টি ভবিষ্যতে বিস্তারিত article, reference,
                  historical sources, multimedia এবং expert contribution-এর
                  মাধ্যমে আরও সমৃদ্ধ করা যাবে।
                </p>
              </div>

              <button
                onClick={() => {
                  toggleSaved(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#065F46] px-5 py-3 text-sm font-black text-white hover:bg-[#047857]"
              >
                <Bookmark className="h-4 w-4" />
                {saved.includes(selectedItem.id)
                  ? "Remove from Saved"
                  : "Save for Later"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline modal */}
      {showTimeline && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#059669]">
                  Civilization Timeline
                </p>
                <h2 className="text-xl font-black text-[#065F46]">
                  মানবসভ্যতার গুরুত্বপূর্ণ পর্যায়
                </h2>
              </div>

              <button
                onClick={() => setShowTimeline(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close timeline"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="space-y-6">
                {[
                  ["c. 3500 BCE", "প্রাথমিক নগরসভ্যতার বিকাশ"],
                  ["c. 2500 BCE", "সিন্ধু ও অন্যান্য নগরসভ্যতার বিকাশ"],
                  ["c. 1500 BCE", "বিভিন্ন আঞ্চলিক সংস্কৃতি ও বাণিজ্যের বিস্তার"],
                  ["c. 800 BCE", "গ্রিক ও অন্যান্য দার্শনিক-সাংস্কৃতিক ধারার উত্থান"],
                  ["পরবর্তী যুগ", "বিজ্ঞান, বাণিজ্য, সাম্রাজ্য ও সংস্কৃতির ধারাবাহিক পরিবর্তন"],
                ].map(([time, title], index) => (
                  <div key={time} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D1FAE5] text-xs font-black text-[#065F46]">
                        {index + 1}
                      </div>

                      {index !== 4 && (
                        <div className="mt-2 h-full w-px bg-emerald-100" />
                      )}
                    </div>

                    <div className="pb-5">
                      <p className="text-xs font-black uppercase tracking-wider text-[#059669]">
                        {time}
                      </p>

                      <h3 className="mt-1 text-lg font-black text-slate-900">
                        {title}
                      </h3>

                      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                        ইতিহাসের ধারায় মানুষের সামাজিক, অর্থনৈতিক ও
                        সাংস্কৃতিক পরিবর্তনের একটি গুরুত্বপূর্ণ ধাপ।
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}