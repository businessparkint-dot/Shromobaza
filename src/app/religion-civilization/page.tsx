"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Globe2,
  Heart,
  Landmark,
  Library,
  Map,
  MessageCircle,
  Moon,
  PlayCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

type Section =
  | "all"
  | "religion"
  | "islam"
  | "books"
  | "speech"
  | "calendar"
  | "civilization"
  | "history"
  | "heritage"
  | "philosophy";

type ReligionKey =
  | "islam"
  | "hinduism"
  | "christianity"
  | "buddhism"
  | "judaism"
  | "sikhism"
  | "jainism"
  | "other";

type KnowledgeItem = {
  id: number;
  title: string;
  subtitle: string;
  section: Section;
  tag: string;
  readTime: string;
  icon: typeof BookOpen;
  featured?: boolean;
};

const sections: {
  id: Section;
  bn: string;
  en: string;
}[] = [
  { id: "all", bn: "সবকিছু", en: "Explore All" },
  { id: "religion", bn: "সকল ধর্ম", en: "Religions" },
  { id: "islam", bn: "ইসলাম", en: "Islam" },
  { id: "books", bn: "গ্রন্থ ও বই", en: "Books" },
  { id: "speech", bn: "বক্তৃতা ও লেকচার", en: "Speeches" },
  { id: "calendar", bn: "ধর্মীয় ক্যালেন্ডার", en: "Calendar" },
  { id: "civilization", bn: "সভ্যতা", en: "Civilization" },
  { id: "history", bn: "ইতিহাস", en: "History" },
  { id: "heritage", bn: "ঐতিহ্য", en: "Heritage" },
  { id: "philosophy", bn: "দর্শন", en: "Philosophy" },
];

const religions: {
  id: ReligionKey;
  bn: string;
  en: string;
  description: string;
  icon: typeof BookOpen;
}[] = [
  {
    id: "islam",
    bn: "ইসলাম",
    en: "Islam",
    description:
      "কুরআন, হাদিস, সীরাত, ইসলামি শিক্ষা, আলেম-উলামা, ইবাদত, হজ, যাকাত ও ইসলামি জ্ঞান।",
    icon: Moon,
  },
  {
    id: "hinduism",
    bn: "হিন্দুধর্ম",
    en: "Hinduism",
    description:
      "প্রধান ধর্মগ্রন্থ, দর্শন, ঐতিহ্য, ইতিহাস ও সাংস্কৃতিক জ্ঞান।",
    icon: BookOpen,
  },
  {
    id: "christianity",
    bn: "খ্রিস্টধর্ম",
    en: "Christianity",
    description:
      "বাইবেল, খ্রিস্টীয় শিক্ষা, ইতিহাস, সম্প্রদায় ও ঐতিহ্য।",
    icon: Library,
  },
  {
    id: "buddhism",
    bn: "বৌদ্ধধর্ম",
    en: "Buddhism",
    description:
      "বৌদ্ধ শিক্ষা, গ্রন্থ, দর্শন, ইতিহাস ও ধ্যানচর্চা।",
    icon: Sparkles,
  },
  {
    id: "judaism",
    bn: "ইহুদি ধর্ম",
    en: "Judaism",
    description:
      "তোরাহ, ইহুদি ইতিহাস, শিক্ষা ও সাংস্কৃতিক ঐতিহ্য।",
    icon: Library,
  },
  {
    id: "sikhism",
    bn: "শিখ ধর্ম",
    en: "Sikhism",
    description:
      "গুরু গ্রন্থ সাহিব, শিখ শিক্ষা, ইতিহাস ও ঐতিহ্য।",
    icon: BookOpen,
  },
  {
    id: "jainism",
    bn: "জৈন ধর্ম",
    en: "Jainism",
    description:
      "জৈন দর্শন, গ্রন্থ, নৈতিক শিক্ষা ও ঐতিহ্য।",
    icon: Sparkles,
  },
  {
    id: "other",
    bn: "অন্যান্য ঐতিহ্য",
    en: "Other Traditions",
    description:
      "বিশ্বের অন্যান্য ধর্মীয় ও আধ্যাত্মিক ঐতিহ্য সম্পর্কে জ্ঞান।",
    icon: Globe2,
  },
];

const islamTopics = [
  {
    title: "কুরআন",
    en: "Quran",
    description: "কুরআন শিক্ষা, সূরা, আয়াত ও তিলাওয়াতের জন্য জ্ঞানভিত্তিক বিভাগ।",
    icon: BookOpen,
  },
  {
    title: "হাদিস",
    en: "Hadith",
    description: "হাদিস, হাদিসের বিষয় এবং নির্ভরযোগ্য reference-এর জন্য বিভাগ।",
    icon: Library,
  },
  {
    title: "তাফসির",
    en: "Tafsir",
    description: "কুরআনের ব্যাখ্যা ও তাফসিরভিত্তিক শিক্ষামূলক কনটেন্ট।",
    icon: Search,
  },
  {
    title: "ফিকহ",
    en: "Fiqh",
    description: "ইসলামি আইন ও ফিকহের বিভিন্ন বিষয় শেখার জায়গা।",
    icon: Landmark,
  },
  {
    title: "আকীদাহ",
    en: "Aqidah",
    description: "ইসলামি বিশ্বাস ও আকীদাহ সম্পর্কিত শিক্ষামূলক কনটেন্ট।",
    icon: ShieldCheck,
  },
  {
    title: "সীরাত",
    en: "Seerah",
    description: "রাসূল মুহাম্মদ ﷺ-এর জীবন ও সীরাতভিত্তিক জ্ঞান।",
    icon: Star,
  },
  {
    title: "ওয়াজ",
    en: "Waz",
    description: "শিক্ষামূলক ইসলামি ওয়াজ ও বক্তৃতার future-ready section।",
    icon: PlayCircle,
  },
  {
    title: "মাহফিল",
    en: "Mahfil",
    description: "মাহফিল, ইসলামি অনুষ্ঠান ও lecture discovery।",
    icon: Users,
  },
  {
    title: "ইমাম",
    en: "Imam",
    description: "ইমামদের profile, mosque connection ও educational content।",
    icon: Users,
  },
  {
    title: "কারী",
    en: "Qari",
    description: "কুরআন তিলাওয়াতকারী কারীদের জন্য dedicated discovery section।",
    icon: PlayCircle,
  },
  {
    title: "আলেম ও মাওলানা",
    en: "Scholars",
    description: "আলেম, মাওলানা ও ইসলামি scholar-এর জ্ঞানভিত্তিক profile ও content।",
    icon: ShieldCheck,
  },
  {
    title: "ইসলামি বই",
    en: "Islamic Books",
    description: "ইসলামি বই, reference এবং knowledge library।",
    icon: Library,
  },
];

const islamServices = [
  {
    title: "হজ ও উমরাহ",
    en: "Hajj & Umrah",
    description: "হজ ও উমরাহ service provider, guide ও প্রয়োজনীয় তথ্য।",
    icon: Landmark,
  },
  {
    title: "যাকাত",
    en: "Zakat",
    description: "যাকাত সম্পর্কিত শিক্ষা, হিসাব ও verified service-এর জন্য structure।",
    icon: Heart,
  },
  {
    title: "দান ও সদকা",
    en: "Donation & Sadaqah",
    description: "দান, সদকা ও charity organization-এর জন্য future-ready section।",
    icon: Heart,
  },
  {
    title: "মসজিদ",
    en: "Mosque",
    description: "মসজিদ, prayer information ও community connection।",
    icon: Landmark,
  },
  {
    title: "মাদরাসা",
    en: "Madrasa",
    description: "মাদরাসা, ইসলামি শিক্ষা প্রতিষ্ঠান ও educational information।",
    icon: Library,
  },
  {
    title: "ইসলামি সংগঠন",
    en: "Organizations",
    description: "ইসলামি organization ও community initiative discovery।",
    icon: Users,
  },
];

const islamCalendar = [
  ["🕌", "নামাজের সময়", "Prayer Times", "Location-based dynamic prayer time"],
  ["🌙", "চাঁদ ও ইসলামি তারিখ", "Moon & Hijri Date", "Moon / lunar-date update ready"],
  ["🌙", "রমজান", "Ramadan", "Sehri, Iftar & Ramadan information"],
  ["⭐", "শবে কদর", "Laylat al-Qadr", "Important Islamic night"],
  ["🕋", "হজ", "Hajj", "Hajj season & information"],
  ["🤲", "আরাফার দিন", "Day of Arafah", "Important Islamic date"],
  ["🎉", "ঈদুল ফিতর", "Eid al-Fitr", "Eid information & updates"],
  ["🐑", "ঈদুল আজহা", "Eid al-Adha", "Eid & Qurbani information"],
  ["🌙", "আশুরা", "Ashura", "Hijri calendar event"],
];

const knowledgeItems: KnowledgeItem[] = [
  {
    id: 1,
    title: "বিশ্বের ধর্মীয় ঐতিহ্য",
    subtitle:
      "বিভিন্ন ধর্মের ধর্মগ্রন্থ, শিক্ষা, ইতিহাস, সংস্কৃতি ও ঐতিহ্য সম্পর্কে একটি balanced knowledge overview।",
    section: "religion",
    tag: "Religion",
    readTime: "8 min",
    icon: Globe2,
    featured: true,
  },
  {
    id: 2,
    title: "কুরআন ও ইসলামি জ্ঞান",
    subtitle:
      "কুরআন, হাদিস, তাফসির, সীরাত ও অন্যান্য ইসলামি জ্ঞানভিত্তিক বিষয় explore করার foundation।",
    section: "islam",
    tag: "Islam",
    readTime: "10 min",
    icon: Moon,
    featured: true,
  },
  {
    id: 3,
    title: "ধর্মীয় গ্রন্থ ও বই",
    subtitle:
      "বিভিন্ন ধর্মের মূল ধর্মগ্রন্থ এবং গুরুত্বপূর্ণ বইয়ের একটি knowledge-library structure।",
    section: "books",
    tag: "Books",
    readTime: "7 min",
    icon: Library,
  },
  {
    id: 4,
    title: "বক্তৃতা, লেকচার ও শিক্ষা",
    subtitle:
      "ধর্মীয় বক্তা, শিক্ষক, scholar ও educational creator-এর lecture discovery-এর জন্য platform।",
    section: "speech",
    tag: "Speeches",
    readTime: "6 min",
    icon: PlayCircle,
  },
  {
    id: 5,
    title: "ধর্মীয় ক্যালেন্ডার",
    subtitle:
      "গুরুত্বপূর্ণ ধর্মীয় দিবস, উৎসব ও সময়ভিত্তিক তথ্যের জন্য একটি calendar-ready system।",
    section: "calendar",
    tag: "Calendar",
    readTime: "5 min",
    icon: CalendarDays,
  },
  {
    id: 6,
    title: "মানবসভ্যতার দীর্ঘ যাত্রা",
    subtitle:
      "প্রাচীন নগর, কৃষি, জ্ঞান, বাণিজ্য ও সামাজিক কাঠামোর মাধ্যমে সভ্যতার বিকাশ।",
    section: "civilization",
    tag: "Civilization",
    readTime: "8 min",
    icon: Landmark,
  },
  {
    id: 7,
    title: "প্রাচীন বিশ্বের জ্ঞানকেন্দ্র",
    subtitle:
      "গ্রন্থাগার, শিক্ষাকেন্দ্র, গবেষণা ও জ্ঞান সংরক্ষণের ঐতিহাসিক ধারার পরিচিতি।",
    section: "history",
    tag: "History",
    readTime: "6 min",
    icon: Library,
  },
  {
    id: 8,
    title: "বিশ্বের সাংস্কৃতিক ঐতিহ্য",
    subtitle:
      "স্থাপত্য, ভাষা, শিল্প, সংগীত ও লোকজ সংস্কৃতির মাধ্যমে মানুষের পরিচয়।",
    section: "heritage",
    tag: "Heritage",
    readTime: "9 min",
    icon: Globe2,
  },
  {
    id: 9,
    title: "নৈতিকতা, দর্শন ও জীবন",
    subtitle:
      "মানুষের নৈতিকতা, ন্যায়, দায়িত্ব ও জীবনের উদ্দেশ্য নিয়ে বিভিন্ন দার্শনিক চিন্তা।",
    section: "philosophy",
    tag: "Philosophy",
    readTime: "10 min",
    icon: Sparkles,
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
      "নাইল নদীকেন্দ্রিক সমাজ, স্থাপত্য, জ্ঞান, শিল্প ও প্রশাসনের বিস্ময়কর ঐতিহ্য।",
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
  const [section, setSection] = useState<Section>("all");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [selectedItem, setSelectedItem] =
    useState<KnowledgeItem | null>(null);
  const [selectedReligion, setSelectedReligion] =
    useState<ReligionKey>("islam");
  const [showCalendar, setShowCalendar] = useState(false);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return knowledgeItems.filter((item) => {
      const sectionMatch =
        section === "all" ||
        item.section === section ||
        (section === "religion" && item.section === "islam");

      const searchMatch =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle.toLowerCase().includes(normalized) ||
        item.tag.toLowerCase().includes(normalized);

      return sectionMatch && searchMatch;
    });
  }, [section, query]);

  const toggleSaved = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  };

  const selectedReligionData = religions.find(
    (item) => item.id === selectedReligion
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#064E3B]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(16,185,129,0.24),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(255,255,255,0.08),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
          <div className="mb-8 flex items-center gap-2 text-sm font-bold text-emerald-100">
            <Globe2 className="h-4 w-4" />
            <span>Smart Explore</span>
            <ChevronRight className="h-4 w-4 opacity-50" />
            <span>Religion & Knowledge</span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-white/10 px-4 py-2 text-xs font-black text-emerald-50 backdrop-blur">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                Religion • Books • Knowledge • Culture
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                ধর্ম ও জ্ঞানের
                <span className="block text-emerald-300">
                  একটি শান্তিপূর্ণ জ্ঞানভান্ডার।
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-emerald-50/85 sm:text-lg">
                ইসলামসহ বিশ্বের বিভিন্ন ধর্ম, ধর্মগ্রন্থ, বই, বক্তৃতা,
                ইতিহাস, ঐতিহ্য, দর্শন এবং মানবসভ্যতার জ্ঞান এক জায়গায়
                অনুসন্ধান ও শেখার একটি respectful knowledge platform।
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("religions")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[#065F46] shadow-xl transition hover:-translate-y-0.5 hover:bg-emerald-50"
                >
                  Explore Religions
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setShowCalendar(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
                >
                  <CalendarDays className="h-4 w-4" />
                  Religious Calendar
                </button>
              </div>
            </div>

            {/* HERO CARD */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.08] p-4 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-[#F0FDF4] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#059669]">
                      Global Religion
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-[#064E3B]">
                      Explore & Learn
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-[#D1FAE5] p-3 text-[#065F46]">
                    <Globe2 className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-3">
                  {religions.slice(0, 6).map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedReligion(item.id);
                          setSection(
                            item.id === "islam" ? "islam" : "religion"
                          );
                        }}
                        className="rounded-2xl border border-emerald-100 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                      >
                        <Icon className="h-5 w-5 text-[#059669]" />
                        <p className="mt-2 text-sm font-black text-[#064E3B]">
                          {item.bn}
                        </p>
                        <p className="mt-1 text-[10px] font-bold text-slate-400">
                          {item.en}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#064E3B] p-4 text-white">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  <p className="text-xs font-semibold leading-5 text-emerald-50">
                    Respectful • Educational • Peaceful • Evidence-aware
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
                placeholder="ধর্ম, কুরআন, হাদিস, বই, ওয়াজ, ইতিহাস বা জ্ঞান খুঁজুন..."
                className="h-12 min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ALL RELIGIONS */}
      <section
        id="religions"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#059669]">
            World Religions
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-tight text-[#064E3B] sm:text-4xl">
            সকল ধর্ম সম্পর্কে জানুন
          </h2>

          <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
            প্রতিটি ধর্মকে সম্মানজনক ও শিক্ষামূলকভাবে উপস্থাপন করে ধর্মগ্রন্থ,
            ইতিহাস, শিক্ষা, সংস্কৃতি ও ঐতিহ্য explore করার ব্যবস্থা।
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {religions.map((religion) => {
            const Icon = religion.icon;
            const active = selectedReligion === religion.id;

            return (
              <button
                key={religion.id}
                onClick={() => {
                  setSelectedReligion(religion.id);
                  setSection(
                    religion.id === "islam" ? "islam" : "religion"
                  );
                }}
                className={`group rounded-3xl border p-5 text-left transition hover:-translate-y-1 hover:shadow-xl ${
                  active
                    ? "border-[#059669] bg-[#F0FDF4] ring-1 ring-emerald-200"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D1FAE5] text-[#047857]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#059669]" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-900">
                  {religion.bn}
                </h3>

                <p className="mt-1 text-xs font-bold text-[#059669]">
                  {religion.en}
                </p>

                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                  {religion.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ISLAM HUB */}
      <section className="border-y border-emerald-100 bg-[#F0FDF4]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D1FAE5] px-3 py-1.5 text-xs font-black text-[#065F46]">
                <Moon className="h-4 w-4" />
                Islamic Knowledge Hub
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-tight text-[#064E3B] sm:text-4xl">
                ইসলাম সম্পর্কে পূর্ণাঙ্গ জ্ঞানভান্ডার
              </h2>

              <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-600">
                {selectedReligionData?.description}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-black text-[#059669]">
                Islamic Hub
              </p>
              <p className="mt-1 text-sm font-bold text-slate-700">
                Quran • Hadith • Scholars • Services
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {islamTopics.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.en}
                  className="group rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#059669]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-xs font-bold text-[#059669]">
                    {item.en}
                  </p>

                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <button
                    onClick={() =>
                      window.alert(
                        `${item.title} — এই section পরবর্তী ধাপে বিস্তারিত content দিয়ে চালু করা হবে।`
                      )
                    }
                    className="mt-5 inline-flex items-center gap-1 text-sm font-black text-[#059669] transition group-hover:gap-2"
                  >
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* SERVICES */}
          <div className="mt-14">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#059669]">
                Islamic Services
              </p>
              <h3 className="mt-2 text-2xl font-black text-[#064E3B]">
                ইসলামি সেবা ও community
              </h3>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {islamServices.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.en}
                    className="rounded-3xl border border-emerald-100 bg-white p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D1FAE5] text-[#047857]">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <h4 className="font-black text-slate-900">
                          {item.title}
                        </h4>
                        <p className="text-xs font-bold text-[#059669]">
                          {item.en}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm font-medium leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CALENDAR */}
          <div className="mt-14 rounded-[2rem] bg-[#064E3B] p-6 shadow-2xl sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <CalendarDays className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Islamic Calendar
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black text-white sm:text-3xl">
                  সময়, চাঁদ, রমজান ও ঈদের আপডেট
                </h3>

                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-emerald-50/80">
                  Prayer time, Hijri date, moon sighting, Ramadan, Hajj এবং
                  Eid-এর জন্য location/date-based dynamic system প্রস্তুত রাখা
                  হয়েছে।
                </p>
              </div>

              <button
                onClick={() => setShowCalendar(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[#064E3B] transition hover:bg-emerald-50"
              >
                View Calendar
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {islamCalendar.slice(0, 6).map(([icon, title, en, text]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/10 bg-white/[0.08] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>

                    <div>
                      <p className="font-black text-white">{title}</p>
                      <p className="text-[10px] font-bold text-emerald-300">
                        {en}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs font-medium leading-5 text-emerald-50/70">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KNOWLEDGE EXPLORE */}
      <section
        id="explore"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#059669]">
              Knowledge Library
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#064E3B] sm:text-4xl">
              আরও জ্ঞান explore করুন
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-600">
              Religion-এর পাশাপাশি civilization, history, heritage,
              philosophy এবং books-এর knowledge ecosystem।
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-[#F0FDF4] px-4 py-3">
            <Bookmark className="h-4 w-4 text-[#059669]" />
            <span className="text-sm font-bold text-slate-700">
              Saved: {saved.length}
            </span>
          </div>
        </div>

        {/* FILTER */}
        <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
          {sections.map((item) => {
            const active = section === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`shrink-0 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-[#059669] bg-[#059669] text-white shadow-lg"
                    : "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-[#F0FDF4]"
                }`}
              >
                <span className="block text-sm font-black">
                  {item.bn}
                </span>

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
          <div className="mt-8 rounded-3xl border border-dashed border-emerald-200 bg-[#F0FDF4] p-12 text-center">
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

      {/* CIVILIZATION */}
      <section className="border-y border-emerald-100 bg-[#F0FDF4]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#064E3B] text-white">
                <Landmark className="h-6 w-6" />
              </div>

              <h2 className="mt-5 text-3xl font-black tracking-tight text-[#064E3B]">
                Civilization Explorer
              </h2>

              <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                প্রাচীন ও ঐতিহাসিক সভ্যতাগুলোর বিকাশ, সংস্কৃতি, জ্ঞান,
                প্রযুক্তি ও সামাজিক কাঠামো সম্পর্কে জানুন।
              </p>

              <button
                onClick={() => setSection("civilization")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#064E3B] px-5 py-3 text-sm font-black text-white transition hover:bg-[#047857]"
              >
                Explore Civilization
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

      {/* COMMUNITY */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-[#064E3B] p-7 shadow-2xl sm:p-10">
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
                ভবিষ্যতে শিক্ষক, scholar, researcher, creator ও শিক্ষার্থীরা
                educational content, books, lecture এবং knowledge share করতে
                পারবেন।
              </p>
            </div>

            <button
              onClick={() =>
                window.alert(
                  "Knowledge Community — এই ফিচারটি পরবর্তী ধাপে চালু করা হবে।"
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-black text-[#064E3B] transition hover:bg-emerald-50"
            >
              <Users className="h-5 w-5" />
              Join Community
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER INFO */}
      <section className="border-t border-emerald-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center justify-center gap-2 lg:justify-start">
            <ShieldCheck className="h-5 w-5 text-[#059669]" />
            <p className="text-xs font-semibold text-slate-500">
              Educational • Respectful • Peaceful Knowledge Environment
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-bold text-slate-400">
            <span>Religion</span>
            <span>Books</span>
            <span>History</span>
            <span>Culture</span>
            <span>Knowledge</span>
          </div>
        </div>
      </section>

      {/* READ MODAL */}
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
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-3xl font-black leading-tight text-[#064E3B]">
                {selectedItem.title}
              </h2>

              <p className="mt-5 text-base font-medium leading-8 text-slate-600">
                {selectedItem.subtitle}
              </p>

              <div className="mt-7 rounded-2xl border border-emerald-100 bg-[#F0FDF4] p-5">
                <p className="text-sm font-bold leading-7 text-[#065F46]">
                  এই section ভবিষ্যতে verified reference, authorized books,
                  multimedia, expert contribution এবং educational content
                  দিয়ে আরও সমৃদ্ধ করা যাবে।
                </p>
              </div>

              <button
                onClick={() => {
                  toggleSaved(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#064E3B] px-5 py-3 text-sm font-black text-white hover:bg-[#047857]"
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

      {/* CALENDAR MODAL */}
      {showCalendar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#059669]">
                  Islamic Calendar
                </p>

                <h2 className="text-xl font-black text-[#064E3B]">
                  ইসলামি সময় ও গুরুত্বপূর্ণ দিন
                </h2>
              </div>

              <button
                onClick={() => setShowCalendar(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close calendar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-3xl border border-emerald-100 bg-[#F0FDF4] p-5">
                <div className="flex items-center gap-3">
                  <Moon className="h-6 w-6 text-[#059669]" />

                  <div>
                    <p className="text-sm font-black text-[#064E3B]">
                      Dynamic Calendar Ready
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Location ও date অনুযায়ী verified data source/API যুক্ত
                      করে এই অংশ live করা যাবে।
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {islamCalendar.map(([icon, title, en, text]) => (
                  <div
                    key={title}
                    className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-xl">
                      {icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-900">
                          {title}
                        </h3>

                        <span className="rounded-full bg-[#D1FAE5] px-2 py-1 text-[9px] font-black text-[#065F46]">
                          {en}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                        {text}
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
