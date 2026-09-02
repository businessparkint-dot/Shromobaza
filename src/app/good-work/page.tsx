"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  HandHeart,
  Heart,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Users,
  X,
} from "lucide-react";

type WorkCategory =
  | "all"
  | "community"
  | "environment"
  | "education"
  | "health"
  | "employment"
  | "humanitarian";

type GoodWork = {
  id: number;
  title: string;
  description: string;
  person: string;
  organization: string;
  location: string;
  category: Exclude<WorkCategory, "all">;
  impact: string;
  supporters: number;
  verified: boolean;
};

const categories: {
  id: WorkCategory;
  bn: string;
  en: string;
}[] = [
  { id: "all", bn: "সব ভালো কাজ", en: "All Good Work" },
  { id: "community", bn: "কমিউনিটি", en: "Community" },
  { id: "environment", bn: "পরিবেশ", en: "Environment" },
  { id: "education", bn: "শিক্ষা", en: "Education" },
  { id: "health", bn: "স্বাস্থ্য", en: "Health" },
  { id: "employment", bn: "কর্মসংস্থান", en: "Employment" },
  { id: "humanitarian", bn: "মানবিক সহায়তা", en: "Humanitarian" },
];

const initialWorks: GoodWork[] = [
  {
    id: 1,
    title: "বন্যার্ত পরিবারের জন্য খাদ্য সহায়তা",
    description:
      "বন্যাকবলিত এলাকায় স্থানীয় স্বেচ্ছাসেবকদের মাধ্যমে খাদ্য ও প্রয়োজনীয় সামগ্রী পৌঁছে দেওয়া হচ্ছে।",
    person: "স্থানীয় স্বেচ্ছাসেবক দল",
    organization: "Community Volunteers",
    location: "Bangladesh",
    category: "humanitarian",
    impact: "২৮০+ পরিবার",
    supporters: 146,
    verified: true,
  },
  {
    id: 2,
    title: "গ্রামে বৃক্ষরোপণ কর্মসূচি",
    description:
      "স্থানীয় তরুণদের উদ্যোগে রাস্তা, স্কুল ও জনসাধারণের জায়গায় গাছ লাগানোর কার্যক্রম।",
    person: "Green Youth Team",
    organization: "Local Environment Group",
    location: "Khulna, Bangladesh",
    category: "environment",
    impact: "১,২০০+ গাছ",
    supporters: 218,
    verified: true,
  },
  {
    id: 3,
    title: "শিশুদের বিনামূল্যে শিক্ষা",
    description:
      "অর্থনৈতিকভাবে পিছিয়ে থাকা পরিবারের শিশুদের জন্য সপ্তাহান্তে বিনামূল্যে শিক্ষা কার্যক্রম।",
    person: "Volunteer Teachers",
    organization: "Community Learning Center",
    location: "Barisal, Bangladesh",
    category: "education",
    impact: "১১০+ শিক্ষার্থী",
    supporters: 97,
    verified: true,
  },
  {
    id: 4,
    title: "ফ্রি স্বাস্থ্য পরামর্শ ক্যাম্প",
    description:
      "গ্রামীণ মানুষের জন্য স্বাস্থ্য সচেতনতা, প্রাথমিক পরীক্ষা এবং প্রয়োজনীয় পরামর্শ প্রদান।",
    person: "Medical Volunteer Team",
    organization: "Health Camp",
    location: "Bagerhat, Bangladesh",
    category: "health",
    impact: "৪৫০+ মানুষ",
    supporters: 174,
    verified: true,
  },
  {
    id: 5,
    title: "দক্ষতা প্রশিক্ষণ ও কর্মসংস্থান",
    description:
      "তরুণদের হাতে-কলমে দক্ষতা শেখানো এবং স্থানীয় কাজের সুযোগের সঙ্গে সংযুক্ত করার উদ্যোগ।",
    person: "Skills Development Team",
    organization: "Local Training Hub",
    location: "Dhaka, Bangladesh",
    category: "employment",
    impact: "৮৫+ চাকরি",
    supporters: 121,
    verified: false,
  },
  {
    id: 6,
    title: "এলাকার পরিচ্ছন্নতা অভিযান",
    description:
      "বাসিন্দাদের অংশগ্রহণে রাস্তা, বাজার ও জনসাধারণের জায়গা পরিষ্কার রাখার নিয়মিত কার্যক্রম।",
    person: "Neighbourhood Volunteers",
    organization: "Community Action",
    location: "Chattogram, Bangladesh",
    category: "community",
    impact: "১২টি এলাকা",
    supporters: 189,
    verified: true,
  },
];

const needs = [
  {
    title: "স্কুলের জন্য বই প্রয়োজন",
    location: "Rural Bangladesh",
    description:
      "একটি স্থানীয় স্কুলে শিক্ষার্থীদের জন্য অতিরিক্ত বই ও শিক্ষা উপকরণ প্রয়োজন।",
    target: "১৫০ শিক্ষার্থী",
  },
  {
    title: "কমিউনিটি স্বাস্থ্য ক্যাম্প",
    location: "Coastal Bangladesh",
    description:
      "দূরবর্তী এলাকায় একটি স্বাস্থ্য সচেতনতা ও প্রাথমিক পরীক্ষা ক্যাম্প আয়োজনের প্রয়োজন।",
    target: "৩০০+ মানুষ",
  },
  {
    title: "বৃক্ষরোপণ ও পরিবেশ সংরক্ষণ",
    location: "Coastal Region",
    description:
      "উপকূলীয় এলাকায় স্থানীয় প্রজাতির গাছ লাগানোর জন্য স্বেচ্ছাসেবক প্রয়োজন।",
    target: "৫০০ গাছ",
  },
];

export default function GoodWorkWorldPage() {
  const [category, setCategory] = useState<WorkCategory>("all");
  const [query, setQuery] = useState("");
  const [works, setWorks] = useState(initialWorks);
  const [liked, setLiked] = useState<number[]>([]);
  const [selectedWork, setSelectedWork] = useState<GoodWork | null>(null);
  const [showNeedModal, setShowNeedModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);

  const [newWork, setNewWork] = useState({
    title: "",
    person: "",
    organization: "",
    location: "",
    category: "community" as Exclude<WorkCategory, "all">,
    description: "",
  });

  const filteredWorks = useMemo(() => {
    const q = query.trim().toLowerCase();

    return works.filter((work) => {
      const categoryMatch =
        category === "all" || work.category === category;

      const searchMatch =
        !q ||
        work.title.toLowerCase().includes(q) ||
        work.description.toLowerCase().includes(q) ||
        work.person.toLowerCase().includes(q) ||
        work.location.toLowerCase().includes(q);

      return categoryMatch && searchMatch;
    });
  }, [category, query, works]);

  const toggleLike = (id: number) => {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const submitGoodWork = () => {
    if (
      !newWork.title.trim() ||
      !newWork.person.trim() ||
      !newWork.location.trim() ||
      !newWork.description.trim()
    ) {
      window.alert("দয়া করে প্রয়োজনীয় তথ্যগুলো পূরণ করুন।");
      return;
    }

    const created: GoodWork = {
      id: Date.now(),
      title: newWork.title,
      description: newWork.description,
      person: newWork.person,
      organization:
        newWork.organization.trim() || "Community Contributor",
      location: newWork.location,
      category: newWork.category,
      impact: "New Contribution",
      supporters: 0,
      verified: false,
    };

    setWorks((current) => [created, ...current]);
    setShowWorkModal(false);

    setNewWork({
      title: "",
      person: "",
      organization: "",
      location: "",
      category: "community",
      description: "",
    });

    window.alert(
      "Good Work জমা হয়েছে। Verification-এর পর এটি public album-এ যুক্ত করা যেতে পারে।"
    );
  };

  return (
    <main className="min-h-screen bg-[#F7FFFB] text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#065F46]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.24),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.09),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
          <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-emerald-100">
            <HandHeart className="h-4 w-4" />
            <span>Smart Explore</span>
            <ChevronRight className="h-4 w-4 opacity-60" />
            <span>Good Work World</span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-50 backdrop-blur">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                People • Impact • Good Work
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                ভালো কাজকে
                <span className="block text-emerald-300">
                  বিশ্বের সামনে তুলে ধরি।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-emerald-50/85 sm:text-lg">
                Good Work World হলো এমন একটি global platform যেখানে এলাকার
                প্রয়োজন, মানুষের ভালো উদ্যোগ, সংগঠনের কাজ এবং তার বাস্তব
                impact এক জায়গায় তুলে ধরা হবে।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("good-work")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[#065F46] shadow-xl transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  Explore Good Work
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setShowWorkModal(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <Plus className="h-4 w-4" />
                  Share Good Work
                </button>
              </div>
            </div>

            {/* IMPACT CARD */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-[#ECFDF5] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#059669]">
                      Global Impact
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-[#065F46]">
                      Good Work Album
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-[#D1FAE5] p-3 text-[#065F46]">
                    <Globe2 className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {[
                    ["১,০০০+", "Good Works"],
                    ["৫০+", "Communities"],
                    ["১০,০০০+", "People Impacted"],
                    ["২০+", "Regions"],
                  ].map(([number, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-emerald-100 bg-white p-4"
                    >
                      <p className="text-xl font-black text-[#065F46]">
                        {number}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#065F46] p-4 text-white">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  <p className="text-xs font-semibold leading-5 text-emerald-50">
                    Verified impact • Community driven • Positive change
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-xl">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-1">
              <Search className="h-5 w-5 text-slate-400" />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ভালো কাজ, এলাকা, ব্যক্তি বা সংগঠন খুঁজুন..."
                className="h-12 min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* NEEDS */}
      <section className="border-b border-emerald-100 bg-[#ECFDF5]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#059669]">
                Area Needs
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#065F46]">
                কোথায় কী প্রয়োজন?
              </h2>

              <p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-slate-600">
                ভালো কাজের প্রথম ধাপ হলো মানুষের বাস্তব প্রয়োজন চিহ্নিত করা।
              </p>
            </div>

            <button
              onClick={() => setShowNeedModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#065F46] px-5 py-3 text-sm font-black text-white hover:bg-[#047857]"
            >
              <Target className="h-4 w-4" />
              Post an Area Need
            </button>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {needs.map((need) => (
              <div
                key={need.title}
                className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl bg-[#D1FAE5] p-2.5 text-[#065F46]">
                    <Target className="h-5 w-5" />
                  </div>

                  <span className="rounded-full bg-[#ECFDF5] px-3 py-1 text-[10px] font-black text-[#059669]">
                    NEED
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-900">
                  {need.title}
                </h3>

                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                  <MapPin className="h-4 w-4" />
                  {need.location}
                </div>

                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {need.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-400">
                    Target: {need.target}
                  </span>

                  <button
                    onClick={() =>
                      window.alert(
                        "এই Need-এর সঙ্গে যুক্ত হওয়ার feature পরবর্তী ধাপে database-এর সঙ্গে সংযুক্ত হবে।"
                      )
                    }
                    className="text-sm font-black text-[#059669]"
                  >
                    Help →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GOOD WORK */}
      <section
        id="good-work"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#059669]">
              Good Work Album
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#065F46] sm:text-4xl">
              যারা ভালো কাজ করছেন
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600">
              মানুষ, সংগঠন ও কমিউনিটির ইতিবাচক উদ্যোগগুলো এক জায়গায় দেখুন।
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-sm">
            <Heart className="h-4 w-4 text-[#059669]" />
            <span className="text-sm font-bold text-slate-700">
              Your Support: {liked.length}
            </span>
          </div>
        </div>

        {/* CATEGORY FILTER */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const active = category === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-[#059669] bg-[#059669] text-white shadow-lg"
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

        {/* CARDS */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorks.map((work) => {
            const isLiked = liked.includes(work.id);

            return (
              <article
                key={work.id}
                className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Album visual */}
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-[#065F46] via-[#059669] to-[#D1FAE5]">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border-[20px] border-white" />
                    <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full border-[20px] border-white" />
                  </div>

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-white backdrop-blur">
                    <HandHeart className="h-10 w-10" />
                  </div>

                  {work.verified && (
                    <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-[#065F46] shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      VERIFIED
                    </div>
                  )}

                  <button
                    onClick={() => toggleLike(work.id)}
                    className={`absolute right-4 top-4 rounded-xl p-2.5 backdrop-blur transition ${
                      isLiked
                        ? "bg-white text-red-500"
                        : "bg-white/20 text-white hover:bg-white hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={isLiked ? "currentColor" : "none"}
                    />
                  </button>
                </div>

                <div className="p-5">
                  <span className="inline-flex rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#059669]">
                    {work.category}
                  </span>

                  <h3 className="mt-3 text-xl font-black leading-7 text-slate-900">
                    {work.title}
                  </h3>

                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {work.description}
                  </p>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Users className="h-4 w-4 text-[#059669]" />
                      {work.person}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <Building2 className="h-4 w-4 text-[#059669]" />
                      {work.organization}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <MapPin className="h-4 w-4 text-[#059669]" />
                      {work.location}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="rounded-2xl bg-[#ECFDF5] p-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#059669]">
                        Impact
                      </p>
                      <p className="mt-1 text-sm font-black text-[#065F46]">
                        {work.impact}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        Supporters
                      </p>
                      <p className="mt-1 text-sm font-black text-slate-700">
                        {work.supporters}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedWork(work)}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-100 px-4 py-3 text-sm font-black text-[#059669] transition hover:bg-[#ECFDF5]"
                  >
                    View Impact
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredWorks.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-white p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-emerald-300" />

            <h3 className="mt-4 text-xl font-black text-slate-800">
              কোনো Good Work পাওয়া যায়নি
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500">
              অন্য keyword বা category দিয়ে চেষ্টা করুন।
            </p>
          </div>
        )}
      </section>

      {/* GLOBAL VISION */}
      <section className="border-y border-emerald-100 bg-[#ECFDF5]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#065F46] text-white">
                <Globe2 className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-[#065F46] sm:text-4xl">
                From Local Good Work
                <span className="block text-[#059669]">
                  to Global Good Work
                </span>
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                একটি এলাকার ছোট উদ্যোগও পৃথিবীর অন্য প্রান্তের মানুষের জন্য
                inspiration হতে পারে। Good Work World সেই গল্পগুলোকে
                discoverable এবং shareable করার একটি vision।
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Local Needs",
                  "Good People",
                  "Organizations",
                  "Impact",
                  "Global Album",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-[#065F46]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: MapPin,
                  title: "Area Needs",
                  text: "কোথায় কী প্রয়োজন তা চিহ্নিত করা।",
                },
                {
                  icon: HandHeart,
                  title: "Good Work",
                  text: "কে কী ভালো কাজ করছেন তা তুলে ধরা।",
                },
                {
                  icon: Award,
                  title: "Impact",
                  text: "ভালো কাজের বাস্তব ফলাফল দেখানো।",
                },
                {
                  icon: ImageIcon,
                  title: "Good Work Album",
                  text: "বিশ্বের ভালো কাজের একটি বড় digital archive।",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D1FAE5] text-[#065F46]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-lg font-black text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-[#065F46] p-7 shadow-2xl sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-emerald-300">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-black uppercase tracking-wider">
                  Be Part of Good Work World
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                আপনার এলাকার ভালো কাজটি বিশ্বকে জানান।
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                ব্যক্তি, পরিবার, কমিউনিটি, NGO, business অথবা volunteer
                group—যে কেউ একটি ভালো উদ্যোগ share করতে পারবে।
              </p>
            </div>

            <button
              onClick={() => setShowWorkModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-[#065F46] transition hover:bg-emerald-50"
            >
              <Plus className="h-5 w-5" />
              Share Good Work
            </button>
          </div>
        </div>
      </section>

      {/* IMPACT MODAL */}
      {selectedWork && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#059669]">
                  Good Work Impact
                </p>

                <h2 className="text-xl font-black text-[#065F46]">
                  Impact Details
                </h2>
              </div>

              <button
                onClick={() => setSelectedWork(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#D1FAE5] text-[#065F46]">
                <HandHeart className="h-10 w-10" />
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight text-[#065F46]">
                {selectedWork.title}
              </h2>

              <p className="mt-4 text-base font-medium leading-8 text-slate-600">
                {selectedWork.description}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#ECFDF5] p-4">
                  <p className="text-xs font-black uppercase text-[#059669]">
                    Who
                  </p>
                  <p className="mt-1 font-black text-[#065F46]">
                    {selectedWork.person}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#ECFDF5] p-4">
                  <p className="text-xs font-black uppercase text-[#059669]">
                    Organization
                  </p>
                  <p className="mt-1 font-black text-[#065F46]">
                    {selectedWork.organization}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Location
                  </p>
                  <p className="mt-1 font-black text-slate-700">
                    {selectedWork.location}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase text-slate-400">
                    Impact
                  </p>
                  <p className="mt-1 font-black text-slate-700">
                    {selectedWork.impact}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  toggleLike(selectedWork.id);
                  setSelectedWork(null);
                }}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#065F46] px-5 py-3 text-sm font-black text-white hover:bg-[#047857]"
              >
                <Heart
                  className="h-4 w-4"
                  fill={liked.includes(selectedWork.id) ? "currentColor" : "none"}
                />
                Support This Good Work
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE GOOD WORK MODAL */}
      {showWorkModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#059669]">
                  Good Work Contribution
                </p>

                <h2 className="text-xl font-black text-[#065F46]">
                  ভালো কাজ Share করুন
                </h2>
              </div>

              <button
                onClick={() => setShowWorkModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              <div>
                <label className="text-sm font-black text-slate-700">
                  Good Work Title
                </label>

                <input
                  value={newWork.title}
                  onChange={(e) =>
                    setNewWork({ ...newWork, title: e.target.value })
                  }
                  placeholder="যেমন: গ্রামের শিশুদের বিনামূল্যে শিক্ষা"
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-[#059669] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-black text-slate-700">
                    Person / Team
                  </label>

                  <input
                    value={newWork.person}
                    onChange={(e) =>
                      setNewWork({ ...newWork, person: e.target.value })
                    }
                    placeholder="ব্যক্তি বা টিমের নাম"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-[#059669] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-black text-slate-700">
                    Organization
                  </label>

                  <input
                    value={newWork.organization}
                    onChange={(e) =>
                      setNewWork({
                        ...newWork,
                        organization: e.target.value,
                      })
                    }
                    placeholder="Organization / Group"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-[#059669] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-black text-slate-700">
                    Location
                  </label>

                  <input
                    value={newWork.location}
                    onChange={(e) =>
                      setNewWork({ ...newWork, location: e.target.value })
                    }
                    placeholder="এলাকা / শহর / দেশ"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-[#059669] focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-black text-slate-700">
                    Category
                  </label>

                  <select
                    value={newWork.category}
                    onChange={(e) =>
                      setNewWork({
                        ...newWork,
                        category: e.target.value as Exclude<
                          WorkCategory,
                          "all"
                        >,
                      })
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#059669]"
                  >
                    {categories
                      .filter((item) => item.id !== "all")
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.bn} — {item.en}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-black text-slate-700">
                  Description
                </label>

                <textarea
                  value={newWork.description}
                  onChange={(e) =>
                    setNewWork({
                      ...newWork,
                      description: e.target.value,
                    })
                  }
                  placeholder="ভালো কাজটি কী, কার জন্য এবং কীভাবে করা হচ্ছে..."
                  rows={5}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm font-medium outline-none focus:border-[#059669] focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="rounded-2xl bg-[#ECFDF5] p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" />

                  <p className="text-xs font-semibold leading-6 text-[#065F46]">
                    Submitted Good Work প্রথমে contribution হিসেবে থাকবে।
                    ভবিষ্যতে verification system-এর মাধ্যমে verified badge,
                    impact evidence এবং photo album যুক্ত করা যাবে।
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowWorkModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={submitGoodWork}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#065F46] px-6 py-3 text-sm font-black text-white hover:bg-[#047857]"
                >
                  <Plus className="h-4 w-4" />
                  Submit Good Work
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AREA NEED MODAL */}
      {showNeedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#059669]">
                  Area Needs
                </p>

                <h2 className="text-2xl font-black text-[#065F46]">
                  Post an Area Need
                </h2>
              </div>

              <button
                onClick={() => setShowNeedModal(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-[#ECFDF5] p-5">
              <Target className="h-7 w-7 text-[#059669]" />

              <h3 className="mt-3 font-black text-[#065F46]">
                Area Need System
              </h3>

              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                এই interface পরবর্তী database phase-এ Supabase-এর সঙ্গে
                যুক্ত করা হবে। তখন নির্দিষ্ট এলাকার প্রয়োজন submit,
                discover এবং volunteer matching করা যাবে।
              </p>
            </div>

            <button
              onClick={() => {
                setShowNeedModal(false);
                window.alert(
                  "Area Need submission system পরবর্তী database phase-এ চালু হবে।"
                );
              }}
              className="mt-6 w-full rounded-xl bg-[#065F46] px-5 py-3.5 text-sm font-black text-white hover:bg-[#047857]"
            >
              বুঝেছি
            </button>
          </div>
        </div>
      )}
    </main>
  );
}