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
    emoji: "❤️",
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

          <div className="min-w-0">
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
        <div className="relative aspect-[16/8.2] min-h-[145px] overflow-hidden rounded-[1rem] bg-[#081426] sm:min-h-[175px] lg:min-h-[195px]">
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

        <div className="flex h-7 items-center justify-between px-2.5 sm:h-8 sm:px-3">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-7 rounded-full bg-cyan-400/80" />
            <span className="h-1.5 w-3 rounded-full bg-white/20" />
            <span className="h-1.5 w-3 rounded-full bg-white/10" />
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
    </div>
  );
}

/* =========================================================
   SPONSOR BAR
========================================================= */

function RunningSponsorBar() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [offer, setOffer] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSponsors() {
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
        if (mounted) setSponsors([]);
      }
    }

    loadSponsors();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSponsorSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const name = companyName.trim();
    const sponsorOffer = offer.trim();
    const website = websiteUrl.trim();

    if (!name || !sponsorOffer) {
      setMessage("Business name এবং advertisement text লিখুন.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/shromo-sponsors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_name: name,
          offer: sponsorOffer,
          website_url: website || null,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Sponsor request submission failed.",
        );
      }

      const created = data?.sponsor;

      if (created) {
        setSponsors((current) => [created, ...current]);
      }

      setMessage(
        "Sponsor Request received. Admin approval-এর পর advertisement live হবে.",
      );

      setCompanyName("");
      setOffer("");
      setWebsiteUrl("");
    } catch (error) {
      console.error("Sponsor request error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Sponsor request পাঠানো যায়নি। আবার চেষ্টা করুন.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="w-full overflow-hidden border-b border-slate-200 bg-white">
        <div className="flex min-h-9 w-full items-center">
          <div className="flex min-h-9 shrink-0 items-center gap-1.5 border-r border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50 px-2.5 text-[7px] font-black tracking-[0.14em] text-orange-700 sm:gap-2 sm:px-4 sm:text-[8px]">
            <Sparkles className="h-3 w-3 text-orange-500" />
            <span>SHROMO ADS</span>
          </div>

          <div className="min-w-0 flex-1 overflow-hidden">
            {sponsors.length > 0 ? (
              <div className="flex min-w-max animate-[marquee_30s_linear_infinite] items-center gap-8 whitespace-nowrap px-4">
                {[...sponsors, ...sponsors].map((sponsor, index) => {
                  const name =
                    sponsor.company_name ||
                    sponsor.name ||
                    sponsor.title ||
                    "Sponsor";

                  const sponsorOffer =
                    sponsor.offer ||
                    sponsor.description ||
                    "Promotional placement";

                  const logo = sponsor.logo_url;

                  return (
                    <div
                      key={`${sponsor.id || name}-${index}`}
                      className="flex items-center gap-2 text-[8px] font-semibold text-[#07152d] sm:text-[9px]"
                    >
                      {logo ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white">
                          <img
                            src={logo}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        </span>
                      ) : (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                      )}

                      <span className="font-black text-[#07152d]">
                        {name}
                      </span>

                      <span className="text-slate-300">—</span>

                      <span className="text-slate-500">
                        {sponsorOffer}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center px-3 sm:px-4">
                <span className="truncate text-[8px] font-medium text-slate-500 sm:text-[9px]">
                  আপনার Business offer এখানে smart promotional strip-এ দেখান.
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setMessage("");
            }}
            className="mr-1.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-2.5 py-1.5 text-[7px] font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:from-orange-500 hover:to-red-500 sm:mr-3 sm:px-3 sm:text-[8px]"
          >
            POST AD
            <ArrowRight className="h-3 w-3" />
          </button>
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

      {showForm ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/70 px-4 backdrop-blur-sm">
          <form
            onSubmit={handleSponsorSubmit}
            className="w-full max-w-md rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-orange-600">
                  SHROMO ADS
                </p>

                <h3 className="mt-1 text-lg font-black text-[#07152d]">
                  Post your advertisement
                </h3>

                <p className="mt-1 text-[8px] text-slate-500">
                  Admin approval required before publishing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="h-8 w-8 rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <input
                value={companyName}
                onChange={(event) =>
                  setCompanyName(event.target.value)
                }
                placeholder="Business / Company name *"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-orange-400 focus:bg-white"
                required
              />

              <textarea
                value={offer}
                onChange={(event) => setOffer(event.target.value)}
                placeholder="Offer / advertisement text *"
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold outline-none focus:border-orange-400 focus:bg-white"
                required
              />

              <input
                type="url"
                value={websiteUrl}
                onChange={(event) =>
                  setWebsiteUrl(event.target.value)
                }
                placeholder="Website (optional)"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-orange-400 focus:bg-white"
              />
            </div>

            {message ? (
              <p className="mt-3 rounded-xl bg-orange-50 px-3 py-2 text-[8px] font-bold leading-4 text-orange-700">
                {message}
              </p>
            ) : null}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-[9px] font-black text-slate-600 transition hover:bg-slate-50"
              >
                CANCEL
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-[1.5] rounded-xl bg-orange-600 px-4 py-3 text-[9px] font-black text-white disabled:opacity-60"
              >
                {submitting ? "POSTING..." : "POST AD"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
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
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#06142d] shadow-[0_12px_35px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 text-base">
              🌍
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
                PROBASHI & GLOBAL
              </p>

              <p className="truncate text-[8px] text-slate-300 sm:text-[9px]">
                {isBn
                  ? "কাজ • সেবা • সম্মান • Global Connection"
                  : "Work • Service • Recognition • Global Connection"}
              </p>
            </div>
          </div>

          <Link
            href="/global-business"
            className="shrink-0 rounded-full bg-orange-500 px-3 py-1.5 text-[8px] font-black text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
          >
            OPEN
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-2.5 gap-y-2.5">
          {officialServices.map((service) => (
            <a
              key={service.title}
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-white/8 bg-white/[0.045] px-2.5 py-2.5 transition hover:border-cyan-300/25 hover:bg-white/[0.08]"
            >
              <p className="line-clamp-1 text-[9px] font-bold text-white transition group-hover:text-cyan-200">
                {service.title}
              </p>

              <p className="mt-0.5 line-clamp-1 text-[7px] text-slate-400">
                {service.subtitle}
              </p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-1.5 px-2 pb-2">
          <Link
            href="/global-business"
            className="rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] px-3 py-2.5 transition hover:bg-cyan-400/[0.1]"
          >
            <p className="text-[9px] font-black text-cyan-200">
              🌐 GLOBAL PLAYER
            </p>

            <p className="mt-0.5 text-[7px] leading-3 text-slate-400">
              নিজের দক্ষতা, সেবা ও পরিচয় দিয়ে global network-এ যুক্ত হন
            </p>
          </Link>

          <Link
            href="/good-work"
            className="rounded-xl border border-orange-400/15 bg-orange-400/[0.06] px-3 py-2.5 transition hover:bg-orange-400/[0.1]"
          >
            <p className="text-[9px] font-black text-orange-200">
              🏆 GOOD WORK
            </p>

            <p className="mt-0.5 text-[7px] leading-3 text-slate-400">
              ভালো কাজ ও মানুষের জন্য অবদান তুলে ধরুন
            </p>
          </Link>
        </div>

        <div className="border-t border-white/8 px-3 py-2 sm:px-4">
          <p className="text-center text-[7px] font-medium leading-4 text-slate-400 sm:text-[8px]">
            <span className="font-black text-white">
              প্রতিটি শ্রমের সম্মান আছে।
            </span>{" "}
            দিনমজুরি, দক্ষতা, পেশা, ব্যবসা, জ্ঞান বা সেবা—
            মানুষের কাজে আসে এমন প্রতিটি অবদানই মূল্যবান।
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
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
      emoji: "❤️",
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
    <section className="border-b border-slate-200 bg-slate-50 px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
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

        <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-4"
              >
                <div
                  className={`absolute right-[-20px] top-[-20px] h-20 w-20 rounded-full bg-gradient-to-br ${item.bg} opacity-[0.08] blur-2xl`}
                />

                <div className="relative flex items-start justify-between gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.bg} text-white shadow-sm`}
                  >
                    <Icon className="h-4.5 w-4.5" />
           function CoreDashboard       </div>

                  <span className="text-xl">{item.emoji}</span>
                </div>

                <h3 className="relative mt-3 text-sm font-black text-[#07152d] sm:text-base">
                  {item.title}
                </h3>

                <p className="relative mt-1 text-[8px] leading-4 text-slate-500 sm:text-[9px] sm:leading-5">
                  {item.text}
                </p>

                <span className="relative mt-3 inline-flex items-center gap-1 text-[7px] font-black text-orange-600">
                  {isBn ? "দেখুন" : "OPEN"}
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
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
    <section className="border-b border-slate-200 bg-white px-4 pb-2 pt-0 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/wholesale-market"
          className="group relative block overflow-hidden rounded-2xl border border-orange-300/40 bg-gradient-to-r from-[#07152d] via-[#0b2744] to-[#082f49] px-4 py-3 text-white shadow-[0_10px_28px_rgba(7,21,45,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/60 hover:shadow-[0_14px_34px_rgba(7,21,45,0.25)] sm:rounded-[1.15rem] sm:px-5 sm:py-3.5"
        >
          {/* Colorful glow accents */}
          <span className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-orange-500/20 blur-2xl" />
          <span className="pointer-events-none absolute -bottom-12 left-1/3 h-24 w-24 rounded-full bg-cyan-400/15 blur-2xl" />

          <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />

          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Market identity */}
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-300 text-2xl shadow-lg ring-2 ring-orange-300/30">
                🧺
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-black leading-none text-white sm:text-lg">
                    {isBn ? "পাইকারি বাজার" : "Wholesale Market"}
                  </p>

                  <span className="rounded-full bg-orange-500 px-2 py-1 text-[8px] font-black uppercase tracking-wide text-white shadow-sm">
                    {isBn ? "B2B" : "B2B MARKET"}
                  </span>
                </div>

                <p className="mt-1 text-[9px] font-semibold text-cyan-100 sm:text-[10px]">
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
            <span className="relative inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2.5 text-[10px] font-black text-[#07152d] shadow-[0_6px_18px_rgba(249,115,22,0.28)] transition-all duration-300 group-hover:from-orange-400 group-hover:to-yellow-300 group-hover:shadow-[0_8px_22px_rgba(249,115,22,0.4)] sm:w-auto sm:px-5 sm:text-[11px]">
              {isBn ? "পাইকারি বাজারে যান" : "OPEN WHOLESALE MARKET"}

              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
    <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {/* SHARE MARKET */}

          <Link
            href="/share-market"
            className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md sm:p-5"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-emerald-100/70 blur-2xl transition group-hover:bg-emerald-200/70" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                <TrendingUpIcon />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[7px] font-black uppercase tracking-[0.16em] text-emerald-700 sm:text-[8px]">
                  SHARE MARKET
                </p>

                <h3 className="mt-1 text-sm font-black text-[#07152d] sm:text-base">
                  {isBn
                    ? "শেয়ার বাজার দেখুন"
                    : "Explore Share Market"}
                </h3>

                <p className="mt-1 text-[8px] leading-4 text-slate-500 sm:text-[9px]">
                  {isBn
                    ? "Market information ও share-related tools এক জায়গায়।"
                    : "Market information and share-related tools in one place."}
                </p>
              </div>

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 transition group-hover:translate-x-1">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

          {/* TENDER NOTICE */}

          <Link
            href="/tenders"
            className="group relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md sm:p-5"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-100/70 blur-2xl transition group-hover:bg-blue-200/70" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17365d] text-white shadow-md">
                <BriefcaseBusiness className="h-4.5 w-4.5" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[7px] font-black uppercase tracking-[0.16em] text-blue-700 sm:text-[8px]">
                  TENDER NOTICE
                </p>

                <h3 className="mt-1 text-sm font-black text-[#07152d] sm:text-base">
                  {isBn
                    ? "Tender Opportunity দেখুন"
                    : "Explore Tender Opportunities"}
                </h3>

                <p className="mt-1 text-[8px] leading-4 text-slate-500 sm:text-[9px]">
                  {isBn
                    ? "Public tender notice ও official source এক জায়গায়।"
                    : "Public tender notices and official sources in one place."}
                </p>
              </div>

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[#17365d] transition group-hover:translate-x-1">
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
   FUTURE PLAN
========================================================= */

function FuturePlanSection({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  const roadmap = [
    {
      icon: Wrench,
      title: isBn ? "Worker → Skilled Professional" : "Worker → Skilled Professional",
      text: isBn
        ? "শ্রমের সঙ্গে skill, experience ও verified identity যুক্ত হবে।"
        : "Skills, experience and verified identity become part of a professional profile.",
    },
    {
      icon: Trophy,
      title: isBn ? "Multi-Skill Recognition" : "Multi-Skill Recognition",
      text: isBn
        ? "একজন মানুষের একাধিক verified skill থাকতে পারে এবং skill development দৃশ্যমান হবে।"
        : "People can build multiple verified skills and make skill development visible.",
    },
    {
      icon: Globe2,
      title: isBn ? "Global Skill Identity" : "Global Skill Identity",
      text: isBn
        ? "দেশের পাশাপাশি বিদেশেও একটি structured professional identity তৈরি করার লক্ষ্য।"
        : "The goal is a structured professional identity that can work across borders.",
    },
    {
      icon: Handshake,
      title: isBn ? "Fair Opportunity Framework" : "Fair Opportunity Framework",
      text: isBn
        ? "ভবিষ্যতে skill, experience, certification, location, job type ও market data বিবেচনায় fair-rate framework নিয়ে কাজ করা হবে।"
        : "Future rate frameworks can consider skill, experience, certification, location, job type and market data.",
    },
  ];

  return (
    <section
      id="future-plan"
      className="scroll-mt-20 border-b border-slate-200 bg-white px-4 py-7 sm:px-6 sm:py-9 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[1.6rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-blue-50 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5">
                <Brain className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-[7px] font-black uppercase tracking-[0.18em] text-orange-700">
                  SHROMOBAZAR FUTURE PLAN
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black leading-tight text-[#07152d] sm:text-3xl">
                {isBn
                  ? "শ্রমকে শুধু কাজ নয়—দক্ষতা, পরিচয় ও সম্মানে রূপ দেওয়া"
                  : "Turning work into skills, identity and recognition"}
              </h2>

              <p className="mt-2 max-w-3xl text-[9px] leading-5 text-slate-500 sm:text-[10px] sm:leading-6">
                {isBn
                  ? "Shromobazar-এর ভবিষ্যৎ লক্ষ্য হলো একজন মানুষকে শুধু day worker হিসেবে না দেখে তার skill, knowledge, profession, service ও good work-এর পূর্ণ পরিচয়কে মূল্য দেওয়া।"
                  : "Shromobazar's long-term direction is to recognize a person's skills, knowledge, profession, service and good work—not only their current job title."}
              </p>
            </div>

            <Link
              href="#future-plan-details"
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#07152d] px-4 py-3 text-[8px] font-black text-white transition hover:bg-orange-600"
            >
              {isBn ? "FUTURE PLAN দেখুন" : "VIEW FUTURE PLAN"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div
            id="future-plan-details"
            className="mt-5 grid scroll-mt-20 gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {roadmap.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07152d] text-white">
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <h3 className="mt-3 text-xs font-black text-[#07152d]">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 text-[8px] leading-5 text-slate-500 sm:text-[9px]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-center text-[8px] font-semibold leading-5 text-emerald-800 sm:text-[9px]">
              <span className="font-black">
                {isBn ? "মূল ধারণা:" : "Core principle:"}
              </span>{" "}
              {isBn
                ? "Skill Grade নিজে থেকে কোনো নির্দিষ্ট বেতন নির্ধারণ করবে না; fair opportunity framework-এ বাস্তব market data ও অন্যান্য প্রাসঙ্গিক বিষয় বিবেচনা করা হবে।"
                : "Skill Grade alone would not determine a person's pay; any future fair-opportunity framework would consider real market data and other relevant factors."}
            </p>
          </div>
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
    <section className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-600 sm:text-[9px]">
              MARKET INFORMATION
            </p>

            <h2 className="mt-1.5 text-xl font-black text-[#07152d] sm:text-2xl">
              {isBn ? "আজকের বাজার দর" : "Today's Market Rates"}
            </h2>

            <p className="mt-1 text-[8px] leading-5 text-slate-500 sm:text-[9px]">
              {isBn
                ? "ভবিষ্যৎ verified market-data integration-এর জন্য প্রস্তুত করা হয়েছে।"
                : "Prepared for future verified market-data integration."}
            </p>
          </div>

          <Link
            href="/share-market"
            className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-[8px] font-black text-emerald-700 transition hover:bg-emerald-100"
          >
            {isBn ? "Market তথ্য" : "Market Information"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categories.map(([emoji, title]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl">{emoji}</span>

                <span className="rounded-full bg-white px-2 py-1 text-[6px] font-black text-slate-400">
                  {isBn ? "আপডেট হবে" : "UPDATING"}
                </span>
              </div>

              <h3 className="mt-3 text-[10px] font-black text-[#07152d]">
                {title}
              </h3>

              <p className="mt-1 text-[8px] leading-4 text-slate-400">
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
    <section className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-2.5 lg:grid-cols-[1.05fr_1.95fr]">
          <Link
            href="/status-feed?section=good-work"
            className="group rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <HeartPulse className="h-4.5 w-4.5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[7px] font-black uppercase tracking-[0.16em] text-emerald-700">
                    GOOD WORK
                  </p>

                  <h3 className="truncate text-sm font-black text-[#07152d] sm:text-base">
                    {isBn ? "ভালো কাজ দেখান" : "Share Your Good Work"}
                  </h3>
                </div>
              </div>

              <ArrowRight className="h-4 w-4 shrink-0 text-emerald-600 transition group-hover:translate-x-1" />
            </div>

            <p className="mt-2 text-[9px] leading-5 text-slate-500 sm:text-[10px]">
              {isBn
                ? "আপনার ভালো কাজ, উদ্যোগ বা মানুষের উপকারের গল্প share করুন."
                : "Share stories of positive actions, initiatives and community impact."}
            </p>
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[7px] font-black uppercase tracking-[0.16em] text-orange-600">
                  COMING SOON
                </p>

                <h3 className="mt-1 text-sm font-black text-[#07152d] sm:text-base">
                  {isBn
                    ? "আরও প্রয়োজনীয় service আসছে"
                    : "More useful services are coming"}
                </h3>
              </div>

              <Sparkles className="h-4 w-4 shrink-0 text-orange-500" />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                ["📈", "Share Market"],
                ["🌦️", "Weather"],
                ["🚗", "Ride Share"],
                ["📦", "Courier"],
                ["🍲", "Food Service"],
              ].map(([emoji, label]) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[7px] font-bold text-slate-500 sm:text-[8px]"
                >
                  <span>{emoji}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   UPDATES
========================================================= */

function UpdatesSection({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  const updates = [
    {
      title: "Platform Update",
      text: isBn ? "নতুন feature ও announcement" : "New features & announcements",
      href: "/status-feed",
      icon: Sparkles,
    },
    {
      title: "Work Update",
      text: isBn ? "কাজ ও hiring-এর খবর" : "Work & hiring updates",
      href: "/jobs",
      icon: BriefcaseBusiness,
    },
    {
      title: "Marketplace",
      text: isBn ? "পণ্য ও service post" : "Products & service posts",
      href: "/marketplace",
      icon: ShoppingBag,
    },
    {
      title: "Community",
      text: isBn ? "মানুষ ও community updates" : "People & community updates",
      href: "/status-feed",
      icon: MessageCircle,
    },
  ];

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-orange-600 sm:text-[9px]">
              UPDATES & POSTS
            </p>

            <h2 className="mt-1 text-xl font-black tracking-tight text-[#07152d] sm:text-2xl">
              {isBn
                ? "কী আসছে, কী চলছে—এক জায়গায়।"
                : "What is new and what is happening."}
            </h2>
          </div>

          <Link
            href="/status-feed"
            className="inline-flex w-fit items-center gap-1.5 text-[9px] font-black text-[#07152d] hover:text-orange-600"
          >
            {isBn ? "সব Updates দেখুন" : "View all updates"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {updates.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white hover:shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#07152d] shadow-sm group-hover:text-orange-600">
                  <Icon className="h-3.5 w-3.5" />
                </span>

                <span className="min-w-0">
                  <span className="block truncate text-[9px] font-black text-[#07152d]">
                    {item.title}
                  </span>

                  <span className="mt-0.5 block truncate text-[8px] font-medium text-slate-500">
                    {item.text}
                  </span>
                </span>

                <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-orange-500" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONNECTED ACTIONS
========================================================= */

function ConnectedActions({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  const actions = [
    {
      href: "/status-feed",
      icon: PlusIcon,
      color: "bg-[#c2410c]",
      title: "ADD POST",
      bn: "POST করুন",
      text: isBn
        ? "Community বা Social Hub-এ genuine update প্রকাশ করুন."
        : "Publish a genuine update in the Social Hub.",
      button: isBn ? "Post করুন" : "Create Post",
    },
    {
      href: "/marketplace",
      icon: ShoppingBag,
      color: "bg-[#17365d]",
      title: "SELL POST",
      bn: "পণ্য/সেবা বিক্রি",
      text: isBn
        ? "আপনার পণ্য বা service Marketplace-এ প্রকাশ করুন."
        : "Publish your product or service on Marketplace.",
      button: isBn ? "Sell করুন" : "Sell",
    },
    {
      href: "/buy-requests",
      icon: Search,
      color: "bg-[#14532d]",
      title: "BUY REQUEST",
      bn: "কী কিনতে চান?",
      text: isBn
        ? "আপনার প্রয়োজনীয় পণ্য বা service-এর request দিন."
        : "Post what product or service you need.",
      button: isBn ? "Request দিন" : "Create Request",
    },
    {
      href: "/marketplace",
      icon: Store,
      color: "bg-purple-700",
      title: "OPEN YOUR SHOP",
      bn: "নিজের Shop খুলুন",
      text: isBn
        ? "নিজের digital shop তৈরি করে পণ্য ও service showcase করুন."
        : "Create a digital shop to showcase products and services.",
      button: isBn ? "Shop খুলুন" : "Open Shop",
    },
    {
      href: "/global-business",
      icon: Building2,
      color: "bg-[#244b78]",
      title: "OPEN YOUR OFFICE",
      bn: "নিজের Office খুলুন",
      text: isBn
        ? "Business, consultancy বা professional presence তৈরি করুন."
        : "Create a professional business or consultancy presence.",
      button: isBn ? "Office খুলুন" : "Open Office",
    },
    {
      href: "/chat",
      icon: MessageCircle,
      color: "bg-[#075985]",
      title: "SHROMO CONNECT",
      bn: "যোগাযোগ করুন",
      text: isBn
        ? "Worker, employer, customer ও business-এর সঙ্গে connection তৈরি করুন."
        : "Connect with workers, employers, customers and businesses.",
      button: isBn ? "Connect করুন" : "Connect",
    },
  ];

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#14532d] sm:text-[9px]">
            CONNECTED ACTIONS
          </p>

          <h2 className="mt-1.5 text-xl font-black leading-tight text-[#07152d] sm:text-2xl">
            {isBn
              ? "আপনার পরবর্তী কাজ এখান থেকেই শুরু করুন।"
              : "Start your next action here."}
          </h2>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-5"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${action.color}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <h3 className="text-sm font-black text-[#07152d]">
                    {action.title}
                  </h3>

                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[6px] font-black text-slate-400">
                    {action.bn}
                  </span>
                </div>

                <p className="mt-1.5 text-[9px] leading-5 text-slate-500 sm:text-[10px]">
                  {action.text}
                </p>

                <span className="mt-3 inline-flex items-center gap-1.5 text-[8px] font-black text-orange-600">
                  {action.button}
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
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
                  href="/marketplace"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-4 py-3 text-[9px] font-black text-white transition hover:bg-orange-700 sm:text-[10px]"
                >
                  <Store className="h-3.5 w-3.5" />
                  Open Your Shop
                </Link>

                <Link
                  href="/global-business"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#14532d] px-4 py-3 text-[9px] font-black text-white transition hover:bg-green-800 sm:text-[10px]"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Open Your Office
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <Store className="h-5 w-5 text-[#c2410c]" />

                <p className="mt-2.5 text-xs font-black text-[#07152d]">
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
                  {isBn ? "Business presence" : "Professional presence"}
                </p>
              </div>

              <div className="rounded-xl bg-[#c2410c] p-4 text-white">
                <WalletCards className="h-5 w-5" />

                <p className="mt-2.5 text-xs font-black">
                  Connected Tools
                </p>

                <p className="mt-1 text-[8px] leading-4 text-orange-100">
                  {isBn ? "Digital business tools" : "Digital tools"}
                </p>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-[#14532d]" />

                <p className="mt-2.5 text-xs font-black text-[#07152d]">
                  Trust
                </p>

                <p className="mt-1 text-[8px] leading-4 text-slate-500">
                  {isBn ? "Reputation & safety" : "Reputation & safety"}
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
   WORKER CATEGORIES
========================================================= */

function WorkerCategories({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  return (
    <section className="border-b border-slate-200 bg-white px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#c2410c] sm:text-[9px]">
              WORKFORCE DIRECTORY
            </p>

            <h2 className="mt-1.5 text-xl font-black leading-tight tracking-tight text-[#07152d] sm:text-2xl">
              {isBn
                ? "আপনার প্রয়োজনের দক্ষ মানুষ"
                : "Find skilled people for your needs"}
            </h2>

            <p className="mt-1.5 max-w-2xl text-[9px] leading-5 text-slate-500 sm:text-[10px] sm:leading-6">
              {isBn
                ? "বিভিন্ন পেশার Worker ও Professional খুঁজে নিন."
                : "Explore workers and professionals across multiple categories."}
            </p>
          </div>

          <Link
            href="/workers"
            className="inline-flex w-fit items-center gap-1.5 text-[9px] font-black text-[#7f1d1d] sm:text-[10px]"
          >
            {isBn ? "সব Worker দেখুন" : "View all workers"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                href={category.href}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-3 p-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${category.color}`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black text-[#07152d] sm:text-sm">
                      {isBn ? category.title : category.en}
                    </h3>

                    <p className="mt-0.5 text-[8px] leading-4 text-slate-500 sm:text-[9px]">
                      {isBn
                        ? category.subtitle
                        : category.enSubtitle}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                </div>

                <div className="h-0.5 w-full bg-slate-100 transition group-hover:bg-orange-500" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}



/* =========================================================
   FINAL CTA
========================================================= */

function FinalCTA({
  language,
}: {
  language: Language;
}) {
  const isBn = language === "bn";

  return (
    <section className="bg-[#07152d] px-4 py-8 text-center sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-orange-400 sm:text-[9px]">
          SHROMOBAZAR
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:text-3xl">
          {isBn
            ? "কাজ, কর্মী, ব্যবসা ও সেবার জন্য"
            : "For work, people, business and services"}

          <span className="block text-orange-400">
            {isBn
              ? "একটি connected platform."
              : "one connected platform."}
          </span>
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-[9px] leading-5 text-slate-300 sm:text-[10px] sm:leading-6">
          {isBn
            ? "আপনার প্রয়োজনের space বেছে নিন এবং Shromobazar ecosystem-এর সঙ্গে যুক্ত হোন."
            : "Choose the space you need and connect with the Shromobazar ecosystem."}
        </p>

        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#c2410c] px-5 py-3 text-[9px] font-black text-white transition hover:-translate-y-0.5 hover:bg-orange-700 sm:text-[10px]"
          >
            {isBn ? "নিবন্ধন করুন" : "Create Account"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/marketplace"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-[9px] font-bold text-white transition hover:bg-white/10 sm:text-[10px]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {isBn ? "Marketplace দেখুন" : "Explore Marketplace"}
          </Link>
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

        <div className="relative mx-auto max-w-7xl px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5 lg:px-8 lg:pb-7 lg:pt-6">
 
<div className="grid items-center gap-5 lg:grid-cols-[1.05fr_.95fr] lg:gap-8">
            {/* LEFT */}

            <div className="order-2 min-w-0 lg:order-1 lg:pt-1">
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

<h1 className="mt-4 max-w-3xl font-black leading-[1.04] tracking-[-0.035em]">
  <span className="grid grid-cols-2 gap-x-2 gap-y-1">
    <span className="text-[36px] text-orange-400 sm:text-5xl lg:text-[54px]">
      {isBn ? "কাজ" : "WORK"}
      <span className="mx-1.5 text-white/35">•</span>
    </span>

    <span className="text-[36px] text-cyan-300 sm:text-5xl lg:text-[54px]">
      {isBn ? "কর্মী" : "PEOPLE"}
    </span>

    <span className="text-[36px] text-emerald-400 sm:text-5xl lg:text-[54px]">
      {isBn ? "ব্যবসা" : "BUSINESS"}
      <span className="mx-1.5 text-white/35">•</span>
    </span>

    <span className="text-[36px] text-violet-300 sm:text-5xl lg:text-[54px]">
      {isBn ? "সেবা" : "SERVICES"}
    </span>
  </span>

  <span className="mt-2 block text-[23px] text-white/90 sm:text-3xl lg:text-4xl">
    {isBn
      ? "একটি সংযুক্ত প্ল্যাটফর্মে।"
      : "One connected platform."}
  </span>
</h1>

              <p className="mt-3 max-w-xl text-xs leading-5 text-slate-300 sm:mt-4 sm:text-sm sm:leading-6 lg:text-base">
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

              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <div className="rounded-xl border border-orange-400/20 bg-orange-500/[0.09] px-2.5 py-2 backdrop-blur transition hover:bg-orange-500/[0.14]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-orange-300 sm:h-4 sm:w-4" />

                    <span className="text-[7px] font-black uppercase tracking-[0.1em] text-orange-200 sm:text-[8px]">
                      NO COMMISSION
                    </span>
                  </div>

                  <p className="mt-1 text-[7px] leading-4 text-slate-300 sm:text-[8px]">
                    {isBn
                      ? "কাজ ও business connection-এর উপর commission নয়."
                      : "No commission on work and business connections."}
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
                    {isBn
                      ? "Shop, Office ও premium visibility-এর জন্য."
                      : "For Shop, Office and premium visibility."}
                  </p>
                </Link>
              </div>

              <EntertainmentRow language={language} />
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

      {/* FUTURE PLAN */}

      <FuturePlanSection language={language} />

      {/* GOOD WORK */}

      <GoodWorkSection language={language} />

      {/* MARKET RATES */}

      <MarketRatesSection language={language} />

      {/* UPDATES */}

      <UpdatesSection language={language} />

      {/* SMART EXPLORE */}

      <SmartExplore language={language} />

      {/* CONNECTED ACTIONS */}

      <ConnectedActions language={language} />

      {/* ONE ECOSYSTEM */}

      <OneEcosystem language={language} />

      {/* HOW IT WORKS */}

      <HowItWorks language={language} />

      {/* MARKETPLACE BUSINESS */}

      <MarketplaceBusiness language={language} />

      {/* WORKER DIRECTORY */}

      <WorkerCategories language={language} />

      {/* FINAL CTA */}

      <FinalCTA language={language} />
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
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-white px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-[-80px] h-72 w-[760px] -translate-x-1/2 rounded-full bg-orange-100/50 blur-3xl" />

      <div className="pointer-events-none absolute right-[-120px] top-20 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white">
                <Sparkles className="h-3 w-3" />
              </span>

              <span className="text-[7px] font-black uppercase tracking-[0.2em] text-orange-700">
                SHROMO ECOSYSTEM
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-black tracking-tight text-[#07152d] sm:text-3xl">
              {isBn ? "Shromobazar Explore" : "Explore Shromobazar"}
            </h2>

            <p className="mt-1.5 max-w-2xl text-[9px] leading-5 text-slate-500 sm:text-xs sm:leading-6">
              {isBn
                ? "আপনার প্রয়োজন অনুযায়ী ecosystem-এর বিভিন্ন space explore করুন."
                : "Explore the spaces you need across the Shromobazar ecosystem."}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-[6px] font-black text-slate-400 sm:text-[7px]">
              ONE PLATFORM
            </span>

            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-[6px] font-black text-emerald-600 sm:text-[7px]">
              CONNECTED
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 sm:hidden">
          <span className="h-px flex-1 bg-slate-200" />

          <span className="text-[7px] font-black uppercase tracking-[0.16em] text-slate-400">
            Explore Spaces
          </span>

          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11">
          {exploreItems.map((item) => {
            const selected = selectedExplore === item.label;

            return (
              <Link
                key={item.code}
                href={item.href}
                onClick={() => setSelectedExplore(item.label)}
                title={isBn ? item.bnDescription : item.description}
                className={`group relative flex min-h-[78px] flex-col justify-between overflow-hidden rounded-[1.1rem] border p-3 transition-all duration-300 hover:-translate-y-1 ${
                  selected
                    ? `border-transparent bg-gradient-to-br ${item.activeClass} text-white shadow-lg`
                    : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-orange-200 hover:shadow-lg"
                }`}
              >
                <span
                  className={`pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full blur-2xl ${
                    selected
                      ? "bg-white/20"
                      : "bg-orange-100/0 group-hover:bg-orange-100/80"
                  }`}
                />

                <div className="relative flex items-start justify-between gap-2">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-white/20"
                        : "bg-slate-50 group-hover:bg-orange-50"
                    }`}
                  >
                    <span className="text-base">{item.emoji}</span>
                  </span>

                  <span
                    className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[6px] font-black ${
                      selected
                        ? "bg-white/15 text-white/80"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {item.code}
                  </span>
                </div>

                <div className="relative mt-2 min-w-0">
                  <span
                    className={`block truncate text-[8px] font-black sm:text-[9px] ${
                      selected
                        ? "text-white"
                        : "text-[#07152d] group-hover:text-orange-600"
                    }`}
                  >
                    {isBn ? item.bn : item.label}
                  </span>

                  <span
                    className={`mt-0.5 block truncate text-[6px] font-semibold leading-3 sm:text-[7px] ${
                      selected
                        ? "text-white/65"
                        : "text-slate-400"
                    }`}
                  >
                    {isBn ? item.bnDescription : item.description}
                  </span>
                </div>

                <span
                  className={`absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full ${
                    selected
                      ? "bg-white/15 text-white"
                      : "bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-600"
                  }`}
                >
                  <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <p className="text-center text-[7px] font-semibold text-slate-400 sm:text-[8px]">
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
    setNow(new Date());

    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
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

  const currentMinutes =
    Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .format(now)
        .split(":")[0],
    ) * 60 +
    Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Dhaka",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .format(now)
        .split(":")[1],
    );

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
