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

export default function RegisterWorkerPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [currentWork, setCurrentWork] = useState("");
  const [skills, setSkills] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    const cleanCurrentWork = currentWork.trim();
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
      setError(
        "দয়া করে প্রয়োজনীয় সব তথ্য পূরণ করুন।"
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
      );
      return;
    }

    setLoading(true);

    try {
      // -------------------------------------------------------
      // 1. Create Supabase Auth Account
      // -------------------------------------------------------

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
              user_type: "worker",
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

      // -------------------------------------------------------
      // 2. Save Profile
      // -------------------------------------------------------

      const { error: profileError } =
        await supabase
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
              avatar_url: null,
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

      // -------------------------------------------------------
      // 3. Save Worker
      // -------------------------------------------------------

      const skillList = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const { error: workerError } =
        await supabase
          .from("workers")
          .upsert(
            {
              id: userId,
              profile_id: userId,
              category: cleanCategory,
              sub_category: cleanRole,
              experience:
                cleanExperience || null,
              skills:
                skillList.length > 0
                  ? skillList
                  : null,
              district: cleanLocation,
              location: cleanLocation,
              rating: 0,
              review_count: 0,
              created_at: now,
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

      // -------------------------------------------------------
      // 4. Save current user locally for UI convenience
      // -------------------------------------------------------

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
            email: cleanEmail,
            user_type: "worker",
          })
        );
      } catch {
        // localStorage failure should not block registration
      }

      // -------------------------------------------------------
      // 5. Success
      // -------------------------------------------------------

      setMessage(
        "নিবন্ধন সফল হয়েছে। Worker Profile তৈরি হয়েছে।"
      );

      setTimeout(() => {
        window.location.href = `/workers/${userId}`;
      }, 1000);
    } catch (error) {
      console.error(
        "Worker registration error:",
        error
      );

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
              আপনার দক্ষতা ও কাজের তথ্য দিয়ে শ্রমবাজারে
              একটি professional Worker Profile তৈরি করুন।
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-10"
          >

            <div className="grid gap-5 sm:grid-cols-2">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  পূর্ণ নাম *
                </label>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="আপনার পূর্ণ নাম"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  পেশা / Role *
                </label>

                <input
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  placeholder="যেমন: রাজমিস্ত্রি"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  কাজের ধরন / Category *
                </label>

                <input
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  placeholder="যেমন: নির্মাণ"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />
              </div>

              {/* LOCATION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  জেলা / এলাকা *
                </label>

                <input
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="যেমন: বাগেরহাট"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  মোবাইল নম্বর *
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="01XXXXXXXXX"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />
              </div>

              {/* EXPERIENCE */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  অভিজ্ঞতা
                </label>

                <input
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                  placeholder="যেমন: ৫ বছর"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email *
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="example@email.com"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password *
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* CURRENT WORK */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                বর্তমান কাজ
              </label>

              <input
                value={currentWork}
                onChange={(e) =>
                  setCurrentWork(e.target.value)
                }
                placeholder="বর্তমানে কী ধরনের কাজ করছেন?"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
              />
            </div>

            {/* SKILLS */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                দক্ষতা
              </label>

              <input
                value={skills}
                onChange={(e) =>
                  setSkills(e.target.value)
                }
                placeholder="কমা দিয়ে লিখুন: ইটের কাজ, প্লাস্টার, টাইলস"
                disabled={loading}
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-100"
              />
            </div>

            {/* SUCCESS */}
            {message && (
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                <CheckCircle size={18} />
                {message}
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
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