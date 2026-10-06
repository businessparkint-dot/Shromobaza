"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  Handshake,
  HeartPulse,
  MapPin,
  MessageCircle,
  MonitorPlay,
  Search,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  Trophy,
  UserRound,
  Users,
  WalletCards,
  Wrench,
  Brain,
  Clapperboard,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type TVContent = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  media_type: "video" | "image";
  media_url: string;
  thumbnail_url?: string | null;
};

type Sponsor = {
  id?: string;
  company_name?: string;
  name?: string;
  title?: string;
  offer?: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  link_url?: string;
};

type Language = "bn" | "en";

/* =========================================================
   POPULAR WORKER CATEGORIES
========================================================= */

const categories = [
  {
    title: "লেবার ও মিস্ত্রি",
    en: "Labour & Mason",
    subtitle: "রাজমিস্ত্রি, কাঠমিস্ত্রি ও সহকারী",
    enSubtitle: "Mason, carpenter & helpers",
    href: "/workers?category=construction",
    icon: Building2,
    color: "bg-[#17365d]",
  },
  {
    title: "টেকনিশিয়ান",
    en: "Technicians",
    subtitle: "ইলেকট্রিশিয়ান, প্লাম্বার ও টেকনিক্যাল কর্মী",
    enSubtitle: "Electrician, plumber & technical workers",
    href: "/workers?category=technical",
    icon: Wrench,
    color: "bg-[#c2410c]",
  },
  {
    title: "ড্রাইভার",
    en: "Drivers",
    subtitle: "অভিজ্ঞ ড্রাইভার ও পরিবহন কর্মী",
    enSubtitle: "Experienced drivers & transport workers",
    href: "/workers?category=driver",
    icon: BriefcaseBusiness,
    color: "bg-[#7f1d1d]",
  },
  {
    title: "ইঞ্জিনিয়ার",
    en: "Engineers",
    subtitle: "Civil, Electrical ও অন্যান্য Engineer",
    enSubtitle: "Civil, electrical & other engineers",
    href: "/workers?category=engineering",
    icon: Globe2,
    color: "bg-[#14532d]",
  },
  {
    title: "স্বাস্থ্যসেবা",
    en: "Healthcare",
    subtitle: "Doctor, Nurse ও স্বাস্থ্য পেশাজীবী",
    enSubtitle: "Doctors, nurses & health professionals",
    href: "/workers?category=health",
    icon: HeartPulse,
    color: "bg-[#075985]",
  },
  {
    title: "আইন ও পেশাজীবী",
    en: "Legal & Professional",
    subtitle: "Legal ও Professional Services",
    enSubtitle: "Legal & professional services",
    href: "/workers?category=professional",
    icon: ShieldCheck,
    color: "bg-[#7f1d1d]",
  },
  {
    title: "অন্যান্য পেশা",
    en: "Other Professionals",
    subtitle: "আরও সকল পেশার কর্মী দেখুন",
    enSubtitle: "Explore people from more professions",
    href: "/workers?category=other",
    icon: Users,
    color: "bg-[#17365d]",
  },
];

/* =========================================================
   CORE EXPLORE
========================================================= */

const exploreItems = [
  {
    code: "01",
    label: "MARKETPLACE",
    bn: "মার্কেটপ্লেস",
    description: "Workers, jobs, products & services",
    bnDescription: "কর্মী, কাজ, পণ্য ও সেবা",
    href: "/marketplace",
    emoji: "🛍️",
    activeClass: "from-orange-500 to-red-600",
    glowClass: "group-hover:shadow-orange-200",
  },
  {
    code: "02",
    label: "BUSINESS",
    bn: "ব্যবসা",
    description: "Office, consultancy & business",
    bnDescription: "অফিস, কনসালটেন্সি ও ব্যবসা",
    href: "/global-business",
    emoji: "🏢",
    activeClass: "from-emerald-600 to-green-700",
    glowClass: "group-hover:shadow-emerald-200",
  },
  {
    code: "03",
    label: "HEALTH",
    bn: "স্বাস্থ্য",
    description: "Health, care & wellbeing",
    bnDescription: "স্বাস্থ্য, চিকিৎসা ও যত্ন",
    href: "/health",
    emoji: "🩺",
    activeClass: "from-rose-500 to-pink-700",
    glowClass: "group-hover:shadow-rose-200",
  },
  {
    code: "04",
    label: "EDUCATION",
    bn: "শিক্ষা",
    description: "Students, skills & institutes",
    bnDescription: "শিক্ষার্থী, দক্ষতা ও প্রতিষ্ঠান",
    href: "/education",
    emoji: "🎓",
    activeClass: "from-violet-600 to-purple-700",
    glowClass: "group-hover:shadow-violet-200",
  },
  {
    code: "05",
    label: "SOCIAL HUB",
    bn: "সোশ্যাল হাব",
    description: "Posts, people & community",
    bnDescription: "পোস্ট, মানুষ ও কমিউনিটি",
    href: "/status-feed",
    emoji: "🤝",
    activeClass: "from-pink-600 to-rose-700",
    glowClass: "group-hover:shadow-pink-200",
  },
  {
    code: "06",
    label: "ENTERTAINMENT",
    bn: "বিনোদন",
    description: "TV, music, movies & shows",
    bnDescription: "TV, music, movies ও shows",
    href: "/entertainment",
    emoji: "🎬",
    activeClass: "from-red-600 to-orange-700",
    glowClass: "group-hover:shadow-red-200",
  },
  {
    code: "07",
    label: "SPORTS",
    bn: "স্পোর্টস",
    description: "Athletes, sports & activities",
    bnDescription: "খেলোয়াড়, খেলা ও কার্যক্রম",
    href: "/sports",
    emoji: "🏆",
    activeClass: "from-yellow-500 to-orange-600",
    glowClass: "group-hover:shadow-yellow-200",
  },
  {
    code: "08",
    label: "ART OF BRAIN",
    bn: "আর্ট অব ব্রেইন",
    description: "Ideas, stories & creativity",
    bnDescription: "ভাবনা, গল্প ও সৃজনশীলতা",
    href: "/art-of-brain",
    emoji: "🧠",
    activeClass: "from-fuchsia-600 to-purple-700",
    glowClass: "group-hover:shadow-fuchsia-200",
  },
  {
    code: "09",
    label: "EVENTS",
    bn: "ইভেন্ট",
    description: "Events & participation",
    bnDescription: "অনুষ্ঠান ও অংশগ্রহণ",
    href: "/events",
    emoji: "📅",
    activeClass: "from-fuchsia-600 to-pink-700",
    glowClass: "group-hover:shadow-fuchsia-200",
  },
  {
    code: "10",
    label: "TOURISM",
    bn: "ট্যুরিজম",
    description: "Places, hotels & experiences",
    bnDescription: "ভ্রমণ, হোটেল ও অভিজ্ঞতা",
    href: "/tourism",
    emoji: "🌍",
    activeClass: "from-cyan-600 to-blue-700",
    glowClass: "group-hover:shadow-cyan-200",
  },
  {
    code: "11",
    label: "RELIGION",
    bn: "ধর্ম ও সভ্যতা",
    description: "Knowledge, books & community",
    bnDescription: "জ্ঞান, বই ও কমিউনিটি",
    href: "/religion-civilization",
    emoji: "🕌",
    activeClass: "from-teal-600 to-cyan-700",
    glowClass: "group-hover:shadow-teal-200",
  },
];

/* =========================================================
   HOW IT WORKS
========================================================= */

const howItWorks = [
  {
    number: "01",
    icon: UserRound,
    title: "একটি Profile তৈরি করুন",
    en: "Create your profile",
    text: "একটি account দিয়ে প্রয়োজন অনুযায়ী Shromobazar-এর বিভিন্ন সুবিধা ব্যবহার করুন।",
    enText: "Use one account across the Shromobazar ecosystem.",
    color: "bg-[#07152d]",
  },
  {
    number: "02",
    icon: Search,
    title: "সঠিক সুযোগ খুঁজুন",
    en: "Find the right opportunity",
    text: "Worker, Job, Marketplace, Business বা প্রয়োজনীয় service খুঁজে নিন।",
    enText: "Find workers, jobs, products, businesses and services.",
    color: "bg-[#c2410c]",
  },
  {
    number: "03",
    icon: Handshake,
    title: "যোগাযোগ ও কাজ শুরু করুন",
    en: "Connect & get started",
    text: "যোগাযোগ, hiring, buying, selling বা business connection-এর মাধ্যমে এগিয়ে যান।",
    enText: "Connect, hire, buy, sell or build business relationships.",
    color: "bg-[#14532d]",
  },
];

/* =========================================================
   FEATURES
========================================================= */

const features = [
  {
    icon: ShieldCheck,
    title: "বিশ্বস্ত Workforce",
    en: "Trusted Workforce",
    description:
      "দক্ষ কর্মী ও পেশাজীবীদের জন্য একটি সংগঠিত ও আধুনিক workforce platform।",
    enDescription:
      "An organized digital platform for workers and professionals.",
  },
  {
    icon: Handshake,
    title: "কাজের সুযোগ",
    en: "Work Opportunities",
    description:
      "Worker ও Employer-এর মধ্যে সরাসরি কাজের সুযোগ তৈরি করুন।",
    enDescription:
      "Create direct opportunities between workers and employers.",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    en: "Marketplace",
    description:
      "পণ্য, সেবা ও ব্যবসার জন্য নিজের digital presence তৈরি করুন।",
    enDescription:
      "Build a digital presence for products, services and business.",
  },
  {
    icon: WalletCards,
    title: "Connected Tools",
    en: "Connected Tools",
    description:
      "Work, Market, Business, Connect, Wallet ও অন্যান্য tools এক ecosystem-এ।",
    enDescription:
      "Work, market, business, connect, wallet and more in one ecosystem.",
  },
];

/* =========================================================
   ENTERTAINMENT ROW
========================================================= */

function EntertainmentRow({ language }: { language: Language }) {
  const items = [
    ["🎬", "Movies"],
    ["🎵", "Music"],
    ["📺", "SHROMO TV"],
    ["⚽", "Live Sports"],
    ["🎤", "Shows"],
    ["📅", "Events"],
  ];

  return (
    <div className="mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#020817]/90 p-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur sm:mt-3 sm:p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-md">
            <MonitorPlay className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-[78px]">
            <p className="text-[7px] font-black uppercase tracking-[0.18em] text-orange-400">
              SHROMO ENTERTAINMENT
            </p>

            <h3 className="truncate text-[10px] font-black text-white sm:text-xs">
              TV • Live Sports • Music • Movies • Shows
            </h3>
          </div>
        </div>

        <Link
          href="/entertainment"
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[7px] font-black text-slate-300 transition hover:bg-orange-500/10 hover:text-white sm:px-3"
        >
          {language === "bn" ? "দেখুন" : "EXPLORE"}
          <ChevronRight className="h-2.5 w-2.5" />
        </Link>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
        {items.map(([emoji, label]) => (
          <Link
            key={label}
            href="/entertainment"
            className="inline-flex min-w-0 items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.045] px-1.5 py-1.5 text-[7px] font-bold text-slate-300 transition hover:-translate-y-0.5 hover:border-orange-400/30 hover:bg-orange-500/10 hover:text-white sm:text-[8px]"
          >
            <span className="text-xs">{emoji}</span>
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SHROMO TV
========================================================= */

function ShromoTV() {
  const [items, setItems] = useState<TVContent[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadTV() {
      try {
        const response = await fetch("/api/shromo-tv", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load SHROMO TV");
        }

        const data = await response.json();

        if (mounted) {
          setItems(Array.isArray(data?.content) ? data.content : []);
        }
      } catch {
        if (mounted) {
          setItems([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTV();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    if (activeIndex >= items.length && items.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  const active = items[activeIndex];

  const handleShare = async () => {
    if (!active) return;

    const url = `${window.location.origin}/shromo-tv/${active.slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: active.title,
          text: active.description || "SHROMO TV",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        window.alert("SHROMO TV link copied.");
      }
    } catch {
      // User cancelled sharing.
    }
  };

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#06142d] p-1.5 shadow-[0_22px_60px_rgba(0,0,0,0.34)] sm:rounded-[1.55rem] sm:p-2">
        <div className="relative aspect-[1.68/1] min-h-[220px] overflow-hidden rounded-[1.1rem] bg-[#06101f] sm:min-h-[210px] lg:min-h-[250px]">
          {active ? (
            <>
              {active.media_type === "video" ? (
                <video
                  key={active.id}
                  src={active.media_url}
                  poster={active.thumbnail_url || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <img
                  src={active.media_url}
                  alt={active.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020817]/95 via-[#020817]/20 to-transparent" />

              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_38%)]" />

              <div className="absolute left-3 right-3 top-3 flex items-center justify-between sm:left-4 sm:right-4 sm:top-4">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2.5 py-1.5 text-[7px] font-black tracking-[0.16em] text-white backdrop-blur-md sm:px-3 sm:text-[8px]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  SHROMO TV
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/55 text-white backdrop-blur-md transition hover:bg-white/15 sm:h-8 sm:w-8"
                  aria-label="Share SHROMO TV"
                >
                  <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300 sm:text-[8px]">
                      SHROMO DISPLAY
                    </p>

                    <h2 className="mt-1 line-clamp-2 max-w-[90%] text-sm font-black leading-tight text-white sm:text-lg lg:text-xl">
                      {active.title}
                    </h2>

                    {active.description ? (
                      <p className="mt-1 line-clamp-1 max-w-xl text-[8px] leading-4 text-slate-200 sm:text-[9px] sm:leading-5">
                        {active.description}
                      </p>
                    ) : null}
                  </div>

                  <Link
                    href={`/shromo-tv/${active.slug}`}
                    className="hidden shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[7px] font-black tracking-[0.12em] text-white backdrop-blur transition hover:bg-white/20 sm:inline-flex"
                  >
                    WATCH
                  </Link>
                </div>

                {items.length > 1 ? (
                  <div className="mt-2 flex items-center gap-1.5">
                    {items.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Show ${index + 1}`}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          index === activeIndex
                            ? "w-7 bg-cyan-300"
                            : "w-2 bg-white/35 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,#122746_0%,#050b16_68%)]">
              <div className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/5 text-cyan-300 sm:h-12 sm:w-12">
                  <MonitorPlay className="h-5 w-5" />
                </div>

                <p className="mt-2.5 text-xs font-black text-white sm:text-sm">
                  {loading ? "SHROMO TV Loading..." : "SHROMO TV"}
                </p>

                <p className="mt-1 text-[8px] text-slate-400">
                  {loading
                    ? "Loading published content"
                    : "Published stories and promotions will appear here"}
                </p>
              </div>
            </div>
          )}
        </div>

          <Link
            href="/shromo-tv"
            className="inline-flex items-center gap-1 text-[7px] font-bold tracking-[0.12em] text-slate-400 transition hover:text-white sm:text-[8px]"
          >
            OPEN SHROMO TV
            <span className="text-cyan-300">→</span>
          </Link>
        </div>
      </div>
  );
}

      /* =========================================================
              SPONSOR BAR
      ========================================================= */
function RunningSponsorBar() {
  const welcomeMessages = [
    {
      icon: "✨",
      text: "Welcome to Shromobazar — আপনার কাজ, কর্মী, ব্যবসা ও সেবার সংযুক্ত প্ল্যাটফর্ম।",
    },
    {
      icon: "🤝",
      text: "এক জায়গায় মানুষ, কাজ, ব্যবসা ও professional service-এর connection।",
    },
    {
      icon: "🚫",
      text: "No Commission — connection-এর জন্য কোনো commission নয়।",
    },
    {
      icon: "📺",
      text: "Shromo TV — Entertainment, Events & Live Content।",
    },
    {
      icon: "🌍",
      text: "Probashi Service — দেশে ও বিদেশে সুযোগের সঙ্গে যুক্ত থাকুন।",
    },
    {
      icon: "🚚",
      text: "Courier & Ride Share — আরও বাস্তব service workflow আসছে।",
    },
    {
      icon: "🏆",
      text: "Sports • Medical • Education — আরও service এক platform-এ।",
    },
    {
      icon: "🔔",
      text: "নতুন নতুন service ও সুবিধা নিয়মিত যুক্ত হচ্ছে।",
    },
    {
      icon: "🚀",
      text: "Shromobazar-এর সঙ্গে যুক্ত থাকুন — আরও অনেক কিছু আসছে।",
    },
  ];

  return (
    <section className="w-full overflow-hidden border-b border-slate-200 bg-white">
      <div className="flex h-7 w-full items-center sm:h-8">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-max animate-[shromoWelcome_45s_linear_infinite] items-center whitespace-nowrap">
            {[...welcomeMessages, ...welcomeMessages].map(
              (item, index) => (
                <div
                  key={`${item.text}-${index}`}
                  className="mx-3 inline-flex items-center gap-1.5 text-[8px] font-semibold text-slate-950 sm:mx-5 sm:text-[9px]"
                >
                  {/* SMALL ICON */}
                  <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-[7px] shadow-sm sm:h-4 sm:w-4">
  {item.icon}
</span>

                  {/* TEXT */}
                  <span className="text-slate-950">
                    {item.text}
                  </span>

                  {/* ORANGE SEPARATOR */}
                  <span className="font-black text-orange-500">
                    •
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shromoWelcome {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
      
  
/* =========================================================
   NETWORK CARDS
========================================================= */

function NetworkCards({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  const officialServices = [
    {
      title: "বিদেশ যাওয়ার প্রস্তুতি",
      subtitle: "Official guidance",
      href: "https://probashi.gov.bd/pages/static-pages/6940329335ce18e1c055ecde",
    },
    {
      title: "অনলাইন অভিযোগ",
      subtitle: "Probashi support",
      href: "https://probashi.gov.bd/pages/internal-eservices",
    },
    {
      title: "পররাষ্ট্র সেবা",
      subtitle: "CSAT / Mission",
      href: "https://csat.mofa.gov.bd/",
    },
    {
      title: "Remittance তথ্য",
      subtitle: "Bangladesh Bank",
      href: "https://www.bb.org.bd/en/index.php/investfacility/drawing",
    },
  ];

  return (
    <div className="mt-2 w-full">
{/* ADD POST */}
<Link
  href="/add-post"
  className="group mb-2 block overflow-hidden rounded-2xl border border-blue-300/25 bg-gradient-to-r from-[#0f3b68] via-[#155e9e] to-[#0c4a6e] p-3 shadow-[0_10px_30px_rgba(15,59,104,0.18)] transition hover:-translate-y-0.5 hover:border-blue-200/50"
>
  <div className="flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl ring-1 ring-white/15">
        ➕
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white">
          ADD POST
        </p>

        <p className="mt-0.5 text-[8px] text-blue-100 sm:text-[9px]">
          {language === "bn"
            ? "পণ্য • সেবা • কাজ • প্রয়োজনীয় পোস্ট দিন"
            : "Post products • services • jobs • needs"}
        </p>
      </div>
    </div>

    <div className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[8px] font-black text-[#0f3b68] transition group-hover:bg-blue-50">
      {language === "bn" ? "POST করুন" : "POST NOW"} →
    </div>
  </div>
</Link>

{/* POST UPDATES */}
<Link
  href="/post-updates"
  className="group mb-2 block overflow-hidden rounded-2xl border border-emerald-300/25 bg-gradient-to-r from-[#064e3b] via-[#087f5b] to-[#0f766e] p-3 shadow-[0_10px_30px_rgba(6,78,59,0.18)] transition hover:-translate-y-0.5 hover:border-emerald-200/50"
>
  <div className="flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl ring-1 ring-white/15">
        📢
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white">
          POST UPDATES
        </p>

        <p className="mt-0.5 text-[8px] text-emerald-100 sm:text-[9px]">
          {language === "bn"
            ? "নতুন পোস্ট দেখুন • প্রয়োজনীয় পণ্য ও সেবা খুঁজুন"
            : "See new posts • Find products and services"}
        </p>
      </div>
    </div>

    <div className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[8px] font-black text-[#065f46] transition group-hover:bg-emerald-50">
      {language === "bn" ? "POST দেখুন" : "VIEW POSTS"} →
    </div>
  </div>
</Link>

    {/* ANY TRIP — APP PREVIEW */}

<Link
  href="/any-trip"
  className="mb-2 block overflow-hidden rounded-2xl border border-cyan-300/25 bg-gradient-to-r from-[#083344] via-[#0e7490] to-[#155e75] shadow-[0_10px_30px_rgba(8,145,178,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(8,145,178,0.25)]"
>
  <div className="relative">
    <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-orange-400/20 blur-2xl" />

    <div className="relative flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-400 text-sm shadow-md sm:h-9 sm:w-9 sm:rounded-xl sm:text-base sm:shadow-lg">
          🚗
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white">
              ANY TRIP
            </p>

            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[6px] font-black text-cyan-100">
              SERVICE
            </span>
          </div>

          <p className="mt-0.5 text-[7px] leading-3 text-cyan-100 sm:text-[8px]">
            Ride ও Parcel Service এক জায়গায়
          </p>
        </div>
      </div>

      <div className="shrink-0 rounded-full bg-orange-400 px-3 py-1.5 text-[7px] font-black text-slate-950 shadow-md">
        OPEN
      </div>
    </div>

    <div className="relative grid grid-cols-2 gap-1.5 border-t border-white/10 px-2 pb-2 pt-2">
      <div className="rounded-xl border border-white/10 bg-white/[0.09] px-3 py-2 transition hover:bg-white/[0.14]">
        <p className="text-[9px] font-black text-white">
          🚗 RIDE SERVICE
        </p>
        <p className="mt-0.5 text-[7px] text-cyan-100">
          যাতায়াতের জন্য
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.09] px-3 py-2 transition hover:bg-white/[0.14]">
        <p className="text-[9px] font-black text-white">
          📦 PARCEL SERVICE
        </p>
        <p className="mt-0.5 text-[7px] text-cyan-100">
          পার্সেল পাঠানোর জন্য
        </p>
      </div>
    </div>
  </div>
</Link>

      
{/* =====================================================
    PROBASHI
====================================================== */}
<div className="overflow-hidden rounded-xl border border-white/10 bg-[#06142d] shadow-[0_10px_28px_rgba(0,0,0,0.20)]">
  <div className="flex items-center justify-between gap-2.5 border-b border-white/10 px-2.5 py-2 sm:px-3 sm:py-2.5">
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-sm">
        🌍
      </div>

      <div className="min-w-0">
        <p className="truncate text-[9px] font-black uppercase tracking-[0.14em] text-cyan-300">
          PROBASHI
        </p>

        <p className="truncate text-[7px] text-slate-300 sm:text-[8px]">
          {isBn ? "কাজ • সেবা • সম্মান" : "Work • Service • Recognition"}
        </p>
      </div>
    </div>

    <Link
      href="/probashi"
      className="inline-flex h-7 shrink-0 items-center rounded-md bg-orange-500 px-2.5 text-[7px] font-black text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-400"
    >
      OPEN
    </Link>
  </div>

  <div className="grid grid-cols-2 gap-1.5 p-2">
    {officialServices.map((service) => (
      <a
        key={service.title}
        href={service.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group min-w-0 rounded-lg border border-white/8 bg-white/[0.045] px-2 py-2 transition hover:border-cyan-300/25 hover:bg-white/[0.08]"
      >
        <p className="truncate text-[8px] font-bold text-white transition group-hover:text-cyan-200">
          {service.title}
        </p>

        <p className="mt-0.5 truncate text-[6.5px] text-slate-400 sm:text-[7px]">
          {service.subtitle}
        </p>
      </a>
    ))}
  </div>

  <div className="border-t border-white/8 px-2.5 py-1.5 sm:px-3">
    <p className="text-center text-[6.5px] font-medium leading-3.5 text-slate-400 sm:text-[7.5px] sm:leading-4">
      <span className="font-black text-white">
        প্রতিটি শ্রমের সম্মান আছে।
      </span>{" "}
      দিনমজুরি, দক্ষতা, পেশা, ব্যবসা, জ্ঞান বা সেবা—মানুষের কাজে আসে এমন প্রতিটি অবদানই মূল্যবান।
    </p>
   </div>
  </div>
  </div>

  )
}

{/* GLOBAL CONNECTION */}

<Link
  href="/global-business"
  className="group mt-1.5 block overflow-hidden rounded-xl border border-emerald-300/25 bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#0f766e] p-2.5 shadow-[0_10px_28px_rgba(6,78,59,0.22)] transition hover:-translate-y-0.5 hover:border-emerald-300/50 sm:p-3"
>
  <div className="flex items-center justify-between gap-2.5">
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-base ring-1 ring-cyan-300/15">
        🌐
      </div>

      <div className="min-w-0">
        <p className="truncate text-[8px] font-black uppercase tracking-[0.14em] text-cyan-300">
          GLOBAL CONNECTION
        </p>

        <h3 className="mt-0.5 truncate text-xs font-black text-white sm:text-sm">
          Bangladesh ↔ World
        </h3>

        <p className="mt-0.5 truncate text-[7px] text-slate-300 sm:text-[8px]">
          Business • People • Market • Investment • Partnership
        </p>
      </div>
    </div>

    <div className="inline-flex h-7 shrink-0 items-center rounded-md border border-orange-300/30 bg-orange-500 px-2.5 text-[7px] font-black text-white shadow-md transition group-hover:bg-orange-400">
      EXPLORE →
    </div>
   </div>
  </Link>
  
/* =================================================
   CORE DASHBOARD
========================================================= */

function CoreDashboard({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  const items = [
  
    {
      href: "/marketplace",
      icon: ShoppingBag,
      emoji: "🛍️",
      title: "Marketplace",
      text: isBn
        ? "কর্মী, কাজ, পণ্য, Shop ও service"
        : "Workers, jobs, products, shops & services",
      bg: "from-orange-500 to-red-600",
    },
    {
      href: "/global-business",
      icon: Building2,
      emoji: "🏢",
      title: "Business",
      text: isBn
        ? "Office, consultancy ও business presence"
        : "Office, consultancy & business presence",
      bg: "from-emerald-600 to-green-700",
    },
    {
      href: "/health",
      icon: HeartPulse,
      emoji: "🩺",
      title: "Medical & Health",
      text: isBn
        ? "Health, care ও wellbeing"
        : "Health, care & wellbeing",
      bg: "from-rose-500 to-pink-700",
    },
    {
      href: "/education",
      icon: BookOpen,
      emoji: "🎓",
      title: "Education",
      text: isBn
        ? "Student, teacher, skills ও institute"
        : "Students, teachers, skills & institutes",
      bg: "from-violet-600 to-purple-700",
    },
  ];

  return (
    <section className="border-b border-slate-200 bg-slate-50 px-3 py-4 sm:px-5 sm:py-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-600 sm:text-[9px]">
              SHROMO CORE
            </p>

            <h2 className="mt-1.5 text-xl font-black tracking-tight text-[#07152d] sm:text-2xl">
              {isBn
                ? "আপনার প্রয়োজনের মূল জায়গাগুলো"
                : "Your core Shromobazar spaces"}
            </h2>
          </div>

          <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[7px] font-black text-slate-400 sm:block">
            ONE ACCOUNT • MULTIPLE SPACES
          </span>
        </div>

       <div className="mt-3 grid grid-cols-2 gap-1.5 lg:grid-cols-4 sm:gap-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
             <Link
  key={item.title}
  href={item.href}
  className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-3"
>
  <div
    className={`absolute right-[-16px] top-[-16px] h-16 w-16 rounded-full bg-gradient-to-br ${item.bg} opacity-[0.08] blur-2xl`}
  />

  <div className="relative flex items-center justify-between gap-2">
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.bg} text-white shadow-sm`}
    >
      <Icon className="h-4 w-4" />
    </div>

    <span className="text-base leading-none">{item.emoji}</span>
  </div>

  <h3 className="relative mt-2 truncate text-[10px] font-black text-[#07152d] sm:text-xs">
    {item.title}
  </h3>

  <p className="relative mt-0.5 line-clamp-2 min-h-[24px] text-[7px] leading-3.5 text-slate-500 sm:text-[8px] sm:leading-4">
    {item.text}
  </p>

  <span className="relative mt-2 inline-flex h-6 items-center gap-1 rounded-md bg-slate-50 px-2 text-[7px] font-black text-orange-600 transition group-hover:bg-orange-50">
    {isBn ? "দেখুন" : "OPEN"}
    <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
  </span>
</Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MARKETPLACE ECOSYSTEM STRIP
========================================================= */

function MarketplaceEcosystem({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  const items = [
    {
      href: "/marketplace",
      emoji: "🛍️",
      title: "Marketplace",
      text: isBn ? "পণ্য ও সেবা" : "Products & services",
    },
    {
      href: "/jobs",
      emoji: "💼",
      title: "Jobs",
      text: isBn ? "কাজ ও hiring" : "Work & hiring",
    },
    {
      href: "/workers",
      emoji: "👷",
      title: "Workers",
      text: isBn ? "দক্ষ মানুষ" : "Skilled people",
    },
    {
      href: "/sports",
      emoji: "🏆",
      title: "Sports",
      text: isBn ? "খেলাধুলা" : "Sports",
    },
    {
      href: "/art-of-brain",
      emoji: "🧠",
      title: "Art of Brain",
      text: isBn ? "সৃজনশীলতা" : "Creativity",
    },
  ];

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#07152d] text-white">
            <ShoppingBag className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <p className="text-[7px] font-black uppercase tracking-[0.18em] text-orange-600">
              MARKETPLACE ECOSYSTEM
            </p>

            <h3 className="truncate text-[11px] font-black text-[#07152d] sm:text-xs">
              {isBn
                ? "কাজ, কর্মী, বাজার ও সৃজনশীলতা—এক জায়গায়"
                : "Work, workers, market & creativity in one space"}
            </h3>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-5">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 transition hover:border-orange-200 hover:bg-orange-50"
            >
              <span className="text-sm">{item.emoji}</span>

              <span className="min-w-0">
                <span className="block truncate text-[8px] font-black text-[#07152d]">
                  {item.title}
                </span>

                <span className="block truncate text-[7px] text-slate-400">
                  {item.text}
                </span>
              </span>

              <ChevronRight className="ml-auto h-3 w-3 shrink-0 text-slate-300 group-hover:text-orange-500" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   BANGLADESH WHOLESALE BUSINESS MARKET
========================================================= */

function WholesaleCoreMarketRow({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  return (
    <section className="border-b border-slate-200 bg-white px-3 pb-1.5 pt-0 sm:px-6 sm:pb-2 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/wholesale-market"
          className="group relative block overflow-hidden rounded-xl border border-orange-300/40 bg-gradient-to-r from-[#07152d] via-[#0b2744] to-[#082f49] px-2.5 py-2 text-white shadow-[0_8px_22px_rgba(7,21,45,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:shadow-[0_12px_28px_rgba(7,21,45,0.22)] sm:rounded-[1.15rem] sm:px-5 sm:py-3.5"
        >
          {/* Colorful glow accents */}
          <span className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-orange-500/20 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-12 left-1/3 h-24 w-24 rounded-full bg-cyan-400/15 blur-2xl" />

          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />

          <div className="relative flex items-center gap-2 sm:flex-row sm:items-center sm:justify-between">

            {/* Left: Market identity */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-300 text-base shadow-md ring-1 ring-orange-300/30 sm:h-11 sm:w-11 sm:rounded-xl sm:text-2xl sm:ring-2">
                🧺
              </span>

              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5">
                  <p className="truncate text-[11px] font-black leading-none text-white sm:text-lg">
                    {isBn ? "পাইকারি বাজার" : "Wholesale Market"}
                  </p>

                  <span className="shrink-0 rounded-md bg-orange-500 px-1.5 py-0.5 text-[6px] font-black uppercase tracking-wide text-white shadow-sm sm:rounded-full sm:px-2 sm:py-1 sm:text-[8px]">
                    {isBn ? "B2B" : "B2B MARKET"}
                  </span>
                </div>

                <p className="mt-0.5 truncate text-[6.5px] font-semibold leading-3 text-cyan-100 sm:mt-1 sm:text-[10px] sm:leading-normal">
                  {isBn
                    ? "পণ্য • পাইকার • Supplier • Retailer • Bulk Buyer"
                    : "Products • Wholesaler • Supplier • Retailer • Bulk Buyer"}
                </p>
              </div>
            </div>

            {/* Middle: Quick visual meaning */}
            <div className="hidden items-center gap-1.5 md:flex">
              <span className="rounded-lg border border-orange-300/25 bg-orange-500/15 px-2.5 py-1.5 text-[9px] font-bold text-orange-200">
                📦 {isBn ? "পণ্য" : "Products"}
              </span>

              <span className="rounded-lg border border-emerald-300/25 bg-emerald-500/15 px-2.5 py-1.5 text-[9px] font-bold text-emerald-200">
                🏪 {isBn ? "পাইকার" : "Supplier"}
              </span>

              <span className="rounded-lg border border-cyan-300/25 bg-cyan-500/15 px-2.5 py-1.5 text-[9px] font-bold text-cyan-200">
                🛒 {isBn ? "Bulk Buyer" : "Bulk Buyer"}
              </span>

              <span className="rounded-lg border border-yellow-300/25 bg-yellow-500/15 px-2.5 py-1.5 text-[9px] font-bold text-yellow-200">
                🏬 {isBn ? "Retailer" : "Retailer"}
              </span>
            </div>

            {/* Right: Action */}
            <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-r from-orange-500 to-amber-400 text-[0px] font-black text-[#07152d] shadow-[0_5px_14px_rgba(249,115,22,0.25)] transition-all duration-300 group-hover:from-orange-400 group-hover:to-yellow-300 sm:h-auto sm:w-auto sm:gap-1.5 sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-[11px]">
              <span className="hidden sm:inline">
                {isBn ? "পাইকারি বাজারে যান" : "OPEN WHOLESALE MARKET"}
              </span>

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 sm:h-3.5 sm:w-3.5" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

/* =========================================================
   MARKET TOOLS
========================================================= */

function MarketToolsAndApps({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  return (
    <section className="border-b border-slate-200 bg-white px-3 py-2 sm:px-6 sm:py-3 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">

          {/* SHARE MARKET */}
          <Link
            href="/share-market"
            className="group relative min-w-0 overflow-hidden rounded-xl border border-emerald-300/50 bg-gradient-to-br from-emerald-100 via-emerald-50 to-white px-2.5 py-2 shadow-[0_6px_18px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-[0_10px_24px_rgba(16,185,129,0.18)] sm:rounded-2xl sm:px-4 sm:py-3"
          >
            <span className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-emerald-300/30 blur-2xl" />

            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-md sm:h-10 sm:w-10 sm:rounded-xl">
                <TrendingUpIcon />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[7px] font-black uppercase tracking-[0.14em] text-emerald-800 sm:text-[8px]">
                  SHARE MARKET
                </p>

                <h3 className="mt-0.5 truncate text-[10px] font-black leading-tight text-[#07152d] sm:text-sm">
                  {isBn ? "শেয়ার বাজার দেখুন" : "Explore Share Market"}
                </h3>

                <p className="mt-0.5 hidden truncate text-[8px] text-slate-600 sm:block">
                  {isBn
                    ? "Market information ও share-related tools"
                    : "Market information & share-related tools"}
                </p>
              </div>

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/80 text-emerald-700 shadow-sm ring-1 ring-emerald-200 transition group-hover:translate-x-0.5 sm:h-8 sm:w-8 sm:rounded-lg">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

          {/* TENDER NOTICE */}
          <Link
            href="/tenders"
            className="group relative min-w-0 overflow-hidden rounded-xl border border-blue-300/50 bg-gradient-to-br from-blue-100 via-sky-50 to-white px-2.5 py-2 shadow-[0_6px_18px_rgba(37,99,235,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-[0_10px_24px_rgba(37,99,235,0.18)] sm:rounded-2xl sm:px-4 sm:py-3"
          >
            <span className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-blue-300/30 blur-2xl" />

            <div className="relative flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#17365d] to-[#0b2744] text-white shadow-md sm:h-10 sm:w-10 sm:rounded-xl">
                <BriefcaseBusiness className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[7px] font-black uppercase tracking-[0.14em] text-blue-800 sm:text-[8px]">
                  TENDER NOTICE
                </p>

                <h3 className="mt-0.5 truncate text-[10px] font-black leading-tight text-[#07152d] sm:text-sm">
                  {isBn
                    ? "Tender Opportunity দেখুন"
                    : "Explore Tender Opportunities"}
                </h3>

                <p className="mt-0.5 hidden truncate text-[8px] text-slate-600 sm:block">
                  {isBn
                    ? "Public tender notice ও official source"
                    : "Public tender notices & official sources"}
                </p>
              </div>

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/80 text-blue-800 shadow-sm ring-1 ring-blue-200 transition group-hover:translate-x-0.5 sm:h-8 sm:w-8 sm:rounded-lg">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
/* =========================================================
   TODAY'S MARKET RATE
========================================================= */

function MarketRatesSection({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  const categories = [
    ["👷", isBn ? "শ্রমিক / মিস্ত্রি" : "Worker / Mason"],
    ["🔧", isBn ? "টেকনিশিয়ান" : "Technician"],
    ["🚚", isBn ? "ড্রাইভার" : "Driver"],
    ["🏗️", isBn ? "ইঞ্জিনিয়ার" : "Engineer"],
  ];

  return (
    <section className="border-b border-slate-200 bg-white px-3 py-3.5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[7px] font-black uppercase tracking-[0.16em] text-emerald-600 sm:text-[9px]">
              MARKET INFORMATION
            </p>

            <h2 className="mt-1 text-base font-black leading-tight text-[#07152d] sm:text-2xl">
              {isBn ? "আজকের বাজার দর" : "Today's Market Rates"}
            </h2>

            {/* Tagline */}
            <p className="mt-1 text-[8px] font-bold leading-4 text-slate-500 sm:text-xs">
              {isBn
                ? "শ্রমকে শুধু কাজ নয়—দক্ষতা, পরিচয় ও সম্মানে রূপ দেওয়া"
                : "Turning work into skills, identity and recognition"}
            </p>
          </div>

          {/* Clear Button */}
          <Link
            href="/bazar-dor"
            className="group inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-[8px] font-black text-white shadow-[0_5px_14px_rgba(16,185,129,0.22)] transition-all duration-200 hover:bg-emerald-700 sm:h-auto sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-[9px]"
          >
            <span>
              {isBn ? "বাজার দর দেখুন" : "VIEW MARKET RATES"}
            </span>

            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Market Categories */}
        <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:mt-4 sm:grid-cols-4 sm:gap-2">
          {categories.map(([emoji, title]) => (
            <div
              key={title}
              className="min-w-0 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-2.5 shadow-sm sm:rounded-2xl sm:p-3.5"
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-base leading-none sm:text-xl">
                  {emoji}
                </span>

                <span className="shrink-0 rounded-full bg-white px-1.5 py-0.5 text-[5.5px] font-black text-slate-400 ring-1 ring-slate-100 sm:px-2 sm:py-1 sm:text-[6px]">
                  {isBn ? "আপডেট হবে" : "UPDATING"}
                </span>
              </div>

              <h3 className="mt-2 truncate text-[8px] font-black text-[#07152d] sm:mt-3 sm:text-[10px]">
                {title}
              </h3>

              <p className="mt-0.5 line-clamp-2 text-[6.5px] leading-3.5 text-slate-400 sm:mt-1 sm:text-[8px] sm:leading-4">
                {isBn
                  ? "Verified data source যুক্ত হলে এখানে rate দেখা যাবে।"
                  : "Rates will appear here when a verified data source is connected."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   GOOD WORK + COMING SOON
========================================================= */

function GoodWorkSection({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  return (
    <section className="border-b border-slate-200 bg-white px-3 py-3 sm:px-6 sm:py-5 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/good-work"
          className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 px-3 py-2.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:rounded-2xl sm:px-5 sm:py-4"
        >
          {/* Soft background glow */}
          <span className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-emerald-300/20 blur-2xl" />

          <div className="relative flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm sm:h-11 sm:w-11 sm:rounded-xl">
              <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-[6.5px] font-black uppercase tracking-[0.16em] text-emerald-700 sm:text-[8px]">
                GOOD WORK
              </p>

              <h3 className="mt-0.5 truncate text-[11px] font-black leading-tight text-[#07152d] sm:text-base">
                {isBn ? "ভালো কাজ দেখুন" : "Explore Good Work"}
              </h3>

              <p className="mt-0.5 truncate text-[6.5px] leading-3.5 text-slate-500 sm:text-[9px] sm:leading-5">
                {isBn
                  ? "ভালো কাজ, উদ্যোগ ও মানুষের উপকারের গল্প দেখুন।"
                  : "Discover positive actions, initiatives and community impact."}
              </p>
            </div>
          </div>

          <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-600 text-white shadow-sm transition group-hover:translate-x-0.5 sm:h-9 sm:w-9 sm:rounded-lg">
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
        </Link>
      </div>
    </section>
  );
}





/* =========================================================
   ONE ECOSYSTEM
========================================================= */

function OneEcosystem({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  return (
    <section className="border-b border-white/10 bg-[#07152d] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-10">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-orange-400 sm:text-[9px]">
              ONE ECOSYSTEM
            </p>

            <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
              {isBn ? "শুধু Job নয়," : "More than jobs,"}

              <span className="block text-orange-400">
                {isBn
                  ? "একটি সম্পূর্ণ Ecosystem"
                  : "a connected ecosystem"}
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-[9px] leading-6 text-slate-300 sm:text-xs sm:leading-7">
              {isBn
                ? "Worker, Employer, Buyer, Seller, Student, Creator, Professional এবং Business—সবাই প্রয়োজনীয় digital tools একটি connected platform থেকেই ব্যবহার করতে পারবে."
                : "Workers, employers, buyers, sellers, students, creators, professionals and businesses can use connected digital tools from one platform."}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {[
                "MARKETPLACE",
                "BUSINESS",
                "HEALTH",
                "EDUCATION",
                "CONNECT",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[7px] font-bold text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              const iconBg =
                index === 0
                  ? "bg-[#14532d]"
                  : index === 1
                    ? "bg-[#c2410c]"
                    : index === 2
                      ? "bg-[#7f1d1d]"
                      : "bg-[#244b78]";

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09] sm:p-5"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${iconBg}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <h3 className="mt-3 text-xs font-black text-white sm:text-sm">
                    {isBn ? feature.title : feature.en}
                  </h3>

                  <p className="mt-1.5 text-[9px] leading-5 text-slate-300 sm:text-[10px] sm:leading-6">
                    {isBn
                      ? feature.description
                      : feature.enDescription}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HOW IT WORKS
========================================================= */

function HowItWorks({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#14532d] sm:text-[9px]">
            HOW SHROMOBAZAR WORKS
          </p>

          <h2 className="mt-1.5 text-xl font-black leading-tight text-[#07152d] sm:text-2xl">
            {isBn
              ? "কাজের সংযোগ এখন আরও সহজ"
              : "A simpler way to connect"}
          </h2>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {howItWorks.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.number}
                className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${item.color}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <span className="text-3xl font-black text-slate-100">
                    {item.number}
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-black text-[#07152d] sm:text-base">
                  {isBn ? item.title : item.en}
                </h3>

                <p className="mt-1.5 text-[9px] leading-5 text-slate-500 sm:text-[10px] sm:leading-6">
                  {isBn ? item.text : item.enText}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



/* =========================================================
   MARKETPLACE BUSINESS
========================================================= */

function MarketplaceBusiness({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  return (
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[1.5rem] bg-[#07152d] p-5 shadow-2xl sm:rounded-[2rem] sm:p-7 lg:p-9">
          <div className="grid gap-7 lg:grid-cols-[1fr_.85fr] lg:items-center lg:gap-10">

            {/* LEFT SIDE */}
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg">
                <Store className="h-5 w-5" />
              </div>

              <p className="mt-4 text-[8px] font-black uppercase tracking-[0.16em] text-orange-400 sm:text-[9px]">
                BUSINESS PRESENCE
              </p>

              <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
                {isBn
                  ? "নিজের Shop বা Office তৈরি করুন।"
                  : "Build your Shop or Office."}
              </h2>

              <p className="mt-2.5 max-w-2xl text-[9px] leading-6 text-slate-300 sm:text-xs sm:leading-7">
                {isBn
                  ? "আপনার ব্যবসা, পণ্য বা professional service-এর জন্য Shromobazar-এ নিজের digital presence তৈরি করুন."
                  : "Create a digital presence for your business, products or professional services."}
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/open-your-shop"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-4 py-3 text-[9px] font-black text-white transition hover:bg-orange-700 sm:text-[10px]"
                >
                  <Store className="h-3.5 w-3.5" />
                  Open Your Shop
                </Link>

                <Link
                  href="/open-your-office"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#14532d] px-4 py-3 text-[9px] font-black text-white transition hover:bg-green-800 sm:text-[10px]"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Open Your Office
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <Store className="h-5 w-5 text-[#c2410c]" />

                <p className="mt-1.5 text-[9px] font-black leading-tight text-[#07152d] sm:mt-2.5 sm:text-xs">
                  Your Shop
                </p>

                <p className="mt-1 text-[8px] leading-4 text-slate-500">
                  {isBn
                    ? "পণ্য ও সেবা প্রদর্শন"
                    : "Showcase products & services"}
                </p>
              </div>

              <div className="rounded-xl bg-[#14532d] p-4 text-white">
                <Building2 className="h-5 w-5" />

                <p className="mt-2.5 text-xs font-black">
                  Your Office
                </p>

                <p className="mt-1 text-[8px] leading-4 text-green-100">
                  {isBn
                    ? "Business presence"
                    : "Professional presence"}
                </p>
              </div>

              <div className="rounded-xl bg-[#c2410c] p-4 text-white">
                <WalletCards className="h-5 w-5" />

                <p className="mt-2.5 text-xs font-black">
                  Connected Tools
                </p>

                <p className="mt-1 text-[8px] leading-4 text-orange-100">
                  {isBn
                    ? "Digital business tools"
                    : "Digital tools"}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-[#14532d]" />

                <p className="mt-2.5 text-xs font-black text-[#07152d]">
                  Trust
                </p>

                <p className="mt-1 text-[8px] leading-4 text-slate-500">
                  {isBn
                    ? "Reputation & safety"
                    : "Reputation & safety"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   WORKFORCE DIRECTORY
========================================================= */

function WorkforceDirectory({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  const categories = [
    {
      emoji: "👷",
      bn: "শ্রমিক ও মিস্ত্রি",
      en: "Labour & Mason",
      href: "/workers?category=construction",
    },
    {
      emoji: "🔧",
      bn: "টেকনিশিয়ান",
      en: "Technician",
      href: "/workers?category=technical",
    },
    {
      emoji: "🚗",
      bn: "ড্রাইভার",
      en: "Driver",
      href: "/workers?category=driver",
    },
    {
      emoji: "🏗️",
      bn: "ইঞ্জিনিয়ার",
      en: "Engineer",
      href: "/workers?category=engineering",
    },
    {
      emoji: "🩺",
      bn: "স্বাস্থ্যসেবা",
      en: "Healthcare",
      href: "/workers?category=health",
    },
    {
      emoji: "⚖️",
      bn: "আইন ও পেশাজীবী",
      en: "Legal & Professional",
      href: "/workers?category=professional",
    },
    {
      emoji: "👥",
      bn: "অন্যান্য পেশা",
      en: "Other Professionals",
      href: "/workers?category=other",
    },
  ];

  return (
    <section className="border-b border-slate-200 bg-white px-3 py-3.5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[7px] font-black uppercase tracking-[0.16em] text-blue-600 sm:text-[9px]">
              WORKFORCE DIRECTORY
            </p>

            <h2 className="mt-1 text-base font-black leading-tight text-[#07152d] sm:text-2xl">
              {isBn ? "আপনার প্রয়োজনের দক্ষ মানুষ" : "Find Skilled People"}
            </h2>

            <p className="mt-0.5 truncate text-[7px] text-slate-500 sm:text-[9px]">
              {isBn
                ? "বিভিন্ন পেশার Worker ও Professional খুঁজে নিন।"
                : "Find workers and professionals across different fields."}
            </p>
          </div>

          <Link
            href="/workers"
            className="group inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[#07152d] px-3 text-[7px] font-black text-white shadow-sm transition hover:bg-blue-700 sm:h-auto sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-[8px]"
          >
            <span>{isBn ? "সব দেখুন" : "VIEW ALL"}</span>
            <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* App-style Grid */}
        <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:mt-4 sm:grid-cols-4 sm:gap-2 lg:grid-cols-7">
          {categories.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-w-0 min-h-[66px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:min-h-[86px] sm:items-start sm:justify-between sm:rounded-2xl sm:p-3 sm:text-left"
            >
              <div className="flex w-full items-center justify-between gap-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-sm transition group-hover:bg-blue-50 sm:h-9 sm:w-9 sm:text-base">
                  {item.emoji}
                </span>

                <ArrowRight className="h-3 w-3 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
              </div>

              <div className="mt-1.5 min-w-0 w-full">
                <p className="truncate text-[7px] font-black text-[#07152d] group-hover:text-blue-700 sm:text-[9px]">
                  {isBn ? item.bn : item.en}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
{/* =========================================================
   SHROMOBAZAR APP — COMING SOON
========================================================= */}
<section className="w-full overflow-hidden border-y border-slate-800/80 bg-[#050b18]">
  <div className="mx-auto flex min-h-[120px] max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:min-h-[135px] sm:px-6 lg:px-8">

    {/* Phone */}
    <div className="flex shrink-0 items-center justify-center">
      <div className="relative h-[92px] w-[48px] rotate-[-7deg] rounded-[10px] border-2 border-slate-500 bg-black p-[3px] shadow-[0_0_22px_rgba(34,211,238,0.18)] sm:h-[105px] sm:w-[54px]">
        <div className="relative h-full w-full overflow-hidden rounded-[7px] bg-gradient-to-b from-[#07152d] via-[#0b2445] to-[#07111f]">
          <div className="absolute left-1/2 top-1.5 h-[5px] w-[20px] -translate-x-1/2 rounded-full bg-black" />

          <div className="flex h-full flex-col items-center justify-center px-1 text-center">
            <div className="mb-1 flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-orange-500 to-cyan-400 text-[13px] font-black text-white">
              S
            </div>

            <span className="text-[5px] font-black text-white">
              SHROMOBAZAR
            </span>

            <span className="mt-1 rounded-full bg-orange-500/15 px-1.5 py-[2px] text-[4px] font-bold text-orange-300">
              APP
            </span>
          </div>
        </div>
      </div>
    </div>

    {/* Text */}
    <div className="min-w-0 flex-1">
      <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-400 sm:text-[8px]">
        SHROMOBAZAR APP
      </p>

      <h2 className="mt-1 text-[20px] font-black leading-none text-white sm:text-[25px]">
        Coming Soon
      </h2>

      <p className="mt-1.5 text-[8px] font-medium leading-4 text-slate-400 sm:text-[9px]">
        শ্রমবাজার এখন আরও সহজে — আপনার হাতে।
      </p>
    </div>

    {/* Badge */}
    <div className="shrink-0 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-center sm:px-4">
      <div className="text-[7px] font-black uppercase tracking-[0.12em] text-orange-400 sm:text-[8px]">
        INSTALL
      </div>

      <div className="mt-0.5 text-[8px] font-black uppercase text-white sm:text-[9px]">
        Coming Soon
      </div>
    </div>

  </div>
</section>


/* =========================================================
   TRENDING ICON
========================================================= */

function TrendingUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState<Language>("bn");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(
        "shromobazar-language",
      );

      if (saved === "en" || saved === "bn") {
        setLanguage(saved);
      }
    } catch {
      // Ignore storage failures.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        "shromobazar-language",
        language,
      );
    } catch {
      // Ignore storage failures.
    }
  }, [language]);

  const isBn = language === "bn";

  const popularSearches = useMemo(
    () =>
      isBn
        ? ["Mason", "Electrician", "Driver", "Engineer"]
        : ["Mason", "Electrician", "Driver", "Engineer"],
    [isBn],
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const search = searchTerm.trim();
    const place = location.trim();

    const params = new URLSearchParams();

    if (search) {
      params.set("q", search);
    }

    if (place) {
      params.set("location", place);
    }

    window.location.href = params.toString()
      ? `/search?${params.toString()}`
      : "/search";
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">

      {/* =====================================================
          SPONSOR BAR
      ====================================================== */}

      <RunningSponsorBar />
<div className="w-full overflow-hidden border-b border-red-950/40 bg-black">
  <HomeTimePrayer />
</div>
      {/* =====================================================
          HERO
      ====================================================== */}
      
      <section className="relative w-full overflow-hidden border-b border-[#17365d] bg-[radial-gradient(circle_at_10%_15%,rgba(36,75,120,0.9)_0%,transparent_32%),radial-gradient(circle_at_90%_12%,rgba(194,65,12,0.3)_0%,transparent_28%),radial-gradient(circle_at_60%_90%,rgba(7,91,133,0.18)_0%,transparent_30%),linear-gradient(135deg,#020817_0%,#07152d_42%,#0b2744_72%,#030914_100%)] text-white shadow-[0_24px_70px_rgba(2,8,23,0.4)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-28 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute bottom-[-25%] left-[40%] h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:42px_42px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-2 sm:px-6 sm:pb-6 sm:pt-3 lg:px-8 lg:pb-7 lg:pt-4">
 
<div className="grid items-center gap-5 lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
            {/* LEFT */}

            <div className="order-2 min-w-0 -translate-y-1 lg:order-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 text-[7px] font-black uppercase tracking-[0.16em] text-slate-300 backdrop-blur sm:h-10 sm:px-4 sm:text-[8px]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
                    <Sparkles className="h-3 w-3" />
                  </span>

                  Bangladesh's Modern Workforce Platform
                </div>

                <div className="inline-flex items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.06] p-0.5 backdrop-blur">
                  <button
                    type="button"
                    onClick={() => setLanguage("bn")}
                    className={`rounded-full px-2.5 py-1 text-[7px] font-black transition ${
                      isBn
                        ? "bg-orange-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    বাংলা
                  </button>

                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`rounded-full px-2.5 py-1 text-[7px] font-black transition ${
                      !isBn
                        ? "bg-orange-500 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>


<h1 className="mt-4 max-w-none font-black leading-none tracking-[-0.035em]">
  <span className="block w-full max-w-[720px]">
    
<span className="relative grid aspect-[16/9] w-full max-w-[520px] grid-cols-2 grid-rows-2 overflow-hidden rounded-[6px] border border-white/15 bg-white/[0.06] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_12px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:aspect-auto sm:w-fit sm:max-w-none sm:grid-cols-[auto_auto] sm:grid-rows-none sm:gap-x-1 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:shadow-none sm:backdrop-blur-0">

  {isBn ? (
    <>
      <span className="flex items-center justify-center border-b border-r border-white/15 px-3 py-3 text-[clamp(24px,7vw,30px)] font-black leading-none text-orange-400 sm:border-0 sm:px-0 sm:py-0 sm:text-[60px] lg:text-[110px]">
        কাজ
      </span>

      <span className="flex items-center justify-center border-b border-white/15 px-3 py-3 text-[clamp(24px,7vw,30px)] font-black leading-none text-cyan-300 sm:border-0 sm:px-0 sm:py-0 sm:text-[60px] lg:text-[110px]">
        কর্মী
      </span>

      <span className="flex items-center justify-center border-r border-white/15 px-3 py-3 text-[clamp(24px,7vw,30px)] font-black leading-none text-emerald-400 sm:border-0 sm:px-0 sm:py-0 sm:text-[60px] lg:text-[110px]">
        ব্যবসা
      </span>

      <span className="flex items-center justify-center px-3 py-3 text-[clamp(24px,7vw,30px)] font-black leading-none text-violet-300 sm:px-0 sm:py-0 sm:text-[60px] lg:text-[110px]">
        সেবা
      </span>
    </>
  ) : (
    <>
      <span className="flex items-center justify-center border-b border-r border-white/15 px-3 py-3 text-[clamp(24px,7vw,30px)] font-black leading-none text-orange-400 sm:border-0 sm:px-0 sm:py-0 sm:text-[60px] lg:text-[75px]">
        WORK
      </span>

      <span className="flex items-center justify-center border-b border-white/15 px-3 py-3 text-[clamp(24px,7vw,30px)] font-black leading-none text-cyan-300 sm:border-0 sm:px-0 sm:py-0 sm:text-[60px] lg:text-[75px]">
        PEOPLE
      </span>

      <span className="flex items-center justify-center border-r border-white/15 px-3 py-3 text-[clamp(24px,7vw,30px)] font-black leading-none text-emerald-400 sm:border-0 sm:px-0 sm:py-0 sm:text-[60px] lg:text-[63px]">
        BUSINESS
      </span>

      <span className="flex items-center justify-center px-3 py-3 text-[clamp(24px,7vw,30px)] font-black leading-none text-violet-300 sm:px-0 sm:py-0 sm:text-[60px] lg:text-[63px]">
        SERVICES
      </span>
    </>
  )}

  {/* MOBILE ROW SEPARATORS */}
  <span className="pointer-events-none absolute left-1/2 top-1/4 z-30 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange-300/70 bg-orange-500/25 text-[10px] font-black text-orange-200 shadow-[0_0_16px_rgba(249,115,22,0.75)] backdrop-blur-sm sm:Orange">
    ✦
  </span>

  <span className="pointer-events-none absolute left-1/2 top-3/4 z-30 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-orange-300/70 bg-orange-500/25 text-[10px] font-black text-orange-200 shadow-[0_0_16px_rgba(249,115,22,0.75)] backdrop-blur-sm sm:oreange">
    ✦
  </span>

</span>




    <span className="mt-2 block text-center text-[16px] font-bold text-white/90 sm:text-left sm:text-[25px] lg:text-[30px]">
      {isBn
        ? "একটি সংযুক্ত প্ল্যাটফর্মে।"
        : "One connected platform."}
    </span>
  </span>
  
</h1>

              <p className="mt-4 max-w-xl text-xs leading-8 text-slate-300 sm:mt-4 sm:text-sm sm:leading-7 lg:text-base">
                {isBn
                  ? "কাজ খোঁজা, দক্ষ মানুষ খোঁজা, ব্যবসা তৈরি করা এবং digital opportunity-এর সঙ্গে যুক্ত হওয়ার জন্য একটি connected ecosystem."
                  : "Find work, skilled people, business opportunities and connected digital services in one ecosystem."}
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-4 max-w-2xl sm:mt-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-3 shadow-lg backdrop-blur transition focus-within:border-orange-400/60 focus-within:bg-white/[0.12] sm:h-11 sm:px-3.5">
                    <Search className="h-4 w-4 shrink-0 text-orange-400" />

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) =>
                        setSearchTerm(event.target.value)
                      }
                      placeholder={
                        isBn
                          ? "কর্মী, কাজ, ব্যবসা, পণ্য বা সেবা খুঁজুন…"
                          : "Search workers, jobs, business, products or services…"
                      }
                      className="min-w-0 flex-1 border-0 bg-transparent text-xs font-semibold text-white outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm"
                    />
                  </div>

                  <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-3 shadow-lg backdrop-blur transition focus-within:border-orange-400/60 focus-within:bg-white/[0.12] sm:h-11 sm:px-3.5">
                    <MapPin className="h-4 w-4 shrink-0 text-orange-400" />

                    <input
                      type="text"
                      value={location}
                      onChange={(event) =>
                        setLocation(event.target.value)
                      }
                      placeholder={
                        isBn
                          ? "এলাকা / জেলা"
                          : "Area / District"
                      }
                      className="min-w-0 flex-1 border-0 bg-transparent text-xs font-semibold text-white outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-5 text-[10px] font-black text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-500 sm:h-11"
                  >
                    <Search className="h-4 w-4" />
                    SEARCH
                  </button>
                </div>
              </form>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSearchTerm(item)}
                    className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[7px] font-semibold text-slate-300 transition hover:border-orange-300/50 hover:bg-orange-500/10 hover:text-orange-200 sm:text-[8px]"
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[8px] font-semibold text-slate-300 sm:mt-4 sm:text-[9px]">
                {[
                  "Worker",
                  "Jobs & Hiring",
                  "Marketplace",
                  "Business",
                  "Health",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    {item}
                  </span>
                ))}
              </div>
                        </div>

            

           {/* RIGHT TV */}

<div className="order-1 min-w-0 lg:order-2">
  <div className="aspect-video w-full overflow-hidden rounded-[4px] border border-white/10 bg-black/30 shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
    <ShromoTV />
  </div>

  <div className="mt-1 flex items-center justify-between px-1">
    <div className="flex min-w-0 items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-[8px]">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      <span className="truncate">Live Platform Display</span>
    </div>

    <Link
      href="/shromo-tv"
      className="inline-flex h-6 shrink-0 items-center gap-1 rounded-[4px] border border-white/10 bg-white/[0.06] px-2 text-[7px] font-black text-white backdrop-blur transition hover:border-orange-400/40 hover:text-orange-400 sm:h-7 sm:px-2.5 sm:text-[8px]"
    >
      SHROMO TV
      <ChevronRight className="h-3 w-3" />
    </Link>
  </div>

  <div className="mt-1 grid grid-cols-2 gap-1">
    {/* NO COMMISSION */}
    <div className="min-w-0 rounded-[4px] border border-red-400/35 bg-red-950/55 px-2 py-1.5 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.05)] backdrop-blur-md sm:px-2.5 sm:py-2">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-red-400/60 bg-red-500/15">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_7px_rgba(248,113,113,0.9)]" />
        </span>

        <span className="truncate text-[7px] font-black uppercase tracking-[0.08em] text-red-200 sm:text-[8px]">
          NO COMMISSION
        </span>
      </div>

      <p className="mt-0.5 truncate text-[6.5px] leading-3.5 text-slate-300 sm:text-[8px] sm:leading-4">
        {isBn
          ? "কাজ ও business connection-এর উপর commission নয়."
          : "No commission on work and business connections."}
      </p>
    </div>

    {/* SUBSCRIPTION */}
    <Link
      href="/subscriptions"
      className="group min-w-0 rounded-[4px] border border-emerald-400/40 bg-emerald-950/55 px-2 py-1.5 shadow-[inset_0_0_0_1px_rgba(52,211,153,0.05)] backdrop-blur-md transition hover:border-emerald-300/60 hover:bg-emerald-950/70 sm:px-2.5 sm:py-2"
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <WalletCards className="h-3.5 w-3.5 shrink-0 text-emerald-300" />

          <span className="truncate text-[7px] font-black uppercase tracking-[0.08em] text-emerald-200 sm:text-[8px]">
            SUBSCRIPTION
          </span>
        </div>

        <ArrowRight className="h-3 w-3 shrink-0 text-emerald-300 transition group-hover:translate-x-1" />
      </div>

      <p className="mt-0.5 truncate text-[6.5px] leading-3.5 text-slate-300 sm:text-[8px] sm:leading-4">
        {isBn
          ? "Shop, Office ও premium visibility-এর জন্য."
          : "For Shop, Office and premium visibility."}
      </p>
    </Link>
  </div>

  <div className="mt-1">
    <EntertainmentRow language={language} />
  </div>
</div>
         </div>
</div>

</section>     
      

      {/* NETWORKS */}

      <NetworkCards language={language} />


            {/* CORE DASHBOARD */}

      <CoreDashboard language={language} />

      {/* BANGLADESH WHOLESALE BUSINESS MARKET */}

     <WholesaleCoreMarketRow language={language} />


{/* FOOTPATH MARKET */}

<section className="border-b border-slate-200 bg-white px-4 py-2 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-7xl">
    <Link
      href="/footpath"
      className="group relative block overflow-hidden rounded-2xl border border-orange-400/40 bg-gradient-to-r from-[#7c2d12] via-[#c2410c] to-[#ea580c] px-4 py-3 text-white shadow-[0_10px_28px_rgba(194,65,12,0.20)] transition-all duration-300 hover:-translate-y-0.5 hover:border-yellow-300/70 hover:shadow-[0_14px_34px_rgba(194,65,12,0.28)] sm:rounded-[1.15rem] sm:px-5 sm:py-3.5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl transition-all duration-500 group-hover:bg-yellow-300/30" />
      <div className="pointer-events-none absolute -left-16 bottom-[-45px] h-32 w-32 rounded-full bg-orange-200/10 blur-3xl" />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-xl shadow-lg">
            🛍️
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[8px] font-black tracking-[0.16em] text-orange-100 sm:text-[9px]">
                স্থানীয় বিক্রেতা ও ক্ষুদ্র ব্যবসা
              </p>

              <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[6px] font-black tracking-[0.12em] text-yellow-100 sm:text-[7px]">
                ফুটপাত বাজার
              </span>
            </div>

            <h2 className="mt-1 text-lg font-black leading-tight sm:text-xl">
              ফুটপাতের বাজার
            </h2>

            <p className="mt-1 text-[8px] leading-4 text-orange-100 sm:text-[9px]">
              ফুটপাতের ক্ষুদ্র বিক্রেতা, দোকানি ও স্থানীয় ব্যবসার জন্য একটি সহজ বাজার।
            </p>
          </div>
        </div>

        <div className="relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-[8px] font-black text-orange-950 shadow-lg transition group-hover:bg-yellow-300 sm:px-5 sm:text-[9px]">
          বাজারে যান
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  </div>
</section>
 

{/* SHARE MARKET + TENDER */}

<MarketToolsAndApps language={language} />
      {/* MARKETPLACE ECOSYSTEM */}

      <MarketplaceEcosystem language={language} />

      {/* SMART APPS — COMING SOON */}

      <section className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <button
            type="button"
            onClick={() =>
              window.alert(
                isBn
                  ? "Shromobazar App Experience প্রস্তুত করা হচ্ছে। Web platform এখনই ব্যবহার করতে পারেন।"
                  : "Shromobazar App Experience is being prepared. You can use the web platform now.",
              )
            }
            className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-[#07152d] via-[#102c4d] to-[#17365d] px-4 py-3 text-left text-white shadow-[0_8px_24px_rgba(7,21,45,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(7,21,45,0.22)] sm:px-5"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />

            <div className="relative flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl ring-1 ring-white/10">
                📱
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-200 sm:text-[9px]">
                  SHROMOBAZAR APP
                </p>

                <p className="mt-0.5 truncate text-xs font-black sm:text-sm">
                  {isBn
                    ? "Smart App Experience — খুব শিগগিরই"
                    : "Smart App Experience — Coming Soon"}
                </p>

                <p className="mt-0.5 truncate text-[8px] text-slate-300 sm:text-[9px]">
                  {isBn
                    ? "এক প্ল্যাটফর্মে কাজ, ব্যবসা, সেবা ও Marketplace"
                    : "Work, business, services and Marketplace in one platform"}
                </p>
              </div>
            </div>

            <span className="relative shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[8px] font-black text-cyan-100 sm:text-[9px]">
              {isBn ? "COMING SOON" : "COMING SOON"}
            </span>
          </button>
        </div>
      </section>

     

      {/* GOOD WORK */}

      <GoodWorkSection language={language} />

      {/* MARKET RATES */}

      <MarketRatesSection language={language} />

      

      {/* SMART EXPLORE */}

      <SmartExplore language={language} />

      

      {/* ONE ECOSYSTEM */}

      <OneEcosystem language={language} />

      {/* HOW IT WORKS */}

      <HowItWorks language={language} />

      {/* MARKETPLACE BUSINESS */}

      <MarketplaceBusiness language={language} />

      {/* WORKER DIRECTORY */}

      <WorkforceDirectory language={language} />

      {/* FINAL CTA */}

    
    
{/* GOVERNMENT SERVICES */}

<section className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6 lg:px-8">
  <div className="mx-auto max-w-7xl">
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700 sm:text-[10px]">
          OFFICIAL GOVERNMENT SERVICES
        </p>

        <h2 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
          সরকারি সেবা
        </h2>

        <p className="mt-1 text-[10px] leading-5 text-slate-500 sm:text-xs">
          গুরুত্বপূর্ণ সরকারি অনলাইন সেবার অফিসিয়াল ওয়েবসাইটে সরাসরি যান।
        </p>
      </div>

      <a
        href="https://bangladesh.gov.bd/"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[9px] font-black text-emerald-700 transition hover:bg-emerald-100 sm:px-4 sm:text-[10px]"
      >
        জাতীয় তথ্য বাতায়ন →
      </a>
    </div>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {[
        {
          icon: "🧾",
          title: "e-Return",
          subtitle: "আয়কর",
          href: "https://etaxnbr.gov.bd/",
        },
        {
          icon: "🏞️",
          title: "ভূমি সেবা",
          subtitle: "Land Services",
          href: "https://land.gov.bd/",
        },
        {
          icon: "🛂",
          title: "e-Passport",
          subtitle: "পাসপোর্ট সেবা",
          href: "https://www.epassport.gov.bd/",
        },
        {
          icon: "👶",
          title: "জন্ম ও মৃত্যু",
          subtitle: "নিবন্ধন সেবা",
          href: "https://bdris.gov.bd/",
        },
        {
          icon: "🚗",
          title: "BRTA",
          subtitle: "অনলাইন সেবা",
          href: "https://bsp.brta.gov.bd/",
        },
        {
          icon: "🇧🇩",
          title: "সব সরকারি সেবা",
          subtitle: "জাতীয় তথ্য বাতায়ন",
          href: "https://bangladesh.gov.bd/",
        },
      ].map((service) => (
        <a
          key={service.title}
          href={service.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-md sm:p-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm ring-1 ring-slate-200">
              {service.icon}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-[10px] font-black text-slate-800 sm:text-xs">
                {service.title}
              </h3>

              <p className="mt-0.5 truncate text-[8px] font-medium text-slate-500 sm:text-[9px]">
                {service.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-2 text-[8px] font-bold text-emerald-700 opacity-80 group-hover:opacity-100 sm:text-[9px]">
            Official Website ↗
          </div>
        </a>
      ))}
    </div>

    <p className="mt-4 text-center text-[8px] leading-4 text-slate-400 sm:text-[9px]">
      Shromobazar শুধুমাত্র সংশ্লিষ্ট সরকারি ওয়েবসাইটে সংযোগ প্রদান করে।
      আবেদন, পেমেন্ট ও সেবার কার্যক্রম সংশ্লিষ্ট সরকারি কর্তৃপক্ষের মাধ্যমে সম্পন্ন হবে।
    </p>
    </div>
  </section>
    </main>
  );
}

/* =========================================================
   SMART EXPLORE
========================================================= */

function SmartExplore({
  language,
}: {
  language: Language;
}) {
  const [selectedExplore, setSelectedExplore] =
    useState("MARKETPLACE");

  const isBn = language === "bn";

  return (
    <section className="border-b border-slate-200 bg-white px-2.5 py-3 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Compact Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-orange-600 text-white">
                <Sparkles className="h-3 w-3" />
              </span>

              <div className="min-w-0">
                <p className="text-[6px] font-black uppercase tracking-[0.16em] text-orange-600 sm:text-[8px]">
                  SHROMO ECOSYSTEM
                </p>

                <h2 className="truncate text-sm font-black leading-tight text-[#07152d] sm:text-2xl">
                  {isBn ? "Shromobazar Explore" : "Explore Shromobazar"}
                </h2>
              </div>
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[6px] font-black text-slate-400">
              ONE PLATFORM
            </span>

            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[6px] font-black text-emerald-600">
              CONNECTED
            </span>
          </div>
        </div>

        {/* Mobile Explore Label */}
        <div className="mt-2 flex items-center gap-1.5 sm:hidden">
          <span className="h-px flex-1 bg-slate-200" />

          <span className="text-[6px] font-black uppercase tracking-[0.14em] text-slate-400">
            EXPLORE
          </span>

          <span className="h-px flex-1 bg-slate-200" />
        </div>

        {/* App Grid */}
        <div className="mt-2 grid grid-cols-3 gap-1 sm:mt-4 sm:grid-cols-3 sm:gap-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
          {exploreItems.map((item) => {
            const selected = selectedExplore === item.label;

            return (
              <Link
                key={item.code}
                href={item.href}
                onClick={() => setSelectedExplore(item.label)}
                title={isBn ? item.bnDescription : item.description}
                className={`group relative flex min-w-0 min-h-[68px] flex-col items-center justify-center overflow-hidden rounded-lg border p-1.5 text-center transition-all duration-200 sm:min-h-[82px] sm:items-start sm:justify-between sm:rounded-xl sm:p-2.5 sm:text-left ${
                  selected
                    ? `border-transparent bg-gradient-to-br ${item.activeClass} text-white shadow-md`
                    : "border-slate-200 bg-white text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
                }`}
              >
                <span
                  className={`pointer-events-none absolute -right-5 -top-5 h-12 w-12 rounded-full blur-xl ${
                    selected
                      ? "bg-white/20"
                      : "bg-orange-100/0 group-hover:bg-orange-100/70"
                  }`}
                />

                {/* Icon */}
                <span
                  className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${
                    selected
                      ? "bg-white/20"
                      : "bg-slate-50 group-hover:bg-orange-50"
                  }`}
                >
                  <span className="text-sm sm:text-base">
                    {item.emoji}
                  </span>
                </span>

                {/* Title */}
                <div className="relative mt-1 min-w-0 w-full">
                  <span
                    className={`block truncate text-[7px] font-black sm:text-[9px] ${
                      selected
                        ? "text-white"
                        : "text-[#07152d] group-hover:text-orange-600"
                    }`}
                  >
                    {isBn ? item.bn : item.label}
                  </span>

                  {/* Description only desktop */}
                  <span
                    className={`mt-0.5 hidden truncate text-[6px] font-semibold leading-3 sm:block ${
                      selected ? "text-white/65" : "text-slate-400"
                    }`}
                  >
                    {isBn ? item.bnDescription : item.description}
                  </span>
                </div>

                {/* Code / Arrow */}
                <span
                  className={`absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[5px] font-black sm:right-1.5 sm:top-1.5 sm:h-5 sm:min-w-5 ${
                    selected
                      ? "bg-white/15 text-white/80"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {item.code}
                </span>

                <span
                  className={`absolute bottom-1 right-1 hidden h-4 w-4 items-center justify-center rounded-full sm:flex ${
                    selected
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600"
                  }`}
                >
                  <ChevronRight className="h-2.5 w-2.5" />
                </span>
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-center gap-1.5 sm:mt-3">
          <span className="h-1 w-1 rounded-full bg-emerald-500" />

          <p className="text-center text-[6px] font-semibold text-slate-400 sm:text-[8px]">
            {isBn
              ? "একটি account • একাধিক identity • connected ecosystem"
              : "One account • multiple identities • connected ecosystem"}
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SMALL ICON HELPER
========================================================= */

function PlusIcon() {
  return (
    <span className="relative block h-5 w-5">
      <span className="absolute left-1/2 top-0 h-5 w-0.5 -translate-x-1/2 rounded-full bg-white" />
      <span className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-white" />
    </span>
  );
}

/* =========================================================
   HOME TIME + PRAYER
========================================================= */

function HomeTimePrayer() {
  const [now, setNow] = useState<Date | null>(null);
  const [prayer, setPrayer] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    async function syncTime() {
      try {
        const response = await fetch("/api/time", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Time sync failed");
        }

        const data = await response.json();

        if (cancelled || typeof data?.timestamp !== "number") {
          return;
        }

        const serverTimestamp = data.timestamp;
        const clientReceivedAt = Date.now();

        setNow(new Date(serverTimestamp));

        timer = window.setInterval(() => {
          const elapsed = Date.now() - clientReceivedAt;

          setNow(new Date(serverTimestamp + elapsed));
        }, 1000);
      } catch {
        if (!cancelled) {
          setNow(new Date());
        }
      }
    }

    syncTime();

    return () => {
      cancelled = true;

      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, []);

  useEffect(() => {
    if (!now) return;

    let cancelled = false;

    async function loadPrayerTimes() {
      try {
        const date = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Dhaka",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(now ?? new Date());
        
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${date}?city=Dhaka&country=Bangladesh&method=1`,
          { cache: "no-store" },
        );

        if (!response.ok) return;

        const data = await response.json();

        if (!cancelled) {
          setPrayer(data?.data?.timings ?? {});
        }
      } catch {
        // Keep existing prayer data if the API is unavailable.
      }
    }

    loadPrayerTimes();

    return () => {
      cancelled = true;
    };
  }, [now?.getFullYear(), now?.getMonth(), now?.getDate()]);

  if (!now) {
    return (
      <div className="flex h-[27px] w-full items-center justify-center overflow-hidden bg-black px-2">
        <span className="whitespace-nowrap text-[7px] font-black uppercase tracking-[0.04em] text-red-400 sm:text-[8px]">
          TIME --:-- &nbsp;•&nbsp; DATE -- &nbsp;•&nbsp; PRAYER --
        </span>
      </div>
    );
  }

  const dateText = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(now);

 const timeText = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Dhaka",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
}).format(now);

  const prayerList = [
    { key: "Fajr", label: "FAJR", bn: "ফজর" },
    { key: "Dhuhr", label: "ZOHOR", bn: "যোহর" },
    { key: "Asr", label: "ASR", bn: "আসর" },
    { key: "Maghrib", label: "MAGHRIB", bn: "মাগরিব" },
    { key: "Isha", label: "ISHA", bn: "এশা" },
  ];

  function prayerToMinutes(value: string) {
    const match = value?.match(/^(\d{1,2}):(\d{2})/);

    if (!match) return null;

    return Number(match[1]) * 60 + Number(match[2]);
  }

  const dhakaTimeParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(now)
    .split(":");

  const currentMinutes =
    Number(dhakaTimeParts[0]) * 60 +
    Number(dhakaTimeParts[1]);

  const validPrayers = prayerList
    .map((item) => ({
      ...item,
      time: prayer[item.key] ?? "",
      minutes: prayerToMinutes(prayer[item.key] ?? ""),
    }))
    .filter(
      (item): item is typeof item & { minutes: number } =>
        item.minutes !== null,
    );

  let currentPrayer =
    validPrayers.length > 0
      ? validPrayers[validPrayers.length - 1]
      : null;

  const nextPrayer = validPrayers.find(
    (item) => item.minutes > currentMinutes,
  );

  if (nextPrayer) {
    currentPrayer =
      validPrayers
        .slice()
        .reverse()
        .find((item) => item.minutes <= currentMinutes) ?? null;
  }

  if (!currentPrayer && validPrayers.length > 0) {
    currentPrayer = validPrayers[0];
  }

  const prayerLabel = currentPrayer
    ? `${currentPrayer.label} ${currentPrayer.time}`
    : "--";

  return (
    <div className="flex h-[27px] w-full items-center justify-center overflow-hidden bg-black px-2">
      <div className="flex min-w-max items-center gap-2 whitespace-nowrap text-[7px] font-black uppercase tracking-[0.03em] text-red-400 sm:gap-3 sm:text-[8px]">

        <span>
          TIME{" "}
          <span className="text-white">
            {timeText}
          </span>
        </span>

        <span className="text-red-900">•</span>

        <span>
          DATE{" "}
          <span className="text-white">
            {dateText}
          </span>
        </span>

        <span className="text-red-900">•</span>

        <span>
          PRAYER{" "}
          <span className="text-white">
            {prayerLabel}
          </span>
        </span>

        <span className="hidden text-red-900 sm:inline">
          •
        </span>

        <span className="hidden text-red-500/70 sm:inline">
          DHAKA
        </span>

      </div>
    </div>
  );
}
