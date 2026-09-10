"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
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
};

/* =========================================================
   POPULAR WORKER CATEGORIES
========================================================= */

const categories = [
  {
    title: "লেবার ও মিস্ত্রি",
    subtitle: "রাজমিস্ত্রি, কাঠমিস্ত্রি ও সহকারী",
    href: "/workers?category=construction",
    icon: Building2,
    color: "bg-[#17365d]",
  },
  {
    title: "টেকনিশিয়ান",
    subtitle: "ইলেকট্রিশিয়ান, প্লাম্বার ও টেকনিক্যাল কর্মী",
    href: "/workers?category=technical",
    icon: Wrench,
    color: "bg-[#c2410c]",
  },
  {
    title: "ড্রাইভার",
    subtitle: "অভিজ্ঞ ড্রাইভার ও পরিবহন কর্মী",
    href: "/workers?category=driver",
    icon: BriefcaseBusiness,
    color: "bg-[#7f1d1d]",
  },
  {
    title: "ইঞ্জিনিয়ার",
    subtitle: "Civil, Electrical ও অন্যান্য Engineer",
    href: "/workers?category=engineering",
    icon: Globe2,
    color: "bg-[#14532d]",
  },
  {
    title: "স্বাস্থ্যসেবা",
    subtitle: "Doctor, Nurse ও স্বাস্থ্য পেশাজীবী",
    href: "/workers?category=health",
    icon: HeartPulse,
    color: "bg-[#075985]",
  },
  {
    title: "আইন ও পেশাজীবী",
    subtitle: "Legal ও Professional Services",
    href: "/workers?category=professional",
    icon: ShieldCheck,
    color: "bg-[#7f1d1d]",
  },
  {
    title: "অন্যান্য পেশা",
    subtitle: "আরও সকল পেশার কর্মী দেখুন",
    href: "/workers?category=other",
    icon: Users,
    color: "bg-[#17365d]",
  },
];

/* =========================================================
   EXPLORE SHROMO
========================================================= */

const exploreItems = [
  {
    code: "01",
    label: "WORK",
    description: "Jobs, workers & employment",
    href: "/jobs",
    icon: BriefcaseBusiness,
    emoji: "💼",
    activeClass: "from-blue-600 to-indigo-700",
    glowClass: "group-hover:shadow-blue-200",
  },
  {
    code: "02",
    label: "MARKET",
    description: "Buy, sell, food, shops & services",
    href: "/marketplace",
    icon: ShoppingBag,
    emoji: "🛍️",
    activeClass: "from-orange-500 to-red-600",
    glowClass: "group-hover:shadow-orange-200",
  },
  {
    code: "03",
    label: "BUSINESS",
    description: "Office, consultancy & business services",
    href: "/global-business",
    icon: Building2,
    emoji: "🏢",
    activeClass: "from-emerald-600 to-green-700",
    glowClass: "group-hover:shadow-emerald-200",
  },
  {
    code: "04",
    label: "EDUCATION",
    description: "Students, skills, courses, institutes & research",
    href: "/education",
    icon: BookOpen,
    emoji: "🎓",
    activeClass: "from-violet-600 to-purple-700",
    glowClass: "group-hover:shadow-violet-200",
  },
  {
    code: "05",
    label: "ART OF BRAIN",
    description: "Stories, poetry, scripts, lyrics & creative ideas",
    href: "/art-of-brain",
    icon: Brain,
    emoji: "🧠",
    activeClass: "from-fuchsia-600 to-purple-700",
    glowClass: "group-hover:shadow-fuchsia-200",
  },
  {
    code: "06",
    label: "RELIGION",
    description: "Knowledge, lectures, books & community",
    href: "/religion-civilization",
    icon: Sparkles,
    emoji: "🕌",
    activeClass: "from-teal-600 to-cyan-700",
    glowClass: "group-hover:shadow-teal-200",
  },
  {
    code: "07",
    label: "HEALTH",
    description: "Health, care & wellbeing",
    href: "/health",
    icon: HeartPulse,
    emoji: "❤️",
    activeClass: "from-rose-500 to-pink-700",
    glowClass: "group-hover:shadow-rose-200",
  },
  {
    code: "08",
    label: "SPORTS",
    description: "Athletes, sports & activities",
    href: "/sports",
    icon: Trophy,
    emoji: "🏆",
    activeClass: "from-yellow-500 to-orange-600",
    glowClass: "group-hover:shadow-yellow-200",
  },
  {
    code: "09",
    label: "EVENTS",
    description: "Events, programs & participation",
    href: "/events",
    icon: Sparkles,
    emoji: "📅",
    activeClass: "from-fuchsia-600 to-pink-700",
    glowClass: "group-hover:shadow-fuchsia-200",
  },
  {
    code: "10",
    label: "TOURISM",
    description: "Travel, places, hotels & experiences",
    href: "/tourism",
    icon: MapPin,
    emoji: "🌍",
    activeClass: "from-cyan-600 to-blue-700",
    glowClass: "group-hover:shadow-cyan-200",
  },
  {
    code: "11",
    label: "SOCIAL HUB",
    description: "Connect, chat, community & networking",
    href: "/status-feed",
    icon: Users,
    emoji: "🤝",
    activeClass: "from-pink-600 to-rose-700",
    glowClass: "group-hover:shadow-pink-200",
  },
  {
    code: "12",
    label: "ENTERTAINMENT",
    description: "Shromo TV, music, movies, drama & shows",
    href: "/entertainment",
    icon: Clapperboard,
    emoji: "🎬",
    activeClass: "from-red-600 to-orange-700",
    glowClass: "group-hover:shadow-red-200",
  },
];

/* =========================================================
   FEATURES
========================================================= */

const features = [
  {
    icon: ShieldCheck,
    title: "বিশ্বস্ত Workforce",
    description:
      "দক্ষ কর্মী ও পেশাজীবীদের জন্য একটি সংগঠিত ও আধুনিক workforce platform।",
  },
  {
    icon: Handshake,
    title: "কাজের সুযোগ",
    description:
      "Worker ও Employer-এর মধ্যে সরাসরি কাজের সুযোগ তৈরি করুন।",
  },
  {
    icon: ShoppingBag,
    title: "Marketplace",
    description:
      "পণ্য, সেবা ও ব্যবসার জন্য নিজের digital presence তৈরি করুন।",
  },
  {
    icon: WalletCards,
    title: "Connected Tools",
    description:
      "Work, Market, Business, Connect, Wallet ও অন্যান্য tools এক ecosystem-এ।",
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
    text: "একটি account দিয়ে নিজের প্রয়োজন অনুযায়ী Shromobazar-এর বিভিন্ন সুবিধা ব্যবহার করুন।",
    color: "bg-[#07152d]",
  },
  {
    number: "02",
    icon: Search,
    title: "সঠিক সুযোগ খুঁজুন",
    text: "Worker, Job, Marketplace, Business বা প্রয়োজনীয় service খুঁজে নিন।",
    color: "bg-[#c2410c]",
  },
  {
    number: "03",
    icon: Handshake,
    title: "যোগাযোগ ও কাজ শুরু করুন",
    text: "যোগাযোগ, hiring, buying, selling বা business connection-এর মাধ্যমে এগিয়ে যান।",
    color: "bg-[#14532d]",
  },
];

/* =========================================================
   ENTERTAINMENT ROW
========================================================= */

function EntertainmentRow() {
  const items = [
    ["🎬", "Movies"],
    ["🎵", "Music"],
    ["📺", "SHROMO TV"],
    ["🎤", "Shows"],
    ["📖", "Stories"],
    ["🎓", "Knowledge"],
  ];

  return (
    <div className="mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#020817]/90 p-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.28)] backdrop-blur sm:mt-3 sm:p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-md">
            <MonitorPlay className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <p className="text-[7px] font-black uppercase tracking-[0.18em] text-orange-400">
              SHROMO ENTERTAINMENT
            </p>

            <h3 className="truncate text-[10px] font-black text-white sm:text-xs">
              TV • Music • Movies • Stories • Shows
            </h3>
          </div>
        </div>

        <Link
          href="/entertainment"
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 text-[7px] font-black text-slate-300 transition hover:bg-orange-500/10 hover:text-white sm:px-3"
        >
          EXPLORE
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

    const loadTV = async () => {
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
    };

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
      <div className="relative overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#01050c] p-1.5 shadow-[0_30px_90px_rgba(0,0,0,0.48)] sm:rounded-[1.8rem] sm:p-2">
        <div className="relative aspect-[1.7/1] min-h-[185px] overflow-hidden rounded-[1rem] bg-black sm:min-h-[220px] lg:min-h-[255px]">
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

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

              <div className="absolute left-3 right-3 top-3 flex items-center justify-between sm:left-5 sm:right-5 sm:top-5">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1.5 text-[7px] font-black tracking-[0.15em] text-white backdrop-blur sm:px-3 sm:text-[8px]">
                  <MonitorPlay className="h-3 w-3 text-cyan-300 sm:h-3.5 sm:w-3.5" />
                  SHROMO TV
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:bg-white/15 sm:h-8 sm:w-8"
                  aria-label="Share SHROMO TV"
                >
                  <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </button>
              </div>

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5">
                <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-300 sm:text-[8px]">
                  SHROMO DISPLAY
                </p>

                <h2 className="mt-1 max-w-2xl text-base font-black leading-tight text-white sm:mt-1.5 sm:text-xl lg:text-2xl">
                  {active.title}
                </h2>

                {active.description ? (
                  <p className="mt-1 max-w-xl text-[8px] leading-4 text-slate-200 sm:text-[10px] sm:leading-5">
                    {active.description}
                  </p>
                ) : null}

                {items.length > 1 ? (
                  <div className="mt-2 flex items-center gap-1.5">
                    {items.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Show ${index + 1}`}
                        className={`h-1 rounded-full transition-all ${
                          index === activeIndex
                            ? "w-6 bg-cyan-300"
                            : "w-2 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,#162334_0%,#080d16_65%)]">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-300">
                  <MonitorPlay className="h-5 w-5" />
                </div>

                <p className="mt-3 text-xs font-black text-white sm:text-sm">
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

        <div className="flex h-7 items-center justify-between px-2.5 sm:h-8 sm:px-3.5">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-cyan-400/70" />
            <span className="h-1.5 w-3 rounded-full bg-white/20" />
            <span className="h-1.5 w-3 rounded-full bg-white/10" />
          </div>

          <Link
            href="/shromo-tv"
            className="text-[7px] font-bold tracking-[0.12em] text-slate-400 transition hover:text-white sm:text-[8px]"
          >
            OPEN SHROMO TV
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SPONSOR BAR
========================================================= */

function RunningSponsorBar() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadSponsors = async () => {
      try {
        const response = await fetch("/api/shromo-sponsors", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        const raw = Array.isArray(data)
          ? data
          : Array.isArray(data?.sponsors)
            ? data.sponsors
            : [];

        if (mounted) {
          setSponsors(raw);
        }
      } catch {
        if (mounted) {
          setSponsors([]);
        }
      }
    };

    loadSponsors();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full overflow-hidden border-b border-slate-200 bg-white">
      <div className="flex h-8 w-full items-center">
        <div className="flex h-full shrink-0 items-center gap-2 border-r border-slate-200 bg-slate-50 px-3 text-[8px] font-black tracking-[0.14em] text-orange-600 sm:px-4">
          <Sparkles className="h-3 w-3" />
          SHROMO ADS
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          {sponsors.length > 0 ? (
            <div className="flex min-w-max animate-[marquee_28s_linear_infinite] items-center gap-10 whitespace-nowrap px-5">
              {[...sponsors, ...sponsors].map((sponsor, index) => {
                const name =
                  sponsor.company_name ||
                  sponsor.name ||
                  sponsor.title ||
                  "Sponsor";

                const offer =
                  sponsor.offer ||
                  sponsor.description ||
                  "Promotional placement";

                return (
                  <div
                    key={`${sponsor.id || name}-${index}`}
                    className="flex items-center gap-2 text-[9px] font-semibold text-[#07152d]"
                  >
                    {sponsor.logo_url ? (
                      <img
                        src={sponsor.logo_url}
                        alt={name}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    )}

                    <span className="font-black text-[#07152d]">
                      {name}
                    </span>

                    <span className="text-slate-300">—</span>

                    <span className="text-slate-500">{offer}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 px-4">
              <span className="truncate text-[8px] font-medium text-slate-500 sm:text-[9px]">
                SHROMO advertising space — আপনার কোম্পানি বা business-এর
                promotional placement এখানে আসবে।
              </span>

              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center gap-1 text-[8px] font-black text-orange-600 hover:text-orange-700"
              >
                ADD POST
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
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
   HOME PAGE
========================================================= */

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [selectedExplore, setSelectedExplore] = useState("WORK");

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

  const handleAppInstall = () => {
    window.alert(
      "Shromobazar App experience প্রস্তুত করা হচ্ছে। Web platform এখনই ব্যবহার করতে পারেন."
    );
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      {/* =====================================================
          RUNNING SPONSOR BAR
      ====================================================== */}

      <RunningSponsorBar />

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

        <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5 lg:px-8 lg:pb-7 lg:pt-6">
          <div className="grid items-center gap-5 lg:grid-cols-[1fr_1fr] lg:gap-7">
            {/* =================================================
                LEFT HERO
            ================================================== */}

            <div className="order-2 min-w-0 lg:order-1 lg:pt-1">
              <div className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 text-[7px] font-black uppercase tracking-[0.16em] text-slate-300 backdrop-blur sm:h-10 sm:px-4 sm:text-[8px]">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white shadow-md">
                  <Sparkles className="h-3 w-3" />
                </span>

                Bangladesh&apos;s Modern Workforce Platform
              </div>

             <div className="mt-4">
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[38px] font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-[58px]">
    <span className="text-orange-500">কাজ</span>
    <span className="text-slate-300">•</span>
    <span className="text-cyan-600">কর্মী</span>
  </div>

  <div className="mt-1 flex flex-wrap items-center gap-x-3 text-[42px] font-black leading-[1.05] tracking-[-0.04em] sm:text-[52px] lg:text-[62px]">
    <span className="text-emerald-600">ব্যবসা</span>
    <span className="text-slate-300">•</span>
    <span className="text-violet-600">সেবা</span>
  </div>
</div>

              <p className="mt-3 max-w-xl text-xs leading-5 text-slate-300 sm:mt-4 sm:text-sm sm:leading-6 lg:text-base">
                কাজ খোঁজা, দক্ষ মানুষ খোঁজা, ব্যবসা তৈরি করা এবং digital
                opportunity-এর সঙ্গে যুক্ত হওয়ার জন্য একটি connected ecosystem।
              </p>

              <form onSubmit={handleSearch} className="mt-4 max-w-2xl sm:mt-5">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-3 shadow-lg backdrop-blur transition focus-within:border-orange-400/60 focus-within:bg-white/[0.12] sm:h-11 sm:px-3.5">
                    <Search className="h-4 w-4 shrink-0 text-orange-400" />

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="কর্মী, কাজ, ব্যবসা, পণ্য বা সেবা খুঁজুন…"
                      className="min-w-0 flex-1 border-0 bg-transparent text-xs font-semibold text-white outline-none placeholder:text-slate-500 focus:ring-0 sm:text-sm"
                    />
                  </div>

                  <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-3 shadow-lg backdrop-blur transition focus-within:border-orange-400/60 focus-within:bg-white/[0.12] sm:h-11 sm:px-3.5">
                    <MapPin className="h-4 w-4 shrink-0 text-orange-400" />

                    <input
                      type="text"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      placeholder="এলাকা / জেলা"
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
                {["Mason", "Electrician", "Driver", "Engineer"].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSearchTerm(item)}
                      className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[7px] font-semibold text-slate-300 transition hover:border-orange-300/50 hover:bg-orange-500/10 hover:text-orange-200 sm:text-[8px]"
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[8px] font-semibold text-slate-300 sm:mt-4 sm:gap-x-5 sm:text-[9px]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Worker
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Jobs &amp; Hiring
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Marketplace
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Connect
                </span>
              </div>
            </div>

            {/* =================================================
                RIGHT TV COLUMN
            ================================================== */}

            <div className="order-1 min-w-0 lg:order-2">
              <ShromoTV />

              <div className="mt-1.5 flex items-center justify-between px-1 sm:mt-2">
                <div className="flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[8px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  Live Platform Display
                </div>

                <Link
                  href="/shromo-tv"
                  className="inline-flex items-center gap-1 text-[7px] font-black text-white transition hover:text-orange-400 sm:text-[8px]"
                >
                  SHROMO TV
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* NO COMMISSION + SUBSCRIPTION */}

              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <div className="rounded-xl border border-orange-400/20 bg-orange-500/[0.09] px-2.5 py-2 backdrop-blur transition hover:bg-orange-500/[0.14]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-orange-300 sm:h-4 sm:w-4" />

                    <span className="text-[7px] font-black uppercase tracking-[0.1em] text-orange-200 sm:text-[8px]">
                      NO COMMISSION
                    </span>
                  </div>

                  <p className="mt-1 text-[7px] leading-4 text-slate-300 sm:text-[8px]">
                    কাজ ও business connection-এর উপর commission নয়।
                  </p>
                </div>

                <Link
                  href="/subscriptions"
                  className="group rounded-xl border border-emerald-400/20 bg-emerald-500/[0.09] px-2.5 py-2 backdrop-blur transition hover:-translate-y-0.5 hover:bg-emerald-500/[0.14]"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <WalletCards className="h-3.5 w-3.5 text-emerald-300 sm:h-4 sm:w-4" />

                      <span className="text-[7px] font-black uppercase tracking-[0.1em] text-emerald-200 sm:text-[8px]">
                        SUBSCRIPTION
                      </span>
                    </div>

                    <ArrowRight className="h-3 w-3 text-emerald-300 transition group-hover:translate-x-1" />
                  </div>

                  <p className="mt-1 text-[7px] leading-4 text-slate-300 sm:text-[8px]">
                    Shop, Office ও premium visibility-এর জন্য subscription।
                  </p>
                </Link>
              </div>

              <EntertainmentRow />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          UPDATES & POSTS
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white px-4 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-600 sm:text-[10px]">
                Updates &amp; Posts
              </p>
              <h2 className="mt-1.5 text-xl font-black tracking-tight text-[#07152d] sm:text-2xl">
                কী আসছে, কী চলছে—এক জায়গায়।
              </h2>
              <p className="mt-1.5 max-w-2xl text-[10px] leading-5 text-slate-500 sm:text-xs sm:leading-6">
                নতুন feature, community update, কাজের খবর, marketplace post ও গুরুত্বপূর্ণ announcement।
              </p>
            </div>
            <Link href="/status-feed" className="inline-flex w-fit items-center gap-1.5 text-[9px] font-black text-[#07152d] hover:text-orange-600 sm:text-[10px]">
              সব Updates দেখুন
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {[
              { title: "Platform Update", text: "নতুন feature ও announcement", href: "/status-feed", icon: Sparkles },
              { title: "Work Update", text: "কাজ ও hiring-এর খবর", href: "/jobs", icon: BriefcaseBusiness },
              { title: "Marketplace", text: "পণ্য ও service post", href: "/marketplace", icon: ShoppingBag },
              { title: "Community", text: "মানুষ ও community updates", href: "/status-feed", icon: MessageCircle },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} href={item.href} className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white hover:shadow-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#07152d] shadow-sm group-hover:text-orange-600">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[9px] font-black text-[#07152d]">{item.title}</span>
                    <span className="mt-0.5 block truncate text-[8px] font-medium text-slate-500">{item.text}</span>
                  </span>
                  <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-orange-500" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          Shromo Explore — PREMIUM ECOSYSTEM NAVIGATION
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* background glow */}

        <div className="pointer-events-none absolute left-1/2 top-[-80px] h-72 w-[760px] -translate-x-1/2 rounded-full bg-orange-100/50 blur-3xl" />

        <div className="pointer-events-none absolute right-[-120px] top-20 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-64 w-64 rounded-full bg-emerald-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {/* =================================================
              SECTION HEADER
          ================================================== */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white shadow-sm">
                  <Sparkles className="h-3 w-3" />
                </span>

                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-700">
                  SHROMO ECOSYSTEM
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.025em] text-[#07152d] sm:text-3xl lg:text-4xl">
                Shromo
                <span className="text-orange-600"> Explore</span>
              </h2>

              <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm sm:leading-7">
                কাজ, ব্যবসা, শিক্ষা, স্বাস্থ্য, সামাজিক যোগাযোগ ও
                entertainment—Shromobazar ecosystem-এর প্রতিটি গুরুত্বপূর্ণ
                space এক জায়গা থেকে explore করুন।
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[8px] font-bold text-slate-500 shadow-sm">
                <Globe2 className="h-3.5 w-3.5 text-orange-500" />
                ONE PLATFORM
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-[8px] font-bold text-slate-500 shadow-sm">
                <Users className="h-3.5 w-3.5 text-emerald-600" />
                CONNECTED
              </span>
            </div>
          </div>

          {/* =================================================
              MOBILE MINI LABEL
          ================================================== */}

          <div className="mt-4 flex items-center gap-2 sm:hidden">
            <span className="h-px flex-1 bg-slate-200" />

            <span className="text-[7px] font-black uppercase tracking-[0.16em] text-slate-400">
              Explore Spaces
            </span>

            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {/* =================================================
              EXPLORE CARDS
          ================================================== */}

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-7 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
            {exploreItems.map((item, index) => {
              const selected = selectedExplore === item.label;

              return (
                <Link
                  key={item.code}
                  href={item.href}
                  onClick={() => setSelectedExplore(item.label)}
                  title={item.description}
                  style={{
                    animationDelay: `${index * 70}ms`,
                  }}
                  className={`explore-card group relative flex min-h-[76px] flex-col justify-between overflow-hidden rounded-[1.15rem] border p-3 transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.02] active:scale-95 sm:min-h-[84px] sm:rounded-[1.2rem] sm:p-3 ${
                    selected
                      ? `border-transparent bg-gradient-to-br ${item.activeClass} text-white shadow-xl ${item.glowClass}`
                      : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-orange-200 hover:shadow-xl"
                  }`}
                >
                  {/* CARD LIGHT EFFECT */}

                  <span
                    className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl transition-all duration-500 ${
                      selected
                        ? "bg-white/20"
                        : "bg-orange-100/0 group-hover:bg-orange-100/80"
                    }`}
                  />

                  {/* SHINE EFFECT */}

                  <span
                    className={`pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-full ${
                      selected ? "opacity-80" : "opacity-0"
                    }`}
                  />

                  {/* TOP ROW */}

                  <div className="relative flex items-start justify-between gap-2">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-3 sm:h-10 sm:w-10 ${
                        selected
                          ? "bg-white/20 text-white"
                          : "bg-slate-50 text-slate-700 group-hover:bg-orange-50 group-hover:text-orange-600"
                      }`}
                    >
                      <span className="text-base sm:text-lg">
                        {item.emoji}
                      </span>
                    </span>

                    <span
                      className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[6px] font-black tracking-wider ${
                        selected
                          ? "bg-white/15 text-white/80"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.code}
                    </span>
                  </div>

                  {/* TEXT */}

                  <div className="relative mt-2 min-w-0">
                    <span
                      className={`block truncate text-[8px] font-black tracking-[0.025em] sm:text-[9px] ${
                        selected
                          ? "text-white"
                          : "text-[#07152d] group-hover:text-orange-600"
                      }`}
                    >
                      {item.label}
                    </span>

                    <span
                      className={`mt-0.5 block truncate text-[6px] font-semibold leading-3 sm:text-[7px] ${
                        selected
                          ? "text-white/65"
                          : "text-slate-400 group-hover:text-slate-500"
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>

                  {/* BOTTOM ARROW */}

                  <span
                    className={`absolute bottom-2.5 right-2.5 flex h-5 w-5 items-center justify-center rounded-full transition-all duration-300 group-hover:translate-x-0.5 ${
                      selected
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600"
                    }`}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </span>

                  {/* ACTIVE / HOVER BAR */}

                  <span
                    className={`absolute bottom-0 left-0 h-0.5 w-full origin-left transition-transform duration-300 ${
                      selected
                        ? "scale-x-100 bg-white/80"
                        : "scale-x-0 bg-orange-500 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* =================================================
              BOTTOM ECOSYSTEM MESSAGE
          ================================================== */}

          <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:mt-6 sm:flex-row">
            <div className="flex items-center gap-1.5 text-[7px] font-bold text-slate-400 sm:text-[8px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.45)]" />
              Connected ecosystem
            </div>

            <span className="hidden text-slate-300 sm:block">
              •
            </span>

            <p className="text-center text-[7px] font-semibold text-slate-400 sm:text-[8px]">
              Explore your next opportunity through Shromobazar.
            </p>
          </div>
        </div>

        {/* =================================================
            EXPLORE ANIMATION
        ================================================== */}

        <style jsx>{`
          @keyframes exploreFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-2px);
            }
          }

          :global(.group) {
            animation: exploreFloat 4s ease-in-out infinite;
          }

          :global(.group:hover) {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0">
          <div className="px-3 py-4 text-center sm:px-5 sm:py-5">
            <p className="text-xl font-black text-[#07152d] sm:text-3xl">
              01
            </p>

            <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-sm">
              Unified Platform
            </p>
          </div>

          <div className="px-3 py-4 text-center sm:px-5 sm:py-5">
            <p className="text-xl font-black text-[#07152d] sm:text-3xl">
              24/7
            </p>

            <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-sm">
              Digital Access
            </p>
          </div>

          <div className="px-3 py-4 text-center sm:px-5 sm:py-5">
            <p className="text-xl font-black text-[#07152d] sm:text-3xl">
              ∞
            </p>

            <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-sm">
              Growth Opportunity
            </p>
          </div>

          <div className="px-3 py-4 text-center sm:px-5 sm:py-5">
            <p className="text-xl font-black text-[#07152d] sm:text-3xl">
              100%
            </p>

            <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-sm">
              Workforce Focused
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      <section className="bg-slate-50 px-4 py-9 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#c2410c] sm:text-sm">
                Popular Categories
              </p>

              <h2 className="mt-2.5 text-2xl font-black leading-tight tracking-tight text-[#07152d] sm:text-4xl">
                আপনার প্রয়োজনের দক্ষ মানুষ
              </h2>

              <p className="mt-2.5 max-w-2xl text-xs leading-6 text-slate-500 sm:text-base sm:leading-7">
                বিভিন্ন পেশার Worker ও Professional খুঁজে নিন।
              </p>
            </div>

            <Link
              href="/workers"
              className="inline-flex w-fit items-center gap-2 text-xs font-bold text-[#7f1d1d] sm:text-sm"
            >
              সব Worker দেখুন
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:rounded-[1.7rem]"
                >
                  <div className="flex items-center gap-4 p-5 sm:p-6">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-md ${category.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-black text-[#07152d] sm:text-base">
                        {category.title}
                      </h3>

                      <p className="mt-1 text-[10px] leading-5 text-slate-500 sm:text-xs">
                        {category.subtitle}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                  </div>

                  <div className="h-1 w-full bg-slate-100 transition group-hover:bg-orange-500" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONNECTED ACTIONS
      ====================================================== */}

      <section className="bg-white px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#14532d] sm:text-sm">
              Connected Actions
            </p>

            <h2 className="mt-2.5 text-2xl font-black leading-tight text-[#07152d] sm:text-4xl">
              আপনার পরবর্তী কাজ এখান থেকেই শুরু করুন।
            </h2>

            <p className="mt-3 text-xs leading-6 text-slate-500 sm:text-base sm:leading-7">
              Work, marketplace, business ও মানুষের সঙ্গে connection—প্রয়োজন
              অনুযায়ী সঠিক space-এ যান।
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/status-feed"
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c2410c] text-white">
                <PlusIcon />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#07152d]">
                ADD POST
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                Community বা Social Hub-এ আপনার genuine update বা post প্রকাশ
                করুন।
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-orange-600">
                Post করুন
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/marketplace"
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#17365d] text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#07152d]">
                SELL POST
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                আপনার পণ্য বা service Marketplace-এ প্রকাশ করুন।
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#17365d]">
                Sell করুন
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/buy-requests"
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14532d] text-white">
                <Search className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#07152d]">
                BUY POST
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                আপনি কী কিনতে চান বা কী service প্রয়োজন তা জানিয়ে দিন।
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#14532d]">
                Buy Request দিন
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/marketplace"
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-700 text-white">
                <Store className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#07152d]">
                OPEN YOUR SHOP
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                নিজের digital shop তৈরি করে পণ্য ও service showcase করুন।
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-purple-700">
                Shop খুলুন
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/global-business"
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#244b78] text-white">
                <Building2 className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#07152d]">
                OPEN YOUR OFFICE
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                Business, consultancy বা professional presence তৈরি করুন।
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#244b78]">
                Office খুলুন
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/chat"
              className="group rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#075985] text-white">
                <MessageCircle className="h-5 w-5" />
              </div>

              <h3 className="mt-5 text-lg font-black text-[#07152d]">
                SHROMO CONNECT
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-500">
                প্রয়োজনীয় মানুষ, worker, employer ও business-এর সঙ্গে
                connection তৈরি করুন।
              </p>

              <span className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#075985]">
                Connect করুন
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          ONE ECOSYSTEM
      ====================================================== */}

      <section className="bg-[#07152d] px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400 sm:text-sm">
                One Ecosystem
              </p>

              <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-4xl">
                শুধু Job নয়,
                <span className="block text-orange-400">
                  একটি সম্পূর্ণ Ecosystem
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-xs leading-7 text-slate-300 sm:text-base sm:leading-8">
                Worker, Employer, Buyer, Seller, Student, Creator,
                Professional এবং Business—সবাই প্রয়োজনীয় digital tools একটি
                connected platform থেকেই ব্যবহার করতে পারবে।
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["WORK", "MARKET", "BUSINESS", "CONNECT"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[8px] font-bold text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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
                    className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09] sm:rounded-3xl sm:p-6"
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-white sm:h-12 sm:w-12 ${iconBg}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-4 text-sm font-black text-white sm:mt-5">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-300 sm:text-sm">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="bg-white px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#14532d] sm:text-sm">
              How Shromobazar Works
            </p>

            <h2 className="mt-2.5 text-2xl font-black leading-tight text-[#07152d] sm:text-4xl">
              কাজের সংযোগ এখন আরও সহজ
            </h2>
          </div>

          <div className="mt-8 grid gap-3.5 sm:mt-10 sm:grid-cols-3 sm:gap-6">
            {howItWorks.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:rounded-3xl sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-white sm:h-12 sm:w-12 ${item.color}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-3xl font-black text-slate-100 sm:text-4xl">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-[#07152d] sm:mt-7 sm:text-xl">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-6 text-slate-500 sm:mt-3 sm:text-sm sm:leading-7">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          MARKETPLACE BUSINESS
      ====================================================== */}

      <section className="bg-slate-50 px-4 py-9 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[1.5rem] bg-[#07152d] p-5 shadow-2xl sm:rounded-[2rem] sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_.85fr] lg:items-center lg:gap-10">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600 text-white shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl">
                  <Store className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>

                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-orange-400 sm:mt-6 sm:text-sm">
                  Marketplace Business
                </p>

                <h2 className="mt-2.5 text-2xl font-black leading-tight text-white sm:text-4xl">
                  নিজের Shop বা Office তৈরি করুন।
                </h2>

                <p className="mt-3 max-w-2xl text-xs leading-6 text-slate-300 sm:mt-4 sm:text-base sm:leading-7">
                  আপনার ব্যবসা, পণ্য বা professional service-এর জন্য
                  Shromobazar-এ নিজের digital presence তৈরি করুন।
                </p>

                <div className="mt-5 flex flex-col gap-2.5 sm:mt-7 sm:flex-row sm:gap-3">
                  <Link
                    href="/marketplace"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-4 py-3 text-xs font-bold text-white transition hover:bg-orange-700 sm:px-5 sm:py-3.5 sm:text-sm"
                  >
                    <Store className="h-4 w-4" />
                    Open Your Shop
                  </Link>

                  <Link
                    href="/global-business"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#14532d] px-4 py-3 text-xs font-bold text-white transition hover:bg-green-800 sm:px-5 sm:py-3.5 sm:text-sm"
                  >
                    <Building2 className="h-4 w-4" />
                    Open Your Office
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
                <div className="rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                  <Store className="h-6 w-6 text-[#c2410c] sm:h-7 sm:w-7" />

                  <p className="mt-3 text-sm font-black text-[#07152d] sm:mt-4">
                    Your Shop
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                    পণ্য ও সেবা প্রদর্শন
                  </p>
                </div>

                <div className="rounded-xl bg-[#14532d] p-4 text-white sm:rounded-2xl sm:p-5">
                  <Building2 className="h-6 w-6 sm:h-7 sm:w-7" />

                  <p className="mt-3 text-sm font-black sm:mt-4">
                    Your Office
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-green-100 sm:text-xs">
                    Business presence
                  </p>
                </div>

                <div className="rounded-xl bg-[#c2410c] p-4 text-white sm:rounded-2xl sm:p-5">
                  <WalletCards className="h-6 w-6 sm:h-7 sm:w-7" />

                  <p className="mt-3 text-sm font-black sm:mt-4">
                    Connected Tools
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-orange-100 sm:text-xs">
                    Digital business tools
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5">
                  <ShieldCheck className="h-6 w-6 text-[#14532d] sm:h-7 sm:w-7" />

                  <p className="mt-3 text-sm font-black text-[#07152d] sm:mt-4">
                    Trust
                  </p>

                  <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                    Reputation & safety
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          APP SECTION
      ====================================================== */}

      <section className="bg-white px-4 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#8b2f09] via-[#b83b0a] to-[#6d1830] p-5 shadow-2xl sm:rounded-[2rem] sm:p-10 lg:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-10">
              <div className="flex justify-center">
                <div className="relative h-60 w-32 rounded-[1.75rem] border-4 border-white/80 bg-[#07152d] p-2 shadow-2xl sm:h-72 sm:w-40 sm:rounded-[2rem]">
                  <div className="flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white sm:rounded-[1.5rem]">
                    <div className="h-6 bg-[#07152d] sm:h-7" />

                    <div className="flex flex-1 flex-col items-center justify-center p-3 text-center sm:p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600 to-purple-700 text-white shadow-lg sm:h-12 sm:w-12">
                        <Smartphone className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>

                      <p className="mt-3 text-xs font-black text-[#07152d] sm:text-sm">
                        SHROMOBAZAR
                      </p>

                      <p className="mt-1 text-[8px] text-slate-500 sm:text-[9px]">
                        Global Workforce Platform
                      </p>

                      <div className="mt-3 flex gap-1 sm:mt-4">
                        <span className="h-1.5 w-5 rounded-full bg-orange-500 sm:w-6" />
                        <span className="h-1.5 w-3 rounded-full bg-purple-500" />
                        <span className="h-1.5 w-3 rounded-full bg-green-500" />
                      </div>
                    </div>

                    <div className="h-7 bg-gradient-to-r from-[#14532d] to-[#244b78] sm:h-8" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-100 sm:text-sm">
                  Shromobazar App
                </p>

                <h2 className="mt-2.5 text-2xl font-black leading-tight text-white sm:text-4xl">
                  আপনার কাজ ও ব্যবসা
                  <span className="block text-orange-100">
                    হাতের মুঠোয়।
                  </span>
                </h2>

                <p className="mt-3 text-xs leading-6 text-orange-50 sm:mt-4 sm:text-base sm:leading-7">
                  Job, Worker, Marketplace, Connect, Social Hub এবং
                  প্রয়োজনীয় digital services আরও সহজে ব্যবহার করুন।
                </p>

                <button
                  type="button"
                  onClick={handleAppInstall}
                  className="mt-5 inline-flex min-h-[50px] w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-xs font-black text-[#c2410c] shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50 sm:mt-7 sm:w-auto sm:px-6 sm:py-4 sm:text-sm"
                >
                  <Smartphone className="h-5 w-5" />
                  App Install করুন
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="bg-[#07152d] px-4 py-12 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-400 sm:text-sm">
            SHROMOBAZAR
          </p>

          <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:mt-4 sm:text-4xl">
            কাজ, কর্মী, ব্যবসা ও সেবার জন্য
            <span className="block text-orange-400">
              একটি connected platform।
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-xs leading-6 text-slate-300 sm:mt-5 sm:text-base sm:leading-7">
            আপনার প্রয়োজনের space বেছে নিন এবং Shromobazar ecosystem-এর সঙ্গে
            যুক্ত হোন।
          </p>

          <div className="mt-6 flex flex-col justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
            <Link
              href="/register"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-6 py-3.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-orange-700 sm:text-sm"
            >
              নিবন্ধন করুন
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/workers"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-bold text-white transition hover:bg-white/10 sm:text-sm"
            >
              <Users className="h-4 w-4" />
              Workforce দেখুন
            </Link>
          </div>
        </div>
      </section>
    </main>
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