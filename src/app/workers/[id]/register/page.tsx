"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  UserRound,
  Building2,
  Phone,
  MapPin,
  Lock,
  Briefcase,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

type UserType = "worker" | "employer";

type WorkerCategory = "শ্রমিক" | "দক্ষ কর্মী";

type RegisteredUser = {
  id: string;
  name: string;
  phone: string;
  location: string;
  password: string;
  userType: UserType;
  workerCategory?: WorkerCategory;
  workerSubCategory?: string;
  employerType?: string;
  createdAt: string;
};

const STORAGE_KEY = "shromobazar_registered_users";
const CURRENT_USER_KEY = "shromobazar_current_user";

const districts = [
  "ঢাকা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রংপুর",
  "ময়মনসিংহ",
  "কুমিল্লা",
  "গাজীপুর",
  "নারায়ণগঞ্জ",
  "নরসিংদী",
  "টাঙ্গাইল",
  "কিশোরগঞ্জ",
  "মানিকগঞ্জ",
  "মুন্সিগঞ্জ",
  "ফরিদপুর",
  "মাদারীপুর",
  "গোপালগঞ্জ",
  "শরীয়তপুর",
  "ব্রাহ্মণবাড়িয়া",
  "ফেনী",
  "নোয়াখালী",
  "লক্ষ্মীপুর",
  "কক্সবাজার",
  "খাগড়াছড়ি",
  "রাঙ্গামাটি",
  "বান্দরবান",
  "বাগেরহাট",
  "যশোর",
  "সাতক্ষীরা",
  "ঝিনাইদহ",
  "মাগুরা",
  "নড়াইল",
  "কুষ্টিয়া",
  "চুয়াডাঙ্গা",
  "মেহেরপুর",
  "পাবনা",
  "সিরাজগঞ্জ",
  "বগুড়া",
  "জয়পুরহাট",
  "নওগাঁ",
  "নাটোর",
  "চাঁপাইনবাবগঞ্জ",
  "হবিগঞ্জ",
  "মৌলভীবাজার",
  "সুনামগঞ্জ",
  "দিনাজপুর",
  "ঠাকুরগাঁও",
  "পঞ্চগড়",
  "নীলফামারী",
  "লালমনিরহাট",
  "কুড়িগ্রাম",
  "গাইবান্ধা",
  "শেরপুর",
  "জামালপুর",
  "নেত্রকোনা",
];

const subCategories = [
  "রাজমিস্ত্রি",
  "নির্মাণ শ্রমিক",
  "ইলেকট্রিশিয়ান",
  "প্লাম্বার",
  "কাঠমিস্ত্রি",
  "ওয়েল্ডার",
  "রংমিস্ত্রি",
  "টাইলস মিস্ত্রি",
  "ছাদ নির্মাণ কর্মী",
  "AC ও ফ্রিজ টেকনিশিয়ান",
  "মেশিন অপারেটর",
  "ড্রাইভার",
  "পরিচ্ছন্নতাকর্মী",
  "গৃহকর্মী",
  "নিরাপত্তাকর্মী",
  "অন্যান্য",
];

const employerTypes = [
  "দোকানদার",
  "ব্যবসায়ী",
  "ঠিকাদার",
  "কোম্পানি",
  "নির্মাণ প্রতিষ্ঠান",
  "কারখানা / শিল্প প্রতিষ্ঠান",
  "কৃষি ও খামার",
  "হোটেল ও রেস্টুরেন্ট",
  "গৃহস্থালি নিয়োগকর্তা",
  "অন্যান্য",
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialType =
    searchParams.get("type") === "employer"
      ? "employer"
      : "worker";

  const [userType, setUserType] =
    useState<UserType>(initialType);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");

  const [workerCategory, setWorkerCategory] =
    useState<WorkerCategory>("শ্রমিক");

  const [workerSubCategory, setWorkerSubCategory] =
    useState("");

  const [employerType, setEmployerType] =
    useState("");

  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setError("");

    if (type !== "worker") {
      setWorkerCategory("শ্রমিক");
      setWorkerSubCategory("");
    }

    if (type !== "employer") {
      setEmployerType("");
    }
  };

  const handleWorkerCategoryChange = (
    category: WorkerCategory
  ) => {
    setWorkerCategory(category);
    setWorkerSubCategory("");
  };

  const handleRegister = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("আপনার নাম লিখুন।");
      return;
    }

    if (!phone.trim()) {
      setError("আপনার মোবাইল নম্বর লিখুন।");
      return;
    }

    if (!/^01\d{9}$/.test(phone.trim())) {
      setError(
        "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন। উদাহরণ: 01XXXXXXXXX"
      );
      return;
    }

    if (!location) {
      setError("আপনার জেলা নির্বাচন করুন।");
      return;
    }

    if (!password) {
      setError("একটি পাসওয়ার্ড দিন।");
      return;
    }

    if (password.length < 4) {
      setError("পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।");
      return;
    }

    if (userType === "worker" && !workerSubCategory) {
      setError("আপনার পেশা নির্বাচন করুন।");
      return;
    }

    if (userType === "employer" && !employerType) {
      setError("নিয়োগকর্তার ধরন নির্বাচন করুন।");
      return;
    }

    if (!agree) {
      setError(
        "নিবন্ধন সম্পন্ন করতে শর্তাবলিতে সম্মতি দিন।"
      );
      return;
    }

    const newUser: RegisteredUser = {
      id: `${userType}-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      location,
      password,
      userType,
      ...(userType === "worker"
        ? {
            workerCategory,
            workerSubCategory,
          }
        : {}),
      ...(userType === "employer"
        ? {
            employerType,
          }
        : {}),
      createdAt: new Date().toISOString(),
    };

    try {
      const savedUsers =
        localStorage.getItem(STORAGE_KEY);

      let users: RegisteredUser[] = [];

      if (savedUsers) {
        try {
          const parsed = JSON.parse(savedUsers);

          if (Array.isArray(parsed)) {
            users = parsed as RegisteredUser[];
          }
        } catch {
          users = [];
        }
      }

      users.push(newUser);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(users)
      );

      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(newUser)
      );

      setSuccess(true);

      setTimeout(() => {
        if (userType === "worker") {
          router.push("/worker-dashboard");
        } else {
          router.push("/employer-dashboard");
        }
      }, 700);
    } catch {
      setError(
        "নিবন্ধন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।"
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">

        {/* PAGE HEADER */}
        <div className="mb-8 text-center">
          <p className="text-sm font-bold text-orange-500">
            শ্রমবাজার
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            নিবন্ধন করুন
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            কর্মী অথবা নিয়োগকর্তা হিসেবে শ্রমবাজারে
            যোগ দিন।
          </p>
        </div>

        {/* USER TYPE */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

          <h2 className="text-lg font-bold text-slate-900">
            আপনি কীভাবে শ্রমবাজার ব্যবহার করতে চান?
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            {/* WORKER */}
            <button
              type="button"
              onClick={() =>
                handleUserTypeChange("worker")
              }
              className={`group rounded-2xl border p-5 text-left transition ${
                userType === "worker"
                  ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                  : "border-slate-200 bg-white hover:border-orange-300"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  userType === "worker"
                    ? "bg-orange-500 text-white"
                    : "bg-orange-50 text-orange-500"
                }`}
              >
                <UserRound className="h-6 w-6" />
              </div>

              <p className="mt-4 font-bold text-slate-900">
                কর্মী
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                শ্রমিক ও দক্ষ কর্মী হিসেবে কাজের সুযোগ
                খুঁজুন।
              </p>
            </button>

            {/* EMPLOYER */}
            <button
              type="button"
              onClick={() =>
                handleUserTypeChange("employer")
              }
              className={`group rounded-2xl border p-5 text-left transition ${
                userType === "employer"
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  userType === "employer"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <Building2 className="h-6 w-6" />
              </div>

              <p className="mt-4 font-bold text-slate-900">
                নিয়োগকর্তা
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                দক্ষ কর্মী খুঁজুন, কর্মী নিয়োগ করুন এবং
                কাজ পোস্ট করুন।
              </p>
            </button>

          </div>
        </section>

        {/* REGISTRATION FORM */}
        <form
          onSubmit={handleRegister}
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >

          <div className="grid gap-5 md:grid-cols-2">

            {/* NAME */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                নাম
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-400 focus-within:bg-white">
                <UserRound className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="আপনার পূর্ণ নাম"
                  autoComplete="name"
                  className="h-12 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                মোবাইল নম্বর
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-400 focus-within:bg-white">
                <Phone className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="01XXXXXXXXX"
                  inputMode="tel"
                  autoComplete="tel"
                  className="h-12 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                এলাকা / জেলা
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-400 focus-within:bg-white">
                <MapPin className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

                <select
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="h-12 w-full bg-transparent text-sm outline-none"
                >
                  <option value="">
                    জেলা নির্বাচন করুন
                  </option>

                  {districts.map((district) => (
                    <option
                      key={district}
                      value={district}
                    >
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                পাসওয়ার্ড
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-orange-400 focus-within:bg-white">
                <Lock className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="কমপক্ষে ৪ অক্ষর"
                  autoComplete="new-password"
                  className="h-12 w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

          </div>

          {/* WORKER INFORMATION */}
          {userType === "worker" && (
            <div className="mt-7 rounded-2xl border border-orange-100 bg-orange-50/50 p-5">

              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-500" />

                <div>
                  <h3 className="font-bold text-slate-900">
                    কর্মীর পেশাগত তথ্য
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    আপনার কাজের ধরন ও পেশা নির্বাচন করুন।
                  </p>
                </div>
              </div>

              {/* CATEGORY */}
              <div className="mt-5">
                <label className="text-sm font-bold text-slate-700">
                  কর্মীর ধরন
                </label>

                <select
                  value={workerCategory}
                  onChange={(e) =>
                    handleWorkerCategoryChange(
                      e.target.value as WorkerCategory
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400"
                >
                  <option value="শ্রমিক">
                    শ্রমিক
                  </option>

                  <option value="দক্ষ কর্মী">
                    দক্ষ কর্মী
                  </option>
                </select>
              </div>

              {/* SUB CATEGORY */}
              <div className="mt-5">
                <label className="text-sm font-bold text-slate-700">
                  পেশা
                </label>

                <select
                  value={workerSubCategory}
                  onChange={(e) =>
                    setWorkerSubCategory(
                      e.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-orange-400"
                >
                  <option value="">
                    পেশা নির্বাচন করুন
                  </option>

                  {subCategories.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          )}

          {/* EMPLOYER INFORMATION */}
          {userType === "employer" && (
            <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">

              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-500" />

                <div>
                  <h3 className="font-bold text-slate-900">
                    নিয়োগকর্তার তথ্য
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    আপনি কোন ধরনের নিয়োগকর্তা তা নির্বাচন করুন।
                  </p>
                </div>
              </div>

              {/* EMPLOYER TYPE */}
              <div className="mt-5">
                <label className="text-sm font-bold text-slate-700">
                  নিয়োগকর্তার ধরন
                </label>

                <select
                  value={employerType}
                  onChange={(e) =>
                    setEmployerType(e.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-400"
                >
                  <option value="">
                    ধরন নির্বাচন করুন
                  </option>

                  {employerTypes.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />

              <span>
                নিবন্ধন সফল হয়েছে। ড্যাশবোর্ডে নেওয়া হচ্ছে...
              </span>
            </div>
          )}

          {/* TERMS */}
          <label className="mt-6 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) =>
                setAgree(e.target.checked)
              }
              className="mt-1 h-4 w-4 accent-orange-500"
            />

            <span className="text-xs leading-5 text-slate-500">
              আমি শ্রমবাজারের শর্তাবলি ও গোপনীয়তা নীতিতে
              সম্মত।
            </span>
          </label>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={success}
            className="mt-6 flex h-13 w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {success
              ? "নিবন্ধন সম্পন্ন"
              : "নিবন্ধন করুন"}
          </button>

          {/* LOGIN */}
          <p className="mt-4 text-center text-xs text-slate-400">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}

            <Link
              href="/login"
              className="font-bold text-orange-500 transition hover:text-orange-600"
            >
              লগইন করুন
            </Link>
          </p>

        </form>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-center gap-1 text-center text-xs text-slate-400">
          <span>শ্রমবাজার</span>
          <ArrowRight className="h-3 w-3" />
          <span>বাংলাদেশের Workforce Platform</span>
        </div>

      </div>
    </main>
  );
}