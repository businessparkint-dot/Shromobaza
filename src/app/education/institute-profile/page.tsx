"use client";

import {
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  Globe2,
  Info,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type Institute = {
  id: string;
  name: string;
  category: string | null;
  district: string | null;
  location: string | null;
  description: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  verified: boolean | null;
  active: boolean | null;
  admission_available: boolean | null;
  created_at: string | null;
};

type InfoCardProps = {
  icon: ReactNode;
  title: string;
  text: string;
  href?: string;
  onClick?: () => void;
};

const categoryLabels: Record<string, string> = {
  Kindergarten: "Kindergarten",
  Primary: "Primary School",
  "High School": "High School",
  College: "College",
  "Open University": "Open University",
  "National University": "National University",
  "Public University": "Public University",
  "Private University": "Private University",
  Medical: "Medical",
  Engineering: "Engineering",
  Diploma: "Diploma",
  BSc: "BSc",
  "Skill Development": "Skill Development",
  Language: "Language",
  "Art & Drama": "Art & Drama",
};

function getCategoryLabel(category: string | null) {
  if (!category) return "Education Institute";
  return categoryLabels[category] ?? category;
}

function normalizeWebsite(url: string) {
  const trimmed = url.trim();

  if (!trimmed) return "";

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function InstituteProfileContent() {
  const searchParams = useSearchParams();

  const instituteId = searchParams.get("id");

  const [institute, setInstitute] = useState<Institute | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showConnect, setShowConnect] = useState(false);
  const [showAdmission, setShowAdmission] = useState(false);

  const [connectSent, setConnectSent] = useState(false);
  const [connectNote, setConnectNote] = useState("");

  const [activeSection, setActiveSection] = useState<
    "overview" | "admission" | "learning"
  >("overview");

  useEffect(() => {
    let mounted = true;

    async function loadInstitute() {
      setLoading(true);
      setErrorMessage("");
      setInstitute(null);

      if (!instituteId) {
        setLoading(false);
        setErrorMessage(
          "Institute ID পাওয়া যায়নি। Education page থেকে একটি institute নির্বাচন করুন।"
        );
        return;
      }

      const { data, error } = await supabase
        .from("institutes")
        .select(
          "id,name,category,district,location,description,website,phone,email,logo_url,verified,active,admission_available,created_at"
        )
        .eq("id", instituteId)
        .eq("active", true)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error("Institute profile error:", error);

        setErrorMessage(
          "Institute information load করা যাচ্ছে না। Database connection বা institutes table check করুন।"
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setErrorMessage(
          "এই institute পাওয়া যায়নি অথবা বর্তমানে active নয়।"
        );

        setLoading(false);
        return;
      }

      setInstitute(data as Institute);
      setLoading(false);
    }

    loadInstitute();

    return () => {
      mounted = false;
    };
  }, [instituteId]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowConnect(false);
        setShowAdmission(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function openConnect() {
    setConnectSent(false);
    setConnectNote("");
    setShowConnect(true);
  }

  function closeConnect() {
    setShowConnect(false);
  }

  function sendConnectRequest() {
    /*
      IMPORTANT:
      এই button এখন UI-level functional foundation.
      আলাদা institute_connection_requests table তৈরি না হওয়া পর্যন্ত
      database-এ fake request insert করা হচ্ছে না।
    */

    setConnectSent(true);
  }

  function openAdmission() {
    setActiveSection("admission");
    setShowAdmission(true);
  }

  function closeAdmission() {
    setShowAdmission(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6">
            <div className="h-9 w-40 animate-pulse rounded-xl bg-slate-200" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-48 animate-pulse bg-slate-200" />

            <div className="space-y-5 p-6">
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-5 w-1/3 animate-pulse rounded-lg bg-slate-200" />
              <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!institute) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Building2 className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Institute পাওয়া যাচ্ছে না
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
              {errorMessage ||
                "এই institute profile বর্তমানে available নয়।"}
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/education"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Education
              </Link>

              <Link
                href="/education"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                <Search className="h-4 w-4" />
                Search Institute
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const websiteUrl = institute.website
    ? normalizeWebsite(institute.website)
    : "";

  const categoryLabel = getCategoryLabel(institute.category);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* TOP BAR */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Education
          </Link>

          <div className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex">
            <GraduationCap className="h-4 w-4" />
            Education
            <ChevronRight className="h-3.5 w-3.5" />
            Institute Profile
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                <GraduationCap className="h-4 w-4" />
                {categoryLabel}
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* LOGO */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/15 bg-white shadow-xl">
                  {institute.logo_url ? (
                    <img
                      src={institute.logo_url}
                      alt={institute.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-11 w-11 text-slate-400" />
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                      {institute.name}
                    </h1>

                    {institute.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-black text-white">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                    {institute.district && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {institute.district}
                      </span>
                    )}

                    {institute.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        {institute.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {institute.description && (
                <p className="mt-7 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                  {institute.description}
                </p>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={openConnect}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-400"
                >
                  <Users className="h-4 w-4" />
                  Connect Institute
                </button>

                {institute.admission_available ? (
                  <button
                    type="button"
                    onClick={openAdmission}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
                  >
                    <FileText className="h-4 w-4" />
                    Admission
                  </button>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-400">
                    <Clock3 className="h-4 w-4" />
                    Admission information unavailable
                  </span>
                )}
              </div>
            </div>

            {/* QUICK STATUS */}
            <div className="grid grid-cols-2 gap-3 lg:w-72">
              <QuickStat
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Trust"
                value={institute.verified ? "Verified" : "Not verified"}
              />

              <QuickStat
                icon={<GraduationCap className="h-5 w-5" />}
                title="Type"
                value={categoryLabel}
              />

              <QuickStat
                icon={<MapPin className="h-5 w-5" />}
                title="District"
                value={institute.district || "Not added"}
              />

              <QuickStat
                icon={<CalendarDays className="h-5 w-5" />}
                title="Admission"
                value={
                  institute.admission_available
                    ? "Available"
                    : "Check institute"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* NAV */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          <SectionButton
            active={activeSection === "overview"}
            onClick={() => setActiveSection("overview")}
            icon={<Info className="h-4 w-4" />}
            label="Overview"
          />

          <SectionButton
            active={activeSection === "admission"}
            onClick={() => {
              setActiveSection("admission");
              setShowAdmission(true);
            }}
            icon={<FileText className="h-4 w-4" />}
            label="Admission"
          />

          <SectionButton
            active={activeSection === "learning"}
            onClick={() => setActiveSection("learning")}
            icon={<BookOpen className="h-4 w-4" />}
            label="Learning"
          />
        </div>
      </div>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeSection === "overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <ContentCard
                icon={<Info className="h-5 w-5" />}
                title="About this Institute"
              >
                {institute.description ? (
                  <p className="text-sm leading-7 text-slate-600">
                    {institute.description}
                  </p>
                ) : (
                  <EmptyText text="Institute description এখনো যোগ করা হয়নি।" />
                )}
              </ContentCard>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<GraduationCap className="h-5 w-5" />}
                  title="Education Category"
                  text={categoryLabel}
                />

                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  title="Location"
                  text={
                    [institute.location, institute.district]
                      .filter(Boolean)
                      .join(", ") || "Location not added"
                  }
                />

                <InfoCard
                  icon={<Phone className="h-5 w-5" />}
                  title="Phone"
                  text={institute.phone || "Phone not added"}
                  href={
                    institute.phone
                      ? `tel:${institute.phone}`
                      : undefined
                  }
                />

                <InfoCard
                  icon={<Mail className="h-5 w-5" />}
                  title="Email"
                  text={institute.email || "Email not added"}
                  href={
                    institute.email
                      ? `mailto:${institute.email}`
                      : undefined
                  }
                />
              </div>
            </div>

            <aside className="space-y-6">
              <ContentCard
                icon={<Sparkles className="h-5 w-5" />}
                title="Shromobazar Smart Connection"
              >
                <p className="text-sm leading-6 text-slate-600">
                  Student সরাসরি institute-এর সাথে information ও
                  connection-এর জন্য request করতে পারবে।
                </p>

                <button
                  type="button"
                  onClick={openConnect}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Connect Institute
                  <ArrowRight className="h-4 w-4" />
                </button>
              </ContentCard>

              <ContentCard
                icon={<Globe2 className="h-5 w-5" />}
                title="Official Information"
              >
                {websiteUrl ? (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    Official Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <EmptyText text="Official website এখনো যোগ করা হয়নি।" />
                )}
              </ContentCard>
            </aside>
          </div>
        )}

        {activeSection === "admission" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ContentCard
                icon={<FileText className="h-5 w-5" />}
                title="Admission"
              >
                <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-orange-500 p-2 text-white">
                      <GraduationCap className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="font-black text-slate-900">
                        Admission information
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Admission availability institute কর্তৃপক্ষের
                        information-এর উপর নির্ভর করবে।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <InfoCard
                    icon={<CalendarDays className="h-5 w-5" />}
                    title="Admission Status"
                    text={
                      institute.admission_available
                        ? "Currently available"
                        : "Not announced"
                    }
                  />

                  <InfoCard
                    icon={<FileText className="h-5 w-5" />}
                    title="Application"
                    text={
                      institute.admission_available
                        ? "Check official institute information"
                        : "Wait for official notice"
                    }
                  />
                </div>

                {websiteUrl && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
                  >
                    Open Official Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </ContentCard>
            </div>

            <aside>
              <ContentCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Dalal-মুক্ত Education"
              >
                <p className="text-sm leading-7 text-slate-600">
                  Shromobazar-এর লক্ষ্য হলো শিক্ষার্থীকে সরাসরি
                  official information-এর কাছে নিয়ে যাওয়া—অপ্রয়োজনীয়
                  মধ্যস্থতাকারীর উপর নির্ভর না করে।
                </p>

                <button
                  type="button"
                  onClick={openConnect}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-800 transition hover:bg-slate-50"
                >
                  Connect Institute
                  <Users className="h-4 w-4" />
                </button>
              </ContentCard>
            </aside>
          </div>
        )}

        {activeSection === "learning" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureTile
              icon={<BookOpen className="h-6 w-6" />}
              title="Courses"
              text="Institute-এর course/program information এখানে ভবিষ্যতে দেখানো যাবে।"
            />

            <FeatureTile
              icon={<CalendarDays className="h-6 w-6" />}
              title="Classes & Routine"
              text="Connected student permission পেলে class ও routine information দেখা যাবে।"
            />

            <FeatureTile
              icon={<WalletCards className="h-6 w-6" />}
              title="Fees"
              text="Future institute connection-এর মাধ্যমে fee information দেখানো যাবে।"
            />
          </div>
        )}

        {/* CONTACT */}
        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Need information from this institute?
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                সরাসরি institute-এর সাথে connect করার foundation এখানে
                রাখা হয়েছে।
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openConnect}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
              >
                Connect
                <Users className="h-4 w-4" />
              </button>

              <Link
                href="/education"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                Search More
                <Search className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold text-slate-800">
            Shromobazar Education
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Learn → Skill → Opportunity → Work
          </p>
        </div>
      </footer>

      {/* CONNECT MODAL */}
      {showConnect && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeConnect();
            }
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="connect-title"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2
                  id="connect-title"
                  className="text-lg font-black text-slate-900"
                >
                  Connect Institute
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {institute.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeConnect}
                aria-label="Close"
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!connectSent ? (
              <>
                <div className="max-h-[55vh] overflow-y-auto p-5">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                    <div className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                      <div>
                        <h3 className="text-sm font-black text-slate-900">
                          Direct & transparent connection
                        </h3>

                        <p className="mt-1 text-xs leading-6 text-slate-600">
                          আপনি institute-এর সাথে সরাসরি যোগাযোগের জন্য
                          request পাঠাতে পারবেন।
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="mt-5 block">
                    <span className="text-sm font-black text-slate-800">
                      আপনার message
                    </span>

                    <textarea
                      value={connectNote}
                      onChange={(event) =>
                        setConnectNote(event.target.value)
                      }
                      rows={5}
                      placeholder="আপনি কী জানতে চান লিখুন..."
                      className="mt-2 w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs leading-6 text-slate-600">
                      <strong>Privacy:</strong> প্রয়োজন ছাড়া আপনার
                      ব্যক্তিগত information share করবেন না।
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white p-4">
                  <button
                    type="button"
                    onClick={closeConnect}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={sendConnectRequest}
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-black text-white transition hover:bg-orange-600"
                  >
                    Send Request
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-900">
                  Request prepared
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Connection request-এর UI flow সম্পন্ন হয়েছে।
                  Backend request table যুক্ত হলে এটি database-এ
                  permanently save করা যাবে।
                </p>

                <button
                  type="button"
                  onClick={closeConnect}
                  className="mt-6 w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Back to Institute
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADMISSION MODAL */}
      {showAdmission && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAdmission();
            }
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admission-title"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2
                  id="admission-title"
                  className="text-lg font-black text-slate-900"
                >
                  Admission
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {institute.name}
                </p>
              </div>

              <button
                type="button"
                onClick={closeAdmission}
                aria-label="Close"
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-orange-500 p-2 text-white">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-900">
                      Official admission information
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      সর্বশেষ admission notice, application date ও
                      requirements institute-এর official source থেকে
                      যাচাই করুন।
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <InfoLine
                  icon={<GraduationCap className="h-4 w-4" />}
                  label="Category"
                  value={categoryLabel}
                />

                <InfoLine
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={
                    [institute.location, institute.district]
                      .filter(Boolean)
                      .join(", ") || "Not added"
                  }
                />

                <InfoLine
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Status"
                  value={
                    institute.admission_available
                      ? "Admission information available"
                      : "No admission announcement"
                  }
                />
              </div>

              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
                >
                  Visit Official Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs leading-6 text-slate-500">
                  Official website এখনো institute profile-এ যোগ করা হয়নি।
                </div>
              )}

              <button
                type="button"
                onClick={closeAdmission}
                className="mt-3 w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function InstituteProfilePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-6 h-72 animate-pulse rounded-3xl bg-slate-200" />
          </div>
        </main>
      }
    >
      <InstituteProfileContent />
    </Suspense>
  );
}

/* -------------------------------------------------------------------------- */
/* SMALL UI COMPONENTS                                                        */
/* -------------------------------------------------------------------------- */

function QuickStat({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="text-orange-300">{icon}</div>

      <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 line-clamp-2 text-sm font-black text-white">
        {value}
      </p>
    </div>
  );
}

function SectionButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition",
        active
          ? "bg-slate-900 text-white"
          : "text-slate-600 hover:bg-slate-100",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

function ContentCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          {icon}
        </div>

        <h2 className="text-lg font-black text-slate-900">
          {title}
        </h2>
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  text,
  href,
}: InfoCardProps) {
  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {title}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-slate-800">
          {text}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:bg-orange-50/30"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      {content}
    </div>
  );
}

function FeatureTile({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {text}
      </p>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
      {text}
    </div>
  );
}

function InfoLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mt-0.5 text-orange-600">{icon}</div>

      <div>
        <p className="text-xs font-bold text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-bold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}