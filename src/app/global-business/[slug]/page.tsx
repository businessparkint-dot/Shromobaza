"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Globe2,
  Handshake,
  Landmark,
  Loader2,
  PackageSearch,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/client";

type OpportunityType =
  | "bangladesh_to_world"
  | "world_to_bangladesh"
  | "partnership_jv"
  | "investment";

type GlobalPageConfig = {
  title: string;
  titleEn: string;
  badge: string;
  description: string;
  icon: typeof Globe2;
  accent: string;
  sections: {
    title: string;
    text: string;
    icon: typeof Globe2;
  }[];
  officialLinks?: {
    name: string;
    description: string;
    href: string;
  }[];
};

type Opportunity = {
  id: number;
  owner_id: string;
  opportunity_type: OpportunityType;
  title: string;
  description: string | null;
  sector: string | null;
  country: string | null;
  city: string | null;
  offering: string | null;
  requirement: string | null;
  funding_required: number | null;
  funding_currency: string | null;
  status: string;
  is_verified: boolean;
  is_public: boolean;
  website: string | null;
  created_at: string;
};

const pages: Record<string, GlobalPageConfig> = {
  "bangladesh-to-world": {
    title: "বাংলাদেশ → বিশ্ব",
    titleEn: "Bangladesh to the World",
    badge: "GLOBAL OUTBOUND CONNECTION",
    description:
      "বাংলাদেশের business, product, supplier, professional ও service-কে international market এবং global connection-এর সঙ্গে যুক্ত করার entry point।",
    icon: Globe2,
    accent: "cyan",
    sections: [
      {
        title: "Export & International Market",
        text:
          "বাংলাদেশি business ও product-এর জন্য international buyer, market এবং business connection খোঁজার foundation।",
        icon: BriefcaseBusiness,
      },
      {
        title: "Find Global Buyers",
        text:
          "Verified buyer request, product demand এবং business enquiry এখানে structuredভাবে প্রকাশ করা যাবে।",
        icon: PackageSearch,
      },
      {
        title: "Global Business Partners",
        text:
          "বিদেশি business, distributor, supplier ও strategic partner-এর সঙ্গে connection তৈরির জায়গা।",
        icon: Handshake,
      },
      {
        title: "Professionals & Services",
        text:
          "বাংলাদেশের verified professional, consultant, engineer ও service provider-কে global opportunity-এর সঙ্গে connect করার foundation।",
        icon: Users,
      },
    ],
  },

  "world-to-bangladesh": {
    title: "বিশ্ব → বাংলাদেশ",
    titleEn: "World to Bangladesh",
    badge: "GLOBAL INBOUND CONNECTION",
    description:
      "Foreign buyer, business, partner, institution ও investment-related interest-এর জন্য Bangladesh-এর public business ecosystem খুঁজে পাওয়ার entry point।",
    icon: Landmark,
    accent: "blue",
    sections: [
      {
        title: "Find Bangladeshi Businesses",
        text:
          "Shromobazar-এর public business profiles থেকে Bangladesh-এর বিভিন্ন sector-এর business খুঁজে দেখার foundation।",
        icon: BriefcaseBusiness,
      },
      {
        title: "Find Suppliers",
        text:
          "বাংলাদেশি supplier, manufacturer, trader ও service provider-এর সঙ্গে connection তৈরির সুযোগ।",
        icon: PackageSearch,
      },
      {
        title: "Business Partnership",
        text:
          "International company বা partner-এর Bangladesh-based business connection তৈরির entry point।",
        icon: Handshake,
      },
      {
        title: "People & Professionals",
        text:
          "বাংলাদেশের professionals, experts ও service providers-এর সঙ্গে direct connection-এর foundation।",
        icon: Users,
      },
    ],
  },

  "partnership-jv": {
    title: "Partnership / JV",
    titleEn: "Partnership & Joint Venture",
    badge: "GLOBAL PARTNERSHIP",
    description:
      "Strategic partnership, collaboration এবং joint-venture connection-এর জন্য dedicated Global entry point।",
    icon: Handshake,
    accent: "orange",
    sections: [
      {
        title: "Strategic Partnership",
        text:
          "দুই বা একাধিক business-এর মধ্যে strategic collaboration এবং long-term partnership-এর foundation।",
        icon: Handshake,
      },
      {
        title: "Joint Venture",
        text:
          "Joint-venture interest থাকলে business profile ও opportunity information structuredভাবে উপস্থাপনের জায়গা।",
        icon: BriefcaseBusiness,
      },
      {
        title: "Supplier / Distributor Partnership",
        text:
          "Supplier, distributor, manufacturer এবং market partner-এর মধ্যে connection তৈরির layer।",
        icon: PackageSearch,
      },
      {
        title: "Professional Partnership",
        text:
          "Consultant, engineer, expert এবং professional service provider-এর সঙ্গে cross-border collaboration-এর foundation।",
        icon: Users,
      },
    ],
  },

  investment: {
    title: "Investment",
    titleEn: "Investment Opportunities",
    badge: "GLOBAL INVESTMENT CONNECTION",
    description:
      "Verified business বা project opportunity available হলে investor এবং opportunity owner-এর মধ্যে structured connection তৈরির entry point।",
    icon: TrendingUp,
    accent: "emerald",
    sections: [
      {
        title: "Business Opportunities",
        text:
          "Publicly available এবং properly verified business opportunity থাকলে তা structured profile হিসেবে দেখানো যাবে।",
        icon: BriefcaseBusiness,
      },
      {
        title: "Project Opportunities",
        text:
          "Eligible project information verification এবং appropriate documentation-এর ভিত্তিতে এখানে উপস্থাপন করা যাবে।",
        icon: Landmark,
      },
      {
        title: "Investor Connection",
        text:
          "Potential investor এবং opportunity owner-এর মধ্যে direct communication-এর foundation।",
        icon: Users,
      },
      {
        title: "Trust & Verification",
        text:
          "Shromobazar investment return, profit বা financial outcome guarantee করবে না।",
        icon: ShieldCheck,
      },
    ],
    officialLinks: [
      {
        name: "World Bank",
        description:
          "Official World Bank business and procurement opportunities.",
        href:
          "https://projects.worldbank.org/en/projects-operations/opportunities",
      },
      {
        name: "UN Global Marketplace",
        description:
          "Official UN procurement and supplier opportunity source.",
        href: "https://www.ungm.org/Public/Notice",
      },
      {
        name: "Asian Development Bank",
        description:
          "Official ADB procurement and business opportunity source.",
        href:
          "https://www.adb.org/business/project-procurement/business-opportunities",
      },
    ],
  },
};

const typeLabels: Record<OpportunityType, string> = {
  bangladesh_to_world: "Bangladesh → World",
  world_to_bangladesh: "World → Bangladesh",
  partnership_jv: "Partnership / JV",
  investment: "Investment",
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function GlobalConnectionDetailPage() {
  const params = useParams();
  const router = useRouter();

  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : "";

  const page = pages[slug];

  const opportunityType = useMemo<OpportunityType | null>(() => {
    if (slug === "bangladesh-to-world") {
      return "bangladesh_to_world";
    }

    if (slug === "world-to-bangladesh") {
      return "world_to_bangladesh";
    }

    if (slug === "partnership-jv") {
      return "partnership_jv";
    }

    if (slug === "investment") {
      return "investment";
    }

    return null;
  }, [slug]);

  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [myOpportunities, setMyOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [offering, setOffering] = useState("");
  const [requirement, setRequirement] = useState("");
  const [fundingRequired, setFundingRequired] = useState("");
  const [fundingCurrency, setFundingCurrency] = useState("BDT");
  const [website, setWebsite] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const loadData = useCallback(
    async (currentUserId?: string | null) => {
      if (!opportunityType) return;

      setLoadingOpportunities(true);

      const publicResult = await supabase
        .from("global_opportunities")
        .select(
          "id,owner_id,opportunity_type,title,description,sector,country,city,offering,requirement,funding_required,funding_currency,status,is_verified,is_public,website,created_at"
        )
        .eq("opportunity_type", opportunityType)
        .eq("status", "published")
        .eq("is_verified", true)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (!publicResult.error) {
        setOpportunities((publicResult.data || []) as Opportunity[]);
      } else {
        setOpportunities([]);
      }

      if (currentUserId) {
        const mineResult = await supabase
          .from("global_opportunities")
          .select(
            "id,owner_id,opportunity_type,title,description,sector,country,city,offering,requirement,funding_required,funding_currency,status,is_verified,is_public,website,created_at"
          )
          .eq("owner_id", currentUserId)
          .eq("opportunity_type", opportunityType)
          .order("created_at", { ascending: false });

        if (!mineResult.error) {
          setMyOpportunities((mineResult.data || []) as Opportunity[]);
        } else {
          setMyOpportunities([]);
        }
      } else {
        setMyOpportunities([]);
      }

      setLoadingOpportunities(false);
    },
    [opportunityType]
  );

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUserId(user?.id ?? null);
      setCheckingAuth(false);

      await loadData(user?.id ?? null);
    };

    checkUser();

    return () => {
      mounted = false;
    };
  }, [loadData]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError("");
    setSubmitMessage("");

    if (!opportunityType) {
      setSubmitError("Invalid Global opportunity type.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!title.trim()) {
      setSubmitError("Opportunity title দিন।");
      return;
    }

    if (!description.trim()) {
      setSubmitError("Opportunity description দিন।");
      return;
    }

    if (!sector.trim()) {
      setSubmitError("Sector দিন।");
      return;
    }

    if (!country.trim()) {
      setSubmitError("Country দিন।");
      return;
    }

    if (opportunityType === "investment" && fundingRequired.trim()) {
      const numericFunding = Number(fundingRequired);

      if (
        !Number.isFinite(numericFunding) ||
        numericFunding < 0
      ) {
        setSubmitError("Funding amount সঠিকভাবে দিন।");
        return;
      }
    }

    setSubmitting(true);

    const numericFunding =
      opportunityType === "investment" &&
      fundingRequired.trim()
        ? Number(fundingRequired)
        : null;

    const { error } = await supabase
      .from("global_opportunities")
      .insert({
        owner_id: user.id,
        opportunity_type: opportunityType,
        title: title.trim(),
        description: description.trim(),
        sector: sector.trim(),
        country: country.trim(),
        city: city.trim() || null,
        offering: offering.trim() || null,
        requirement: requirement.trim() || null,
        funding_required: numericFunding,
        funding_currency:
          opportunityType === "investment"
            ? fundingCurrency
            : "BDT",
        website: website.trim() || null,
        status: "pending",
        is_verified: false,
        is_public: false,
      });

    setSubmitting(false);

    if (error) {
      setSubmitError(
        error.message ||
          "Opportunity submit করা যায়নি। আবার চেষ্টা করুন।"
      );
      return;
    }

    setSubmitMessage(
      "Opportunity successfully submitted. এখন এটি verification-এর জন্য pending আছে।"
    );

    setTitle("");
    setDescription("");
    setSector("");
    setCountry("");
    setCity("");
    setOffering("");
    setRequirement("");
    setFundingRequired("");
    setWebsite("");

    await loadData(user.id);
  };

  if (!page || !opportunityType) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Globe2 className="mx-auto h-10 w-10 text-cyan-500" />

          <h1 className="mt-4 text-2xl font-black text-[#07152d]">
            Global Connection Not Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            এই Global connection page-টি পাওয়া যায়নি।
          </p>

          <Link
            href="/global-business"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#07152d] px-5 py-3 text-xs font-black text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Global Connection
          </Link>
        </div>
      </main>
    );
  }

  const Icon = page.icon;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#06142d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(14,116,144,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-7 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
          <Link
            href="/global-business"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[8px] font-black text-slate-300 transition hover:bg-white/10 hover:text-white sm:text-[9px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Global Connection
          </Link>

          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.16em] text-cyan-200 sm:text-[9px]">
                <Sparkles className="h-3.5 w-3.5" />
                {page.badge}
              </div>

              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
                  <Icon className="h-7 w-7" />
                </div>

                <div>
                  <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                    {page.title}
                  </h1>

                  <p className="mt-1 text-sm font-black text-cyan-300">
                    {page.titleEn}
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                {page.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link
                  href="/global-business"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-[9px] font-black text-[#06142d] transition hover:bg-cyan-300 sm:px-5"
                >
                  Explore Global Hub
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href="#submit-opportunity"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-[9px] font-black text-white transition hover:bg-white/[0.1] sm:px-5"
                >
                  Submit Opportunity
                  <PlusCircle className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-3 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-white p-5 sm:p-6">
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-600">
                  GLOBAL CONNECTION
                </p>

                <h2 className="mt-2 text-xl font-black text-[#07152d] sm:text-2xl">
                  Verified information first
                </h2>

                <div className="mt-5 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />

                      <span className="text-[9px] font-black text-slate-700">
                        Trust & Verification
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] leading-5 text-slate-500">
                      Public information এবং verification status আলাদাভাবে
                      দেখা যাবে।
                    </p>
                  </div>

                  <div className="rounded-2xl bg-cyan-50 p-4">
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-cyan-600" />

                      <span className="text-[9px] font-black text-cyan-700">
                        Bangladesh ↔ World
                      </span>
                    </div>

                    <p className="mt-2 text-[9px] leading-5 text-slate-600">
                      Cross-border business এবং professional connection-এর
                      foundation।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUNCTION GRID */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <p className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-600 sm:text-[9px]">
            GLOBAL FUNCTION
          </p>

          <h2 className="mt-1.5 text-xl font-black text-[#07152d] sm:text-2xl">
            How this connection works
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {page.sections.map((item) => {
              const SectionIcon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:border-cyan-200 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <SectionIcon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-sm font-black text-[#07152d]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[9px] leading-5 text-slate-500 sm:text-xs">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PUBLIC OPPORTUNITIES */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-600 sm:text-[9px]">
                VERIFIED OPPORTUNITIES
              </p>

              <h2 className="mt-1.5 text-xl font-black text-[#07152d] sm:text-2xl">
                Available Global Opportunities
              </h2>

              <p className="mt-2 max-w-2xl text-[9px] leading-5 text-slate-500 sm:text-sm">
                শুধুমাত্র published, public এবং verified opportunity এখানে
                দেখানো হবে।
              </p>
            </div>

            <a
              href="#submit-opportunity"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#07152d] px-4 py-3 text-[9px] font-black text-white transition hover:bg-[#0b2145]"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Submit Yours
            </a>
          </div>

          {loadingOpportunities ? (
            <div className="mt-6 flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-10">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Globe2 className="mx-auto h-9 w-9 text-slate-300" />

              <h3 className="mt-3 text-sm font-black text-[#07152d]">
                No verified opportunities yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-[9px] leading-5 text-slate-500 sm:text-xs">
                এখনো এই category-তে কোনো verified এবং published opportunity
                available নেই।
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {opportunities.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-cyan-50 px-2.5 py-1 text-[8px] font-black text-cyan-700">
                        {typeLabels[item.opportunity_type]}
                      </span>

                      <h3 className="mt-3 text-base font-black text-[#07152d]">
                        {item.title}
                      </h3>
                    </div>

                    {item.is_verified && (
                      <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                    )}
                  </div>

                  {item.description && (
                    <p className="mt-3 text-[9px] leading-5 text-slate-500 sm:text-xs">
                      {item.description}
                    </p>
                  )}

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {item.sector && (
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[8px] font-black uppercase text-slate-400">
                          Sector
                        </p>

                        <p className="mt-1 text-[9px] font-bold text-slate-700">
                          {item.sector}
                        </p>
                      </div>
                    )}

                    {item.country && (
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[8px] font-black uppercase text-slate-400">
                          Country
                        </p>

                        <p className="mt-1 text-[9px] font-bold text-slate-700">
                          {item.country}
                          {item.city ? `, ${item.city}` : ""}
                        </p>
                      </div>
                    )}
                  </div>

                  {item.offering && (
                    <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-[8px] font-black uppercase text-emerald-700">
                        Offering
                      </p>

                      <p className="mt-1 text-[9px] leading-5 text-emerald-900">
                        {item.offering}
                      </p>
                    </div>
                  )}

                  {item.requirement && (
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                      <p className="text-[8px] font-black uppercase text-blue-700">
                        Looking For
                      </p>

                      <p className="mt-1 text-[9px] leading-5 text-blue-900">
                        {item.requirement}
                      </p>
                    </div>
                  )}

                  {item.opportunity_type === "investment" &&
                    item.funding_required !== null && (
                      <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50 p-3">
                        <p className="text-[8px] font-black uppercase text-orange-700">
                          Funding Requirement
                        </p>

                        <p className="mt-1 text-sm font-black text-orange-900">
                          {item.funding_currency || "BDT"}{" "}
                          {Number(item.funding_required).toLocaleString()}
                        </p>
                      </div>
                    )}

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-[8px] font-semibold text-slate-400">
                      Published {formatDate(item.created_at)}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SUBMIT FORM */}
      <section
        id="submit-opportunity"
        className="border-t border-slate-200 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-600 sm:text-[9px]">
                  SUBMIT GLOBAL OPPORTUNITY
                </p>

                <h2 className="mt-1.5 text-xl font-black text-[#07152d] sm:text-2xl">
                  {userId
                    ? "আপনার opportunity প্রকাশের জন্য submit করুন"
                    : "Global opportunity submit করুন"}
                </h2>

                <p className="mt-2 max-w-2xl text-[9px] leading-5 text-slate-500 sm:text-xs">
                  Submit করার পর opportunity প্রথমে pending থাকবে। Verification
                  ছাড়া এটি public listing-এ যাবে না।
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-[8px] font-black text-slate-600 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verification Required
              </div>
            </div>

            {!checkingAuth && !userId && (
              <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-[9px] font-bold leading-5 text-orange-900">
                  Opportunity submit করতে Login প্রয়োজন।
                </p>

                <Link
                  href="/login"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#07152d] px-4 py-2.5 text-[9px] font-black text-white"
                >
                  Login
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {submitMessage && (
              <div className="mt-5 flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                <p className="text-[9px] font-bold leading-5 text-emerald-900">
                  {submitMessage}
                </p>
              </div>
            )}

            {submitError && (
              <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                <p className="text-[9px] font-bold leading-5 text-red-700">
                  {submitError}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 grid gap-4 md:grid-cols-2"
            >
              <div className="md:col-span-2">
                <label className="text-[9px] font-black text-slate-700">
                  Opportunity Title *
                </label>

                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    opportunityType === "investment"
                      ? "Example: Verified business/project opportunity"
                      : "Example: Bangladesh textile supplier seeking global buyer"
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-700">
                  Sector *
                </label>

                <input
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Textile, IT, Food, Construction..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-700">
                  Country *
                </label>

                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Bangladesh / Germany / UAE..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-700">
                  City / Location
                </label>

                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dhaka, Chattogram, Dubai..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-700">
                  Website
                </label>

                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[9px] font-black text-slate-700">
                  Description *
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Opportunity সম্পর্কে পরিষ্কারভাবে লিখুন..."
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-6 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-700">
                  What You Offer
                </label>

                <textarea
                  value={offering}
                  onChange={(e) => setOffering(e.target.value)}
                  rows={4}
                  placeholder="আপনি কী offer করছেন..."
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-6 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-700">
                  What You Are Looking For
                </label>

                <textarea
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  rows={4}
                  placeholder="Buyer, partner, supplier, investor বা collaboration কী চান..."
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs leading-6 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              {opportunityType === "investment" && (
                <>
                  <div>
                    <label className="text-[9px] font-black text-slate-700">
                      Funding Requirement
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={fundingRequired}
                      onChange={(e) =>
                        setFundingRequired(e.target.value)
                      }
                      placeholder="Actual required amount"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-700">
                      Currency
                    </label>

                    <select
                      value={fundingCurrency}
                      onChange={(e) =>
                        setFundingCurrency(e.target.value)
                      }
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                    >
                      <option value="BDT">BDT</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="AED">AED</option>
                      <option value="SAR">SAR</option>
                    </select>
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting || checkingAuth}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#07152d] px-5 py-3.5 text-[9px] font-black text-white transition hover:bg-[#0b2145] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      Submit Global Opportunity
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* MY SUBMISSIONS */}
      {userId && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
            <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-500 sm:text-[9px]">
              MY SUBMISSIONS
            </p>

            <h2 className="mt-1.5 text-xl font-black text-[#07152d] sm:text-2xl">
              আপনার submitted opportunities
            </h2>

            {myOpportunities.length === 0 ? (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-7 text-center">
                <p className="text-[9px] text-slate-500 sm:text-xs">
                  এই category-তে আপনার কোনো submission নেই।
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {myOpportunities.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-black text-[#07152d]">
                        {item.title}
                      </h3>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[8px] font-black ${
                          item.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : item.status === "verified"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-2 text-[8px] text-slate-400">
                      Submitted {formatDate(item.created_at)}
                    </p>

                    {item.is_verified && (
                      <div className="mt-3 inline-flex items-center gap-1 text-[8px] font-black text-emerald-600">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* OFFICIAL SOURCES */}
      {page.officialLinks && page.officialLinks.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-orange-700">
                <Landmark className="h-3.5 w-3.5" />
                Official Sources
              </div>

              <h2 className="mt-3 text-xl font-black text-[#07152d]">
                International Opportunity Sources
              </h2>

              <p className="mt-2 max-w-2xl text-[9px] leading-5 text-slate-500 sm:text-sm">
                Official opportunity এবং procurement information-এর জন্য
                সরাসরি সংশ্লিষ্ট official source ব্যবহার করুন।
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {page.officialLinks.map((source) => (
                  <a
                    key={source.name}
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-orange-200 hover:bg-white hover:shadow-md"
                  >
                    <p className="text-sm font-black text-[#07152d]">
                      {source.name}
                    </p>

                    <p className="mt-2 text-[9px] leading-5 text-slate-500">
                      {source.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1 text-[8px] font-black text-orange-600">
                      Open Official Source
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TRUST NOTICE */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

            <div>
              <h3 className="text-xs font-black text-emerald-900">
                Trust, verification & transparency
              </h3>

              <p className="mt-1 text-[9px] leading-5 text-emerald-800">
                Shromobazar কোনো investment return, profit, contract award
                বা financial outcome guarantee করে না। কোনো opportunity
                প্রকাশের ক্ষেত্রে available verification information এবং
                সংশ্লিষ্ট official source আলাদাভাবে দেখানো হবে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#06142d]">
        <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-5 rounded-[1.75rem] border border-cyan-300/15 bg-gradient-to-r from-cyan-400/10 via-white/[0.03] to-blue-400/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-cyan-300">
                GLOBAL CONNECTION
              </p>

              <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                Global ecosystem-এর সঙ্গে connect করুন।
              </h2>

              <p className="mt-2 max-w-2xl text-[9px] leading-5 text-slate-400 sm:text-xs">
                আপনার opportunity submit করুন এবং verification-এর মাধ্যমে
                Shromobazar-এর Global Connection ecosystem-এর অংশ হন।
              </p>
            </div>

            <a
              href="#submit-opportunity"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-[9px] font-black text-[#06142d] transition hover:bg-cyan-300"
            >
              Submit Opportunity
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}