"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
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

/* =========================================================
   IDENTITY DEFINITIONS
========================================================= */

const PROFESSIONAL_IDENTITY_DEFINITIONS = [
  { type: "lawyer", title: "Lawyer", icon: Scale },
  { type: "doctor", title: "Doctor", icon: Stethoscope },
  { type: "engineer", title: "Engineer", icon: Wrench },
  { type: "teacher", title: "Teacher", icon: GraduationCap },
  { type: "worker", title: "Worker", icon: BriefcaseBusiness },
  { type: "player", title: "Player", icon: Trophy },
  { type: "driver", title: "Driver", icon: Car },
  { type: "technician", title: "Technician", icon: Wrench },
  { type: "student", title: "Student", icon: GraduationCap },
  { type: "creator", title: "Creator", icon: Lightbulb },
  {
    type: "other_professional",
    title: "Other Professional",
    icon: UserRound,
  },
];

const SHOP_BUSINESS_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "wholesale", label: "Wholesale" },
  {
    value: "retail_wholesale",
    label: "Retail + Wholesale",
  },
  {
    value: "footpath",
    label: "Footpath / Street Market",
  },
];

const BUSINESS_IDENTITY_DEFINITIONS = [
  { type: "shop", title: "Shop", icon: Store },
  { type: "office", title: "Office", icon: Building2 },
  {
    type: "institute",
    title: "Institute",
    icon: GraduationCap,
  },
];

/* =========================================================
   OLD IDENTITY DEFINITIONS
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
    description: "আপনার পেশা ও কাজের পরিচয়",
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
    title: "Business / Office",
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

  if (typeof error === "string") {
    return error;
  }

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
  const definition =
    IDENTITY_DEFINITIONS.find(
      (item) => item.type === identity.identity_type,
    ) ??
    IDENTITY_DEFINITIONS[
      IDENTITY_DEFINITIONS.length - 1
    ];

  const Icon = definition.icon;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#07152d] text-white">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#07152d]">
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
              {identity.category}
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

          <div className="mt-3 flex items-center gap-2">
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
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function MyAccountPage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [identities, setIdentities] =
    useState<Identity[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingIdentity, setSavingIdentity] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [deletingIdentity, setDeletingIdentity] =
    useState<string | null>(null);

  const [showAddIdentity, setShowAddIdentity] =
    useState(false);

  const [identityType, setIdentityType] =
    useState<IdentityType>("professional");

  const [identityCategory, setIdentityCategory] =
    useState("");

  const [identityStep, setIdentityStep] =
    useState<"type" | "category">("type");

  const [displayName, setDisplayName] =
    useState("");

  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [businessType, setBusinessType] =
    useState("");

  const [identityMainCategory, setIdentityMainCategory] =
    useState("");

  const [ownerAdminName, setOwnerAdminName] =
    useState("");

  const [contactNumber, setContactNumber] =
    useState("");

  const [identityAddress, setIdentityAddress] =
    useState("");

  const [professionalProfession, setProfessionalProfession] =
    useState("");

  const [professionalDegree, setProfessionalDegree] =
    useState("");

  const [
    professionalOrganization,
    setProfessionalOrganization,
  ] = useState("");

  const [professionalChamber, setProfessionalChamber] =
    useState("");

  const [professionalAddress, setProfessionalAddress] =
    useState("");

  const [professionalEmail, setProfessionalEmail] =
    useState("");

  const [professionalContact, setProfessionalContact] =
    useState("");

  const [
    professionalExperience,
    setProfessionalExperience,
  ] = useState("");

  const [professionalSkills, setProfessionalSkills] =
    useState("");

  const [error, setError] = useState("");
  const [identityError, setIdentityError] =
    useState("");

  /* =========================================================
     RESET IDENTITY MODAL
  ========================================================= */

  const resetIdentityFields = useCallback(() => {
    setIdentityStep("type");
    setIdentityCategory("");
    setIdentityType("professional");

    setDisplayName("");
    setBio("");
    setIsPublic(true);

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
    
    setIdentityError("");
  }, []);

  function resetIdentityModal() {
    if (savingIdentity) return;

    setShowAddIdentity(false);
    resetIdentityFields();
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

      if (authError) {
        throw authError;
      }

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


      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      setProfile(profileData);



      const {
        data: identityData,
        error: identitiesLoadError,
      } = await supabase
        .from("identities")
        .select(
          "id, user_id, identity_type, display_name, slug, avatar_url, bio, business_type, category, owner_admin_name, contact_number, address, professional_profession, professional_degree, professional_organization, professional_chamber, professional_address, professional_email, professional_contact, professional_experience, professional_skills, is_active, is_public, created_at, updated_at",
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: true,
        });

      if (identitiesLoadError) {
        console.error(
          "Identity load error:",
          getErrorMessage(identitiesLoadError),
        );

        setIdentities([]);

        setIdentityError(
          "Identity list এখন load করা যাচ্ছে না। Account অংশ ঠিকভাবে কাজ করছে।",
        );
      } else {
        setIdentities(
          (identityData ?? []) as Identity[],
        );
      }
    } catch (err) {
      const message = getErrorMessage(err);

      if (message === "Auth session missing!") {
        setError("");
        return;
      }

      console.error(
        "Account load error:",
        message,
      );

      setError(
        message ||
          "Account information load করা যায়নি।",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  /* =========================================================
     SELECT CATEGORY
  ========================================================= */

  function selectProfessionalCategory(
    category: string,
  ) {
    setIdentityCategory(category);
    setIdentityType("professional");
    setIdentityError("");

    const selected =
      PROFESSIONAL_IDENTITY_DEFINITIONS.find(
        (item) => item.type === category,
      );

    if (selected) {
      setProfessionalProfession(selected.title);
    }
  }

  function selectBusinessCategory(
    category: string,
  ) {
    setIdentityCategory(category);

    if (category === "shop") {
      setIdentityType("shop");
    } else if (category === "institute") {
      setIdentityType("institute");
    } else {
      setIdentityType("business");
    }

    setIdentityError("");
  }

  /* =========================================================
     ADD IDENTITY
  ========================================================= */

  async function handleAddIdentity() {
    setIdentityError("");
    setError("");

    if (!userId) {
      setIdentityError(
        "আপনার account session পাওয়া যায়নি।",
      );
      return;
    }

    const cleanName = displayName.trim();

    if (!identityCategory) {
      setIdentityError(
        "একটি Identity category নির্বাচন করুন।",
      );
      return;
    }

    if (!cleanName) {
      setIdentityError(
        identityType === "shop"
          ? "Shop Name দিন।"
          : identityType === "business"
            ? "Office Name দিন।"
            : identityType === "institute"
              ? "Institute Name দিন।"
              : "Professional Name দিন।",
      );
      return;
    }

    const isBusinessIdentity =
      identityType === "shop" ||
      identityType === "business" ||
      identityType === "institute";

    if (
      identityType === "professional" &&
      !professionalProfession.trim()
    ) {
      setIdentityError("Profession দিন।");
      return;
    }

    if (
      isBusinessIdentity &&
      !businessType.trim()
    ) {
      setIdentityError(
        identityType === "shop"
          ? "Business Type নির্বাচন করুন।"
          : identityType === "business"
            ? "Office Type দিন।"
            : "Institute Type দিন.",
      );
      return;
    }

    if (
      isBusinessIdentity &&
      !identityMainCategory.trim()
    ) {
      setIdentityError("Main Category দিন।");
      return;
    }

    if (
      isBusinessIdentity &&
      !ownerAdminName.trim()
    ) {
      setIdentityError(
        "Owner / Admin Name দিন।",
      );
      return;
    }

    if (
      isBusinessIdentity &&
      !identityAddress.trim()
    ) {
      setIdentityError(
        identityType === "shop"
          ? "Shop Address দিন।"
          : identityType === "business"
            ? "Office Address দিন।"
            : "Institute Address দিন।",
      );
      return;
    }

    if (
      isBusinessIdentity &&
      !contactNumber.trim()
    ) {
      setIdentityError(
        identityType === "shop"
          ? "Shop Contact Number দিন।"
          : identityType === "business"
            ? "Office Contact Number দিন।"
            : "Institute Contact Number দিন।",
      );
      return;
    }

    const existing = identities.find(
      (identity) =>
        identity.identity_type === identityType &&
        identity.display_name
          .trim()
          .toLowerCase() ===
          cleanName.toLowerCase(),
    );

    if (existing) {
      setIdentityError(
        "এই ধরনের একই নামের Identity ইতোমধ্যে আছে।",
      );
      return;
    }

    setSavingIdentity(true);

    try {
      const slugBase = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 70);

      const slug =
        slugBase ||
        `${identityType}-${crypto
          .randomUUID()
          .slice(0, 8)}`;

      const payload = {
        user_id: userId,
        identity_type: identityType,
        display_name: cleanName,
        slug,

        bio:
          identityType === "professional"
            ? bio.trim() || null
            : null,

        business_type:
          isBusinessIdentity
            ? businessType.trim() || null
            : null,

        category: isBusinessIdentity
          ? identityMainCategory.trim() || null
          : identityCategory || null,

        owner_admin_name:
          isBusinessIdentity
            ? ownerAdminName.trim() || null
            : null,

        contact_number:
          isBusinessIdentity
            ? contactNumber.trim() || null
            : null,

        address:
          isBusinessIdentity
            ? identityAddress.trim() || null
            : null,

        professional_profession:
          identityType === "professional"
            ? professionalProfession.trim() || null
            : null,

        professional_degree:
          identityType === "professional"
            ? professionalDegree.trim() || null
            : null,

        professional_organization:
          identityType === "professional"
            ? professionalOrganization.trim() || null
            : null,

        professional_chamber:
          identityType === "professional"
            ? professionalChamber.trim() || null
            : null,

        professional_address:
          identityType === "professional"
            ? professionalAddress.trim() || null
            : null,

        professional_email:
          identityType === "professional"
            ? professionalEmail.trim() || null
            : null,

        professional_contact:
          identityType === "professional"
            ? professionalContact.trim() || null
            : null,

        professional_experience:
          identityType === "professional"
            ? professionalExperience.trim() || null
            : null,

        professional_skills:
          identityType === "professional"
            ? professionalSkills.trim() || null
            : null,

        is_active: true,
        is_public: isPublic,
      };

      const {
        data,
        error: insertError,
      } = await supabase
        .from("identities")
        .insert(payload)
        .select(
          "id, user_id, identity_type, display_name, slug, avatar_url, bio, business_type, category, owner_admin_name, contact_number, address, professional_profession, professional_degree, professional_organization, professional_chamber, professional_address, professional_email, professional_contact, professional_experience, professional_skills, is_active, is_public, created_at, updated_at",
        )
        .single();

      if (insertError) {
        throw insertError;
      }

      if (data) {
        setIdentities((current) => [
          ...current,
          data as Identity,
        ]);
      }


      setShowAddIdentity(false);
      resetIdentityFields();
    } catch (err) {
      const message = getErrorMessage(err);

      console.error(
        "Identity create error:",
        message,
      );

      setIdentityError(
        message ||
          "Identity তৈরি করা যায়নি।",
      );
    } finally {
      setSavingIdentity(false);
    }
  }

  /* =========================================================
     DELETE IDENTITY
  ========================================================= */

  async function handleDeleteIdentity(
    id: string,
  ) {
    const confirmed = window.confirm(
      "এই Identity মুছে ফেলতে চান?",
    );

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

      const {
        error: deleteError,
      } = await supabase
        .from("identities")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      setIdentities((current) =>
        current.filter(
          (identity) => identity.id !== id,
        ),
      );
    } catch (err) {
      const message = getErrorMessage(err);

      console.error(
        "Identity delete error:",
        message,
      );

      setIdentityError(
        message ||
          "Identity delete করা যায়নি।",
      );
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
      const {
        error: logoutError,
      } = await supabase.auth.signOut();

      if (logoutError) {
        throw logoutError;
      }

      window.location.href = "/login";
    } catch (err) {
      setError(
        getErrorMessage(err) ||
          "Logout করা যায়নি।",
      );

      setLoggingOut(false);
    }
  }

  /* =========================================================
     DISPLAY
  ========================================================= */

  const accountDisplayName =
    profile?.name?.trim() ||
    (email
      ? email.split("@")[0]
      : "Shromobazar Member");

  const initial =
    accountDisplayName.charAt(0).toUpperCase() ||
    "S";

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

        {/* ARCHITECTURE NOTICE */}

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
                একটি Main Account-এর মধ্যে একাধিক Professional
                এবং Business Identity রাখা যাবে। Personal account
                আলাদা identity নয়।
              </p>

              <p className="mt-1 text-[10px] font-semibold leading-5 text-slate-500 sm:text-xs">
                Buyer বা Seller আলাদা identity নয়। প্রয়োজন অনুযায়ী
                Professional, Shop, Office বা Institute-এর মাধ্যমে
                কাজ করা যাবে।
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ACCOUNT INFORMATION */}

        <section className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black">
                Account Information
              </h2>

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
                একই Main Account থেকে আপনার বিভিন্ন Professional
                ও Business identity পরিচালনা করুন।
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
                Professional অথবা Business identity যোগ করে
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
            <h2 className="text-sm font-black">
              My Shromobazar
            </h2>

            <p className="mt-1 text-[10px] text-slate-400">
              আপনার প্রয়োজনীয় অংশগুলো দ্রুত খুলুন
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/status-feed"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#07152d] hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#07152d]">
                  <MessageCircle className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-black">
                    Social Hub
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Follow & Status Feed
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#07152d]" />
              </div>
            </Link>

            <Link
              href="/marketplace"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#07152d] hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#07152d]">
                  <ShoppingBag className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-black">
                    Marketplace
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Shop & Buy / Sell
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#07152d]" />
              </div>
            </Link>

            <Link
              href="/jobs"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#07152d] hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#07152d]">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-black">
                    Jobs
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Work & Hiring
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#07152d]" />
              </div>
            </Link>

            <Link
              href="/health"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#07152d] hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#07152d]">
                  <Stethoscope className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-black">
                    Health
                  </h3>

                  <p className="mt-1 text-[10px] text-slate-400">
                    Medical & Health Space
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#07152d]" />
              </div>
            </Link>
          </div>
        </section>

        {/* SECURITY */}

        <section className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xs font-black text-emerald-900">
                Account Security
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-emerald-800 sm:text-xs">
                Identity তৈরি করা এবং Follow করা কোনো private
                medical, education বা অন্য sensitive data access
                দেয় না। Private access আলাদা permission system-এর
                মাধ্যমে পরিচালিত হবে।
              </p>
            </div>
          </div>
        </section>

        {/* LOGOUT */}

        <div className="mt-6 flex justify-center pb-8">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-5 text-xs font-black text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />

            {loggingOut
              ? "Logging out..."
              : "Logout"}
          </button>
        </div>
      </section>
            {/* =====================================================
          ADD IDENTITY MODAL
      ===================================================== */}

      {showAddIdentity && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07152d]/60 p-3 backdrop-blur-sm sm:p-5">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#07152d]">
                  Shromobazar Identity
                </p>

                <h2 className="mt-1 text-base font-black text-[#07152d] sm:text-lg">
                  Add New Identity
                </h2>

                <p className="mt-1 text-[10px] leading-5 text-slate-500">
                  আপনার Main Account-এর অধীনে একটি নতুন
                  Professional বা Business Identity তৈরি করুন।
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
                      ? "Choose Type"
                      : "Complete Identity"}
                  </p>
                </div>
              </div>
            </div>

            {/* MODAL BODY */}

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">

              {/* =================================================
                  STEP 1
              ================================================== */}

              {identityStep === "type" && (
                <div>
                  <div className="mb-5">
                    <h3 className="text-sm font-black text-[#07152d]">
                      আপনি কোন ধরনের Identity তৈরি করতে চান?
                    </h3>

                    <p className="mt-1 text-[10px] leading-5 text-slate-500">
                      প্রথমে Professional অথবা Business নির্বাচন
                      করুন।
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">

                    {/* PROFESSIONAL */}

                    <button
                      type="button"
                      onClick={() => {
                        setIdentityCategory("professional");
                        setIdentityType("professional");
                        setIdentityStep("category");
                        setIdentityError("");
                      }}
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
                            Lawyer, Doctor, Engineer, Teacher,
                            Worker, Player, Driver, Technician,
                            Student, Creator ইত্যাদি।
                          </p>

                          <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-[#07152d]">
                            Continue
                            <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* BUSINESS */}

                    <button
                      type="button"
                      onClick={() => {
                        setIdentityCategory("business");
                        setIdentityType("business");
                        setIdentityStep("category");
                        setIdentityError("");
                      }}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#07152d] hover:shadow-md"
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
                            Shop, Office অথবা Institute-এর
                            আলাদা public identity তৈরি করুন।
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

              {/* =================================================
                  STEP 2
              ================================================== */}

              {identityStep === "category" && (
                <div>

                  {/* BACK */}

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

                  {/* =================================================
                      PROFESSIONAL CATEGORY
                  ================================================== */}

                  {identityCategory === "professional" && (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-black text-[#07152d]">
                          Professional Category
                        </h3>

                        <p className="mt-1 text-[10px] leading-5 text-slate-500">
                          আপনার Professional Identity-এর ধরন
                          নির্বাচন করুন।
                        </p>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        {PROFESSIONAL_IDENTITY_DEFINITIONS.map(
                          (item) => {
                            const Icon = item.icon;

                            const selected =
                              identityCategory === item.type;

                            return (
                              <button
                                key={item.type}
                                type="button"
                                onClick={() =>
                                  selectProfessionalCategory(
                                    item.type,
                                  )
                                }
                                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                                  selected
                                    ? "border-[#07152d] bg-[#07152d] text-white shadow-sm"
                                    : "border-slate-200 bg-white text-[#07152d] hover:border-slate-400"
                                }`}
                              >
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                    selected
                                      ? "bg-white/10"
                                      : "bg-slate-100"
                                  }`}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>

                                <span className="text-xs font-black">
                                  {item.title}
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      BUSINESS CATEGORY
                  ================================================== */}

                  {identityCategory === "business" && (
                    <div>
                      <div className="mb-4">
                        <h3 className="text-sm font-black text-[#07152d]">
                          Business Category
                        </h3>

                        <p className="mt-1 text-[10px] leading-5 text-slate-500">
                          কোন ধরনের Business Identity তৈরি
                          করবেন?
                        </p>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-3">
                        {BUSINESS_IDENTITY_DEFINITIONS.map(
                          (item) => {
                            const Icon = item.icon;

                            const selected =
                              (item.type === "shop" &&
                                identityType === "shop") ||
                              (item.type === "office" &&
                                identityType === "business") ||
                              (item.type === "institute" &&
                                identityType === "institute");

                            return (
                              <button
                                key={item.type}
                                type="button"
                                onClick={() =>
                                  selectBusinessCategory(
                                    item.type,
                                  )
                                }
                                className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                                  selected
                                    ? "border-[#07152d] bg-[#07152d] text-white shadow-sm"
                                    : "border-slate-200 bg-white text-[#07152d] hover:border-slate-400"
                                }`}
                              >
                                <div
                                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                    selected
                                      ? "bg-white/10"
                                      : "bg-slate-100"
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>

                                <span className="mt-2 text-xs font-black">
                                  {item.title}
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      BUSINESS FORM
                  ================================================== */}

                  {(identityType === "shop" ||
  identityType === "business" ||
  identityType === "institute") && (
                      <div className="mt-5">

                        {/* NAME */}

                        <div>
                          <label className="mb-2 block text-xs font-black text-slate-700">
                            {identityCategory === "shop"
                              ? "Shop Name"
                              : identityCategory === "office"
                                ? "Office Name"
                                : "Institute Name"}
                          </label>

                          <input
                            type="text"
                            value={displayName}
                            onChange={(event) =>
                              setDisplayName(
                                event.target.value,
                              )
                            }
                            placeholder={
                              identityCategory === "shop"
                                ? "যেমন: Sujon Electronics"
                                : identityCategory === "office"
                                  ? "যেমন: Sujon Law Office"
                                  : "যেমন: Sujon Training Institute"
                            }
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#07152d] outline-none transition focus:border-[#07152d] focus:ring-2 focus:ring-slate-100"
                          />
                        </div>

                        {/* BUSINESS TYPE */}

                        <div className="mt-4">
                          <label className="mb-2 block text-xs font-black text-slate-700">
                            {identityCategory === "shop"
                              ? "Shop Type"
                              : identityCategory === "office"
                                ? "Office Type"
                                : "Institute Type"}
                          </label>

                          <select
                            value={businessType}
                            onChange={(event) =>
                              setBusinessType(
                                event.target.value,
                              )
                            }
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#07152d] outline-none transition focus:border-[#07152d] focus:ring-2 focus:ring-slate-100"
                          >
                            <option value="">
                              Select Type
                            </option>

                            {identityCategory === "shop" ? (
                              SHOP_BUSINESS_TYPES.map(
                                (item) => (
                                  <option
                                    key={item.value}
                                    value={item.value}
                                  >
                                    {item.label}
                                  </option>
                                ),
                              )
                            ) : (
                              <>
                                <option value="private">
                                  Private
                                </option>

                                <option value="public">
                                  Public
                                </option>

                                <option value="other">
                                  Other
                                </option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* MAIN CATEGORY */}

                        <div className="mt-4">
                          <label className="mb-2 block text-xs font-black text-slate-700">
                            Main Category
                          </label>

                          <input
                            type="text"
                            value={identityMainCategory}
                            onChange={(event) =>
                              setIdentityMainCategory(
                                event.target.value,
                              )
                            }
                            placeholder={
                              identityCategory === "shop"
                                ? "যেমন: Electronics"
                                : identityCategory === "office"
                                  ? "যেমন: Law / Consultancy"
                                  : "যেমন: Computer Training"
                            }
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#07152d] outline-none transition focus:border-[#07152d] focus:ring-2 focus:ring-slate-100"
                          />
                        </div>

                        {/* OWNER / ADMIN */}

                        <div className="mt-4">
                          <label className="mb-2 block text-xs font-black text-slate-700">
                            Owner / Admin Name
                          </label>

                          <input
                            type="text"
                            value={ownerAdminName}
                            onChange={(event) =>
                              setOwnerAdminName(
                                event.target.value,
                              )
                            }
                            placeholder="যেমন: Sujon Islam"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#07152d] outline-none transition focus:border-[#07152d] focus:ring-2 focus:ring-slate-100"
                          />
                        </div>

                        {/* ADDRESS */}

                        <div className="mt-4">
                          <label className="mb-2 block text-xs font-black text-slate-700">
                            {identityCategory === "shop"
                              ? "Shop Address"
                              : identityCategory === "office"
                                ? "Office Address"
                                : "Institute Address"}
                          </label>

                          <input
                            type="text"
                            value={identityAddress}
                            onChange={(event) =>
                              setIdentityAddress(
                                event.target.value,
                              )
                            }
                            placeholder="ঠিকানা লিখুন"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#07152d] outline-none transition focus:border-[#07152d] focus:ring-2 focus:ring-slate-100"
                          />
                        </div>

                        {/* CONTACT */}

                        <div className="mt-4">
                          <label className="mb-2 block text-xs font-black text-slate-700">
                            {identityCategory === "shop"
                              ? "Shop Contact Number"
                              : identityCategory === "office"
                                ? "Office Contact Number"
                                : "Institute Contact Number"}
                          </label>

                          <input
                            type="tel"
                            value={contactNumber}
                            onChange={(event) =>
                              setContactNumber(
                                event.target.value,
                              )
                            }
                            placeholder="যেমন: 01XXXXXXXXX"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-[#07152d] outline-none transition focus:border-[#07152d] focus:ring-2 focus:ring-slate-100"
                          />
                        </div>

                        {/* PUBLIC */}

                        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(event) =>
                              setIsPublic(
                                event.target.checked,
                              )
                            }
                            className="mt-0.5 h-4 w-4 accent-[#07152d]"
                          />

                          <span>
                            <span className="block text-xs font-black text-slate-800">
                              Public Identity
                            </span>

                            <span className="mt-1 block text-[10px] leading-5 text-slate-500">
                              অন্যরা এই Business Identity
                              দেখতে পারবে।
                            </span>
                          </span>
                        </label>
                      </div>
                    )}

{/* PROFESSIONAL FORM */}
{identityCategory && identityType === "professional" && (
  <div className="space-y-5">
    <div>
      <label className="text-sm font-semibold text-slate-700">
        আপনার নাম
      </label>
      <input
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="আপনার নাম লিখুন"
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-700">
        পেশা
      </label>
      <input
        type="text"
        value={professionalProfession}
        onChange={(e) => setProfessionalProfession(e.target.value)}
        placeholder="যেমন: Lawyer, Doctor, Engineer"
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-700">
        পদবি / Designation
      </label>
      <input
        type="text"
        value={professionalDegree}
        onChange={(e) => setProfessionalDegree(e.target.value)}
        placeholder="যেমন: Manager, Senior Engineer, Advocate"
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-700">
        কোন প্রতিষ্ঠানে কাজ করেন
      </label>
      <input
        type="text"
        value={professionalOrganization}
        onChange={(e) => setProfessionalOrganization(e.target.value)}
        placeholder="প্রতিষ্ঠান / Organization-এর নাম"
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-700">
        ঠিকানা
      </label>
      <textarea
        value={professionalAddress}
        onChange={(e) => setProfessionalAddress(e.target.value)}
        placeholder="আপনার ঠিকানা লিখুন"
        rows={3}
        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-700">
        ফোন নম্বর
      </label>
      <input
        type="tel"
        value={professionalContact}
        onChange={(e) => setProfessionalContact(e.target.value)}
        placeholder="ফোন নম্বর"
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-700">
        ইমেইল
      </label>
      <input
        type="email"
        value={professionalEmail}
        onChange={(e) => setProfessionalEmail(e.target.value)}
        placeholder="ইমেইল ঠিকানা"
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-700">
        Skills / দক্ষতা
      </label>
      <textarea
        value={professionalSkills}
        onChange={(e) => setProfessionalSkills(e.target.value)}
        placeholder="আপনার প্রধান দক্ষতাগুলো লিখুন"
        rows={3}
        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-700">
        Experience / অভিজ্ঞতা
      </label>
      <input
        type="text"
        value={professionalExperience}
        onChange={(e) => setProfessionalExperience(e.target.value)}
        placeholder="যেমন: 5 years"
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div>
      <label className="text-sm font-semibold text-slate-700">
        Professional Bio
      </label>
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="নিজের পেশাগত পরিচয় সম্পর্কে সংক্ষেপে লিখুন"
        rows={4}
        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  </div>
)}

                  {/* =================================================
                      ERROR
                  ================================================== */}

                  {identityError && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold leading-5 text-red-700">
                      {identityError}
                    </div>
                  )}

                  {/* =================================================
                      ACTIONS
                  ================================================== */}

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
                        identityCategory === "" ||
                        (identityCategory === "professional" &&
                          !displayName.trim()) ||
                        (identityCategory !==
                          "professional" &&
                          identityCategory !== "business" &&
                          !displayName.trim())
                      }
                      className="h-11 flex-1 rounded-xl bg-[#07152d] text-xs font-black text-white transition hover:bg-[#10284a] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {savingIdentity
                        ? "Saving..."
                        : "Create Identity"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}