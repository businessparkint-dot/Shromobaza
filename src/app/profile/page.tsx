"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronDown,
  Building2,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/client";

type UserType = "worker" | "employer" | "customer";

type Profile = {
  id: string;
  name: string;
  phone: string | null;
  location: string | null;
  user_type: UserType;
  worker_category: string | null;
  worker_sub_category: string | null;
  employer_type: string | null;
  avatar_url: string | null;
};

type Employer = {
  id: string;
  profile_id: string;
  employer_type: string | null;
  company_name: string | null;
  description: string | null;
};

const districts = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ",
  "বাগেরহাট",
  "বান্দরবান",
  "ব্রাহ্মণবাড়িয়া",
  "চাঁদপুর",
  "চাঁপাইনবাবগঞ্জ",
  "কুমিল্লা",
  "কক্সবাজার",
  "দিনাজপুর",
  "ফরিদপুর",
  "গাজীপুর",
  "গাইবান্ধা",
  "হবিগঞ্জ",
  "জামালপুর",
  "ঝালকাঠি",
  "ঝিনাইদহ",
  "জয়পুরহাট",
  "কিশোরগঞ্জ",
  "কুড়িগ্রাম",
  "কুষ্টিয়া",
  "লক্ষ্মীপুর",
  "লালমনিরহাট",
  "মাদারীপুর",
  "মাগুরা",
  "মানিকগঞ্জ",
  "মেহেরপুর",
  "মৌলভীবাজার",
  "মুন্সিগঞ্জ",
  "নওগাঁ",
  "নড়াইল",
  "নারায়ণগঞ্জ",
  "নরসিংদী",
  "নাটোর",
  "নেত্রকোণা",
  "নীলফামারী",
  "নোয়াখালী",
  "পাবনা",
  "পঞ্চগড়",
  "পটুয়াখালী",
  "পিরোজপুর",
  "রাজবাড়ী",
  "শরীয়তপুর",
  "শেরপুর",
  "সাতক্ষীরা",
  "সিরাজগঞ্জ",
  "সুনামগঞ্জ",
  "ঠাকুরগাঁও",
];

const occupations = [
  "শ্রমিক",
  "মিস্ত্রি",
  "ইলেকট্রিশিয়ান",
  "প্লাম্বার",
  "কার্পেন্টার",
  "রাজমিস্ত্রি",
  "টাইলস মিস্ত্রি",
  "রং মিস্ত্রি",
  "ওয়েল্ডার",
  "ড্রাইভার",
  "টেকনিশিয়ান",
  "ফটোগ্রাফার",
  "ক্যাটারিং",
  "সার্ভিস",
  "ইভেন্ট ম্যানেজমেন্ট",
  "সরবরাহকারী",
  "ব্যবসায়ী",
  "অন্যান্য",
];

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10";

const selectClass =
  "h-12 w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 pr-10 text-sm text-white outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10";

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [employer, setEmployer] =
    useState<Employer | null>(null);

  const [email, setEmail] =
    useState("");

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [district, setDistrict] =
    useState("");

  const [userType, setUserType] =
    useState<UserType>("customer");

  const [occupation, setOccupation] =
    useState("");

  const [employerType, setEmployerType] =
    useState("");

  const [companyName, setCompanyName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [skill, setSkill] =
    useState("");

  const [photoPreview, setPhotoPreview] =
    useState<string | null>(null);

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * ==========================================
   * LOAD PROFILE
   * ==========================================
   */

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError(
          "আপনার login session পাওয়া যায়নি। আগে Login করুন।",
        );
        return;
      }

      setEmail(
        session.user.email || "",
      );

      const response = await fetch(
        "/api/profile",
        {
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Profile load failed.",
        );
      }

      const loadedProfile =
        data.profile as Profile | null;

      const loadedEmployer =
        data.employer as Employer | null;

      setProfile(loadedProfile);
      setEmployer(loadedEmployer);

      if (loadedProfile) {
        setName(
          loadedProfile.name || "",
        );

        setPhone(
          loadedProfile.phone || "",
        );

        setDistrict(
          loadedProfile.location || "",
        );

        setUserType(
          loadedProfile.user_type ||
            "customer",
        );

        setOccupation(
          loadedProfile.worker_category ||
            "",
        );

        setEmployerType(
          loadedProfile.employer_type ||
            loadedEmployer?.employer_type ||
            "",
        );

        setPhotoPreview(
          loadedProfile.avatar_url ||
            null,
        );
      }

      if (loadedEmployer) {
        setCompanyName(
          loadedEmployer.company_name ||
            "",
        );

        setDescription(
          loadedEmployer.description ||
            "",
        );

        setEmployerType(
          loadedEmployer.employer_type ||
            "",
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Profile load failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ==========================================
   * PHOTO
   * ==========================================
   */

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "ছবির size 5MB-এর মধ্যে হতে হবে।",
      );
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError(
        "শুধু JPG, PNG অথবা WebP ছবি ব্যবহার করুন।",
      );
      return;
    }

    setError("");
    setPhotoFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPhotoPreview(previewUrl);
  }

  /*
   * ==========================================
   * SAVE
   * ==========================================
   */

  async function saveProfile() {
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Login session পাওয়া যায়নি।",
        );
      }

      const formData =
        new FormData();

      formData.append(
        "name",
        name.trim(),
      );

      formData.append(
        "phone",
        phone.trim(),
      );

      formData.append(
        "location",
        district,
      );

      formData.append(
        "userType",
        userType,
      );

      formData.append(
        "occupation",
        occupation,
      );

      formData.append(
        "skill",
        skill.trim(),
      );

      formData.append(
        "employerType",
        employerType,
      );

      formData.append(
        "companyName",
        companyName.trim(),
      );

      formData.append(
        "description",
        description.trim(),
      );

      if (photoFile) {
        formData.append(
          "photo",
          photoFile,
        );
      }

      const response =
        await fetch(
          "/api/profile",
          {
            method: "PATCH",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
            body: formData,
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.details ||
            "Profile save failed.",
        );
      }

      if (data.profile) {
        setProfile(
          data.profile,
        );

        setPhotoPreview(
          data.profile.avatar_url ||
            null,
        );

        setUserType(
          data.profile.user_type ||
            userType,
        );
      }

      if (data.employer) {
        setEmployer(
          data.employer,
        );
      }

      setPhotoFile(null);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Profile save failed.",
      );
    } finally {
      setSaving(false);
    }
  }

  function getUserTypeLabel() {
    if (userType === "worker") {
      return "কর্মী";
    }

    if (userType === "employer") {
      return "Shopkeeper / Employer";
    }

    return "সাধারণ ব্যবহারকারী";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-orange-500" />

          <p className="mt-4 text-sm text-slate-400">
            Profile loading...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-4 sm:px-6">

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-[3px_3px_0px_#f97316]">
              <span className="font-black italic">
                S
              </span>
            </div>

            <span className="hidden text-sm font-black sm:block">
              Shromobazar
            </span>
          </div>

        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">

        {/* TITLE */}

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
            My Profile
          </p>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            আপনার Profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            আপনার পরিচয়, পেশা, Employer information এবং
            profile photo পরিচালনা করুন।
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* PROFILE HEADER */}

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-6 sm:p-7">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* PHOTO */}

            <div className="relative shrink-0">

              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-slate-800 text-orange-400 shadow-xl">

                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-10 w-10" />
                )}

              </div>

              <label
                htmlFor="profile-photo"
                className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg transition hover:bg-orange-600"
                title="Profile photo change"
              >
                <Camera className="h-5 w-5" />

                <input
                  id="profile-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={
                    handlePhotoChange
                  }
                />
              </label>

            </div>

            {/* INFO */}

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-xl font-black">
                  {name ||
                    "শ্রমবাজার ব্যবহারকারী"}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Account Active
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-400">
                {getUserTypeLabel()}
              </p>

              {phone && (
                <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  {phone}
                </p>
              )}

              {email && (
                <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  {email}
                </p>
              )}

            </div>

            <div className="rounded-xl border border-emerald-400/10 bg-emerald-500/5 px-4 py-3 text-center">
              <ShieldCheck className="mx-auto h-5 w-5 text-emerald-400" />

              <p className="mt-1 text-[10px] font-bold text-emerald-300">
                Verification
              </p>

              <p className="text-[9px] text-slate-600">
                Pending
              </p>
            </div>

          </div>

          <p className="mt-5 text-xs text-slate-600">
            Profile photo পরিবর্তন করতে ছবির নিচের
            camera button চাপুন।
          </p>

        </section>

        {/* BASIC INFORMATION */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">

          <div className="mb-6">
            <h2 className="text-lg font-black">
              Basic Information
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              আপনার account-এর মূল তথ্য।
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            <Field
              label="পূর্ণ নাম"
              icon={<UserRound />}
            >
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="আপনার নাম"
                className={inputClass}
              />
            </Field>

            <Field
              label="মোবাইল নম্বর"
              icon={<Phone />}
            >
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="01XXXXXXXXX"
                className={inputClass}
              />
            </Field>

            <Field
              label="Email"
              icon={<Mail />}
            >
              <input
                value={email}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-70`}
              />
            </Field>

            <Field
              label="Account Type"
              icon={<UserRound />}
            >
              <SelectWrapper>
                <select
                  value={userType}
                  onChange={(e) =>
                    setUserType(
                      e.target.value as UserType,
                    )
                  }
                  className={selectClass}
                >
                  <option value="worker">
                    কর্মী
                  </option>

                  <option value="employer">
                    Shopkeeper / Employer
                  </option>

                  <option value="customer">
                    সাধারণ ব্যবহারকারী
                  </option>
                </select>
              </SelectWrapper>
            </Field>

            <Field
              label="জেলা"
              icon={<MapPin />}
            >
              <SelectWrapper>
                <select
                  value={district}
                  onChange={(e) =>
                    setDistrict(
                      e.target.value,
                    )
                  }
                  className={selectClass}
                >
                  <option value="">
                    জেলা নির্বাচন করুন
                  </option>

                  {districts.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ),
                  )}
                </select>
              </SelectWrapper>
            </Field>

          </div>

        </section>

        {/* EMPLOYER */}

        {userType === "employer" && (
          <section className="mt-8 rounded-3xl border border-blue-400/10 bg-gradient-to-br from-blue-950/40 to-slate-900 p-5 sm:p-7">

            <div className="mb-6 flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-lg font-black">
                  Employer / Business Profile
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  আপনার business বা employer identity
                  সম্পূর্ণ করুন।
                </p>
              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Field
                label="Employer Type"
                icon={<Building2 />}
              >
                <SelectWrapper>
                  <select
                    value={employerType}
                    onChange={(e) =>
                      setEmployerType(
                        e.target.value,
                      )
                    }
                    className={selectClass}
                  >
                    <option value="">
                      Employer Type নির্বাচন করুন
                    </option>

                    <option value="business">
                      Business
                    </option>

                    <option value="shopkeeper">
                      Shopkeeper
                    </option>

                    <option value="company">
                      Company
                    </option>

                    <option value="contractor">
                      Contractor
                    </option>

                    <option value="individual">
                      Individual Employer
                    </option>

                    <option value="organization">
                      Organization
                    </option>
                  </select>
                </SelectWrapper>
              </Field>

              <Field
                label="Company / Business Name"
                icon={<Building2 />}
              >
                <input
                  value={companyName}
                  onChange={(e) =>
                    setCompanyName(
                      e.target.value,
                    )
                  }
                  placeholder="আপনার Business / Company Name"
                  className={inputClass}
                />
              </Field>

            </div>

            <div className="mt-5">

              <Field
                label="Business / Employer Description"
                icon={<Building2 />}
              >
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value,
                    )
                  }
                  rows={5}
                  placeholder="আপনার business, কাজের ধরন বা employer information লিখুন..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10"
                />
              </Field>

            </div>

          </section>
        )}

        {/* WORKER */}

        {userType === "worker" && (
          <section className="mt-8 rounded-3xl border border-orange-400/10 bg-orange-500/5 p-5 sm:p-7">

            <div className="mb-6">
              <h2 className="text-lg font-black">
                Worker Information
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                আপনার পেশা ও দক্ষতা।
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <Field
                label="পেশা"
                icon={<UserRound />}
              >
                <SelectWrapper>
                  <select
                    value={occupation}
                    onChange={(e) =>
                      setOccupation(
                        e.target.value,
                      )
                    }
                    className={selectClass}
                  >
                    <option value="">
                      পেশা নির্বাচন করুন
                    </option>

                    {occupations.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ),
                    )}
                  </select>
                </SelectWrapper>
              </Field>

              <Field
                label="দক্ষতা"
                icon={<ShieldCheck />}
              >
                <input
                  value={skill}
                  onChange={(e) =>
                    setSkill(
                      e.target.value,
                    )
                  }
                  placeholder="যেমন: রাজমিস্ত্রি, painting, driving"
                  className={inputClass}
                />
              </Field>

            </div>

          </section>
        )}

        {/* SAVE */}

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-bold text-white">
                Profile Update
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                পরিবর্তনগুলো Supabase central profile-এ
                সংরক্ষণ হবে।
              </p>
            </div>

            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Profile
                </>
              )}
            </button>

          </div>

        </section>

        {/* VERIFICATION */}

        <section className="mt-8 rounded-3xl border border-blue-400/10 bg-blue-500/5 p-6">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold">
                Verified Workforce System
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                ভবিষ্যতে NID verification, verified phone/email,
                skill verification, trusted worker profile এবং
                secure communication যুক্ত হবে।
              </p>
            </div>

          </div>

        </section>

        <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
          শ্রমবাজার — Global Workforce Platform
        </footer>

      </div>
    </main>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-300">
        <span className="text-slate-500 [&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>

        {label}
      </label>

      {children}
    </div>
  );
}

/* ============================================================
   SELECT
============================================================ */

function SelectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
    </div>
  );
}