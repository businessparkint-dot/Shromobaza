"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Phone,
  MapPin,
  Briefcase,
  Mail,
  CreditCard,
  Lock,
  CheckCircle2,
  Search,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/client";

const districts = [
  "ঢাকা",
  "গাজীপুর",
  "নারায়ণগঞ্জ",
  "নরসিংদী",
  "মুন্সিগঞ্জ",
  "মানিকগঞ্জ",
  "মাদারীপুর",
  "ফরিদপুর",
  "গোপালগঞ্জ",
  "রাজবাড়ী",
  "কিশোরগঞ্জ",
  "টাঙ্গাইল",
  "চট্টগ্রাম",
  "কক্সবাজার",
  "কুমিল্লা",
  "ফেনী",
  "নোয়াখালী",
  "লক্ষ্মীপুর",
  "চাঁদপুর",
  "ব্রাহ্মণবাড়িয়া",
  "খাগড়াছড়ি",
  "রাঙ্গামাটি",
  "বান্দরবান",
  "রাজশাহী",
  "নাটোর",
  "নওগাঁ",
  "চাঁপাইনবাবগঞ্জ",
  "পাবনা",
  "সিরাজগঞ্জ",
  "বগুড়া",
  "জয়পুরহাট",
  "খুলনা",
  "বাগেরহাট",
  "সাতক্ষীরা",
  "যশোর",
  "ঝিনাইদহ",
  "নড়াইল",
  "কুষ্টিয়া",
  "চুয়াডাঙ্গা",
  "মেহেরপুর",
  "বরিশাল",
  "ভোলা",
  "পটুয়াখালী",
  "পিরোজপুর",
  "ঝালকাঠি",
  "সিলেট",
  "মৌলভীবাজার",
  "হবিগঞ্জ",
  "সুনামগঞ্জ",
  "রংপুর",
  "দিনাজপুর",
  "ঠাকুরগাঁও",
  "পঞ্চগড়",
  "নীলফামারী",
  "লালমনিরহাট",
  "কুড়িগ্রাম",
  "গাইবান্ধা",
  "ময়মনসিংহ",
  "জামালপুর",
  "শেরপুর",
  "নেত্রকোণা",
];

const professions = [
  "রাজমিস্ত্রি",
  "রড মিস্ত্রি",
  "কাঠ মিস্ত্রি",
  "টাইলস মিস্ত্রি",
  "প্লাস্টার মিস্ত্রি",
  "পেইন্টার",
  "ইলেকট্রিশিয়ান",
  "হাউস ওয়্যারিং",
  "ইন্ডাস্ট্রিয়াল ইলেকট্রিশিয়ান",
  "প্লাম্বার",
  "স্যানিটারি মিস্ত্রি",
  "পাইপ ফিটার",
  "এসি টেকনিশিয়ান",
  "ফ্রিজ টেকনিশিয়ান",
  "ওয়েল্ডার",
  "মেকানিক",
  "ড্রাইভার",
  "টেকনিশিয়ান",
  "মেশিন অপারেটর",
  "রেফ্রিজারেশন টেকনিশিয়ান",
  "কৃষি শ্রমিক",
  "ধান / ফসলের শ্রমিক",
  "সবজি চাষের শ্রমিক",
  "ফল বাগানের শ্রমিক",
  "ফসল কাটার শ্রমিক",
  "কারখানা শ্রমিক",
  "প্যাকেজিং শ্রমিক",
  "লোডিং / আনলোডিং শ্রমিক",
  "গুদাম শ্রমিক",
  "গার্মেন্টস শ্রমিক",
  "ডেলিভারি কর্মী",
  "রিকশা চালক",
  "ভ্যান চালক",
  "পিকআপ সহকারী",
  "ট্রাক / বাস হেলপার",
  "কুলিনার",
  "পরিচ্ছন্নতা কর্মী",
  "ময়লা সংগ্রহ কর্মী",
  "ভবন রক্ষণাবেক্ষণ কর্মী",
  "মালী",
  "সিকিউরিটি / দারোয়ান",
  "গৃহকর্মী",
  "বাবুর্চি",
  "রান্নার সহকারী",
  "কেয়ারগিভার",
  "গৃহসহায়ক",
  "দৈনিক মজুর",
  "অস্থায়ী শ্রমিক",
  "মৌসুমি শ্রমিক",
  "ইভেন্ট শ্রমিক",
  "ইভেন্ট ম্যানেজমেন্ট",
  "ফটোগ্রাফার",
  "ভিডিওগ্রাফার",
  "ডেকোরেশন কর্মী",
  "ক্যাটারিং কর্মী",
  "বিয়ে / অনুষ্ঠান সেবা",
  "সাউন্ড সিস্টেম সেবা",
  "লাইটিং সেবা",
  "পরিবহন সেবা",
  "সরবরাহকারী",
  "পণ্য সরবরাহ",
  "খাবার সরবরাহ",
  "অনলাইন সেবা",
  "ব্যবসায়ী",
  "শিক্ষক",
  "ইঞ্জিনিয়ার",
  "ডাক্তার",
  "আইনজীবী",
  "অন্যান্য",
];

function normalizeBangladeshPhone(value: string) {
  let phone = value.trim().replace(/\s+/g, "");

  if (phone.startsWith("+880")) {
    phone = "0" + phone.slice(4);
  } else if (phone.startsWith("880")) {
    phone = "0" + phone.slice(3);
  }

  return phone;
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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredDistricts = useMemo(() => {
    const value = location.trim().toLowerCase();

    if (!value) {
      return districts.slice(0, 8);
    }

    return districts
      .filter((district) =>
        district.toLowerCase().includes(value)
      )
      .slice(0, 10);
  }, [location]);

  const filteredProfessions = useMemo(() => {
    const value = profession.trim().toLowerCase();

    if (!value) {
      return professions.slice(0, 12);
    }

    return professions
      .filter((item) =>
        item.toLowerCase().includes(value)
      )
      .slice(0, 12);
  }, [profession]);

  const handleRegister = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const cleanName = name.trim();
    const cleanPhone = normalizeBangladeshPhone(phone);
    const cleanLocation = location.trim();
    const cleanProfession = profession.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanNid = nid.trim();

    if (!cleanName) {
      setError("আপনার পূর্ণ নাম লিখুন।");
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setError("সঠিক বাংলাদেশি মোবাইল নম্বর দিন।");
      return;
    }

    if (!cleanLocation) {
      setError("আপনার জেলা লিখুন।");
      return;
    }

    if (!cleanProfession) {
      setError("আপনার পেশা / সেবা লিখুন।");
      return;
    }

    if (!cleanEmail) {
      setError("Email Address দিন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("সঠিক Email Address দিন।");
      return;
    }

    if (password.length < 6) {
      setError("Password কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (!agree) {
      setError("শর্তাবলিতে সম্মতি দিতে হবে।");
      return;
    }

    setLoading(true);

    try {
      /*
       * STEP 1
       * Supabase Email + Password Authentication
       *
       * Phone Auth / OTP এখানে ব্যবহার করা হচ্ছে না।
       */
      const { data: authData, error: authError } =
        await supabase.auth.signUp({
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
        console.error("Supabase Auth error:", authError);

        setError(
          `Account তৈরি করা যায়নি: ${authError.message}`
        );

        setLoading(false);
        return;
      }

      const userId = authData.user?.id;

      if (!userId) {
        setError(
          "Account তৈরি হয়েছে, কিন্তু User ID পাওয়া যায়নি।"
        );

        setLoading(false);
        return;
      }

      /*
       * STEP 2
       * Create profile
       *
       * profiles.id = Supabase Auth user.id
       */
      const now = new Date().toISOString();

      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
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
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);

        setError(
          `Account তৈরি হয়েছে, কিন্তু profile save হয়নি: ${profileError.message}`
        );

        setLoading(false);
        return;
      }

      /*
       * STEP 3
       * Create worker record
       *
       * workers.profile_id -> profiles.id
       */
      const { error: workerError } = await supabase
        .from("workers")
        .insert({
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
        });

      if (workerError) {
        console.error("Worker profile error:", workerError);

        setError(
          `Profile তৈরি হয়েছে, কিন্তু worker profile save হয়নি: ${workerError.message}`
        );

        setLoading(false);
        return;
      }

      /*
       * STEP 4
       * Local application profile reference
       */
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

      setSuccess(true);
      setLoading(false);

      /*
       * Registration complete.
       */
      setTimeout(() => {
        router.replace("/worker-dashboard");
      }, 1200);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        "নিবন্ধন করা যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
      );

      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#071b3a] px-3 py-6 sm:px-5 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">

        {/* HEADER */}
        <div className="mb-5 text-center sm:mb-7">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg sm:h-14 sm:w-14">
            <Briefcase className="h-6 w-6 text-orange-500 sm:h-7 sm:w-7" />
          </div>

          <p className="mt-3 text-xs font-bold text-orange-400 sm:text-sm">
            শ্রমবাজার
          </p>

          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            নিবন্ধন করুন
          </h1>

          <p className="mx-auto mt-2 max-w-lg px-2 text-[11px] leading-5 text-blue-100/70 sm:text-sm">
            একটি account দিয়ে শ্রম, কাজ, সেবা, ব্যবসা ও
            ভবিষ্যতের বিভিন্ন সুবিধা ব্যবহার করুন।
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleRegister}
          className="w-full rounded-2xl border border-white/10 bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-7"
        >

          {/* BASIC INFORMATION */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* NAME */}
            <div className="min-w-0">
              <label
                htmlFor="name"
                className="text-xs font-bold text-slate-700"
              >
                পূর্ণ নাম
              </label>

              <div className="mt-1.5 flex min-h-12 items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                <UserRound className="mr-2.5 h-5 w-5 shrink-0 text-slate-400" />

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError("");
                  }}
                  placeholder="আপনার পূর্ণ নাম"
                  autoComplete="name"
                  className="min-w-0 w-full bg-transparent py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-sm"
                />
              </div>
            </div>

            {/* PHONE */}
            <div className="min-w-0">
              <label
                htmlFor="phone"
                className="text-xs font-bold text-slate-700"
              >
                মোবাইল নম্বর
              </label>

              <div className="mt-1.5 flex min-h-12 items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                <Phone className="mr-2.5 h-5 w-5 shrink-0 text-slate-400" />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError("");
                  }}
                  placeholder="01XXXXXXXXX"
                  inputMode="tel"
                  autoComplete="tel"
                  className="min-w-0 w-full bg-transparent py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-sm"
                />
              </div>
            </div>

            {/* DISTRICT */}
            <div className="relative min-w-0">
              <label
                htmlFor="location"
                className="text-xs font-bold text-slate-700"
              >
                জেলা
              </label>

              <div className="mt-1.5 flex min-h-12 items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                <MapPin className="mr-2.5 h-5 w-5 shrink-0 text-slate-400" />

                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setError("");
                  }}
                  placeholder="জেলা লিখুন"
                  autoComplete="address-level1"
                  className="min-w-0 w-full bg-transparent py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-sm"
                />

                <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-slate-300" />
              </div>

              {location.trim() &&
                filteredDistricts.length > 0 && (
                  <div className="absolute left-0 right-0 top-[72px] z-50 max-h-48 overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl">
                    {filteredDistricts.map((district) => (
                      <button
                        key={district}
                        type="button"
                        onClick={() => {
                          setLocation(district);
                          setError("");
                        }}
                        className="flex min-h-11 w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 active:bg-orange-100 sm:text-xs"
                      >
                        <Search className="mr-2 h-3.5 w-3.5 shrink-0 text-slate-400" />
                        {district}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            {/* PROFESSION */}
            <div className="relative min-w-0">
              <label
                htmlFor="profession"
                className="text-xs font-bold text-slate-700"
              >
                পেশা / সেবা
              </label>

              <div className="mt-1.5 flex min-h-12 items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                <Briefcase className="mr-2.5 h-5 w-5 shrink-0 text-slate-400" />

                <input
                  id="profession"
                  type="text"
                  value={profession}
                  onChange={(e) => {
                    setProfession(e.target.value);
                    setError("");
                  }}
                  placeholder="পেশা লিখুন"
                  className="min-w-0 w-full bg-transparent py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-sm"
                />

                <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-slate-300" />
              </div>

              {profession.trim() &&
                filteredProfessions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[72px] z-50 max-h-52 overflow-y-auto overscroll-contain rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl">
                    {filteredProfessions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setProfession(item);
                          setError("");
                        }}
                        className="flex min-h-11 w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 active:bg-orange-100 sm:text-xs"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* ADDITIONAL INFORMATION */}
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-3.5 sm:p-4">
            <h2 className="text-sm font-bold text-slate-900">
              অতিরিক্ত তথ্য
            </h2>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Email authentication-এর জন্য ব্যবহার হবে। NID
              profile-এর অতিরিক্ত তথ্য হিসেবে রাখা হবে।
            </p>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* EMAIL */}
              <div className="min-w-0">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-slate-600"
                >
                  Email Address
                </label>

                <div className="mt-1.5 flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-3">
                  <Mail className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="example@email.com"
                    autoComplete="email"
                    className="min-w-0 w-full bg-transparent py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-xs"
                  />
                </div>
              </div>

              {/* NID */}
              <div className="min-w-0">
                <label
                  htmlFor="nid"
                  className="text-xs font-bold text-slate-600"
                >
                  NID — ঐচ্ছিক
                </label>

                <div className="mt-1.5 flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-3">
                  <CreditCard className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />

                  <input
                    id="nid"
                    type="text"
                    value={nid}
                    onChange={(e) => setNid(e.target.value)}
                    placeholder="NID নম্বর"
                    inputMode="numeric"
                    className="min-w-0 w-full bg-transparent py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="mt-4">
            <label
              htmlFor="password"
              className="text-xs font-bold text-slate-700"
            >
              Password
            </label>

            <div className="mt-1.5 flex min-h-12 w-full items-center rounded-xl border border-slate-200 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 sm:max-w-sm">
              <Lock className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="কমপক্ষে ৬ অক্ষর"
                autoComplete="new-password"
                className="min-w-0 w-full bg-transparent py-2 text-base text-slate-800 outline-none placeholder:text-slate-400 sm:text-sm"
              />
            </div>
          </div>

          {/* TERMS */}
          <label className="mt-5 flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-orange-500"
            />

            <span className="text-xs leading-5 text-slate-500">
              আমি শ্রমবাজারের শর্তাবলি ও গোপনীয়তা নীতিতে সম্মত।
            </span>
          </label>

          {/* SUCCESS */}
          {success && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-xs font-semibold leading-5 text-green-700">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

              <span>
                Registration সফল হয়েছে। Dashboard-এ নেওয়া হচ্ছে...
              </span>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-semibold leading-5 text-red-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <span className="min-w-0 break-words">
                {error}
              </span>
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || success}
            className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition active:scale-[0.99] hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Account তৈরি হচ্ছে..."
              : success
                ? "Registration সম্পন্ন"
                : "নিবন্ধন করুন"}
          </button>

          {/* LOGIN */}
          <p className="mt-4 text-center text-xs text-slate-500">
            আগে থেকেই account আছে?

            <Link
              href="/login"
              className="ml-1.5 font-bold text-orange-500 hover:text-orange-600"
            >
              প্রবেশ করুন
            </Link>
          </p>
        </form>

        <p className="mt-5 text-center text-[10px] text-blue-100/50">
          শ্রমবাজার — Global Workforce Platform
        </p>
      </div>
    </main>
  );
}