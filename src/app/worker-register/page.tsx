"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  UserPlus,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/client";

const specialityOptions = [
  "ইটের গাঁথুনি",
  "প্লাস্টার",
  "ছাদ ঢালাই",
  "রড বাঁধাই",
  "টাইলস লাগানো",
  "মার্বেল ও গ্রানাইট",
  "স্যানিটারি কাজ",
  "পাইপলাইন",
  "ইলেকট্রিক্যাল ওয়্যারিং",
  "ইন্ডাস্ট্রিয়াল ইলেকট্রিক্যাল",
  "কাঠের দরজা-জানালা",
  "ফার্নিচার তৈরি",
  "ওয়েল্ডিং",
  "গ্যাস ওয়েল্ডিং",
  "MIG / TIG ওয়েল্ডিং",
  "বাড়ি রং করা",
  "গাড়ি রং করা",
  "AC Installation",
  "AC Repair",
  "AC Servicing",
  "গাড়ি চালানো",
  "বাস চালানো",
  "ট্রাক চালানো",
  "কৃষিকাজ",
  "ফসল সংগ্রহ",
  "পরিচ্ছন্নতার কাজ",
  "গৃহস্থালি কাজ",
  "লোডিং / আনলোডিং",
  "মেশিন অপারেটর",
  "অন্যান্য",
];

export default function RegisterWorkerPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleSkill(skill: string) {
    setSkills((previous) =>
      previous.includes(skill)
        ? previous.filter((item) => item !== skill)
        : [...previous, skill]
    );
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const cleanName = name.trim();
    const cleanRole = role.trim();
    const cleanCategory = category.trim();
    const cleanLocation = location.trim();
    const cleanPhone = phone.trim();
    const cleanExperience = experience.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (
      !cleanName ||
      !cleanRole ||
      !cleanCategory ||
      !cleanLocation ||
      !cleanPhone ||
      !cleanEmail ||
      !password
    ) {
      setError("দয়া করে প্রয়োজনীয় সব তথ্য পূরণ করুন।");
      return;
    }

    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    const customSkillList = customSkills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const skillList = Array.from(
      new Set([...skills, ...customSkillList])
    );

    setLoading(true);

    try {
      // 1. Create Supabase Auth Account

      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: cleanName,
              phone: cleanPhone,
              location: cleanLocation,
              profession: cleanRole,
              worker_category: cleanCategory,
              worker_sub_category: cleanRole,
              user_type: "worker",
              account_type: "master",
            },
          },
        });

      if (authError) {
        throw new Error(
          `Account তৈরি করা যায়নি: ${authError.message}`
        );
      }

      const userId = authData.user?.id;

      if (!userId) {
        throw new Error(
          "Account তৈরি হয়েছে, কিন্তু User ID পাওয়া যায়নি।"
        );
      }

      const now = new Date().toISOString();

      // 2. Save Master Profile

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            name: cleanName,
            phone: cleanPhone,
            location: cleanLocation,
            user_type: "worker",
            worker_category: cleanCategory,
            worker_sub_category: cleanRole,
            updated_at: now,
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        throw new Error(
          `Profile save হয়নি: ${profileError.message}`
        );
      }

      // 3. Save Worker Profile

      const { error: workerError } = await supabase
        .from("workers")
        .upsert(
          {
            id: userId,
            profile_id: userId,
            category: cleanCategory,
            sub_category: cleanRole,
            experience: cleanExperience || null,
            skills: skillList.length > 0 ? skillList : null,
            district: cleanLocation,
            location: cleanLocation,
            updated_at: now,
          },
          {
            onConflict: "id",
          }
        );

      if (workerError) {
        throw new Error(
          `Worker profile save হয়নি: ${workerError.message}`
        );
      }

      // 4. Save local user information

      try {
        localStorage.setItem(
          "shromobazar_current_user",
          JSON.stringify({
            id: userId,
            name: cleanName,
            phone: cleanPhone,
            location: cleanLocation,
            profession: cleanRole,
            category: cleanCategory,
            skills: skillList,
            email: cleanEmail,
            user_type: "worker",
            account_type: "master",
          })
        );
      } catch {
        // Local storage failure will not block registration.
      }

      // 5. Success

      setMessage(
        "নিবন্ধন সফল হয়েছে। Worker Profile তৈরি হয়েছে।"
      );

      setTimeout(() => {
        window.location.href = `/workers/${userId}`;
      }, 1200);

    } catch (error) {
      console.error("Worker registration error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "নিবন্ধন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-600"
        >
          <ArrowLeft size={18} />
          হোমে ফিরে যান
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* HEADER */}

          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-slate-950 px-6 py-8 text-white sm:px-10">
            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500">
                <UserPlus className="h-7 w-7" />
              </div>

              <div>
                <p className="text-sm text-blue-200">
                  শ্রমবাজার
                </p>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Worker নিবন্ধন
                </h1>
              </div>

            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100">
              আপনার পেশা, দক্ষতা ও কাজের অভিজ্ঞতা দিয়ে
              শ্রমবাজারে একটি professional Worker Profile তৈরি করুন।
            </p>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-7 p-6 sm:p-10"
          >

            {/* BASIC INFORMATION */}

            <section>
              <h2 className="mb-4 text-lg font-bold text-slate-800">
                ব্যক্তিগত তথ্য
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    পূর্ণ নাম *
                  </label>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    মোবাইল নম্বর *
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email *
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password *
                  </label>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                  />
                </div>

              </div>
            </section>

            {/* PROFESSIONAL INFORMATION */}

            <section className="border-t border-slate-100 pt-6">
              <h2 className="mb-4 text-lg font-bold text-slate-800">
                পেশাগত তথ্য
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    পেশা / Role *
                  </label>

                  <input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="যেমন: রাজমিস্ত্রি"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    কাজের বিভাগ / Category *
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                  >
                    <option value="">বিভাগ নির্বাচন করুন</option>
                    <option value="নির্মাণ">নির্মাণ কাজ</option>
                    <option value="ইলেকট্রিক্যাল">ইলেকট্রিক্যাল</option>
                    <option value="প্লাম্বিং">প্লাম্বিং</option>
                    <option value="কাঠ ও ফার্নিচার">কাঠ ও ফার্নিচার</option>
                    <option value="ওয়েল্ডিং">ওয়েল্ডিং</option>
                    <option value="পেইন্টিং">পেইন্টিং</option>
                    <option value="যানবাহন">যানবাহন ও ড্রাইভিং</option>
                    <option value="কৃষি">কৃষিকাজ</option>
                    <option value="পরিচ্ছন্নতা">পরিচ্ছন্নতা</option>
                    <option value="গৃহস্থালি">গৃহস্থালি সেবা</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    অভিজ্ঞতা
                  </label>

                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                  >
                    <option value="">অভিজ্ঞতা নির্বাচন করুন</option>
                    <option value="নতুন">নতুন / অভিজ্ঞতা নেই</option>
                    <option value="১ বছর">১ বছর</option>
                    <option value="২ বছর">২ বছর</option>
                    <option value="৩ বছর">৩ বছর</option>
                    <option value="৪ বছর">৪ বছর</option>
                    <option value="৫ বছর">৫ বছর</option>
                    <option value="৬-১০ বছর">৬-১০ বছর</option>
                    <option value="১০ বছরের বেশি">১০ বছরের বেশি</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    জেলা / এলাকা *
                  </label>

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="যেমন: বাগেরহাট"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                  />
                </div>

              </div>
            </section>

            {/* SPECIALITY */}

            <section className="border-t border-slate-100 pt-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  Speciality / বিশেষ দক্ষতা
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  আপনি যেসব কাজে দক্ষ, একাধিক নির্বাচন করতে পারবেন।
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {specialityOptions.map((skill) => (
                  <label
                    key={skill}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                      skills.includes(skill)
                        ? "border-orange-400 bg-orange-50 text-orange-800"
                        : "border-slate-200 bg-white text-slate-700 hover:border-orange-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={skills.includes(skill)}
                      onChange={() => toggleSkill(skill)}
                      disabled={loading}
                      className="h-4 w-4 accent-orange-500"
                    />

                    <span>{skill}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  অন্যান্য দক্ষতা
                </label>

                <input
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
                  placeholder="কমা দিয়ে লিখুন: ইটের কাজ, প্লাস্টার, টাইলস"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  একাধিক দক্ষতা লিখলে কমা দিয়ে আলাদা করুন।
                </p>
              </div>

              {skills.length > 0 && (
                <div className="mt-4 rounded-xl bg-orange-50 p-4">
                  <p className="mb-2 text-xs font-bold text-orange-800">
                    নির্বাচিত দক্ষতা: {skills.length}টি
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-orange-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* SUCCESS */}

            {message && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle size={18} />
                {message}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium leading-6 text-red-700">
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-6 font-semibold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  নিবন্ধন হচ্ছে...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Worker নিবন্ধন করুন
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}