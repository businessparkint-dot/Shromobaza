"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Heart,
  Lightbulb,
  MapPin,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { supabase } from "@/lib/client";

type StudentData = {
  name: string;
  location: string;
  institution: string;
  level: string;
  department: string;
  skills: string[];
  interests: string[];
  goal: string;
  about: string;
};

type StudentProfileRow = {
  id: string;
  user_id: string;
  name: string | null;
  location: string | null;
  institution: string | null;
  education_level: string | null;
  department: string | null;
  career_goal: string | null;
  about: string | null;
  skills: string[] | null;
  learning_interests: string[] | null;
  profile_completion: number | null;
  is_public: boolean | null;
};

const emptyStudent: StudentData = {
  name: "",
  location: "",
  institution: "",
  level: "",
  department: "",
  skills: [],
  interests: [],
  goal: "",
  about: "",
};

const menuItems = [
  {
    title: "My Education",
    description: "Courses, classes & learning",
    icon: BookOpen,
  },
  {
    title: "Skills",
    description: "Your skills & expertise",
    icon: Sparkles,
  },
  {
    title: "Certificates",
    description: "Certificates & achievements",
    icon: Award,
  },
  {
    title: "Research & Projects",
    description: "Your academic work",
    icon: Lightbulb,
  },
];

export default function StudentProfilePage() {
  const [student, setStudent] = useState<StudentData>(emptyStudent);
  const [avatarUrl, setAvatarUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadStudentProfile();
  }, []);

  const profileCompletion = useMemo(() => {
    const checks = [
      student.name.trim(),
      student.location.trim(),
      student.institution.trim(),
      student.level.trim(),
      student.department.trim(),
      student.goal.trim(),
      student.about.trim(),
      student.skills.length > 0 ? "yes" : "",
      student.interests.length > 0 ? "yes" : "",
    ];

    const completed = checks.filter(Boolean).length;

    return Math.round((completed / checks.length) * 100);
  }, [student]);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        setError("Please login to view your student profile.");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("student_profiles")
        .select(
          `
          id,
          user_id,
          name,
          location,
          institution,
          education_level,
          department,
          career_goal,
          about,
          skills,
          learning_interests,
          profile_completion,
          is_public
        `
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Load main profile information including profile photo.
      const { data: mainProfile, error: mainProfileError } = await supabase
        .from("profiles")
        .select("name, location, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (mainProfileError) {
        console.error(
          "Main profile lookup error:",
          mainProfileError.message
        );
      }

      if (mainProfile?.avatar_url) {
        setAvatarUrl(mainProfile.avatar_url);
      }

      if (data) {
        const profile = data as StudentProfileRow;

        setStudent({
          name: profile.name || mainProfile?.name || "",
          location: profile.location || mainProfile?.location || "",
          institution: profile.institution || "",
          level: profile.education_level || "",
          department: profile.department || "",
          skills: profile.skills || [],
          interests: profile.learning_interests || [],
          goal: profile.career_goal || "",
          about: profile.about || "",
        });

        return;
      }

      // No student profile yet.
      // Try main profile and auth metadata.
      const metadata = user.user_metadata || {};

      const initialData: StudentData = {
        name:
          mainProfile?.name ||
          metadata.full_name ||
          metadata.name ||
          "",
        location:
          mainProfile?.location ||
          metadata.location ||
          "Bangladesh",
        institution: "",
        level: "Student",
        department: "",
        skills: [],
        interests: [],
        goal: "",
        about: "",
      };

      setStudent(initialData);

      // Create an initial row so the student has a real DB profile.
      const completion = calculateCompletion(initialData);

      const { error: insertError } = await supabase
        .from("student_profiles")
        .insert({
          user_id: user.id,
          name: initialData.name || null,
          location: initialData.location || null,
          institution: null,
          education_level: initialData.level || null,
          department: null,
          career_goal: null,
          about: null,
          skills: [],
          learning_interests: [],
          profile_completion: completion,
          is_public: true,
        });

      if (insertError) {
        console.error("Student profile creation error:", insertError);
      }
    } catch (err) {
      console.error("Load student profile error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not load student profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadProfilePhoto = async (file: File) => {
    try {
      setUploadingPhoto(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error("Please login before uploading a profile photo.");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }

      // Keep profile images reasonably small.
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Profile photo must be smaller than 5 MB.");
      }

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeExtension =
        extension === "jpeg" ||
        extension === "jpg" ||
        extension === "png" ||
        extension === "webp"
          ? extension
          : "jpg";

      const filePath = `${user.id}/profile-${Date.now()}.${safeExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("student-profile-photos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("student-profile-photos")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      if (!publicUrl) {
        throw new Error("Could not create profile photo URL.");
      }

      // Save photo URL to the main user profile.
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: publicUrl,
        })
        .eq("id", user.id);

      if (profileUpdateError) {
        throw new Error(profileUpdateError.message);
      }

      setAvatarUrl(publicUrl);

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Profile photo upload error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not upload profile photo."
      );
    } finally {
      setUploadingPhoto(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const updateField = (field: keyof StudentData, value: string) => {
    setStudent((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addSkill = () => {
    const value = newSkill.trim();

    if (!value) return;

    const exists = student.skills.some(
      (skill) => skill.toLowerCase() === value.toLowerCase()
    );

    if (!exists) {
      setStudent((current) => ({
        ...current,
        skills: [...current.skills, value],
      }));
    }

    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setStudent((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill),
    }));
  };

  const addInterest = () => {
    const value = newInterest.trim();

    if (!value) return;

    const exists = student.interests.some(
      (interest) => interest.toLowerCase() === value.toLowerCase()
    );

    if (!exists) {
      setStudent((current) => ({
        ...current,
        interests: [...current.interests, value],
      }));
    }

    setNewInterest("");
  };

  const removeInterest = (interest: string) => {
    setStudent((current) => ({
      ...current,
      interests: current.interests.filter((item) => item !== interest),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        throw new Error("Please login before saving your profile.");
      }

      const completion = calculateCompletion(student);

      const payload = {
        user_id: user.id,
        name: student.name.trim() || null,
        location: student.location.trim() || null,
        institution: student.institution.trim() || null,
        education_level: student.level.trim() || null,
        department: student.department.trim() || null,
        career_goal: student.goal.trim() || null,
        about: student.about.trim() || null,
        skills: student.skills,
        learning_interests: student.interests,
        profile_completion: completion,
      };

      const { error: saveError } = await supabase
        .from("student_profiles")
        .upsert(payload, {
          onConflict: "user_id",
        });

      if (saveError) {
        throw new Error(saveError.message);
      }

      setEditing(false);
      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error("Save student profile error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Could not save your student profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/education"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-violet-600" />
                <h1 className="text-lg font-extrabold sm:text-xl">
                  Student Profile
                </h1>
              </div>

              <p className="text-xs text-slate-500">
                Loading your education profile...
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Loading student profile...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !student.name && !student.institution) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/education"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <h1 className="text-lg font-extrabold">
                Student Profile
              </h1>

              <p className="text-xs text-slate-500">
                Your education, skills & achievements
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-xl px-4 py-12">
          <section className="rounded-3xl border border-red-200 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-xl font-black">
              Student Profile Unavailable
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error}
            </p>

            <div className="mt-5 flex justify-center gap-2">
              <Link
                href="/login"
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
              >
                Login
              </Link>

              <Link
                href="/education"
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700"
              >
                Education
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/education"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-violet-600" />

                <h1 className="text-lg font-extrabold sm:text-xl">
                  Student Profile
                </h1>
              </div>

              <p className="text-xs text-slate-500">
                Your education, skills & achievements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saved && (
              <span className="hidden items-center gap-1 text-sm font-semibold text-emerald-600 sm:flex">
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </span>
            )}

            {editing ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving ? "Saving..." : "Save"}
              </button>
            ) : (
              <button
                onClick={() => {
                  setError("");
                  setEditing(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Profile Hero */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 sm:h-40" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-violet-100 to-indigo-100 shadow-lg sm:h-32 sm:w-32">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Student profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-14 w-14 text-violet-500 sm:h-16 sm:w-16" />
                    )}
                  </div>

                  {editing && (
                    <>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        aria-label="Upload profile photo"
                        className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {uploadingPhoto ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            uploadProfilePhoto(file);
                          }
                        }}
                      />
                    </>
                  )}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-black sm:text-3xl">
                      {student.name || "Your Name"}
                    </h2>

                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Student
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {student.location || "Bangladesh"}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      {student.institution || "Add your institution"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/education"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Explore Education
                </Link>

                <Link
                  href="/chat"
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
                >
                  Connect
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Courses",
              value: "0",
              icon: BookOpen,
              href: "/education",
            },
            {
              label: "Skills",
              value: student.skills.length,
              icon: Sparkles,
              href: "#skills",
            },
            {
              label: "Certificates",
              value: "0",
              icon: Award,
              href: "#certificates",
            },
            {
              label: "Projects",
              value: "0",
              icon: Lightbulb,
              href: "#projects",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <a
                key={stat.label}
                href={stat.href}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </a>
            );
          })}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Personal / Education Details */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">
                    Student Details
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Keep your academic profile up to date.
                  </p>
                </div>

                <GraduationCap className="h-7 w-7 text-violet-500" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Student Name"
                  value={student.name}
                  editing={editing}
                  onChange={(value) => updateField("name", value)}
                />

                <Field
                  label="Location"
                  value={student.location}
                  editing={editing}
                  onChange={(value) => updateField("location", value)}
                />

                <Field
                  label="School / College / University"
                  value={student.institution}
                  editing={editing}
                  onChange={(value) =>
                    updateField("institution", value)
                  }
                />

                <Field
                  label="Class / Degree / Level"
                  value={student.level}
                  editing={editing}
                  onChange={(value) => updateField("level", value)}
                />

                <Field
                  label="Subject / Department"
                  value={student.department}
                  editing={editing}
                  onChange={(value) =>
                    updateField("department", value)
                  }
                />

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Career Goal
                  </label>

                  {editing ? (
                    <textarea
                      value={student.goal}
                      onChange={(e) =>
                        updateField("goal", e.target.value)
                      }
                      rows={3}
                      placeholder="Example: Become a software engineer..."
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      {student.goal || "Add your career goal."}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    About Me
                  </label>

                  {editing ? (
                    <textarea
                      value={student.about}
                      onChange={(e) =>
                        updateField("about", e.target.value)
                      }
                      rows={4}
                      placeholder="Tell people about your education, interests, skills and goals..."
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                      {student.about || "Add something about yourself."}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Skills */}
            <section
              id="skills"
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">Skills</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Skills help employers and creators understand your
                    abilities.
                  </p>
                </div>

                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>

              {student.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3.5 py-2 text-sm font-bold text-violet-700"
                    >
                      {skill}

                      {editing && (
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="rounded-full hover:bg-violet-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
                  No skills added yet.
                </div>
              )}

              {editing && (
                <div className="mt-5 flex gap-2">
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-500 focus:bg-white"
                  />

                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              )}
            </section>

            {/* Interests */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">
                    Learning Interests
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Choose subjects you want to learn more about.
                  </p>
                </div>

                <Heart className="h-6 w-6 text-rose-500" />
              </div>

              {student.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {student.interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-2 text-sm font-bold text-rose-700"
                    >
                      {interest}

                      {editing && (
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="rounded-full hover:bg-rose-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
                  No learning interests added yet.
                </div>
              )}

              {editing && (
                <div className="mt-5 flex gap-2">
                  <input
                    value={newInterest}
                    onChange={(e) =>
                      setNewInterest(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                    placeholder="Add an interest..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-rose-500 focus:bg-white"
                  />

                  <button
                    type="button"
                    onClick={addInterest}
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              )}
            </section>

            {/* Certificates */}
            <section
              id="certificates"
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                  <Award className="h-8 w-8" />
                </div>

                <h3 className="mt-4 text-lg font-black">
                  Certificates & Achievements
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Your certificates, academic achievements and completed
                  courses will appear here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Certificate management will be connected in the next Education database phase."
                    )
                  }
                  className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Certificate
                </button>
              </div>
            </section>

            {/* Projects */}
            <section
              id="projects"
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Lightbulb className="h-8 w-8" />
                </div>

                <h3 className="mt-4 text-lg font-black">
                  Research & Projects
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Add your academic projects, research work, publications and
                  creative work.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Research & Projects database will be connected in the next Education phase."
                    )
                  }
                  className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Add Project
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Profile Completion */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-black">Profile Completion</h3>

                <span className="text-sm font-black text-violet-600">
                  {profileCompletion}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Add education details, skills, interests and career goals to
                strengthen your profile.
              </p>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setEditing(true);
                }}
                className="mt-4 w-full rounded-xl bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-700 transition hover:bg-violet-100"
              >
                Complete Profile
              </button>
            </section>

            {/* Education Menu */}
            <section className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => {
                      if (item.title === "Skills") {
                        document
                          .getElementById("skills")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }

                      if (item.title === "Certificates") {
                        document
                          .getElementById("certificates")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }

                      if (item.title === "Research & Projects") {
                        document
                          .getElementById("projects")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }

                      if (item.title === "My Education") {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className="group flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">
                        {item.title}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {item.description}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                  </button>
                );
              })}
            </section>

            {/* Career Connection */}
            <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-5 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <BriefcaseBusiness className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-lg font-black">
                Build Your Future
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/70">
                Your education profile can later connect with skills, jobs,
                employers, creators and Shromo Connect.
              </p>

              <Link
                href="/jobs"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                Explore Jobs
                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>
          </aside>
        </div>

        {/* Bottom CTA */}
        <section className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6" />

                <span className="text-sm font-bold uppercase tracking-wider text-white/80">
                  Shromo Education
                </span>
              </div>

              <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                Learn. Create. Grow.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
                Discover courses, classes, lectures, books, research and
                skills—and build your professional future.
              </p>
            </div>

            <Link
              href="/education"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-violet-700 transition hover:bg-slate-100"
            >
              Explore Education
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function calculateCompletion(student: StudentData) {
  const checks = [
    student.name.trim(),
    student.location.trim(),
    student.institution.trim(),
    student.level.trim(),
    student.department.trim(),
    student.goal.trim(),
    student.about.trim(),
    student.skills.length > 0 ? "yes" : "",
    student.interests.length > 0 ? "yes" : "",
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
}

function Field({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
        />
      ) : (
        <div className="min-h-[46px] rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          {value || "Not added yet"}
        </div>
      )}
    </div>
  );
}
