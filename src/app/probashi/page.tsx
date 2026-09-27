"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ElementType } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Globe2,
  Heart,
  Home,
  Landmark,
  Loader2,
  MapPin,
  MessageCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type Option = {
  title: string;
  description: string;
  icon: ElementType;
  badge?: string;
  tone: string;
  href?: string;
  action?: "info" | "recruit" | "find-job";
};

type RecruitmentJob = {
  id: string;
  country: string;
  city: string | null;
  job_title: string;
  job_category: string | null;
  workers_needed: number;
  required_skills: string[] | null;
  experience_required: string | null;
  salary_text: string | null;
  accommodation_provided: boolean | null;
  food_provided: boolean | null;
  transport_provided: boolean | null;
  description: string;
  status: string;
  verified: boolean;
  created_at: string;
};

type JobApplication = {
  id: string;
  recruitment_post_id: string;
  cover_note: string | null;
  status: string;
  created_at: string;
  probashi_recruitment_posts?: {
    id: string;
    country: string;
    city: string | null;
    job_title: string;
    job_category: string | null;
    salary_text: string | null;
    status: string;
  } | null;
};

const mainOptions: Option[] = [
  {
    title: "বিদেশে লোক লাগবে",
    description:
      "বিদেশে আপনার ব্যবসা বা প্রতিষ্ঠানে শ্রমিক, মিস্ত্রি, টেকনিশিয়ান, ড্রাইভার বা দক্ষ কর্মী প্রয়োজন?",
    icon: Users,
    badge: "Recruit",
    tone: "from-blue-50 to-cyan-50 border-blue-200",
    action: "recruit",
  },
  {
    title: "বিদেশে কাজ খুঁজছি",
    description:
      "বিদেশে আছেন এবং নতুন চাকরি বা নিজের দক্ষতার উপযুক্ত কাজ খুঁজছেন?",
    icon: BriefcaseBusiness,
    badge: "Jobs",
    tone: "from-emerald-50 to-teal-50 border-emerald-200",
    action: "find-job",
  },
  {
    title: "আবাসন ও নাগরিকত্বের পথ",
    description:
      "আপনি যে দেশে আছেন সেখানে দীর্ঘমেয়াদি থাকা, আবাসন বা নাগরিকত্বের পথ সম্পর্কে তথ্য খুঁজুন।",
    icon: Home,
    badge: "Guide",
    tone: "from-violet-50 to-indigo-50 border-violet-200",
    action: "info",
  },
  {
    title: "দেশে টাকা পাঠিয়ে কী করব",
    description:
      "সঞ্চয়, পরিবারের ভবিষ্যৎ, সম্পদ তৈরি বা দেশে পরিকল্পিতভাবে অর্থ ব্যবহারের ধারণা।",
    icon: WalletCards,
    badge: "Planning",
    tone: "from-amber-50 to-yellow-50 border-amber-200",
    action: "info",
  },
  {
    title: "দেশে Business করব",
    description:
      "প্রবাসে আয় করা অভিজ্ঞতা ও পুঁজি ব্যবহার করে বাংলাদেশে ব্যবসার সুযোগ খুঁজুন।",
    icon: Building2,
    badge: "Business",
    tone: "from-orange-50 to-rose-50 border-orange-200",
    href: "/business",
  },
  {
    title: "Business Partner চাই",
    description:
      "বাংলাদেশে ব্যবসা শুরু বা সম্প্রসারণের জন্য উপযুক্ত সহযোগী বা অংশীদার খুঁজুন।",
    icon: Users,
    badge: "Partner",
    tone: "from-pink-50 to-fuchsia-50 border-pink-200",
    href: "/status-feed",
  },
  {
    title: "বাংলাদেশে Investment",
    description:
      "দেশে বিনিয়োগের সুযোগ, ব্যবসা ও সম্ভাব্য অংশীদার সম্পর্কে তথ্য দেখুন।",
    icon: Landmark,
    badge: "Invest",
    tone: "from-cyan-50 to-sky-50 border-cyan-200",
    action: "info",
  },
  {
    title: "বাংলাদেশে ফিরে কী করব",
    description:
      "দেশে ফিরে চাকরি, ব্যবসা, বিনিয়োগ বা নিজের দক্ষতা দিয়ে নতুনভাবে শুরু করার পরিকল্পনা।",
    icon: MapPin,
    badge: "Return",
    tone: "from-lime-50 to-green-50 border-lime-200",
    action: "info",
  },
  {
    title: "Probashi Connect",
    description:
      "বাংলাদেশি প্রবাসীদের সঙ্গে যোগাযোগ, অভিজ্ঞতা ভাগাভাগি ও প্রয়োজনীয় মানুষের কাছে পৌঁছানোর সুযোগ।",
    icon: MessageCircle,
    badge: "Connect",
    tone: "from-sky-50 to-blue-50 border-sky-200",
    href: "/status-feed",
  },
  {
    title: "Good & Happy Life",
    description:
      "প্রবাস জীবনের ভালো কাজ, পরিবার, অর্জন, সাফল্য ও আনন্দের গল্প তুলে ধরুন।",
    icon: Heart,
    badge: "Good Life",
    tone: "from-rose-50 to-pink-50 border-rose-200",
    href: "/good-work",
  },
];

const supportOptions: Option[] = [
  {
    title: "কোনো সমস্যায় পড়েছি",
    description:
      "প্রবাস জীবনের কোনো সমস্যা বা জটিলতা নিয়ে প্রয়োজনীয় তথ্য ও পরবর্তী করণীয় খুঁজুন।",
    icon: CircleHelp,
    badge: "Help",
    tone: "from-red-50 to-orange-50 border-red-200",
    action: "info",
  },
  {
    title: "Support & Guidance",
    description:
      "প্রয়োজনীয় সহায়তা, পরামর্শ এবং সঠিক জায়গায় পৌঁছানোর জন্য গাইডলাইন।",
    icon: Sparkles,
    badge: "Support",
    tone: "from-indigo-50 to-violet-50 border-indigo-200",
    href: "/help-advice",
  },
  {
    title: "Safety & Verification",
    description:
      "পরিচয় যাচাই, নিরাপদ যোগাযোগ, সন্দেহজনক যোগাযোগ এড়িয়ে চলা এবং রিপোর্টিং ব্যবস্থা।",
    icon: ShieldCheck,
    badge: "Safety",
    tone: "from-slate-50 to-blue-50 border-slate-200",
    action: "info",
  },
];

const infoContent: Record<
  string,
  {
    title: string;
    description: string;
    points: string[];
  }
> = {
  "আবাসন ও নাগরিকত্বের পথ": {
    title: "আবাসন ও নাগরিকত্বের পথ",
    description:
      "আপনি যে দেশে বসবাস করছেন সেখানে দীর্ঘমেয়াদি থাকার পরিকল্পনা করার আগে দেশটির সরকারি নিয়ম ও যোগ্যতার তথ্য যাচাই করা গুরুত্বপূর্ণ।",
    points: [
      "Residence / PR / Citizenship-এর পার্থক্য বুঝুন",
      "সরকারি immigration authority-এর তথ্য যাচাই করুন",
      "ভিসা ও residency status-এর শর্ত দেখুন",
      "কোনো এজেন্টকে টাকা দেওয়ার আগে যাচাই করুন",
    ],
  },

  "দেশে টাকা পাঠিয়ে কী করব": {
    title: "দেশে টাকা পাঠিয়ে কী করব",
    description:
      "প্রবাসের আয় শুধু খরচ না করে পরিবার, সঞ্চয়, সম্পদ ও ভবিষ্যৎ পরিকল্পনায় ব্যবহার করার সুযোগগুলো ধাপে ধাপে দেখা যাবে।",
    points: [
      "পরিবারের প্রয়োজন ও জরুরি তহবিল পরিকল্পনা",
      "সঞ্চয় ও দীর্ঘমেয়াদি সম্পদ তৈরির পরিকল্পনা",
      "বাংলাদেশে ব্যবসা বা সম্পদে অর্থ ব্যবহারের সম্ভাবনা",
      "বড় সিদ্ধান্তের আগে প্রয়োজনীয় আর্থিক তথ্য যাচাই",
    ],
  },

  "বাংলাদেশে Investment": {
    title: "বাংলাদেশে Investment",
    description:
      "প্রবাসীরা বাংলাদেশে ফিরে না এসেও বিভিন্ন ব্যবসা বা বিনিয়োগ পরিকল্পনা নিয়ে কাজ করতে পারেন।",
    points: [
      "ব্যবসার ধরন ও প্রয়োজনীয় মূলধন নির্ধারণ",
      "সম্ভাব্য ব্যবসা ও বাজার যাচাই",
      "বিশ্বস্ত Business Partner খোঁজা",
      "চুক্তি, মালিকানা ও অর্থনৈতিক বিষয় লিখিতভাবে যাচাই",
    ],
  },

  "বাংলাদেশে ফিরে কী করব": {
    title: "বাংলাদেশে ফিরে কী করব",
    description:
      "দেশে ফেরার আগে নিজের অভিজ্ঞতা, দক্ষতা, সঞ্চয় ও ভবিষ্যৎ লক্ষ্য অনুযায়ী একটি বাস্তব পরিকল্পনা করা যায়।",
    points: [
      "আগের বিদেশি কাজের অভিজ্ঞতা কাজে লাগানো",
      "বাংলাদেশে চাকরি বা ব্যবসার সুযোগ খোঁজা",
      "নিজের দক্ষতা দিয়ে Service শুরু করা",
      "পরিবার ও আর্থিক পরিকল্পনা আগে ঠিক করা",
    ],
  },

  "কোনো সমস্যায় পড়েছি": {
    title: "কোনো সমস্যায় পড়েছি",
    description:
      "প্রবাস জীবনে সমস্যা হলে আগে তথ্য সংগ্রহ করুন এবং প্রয়োজন অনুযায়ী সংশ্লিষ্ট সরকারি বা অনুমোদিত প্রতিষ্ঠানের সহায়তা নিন।",
    points: [
      "সমস্যার ধরন ও প্রয়োজনীয় তথ্য লিখে রাখুন",
      "পাসপোর্ট, ভিসা ও গুরুত্বপূর্ণ কাগজ নিরাপদে রাখুন",
      "জরুরি পরিস্থিতিতে স্থানীয় emergency service ব্যবহার করুন",
      "প্রয়োজনে Bangladesh Embassy / Consulate-এর official channel যাচাই করুন",
    ],
  },

  "Safety & Verification": {
    title: "Safety & Verification",
    description:
      "অনলাইনে পরিচয়, চাকরি, ব্যবসা বা বিনিয়োগের প্রস্তাব গ্রহণের আগে তথ্য যাচাই করা জরুরি।",
    points: [
      "ব্যক্তি ও প্রতিষ্ঠানের পরিচয় যাচাই করুন",
      "চাকরি বা ব্যবসার অফার লিখিতভাবে নিন",
      "অগ্রিম টাকা পাঠানোর আগে যাচাই করুন",
      "সন্দেহজনক account বা যোগাযোগ Report / Block করুন",
    ],
  },
};

export default function ProbashiPage() {
  const [activeOption, setActiveOption] = useState<Option | null>(null);

  const [showRecruitModal, setShowRecruitModal] = useState(false);
  const [showJobsModal, setShowJobsModal] = useState(false);

  const [jobs, setJobs] = useState<RecruitmentJob[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [submittingRecruitment, setSubmittingRecruitment] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  const [recruitMessage, setRecruitMessage] = useState("");
  const [jobsMessage, setJobsMessage] = useState("");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCountry, setSearchCountry] = useState("");

  const [selectedJob, setSelectedJob] =
    useState<RecruitmentJob | null>(null);

  const [coverNote, setCoverNote] = useState("");

  const [recruitForm, setRecruitForm] = useState({
    country: "",
    city: "",
    jobTitle: "",
    jobCategory: "",
    workersNeeded: "1",
    requiredSkills: "",
    experienceRequired: "",
    salaryText: "",
    accommodationProvided: false,
    foodProvided: false,
    transportProvided: false,
    description: "",
  });

  useEffect(() => {
    if (showJobsModal) {
      loadJobs();
      loadApplications();
    }
  }, [showJobsModal]);

  async function getAccessToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token || null;
  }

  async function loadJobs() {
    setLoadingJobs(true);
    setJobsMessage("");

    try {
      const token = await getAccessToken();

      if (!token) {
        setJobsMessage("Jobs দেখতে আগে Login করুন।");
        setJobs([]);
        return;
      }

      const params = new URLSearchParams();

      if (searchKeyword.trim()) {
        params.set("keyword", searchKeyword.trim());
      }

      if (searchCountry.trim()) {
        params.set("country", searchCountry.trim());
      }

      const response = await fetch(
        `/api/probashi/recruitment?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Jobs load করা যায়নি।",
        );
      }

      setJobs(Array.isArray(result?.jobs) ? result.jobs : []);
    } catch (error) {
      setJobsMessage(
        error instanceof Error
          ? error.message
          : "Jobs load করা যায়নি।",
      );
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  }

  async function loadApplications() {
    setLoadingApplications(true);

    try {
      const token = await getAccessToken();

      if (!token) {
        setApplications([]);
        return;
      }

      const response = await fetch("/api/probashi/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Applications load করা যায়নি।",
        );
      }

      setApplications(
        Array.isArray(result?.applications)
          ? result.applications
          : [],
      );
    } catch {
      setApplications([]);
    } finally {
      setLoadingApplications(false);
    }
  }

  function openRecruitModal() {
    setRecruitMessage("");
    setRecruitForm({
      country: "",
      city: "",
      jobTitle: "",
      jobCategory: "",
      workersNeeded: "1",
      requiredSkills: "",
      experienceRequired: "",
      salaryText: "",
      accommodationProvided: false,
      foodProvided: false,
      transportProvided: false,
      description: "",
    });
    setShowRecruitModal(true);
  }

  function openJobsModal() {
    setJobsMessage("");
    setSelectedJob(null);
    setCoverNote("");
    setShowJobsModal(true);
  }

  async function submitRecruitment() {
    setRecruitMessage("");

    if (!recruitForm.country.trim()) {
      setRecruitMessage("Country দিন।");
      return;
    }

    if (!recruitForm.jobTitle.trim()) {
      setRecruitMessage("Job title দিন।");
      return;
    }

    if (!recruitForm.description.trim()) {
      setRecruitMessage("Job description দিন।");
      return;
    }

    const workersNeeded = Number(recruitForm.workersNeeded);

    if (!Number.isInteger(workersNeeded) || workersNeeded < 1) {
      setRecruitMessage("কতজন লোক লাগবে সঠিক সংখ্যা দিন।");
      return;
    }

    setSubmittingRecruitment(true);

    try {
      const token = await getAccessToken();

      if (!token) {
        setRecruitMessage("Post করতে আগে Login করুন।");
        return;
      }

      const response = await fetch("/api/probashi/recruitment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          country: recruitForm.country,
          city: recruitForm.city,
          jobTitle: recruitForm.jobTitle,
          jobCategory: recruitForm.jobCategory,
          workersNeeded,
          requiredSkills: recruitForm.requiredSkills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          experienceRequired: recruitForm.experienceRequired,
          salaryText: recruitForm.salaryText,
          accommodationProvided:
            recruitForm.accommodationProvided,
          foodProvided: recruitForm.foodProvided,
          transportProvided:
            recruitForm.transportProvided,
          description: recruitForm.description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Recruitment post করা যায়নি।",
        );
      }

      setRecruitMessage(
        result?.message ||
          "বিদেশে লোক লাগবে পোস্ট সফলভাবে প্রকাশ হয়েছে।",
      );

      setTimeout(() => {
        setShowRecruitModal(false);
      }, 900);
    } catch (error) {
      setRecruitMessage(
        error instanceof Error
          ? error.message
          : "Recruitment post করা যায়নি।",
      );
    } finally {
      setSubmittingRecruitment(false);
    }
  }

  function openJobDetails(job: RecruitmentJob) {
    setSelectedJob(job);
    setCoverNote("");
    setJobsMessage("");
  }

  async function applyToJob() {
    if (!selectedJob) return;

    setJobsMessage("");

    setApplyingJobId(selectedJob.id);

    try {
      const token = await getAccessToken();

      if (!token) {
        setJobsMessage("Apply করতে আগে Login করুন।");
        return;
      }

      const response = await fetch("/api/probashi/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recruitmentPostId: selectedJob.id,
          coverNote,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error || "Application submit করা যায়নি।",
        );
      }

      setJobsMessage(
        result?.message || "Application successfully submitted.",
      );

      setCoverNote("");

      await loadApplications();
    } catch (error) {
      setJobsMessage(
        error instanceof Error
          ? error.message
          : "Application submit করা যায়নি।",
      );
    } finally {
      setApplyingJobId(null);
    }
  }

  const renderOption = (option: Option) => {
    const Icon = option.icon;

    const content = (
      <>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-white shadow-sm">
            <Icon className="h-6 w-6 text-slate-700" />
          </div>

          {option.badge && (
            <span className="rounded-full border bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              {option.badge}
            </span>
          )}
        </div>

        <div className="mt-5">
          <h3 className="text-base font-extrabold text-slate-900">
            {option.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {option.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm font-bold text-slate-800">
          <span>
            {option.href
              ? "Open"
              : option.action === "recruit"
                ? "Post / Recruit"
                : option.action === "find-job"
                  ? "Find Jobs"
                  : "View details"}
          </span>

          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </>
    );

    if (option.href) {
      return (
        <Link
          key={option.title}
          href={option.href}
          className={`group block rounded-3xl border bg-gradient-to-br p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${option.tone}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={option.title}
        type="button"
        onClick={() => {
          if (option.action === "recruit") {
            openRecruitModal();
          } else if (option.action === "find-job") {
            openJobsModal();
          } else {
            setActiveOption(option);
          }
        }}
        className={`group block w-full rounded-3xl border bg-gradient-to-br p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${option.tone}`}
      >
        {content}
      </button>
    );
  };

  const activeInfo = activeOption
    ? infoContent[activeOption.title]
    : null;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-sky-50/60 to-indigo-50/70 p-6 shadow-sm sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm">
                <Globe2 className="h-4 w-4" />
                Probashi
              </span>

              <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                For Bangladeshi Expatriates
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              প্রবাসী জীবনের কাজ, সুযোগ ও সংযোগ
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              বিদেশে থাকা বাংলাদেশিদের জন্য কাজ, লোক নিয়োগ, ব্যবসা, বিনিয়োগ,
              দেশে ফেরার পরিকল্পনা, যোগাযোগ এবং প্রয়োজনীয় সহায়তা—সবকিছু এক
              জায়গায় ধাপে ধাপে সাজানোর একটি প্ল্যাটফর্ম।
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openRecruitModal}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
              >
                <Users className="h-4 w-4" />
                বিদেশে লোক লাগবে
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={openJobsModal}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-50"
              >
                <BriefcaseBusiness className="h-4 w-4" />
                বিদেশে কাজ খুঁজছি
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN OPTIONS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Probashi Services
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
            আপনার প্রয়োজন থেকে শুরু করুন
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            আগে সুযোগ ও ভালো দিকগুলো দেখুন, তারপর প্রয়োজন হলে সমস্যা ও
            সহায়তার অংশে যান।
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mainOptions.map(renderOption)}
        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Quick Access
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                নিয়মিত ব্যবহার করা Shromobazar-এর গুরুত্বপূর্ণ জায়গাগুলো।
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openJobsModal}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Jobs
                <ChevronRight className="h-4 w-4" />
              </button>

              <Link
                href="/business"
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Business
                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                href="/status-feed"
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Connect
                <ChevronRight className="h-4 w-4" />
              </Link>

              <Link
                href="/good-work"
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Good Work
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HAPPINESS */}
      <section className="border-y border-rose-100 bg-gradient-to-r from-rose-50 via-white to-amber-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-rose-600">
                <Heart className="h-5 w-5" />

                <span className="text-xs font-black uppercase tracking-[0.18em]">
                  Good & Happy Life
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
                প্রবাস জীবন শুধু সমস্যা নয়—
                <br />
                সাফল্য ও আনন্দের গল্পও আছে।
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                ভালো কাজ, পরিবারের সুখ, নিজের অর্জন এবং দেশের জন্য ভালো কিছু
                করার গল্প অন্য প্রবাসীদের অনুপ্রাণিত করতে পারে।
              </p>

              <Link
                href="/good-work"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700"
              >
                Good Work দেখুন
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
                  <Sparkles className="h-6 w-6 text-rose-600" />
                </div>

                <div>
                  <p className="font-extrabold text-slate-900">
                    Share your good story
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    আপনার ভালো কাজ অন্য কাউকে সাহস দিতে পারে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SUPPORT */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Problem & Support
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            প্রয়োজন হলে এখান থেকে সহায়তা নিন
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {supportOptions.map(renderOption)}
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">
                    নিরাপদ যোগাযোগ ও যাচাই
                  </h2>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                    চাকরি, ব্যবসা, বিনিয়োগ বা অংশীদারিত্বের ক্ষেত্রে ব্যক্তিগত
                    তথ্য ও অর্থ দেওয়ার আগে পরিচয় ও প্রস্তাব যাচাই করুন।
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveOption(
                    supportOptions.find(
                      (item) =>
                        item.title === "Safety & Verification",
                    ) || null,
                  )
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
              >
                Safety Guide
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "পরিচয় যাচাই করুন",
                "অগ্রিম টাকা দেওয়ার আগে যাচাই করুন",
                "সন্দেহ হলে Report / Block করুন",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INFO MODAL */}
      {activeInfo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveOption(null);
            }
          }}
        >
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
              <div>
                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700">
                  Probashi Guide
                </span>

                <h2 className="mt-3 text-xl font-black text-slate-950">
                  {activeInfo.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {activeInfo.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveOption(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <h3 className="text-sm font-black text-slate-900">
                যা আগে দেখবেন
              </h3>

              <div className="mt-3 space-y-2">
                {activeInfo.points.map((point) => (
                  <div
                    key={point}
                    className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <p className="text-sm leading-6 text-slate-700">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold leading-5 text-amber-800">
                  গুরুত্বপূর্ণ: সরকারি নিয়ম, ভিসা, নাগরিকত্ব, আর্থিক বা
                  বিনিয়োগের সিদ্ধান্তের ক্ষেত্রে সংশ্লিষ্ট official source
                  অবশ্যই যাচাই করবেন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveOption(null)}
                className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECRUIT MODAL */}
      {showRecruitModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-5">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">
                  Recruit Abroad
                </span>

                <h2 className="mt-1 text-xl font-black text-slate-950">
                  বিদেশে লোক লাগবে
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  আপনার প্রয়োজনীয় কর্মীর job post তৈরি করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRecruitModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {recruitMessage && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">
                  {recruitMessage}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  value={recruitForm.country}
                  onChange={(e) =>
                    setRecruitForm((f) => ({
                      ...f,
                      country: e.target.value,
                    }))
                  }
                  placeholder="Country *"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-400"
                />

                <input
                  value={recruitForm.city}
                  onChange={(e) =>
                    setRecruitForm((f) => ({
                      ...f,
                      city: e.target.value,
                    }))
                  }
                  placeholder="City"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-400"
                />

                <input
                  value={recruitForm.jobTitle}
                  onChange={(e) =>
                    setRecruitForm((f) => ({
                      ...f,
                      jobTitle: e.target.value,
                    }))
                  }
                  placeholder="Job title *"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-400"
                />

                <input
                  value={recruitForm.jobCategory}
                  onChange={(e) =>
                    setRecruitForm((f) => ({
                      ...f,
                      jobCategory: e.target.value,
                    }))
                  }
                  placeholder="Job category"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-400"
                />

                <input
                  type="number"
                  min="1"
                  value={recruitForm.workersNeeded}
                  onChange={(e) =>
                    setRecruitForm((f) => ({
                      ...f,
                      workersNeeded: e.target.value,
                    }))
                  }
                  placeholder="Workers needed"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-400"
                />

                <input
                  value={recruitForm.experienceRequired}
                  onChange={(e) =>
                    setRecruitForm((f) => ({
                      ...f,
                      experienceRequired: e.target.value,
                    }))
                  }
                  placeholder="Experience required"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-400"
                />

                <input
                  value={recruitForm.requiredSkills}
                  onChange={(e) =>
                    setRecruitForm((f) => ({
                      ...f,
                      requiredSkills: e.target.value,
                    }))
                  }
                  placeholder="Skills — comma separated"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-400 sm:col-span-2"
                />

                <input
                  value={recruitForm.salaryText}
                  onChange={(e) =>
                    setRecruitForm((f) => ({
                      ...f,
                      salaryText: e.target.value,
                    }))
                  }
                  placeholder="Salary / Pay"
                  className="rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-400 sm:col-span-2"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  ["accommodationProvided", "Accommodation"],
                  ["foodProvided", "Food"],
                  ["transportProvided", "Transport"],
                ].map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border bg-slate-50 px-3 py-3 text-xs font-bold text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={
                        recruitForm[
                          key as keyof typeof recruitForm
                        ] as boolean
                      }
                      onChange={(e) =>
                        setRecruitForm((f) => ({
                          ...f,
                          [key]: e.target.checked,
                        }))
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>

              <textarea
                value={recruitForm.description}
                onChange={(e) =>
                  setRecruitForm((f) => ({
                    ...f,
                    description: e.target.value,
                  }))
                }
                placeholder="Job description *"
                rows={5}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-400"
              />

              <button
                type="button"
                disabled={submittingRecruitment}
                onClick={submitRecruitment}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white disabled:opacity-60"
              >
                {submittingRecruitment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    বিদেশে লোক লাগবে — Post Job
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOBS MODAL */}
      {showJobsModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                    Jobs Abroad
                  </span>

                  <h2 className="mt-1 text-xl font-black text-slate-950">
                    বিদেশে কাজ খুঁজছি
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Probashi recruitment posts থেকে কাজ খুঁজুন এবং apply করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowJobsModal(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_220px_auto]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    value={searchKeyword}
                    onChange={(e) =>
                      setSearchKeyword(e.target.value)
                    }
                    placeholder="Job / profession / city"
                    className="w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-400"
                  />
                </div>

                <input
                  value={searchCountry}
                  onChange={(e) =>
                    setSearchCountry(e.target.value)
                  }
                  placeholder="Country"
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                />

                <button
                  type="button"
                  onClick={loadJobs}
                  className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="p-5">
              {jobsMessage && (
                <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-semibold text-blue-800">
                  {jobsMessage}
                </div>
              )}

              {loadingJobs ? (
                <div className="flex items-center justify-center py-16 text-sm font-bold text-slate-500">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Jobs loading...
                </div>
              ) : selectedJob ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="mb-5 text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    ← Back to jobs
                  </button>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black text-emerald-700">
                          {selectedJob.country}
                          {selectedJob.city
                            ? ` · ${selectedJob.city}`
                            : ""}
                        </span>

                        <h3 className="mt-3 text-2xl font-black text-slate-950">
                          {selectedJob.job_title}
                        </h3>

                        {selectedJob.job_category && (
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {selectedJob.job_category}
                          </p>
                        )}
                      </div>

                      {selectedJob.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-[10px] font-bold text-slate-400">
                          Workers Needed
                        </p>
                        <p className="mt-1 font-black text-slate-900">
                          {selectedJob.workers_needed}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-[10px] font-bold text-slate-400">
                          Salary
                        </p>
                        <p className="mt-1 font-black text-slate-900">
                          {selectedJob.salary_text || "Not specified"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-[10px] font-bold text-slate-400">
                          Experience
                        </p>
                        <p className="mt-1 font-black text-slate-900">
                          {selectedJob.experience_required ||
                            "Not specified"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-4">
                        <p className="text-[10px] font-bold text-slate-400">
                          Benefits
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {[
                            selectedJob.accommodation_provided
                              ? "Accommodation"
                              : "",
                            selectedJob.food_provided ? "Food" : "",
                            selectedJob.transport_provided
                              ? "Transport"
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" · ") || "Not specified"}
                        </p>
                      </div>
                    </div>

                    {selectedJob.required_skills &&
                      selectedJob.required_skills.length > 0 && (
                        <div className="mt-5">
                          <p className="text-xs font-black text-slate-900">
                            Required Skills
                          </p>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {selectedJob.required_skills.map(
                              (skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                                >
                                  {skill}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    <div className="mt-5">
                      <p className="text-xs font-black text-slate-900">
                        Job Description
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {selectedJob.description}
                      </p>
                    </div>

                    <div className="mt-6 border-t pt-5">
                      <textarea
                        value={coverNote}
                        onChange={(e) =>
                          setCoverNote(e.target.value)
                        }
                        placeholder="আপনার সম্পর্কে ছোট একটি note লিখুন (optional)"
                        rows={4}
                        className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
                      />

                      <button
                        type="button"
                        disabled={
                          applyingJobId === selectedJob.id
                        }
                        onClick={applyToJob}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60"
                      >
                        {applyingJobId === selectedJob.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          <>
                            Apply for this Job
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center">
                      <BriefcaseBusiness className="mx-auto h-10 w-10 text-slate-300" />

                      <h3 className="mt-4 font-black text-slate-800">
                        এখনো কোনো open job পাওয়া যায়নি
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Country বা keyword পরিবর্তন করে আবার Search করুন।
                      </p>
                    </div>
                  ) : (
                    jobs.map((job) => {
                      const alreadyApplied = applications.some(
                        (application) =>
                          application.recruitment_post_id ===
                          job.id,
                      );

                      return (
                        <button
                          key={job.id}
                          type="button"
                          onClick={() => openJobDetails(job)}
                          className="group w-full rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-700">
                                  {job.country}
                                </span>

                                {job.city && (
                                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                                    {job.city}
                                  </span>
                                )}

                                {job.verified && (
                                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                                    Verified
                                  </span>
                                )}
                              </div>

                              <h3 className="mt-3 text-lg font-black text-slate-900">
                                {job.job_title}
                              </h3>

                              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                {job.description}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 text-xs font-black text-emerald-700">
                              {alreadyApplied
                                ? "Applied"
                                : "View & Apply"}

                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                            <span>
                              {job.workers_needed} worker
                              {job.workers_needed > 1 ? "s" : ""}
                            </span>

                            {job.salary_text && (
                              <>
                                <span>•</span>
                                <span>{job.salary_text}</span>
                              </>
                            )}

                            {job.job_category && (
                              <>
                                <span>•</span>
                                <span>{job.job_category}</span>
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}

              {!selectedJob && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-sm font-black text-slate-900">
                    আমার Applications
                  </h3>

                  {loadingApplications ? (
                    <p className="mt-3 text-xs text-slate-500">
                      Applications loading...
                    </p>
                  ) : applications.length === 0 ? (
                    <p className="mt-3 text-xs text-slate-500">
                      এখনো কোনো job application নেই।
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {applications.slice(0, 10).map(
                        (application) => (
                          <div
                            key={application.id}
                            className="flex flex-col gap-2 rounded-2xl border bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="text-sm font-black text-slate-800">
                                {
                                  application
                                    .probashi_recruitment_posts
                                    ?.job_title
                                }
                              </p>

                              <p className="mt-1 text-[11px] text-slate-500">
                                {
                                  application
                                    .probashi_recruitment_posts
                                    ?.country
                                }
                                {application
                                  .probashi_recruitment_posts
                                  ?.city
                                  ? ` · ${application.probashi_recruitment_posts.city}`
                                  : ""}
                              </p>
                            </div>

                            <span className="w-fit rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase text-slate-600">
                              {application.status}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}