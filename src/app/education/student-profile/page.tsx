"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ComponentType,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Award,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  ImagePlus,
  Lightbulb,
  Lock,
  MapPin,
  Pencil,
  Save,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

/* =========================================================
   TYPES
========================================================= */

type StudentData = {
  name: string;
  location: string;
  institution: string;
  level: string;
  department: string;
  skills: string;
  interests: string;
  careerGoal: string;
  about: string;
  avatarUrl: string;
  isPublic: boolean;
};

type StudentProfileRow = {
  id?: string;
  user_id?: string;
  name?: string | null;
  location?: string | null;
  institution?: string | null;
  level?: string | null;
  department?: string | null;
  skills?: string | null;
  interests?: string | null;
  career_goal?: string | null;
  about?: string | null;
  avatar_url?: string | null;
  is_public?: boolean | null;
};

type ConnectionType = "institute" | "teacher" | null;

type PermissionOption = {
  id: string;
  title: string;
  text: string;
  icon: ComponentType<{ className?: string }>;
};

/* =========================================================
   DEFAULT DATA
========================================================= */

const EMPTY_STUDENT: StudentData = {
  name: "",
  location: "",
  institution: "",
  level: "",
  department: "",
  skills: "",
  interests: "",
  careerGoal: "",
  about: "",
  avatarUrl: "",
  isPublic: true,
};

/* =========================================================
   PERMISSION OPTIONS
========================================================= */

const INSTITUTE_PERMISSIONS: PermissionOption[] = [
  {
    id: "class_time",
    title: "Class & Time",
    text: "Class, batch ও routine information",
    icon: CalendarDays,
  },
  {
    id: "results",
    title: "Results",
    text: "Published result ও grade",
    icon: Award,
  },
  {
    id: "tuition_fee",
    title: "Tuition Fee",
    text: "Fee, paid ও due information",
    icon: BriefcaseBusiness,
  },
  {
    id: "notices",
    title: "Notices",
    text: "Important institute notices",
    icon: BookOpen,
  },
];

const TEACHER_PERMISSIONS: PermissionOption[] = [
  {
    id: "class",
    title: "Class",
    text: "Class ও learning schedule",
    icon: CalendarDays,
  },
  {
    id: "subject",
    title: "Subject",
    text: "Subject বা learning area",
    icon: BookOpen,
  },
  {
    id: "learning",
    title: "Learning",
    text: "Skill ও learning support",
    icon: Lightbulb,
  },
  {
    id: "communication",
    title: "Communication",
    text: "Approved direct connection",
    icon: Users,
  },
];

/* =========================================================
   MAIN PAGE
========================================================= */

export default function StudentProfilePage() {
  const [student, setStudent] =
    useState<StudentData>(EMPTY_STUDENT);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  /* =======================================================
     CONNECTION STATE
  ======================================================= */

  const [connectionType, setConnectionType] =
    useState<ConnectionType>(null);

  const [selectedPermissions, setSelectedPermissions] =
    useState<string[]>([]);

  const [requestSent, setRequestSent] =
    useState(false);

  /* =========================================================
     LOAD STUDENT PROFILE
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadStudentProfile() {
      setLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) {
            setMessage("প্রথমে Login করুন।");
            setLoading(false);
          }
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("name, location")
          .eq("id", user.id)
          .maybeSingle();

        const { data: studentProfile } = await supabase
          .from("student_profiles")
          .select(
            "id,user_id,name,location,institution,level,department,skills,interests,career_goal,about,avatar_url,is_public"
          )
          .eq("user_id", user.id)
          .maybeSingle();

        if (!mounted) return;

        if (studentProfile) {
          const row =
            studentProfile as StudentProfileRow;

          setStudent({
            name:
              row.name ||
              profile?.name ||
              "",
            location:
              row.location ||
              profile?.location ||
              "",
            institution:
              row.institution || "",
            level:
              row.level || "",
            department:
              row.department || "",
            skills:
              row.skills || "",
            interests:
              row.interests || "",
            careerGoal:
              row.career_goal || "",
            about:
              row.about || "",
            avatarUrl:
              row.avatar_url || "",
            isPublic:
              row.is_public ?? true,
          });
        } else {
          setStudent({
            ...EMPTY_STUDENT,
            name:
              profile?.name || "",
            location:
              profile?.location || "",
          });
        }
      } catch (error) {
        console.error(
          "Student profile load error:",
          error
        );

        if (mounted) {
          setMessage(
            "Student Profile load করা যায়নি।"
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStudentProfile();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     PROFILE COMPLETION
  ========================================================= */

  const completion = useMemo(() => {
    const fields = [
      student.name,
      student.location,
      student.institution,
      student.level,
      student.department,
      student.skills,
      student.interests,
      student.careerGoal,
      student.about,
    ];

    const completed =
      fields.filter(
        (item) =>
          item.trim().length > 0
      ).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [student]);

  /* =========================================================
     UPDATE FIELD
  ========================================================= */

  function updateField<K extends keyof StudentData>(
    field: K,
    value: StudentData[K]
  ) {
    setStudent((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  async function saveProfile() {
    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("প্রথমে Login করুন।");
        setSaving(false);
        return;
      }

      const payload = {
        user_id: user.id,
        name:
          student.name || null,
        location:
          student.location || null,
        institution:
          student.institution || null,
        level:
          student.level || null,
        department:
          student.department || null,
        skills:
          student.skills || null,
        interests:
          student.interests || null,
        career_goal:
          student.careerGoal || null,
        about:
          student.about || null,
        avatar_url:
          student.avatarUrl || null,
        is_public:
          student.isPublic,
        updated_at:
          new Date().toISOString(),
      };

      const { error } =
        await supabase
          .from("student_profiles")
          .upsert(payload, {
            onConflict: "user_id",
          });

      if (error) {
        console.error(
          "Student profile save error:",
          error
        );

        setMessage(error.message);
      } else {
        setMessage(
          "Student Profile successfully saved."
        );

        setEditing(false);
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Profile save করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     PHOTO UPLOAD
  ========================================================= */

  async function handlePhotoChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage(
        "শুধু image file upload করুন।"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage(
        "Photo size 5MB-এর মধ্যে রাখুন।"
      );
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("প্রথমে Login করুন।");
        return;
      }

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const filePath =
        `${user.id}/student-profile-${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from(
            "student-profile-photos"
          )
          .upload(
            filePath,
            file,
            {
              upsert: true,
              contentType:
                file.type,
            }
          );

      if (uploadError) {
        console.error(
          uploadError
        );

        setMessage(
          uploadError.message
        );

        return;
      }

      const { data } =
        supabase.storage
          .from(
            "student-profile-photos"
          )
          .getPublicUrl(
            filePath
          );

      updateField(
        "avatarUrl",
        data.publicUrl
      );

      setMessage(
        "Profile photo selected. Save Profile চাপুন।"
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Photo upload করা যায়নি।"
      );
    }
  }

  /* =========================================================
     CONNECTION
  ========================================================= */

  function openConnection(
    type: Exclude<
      ConnectionType,
      null
    >
  ) {
    setConnectionType(type);
    setSelectedPermissions([]);
    setRequestSent(false);
    setMessage("");
  }

  function closeConnection() {
    setConnectionType(null);
    setSelectedPermissions([]);
    setRequestSent(false);
  }

  function togglePermission(
    permissionId: string
  ) {
    setSelectedPermissions(
      (current) =>
        current.includes(
          permissionId
        )
          ? current.filter(
              (id) =>
                id !==
                permissionId
            )
          : [
              ...current,
              permissionId,
            ]
    );
  }

  function sendPermissionRequest() {
    if (
      selectedPermissions.length ===
      0
    ) {
      setMessage(
        "কমপক্ষে একটি permission নির্বাচন করুন।"
      );
      return;
    }

    /*
      IMPORTANT:
      Current project schema-তে আলাদা connection/request
      table নিশ্চিত না থাকায় এখানে fake Supabase insert
      করা হচ্ছে না।

      UI request state সফলভাবে complete করা হচ্ছে।
      পরবর্তীতে real connection table/API যোগ হলে
      এই function-এর ভিতরেই backend request বসানো যাবে।
    */

    setRequestSent(true);
  }

  /* =========================================================
     ESC KEY + BODY LOCK
  ========================================================= */

  useEffect(() => {
    if (!connectionType) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (
        event.key === "Escape"
      ) {
        closeConnection();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [connectionType]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-600">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />

              Student Profile loading...
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />

            Education
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-bold text-slate-500 sm:block">
              My Education Space
            </span>

            {!editing ? (
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setEditing(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4" />

                Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />

                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* PROFILE HERO */}

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-orange-500 via-orange-400 to-slate-900" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-slate-100 shadow-lg">
                    {student.avatarUrl ? (
                      <img
                        src={
                          student.avatarUrl
                        }
                        alt={
                          student.name ||
                          "Student"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-12 w-12 text-slate-400" />
                    )}
                  </div>

                  {editing && (
                    <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow-lg">
                      <ImagePlus className="h-5 w-5" />

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={
                          handlePhotoChange
                        }
                      />
                    </label>
                  )}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                      {student.name ||
                        "Student Profile"}
                    </h1>

                    {student.isPublic && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />

                        Public
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                    {student.institution && (
                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4" />

                        {student.institution}
                      </span>
                    )}

                    {student.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />

                        {student.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:min-w-52">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600">
                    Profile Completion
                  </span>

                  <span className="font-black text-slate-900">
                    {completion}%
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all"
                    style={{
                      width: `${completion}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
            <span>
              {message}
            </span>

            <button
              type="button"
              onClick={() =>
                setMessage("")
              }
              className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* LEFT */}

          <section className="space-y-6">
            {/* STUDENT INFORMATION */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">
                    Student Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    আপনার basic academic ও
                    personal information
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-2.5 text-orange-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <ProfileField
                  label="Full Name"
                  value={
                    student.name
                  }
                  editing={
                    editing
                  }
                  onChange={(value) =>
                    updateField(
                      "name",
                      value
                    )
                  }
                  placeholder="আপনার নাম"
                />

                <ProfileField
                  label="Location"
                  value={
                    student.location
                  }
                  editing={
                    editing
                  }
                  onChange={(value) =>
                    updateField(
                      "location",
                      value
                    )
                  }
                  placeholder="District / City"
                />

                <ProfileField
                  label="Institution"
                  value={
                    student.institution
                  }
                  editing={
                    editing
                  }
                  onChange={(value) =>
                    updateField(
                      "institution",
                      value
                    )
                  }
                  placeholder="School / College / University / Institute"
                />

                <ProfileField
                  label="Level"
                  value={
                    student.level
                  }
                  editing={
                    editing
                  }
                  onChange={(value) =>
                    updateField(
                      "level",
                      value
                    )
                  }
                  placeholder="School / College / University / Skill"
                />

                <ProfileField
                  label="Department / Subject"
                  value={
                    student.department
                  }
                  editing={
                    editing
                  }
                  onChange={(value) =>
                    updateField(
                      "department",
                      value
                    )
                  }
                  placeholder="Department or subject"
                />

                <ProfileField
                  label="Career Goal"
                  value={
                    student.careerGoal
                  }
                  editing={
                    editing
                  }
                  onChange={(value) =>
                    updateField(
                      "careerGoal",
                      value
                    )
                  }
                  placeholder="আপনার লক্ষ্য"
                />
              </div>

              <div className="mt-4">
                <ProfileField
                  label="Skills"
                  value={
                    student.skills
                  }
                  editing={
                    editing
                  }
                  onChange={(value) =>
                    updateField(
                      "skills",
                      value
                    )
                  }
                  placeholder="যেমন: Computer, Design, Programming"
                />
              </div>

              <div className="mt-4">
                <ProfileField
                  label="Interests"
                  value={
                    student.interests
                  }
                  editing={
                    editing
                  }
                  onChange={(value) =>
                    updateField(
                      "interests",
                      value
                    )
                  }
                  placeholder="আপনার আগ্রহ"
                />
              </div>

              <div className="mt-4">
                <ProfileField
                  label="About Me"
                  value={
                    student.about
                  }
                  editing={
                    editing
                  }
                  onChange={(value) =>
                    updateField(
                      "about",
                      value
                    )
                  }
                  placeholder="নিজের সম্পর্কে সংক্ষেপে লিখুন"
                  textarea
                />
              </div>

              {editing && (
                <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="font-bold">
                      Public Student Profile
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      অন্যরা আপনার public
                      profile দেখতে পারবে।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      updateField(
                        "isPublic",
                        !student.isPublic
                      )
                    }
                    className={`relative h-7 w-12 rounded-full transition ${
                      student.isPublic
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                    aria-label="Toggle public profile"
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        student.isPublic
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* MY EDUCATION SPACE */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div>
                <h2 className="text-xl font-black">
                  My Education Space
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Institute-এর সাথে connection হলে
                  প্রয়োজনীয় education information
                  এখানে দেখা যাবে।
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <EducationSpaceCard
                  icon={
                    CalendarDays
                  }
                  title="Class & Routine"
                  text="Class, batch, teacher ও routine"
                />

                <EducationSpaceCard
                  icon={Award}
                  title="Results"
                  text="Published result, grade ও academic progress"
                />

                <EducationSpaceCard
                  icon={
                    BriefcaseBusiness
                  }
                  title="Tuition Fee"
                  text="Fee, paid ও due information"
                />

                <EducationSpaceCard
                  icon={
                    BookOpen
                  }
                  title="Certificates"
                  text="Certificates ও academic documents"
                />
              </div>
            </div>

            {/* EXTRA */}

            <div className="grid gap-6 sm:grid-cols-2">
              <EmptyFeatureCard
                icon={Award}
                title="Certificates"
                text="আপনার verified certificates ভবিষ্যতে এখানে রাখা যাবে।"
              />

              <EmptyFeatureCard
                icon={
                  Lightbulb
                }
                title="Projects & Research"
                text="আপনার project, research ও creative work দেখাতে পারবেন।"
              />
            </div>
          </section>

          {/* RIGHT */}

          <aside className="space-y-6">
            {/* SMART CONNECTION */}

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-black">
                    Smart Connection
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Institute বা Teacher-এর সাথে
                    প্রয়োজনীয় information-এর
                    permission request পাঠান।
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <ConnectionCard
                  icon={
                    GraduationCap
                  }
                  title="Connect Institute"
                  text="Class, routine, result, fee ও notices"
                  onClick={() =>
                    openConnection(
                      "institute"
                    )
                  }
                />

                <ConnectionCard
                  icon={Users}
                  title="Connect Teacher / Tutor"
                  text="Class, subject, learning ও support"
                  onClick={() =>
                    openConnection(
                      "teacher"
                    )
                  }
                />
              </div>

              <div className="mt-5 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div>
                  <p className="text-sm font-bold">
                    Permission-based access
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Student-এর permission ছাড়া
                    sensitive education information
                    share হবে না।
                  </p>
                </div>
              </div>
            </section>

            {/* PRIVACY */}

            <section className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Lock className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-black">
                    Privacy First
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Student information আপনার
                    control-এ থাকবে। কোনো sensitive
                    information automaticভাবে
                    public করা হবে না।
                  </p>
                </div>
              </div>
            </section>

            {/* JOB */}

            <section className="rounded-3xl border border-orange-200 bg-orange-50 p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-orange-500 p-3 text-white">
                  <BriefcaseBusiness className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-black text-slate-900">
                    Learn → Skill → Opportunity → Work
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Education শেষ নয়—আপনার skill
                    যেন real opportunity ও কাজের
                    সাথে connect হয়।
                  </p>
                </div>
              </div>

              <Link
                href="/jobs"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Explore Jobs

                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>
          </aside>
        </div>
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-black text-slate-900">
                Shromobazar
              </p>

              <p className="mt-1">
                Education → Skill → Opportunity → Work
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p>
                Business Park International
              </p>

              <p className="mt-1">
                Education Ecosystem
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================
          CONNECTION MODAL
          IMPORTANT:
          Fixed viewport + internal scroll.
          Footer/buttons will always remain reachable.
      ===================================================== */}

      {connectionType && (
        <div
          className="fixed inset-0 z-[100] flex h-[100dvh] items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeConnection();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="connection-title"
            className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            {/* MODAL HEADER */}

            <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={
                      closeConnection
                    }
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                    aria-label="Back"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Smart Connection
                    </p>

                    <h2
                      id="connection-title"
                      className="text-lg font-black text-slate-900 sm:text-xl"
                    >
                      {connectionType ===
                      "institute"
                        ? "Connect Institute"
                        : "Connect Teacher / Tutor"}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    closeConnection
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* MODAL BODY */}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50 px-5 py-5 sm:px-6">
              {!requestSent ? (
                <>
                  <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-orange-500 p-2 text-white">
                        <ShieldCheck className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900">
                          আপনি কী access চান?
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          প্রয়োজনীয় information
                          নির্বাচন করে permission
                          request পাঠানোর foundation।
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="font-black text-slate-900">
                        প্রয়োজনীয় information
                      </h3>

                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                        {
                          selectedPermissions.length
                        }{" "}
                        selected
                      </span>
                    </div>

                    <div className="space-y-3">
                      {(connectionType ===
                      "institute"
                        ? INSTITUTE_PERMISSIONS
                        : TEACHER_PERMISSIONS
                      ).map(
                        (
                          permission
                        ) => (
                          <PermissionRow
                            key={
                              permission.id
                            }
                            option={
                              permission
                            }
                            selected={selectedPermissions.includes(
                              permission.id
                            )}
                            onClick={() =>
                              togglePermission(
                                permission.id
                              )
                            }
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />

                    <p className="text-xs leading-5 text-slate-500">
                      আপনি যে information
                      permission দেবেন, শুধু
                      সেই information-ই
                      connection-এর মাধ্যমে
                      access করার উদ্দেশ্যে
                      ব্যবহার করা হবে।
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-slate-900">
                    Permission Request Ready
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
                    আপনার selected permission
                    request প্রস্তুত হয়েছে।
                    Backend connection/request
                    system যুক্ত হলে এই request
                    সরাসরি Institute বা Teacher-এর
                    account-এ যাবে।
                  </p>

                  <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700">
                    {
                      selectedPermissions.length
                    }{" "}
                    permission selected
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}

            <div className="shrink-0 border-t border-slate-200 bg-white p-4 sm:p-5">
              {!requestSent ? (
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      closeConnection
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-4 w-4" />

                    Back
                  </button>

                  <button
                    type="button"
                    onClick={
                      sendPermissionRequest
                    }
                    disabled={
                      selectedPermissions.length ===
                      0
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />

                    Request Permission
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={
                    closeConnection
                  }
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  <Check className="h-4 w-4" />

                  Back to Student Profile
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   PROFILE FIELD
========================================================= */

function ProfileField({
  label,
  value,
  editing,
  onChange,
  placeholder,
  textarea = false,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
  textarea?: boolean;
}) {
  return (
    <div
      className={
        textarea
          ? "sm:col-span-2"
          : ""
      }
    >
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      {editing ? (
        textarea ? (
          <textarea
            value={value}
            onChange={(event) =>
              onChange(
                event.target.value
              )
            }
            placeholder={
              placeholder
            }
            rows={4}
            className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        ) : (
          <input
            value={value}
            onChange={(event) =>
              onChange(
                event.target.value
              )
            }
            placeholder={
              placeholder
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        )
      ) : (
        <div className="min-h-11 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {value || (
            <span className="text-slate-400">
              {placeholder}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   EDUCATION SPACE CARD
========================================================= */

function EducationSpaceCard({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700 transition group-hover:bg-orange-50 group-hover:text-orange-600">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY FEATURE CARD
========================================================= */

function EmptyFeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-black">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONNECTION CARD
========================================================= */

function ConnectionCard({
  icon: Icon,
  title,
  text,
  onClick,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-orange-200 hover:bg-orange-50 hover:shadow-sm"
    >
      <div className="rounded-xl bg-white p-2.5 text-slate-600 shadow-sm transition group-hover:bg-orange-500 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {text}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-orange-600" />
    </button>
  );
}

/* =========================================================
   PERMISSION ROW
========================================================= */

function PermissionRow({
  option,
  selected,
  onClick,
}: {
  option: PermissionOption;
  selected: boolean;
  onClick: () => void;
}) {
  const Icon =
    option.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-orange-300 bg-orange-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          selected
            ? "bg-orange-500 text-white"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="font-bold text-slate-900">
          {option.title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {option.text}
        </p>
      </div>

      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          selected
            ? "border-orange-500 bg-orange-500 text-white"
            : "border-slate-300 bg-white text-transparent"
        }`}
      >
        <Check className="h-4 w-4" />
      </div>
    </button>
  );
}