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
  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

/* =========================================================
   IDENTITY DEFINITIONS
========================================================= */

const IDENTITY_DEFINITIONS: Array<{
  type: IdentityType;
  title: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    type: "personal",
    title: "Personal",
    description: "আপনার ব্যক্তিগত পরিচয়",
    icon: UserRound,
  },
  {
    type: "professional",
    title: "Professional",
    description: "আপনার পেশা ও কাজের পরিচয়",
    icon: BriefcaseBusiness,
  },
  {
    type: "student",
    title: "Student",
    description: "শিক্ষার্থী পরিচয়",
    icon: GraduationCap,
  },
  {
    type: "medical",
    title: "Medical / Health",
    description: "স্বাস্থ্য ও চিকিৎসা সম্পর্কিত পরিচয়",
    icon: HeartPulse,
  },
  {
    type: "player",
    title: "Player",
    description: "Sports ও Player পরিচয়",
    icon: Trophy,
  },
  {
    type: "shop",
    title: "Shop",
    description: "আপনার দোকান / Marketplace পরিচয়",
    icon: ShoppingBag,
  },
  {
    type: "business",
    title: "Business / Office",
    description: "Business, Office বা Consultancy",
    icon: Building2,
  },
  {
    type: "institute",
    title: "Institute",
    description: "School, College, Training বা Institute",
    icon: ShieldCheck,
  },
  {
    type: "other",
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
    ) ?? IDENTITY_DEFINITIONS[IDENTITY_DEFINITIONS.length - 1];

  const Icon = definition.icon;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-wider text-orange-500">
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const [identities, setIdentities] = useState<Identity[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingIdentity, setDeletingIdentity] = useState<string | null>(
    null,
  );

  const [showAddIdentity, setShowAddIdentity] = useState(false);

  const [identityType, setIdentityType] =
    useState<IdentityType>("professional");

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [error, setError] = useState("");
  const [identityError, setIdentityError] = useState("");

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

      /* -------------------------------------------------------
         PROFILE
      ------------------------------------------------------- */

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

      /* -------------------------------------------------------
         IDENTITIES

         Identity load failure should NOT destroy the whole
         Account page. The account itself must remain usable.
      ------------------------------------------------------- */

      const {
        data: identityData,
        error: identitiesLoadError,
      } = await supabase
        .from("identities")
        .select(
          "id, user_id, identity_type, display_name, slug, avatar_url, bio, is_active, is_public, created_at, updated_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

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
        setIdentities((identityData ?? []) as Identity[]);
      }
    } catch (err) {
      const message = getErrorMessage(err);

      console.error("Account load error:", message);

      setError(
        message || "Account information load করা যায়নি।",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

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
      setIdentityError("Identity name দিন।");
      return;
    }

    setSavingIdentity(true);

    try {
      const existing = identities.find(
        (identity) =>
          identity.identity_type === identityType &&
          identity.display_name.trim().toLowerCase() ===
            cleanName.toLowerCase(),
      );

      if (existing) {
        throw new Error(
          "এই ধরনের একই নামের Identity ইতোমধ্যে আছে।",
        );
      }

      const slugBase = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 70);

      const slug =
        slugBase ||
        `${identityType}-${crypto.randomUUID().slice(0, 8)}`;

      const { data, error: insertError } = await supabase
        .from("identities")
        .insert({
          user_id: userId,
          identity_type: identityType,
          display_name: cleanName,
          slug,
          bio: bio.trim() || null,
          is_active: true,
          is_public: isPublic,
        })
        .select(
          "id, user_id, identity_type, display_name, slug, avatar_url, bio, is_active, is_public, created_at, updated_at",
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

      setDisplayName("");
      setBio("");
      setIdentityType("professional");
      setIsPublic(true);
      setShowAddIdentity(false);
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
    const confirmed = window.confirm(
      "এই Identity মুছে ফেলতে চান?",
    );

    if (!confirmed) return;

    setDeletingIdentity(id);
    setIdentityError("");

    try {
      const { error: deleteError } = await supabase
        .from("identities")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (deleteError) {
        throw deleteError;
      }

      setIdentities((current) =>
        current.filter((identity) => identity.id !== id),
      );
    } catch (err) {
      const message = getErrorMessage(err);

      console.error("Identity delete error:", message);

      setIdentityError(
        message || "Identity delete করা যায়নি।",
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
      const { error: logoutError } =
        await supabase.auth.signOut();

      if (logoutError) {
        throw logoutError;
      }

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

  const initial =
    accountDisplayName.charAt(0).toUpperCase() || "S";

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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
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
      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-black text-slate-600 transition hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/status-feed"
              className="hidden items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-black text-slate-600 transition hover:border-orange-200 hover:text-orange-500 sm:flex"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Social Hub
            </Link>

            <Link
              href="/wallet"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-black text-slate-600 transition hover:border-orange-200 hover:text-orange-500"
            >
              <Wallet className="h-3.5 w-3.5" />
              Wallet
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {/* ===================================================
            PROFILE HERO
        ==================================================== */}

        <div className="overflow-hidden rounded-[1.75rem] bg-[#07152d] shadow-lg">
          <div className="relative h-24 bg-gradient-to-r from-[#07152d] via-[#10284a] to-orange-500/80 sm:h-32">
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
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-orange-300">
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
                className="inline-flex h-10 items-center justify-center rounded-xl bg-orange-500 px-5 text-xs font-black text-white transition hover:bg-orange-600"
              >
                Create Post
              </Link>
            </div>
          </div>
        </div>

        {/* ===================================================
            ARCHITECTURE NOTICE
        ==================================================== */}

        <div className="mt-5 rounded-[1.5rem] border border-orange-100 bg-orange-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xs font-black text-slate-800">
                One Account • Multiple Identities
              </h2>

              <p className="mt-1 text-[10px] leading-5 text-slate-600 sm:text-xs">
                একটি Shromobazar Account-এর মধ্যে Personal,
                Professional, Student, Medical, Player, Shop,
                Business বা Institute-এর মতো একাধিক Identity রাখা
                যাবে।
              </p>

              <p className="mt-1 text-[10px] font-semibold leading-5 text-slate-500 sm:text-xs">
                Follow এবং public identity আলাদা; private data access
                আলাদা permission-এর মাধ্যমে নিয়ন্ত্রিত হবে।
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ===================================================
            ACCOUNT INFORMATION
        ==================================================== */}

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

            <CircleUserRound className="h-5 w-5 text-orange-500" />
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

        {/* ===================================================
            IDENTITIES
        ==================================================== */}

        <section className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-500">
                My Identity Spaces
              </p>

              <h2 className="mt-1 text-lg font-black text-[#07152d]">
                My Identities
              </h2>

              <p className="mt-1 max-w-2xl text-[10px] leading-5 text-slate-500 sm:text-xs">
                একই account থেকে আপনার বিভিন্ন role ও space
                পরিচালনা করুন।
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setIdentityError("");
                setShowAddIdentity(true);
              }}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#07152d] px-4 text-xs font-black text-white transition hover:bg-[#10284a]"
            >
              <Plus className="h-4 w-4" />
              Add Identity
            </button>
          </div>

          {identityError && (
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
                Professional, Student, Medical, Player, Shop,
                Business বা অন্য কোনো identity যোগ করতে পারেন।
              </p>

              <button
                type="button"
                onClick={() => {
                  setIdentityError("");
                  setShowAddIdentity(true);
                }}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-xs font-black text-white hover:bg-orange-600"
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

        {/* ===================================================
            QUICK ACCESS
        ==================================================== */}

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
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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

                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500" />
              </div>
            </Link>

            <Link
              href="/marketplace"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
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

                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500" />
              </div>
            </Link>

            <Link
              href="/jobs"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
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

                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500" />
              </div>
            </Link>

            <Link
              href="/health"
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
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

                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-orange-500" />
              </div>
            </Link>
          </div>
        </section>

        {/* ===================================================
            SECURITY NOTE
        ==================================================== */}

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

        {/* ===================================================
            LOGOUT
        ==================================================== */}

        <div className="mt-6 flex justify-center pb-8">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-white px-5 text-xs font-black text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </section>

      {/* =====================================================
          ADD IDENTITY MODAL
      ====================================================== */}

      {showAddIdentity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07152d]/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-sm font-black text-[#07152d]">
                  Add New Identity
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  আপনার account-এর নতুন role / space তৈরি করুন
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!savingIdentity) {
                    setShowAddIdentity(false);
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* TYPE */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-700">
                  Identity Type
                </label>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {IDENTITY_DEFINITIONS.map((item) => {
                    const Icon = item.icon;
                    const selected =
                      identityType === item.type;

                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() =>
                          setIdentityType(item.type)
                        }
                        className={`rounded-xl border p-3 text-left transition ${
                          selected
                            ? "border-orange-400 bg-orange-50"
                            : "border-slate-200 bg-white hover:border-orange-200"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            selected
                              ? "text-orange-500"
                              : "text-slate-400"
                          }`}
                        />

                        <p className="mt-2 text-[10px] font-black text-slate-800">
                          {item.title}
                        </p>

                        <p className="mt-1 line-clamp-2 text-[8px] leading-4 text-slate-400">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* NAME */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-700">
                  Identity Name
                </label>

                <input
                  type="text"
                  value={displayName}
                  onChange={(event) =>
                    setDisplayName(event.target.value)
                  }
                  placeholder="যেমন: Sujon Contractor / Sujon Shop"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* BIO */}

              <div>
                <label className="mb-2 block text-xs font-black text-slate-700">
                  Short Bio
                  <span className="ml-1 font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <textarea
                  value={bio}
                  onChange={(event) =>
                    setBio(event.target.value)
                  }
                  rows={3}
                  placeholder="এই identity সম্পর্কে সংক্ষেপে লিখুন..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* PUBLIC */}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(event) =>
                    setIsPublic(event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 accent-orange-500"
                />

                <span>
                  <span className="block text-xs font-black text-slate-800">
                    Public Identity
                  </span>

                  <span className="mt-1 block text-[10px] leading-5 text-slate-500">
                    অন্যরা এই identity দেখতে পারবে। Private
                    medical বা personal records এতে প্রকাশ হবে না।
                  </span>
                </span>
              </label>

              {identityError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold leading-5 text-red-700">
                  {identityError}
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!savingIdentity) {
                      setShowAddIdentity(false);
                    }
                  }}
                  disabled={savingIdentity}
                  className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddIdentity}
                  disabled={savingIdentity}
                  className="h-11 flex-1 rounded-xl bg-orange-500 text-xs font-black text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {savingIdentity
                    ? "Saving..."
                    : "Create Identity"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}