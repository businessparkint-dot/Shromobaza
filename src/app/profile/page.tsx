"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const CURRENT_USER_KEY = "shromobazar_current_user";

type UserType = "worker" | "employer" | "customer";

type CurrentUser = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  nid?: string;
  district?: string;
  userType?: UserType;
  occupation?: string;
  skill?: string;
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

export default function ProfilePage() {
  const [user, setUser] = useState<CurrentUser>({});
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [district, setDistrict] = useState("");
  const [userType, setUserType] = useState<UserType>("customer");
  const [occupation, setOccupation] = useState("");
  const [skill, setSkill] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);

    if (!savedUser) return;

    try {
      const parsed: CurrentUser = JSON.parse(savedUser);

      setUser(parsed);
      setName(parsed.name || "");
      setPhone(parsed.phone || "");
      setEmail(parsed.email || "");
      setNid(parsed.nid || "");
      setDistrict(parsed.district || "");
      setUserType(parsed.userType || "customer");
      setOccupation(parsed.occupation || "");
      setSkill(parsed.skill || "");
    } catch {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, []);

  const saveProfile = () => {
    const updatedUser: CurrentUser = {
      ...user,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      nid: nid.trim(),
      district,
      userType,
      occupation,
      skill: skill.trim(),
    };

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(updatedUser),
    );

    setUser(updatedUser);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const getUserTypeLabel = () => {
    if (userType === "worker") return "কর্মী";
    if (userType === "employer") return "Shopkeeper / Employer";
    return "সাধারণ ব্যবহারকারী";
  };

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
              <span className="font-black italic">S</span>
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
            আপনার পরিচয়, পেশা, দক্ষতা ও location-এর তথ্য এখানে
            পরিচালনা করুন।
          </p>

        </div>

        {/* PROFILE STATUS */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500">
              <UserRound className="h-8 w-8" />
            </div>

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-xl font-black">
                  {name || "শ্রমবাজার ব্যবহারকারী"}
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
                <p className="mt-1 text-xs text-slate-500">
                  {phone}
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

        </section>

        {/* FORM */}
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

            {/* NAME */}
            <Field
              label="পূর্ণ নাম"
              icon={<UserRound />}
            >
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম"
                className={inputClass}
              />
            </Field>

            {/* PHONE */}
            <Field
              label="মোবাইল নম্বর"
              icon={<Phone />}
            >
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className={inputClass}
              />
            </Field>

            {/* EMAIL */}
            <Field
              label="Email"
              optional
              icon={<Mail />}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={inputClass}
              />
            </Field>

            {/* NID */}
            <Field
              label="NID Number"
              optional
              icon={<ShieldCheck />}
            >
              <input
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="পরবর্তীতে verification-এর জন্য"
                className={inputClass}
              />
            </Field>

            {/* USER TYPE */}
            <Field
              label="Account Type"
              icon={<UserRound />}
            >
              <SelectWrapper>
                <select
                  value={userType}
                  onChange={(e) =>
                    setUserType(e.target.value as UserType)
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

            {/* DISTRICT */}
            <Field
              label="জেলা"
              icon={<MapPin />}
            >
              <SelectWrapper>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className={selectClass}
                >
                  <option value="">
                    জেলা নির্বাচন করুন
                  </option>

                  {districts.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
            </Field>

            {/* OCCUPATION */}
            <Field
              label="পেশা"
              icon={<UserRound />}
            >
              <SelectWrapper>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className={selectClass}
                >
                  <option value="">
                    পেশা নির্বাচন করুন
                  </option>

                  {occupations.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </SelectWrapper>
            </Field>

            {/* SKILL */}
            <Field
              label="Ordinary Skill / দক্ষতা"
              icon={<ShieldCheck />}
            >
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="যেমন: রাজমিস্ত্রি, painting, driving"
                className={inputClass}
              />
            </Field>

          </div>

          {/* SAVE */}
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-slate-600">
              Email ও NID এখন optional। ভবিষ্যতে verification চালু করা হবে।
            </p>

            <button
              type="button"
              onClick={saveProfile}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600"
            >
              {saved ? (
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

        {/* VERIFICATION ROADMAP */}
        <section className="mt-8 rounded-3xl border border-blue-400/10 bg-blue-500/5 p-6">

          <div className="flex gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>

              <h2 className="font-bold">
                ভবিষ্যতের Verified Workforce System
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                ভবিষ্যতে এই profile-এর সাথে NID verification,
                verified phone/email, skill verification, trusted
                worker profile এবং নিরাপদ communication যুক্ত করা হবে।
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
  optional,
  icon,
  children,
}: {
  label: string;
  optional?: boolean;
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

        {optional && (
          <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[8px] font-bold text-slate-600">
            OPTIONAL
          </span>
        )}

      </label>

      {children}
    </div>
  );
}

/* ============================================================
   SELECT WRAPPER
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

/* ============================================================
   STYLES
============================================================ */

const inputClass =
  "h-11 w-full rounded-xl border border-white/10 bg-slate-900 px-4 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10";

const selectClass =
  "h-11 w-full appearance-none rounded-xl border border-white/10 bg-slate-900 px-4 pr-10 text-sm text-white outline-none transition focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10";