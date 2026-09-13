"use client";

import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  FileCheck2,
  Flag,
  Loader2,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  Star,
  Trophy,
  Upload,
  UserRound,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";

import { supabase } from "@/lib/client";

/* =========================================================
   TYPES
========================================================= */

type SportsRole = "player" | "coach" | "referee";

type SportsLevel =
  | "Local"
  | "School"
  | "College"
  | "University"
  | "Upazila"
  | "District"
  | "Division"
  | "2nd Division"
  | "1st Division"
  | "National"
  | "International";

type VerificationStatus =
  | "not_submitted"
  | "pending"
  | "verified"
  | "rejected";

type HireStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

type DocumentType =
  | "certificate"
  | "license"
  | "registration"
  | "official_record"
  | "appointment_letter"
  | "competition_record"
  | "other";

type SportsProfile = {
  id: string;
  user_id: string;
  role: SportsRole;
  sport: string;
  level: SportsLevel;
  name: string | null;
  position: string | null;
  location: string | null;
  experience: string | null;
  available_for_hire: boolean;
  public_profile: boolean;
  active: boolean;
  verification_status: VerificationStatus;
  verification_note: string | null;
  created_at: string;
  updated_at: string;
};

type HireRequest = {
  id: string;
  requester_id: string;
  target_profile_id: string;
  role: SportsRole;
  sport: string;
  position: string | null;
  location: string | null;
  event_date: string | null;
  message: string | null;
  status: HireStatus;
  created_at: string;
};

type VerificationRecord = {
  id: string;
  sports_profile_id: string;
  user_id: string;
  document_type: DocumentType;
  document_title: string;
  issuing_organization: string | null;
  document_number: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  document_url: string | null;
  status: "pending" | "verified" | "rejected";
  admin_note: string | null;
  reviewed_at: string | null;
  created_at: string;
};

/* =========================================================
   CONSTANTS
========================================================= */

const SPORTS = [
  "Football",
  "Cricket",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Tennis",
  "Hockey",
  "Table Tennis",
  "Kabaddi",
  "Athletics",
  "Swimming",
  "Boxing",
  "Wrestling",
  "Chess",
  "Other",
];

const LEVELS: SportsLevel[] = [
  "Local",
  "School",
  "College",
  "University",
  "Upazila",
  "District",
  "Division",
  "2nd Division",
  "1st Division",
  "National",
  "International",
];

const ROLES: SportsRole[] = ["player", "coach", "referee"];

const DOCUMENT_TYPES: {
  value: DocumentType;
  label: string;
}[] = [
  {
    value: "certificate",
    label: "Certificate",
  },
  {
    value: "license",
    label: "License",
  },
  {
    value: "registration",
    label: "Registration",
  },
  {
    value: "official_record",
    label: "Official Record",
  },
  {
    value: "appointment_letter",
    label: "Appointment Letter",
  },
  {
    value: "competition_record",
    label: "Competition Record",
  },
  {
    value: "other",
    label: "Other",
  },
];

const ROLE_LABEL: Record<SportsRole, string> = {
  player: "Player",
  coach: "Coach",
  referee: "Referee / Umpire",
};

const STATUS_LABEL: Record<VerificationStatus, string> = {
  not_submitted: "Not Submitted",
  pending: "Under Review",
  verified: "Verified",
  rejected: "Rejected",
};

/* =========================================================
   PAGE
========================================================= */

export default function SportsPage() {
  const [userId, setUserId] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<SportsProfile[]>([]);
  const [myProfiles, setMyProfiles] = useState<SportsProfile[]>([]);
  const [hireRequests, setHireRequests] = useState<HireRequest[]>([]);
  const [verifications, setVerifications] = useState<
    VerificationRecord[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState<"all" | SportsRole>(
    "all",
  );
  const [levelFilter, setLevelFilter] = useState<
    "all" | SportsLevel
  >("all");

  const [activeTab, setActiveTab] = useState<
    "directory" | "my-profile" | "requests"
  >("directory");

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] =
    useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const [selectedProfile, setSelectedProfile] =
    useState<SportsProfile | null>(null);

  const [editingProfile, setEditingProfile] =
    useState<SportsProfile | null>(null);

  /* =========================================================
     PROFILE FORM
  ========================================================= */

  const [profileForm, setProfileForm] = useState({
    role: "player" as SportsRole,
    sport: "Football",
    level: "Local" as SportsLevel,
    name: "",
    position: "",
    location: "",
    experience: "",
    available_for_hire: true,
    public_profile: true,
  });

  /* =========================================================
     HIRE FORM
  ========================================================= */

  const [hireForm, setHireForm] = useState({
    position: "",
    location: "",
    event_date: "",
    message: "",
  });

  /* =========================================================
     VERIFICATION FORM
  ========================================================= */

  const [verificationForm, setVerificationForm] = useState({
    document_type: "certificate" as DocumentType,
    document_title: "",
    issuing_organization: "",
    document_number: "",
    issue_date: "",
    expiry_date: "",
  });

  const [verificationFile, setVerificationFile] =
    useState<File | null>(null);

  /* =========================================================
     AUTH
  ========================================================= */

  const loadUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUserId(null);
      return null;
    }

    setUserId(user.id);
    return user.id;
  }, []);

  /* =========================================================
     LOAD PUBLIC PROFILES
  ========================================================= */

  const loadPublicProfiles = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from("sports_profiles")
      .select("*")
      .eq("active", true)
      .eq("public_profile", true)
      .order("created_at", {
        ascending: false,
      });

    if (queryError) {
      throw queryError;
    }

    setProfiles((data ?? []) as SportsProfile[]);
  }, []);

  /* =========================================================
     LOAD MY PROFILES
  ========================================================= */

  const loadMyProfiles = useCallback(async (uid: string) => {
    const { data, error: queryError } = await supabase
      .from("sports_profiles")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", {
        ascending: false,
      });

    if (queryError) {
      throw queryError;
    }

    setMyProfiles((data ?? []) as SportsProfile[]);
  }, []);

  /* =========================================================
     LOAD HIRE REQUESTS
  ========================================================= */

  const loadHireRequests = useCallback(
    async (uid: string, ownProfiles: SportsProfile[]) => {
      const profileIds = ownProfiles.map((profile) => profile.id);

      let outgoingQuery = supabase
        .from("sports_hire_requests")
        .select("*")
        .eq("requester_id", uid)
        .order("created_at", {
          ascending: false,
        });

      const { data: outgoing, error: outgoingError } =
        await outgoingQuery;

      if (outgoingError) {
        throw outgoingError;
      }

      let incoming: HireRequest[] = [];

      if (profileIds.length > 0) {
        const { data: incomingData, error: incomingError } =
          await supabase
            .from("sports_hire_requests")
            .select("*")
            .in("target_profile_id", profileIds)
            .order("created_at", {
              ascending: false,
            });

        if (incomingError) {
          throw incomingError;
        }

        incoming = (incomingData ?? []) as HireRequest[];
      }

      const combined = [
        ...((outgoing ?? []) as HireRequest[]),
        ...incoming,
      ];

      const unique = Array.from(
        new Map(
          combined.map((request) => [request.id, request]),
        ).values(),
      );

      setHireRequests(unique);
    },
    [],
  );

  /* =========================================================
     LOAD VERIFICATIONS
  ========================================================= */

  const loadVerifications = useCallback(async (uid: string) => {
    const { data, error: queryError } = await supabase
      .from("sports_verifications")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", {
        ascending: false,
      });

    if (queryError) {
      throw queryError;
    }

    setVerifications((data ?? []) as VerificationRecord[]);
  }, []);

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const uid = await loadUser();

      await loadPublicProfiles();

      if (uid) {
        await loadMyProfiles(uid);

        const { data: ownData, error: ownError } = await supabase
          .from("sports_profiles")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", {
            ascending: false,
          });

        if (ownError) {
          throw ownError;
        }

        const own = (ownData ?? []) as SportsProfile[];

        await loadHireRequests(uid, own);
        await loadVerifications(uid);
      } else {
        setMyProfiles([]);
        setHireRequests([]);
        setVerifications([]);
      }
    } catch (loadError) {
      console.error(loadError);

      setError(
        loadError instanceof Error
          ? loadError.message
          : "Sports data load failed.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    loadHireRequests,
    loadMyProfiles,
    loadPublicProfiles,
    loadUser,
    loadVerifications,
  ]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  /* =========================================================
     FILTERED DIRECTORY
  ========================================================= */

  const filteredProfiles = useMemo(() => {
    const term = search.trim().toLowerCase();

    return profiles.filter((profile) => {
      const matchesSearch =
        !term ||
        [
          profile.name,
          profile.sport,
          profile.position,
          profile.location,
          profile.level,
          ROLE_LABEL[profile.role],
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(term),
          );

      const matchesSport =
        sportFilter === "All" || profile.sport === sportFilter;

      const matchesRole =
        roleFilter === "all" || profile.role === roleFilter;

      const matchesLevel =
        levelFilter === "all" || profile.level === levelFilter;

      return (
        matchesSearch &&
        matchesSport &&
        matchesRole &&
        matchesLevel
      );
    });
  }, [levelFilter, profiles, roleFilter, search, sportFilter]);

  /* =========================================================
     PROFILE MODAL
  ========================================================= */

  const openCreateProfile = () => {
    if (!userId) {
      setError("Please login first to create a Sports Profile.");
      return;
    }

    setEditingProfile(null);

    setProfileForm({
      role: "player",
      sport: "Football",
      level: "Local",
      name: "",
      position: "",
      location: "",
      experience: "",
      available_for_hire: true,
      public_profile: true,
    });

    setError("");
    setMessage("");
    setShowProfileModal(true);
  };

  const openEditProfile = (profile: SportsProfile) => {
    if (profile.verification_status === "verified") {
      setError(
        "Verified profiles are protected. Please contact admin for changes.",
      );
      return;
    }

    setEditingProfile(profile);

    setProfileForm({
      role: profile.role,
      sport: profile.sport,
      level: profile.level,
      name: profile.name ?? "",
      position: profile.position ?? "",
      location: profile.location ?? "",
      experience: profile.experience ?? "",
      available_for_hire: profile.available_for_hire,
      public_profile: profile.public_profile,
    });

    setError("");
    setMessage("");
    setShowProfileModal(true);
  };

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();

    if (!userId) {
      setError("Please login first.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingProfile) {
        const { error: updateError } = await supabase
          .from("sports_profiles")
          .update({
            role: profileForm.role,
            sport: profileForm.sport,
            level: profileForm.level,
            name: profileForm.name.trim() || null,
            position: profileForm.position.trim() || null,
            location: profileForm.location.trim() || null,
            experience: profileForm.experience.trim() || null,
            available_for_hire:
              profileForm.available_for_hire,
            public_profile: profileForm.public_profile,
          })
          .eq("id", editingProfile.id)
          .eq("user_id", userId);

        if (updateError) {
          throw updateError;
        }

        setMessage("Sports profile updated.");
      } else {
        const { error: insertError } = await supabase
          .from("sports_profiles")
          .insert({
            user_id: userId,
            role: profileForm.role,
            sport: profileForm.sport,
            level: profileForm.level,
            name: profileForm.name.trim() || null,
            position: profileForm.position.trim() || null,
            location: profileForm.location.trim() || null,
            experience: profileForm.experience.trim() || null,
            available_for_hire:
              profileForm.available_for_hire,
            public_profile: profileForm.public_profile,
            active: true,
            verification_status: "not_submitted",
          });

        if (insertError) {
          throw insertError;
        }

        setMessage("Sports profile created.");
      }

      setShowProfileModal(false);

      await loadAll();
    } catch (saveError) {
      console.error(saveError);

      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save Sports Profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     OPEN HIRE
  ========================================================= */

  const openHire = (profile: SportsProfile) => {
    if (!userId) {
      setError("Please login to send a hire request.");
      return;
    }

    if (profile.user_id === userId) {
      setError("You cannot send a hire request to yourself.");
      return;
    }

    setSelectedProfile(profile);

    setHireForm({
      position: profile.position ?? "",
      location: profile.location ?? profile.location ?? "",
      event_date: "",
      message: "",
    });

    setError("");
    setMessage("");
    setShowHireModal(true);
  };

  /* =========================================================
     SEND HIRE REQUEST
  ========================================================= */

  const sendHireRequest = async (event: FormEvent) => {
    event.preventDefault();

    if (!userId || !selectedProfile) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const { error: insertError } = await supabase
        .from("sports_hire_requests")
        .insert({
          requester_id: userId,
          target_profile_id: selectedProfile.id,
          role: selectedProfile.role,
          sport: selectedProfile.sport,
          position: hireForm.position.trim() || null,
          location: hireForm.location.trim() || null,
          event_date: hireForm.event_date || null,
          message: hireForm.message.trim() || null,
          status: "pending",
        });

      if (insertError) {
        throw insertError;
      }

      setShowHireModal(false);
      setSelectedProfile(null);
      setMessage("Hire request sent successfully.");

      await loadAll();
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not send hire request.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     OPEN VERIFICATION
  ========================================================= */

  const openVerification = (profile: SportsProfile) => {
    if (!userId) {
      setError("Please login first.");
      return;
    }

    if (profile.user_id !== userId) {
      setError("You can only verify your own Sports Profile.");
      return;
    }

    if (profile.verification_status === "verified") {
      setError("This profile is already verified.");
      return;
    }

    setSelectedProfile(profile);

    setVerificationForm({
      document_type: "certificate",
      document_title: "",
      issuing_organization: "",
      document_number: "",
      issue_date: "",
      expiry_date: "",
    });

    setVerificationFile(null);

    setError("");
    setMessage("");
    setShowVerificationModal(true);
  };

  /* =========================================================
     FILE SELECT
  ========================================================= */

  const handleVerificationFile = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setVerificationFile(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WebP or PDF files are allowed.");
      event.target.value = "";
      setVerificationFile(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Maximum file size is 10 MB.");
      event.target.value = "";
      setVerificationFile(null);
      return;
    }

    setError("");
    setVerificationFile(file);
  };

  /* =========================================================
     SUBMIT VERIFICATION
  ========================================================= */

  const submitVerification = async (event: FormEvent) => {
    event.preventDefault();

    if (!userId || !selectedProfile) {
      return;
    }

    if (!verificationForm.document_title.trim()) {
      setError("Document title is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      let documentPath: string | null = null;

      if (verificationFile) {
        const safeName = verificationFile.name
          .replace(/[^a-zA-Z0-9._-]/g, "-")
          .toLowerCase();

        const path = [
          userId,
          selectedProfile.id,
          `${Date.now()}-${safeName}`,
        ].join("/");

        const { error: uploadError } = await supabase.storage
          .from("sports-verification-docs")
          .upload(path, verificationFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: verificationFile.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        documentPath = path;
      }

      const { error: verificationError } = await supabase
        .from("sports_verifications")
        .insert({
          sports_profile_id: selectedProfile.id,
          user_id: userId,
          document_type: verificationForm.document_type,
          document_title:
            verificationForm.document_title.trim(),
          issuing_organization:
            verificationForm.issuing_organization.trim() || null,
          document_number:
            verificationForm.document_number.trim() || null,
          issue_date: verificationForm.issue_date || null,
          expiry_date: verificationForm.expiry_date || null,
          document_url: documentPath,
          status: "pending",
        });

      if (verificationError) {
        throw verificationError;
      }

      const { error: profileError } = await supabase
        .from("sports_profiles")
        .update({
          verification_status: "pending",
        })
        .eq("id", selectedProfile.id)
        .eq("user_id", userId);

      if (profileError) {
        throw profileError;
      }

      setShowVerificationModal(false);
      setSelectedProfile(null);
      setVerificationFile(null);

      setMessage(
        "Verification document submitted. Admin review is pending.",
      );

      await loadAll();
    } catch (verificationError) {
      console.error(verificationError);

      setError(
        verificationError instanceof Error
          ? verificationError.message
          : "Verification submission failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     REQUEST ACTION
  ========================================================= */

  const updateRequest = async (
    request: HireRequest,
    status: HireStatus,
  ) => {
    try {
      setSaving(true);
      setError("");

      const { error: updateError } = await supabase
        .from("sports_hire_requests")
        .update({
          status,
        })
        .eq("id", request.id);

      if (updateError) {
        throw updateError;
      }

      setMessage(`Request marked as ${status}.`);

      await loadAll();
    } catch (requestError) {
      console.error(requestError);

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not update request.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     REQUEST COUNTS
  ========================================================= */

  const pendingRequests = hireRequests.filter(
    (request) => request.status === "pending",
  ).length;

  const verifiedProfiles = profiles.filter(
    (profile) => profile.verification_status === "verified",
  ).length;

  const availableProfiles = profiles.filter(
    (profile) => profile.available_for_hire,
  ).length;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-200">
                <Trophy size={20} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-black">
                  SHROMO SPORTS
                </h1>

                <p className="truncate text-[11px] text-slate-500">
                  Player • Coach • Referee • Events • Live
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sports/live"
              className="hidden items-center gap-2 rounded-xl bg-slate-950 px-3 py-2 text-xs font-black text-white transition hover:bg-slate-800 sm:flex"
            >
              <Radio size={15} />
              Sports Live
            </Link>

            <button
              type="button"
              onClick={openCreateProfile}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-black text-white shadow-md shadow-orange-200 transition hover:bg-orange-600"
            >
              <UserRound size={15} />
              <span className="hidden sm:inline">
                Create Profile
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-orange-300">
                  Shromo Sports
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-white/60">
                  Local → International
                </span>
              </div>

              <h2 className="text-3xl font-black leading-tight sm:text-5xl">
                Find Talent.
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-white to-blue-400 bg-clip-text text-transparent">
                  Build Opportunity.
                </span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                Player, coach এবং referee নিজের Sports Profile তৈরি করতে
                পারবে। Teams ও organizers talent খুঁজে connect বা hire
                করতে পারবে। Verified level আলাদা করে দেখানো হবে।
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={openCreateProfile}
                  className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-400"
                >
                  <UserRound size={17} />
                  Create Sports Profile
                </button>

                <Link
                  href="/sports/live"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <Radio size={17} />
                  Open Sports Channel
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Users}
                value={profiles.length}
                label="Public Profiles"
              />

              <StatCard
                icon={ShieldCheck}
                value={verifiedProfiles}
                label="Verified"
              />

              <StatCard
                icon={Zap}
                value={availableProfiles}
                label="Available"
              />

              <StatCard
                icon={Clock3}
                value={pendingRequests}
                label="Pending Requests"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MESSAGE
      ===================================================== */}
      <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
        {message && (
          <div className="mb-3 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <CheckCircle2
              size={18}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <p className="text-sm font-semibold">{message}</p>

            <button
              type="button"
              onClick={() => setMessage("")}
              className="ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <CircleAlert
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-sm font-semibold">{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-auto"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          NAV TABS
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
        <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <TabButton
            active={activeTab === "directory"}
            onClick={() => setActiveTab("directory")}
            icon={Users}
            label="Talent Directory"
          />

          <TabButton
            active={activeTab === "my-profile"}
            onClick={() => setActiveTab("my-profile")}
            icon={UserRound}
            label="My Sports"
          />

          <TabButton
            active={activeTab === "requests"}
            onClick={() => {
              setActiveTab("requests");
              setShowRequestsModal(true);
            }}
            icon={FileCheck2}
            label={`Requests${pendingRequests ? ` (${pendingRequests})` : ""}`}
          />
        </div>
      </section>

      {/* =====================================================
          DIRECTORY
      ===================================================== */}
      {activeTab === "directory" && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search player, coach, referee, sport..."
                  className={`${inputClass} pl-10`}
                />
              </div>

              <Select
                value={sportFilter}
                onChange={setSportFilter}
                options={["All", ...SPORTS]}
              />

              <Select
                value={roleFilter}
                onChange={(value) =>
                  setRoleFilter(value as "all" | SportsRole)
                }
                options={[
                  "all",
                  "player",
                  "coach",
                  "referee",
                ]}
                labels={{
                  all: "All Roles",
                  player: "Player",
                  coach: "Coach",
                  referee: "Referee / Umpire",
                }}
              />

              <Select
                value={levelFilter}
                onChange={(value) =>
                  setLevelFilter(
                    value as "all" | SportsLevel,
                  )
                }
                options={["all", ...LEVELS]}
                labels={{
                  all: "All Levels",
                }}
              />
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredProfiles.length === 0 ? (
            <EmptyDirectory />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  currentUserId={userId}
                  onView={() => setSelectedProfile(profile)}
                  onHire={() => openHire(profile)}
                  onVerify={() => openVerification(profile)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          MY SPORTS
      ===================================================== */}
      {activeTab === "my-profile" && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {!userId ? (
            <LoginRequired />
          ) : myProfiles.length === 0 ? (
            <CreateProfileEmpty onCreate={openCreateProfile} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myProfiles.map((profile) => (
                <MyProfileCard
                  key={profile.id}
                  profile={profile}
                  onEdit={() => openEditProfile(profile)}
                  onVerify={() => openVerification(profile)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          REQUESTS
      ===================================================== */}
      {activeTab === "requests" && (
        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <RequestsPanel
            requests={hireRequests}
            myProfiles={myProfiles}
            currentUserId={userId}
            onUpdate={updateRequest}
            saving={saving}
          />
        </section>
      )}

      {/* =====================================================
          LIVE / EVENT FOUNDATION
      ===================================================== */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={Radio}
              title="Shromo Sports Live"
              text="Live sports channel — match broadcast, audience and replay experience."
              href="/sports/live"
            />

            <FeatureCard
              icon={CalendarDays}
              title="Sports Event"
              text="Create local game, tournament or competition event."
              href="/sports/event"
            />

            <FeatureCard
              icon={Video}
              title="Upload Your Game"
              text="Future sports media layer for game video, highlights and replay."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}
      {showProfileModal && (
        <Modal
          title={
            editingProfile
              ? "Edit Sports Profile"
              : "Create Sports Profile"
          }
          onClose={() => setShowProfileModal(false)}
        >
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Role">
                <Select
                  value={profileForm.role}
                  onChange={(value) =>
                    setProfileForm((current) => ({
                      ...current,
                      role: value as SportsRole,
                    }))
                  }
                  options={ROLES}
                  labels={{
                    player: "Player",
                    coach: "Coach",
                    referee: "Referee / Umpire",
                  }}
                />
              </Field>

              <Field label="Sport">
                <Select
                  value={profileForm.sport}
                  onChange={(value) =>
                    setProfileForm((current) => ({
                      ...current,
                      sport: value,
                    }))
                  }
                  options={SPORTS}
                />
              </Field>

              <Field label="Level">
                <Select
                  value={profileForm.level}
                  onChange={(value) =>
                    setProfileForm((current) => ({
                      ...current,
                      level: value as SportsLevel,
                    }))
                  }
                  options={LEVELS}
                />
              </Field>

              <Field label="Name">
                <input
                  value={profileForm.name}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Your sports name"
                  className={inputClass}
                  required
                />
              </Field>

              <Field label="Position / Specialty">
                <input
                  value={profileForm.position}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      position: event.target.value,
                    }))
                  }
                  placeholder="Forward / Bowler / Goalkeeper..."
                  className={inputClass}
                />
              </Field>

              <Field label="Location">
                <input
                  value={profileForm.location}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                  placeholder="District / City"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Experience">
              <textarea
                value={profileForm.experience}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    experience: event.target.value,
                  }))
                }
                rows={4}
                placeholder="Sports experience, teams, competitions..."
                className={`${inputClass} resize-none`}
              />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
                <input
                  type="checkbox"
                  checked={profileForm.available_for_hire}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      available_for_hire: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-orange-500"
                />

                <div>
                  <p className="text-sm font-bold">
                    Available for hire
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Teams can send requests.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3">
                <input
                  type="checkbox"
                  checked={profileForm.public_profile}
                  onChange={(event) =>
                    setProfileForm((current) => ({
                      ...current,
                      public_profile: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-orange-500"
                />

                <div>
                  <p className="text-sm font-bold">
                    Public profile
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Show in Sports Directory.
                  </p>
                </div>
              </label>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs leading-5 text-blue-800">
              <ShieldCheck
                size={15}
                className="mr-1 inline text-blue-600"
              />
              Higher-level claims such as National or International
              should be supported by authentic documents and admin
              verification.
            </div>

            <ModalActions
              onCancel={() => setShowProfileModal(false)}
              saving={saving}
              submitLabel={
                editingProfile ? "Save Changes" : "Create Profile"
              }
            />
          </form>
        </Modal>
      )}

      {/* =====================================================
          HIRE MODAL
      ===================================================== */}
      {showHireModal && selectedProfile && (
        <Modal
          title={`Hire ${selectedProfile.name || ROLE_LABEL[selectedProfile.role]}`}
          onClose={() => setShowHireModal(false)}
        >
          <form onSubmit={sendHireRequest} className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <UserRound size={18} />
                </div>

                <div>
                  <p className="font-black">
                    {selectedProfile.name || "Sports Profile"}
                  </p>

                  <p className="text-xs text-slate-500">
                    {ROLE_LABEL[selectedProfile.role]} •{" "}
                    {selectedProfile.sport} •{" "}
                    {selectedProfile.level}
                  </p>
                </div>
              </div>
            </div>

            <Field label="Position / Requirement">
              <input
                value={hireForm.position}
                onChange={(event) =>
                  setHireForm((current) => ({
                    ...current,
                    position: event.target.value,
                  }))
                }
                placeholder="What do you need?"
                className={inputClass}
              />
            </Field>

            <Field label="Location">
              <input
                value={hireForm.location}
                onChange={(event) =>
                  setHireForm((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
                placeholder="Event / team location"
                className={inputClass}
              />
            </Field>

            <Field label="Event Date">
              <input
                type="date"
                value={hireForm.event_date}
                onChange={(event) =>
                  setHireForm((current) => ({
                    ...current,
                    event_date: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>

            <Field label="Message">
              <textarea
                value={hireForm.message}
                onChange={(event) =>
                  setHireForm((current) => ({
                    ...current,
                    message: event.target.value,
                  }))
                }
                rows={4}
                placeholder="Write your requirement..."
                className={`${inputClass} resize-none`}
              />
            </Field>

            <ModalActions
              onCancel={() => setShowHireModal(false)}
              saving={saving}
              submitLabel="Send Hire Request"
            />
          </form>
        </Modal>
      )}

      {/* =====================================================
          VERIFICATION MODAL
      ===================================================== */}
      {showVerificationModal && selectedProfile && (
        <Modal
          title="Submit Sports Verification"
          onClose={() => setShowVerificationModal(false)}
        >
          <form
            onSubmit={submitVerification}
            className="space-y-4"
          >
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-orange-600"
                />

                <div>
                  <p className="text-sm font-black text-orange-900">
                    Verification is admin-reviewed
                  </p>

                  <p className="mt-1 text-xs leading-5 text-orange-800/70">
                    Document submit করলে profile automatically
                    verified হবে না। Status থাকবে Under Review until
                    authorized review.
                  </p>
                </div>
              </div>
            </div>

            <Field label="Document Type">
              <Select
                value={verificationForm.document_type}
                onChange={(value) =>
                  setVerificationForm((current) => ({
                    ...current,
                    document_type: value as DocumentType,
                  }))
                }
                options={DOCUMENT_TYPES.map(
                  (document) => document.value,
                )}
                labels={Object.fromEntries(
                  DOCUMENT_TYPES.map((document) => [
                    document.value,
                    document.label,
                  ]),
                )}
              />
            </Field>

            <Field label="Document Title">
              <input
                value={verificationForm.document_title}
                onChange={(event) =>
                  setVerificationForm((current) => ({
                    ...current,
                    document_title: event.target.value,
                  }))
                }
                placeholder="Example: District Football Certificate 2025"
                className={inputClass}
                required
              />
            </Field>

            <Field label="Issuing Organization">
              <input
                value={verificationForm.issuing_organization}
                onChange={(event) =>
                  setVerificationForm((current) => ({
                    ...current,
                    issuing_organization: event.target.value,
                  }))
                }
                placeholder="Organization / Federation / Institute"
                className={inputClass}
              />
            </Field>

            <Field label="Document Number">
              <input
                value={verificationForm.document_number}
                onChange={(event) =>
                  setVerificationForm((current) => ({
                    ...current,
                    document_number: event.target.value,
                  }))
                }
                placeholder="Optional"
                className={inputClass}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Issue Date">
                <input
                  type="date"
                  value={verificationForm.issue_date}
                  onChange={(event) =>
                    setVerificationForm((current) => ({
                      ...current,
                      issue_date: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Expiry Date">
                <input
                  type="date"
                  value={verificationForm.expiry_date}
                  onChange={(event) =>
                    setVerificationForm((current) => ({
                      ...current,
                      expiry_date: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-700">
                Supporting Document
              </span>

              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  onChange={handleVerificationFile}
                  className="block w-full text-sm"
                />

                <p className="mt-2 text-[11px] text-slate-400">
                  JPG, PNG, WebP or PDF • maximum 10 MB
                </p>

                {verificationFile && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <Upload size={14} />
                    {verificationFile.name}
                  </div>
                )}
              </div>
            </label>

            <ModalActions
              onCancel={() =>
                setShowVerificationModal(false)
              }
              saving={saving}
              submitLabel="Submit for Verification"
            />
          </form>
        </Modal>
      )}

      {/* =====================================================
          REQUEST MODAL
      ===================================================== */}
      {showRequestsModal && (
        <Modal
          title="My Sports Requests"
          onClose={() => setShowRequestsModal(false)}
        >
          <RequestsPanel
            requests={hireRequests}
            myProfiles={myProfiles}
            currentUserId={userId}
            onUpdate={updateRequest}
            saving={saving}
          />
        </Modal>
      )}

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <span className="font-black text-white/70">
              SHROMO SPORTS
            </span>
            <span className="mx-2">•</span>
            Shromobazar
          </div>

          <div className="flex gap-4">
            <Link
              href="/sports/live"
              className="transition hover:text-white"
            >
              Sports Live
            </Link>

            <Link
              href="/sports/event"
              className="transition hover:text-white"
            >
              Create Event
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   PROFILE CARD
========================================================= */

function ProfileCard({
  profile,
  currentUserId,
  onView,
  onHire,
  onVerify,
}: {
  profile: SportsProfile;
  currentUserId: string | null;
  onView: () => void;
  onHire: () => void;
  onVerify: () => void;
}) {
  const ownProfile = currentUserId === profile.user_id;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-blue-600" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <UserRound size={22} />
            </div>

            <div className="min-w-0">
              <h3 className="truncate font-black">
                {profile.name || "Sports Member"}
              </h3>

              <p className="truncate text-xs text-slate-500">
                {ROLE_LABEL[profile.role]}
              </p>
            </div>
          </div>

          <VerificationBadge
            status={profile.verification_status}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag text={profile.sport} />
          <Tag text={profile.level} />
          {profile.available_for_hire && (
            <Tag
              text="Available"
              positive
            />
          )}
        </div>

        <div className="mt-4 space-y-2 text-xs text-slate-500">
          {profile.position && (
            <div className="flex items-center gap-2">
              <Star size={14} className="text-orange-500" />
              {profile.position}
            </div>
          )}

          {profile.location && (
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {profile.location}
            </div>
          )}

          {profile.experience && (
            <p className="line-clamp-2 leading-5">
              {profile.experience}
            </p>
          )}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onView}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
          >
            View Profile
          </button>

          {!ownProfile &&
            profile.available_for_hire && (
              <button
                type="button"
                onClick={onHire}
                className="flex-1 rounded-xl bg-orange-500 px-3 py-2.5 text-xs font-black text-white transition hover:bg-orange-600"
              >
                Hire / Connect
              </button>
            )}

          {ownProfile &&
            profile.verification_status !== "verified" && (
              <button
                type="button"
                onClick={onVerify}
                className="flex-1 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
              >
                Verify
              </button>
            )}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   MY PROFILE CARD
========================================================= */

function MyProfileCard({
  profile,
  onEdit,
  onVerify,
}: {
  profile: SportsProfile;
  onEdit: () => void;
  onVerify: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-orange-500">
            My Sports Profile
          </p>

          <h3 className="mt-1 text-xl font-black">
            {profile.name || "Unnamed Profile"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {ROLE_LABEL[profile.role]} • {profile.sport}
          </p>
        </div>

        <VerificationBadge
          status={profile.verification_status}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniInfo
          label="Level"
          value={profile.level}
        />

        <MiniInfo
          label="Position"
          value={profile.position || "—"}
        />

        <MiniInfo
          label="Location"
          value={profile.location || "—"}
        />

        <MiniInfo
          label="Hire"
          value={
            profile.available_for_hire
              ? "Available"
              : "Unavailable"
          }
        />
      </div>

      {profile.verification_note && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          <strong className="text-slate-700">
            Verification note:
          </strong>{" "}
          {profile.verification_note}
        </div>
      )}

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={profile.verification_status === "verified"}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Edit Profile
        </button>

        {profile.verification_status !== "verified" && (
          <button
            type="button"
            onClick={onVerify}
            className="flex-1 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white transition hover:bg-orange-600"
          >
            Submit Verification
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   REQUESTS PANEL
========================================================= */

function RequestsPanel({
  requests,
  myProfiles,
  currentUserId,
  onUpdate,
  saving,
}: {
  requests: HireRequest[];
  myProfiles: SportsProfile[];
  currentUserId: string | null;
  onUpdate: (
    request: HireRequest,
    status: HireStatus,
  ) => void;
  saving: boolean;
}) {
  if (!currentUserId) {
    return <LoginRequired />;
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <FileCheck2
          size={34}
          className="mx-auto text-slate-300"
        />

        <h3 className="mt-4 font-black">
          No Sports Requests Yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Hire বা Connect request এলে এখানে দেখা যাবে।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => {
        const incoming = myProfiles.some(
          (profile) =>
            profile.id === request.target_profile_id,
        );

        return (
          <div
            key={request.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag text={request.sport} />
                  <Tag text={ROLE_LABEL[request.role]} />
                  <StatusTag status={request.status} />
                </div>

                <p className="mt-3 text-sm font-black">
                  {incoming
                    ? "Incoming Hire Request"
                    : "Outgoing Hire Request"}
                </p>

                {request.position && (
                  <p className="mt-1 text-xs text-slate-500">
                    Position: {request.position}
                  </p>
                )}

                {request.location && (
                  <p className="mt-1 text-xs text-slate-500">
                    Location: {request.location}
                  </p>
                )}

                {request.event_date && (
                  <p className="mt-1 text-xs text-slate-500">
                    Event: {request.event_date}
                  </p>
                )}

                {request.message && (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {request.message}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {incoming &&
                  request.status === "pending" && (
                    <>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          onUpdate(request, "accepted")
                        }
                        className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          onUpdate(request, "rejected")
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600"
                      >
                        Reject
                      </button>
                    </>
                  )}

                {!incoming &&
                  request.status === "pending" && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        onUpdate(request, "cancelled")
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600"
                    >
                      Cancel
                    </button>
                  )}

                {incoming &&
                  request.status === "accepted" && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        onUpdate(request, "completed")
                      }
                      className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white"
                    >
                      Complete
                    </button>
                  )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   VERIFICATION BADGE
========================================================= */

function VerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  if (status === "verified") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
        <CheckCircle2 size={12} />
        Verified
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-black text-amber-700">
        <Clock3 size={12} />
        Review
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2 py-1 text-[10px] font-black text-red-700">
        <CircleAlert size={12} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-black text-slate-500">
      Not Verified
    </span>
  );
}

/* =========================================================
   STATUS TAG
========================================================= */

function StatusTag({
  status,
}: {
  status: HireStatus;
}) {
  const styles: Record<HireStatus, string> = {
    pending:
      "border-amber-200 bg-amber-50 text-amber-700",
    accepted:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected:
      "border-red-200 bg-red-50 text-red-700",
    cancelled:
      "border-slate-200 bg-slate-50 text-slate-500",
    completed:
      "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`rounded-full border px-2 py-1 text-[10px] font-black capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[94vh] w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-black">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(94vh-65px)] overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL ACTIONS
========================================================= */

function ModalActions({
  onCancel,
  saving,
  submitLabel,
}: {
  onCancel: () => void;
  saving: boolean;
  submitLabel: string;
}) {
  return (
    <div className="flex gap-2 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={saving}
        className="flex-1 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2
              size={16}
              className="animate-spin"
            />
            Saving...
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <Icon size={19} className="text-orange-400" />

      <p className="mt-4 text-2xl font-black">{value}</p>

      <p className="mt-1 text-xs text-white/40">
        {label}
      </p>
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon: Icon,
  title,
  text,
  href,
}: {
  icon: typeof Radio;
  title: string;
  text: string;
  href?: string;
}) {
  const content = (
    <div className="group h-full rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-orange-200 hover:bg-orange-50/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
        <Icon size={20} />
      </div>

      <h3 className="mt-4 font-black">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>

      {href && (
        <span className="mt-4 inline-flex text-xs font-black text-orange-600">
          Open →
        </span>
      )}
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}

/* =========================================================
   TAB BUTTON
========================================================= */

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Users;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-black transition ${
        active
          ? "bg-slate-950 text-white"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">
        {label.split(" ")[0]}
      </span>
    </button>
  );
}

/* =========================================================
   SELECT
========================================================= */

function Select({
  value,
  onChange,
  options,
  labels = {},
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={`${inputClass} appearance-none pr-10`}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {labels[option] ?? option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}

/* =========================================================
   TAG
========================================================= */

function Tag({
  text,
  positive = false,
}: {
  text: string;
  positive?: boolean;
}) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        positive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {text}
    </span>
  );
}

/* =========================================================
   MINI INFO
========================================================= */

function MiniInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-black text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY DIRECTORY
========================================================= */

function EmptyDirectory() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <Users
        size={38}
        className="mx-auto text-slate-300"
      />

      <h3 className="mt-4 font-black">
        No public sports profile found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Search filter পরিবর্তন করুন অথবা নিজের Sports Profile
        তৈরি করুন।
      </p>
    </div>
  );
}

/* =========================================================
   CREATE EMPTY
========================================================= */

function CreateProfileEmpty({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <UserRound
        size={38}
        className="mx-auto text-slate-300"
      />

      <h3 className="mt-4 font-black">
        You do not have a Sports Profile yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Player, Coach অথবা Referee হিসেবে নিজের sports identity
        তৈরি করুন।
      </p>

      <button
        type="button"
        onClick={onCreate}
        className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white"
      >
        Create Sports Profile
      </button>
    </div>
  );
}

/* =========================================================
   LOGIN REQUIRED
========================================================= */

function LoginRequired() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <ShieldCheck
        size={38}
        className="mx-auto text-slate-300"
      />

      <h3 className="mt-4 font-black">
        Login required
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Sports Profile, Hire Request এবং Verification ব্যবহার
        করতে আগে login করুন।
      </p>

      <Link
        href="/login"
        className="mt-5 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
      >
        Login
      </Link>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
      <div className="text-center">
        <Loader2
          size={30}
          className="mx-auto animate-spin text-orange-500"
        />

        <p className="mt-3 text-sm font-bold text-slate-500">
          Loading Sports...
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT STYLE
========================================================= */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";