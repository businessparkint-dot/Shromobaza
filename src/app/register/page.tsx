"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react";

import { supabase } from "@/lib/client";

const districts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokati",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

const professions = [
  "Mason",
  "Rod Mason",
  "Tiles Mason",
  "Plaster Mason",
  "Brick Mason",
  "Carpenter",
  "Electrician",
  "Plumber",
  "Painter",
  "Welder",
  "Steel Worker",
  "Glass Worker",
  "Aluminium Worker",
  "AC Technician",
  "Refrigerator Technician",
  "Electronics Technician",
  "Mechanic",
  "Auto Mechanic",
  "Bike Mechanic",
  "Driver",
  "Truck Driver",
  "Bus Driver",
  "CNG Driver",
  "Rickshaw Driver",
  "Garments Worker",
  "Factory Worker",
  "Security Guard",
  "Cleaner",
  "Cook",
  "Chef",
  "Gardener",
  "Agricultural Worker",
  "Fisherman",
  "Construction Worker",
  "General Labour",
  "Technician",
  "Engineer",
  "Architect",
  "Surveyor",
  "Supervisor",
  "Other",
];

function normalizeBangladeshPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("880")) {
    return `0${digits.slice(3, 13)}`;
  }

  if (digits.startsWith("01")) {
    return digits.slice(0, 11);
  }

  if (digits.startsWith("1")) {
    return `0${digits.slice(0, 10)}`;
  }

  return digits.slice(0, 11);
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profession, setProfession] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [password, setPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredDistricts = useMemo(() => {
    const query = location.trim().toLowerCase();

    if (!query) {
      return districts.slice(0, 8);
    }

    return districts
      .filter((district) =>
        district.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [location]);

  const filteredProfessions = useMemo(() => {
    const query = profession.trim().toLowerCase();

    if (!query) {
      return professions.slice(0, 8);
    }

    return professions
      .filter((item) =>
        item.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [profession]);

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanPhone = normalizeBangladeshPhone(phone);
    const cleanLocation = location.trim();
    const cleanProfession = profession.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanNid = nid.trim();

    if (cleanName.length < 2) {
      setError("আপনার পূর্ণ নাম লিখুন।");
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setError(
        "সঠিক বাংলাদেশি মোবাইল নম্বর দিন।"
      );
      return;
    }

    if (!cleanLocation) {
      setError("আপনার জেলা নির্বাচন করুন।");
      return;
    }

    if (!cleanProfession) {
      setError("আপনার পেশা নির্বাচন করুন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("সঠিক ইমেইল ঠিকানা দিন।");
      return;
    }

    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (!agree) {
      setError(
        "নিবন্ধন করতে শ্রমবাজারের Terms & Conditions গ্রহণ করতে হবে।"
      );
      return;
    }

    setLoading(true);

    try {
      /*
       * STEP 1
       * Create Supabase Auth account.
       */

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
            phone: cleanPhone,
            location: cleanLocation,
            profession: cleanProfession,
            nid: cleanNid || null,
            user_type: "worker",
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const userId = authData.user?.id;

      if (!userId) {
        throw new Error(
          "Account তৈরি হয়েছে, কিন্তু user ID পাওয়া যায়নি।"
        );
      }

      /*
       * STEP 2
       * Create central profile.
       */

      const now = new Date().toISOString();

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            name: cleanName,
            phone: cleanPhone,
            location: cleanLocation,
            user_type: "worker",
            worker_category: cleanProfession,
            worker_sub_category: null,
            employer_type: null,
            avatar_url: null,
            created_at: now,
            updated_at: now,
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.error(
          "Registration profile error:",
          profileError
        );

        throw new Error(
          `Account তৈরি হয়েছে, কিন্তু profile save হয়নি: ${profileError.message}`
        );
      }

      /*
       * STEP 3
       * Create worker record.
       */

      const { error: workerError } = await supabase
        .from("workers")
        .upsert(
          {
            id: userId,
            profile_id: userId,
            category: cleanProfession,
            sub_category: null,
            experience: null,
            skills: null,
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
        console.error(
          "Registration worker error:",
          workerError
        );

        throw new Error(
          `Profile তৈরি হয়েছে, কিন্তু worker profile save হয়নি: ${workerError.message}`
        );
      }

      /*
       * STEP 4
       * Keep basic local session information
       * for existing frontend flows.
       *
       * Do NOT store password.
       */

      try {
        localStorage.setItem(
          "shromobazar_current_user",
          JSON.stringify({
            id: userId,
            name: cleanName,
            phone: cleanPhone,
            location: cleanLocation,
            profession: cleanProfession,
            email: cleanEmail,
            nid: cleanNid || null,
            user_type: "worker",
          })
        );
      } catch (storageError) {
        console.warn(
          "Could not save local registration data:",
          storageError
        );
      }

      /*
       * STEP 5
       * Registration complete.
       */

      setSuccess(
        "অভিনন্দন! আপনার শ্রমবাজার Worker Account সফলভাবে তৈরি হয়েছে।"
      );

      setTimeout(() => {
        router.replace("/worker/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "নিবন্ধন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Back */}
        <div className="mb-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>

        {/* Header */}
        <section className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <Wrench className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            শ্রমবাজারে নিবন্ধন করুন
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            আপনার একটি Master Account থেকেই Worker, Job, Chat,
            Marketplace এবং ভবিষ্যতের সকল শ্রমবাজার সেবা ব্যবহার
            করতে পারবেন।
          </p>
        </section>

        <form
          onSubmit={handleRegister}
          className="mx-auto max-w-5xl"
        >
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Basic Information */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/10 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    Basic Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    আপনার মৌলিক তথ্য
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Full Name
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="আপনার পূর্ণ নাম"
                      autoComplete="name"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Mobile Number
                  </label>

                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      placeholder=""
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={14}
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* District */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    District
                  </label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-500" />

                    <input
                      type="text"
                      value={location}
                      onChange={(e) =>
                        setLocation(e.target.value)
                      }
                      placeholder="আপনার জেলা লিখুন"
                      autoComplete="address-level2"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                    {location.trim() &&
                      filteredDistricts.length > 0 && (
                        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                          {filteredDistricts.map(
                            (district) => (
                              <button
                                key={district}
                                type="button"
                                onClick={() =>
                                  setLocation(district)
                                }
                                className="block w-full px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-blue-600/20 hover:text-white"
                              >
                                {district}
                              </button>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </div>

                {/* Profession */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Profession
                  </label>

                  <div className="relative">
                    <Wrench className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-slate-500" />

                    <input
                      type="text"
                      value={profession}
                      onChange={(e) =>
                        setProfession(e.target.value)
                      }
                      placeholder="আপনার পেশা লিখুন"
                      autoComplete="organization-title"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                    {profession.trim() &&
                      filteredProfessions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
                          {filteredProfessions.map(
                            (item) => (
                              <button
                                key={item}
                                type="button"
                                onClick={() =>
                                  setProfession(item)
                                }
                                className="block w-full px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-blue-600/20 hover:text-white"
                              >
                                {item}
                              </button>
                            )
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </section>

            {/* Account Information */}
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/10 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-white">
                    Account Information
                  </h2>

                  <p className="text-xs text-slate-500">
                    নিরাপদ অ্যাকাউন্ট তৈরি করুন
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="example@email.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* NID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    NID Number
                    <span className="ml-2 text-xs font-normal text-slate-500">
                      Optional
                    </span>
                  </label>

                  <input
                    type="text"
                    value={nid}
                    onChange={(e) =>
                      setNid(e.target.value)
                    }
                    placeholder="NID number"
                    autoComplete="off"
                    inputMode="numeric"
                    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    ভবিষ্যতের verification-এর জন্য ব্যবহার করা
                    যেতে পারে।
                  </p>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      autoComplete="new-password"
                      className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-12 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) =>
                      setAgree(e.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-blue-600"
                  />

                  <span className="text-sm leading-6 text-slate-400">
                    আমি শ্রমবাজারের{" "}
                    <span className="font-semibold text-white">
                      Terms & Conditions
                    </span>{" "}
                    এবং{" "}
                    <span className="font-semibold text-white">
                      Privacy Policy
                    </span>{" "}
                    গ্রহণ করছি।
                  </span>
                </label>
              </div>
            </section>
          </div>

          {/* Messages */}
          <div className="mt-6 space-y-3">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm leading-6 text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm leading-6 text-emerald-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-base font-black text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Account তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Create Worker Account
                </>
              )}
            </button>
          </div>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-500">
            আগে থেকেই Account আছে?{" "}
            <Link
              href="/login"
              className="font-bold text-blue-400 transition hover:text-blue-300"
            >
              Login করুন
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}