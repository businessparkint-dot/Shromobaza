"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  ChevronRight,
  LockKeyhole,
  CircleUserRound,
  GraduationCap,
  HeartPulse,
  LogOut,
  Mail,
  MessageCircle,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  Trash2,
  UserRound,
  Wallet,
  X,
  Trophy,
  Car,
  Lightbulb,
  Scale,
  Store,
  Wrench,
  Star,
  Globe,
  MapPin,
} from "lucide-react";

import { supabase } from "@/lib/client";

/* =========================================================
   TYPES
========================================================= */

type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

type IdentityType =
  | "personal"
  | "professional"
  | "student"
  | "medical"
  | "player"
  | "shop"
  | "business"
  | "institute"
  | "other";

type Identity = {
  id: string;
  user_id: string;
  identity_type: IdentityType;
  display_name: string;
  slug: string | null;
  avatar_url: string | null;
  bio: string | null;

  business_type: string | null;
  category: string | null;
  owner_admin_name: string | null;
  contact_number: string | null;
  address: string | null;

  professional_profession: string | null;
  professional_degree: string | null;
  professional_organization: string | null;
  professional_chamber: string | null;
  professional_address: string | null;
  professional_email: string | null;
  professional_contact: string | null;
  professional_experience: string | null;
  professional_skills: string | null;

  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

type ProfessionDefinition = {
  type: string;
  title: string;
  titleBn: string;
  icon: typeof UserRound;
  subcategories: string[];
};

type WorkerWorkArea = "bangladesh" | "overseas" | "both";

/* =========================================================
   PROFESSIONS
========================================================= */

const PROFESSIONS: ProfessionDefinition[] = [
  {
    type: "engineer",
    title: "Engineer",
    titleBn: "প্রকৌশলী",
    icon: Wrench,
    subcategories: [
      "Civil Engineer",
      "Mechanical Engineer",
      "Electrical Engineer",
      "Computer Engineer",
      "Software Engineer",
      "Electronics Engineer",
      "Chemical Engineer",
      "Textile Engineer",
      "Marine Engineer",
      "Industrial Engineer",
      "Structural Engineer",
      "Environmental Engineer",
      "Other Engineering",
    ],
  },
  {
    type: "doctor",
    title: "Doctor",
    titleBn: "চিকিৎসক",
    icon: Stethoscope,
    subcategories: [
      "Medicine Specialist",
      "Cardiologist",
      "Neurologist",
      "Child Specialist",
      "Gynecologist",
      "Orthopedic Specialist",
      "Dermatologist",
      "ENT Specialist",
      "Eye Specialist",
      "Surgeon",
      "Dental Surgeon",
      "General Physician",
      "Other Medical Specialist",
    ],
  },
  {
    type: "lawyer",
    title: "Lawyer / Advocate",
    titleBn: "আইনজীবী",
    icon: Scale,
    subcategories: [
      "Civil Lawyer",
      "Criminal Lawyer",
      "Corporate Lawyer",
      "Family Lawyer",
      "Land Lawyer",
      "Tax Lawyer",
      "Supreme Court Advocate",
      "Legal Consultant",
      "Other Legal Professional",
    ],
  },
  {
    type: "teacher",
    title: "Teacher",
    titleBn: "শিক্ষক",
    icon: GraduationCap,
    subcategories: [
      "Primary Teacher",
      "High School Teacher",
      "College Teacher",
      "University Teacher",
      "Madrasa Teacher",
      "English Teacher",
      "Mathematics Teacher",
      "Science Teacher",
      "ICT Teacher",
      "Private Tutor",
      "Other Teacher",
    ],
  },
  {
    type: "architect",
    title: "Architect",
    titleBn: "স্থপতি",
    icon: Building2,
    subcategories: [
      "Building Architect",
      "Interior Architect",
      "Landscape Architect",
      "Urban Planner",
      "Interior Designer",
      "Other Architecture",
    ],
  },
  {
    type: "technician",
    title: "Technician",
    titleBn: "টেকনিশিয়ান",
    icon: Wrench,
    subcategories: [
      "AC Technician",
      "Refrigerator Technician",
      "Mobile Technician",
      "Computer Technician",
      "CCTV Technician",
      "Lift Technician",
      "Generator Technician",
      "Industrial Technician",
      "Other Technician",
    ],
  },
  {
    type: "driver",
    title: "Driver",
    titleBn: "চালক",
    icon: Car,
    subcategories: [
      "Car Driver",
      "Bus Driver",
      "Truck Driver",
      "Pickup Driver",
      "Motorcycle Rider",
      "Heavy Vehicle Driver",
      "Private Driver",
      "Professional Transport Driver",
    ],
  },
  {
    type: "accountant",
    title: "Accountant",
    titleBn: "হিসাবরক্ষক",
    icon: Wallet,
    subcategories: [
      "Accounts Officer",
      "Auditor",
      "Tax Consultant",
      "Chartered Accountant",
      "Bookkeeper",
      "Finance Manager",
    ],
  },
  {
    type: "it_professional",
    title: "IT / Software Professional",
    titleBn: "আইটি পেশাজীবী",
    icon: Lightbulb,
    subcategories: [
      "Web Developer",
      "App Developer",
      "Software Engineer",
      "UI/UX Designer",
      "Graphic Designer",
      "Cyber Security Specialist",
      "Network Engineer",
      "Data Analyst",
      "AI / Machine Learning",
      "IT Support",
      "Digital Marketer",
    ],
  },
  {
    type: "designer",
    title: "Designer",
    titleBn: "ডিজাইনার",
    icon: Lightbulb,
    subcategories: [
      "Graphic Designer",
      "Fashion Designer",
      "Interior Designer",
      "Product Designer",
      "Web Designer",
      "Motion Designer",
      "Industrial Designer",
    ],
  },
  {
    type: "electrician",
    title: "Electrician",
    titleBn: "ইলেকট্রিশিয়ান",
    icon: Wrench,
    subcategories: [
      "Building Electrician",
      "Industrial Electrician",
      "House Wiring",
      "Substation Electrician",
      "Solar Technician",
      "Electrical Maintenance",
    ],
  },
  {
    type: "plumber",
    title: "Plumber",
    titleBn: "প্লাম্বার",
    icon: Wrench,
    subcategories: [
      "Building Plumber",
      "Sanitary Technician",
      "Pipe Fitting",
      "Water Supply Technician",
      "Industrial Plumbing",
    ],
  },
  {
    type: "mechanic",
    title: "Mechanic",
    titleBn: "মেকানিক",
    icon: Wrench,
    subcategories: [
      "Car Mechanic",
      "Motorcycle Mechanic",
      "Diesel Mechanic",
      "Heavy Vehicle Mechanic",
      "Industrial Machine Mechanic",
      "AC Mechanic",
    ],
  },
  {
    type: "freelancer",
    title: "Freelancer",
    titleBn: "ফ্রিল্যান্সার",
    icon: BriefcaseBusiness,
    subcategories: [
      "Web Development",
      "Graphic Design",
      "Digital Marketing",
      "Content Writing",
      "Video Editing",
      "Data Entry",
      "Virtual Assistant",
      "SEO Specialist",
      "Other Freelance Work",
    ],
  },
  {
    type: "agriculture",
    title: "Agriculture Professional",
    titleBn: "কৃষি পেশাজীবী",
    icon: Lightbulb,
    subcategories: [
      "Agricultural Officer",
      "Agricultural Engineer",
      "Veterinary Professional",
      "Fisheries Specialist",
      "Dairy Specialist",
      "Poultry Specialist",
      "Farm Manager",
      "Agricultural Consultant",
    ],
  },
  {
    type: "sales_marketing",
    title: "Sales & Marketing",
    titleBn: "বিক্রয় ও বিপণন",
    icon: BriefcaseBusiness,
    subcategories: [
      "Sales Executive",
      "Marketing Executive",
      "Brand Manager",
      "Digital Marketing Manager",
      "Business Development",
      "Sales Manager",
    ],
  },
  {
    type: "actor",
    title: "Actor / Artist",
    titleBn: "অভিনেতা / শিল্পী",
    icon: Trophy,
    subcategories: [
      "Film Actor",
      "TV Actor",
      "Drama Actor",
      "Theatre Artist",
      "Model",
      "Singer",
      "Musician",
      "Dancer",
      "Voice Artist",
      "Presenter",
      "Comedian",
      "Other Artist",
    ],
  },
  {
    type: "player",
    title: "Sports Professional",
    titleBn: "ক্রীড়া পেশাজীবী",
    icon: Trophy,
    subcategories: [
      "Cricket Player",
      "Football Player",
      "Hockey Player",
      "Badminton Player",
      "Tennis Player",
      "Athlete",
      "Boxer",
      "Swimmer",
      "Coach",
      "Sports Trainer",
      "Referee",
      "Other Sports",
    ],
  },
  {
    type: "consultant",
    title: "Consultant",
    titleBn: "পরামর্শক",
    icon: Lightbulb,
    subcategories: [
      "Business Consultant",
      "Management Consultant",
      "HR Consultant",
      "Education Consultant",
      "Legal Consultant",
      "IT Consultant",
      "Agriculture Consultant",
      "Other Consultant",
    ],
  },
  {
    type: "creator",
    title: "Content Creator",
    titleBn: "কনটেন্ট নির্মাতা",
    icon: Lightbulb,
    subcategories: [
      "YouTuber",
      "Facebook Content Creator",
      "Photographer",
      "Videographer",
      "Influencer",
      "Writer",
      "Journalist",
      "News Presenter",
      "Other Creator",
    ],
  },
  {
    type: "other_professional",
    title: "Other Profession",
    titleBn: "অন্যান্য পেশা",
    icon: UserRound,
    subcategories: [
      "Banker",
      "Government Employee",
      "Police Professional",
      "Military Professional",
      "Pilot",
      "Nurse",
      "Pharmacist",
      "Chef",
      "Hotel Professional",
      "Tourism Professional",
      "Garments Professional",
      "Factory Professional",
      "Researcher",
      "Scientist",
      "Other Profession",
    ],
  },
];

/* =========================================================
   WORKER CATEGORIES
========================================================= */

const WORKER_CATEGORIES = [
  {
    value: "construction",
    label: "Construction / নির্মাণকাজ",
    subcategories: [
      "Rajmistri / রাজমিস্ত্রি",
      "Rod Mistri / রড মিস্ত্রি",
      "Shuttering Mistri / সাটারিং মিস্ত্রি",
      "Tiles Mistri / টাইলস মিস্ত্রি",
      "Painter / রং মিস্ত্রি",
      "Plaster Mistri / প্লাস্টার মিস্ত্রি",
      "Building Helper / নির্মাণ সহকারী",
      "Welder / ওয়েল্ডার",
      "Carpenter / কাঠমিস্ত্রি",
      "Glass Fitter / গ্লাস মিস্ত্রি",
      "Aluminium Worker / অ্যালুমিনিয়াম মিস্ত্রি",
    ],
  },
  {
    value: "electrical",
    label: "Electrical / ইলেকট্রিক্যাল",
    subcategories: [
      "Electrician / ইলেকট্রিশিয়ান",
      "House Wiring / বাসাবাড়ির ওয়্যারিং",
      "Industrial Electrician / ইন্ডাস্ট্রিয়াল ইলেকট্রিশিয়ান",
      "Solar Technician / সোলার টেকনিশিয়ান",
      "Electrical Helper / ইলেকট্রিক্যাল সহকারী",
    ],
  },
  {
    value: "plumbing",
    label: "Plumbing / প্লাম্বিং",
    subcategories: [
      "Plumber / প্লাম্বার",
      "Sanitary Fitter / স্যানিটারি মিস্ত্রি",
      "Pipe Fitter / পাইপ ফিটার",
      "Water Line Technician / পানির লাইন মিস্ত্রি",
    ],
  },
  {
    value: "mechanical",
    label: "Mechanical / মেকানিক্যাল",
    subcategories: [
      "Car Mechanic / গাড়ির মেকানিক",
      "Motorcycle Mechanic / মোটরসাইকেল মেকানিক",
      "Diesel Mechanic / ডিজেল মেকানিক",
      "Machine Operator / মেশিন অপারেটর",
      "Factory Technician / ফ্যাক্টরি টেকনিশিয়ান",
    ],
  },
  {
    value: "ac_refrigeration",
    label: "AC & Refrigeration / এসি ও ফ্রিজ",
    subcategories: [
      "AC Technician / এসি মিস্ত্রি",
      "Refrigerator Technician / ফ্রিজ মিস্ত্রি",
      "AC Installation / এসি ইনস্টলেশন",
      "Cooling Technician / কুলিং টেকনিশিয়ান",
    ],
  },
  {
    value: "transport",
    label: "Transport / পরিবহন",
    subcategories: [
      "Car Driver / গাড়িচালক",
      "Bus Driver / বাসচালক",
      "Truck Driver / ট্রাকচালক",
      "Pickup Driver / পিকআপ চালক",
      "Delivery Rider / ডেলিভারি রাইডার",
      "Heavy Vehicle Driver / ভারী যানবাহন চালক",
    ],
  },
  {
    value: "household",
    label: "Household Service / গৃহস্থালি",
    subcategories: [
      "House Cleaner / বাসাবাড়ি পরিষ্কারকর্মী",
      "Cook / বাবুর্চি",
      "Gardener / মালী",
      "Caregiver / পরিচর্যাকারী",
      "Household Assistant / গৃহকর্মী",
      "Laundry Worker / লন্ড্রি কর্মী",
    ],
  },
  {
    value: "agriculture",
    label: "Agriculture / কৃষিকাজ",
    subcategories: [
      "Farm Worker / কৃষিশ্রমিক",
      "Field Worker / মাঠকর্মী",
      "Harvest Worker / ফসল কাটার শ্রমিক",
      "Fisherman / জেলে",
      "Livestock Worker / গবাদিপশু পরিচর্যাকারী",
      "Poultry Worker / পোল্ট্রি কর্মী",
    ],
  },
  {
    value: "factory",
    label: "Factory & Industry / কারখানা",
    subcategories: [
      "Factory Worker / কারখানার শ্রমিক",
      "Garments Worker / গার্মেন্টস কর্মী",
      "Machine Operator / মেশিন অপারেটর",
      "Packaging Worker / প্যাকেজিং কর্মী",
      "Quality Checker / কোয়ালিটি চেকার",
      "Production Worker / উৎপাদন কর্মী",
    ],
  },
  {
    value: "other",
    label: "Other Skilled Work / অন্যান্য",
    subcategories: [
      "Security Guard / নিরাপত্তাকর্মী",
      "Office Assistant / অফিস সহকারী",
      "Shop Assistant / দোকান সহকারী",
      "Loader / মালামাল ওঠানামার শ্রমিক",
      "Delivery Worker / ডেলিভারি কর্মী",
      "Event Worker / ইভেন্ট কর্মী",
      "Other Skilled Worker / অন্যান্য দক্ষ কর্মী",
    ],
  },
];

/* =========================================================
   BUSINESS DEFINITIONS
========================================================= */

const SHOP_BUSINESS_TYPES = [
  { value: "retail", label: "Retail / খুচরা" },
  { value: "wholesale", label: "Wholesale / পাইকারি" },
  { value: "retail_wholesale", label: "Retail + Wholesale" },
  { value: "footpath", label: "Footpath / Street Market" },
];

const BUSINESS_IDENTITY_DEFINITIONS = [
  { type: "shop", title: "Shop / দোকান", icon: Store },
  { type: "office", title: "Office / অফিস", icon: Building2 },
  {
    type: "institute",
    title: "Institute / প্রতিষ্ঠান",
    icon: GraduationCap,
  },
];

/* =========================================================
   IDENTITY DEFINITIONS
========================================================= */

const IDENTITY_DEFINITIONS = [
  {
    type: "personal" as IdentityType,
    title: "Personal",
    description: "আপনার ব্যক্তিগত পরিচয়",
    icon: UserRound,
  },
  {
    type: "professional" as IdentityType,
    title: "Professional",
    description: "আপনার পেশা ও বিশেষজ্ঞ পরিচয়",
    icon: BriefcaseBusiness,
  },
  {
    type: "student" as IdentityType,
    title: "Student",
    description: "শিক্ষার্থী পরিচয়",
    icon: GraduationCap,
  },
  {
    type: "medical" as IdentityType,
    title: "Medical / Health",
    description: "স্বাস্থ্য ও চিকিৎসা সম্পর্কিত পরিচয়",
    icon: HeartPulse,
  },
  {
    type: "player" as IdentityType,
    title: "Player",
    description: "Sports ও Player পরিচয়",
    icon: Trophy,
  },
  {
    type: "shop" as IdentityType,
    title: "Shop",
    description: "আপনার দোকান / Marketplace পরিচয়",
    icon: ShoppingBag,
  },
  {
    type: "business" as IdentityType,
    title: "Office",
    description: "Business, Office বা Consultancy",
    icon: Building2,
  },
  {
    type: "institute" as IdentityType,
    title: "Institute",
    description: "School, College, Training বা Institute",
    icon: ShieldCheck,
  },
  {
    type: "other" as IdentityType,
    title: "Other",
    description: "অন্যান্য পরিচয়",
    icon: CircleUserRound,
  },
];
/* =========================================================
   HELPERS
========================================================= */

function getErrorMessage(error: unknown) {
  if (!error) return "Unknown error";

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const e = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    return [
      e.message,
      e.details,
      e.hint,
      e.code ? `Code: ${e.code}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  }

  return String(error);
}

function slugify(value: string) {
  const result = value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70);

  return result || `identity-${crypto.randomUUID().slice(0, 8)}`;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#07152d] outline-none transition focus:border-[#07152d] focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-700">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#07152d] outline-none transition focus:border-[#07152d] focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "নির্বাচন করুন",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-slate-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#07152d] outline-none transition focus:border-[#07152d] focus:ring-2 focus:ring-slate-100"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-1 break-all text-sm font-black text-[#07152d]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   IDENTITY CARD
========================================================= */

function IdentityCard({
  identity,
  onDelete,
  deleting,
}: {
  identity: Identity;
  onDelete: (id: string) => void;
  deleting: string | null;
}) {
  const isWorker =
    identity.identity_type === "professional" &&
    identity.professional_profession === "Worker / শ্রমিক";

  const definition = isWorker
    ? {
        title: "Worker / শ্রমিক",
        description: "আপনার কাজ ও দক্ষতার পরিচয়",
        icon: Wrench,
      }
    : IDENTITY_DEFINITIONS.find(
        (item) => item.type === identity.identity_type,
      ) ?? IDENTITY_DEFINITIONS[IDENTITY_DEFINITIONS.length - 1];

  const Icon = definition.icon;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${
            isWorker
              ? "bg-emerald-700"
              : "bg-[#07152d]"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-wider text-orange-600">
                {definition.title}
              </p>

              <h3 className="mt-1 truncate text-sm font-black text-[#07152d]">
                {identity.display_name}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => onDelete(identity.id)}
              disabled={deleting === identity.id}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              aria-label="Delete identity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {identity.category && (
            <p className="mt-2 text-[10px] font-bold text-slate-500">
              {isWorker ? "Worker / শ্রমিক" : identity.category}
            </p>
          )}

          {identity.bio ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
              {identity.bio}
            </p>
          ) : (
            <p className="mt-2 text-[10px] text-slate-400">
              {definition.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                identity.is_public
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {identity.is_public ? "Public" : "Private"}
            </span>

            {identity.is_active && (
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-700">
                Active
              </span>
            )}
          </div>

          {identity.identity_type === "shop" && (
            <Link
              href={`/open-your-shop/profile?identityId=${encodeURIComponent(
                identity.id,
              )}`}
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-800"
            >
              <ShoppingBag className="h-4 w-4" />
              Open My Shop Website
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
/* =========================================================
   MAIN PAGE
========================================================= */

export default function MyAccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [identities, setIdentities] = useState<Identity[]>([]);

  const [activeIdentityId, setActiveIdentityId] = useState("personal");
  const [showIdentitySwitch, setShowIdentitySwitch] = useState(false);
  const [switchMessage, setSwitchMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingIdentity, setDeletingIdentity] = useState<string | null>(null);

  const [showAddIdentity, setShowAddIdentity] = useState(false);

  /* Modal state */
  const [identityStep, setIdentityStep] = useState<"type" | "category">("type");
  const [identityGroup, setIdentityGroup] = useState<
    "professional" | "worker" | "business"
  >("professional");

  const [identityType, setIdentityType] = useState<IdentityType>("professional");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedWorkerCategory, setSelectedWorkerCategory] = useState("");
  const [selectedWorkerSubcategories, setSelectedWorkerSubcategories] = useState<string[]>([]);

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  /* Business fields */
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [identityMainCategory, setIdentityMainCategory] = useState("");
  const [ownerAdminName, setOwnerAdminName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [identityAddress, setIdentityAddress] = useState("");

  /* Professional fields */
  const [professionalProfession, setProfessionalProfession] = useState("");
  const [professionalDegree, setProfessionalDegree] = useState("");
  const [professionalOrganization, setProfessionalOrganization] = useState("");
  const [professionalChamber, setProfessionalChamber] = useState("");
  const [professionalAddress, setProfessionalAddress] = useState("");
  const [professionalEmail, setProfessionalEmail] = useState("");
  const [professionalContact, setProfessionalContact] = useState("");
  const [professionalExperience, setProfessionalExperience] = useState("");
  const [professionalSkills, setProfessionalSkills] = useState("");

  /* Worker fields */
  const [workerWorkArea, setWorkerWorkArea] = useState<WorkerWorkArea>("bangladesh");
  const [workerDistrict, setWorkerDistrict] = useState("");
  const [workerLocation, setWorkerLocation] = useState("");
  const [workerExperience, setWorkerExperience] = useState("");
  const [workerSkillGrade, setWorkerSkillGrade] = useState("1");
  const [workerRemuneration, setWorkerRemuneration] = useState("");
  const [workerCertificates, setWorkerCertificates] = useState("");
  const [workerSkills, setWorkerSkills] = useState("");

  const [error, setError] = useState("");
  const [identityError, setIdentityError] = useState("");

  /* =========================================================
     RESET MODAL
  ========================================================= */

  const resetIdentityFields = useCallback(() => {
    setIdentityStep("type");
    setIdentityGroup("professional");
    setIdentityType("professional");

    setSelectedProfession("");
    setSelectedWorkerCategory("");
    setSelectedWorkerSubcategories([]);

    setDisplayName("");
    setBio("");
    setIsPublic(true);

    setBusinessCategory("");
    setBusinessType("");
    setIdentityMainCategory("");
    setOwnerAdminName("");
    setContactNumber("");
    setIdentityAddress("");

    setProfessionalProfession("");
    setProfessionalDegree("");
    setProfessionalOrganization("");
    setProfessionalChamber("");
    setProfessionalAddress("");
    setProfessionalEmail("");
    setProfessionalContact("");
    setProfessionalExperience("");
    setProfessionalSkills("");

    setWorkerWorkArea("bangladesh");
    setWorkerDistrict("");
    setWorkerLocation("");
    setWorkerExperience("");
    setWorkerSkillGrade("1");
    setWorkerRemuneration("");
    setWorkerCertificates("");
    setWorkerSkills("");

    setIdentityError("");
  }, []);

  function resetIdentityModal() {
    if (savingIdentity) return;
    setShowAddIdentity(false);
    resetIdentityFields();
  }

  /* =========================================================
     IDENTITY SWITCH
  ========================================================= */

  function handleIdentitySwitch(identityId: string) {
    const isValid =
      identityId === "personal" ||
      identities.some(
        (identity) => identity.id === identityId && identity.is_active,
      );

    if (!isValid) {
      setSwitchMessage("এই Identity বর্তমানে সক্রিয় নয়।");
      return;
    }

    setActiveIdentityId(identityId);

    window.localStorage.setItem("shromobazar_active_identity", identityId);
    setShowIdentitySwitch(false);

    setSwitchMessage(
      identityId === "personal"
        ? "Personal Account নির্বাচন করা হয়েছে।"
        : "Identity পরিবর্তন করা হয়েছে।",
    );

    window.dispatchEvent(
      new CustomEvent("shromobazar:identity-change", {
        detail: { identityId },
      }),
    );
  }

  /* =========================================================
     LOAD ACCOUNT
  ========================================================= */

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setError("");
    setIdentityError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setProfile(null);
        setEmail("");
        setUserId("");
        setIdentities([]);
        setError("আপনি এখনো লগইন করেননি।");
        return;
      }

      setUserId(user.id);
      setEmail(user.email ?? "");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      const { data: identityData, error: identitiesLoadError } = await supabase
        .from("identities")
        .select(
          "id, user_id, identity_type, display_name, slug, avatar_url, bio, business_type, category, owner_admin_name, contact_number, address, professional_profession, professional_degree, professional_organization, professional_chamber, professional_address, professional_email, professional_contact, professional_experience, professional_skills, is_active, is_public, created_at, updated_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (identitiesLoadError) {
        console.error("Identity load error:", getErrorMessage(identitiesLoadError));
        setIdentities([]);
        setIdentityError(
          "Identity list এখন load করা যাচ্ছে না। Account অংশ ঠিকভাবে কাজ করছে।",
        );
      } else {
        const loadedIdentities = (identityData ?? []) as Identity[];
        setIdentities(loadedIdentities);

        const savedIdentityId = window.localStorage.getItem(
          "shromobazar_active_identity",
        );

        const savedIdentityIsValid =
          savedIdentityId === "personal" ||
          loadedIdentities.some(
            (identity) =>
              identity.id === savedIdentityId && identity.is_active,
          );

        const nextIdentityId =
          savedIdentityId && savedIdentityIsValid
            ? savedIdentityId
            : "personal";

        setActiveIdentityId(nextIdentityId);
        window.localStorage.setItem(
          "shromobazar_active_identity",
          nextIdentityId,
        );
      }
    } catch (err) {
      const message = getErrorMessage(err);

      if (message === "Auth session missing!") {
        setError("");
        return;
      }

      console.error("Account load error:", message);
      setError(message || "Account information load করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  /* =========================================================
     SELECT GROUP
  ========================================================= */

  function chooseIdentityGroup(
    group: "professional" | "worker" | "business",
  ) {
    setIdentityGroup(group);
    setIdentityStep("category");
    setIdentityError("");

    if (group === "professional") {
      setIdentityType("professional");
    } else if (group === "worker") {
      setIdentityType("professional");
      setProfessionalProfession("Worker / শ্রমিক");
    } else {
      setIdentityType("business");
    }
  }

  function selectProfessionalCategory(category: string) {
    setSelectedProfession(category);
    setIdentityType("professional");

    const selected = PROFESSIONS.find((item) => item.type === category);

    if (selected) {
      setProfessionalProfession(
        `${selected.title} / ${selected.titleBn}`,
      );
    }

    setIdentityError("");
  }

  function selectBusinessCategory(category: string) {
    setBusinessCategory(category);

    if (category === "shop") {
      setIdentityType("shop");
    } else if (category === "institute") {
      setIdentityType("institute");
    } else {
      setIdentityType("business");
    }

    setIdentityError("");
  }

  function toggleWorkerSubcategory(value: string) {
    setSelectedWorkerSubcategories((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  }

  /* =========================================================
     ADD IDENTITY
  ========================================================= */

  async function handleAddIdentity() {
    setIdentityError("");
    setError("");

    if (!userId) {
      setIdentityError("আপনার account session পাওয়া যায়নি।");
      return;
    }

    const cleanName = displayName.trim();

    if (!cleanName) {
      setIdentityError(
        identityGroup === "worker"
          ? "আপনার নাম লিখুন।"
          : identityGroup === "business"
            ? "Business Name লিখুন।"
            : "আপনার নাম লিখুন।",
      );
      return;
    }

    const isWorker = identityGroup === "worker";
    const isProfessional = identityGroup === "professional";

    const isBusinessIdentity =
      identityGroup === "business" &&
      ["shop", "business", "institute"].includes(identityType);

    if (isWorker) {
      if (!selectedWorkerCategory) {
        setIdentityError("Worker-এর Main Category নির্বাচন করুন।");
        return;
      }

      if (selectedWorkerSubcategories.length === 0) {
        setIdentityError("কমপক্ষে একটি কাজের Sub-category নির্বাচন করুন।");
        return;
      }

      if (!workerLocation.trim()) {
        setIdentityError("আপনার কাজের Location লিখুন।");
        return;
      }
    }

    if (isProfessional && !selectedProfession) {
      setIdentityError("আপনার Profession নির্বাচন করুন।");
      return;
    }

    if (isBusinessIdentity) {
      if (!businessCategory) {
        setIdentityError("Shop, Office অথবা Institute নির্বাচন করুন।");
        return;
      }

      if (!businessType.trim()) {
        setIdentityError("Business Type নির্বাচন করুন।");
        return;
      }

      if (!identityMainCategory.trim()) {
        setIdentityError("Main Category দিন।");
        return;
      }

      if (!ownerAdminName.trim()) {
        setIdentityError("Owner / Admin Name দিন।");
        return;
      }

      if (!identityAddress.trim()) {
        setIdentityError("Address দিন।");
        return;
      }

      if (!contactNumber.trim()) {
        setIdentityError("Contact Number দিন।");
        return;
      }
    }

    const identityCategoryValue = isWorker
      ? "worker"
      : isProfessional
        ? selectedProfession
        : isBusinessIdentity
          ? identityMainCategory.trim()
          : null;

    const duplicate = identities.find((identity) => {
      if (isWorker) {
        return (
          identity.identity_type === "professional" &&
          identity.professional_profession === "Worker / শ্রমিক"
        );
      }

      return (
        identity.identity_type === identityType &&
        identity.display_name.trim().toLowerCase() ===
          cleanName.toLowerCase()
      );
    });

    if (duplicate && !isWorker) {
      setIdentityError("এই ধরনের একই নামের Identity ইতোমধ্যে আছে।");
      return;
    }

    setSavingIdentity(true);

    let createdIdentityId: string | null = null;

    try {
      const slug = slugify(cleanName);

      const workerCategoryDefinition = WORKER_CATEGORIES.find(
        (item) => item.value === selectedWorkerCategory,
      );

      const workerCategoryLabel =
        workerCategoryDefinition?.label ?? selectedWorkerCategory;

      const workerSkillsArray = isWorker
        ? [
            ...selectedWorkerSubcategories,
            ...workerSkills
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            `Skill Grade: ${workerSkillGrade} Star`,
            `Work Area: ${workerWorkArea}`,
            workerRemuneration.trim()
              ? `Expected Remuneration: ${workerRemuneration.trim()}`
              : "",
            workerCertificates.trim()
              ? `Certificate / License: ${workerCertificates.trim()}`
              : "",
          ].filter(Boolean)
        : [];

      const professionalSkillsValue = isWorker
        ? [
            `Worker Category: ${workerCategoryLabel}`,
            `Sub-categories: ${selectedWorkerSubcategories.join(", ")}`,
            `Skill Grade: ${workerSkillGrade} Star`,
            `Work Area: ${workerWorkArea}`,
            `Expected Remuneration: ${workerRemuneration.trim() || "Not specified"}`,
            `Certificate / License: ${workerCertificates.trim() || "Not specified"}`,
            `Skills: ${workerSkills.trim() || "Not specified"}`,
          ].join("\n")
        : professionalSkills.trim() || null;

      const payload = {
        user_id: userId,
        identity_type: identityType,
        display_name: cleanName,
        slug,

        bio: isWorker || isProfessional ? bio.trim() || null : null,

        business_type: isBusinessIdentity
          ? businessType.trim() || null
          : null,

        category: identityCategoryValue,

        owner_admin_name: isBusinessIdentity
          ? ownerAdminName.trim() || null
          : null,

        contact_number: isBusinessIdentity
          ? contactNumber.trim() || null
          : null,

        address: isBusinessIdentity
          ? identityAddress.trim() || null
          : null,

        professional_profession: isWorker
          ? "Worker / শ্রমিক"
          : isProfessional
            ? professionalProfession.trim() || null
            : null,

        professional_degree:
          isWorker || isProfessional
            ? professionalDegree.trim() || null
            : null,

        professional_organization:
          isWorker || isProfessional
            ? professionalOrganization.trim() || null
            : null,

        professional_chamber:
          isWorker || isProfessional
            ? professionalChamber.trim() || null
            : null,

        professional_address: isWorker
          ? workerLocation.trim()
          : isProfessional
            ? professionalAddress.trim() || null
            : null,

        professional_email:
          isWorker || isProfessional
            ? professionalEmail.trim() || null
            : null,

        professional_contact: isWorker
          ? professionalContact.trim() || null
          : isProfessional
            ? professionalContact.trim() || null
            : null,

        professional_experience: isWorker
          ? workerExperience.trim() || null
          : isProfessional
            ? professionalExperience.trim() || null
            : null,

        professional_skills:
          isWorker || isProfessional
            ? professionalSkillsValue
            : null,

        is_active: true,
        is_public: isPublic,
      };

      let savedIdentity: Identity | null = null;

      if (isWorker && duplicate) {
        const { data, error: updateIdentityError } = await supabase
          .from("identities")
          .update(payload)
          .eq("id", duplicate.id)
          .eq("user_id", userId)
          .select(
            "id, user_id, identity_type, display_name, slug, avatar_url, bio, business_type, category, owner_admin_name, contact_number, address, professional_profession, professional_degree, professional_organization, professional_chamber, professional_address, professional_email, professional_contact, professional_experience, professional_skills, is_active, is_public, created_at, updated_at",
          )
          .single();

        if (updateIdentityError) throw updateIdentityError;
        savedIdentity = data as Identity;
      } else {
        const { data, error: insertError } = await supabase
          .from("identities")
          .insert(payload)
          .select(
            "id, user_id, identity_type, display_name, slug, avatar_url, bio, business_type, category, owner_admin_name, contact_number, address, professional_profession, professional_degree, professional_organization, professional_chamber, professional_address, professional_email, professional_contact, professional_experience, professional_skills, is_active, is_public, created_at, updated_at",
          )
          .single();

        if (insertError) throw insertError;

        savedIdentity = data as Identity;
        createdIdentityId = savedIdentity.id;
      }

      /* -----------------------------------------------------
         WORKER DATABASE CONNECTION

         Existing confirmed columns only:
         id, profile_id, category, sub_category, experience,
         skills, district, location, rating, review_count,
         created_at, updated_at.
      ----------------------------------------------------- */

      if (isWorker) {
        const { data: existingProfile, error: profileCheckError } =
          await supabase
            .from("profiles")
            .select("id")
            .eq("id", userId)
            .maybeSingle();

        if (profileCheckError) {
          throw profileCheckError;
        }

        if (!existingProfile) {
          throw new Error(
            "আপনার Main Profile পাওয়া যায়নি। আগে Account Profile সম্পূর্ণ করুন।",
          );
        }

        const workerPayload = {
          id: userId,
          profile_id: userId,
          category: workerCategoryLabel,
          sub_category: selectedWorkerSubcategories.join(", "),
          experience: workerExperience.trim() || null,
          skills: workerSkillsArray,
          district: workerDistrict.trim() || null,
          location: workerLocation.trim(),
          rating: 0,
          review_count: 0,
          updated_at: new Date().toISOString(),
        };

        const { error: workerUpsertError } = await supabase
          .from("workers")
          .upsert(workerPayload, { onConflict: "id" });

        if (workerUpsertError) {
          if (createdIdentityId) {
            await supabase
              .from("identities")
              .delete()
              .eq("id", createdIdentityId)
              .eq("user_id", userId);
          }

          throw workerUpsertError;
        }
      }

      if (savedIdentity) {
        setIdentities((current) => {
          const exists = current.some(
            (item) => item.id === savedIdentity?.id,
          );

          if (exists) {
            return current.map((item) =>
              item.id === savedIdentity?.id ? savedIdentity! : item,
            );
          }

          return [...current, savedIdentity!];
        });

        if (savedIdentity.identity_type === "shop") {
          setActiveIdentityId(savedIdentity.id);

          window.localStorage.setItem(
            "shromobazar_active_identity",
            savedIdentity.id,
          );

          setSwitchMessage(
            `${savedIdentity.display_name} Shop Identity সক্রিয় হয়েছে।`,
          );

          window.dispatchEvent(
            new CustomEvent("shromobazar:identity-change", {
              detail: { identityId: savedIdentity.id },
            }),
          );
        }
      }

      setShowAddIdentity(false);
      resetIdentityFields();
    } catch (err) {
      const message = getErrorMessage(err);

      console.error("Identity create error:", message);

      setIdentityError(
        message || "Identity তৈরি করা যায়নি।",
      );
    } finally {
      setSavingIdentity(false);
    }
  }

  /* =========================================================
     DELETE IDENTITY
  ========================================================= */

  async function handleDeleteIdentity(id: string) {
    const confirmed = window.confirm("এই Identity মুছে ফেলতে চান?");
    if (!confirmed) return;

    setDeletingIdentity(id);
    setIdentityError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { error: deleteError } = await supabase
        .from("identities")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      setIdentities((current) =>
        current.filter((identity) => identity.id !== id),
      );

      if (activeIdentityId === id) {
        handleIdentitySwitch("personal");
      }
    } catch (err) {
      const message = getErrorMessage(err);
      console.error("Identity delete error:", message);
      setIdentityError(message || "Identity delete করা যায়নি।");
    } finally {
      setDeletingIdentity(null);
    }
  }

  /* =========================================================
     LOGOUT
  ========================================================= */

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
      window.location.href = "/login";
    } catch (err) {
      setError(getErrorMessage(err) || "Logout করা যায়নি।");
      setLoggingOut(false);
    }
  }

  /* =========================================================
     DISPLAY
  ========================================================= */

  const accountDisplayName =
    profile?.name?.trim() ||
    (email ? email.split("@")[0] : "Shromobazar Member");

  const initial = accountDisplayName.charAt(0).toUpperCase() || "S";

  const selectedWorkerDefinition = WORKER_CATEGORIES.find(
    (item) => item.value === selectedWorkerCategory,
  );

  const activeShop = identities.find(
    (identity) =>
      identity.id === activeIdentityId &&
      identity.identity_type === "shop" &&
      identity.is_active,
  );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fa] text-[#07152d]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-black text-slate-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
          </div>
        </header>
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="animate-pulse space-y-5">
            <div className="h-40 rounded-[1.75rem] bg-slate-200" />
            <div className="h-32 rounded-[1.5rem] bg-slate-200" />
            <div className="h-48 rounded-[1.5rem] bg-slate-200" />
          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     NOT LOGGED IN
  ========================================================= */

  if (!userId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#07152d] text-white">
            <CircleUserRound className="h-7 w-7" />
          </div>
          <h1 className="mt-5 text-xl font-black text-[#07152d]">
            Shromobazar Account
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Account দেখতে আগে Login করুন।
          </p>
          {error && (
            <div className="mt-5 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}
          <Link
            href="/login"
            className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#07152d] px-5 text-sm font-black text-white transition hover:bg-[#10284a]"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#07152d]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-black text-slate-600 transition hover:text-[#07152d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/status-feed"
              className="hidden items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-black text-slate-600 transition hover:border-[#07152d] hover:text-[#07152d] sm:flex"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Social Hub
            </Link>
            <Link
              href="/wallet"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-black text-slate-600 transition hover:border-[#07152d] hover:text-[#07152d]"
            >
              <Wallet className="h-3.5 w-3.5" />
              Wallet
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {/* PROFILE HERO */}

        <div className="overflow-hidden rounded-[1.75rem] bg-[#07152d] shadow-lg">
          <div className="relative h-24 bg-gradient-to-r from-[#07152d] via-[#10284a] to-[#1d3b66] sm:h-32">
            <div className="absolute inset-0 bg-white/5" />
          </div>

          <div className="relative flex justify-end px-4 pt-3 sm:px-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowIdentitySwitch((current) => !current)}
                aria-expanded={showIdentitySwitch}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 text-[10px] font-black text-white transition hover:bg-white/20"
              >
                <UserRound className="h-3.5 w-3.5" />
                {activeIdentityId === "personal"
                  ? "Personal"
                  : identities.find((identity) => identity.id === activeIdentityId)
                      ?.display_name ?? "Personal"}
                <ChevronRight
                  className={`h-3.5 w-3.5 transition ${
                    showIdentitySwitch ? "rotate-90" : ""
                  }`}
                />
              </button>

              {showIdentitySwitch && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-[#07152d] shadow-xl">
                  <p className="px-3 py-2 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Switch Identity
                  </p>

                  <button
                    type="button"
                    onClick={() => handleIdentitySwitch("personal")}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      activeIdentityId === "personal"
                        ? "bg-blue-50 text-blue-800"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <UserRound className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-xs font-bold">
                      Personal Account
                    </span>
                    {activeIdentityId === "personal" && (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                  </button>

                  {identities
                    .filter((identity) => identity.is_active)
                    .map((identity) => {
                      const title =
                        identity.identity_type === "shop"
                          ? "Shop"
                          : identity.identity_type === "business"
                            ? "Office"
                            : identity.identity_type === "institute"
                              ? "Institute"
                              : identity.identity_type === "professional"
                                ? identity.professional_profession || "Professional"
                                : identity.identity_type === "student"
                                  ? "Student"
                                  : identity.identity_type === "medical"
                                    ? "Medical / Health"
                                    : identity.identity_type === "player"
                                      ? "Player"
                                      : identity.display_name;

                      const Icon =
                        identity.identity_type === "shop"
                          ? Store
                          : identity.identity_type === "business"
                            ? Building2
                            : identity.identity_type === "institute"
                              ? GraduationCap
                              : identity.identity_type === "medical"
                                ? HeartPulse
                                : identity.identity_type === "player"
                                  ? Trophy
                                  : BriefcaseBusiness;

                      return (
                        <button
                          key={identity.id}
                          type="button"
                          onClick={() => handleIdentitySwitch(identity.id)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                            activeIdentityId === identity.id
                              ? "bg-blue-50 text-blue-800"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-bold">
                              {identity.display_name}
                            </span>
                            <span className="mt-0.5 block text-[9px] text-slate-400">
                              {title}
                            </span>
                          </span>
                          {activeIdentityId === identity.id && (
                            <ShieldCheck className="h-4 w-4 shrink-0" />
                          )}
                        </button>
                      );
                    })}

                  {identities.filter((identity) => identity.is_active).length ===
                    0 && (
                    <p className="px-3 py-3 text-[10px] leading-5 text-slate-400">
                      এখনো কোনো active additional identity নেই।
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {switchMessage && (
            <div className="px-5 pt-2 text-right text-[10px] font-semibold text-emerald-300 sm:px-7">
              {switchMessage}
            </div>
          )}

          <div className="relative px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#07152d] bg-white text-2xl font-black text-[#07152d] shadow-lg sm:h-28 sm:w-28">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={accountDisplayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>

                <div className="pb-1 text-white">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-300">
                    Shromobazar Account
                  </p>
                  <h1 className="mt-1 text-xl font-black sm:text-2xl">
                    {accountDisplayName}
                  </h1>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-300">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="break-all">
                      {email || "Email unavailable"}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/status-feed/create"
                className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-5 text-xs font-black text-[#07152d] transition hover:bg-slate-100"
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>

        {/* ACCOUNT ARCHITECTURE */}

        <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#07152d] text-white shadow-sm">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-slate-800">
                One Main Account • Multiple Identities
              </h2>
              <p className="mt-1 text-[10px] leading-5 text-slate-600 sm:text-xs">
                একটি Main Account থেকে Professional, Worker ও Business
                Identity পরিচালনা করুন। Worker-এর একাধিক দক্ষতা একই Worker
                Profile-এর মধ্যে সংরক্ষিত হবে।
              </p>
              <p className="mt-1 text-[10px] font-semibold leading-5 text-slate-500 sm:text-xs">
                Buyer বা Seller আলাদা Identity নয়। প্রয়োজন অনুযায়ী
                Professional, Shop, Office অথবা Institute ব্যবহার করুন।
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ACTIVE SHOP */}

        {activeShop && (
          <section className="mt-5 overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-emerald-950 to-emerald-700 p-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                SHROMOBAZAR SHOP
              </p>
              <h2 className="mt-2 text-xl font-black">
                {activeShop.display_name}
              </h2>
              <p className="mt-1 text-xs text-emerald-100">
                আপনার Shop Identity সক্রিয় আছে।
              </p>
              {activeShop.business_type && (
                <p className="mt-2 text-xs text-white/80">
                  Business Type: {activeShop.business_type}
                </p>
              )}
            </div>
            <div className="p-4">
              <Link
                href={`/open-your-shop/profile?identityId=${encodeURIComponent(
                  activeShop.id,
                )}`}
                className="block rounded-2xl bg-emerald-700 p-4 text-center text-sm font-black text-white transition hover:bg-emerald-800"
              >
                <Store className="mr-2 inline h-5 w-5" />
                Enter My Shop
              </Link>
            </div>
          </section>
        )}

        {/* ACCOUNT INFORMATION */}

        <section className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black">Account Information</h2>
              <p className="mt-1 text-[10px] text-slate-400">
                Your central Shromobazar account
              </p>
            </div>
            <CircleUserRound className="h-5 w-5 text-[#07152d]" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={UserRound}
              label="Name"
              value={accountDisplayName}
            />
            <InfoCard
              icon={Mail}
              label="Email"
              value={email || "Not available"}
            />
          </div>
        </section>

        {/* IDENTITIES */}

        <section className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#07152d]">
                Identity Spaces
              </p>
              <h2 className="mt-1 text-lg font-black text-[#07152d]">
                My Identities
              </h2>
              <p className="mt-1 max-w-2xl text-[10px] leading-5 text-slate-500 sm:text-xs">
                একই Main Account থেকে আপনার বিভিন্ন Professional, Worker
                ও Business Identity পরিচালনা করুন।
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                resetIdentityFields();
                setShowAddIdentity(true);
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#07152d] px-4 text-xs font-black text-white transition hover:bg-[#10284a]"
            >
              <Plus className="h-4 w-4" />
              Add Identity
            </button>
          </div>

          {identityError && !showAddIdentity && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
              {identityError}
            </div>
          )}

          {identities.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <CircleUserRound className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-black">
                এখনো কোনো additional identity নেই
              </h3>
              <p className="mx-auto mt-1 max-w-md text-[10px] leading-5 text-slate-500">
                Professional, Worker অথবা Business identity যোগ করে
                আপনার কাজ, পেশা বা business space পরিচালনা করুন।
              </p>
              <button
                type="button"
                onClick={() => {
                  resetIdentityFields();
                  setShowAddIdentity(true);
                }}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-[#07152d] px-4 text-xs font-black text-white transition hover:bg-[#10284a]"
              >
                <Plus className="h-4 w-4" />
                প্রথম Identity যোগ করুন
              </button>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {identities.map((identity) => (
                <IdentityCard
                  key={identity.id}
                  identity={identity}
                  onDelete={handleDeleteIdentity}
                  deleting={deletingIdentity}
                />
              ))}
            </div>
          )}
        </section>

        {/* QUICK ACCESS */}

        <section className="mt-5">
          <div className="mb-3">
            <h2 className="text-sm font-black">My Shromobazar</h2>
            <p className="mt-1 text-[10px] text-slate-400">
              আপনার প্রয়োজনীয় অংশগুলো দ্রুত খুলুন
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/status-feed",
                title: "Social Hub",
                subtitle: "Follow & Status Feed",
                icon: MessageCircle,
              },
              {
                href: "/marketplace",
                title: "Marketplace",
                subtitle: "Shop & Buy / Sell",
                icon: ShoppingBag,
              },
              {
                href: "/jobs",
                title: "Jobs",
                subtitle: "Work & Hiring",
                icon: BriefcaseBusiness,
              },
              {
                href: "/health",
                title: "Health",
                subtitle: "Medical & Health Space",
                icon: Stethoscope,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#07152d] hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#07152d]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-black">{item.title}</h3>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {item.subtitle}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#07152d]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECURITY */}

        <section className="mt-5 rounded-[1.5rem] border border-white/10 bg-black p-4 text-white shadow-lg sm:p-5">
          <details className="group overflow-hidden rounded-2xl">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-white/[0.04] [&::-webkit-details-marker]:hidden">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">
                    Account Security
                  </h2>
                  <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                    Account protection & privacy
                  </p>
                </div>
              </div>
              <ChevronDown className="h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
            </summary>

            <div className="border-t border-white/10 p-3 sm:p-4">
              <div className="rounded-xl border border-emerald-400/15 bg-zinc-950 p-3 sm:p-4">
                <div className="flex items-start gap-3">
                  <LockKeyhole className="mt-1 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <h3 className="text-xs font-bold text-emerald-300 sm:text-sm">
                      Private Data Protection
                    </h3>
                    <p className="mt-2 text-[11px] leading-6 text-gray-300 sm:text-xs">
                      Identity তৈরি করা এবং Follow করা কোনো private
                      medical, education বা অন্য sensitive data access
                      দেয় না। Private access আলাদা permission system-এর
                      মাধ্যমে পরিচালিত হবে।
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="mb-3 text-center text-[10px] text-gray-500 sm:text-xs">
                  Account ব্যবহার শেষ হলে নিরাপদে Logout করুন।
                </p>
                <div className="flex justify-center pb-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex h-10 w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 text-xs font-black text-red-400 transition hover:border-red-500/50 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            </div>
          </details>
        </section>

        {/* =====================================================
            ADD IDENTITY MODAL
        ===================================================== */}

        {showAddIdentity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07152d]/60 p-3 backdrop-blur-sm sm:p-5">
            <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl">
              {/* HEADER */}

              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#07152d]">
                    Shromobazar Identity
                  </p>
                  <h2 className="mt-1 text-base font-black text-[#07152d] sm:text-lg">
                    Add New Identity
                  </h2>
                  <p className="mt-1 text-[10px] leading-5 text-slate-500">
                    আপনার Main Account-এর অধীনে নতুন পরিচয় তৈরি করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetIdentityModal}
                  disabled={savingIdentity}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-[#07152d] disabled:opacity-40"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* STEP INDICATOR */}

              <div className="shrink-0 border-b border-slate-100 bg-slate-50 px-5 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black ${
                      identityStep === "type"
                        ? "bg-[#07152d] text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {identityStep === "type" ? "1" : "✓"}
                  </div>
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      identityStep === "category"
                        ? "bg-[#07152d]"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black ${
                      identityStep === "category"
                        ? "bg-[#07152d] text-white"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    2
                  </div>
                  <div className="ml-2">
                    <p className="text-[9px] font-black text-[#07152d]">
                      {identityStep === "type"
                        ? "Choose Identity Type"
                        : "Complete Identity"}
                    </p>
                  </div>
                </div>
              </div>

              {/* BODY */}

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                {/* STEP 1 */}

                {identityStep === "type" && (
                  <div>
                    <div className="mb-5">
                      <h3 className="text-sm font-black text-[#07152d]">
                        আপনি কোন ধরনের পরিচয় তৈরি করতে চান?
                      </h3>
                      <p className="mt-1 text-[10px] leading-5 text-slate-500">
                        Professional, Worker অথবা Business নির্বাচন করুন।
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => chooseIdentityGroup("professional")}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#07152d] hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#07152d] text-white">
                            <BriefcaseBusiness className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black text-[#07152d]">
                              Professional
                            </h4>
                            <p className="mt-1 text-[10px] leading-5 text-slate-500">
                              Engineer, Doctor, Lawyer, Teacher, Actor,
                              Architect, IT Professional, Designer,
                              Accountant, Consultant এবং আরও অনেক পেশা।
                            </p>
                            <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-[#07152d]">
                              Continue
                              <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => chooseIdentityGroup("worker")}
                        className="group rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 text-left transition hover:-translate-y-0.5 hover:border-emerald-600 hover:shadow-md"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                            <Wrench className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black text-emerald-900">
                              Worker / শ্রমিক
                            </h4>
                            <p className="mt-1 text-[10px] leading-5 text-slate-600">
                              রাজমিস্ত্রি, ইলেকট্রিশিয়ান, প্লাম্বার,
                              ড্রাইভার, টেকনিশিয়ান, কারিগরসহ দক্ষ ও
                              সাধারণ কর্মীদের জন্য।
                            </p>
                            <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-emerald-800">
                              Continue
                              <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => chooseIdentityGroup("business")}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#07152d] hover:shadow-md sm:col-span-2"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#07152d] text-white">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-black text-[#07152d]">
                              Business
                            </h4>
                            <p className="mt-1 text-[10px] leading-5 text-slate-500">
                              Shop, Office অথবা Institute-এর আলাদা
                              Public Identity তৈরি করুন।
                            </p>
                            <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-[#07152d]">
                              Continue
                              <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}

                {identityStep === "category" && (
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentityStep("type");
                        setIdentityError("");
                      }}
                      disabled={savingIdentity}
                      className="mb-5 inline-flex items-center gap-1.5 text-[10px] font-black text-slate-500 transition hover:text-[#07152d]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Back
                    </button>

                    {/* PROFESSIONAL CATEGORY */}

                    {identityGroup === "professional" && (
                      <div>
                        <div className="mb-4">
                          <h3 className="text-sm font-black text-[#07152d]">
                            Professional Category / পেশা নির্বাচন
                          </h3>
                          <p className="mt-1 text-[10px] leading-5 text-slate-500">
                            আপনার মূল পেশাটি নির্বাচন করুন। পরবর্তী ধাপে
                            নির্দিষ্ট Sub-category বেছে নিতে পারবেন।
                          </p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2">
                          {PROFESSIONS.map((item) => {
                            const Icon = item.icon;
                            const selected = selectedProfession === item.type;

                            return (
                              <button
                                key={item.type}
                                type="button"
                                onClick={() => selectProfessionalCategory(item.type)}
                                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                                  selected
                                    ? "border-[#07152d] bg-[#07152d] text-white shadow-sm"
                                    : "border-slate-200 bg-white text-[#07152d] hover:border-slate-400"
                                }`}
                              >
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                    selected ? "bg-white/10" : "bg-slate-100"
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-xs font-black">
                                    {item.title}
                                  </span>
                                  <span
                                    className={`mt-0.5 block text-[10px] ${
                                      selected ? "text-slate-300" : "text-slate-500"
                                    }`}
                                  >
                                    {item.titleBn}
                                  </span>
                                </span>
                                {selected && <ShieldCheck className="h-4 w-4" />}
                              </button>
                            );
                          })}
                        </div>

                        {selectedProfession && (
                          <div className="mt-5 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <h4 className="text-xs font-black text-[#07152d]">
                              {PROFESSIONS.find(
                                (item) => item.type === selectedProfession,
                              )?.title}{" "}
                              — Sub-category
                            </h4>
                            <SelectField
                              label="আপনার বিশেষায়িত পেশা"
                              value={professionalDegree}
                              onChange={setProfessionalDegree}
                              options={
                                PROFESSIONS.find(
                                  (item) => item.type === selectedProfession,
                                )?.subcategories.map((item) => ({
                                  value: item,
                                  label: item,
                                })) ?? []
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* WORKER CATEGORY */}

                    {identityGroup === "worker" && (
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-sm font-black text-[#07152d]">
                            Worker Category / কাজের ধরন
                          </h3>
                          <p className="mt-1 text-[10px] leading-5 text-slate-500">
                            আপনার প্রধান কাজের বিভাগ নির্বাচন করুন।
                            এরপর একাধিক দক্ষতা যোগ করতে পারবেন।
                          </p>
                        </div>

                        <SelectField
                          label="Main Worker Category"
                          value={selectedWorkerCategory}
                          onChange={(value) => {
                            setSelectedWorkerCategory(value);
                            setSelectedWorkerSubcategories([]);
                          }}
                          options={WORKER_CATEGORIES.map((item) => ({
                            value: item.value,
                            label: item.label,
                          }))}
                        />

                        {selectedWorkerDefinition && (
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <h4 className="mb-3 text-xs font-black text-[#07152d]">
                              Sub-category / আপনার কাজের দক্ষতা
                            </h4>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {selectedWorkerDefinition.subcategories.map(
                                (item) => {
                                  const checked =
                                    selectedWorkerSubcategories.includes(item);

                                  return (
                                    <label
                                      key={item}
                                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition ${
                                        checked
                                          ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                                          : "border-slate-200 bg-white text-slate-700"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                          toggleWorkerSubcategory(item)
                                        }
                                        className="h-4 w-4 accent-emerald-700"
                                      />
                                      <span>{item}</span>
                                    </label>
                                  );
                                },
                              )}
                            </div>
                            <p className="mt-3 text-[10px] text-slate-500">
                              একাধিক কাজ নির্বাচন করতে পারবেন।
                            </p>
                          </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label="আপনার নাম"
                            value={displayName}
                            onChange={setDisplayName}
                            placeholder="পূর্ণ নাম"
                            required
                          />
                          <Field
                            label="জেলা"
                            value={workerDistrict}
                            onChange={setWorkerDistrict}
                            placeholder="যেমন: ঢাকা"
                          />
                        </div>

                        <Field
                          label="বর্তমান কাজের Location"
                          value={workerLocation}
                          onChange={setWorkerLocation}
                          placeholder="যেমন: মিরপুর, ঢাকা"
                          required
                        />

                        <div>
                          <label className="mb-2 block text-xs font-black text-slate-700">
                            কোথায় কাজ করতে চান?
                          </label>
                          <div className="grid gap-2 sm:grid-cols-3">
                            {[
                              {
                                value: "bangladesh",
                                label: "বাংলাদেশে",
                                description: "দেশের ভিতরে",
                              },
                              {
                                value: "overseas",
                                label: "বিদেশে",
                                description: "বিদেশে কাজ",
                              },
                              {
                                value: "both",
                                label: "উভয় জায়গায়",
                                description: "দেশি ও বিদেশি",
                              },
                            ].map((item) => (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() =>
                                  setWorkerWorkArea(
                                    item.value as WorkerWorkArea,
                                  )
                                }
                                className={`rounded-xl border p-3 text-left transition ${
                                  workerWorkArea === item.value
                                    ? "border-emerald-700 bg-emerald-50"
                                    : "border-slate-200 bg-white"
                                }`}
                              >
                                <span className="block text-xs font-black">
                                  {item.label}
                                </span>
                                <span className="mt-1 block text-[10px] text-slate-500">
                                  {item.description}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            <h4 className="text-xs font-black text-amber-950">
                              Worker Skill Grade
                            </h4>
                          </div>
                          <p className="mt-1 text-[10px] leading-5 text-amber-800">
                            আপনার নিজের দক্ষতার বর্তমান স্তর নির্বাচন করুন।
                            পরবর্তীতে যাচাইয়ের মাধ্যমে Grade পরিবর্তন হতে পারে।
                          </p>

                          <div className="mt-4 grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5].map((grade) => (
                              <button
                                key={grade}
                                type="button"
                                onClick={() =>
                                  setWorkerSkillGrade(String(grade))
                                }
                                className={`rounded-xl border p-2 text-center transition ${
                                  workerSkillGrade === String(grade)
                                    ? "border-amber-600 bg-amber-500 text-white"
                                    : "border-amber-200 bg-white text-amber-900"
                                }`}
                              >
                                <Star className="mx-auto h-4 w-4" />
                                <span className="mt-1 block text-xs font-black">
                                  {grade}
                                </span>
                                <span className="block text-[8px] font-bold">
                                  Star
                                </span>
                              </button>
                            ))}
                          </div>
                          <p className="mt-3 text-[10px] font-semibold text-amber-900">
                            নির্বাচিত Grade: {workerSkillGrade} Star
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <Field
                            label="অভিজ্ঞতা"
                            value={workerExperience}
                            onChange={setWorkerExperience}
                            placeholder="যেমন: ৫ বছর"
                          />
                          <Field
                            label="প্রত্যাশিত পারিশ্রমিক"
                            value={workerRemuneration}
                            onChange={setWorkerRemuneration}
                            placeholder="যেমন: দৈনিক ৳৮০০ / মাসিক ৳২৫,০০০"
                          />
                        </div>

                        <TextAreaField
                          label="অতিরিক্ত দক্ষতা"
                          value={workerSkills}
                          onChange={setWorkerSkills}
                          placeholder="কমা দিয়ে দক্ষতাগুলো লিখুন। যেমন: Finishing, Measurement, Site Work"
                        />

                        <TextAreaField
                          label="Certificate / License"
                          value={workerCertificates}
                          onChange={setWorkerCertificates}
                          placeholder="কোনো প্রশিক্ষণ, সার্টিফিকেট বা লাইসেন্স থাকলে লিখুন"
                        />

                        <TextAreaField
                          label="নিজের সম্পর্কে"
                          value={bio}
                          onChange={setBio}
                          placeholder="আপনার কাজের অভিজ্ঞতা ও পেশাগত পরিচয় লিখুন"
                        />

                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-[10px] leading-5 text-blue-800">
                          <strong>মনে রাখবেন:</strong> Skill Grade এবং
                          পারিশ্রমিক আপনার দেওয়া তথ্য হিসেবে সংরক্ষিত হবে।
                          এগুলো যাচাই করা Rating নয়। ভবিষ্যতে Shromobazar
                          যাচাই ও কাজের Feedback অনুযায়ী Skill Grading
                          উন্নত করা যাবে।
                        </div>
                      </div>
                    )}

                    {/* BUSINESS CATEGORY */}

                    {identityGroup === "business" && (
                      <div>
                        <div className="mb-4">
                          <h3 className="text-sm font-black text-[#07152d]">
                            Business Category
                          </h3>
                          <p className="mt-1 text-[10px] leading-5 text-slate-500">
                            কোন ধরনের Business Identity তৈরি করবেন?
                          </p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-3">
                          {BUSINESS_IDENTITY_DEFINITIONS.map((item) => {
                            const Icon = item.icon;
                            const selected = businessCategory === item.type;

                            return (
                              <button
                                key={item.type}
                                type="button"
                                onClick={() => selectBusinessCategory(item.type)}
                                className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                                  selected
                                    ? "border-[#07152d] bg-[#07152d] text-white shadow-sm"
                                    : "border-slate-200 bg-white text-[#07152d] hover:border-slate-400"
                                }`}
                              >
                                <div
                                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                    selected ? "bg-white/10" : "bg-slate-100"
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <span className="mt-2 text-xs font-black">
                                  {item.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {businessCategory && (
                          <div className="mt-5 space-y-4">
                            <Field
                              label={
                                businessCategory === "shop"
                                  ? "Shop Name"
                                  : businessCategory === "office"
                                    ? "Office Name"
                                    : "Institute Name"
                              }
                              value={displayName}
                              onChange={setDisplayName}
                              placeholder="প্রতিষ্ঠানের নাম লিখুন"
                              required
                            />

                            <SelectField
                              label={
                                businessCategory === "shop"
                                  ? "Shop Type"
                                  : businessCategory === "office"
                                    ? "Office Type"
                                    : "Institute Type"
                              }
                              value={businessType}
                              onChange={setBusinessType}
                              options={
                                businessCategory === "shop"
                                  ? SHOP_BUSINESS_TYPES
                                  : [
                                      {
                                        value: "private",
                                        label: "Private",
                                      },
                                      {
                                        value: "public",
                                        label: "Public",
                                      },
                                      {
                                        value: "other",
                                        label: "Other",
                                      },
                                    ]
                              }
                            />

                            <Field
                              label="Main Category"
                              value={identityMainCategory}
                              onChange={setIdentityMainCategory}
                              placeholder="যেমন: Electronics / Law / Training"
                              required
                            />

                            <Field
                              label="Owner / Admin Name"
                              value={ownerAdminName}
                              onChange={setOwnerAdminName}
                              placeholder="Owner / Admin-এর নাম"
                              required
                            />

                            <Field
                              label="Address"
                              value={identityAddress}
                              onChange={setIdentityAddress}
                              placeholder="প্রতিষ্ঠানের ঠিকানা"
                              required
                            />

                            <Field
                              label="Contact Number"
                              value={contactNumber}
                              onChange={setContactNumber}
                              placeholder="01XXXXXXXXX"
                              type="tel"
                              required
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* PROFESSIONAL FORM */}

                    {identityGroup === "professional" &&
                      selectedProfession && (
                        <div className="mt-5 space-y-4">
                          <div className="rounded-xl bg-blue-50 p-3 text-xs font-bold text-blue-900">
                            নির্বাচিত পেশা:{" "}
                            {
                              PROFESSIONS.find(
                                (item) => item.type === selectedProfession,
                              )?.title
                            }
                          </div>

                          <Field
                            label="আপনার নাম"
                            value={displayName}
                            onChange={setDisplayName}
                            placeholder="আপনার পূর্ণ নাম"
                            required
                          />

                          <Field
                            label="পদবি / Designation"
                            value={professionalDegree}
                            onChange={setProfessionalDegree}
                            placeholder="যেমন: Senior Engineer / Consultant"
                          />

                          <Field
                            label="প্রতিষ্ঠান / Organization"
                            value={professionalOrganization}
                            onChange={setProfessionalOrganization}
                            placeholder="প্রতিষ্ঠানের নাম"
                          />

                          <Field
                            label="Chamber / Workplace"
                            value={professionalChamber}
                            onChange={setProfessionalChamber}
                            placeholder="চেম্বার / কর্মস্থল"
                          />

                          <TextAreaField
                            label="ঠিকানা"
                            value={professionalAddress}
                            onChange={setProfessionalAddress}
                            placeholder="আপনার পেশাগত ঠিকানা"
                          />

                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                              label="ফোন নম্বর"
                              value={professionalContact}
                              onChange={setProfessionalContact}
                              placeholder="ফোন নম্বর"
                              type="tel"
                            />
                            <Field
                              label="ইমেইল"
                              value={professionalEmail}
                              onChange={setProfessionalEmail}
                              placeholder="ইমেইল ঠিকানা"
                              type="email"
                            />
                          </div>

                          <Field
                            label="Experience / অভিজ্ঞতা"
                            value={professionalExperience}
                            onChange={setProfessionalExperience}
                            placeholder="যেমন: ৫ বছর"
                          />

                          <TextAreaField
                            label="Skills / দক্ষতা"
                            value={professionalSkills}
                            onChange={setProfessionalSkills}
                            placeholder="আপনার পেশাগত দক্ষতাগুলো লিখুন"
                          />

                          <TextAreaField
                            label="Professional Bio"
                            value={bio}
                            onChange={setBio}
                            placeholder="নিজের পেশাগত পরিচয় সম্পর্কে সংক্ষেপে লিখুন"
                            rows={4}
                          />
                        </div>
                      )}

                    {/* PUBLIC OPTION */}

                    {(identityGroup === "professional" ||
                      identityGroup === "worker" ||
                      (identityGroup === "business" && businessCategory)) && (
                      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <input
                          type="checkbox"
                          checked={isPublic}
                          onChange={(event) => setIsPublic(event.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-[#07152d]"
                        />
                        <span>
                          <span className="block text-xs font-black text-slate-800">
                            Public Identity
                          </span>
                          <span className="mt-1 block text-[10px] leading-5 text-slate-500">
                            অন্যরা আপনার এই পরিচয় দেখতে পারবে।
                          </span>
                        </span>
                      </label>
                    )}

                    {/* ERROR */}

                    {identityError && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold leading-5 text-red-700">
                        {identityError}
                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={resetIdentityModal}
                        disabled={savingIdentity}
                        className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleAddIdentity}
                        disabled={
                          savingIdentity ||
                          (identityGroup === "professional" &&
                            !selectedProfession) ||
                          (identityGroup === "worker" &&
                            !selectedWorkerCategory) ||
                          (identityGroup === "business" &&
                            !businessCategory)
                        }
                        className="h-11 flex-1 rounded-xl bg-[#07152d] text-xs font-black text-white transition hover:bg-[#10284a] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {savingIdentity
                          ? "Saving..."
                          : identityGroup === "worker"
                            ? "Register Worker"
                            : "Create Identity"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}