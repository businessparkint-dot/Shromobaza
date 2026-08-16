"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserRound,
  Building2,
  Phone,
  MapPin,
  Lock,
  CheckCircle,
  ArrowLeft,
  Briefcase,
} from "lucide-react";

type UserRole = "worker" | "employer";

type WorkerCategory =
  | "রাজমিস্ত্রি"
  | "শ্রমিক"
  | "মিস্ত্রি"
  | "ইলেকট্রিশিয়ান"
  | "প্লাম্বার"
  | "কাঠমিস্ত্রি"
  | "রংমিস্ত্রি"
  | "ওয়েল্ডার"
  | "টেকনিশিয়ান"
  | "ড্রাইভার"
  | "ক্লিনার"
  | "নিরাপত্তাকর্মী"
  | "অন্যান্য";

type EmployerCategory =
  | "নির্মাণ প্রতিষ্ঠান"
  | "ব্যক্তিগত নিয়োগকর্তা"
  | "কোম্পানি / ব্যবসা প্রতিষ্ঠান"
  | "ঠিকাদার"
  | "সরবরাহকারী"
  | "সার্ভিস প্রোভাইডার"
  | "শিল্প / কারখানা"
  | "কৃষি / মৎস্য"
  | "হোটেল / রেস্টুরেন্ট"
  | "হাসপাতাল / স্বাস্থ্যসেবা"
  | "শিক্ষা প্রতিষ্ঠান"
  | "অন্যান্য";

type RegisteredUser = {
  id: string;
  name: string;
  phone: string;
  location: string;
  role: UserRole;
  workerCategory?: WorkerCategory;
  employerCategory?: EmployerCategory;
  createdAt: string;
};

const USERS_STORAGE_KEY = "shromobazar_users";

const workerCategories: WorkerCategory[] = [
  "রাজমিস্ত্রি",
  "শ্রমিক",
  "মিস্ত্রি",
  "ইলেকট্রিশিয়ান",
  "প্লাম্বার",
  "কাঠমিস্ত্রি",
  "রংমিস্ত্রি",
  "ওয়েল্ডার",
  "টেকনিশিয়ান",
  "ড্রাইভার",
  "ক্লিনার",
  "নিরাপত্তাকর্মী",
  "অন্যান্য",
];

const employerCategories: EmployerCategory[] = [
  "নির্মাণ প্রতিষ্ঠান",
  "ব্যক্তিগত নিয়োগকর্তা",
  "কোম্পানি / ব্যবসা প্রতিষ্ঠান",
  "ঠিকাদার",
  "সরবরাহকারী",
  "সার্ভিস প্রোভাইডার",
  "শিল্প / কারখানা",
  "কৃষি / মৎস্য",
  "হোটেল / রেস্টুরেন্ট",
  "হাসপাতাল / স্বাস্থ্যসেবা",
  "শিক্ষা প্রতিষ্ঠান",
  "অন্যান্য",
];

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("worker");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [workerCategory, setWorkerCategory] =
    useState<WorkerCategory | "">("");

  const [employerCategory, setEmployerCategory] =
    useState<EmployerCategory | "">("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError("");

    if (newRole === "worker") {
      setEmployerCategory("");
    } else {
      setWorkerCategory("");
    }
  };

  const handleRegister = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanLocation = location.trim();

    if (!cleanName) {
      setError("আপনার নাম লিখুন।");
      return;
    }

    if (!cleanPhone) {
      setError("মোবাইল নম্বর লিখুন।");
      return;
    }

    const phoneDigits = cleanPhone.replace(/\D/g, "");

    if (phoneDigits.length < 10) {
      setError("সঠিক মোবাইল নম্বর দিন।");
      return;
    }

    if (!cleanLocation) {
      setError("ঠিকানা / এলাকা লিখুন।");
      return;
    }

    if (role === "worker" && !workerCategory) {
      setError("আপনার পেশা / ক্যাটাগরি নির্বাচন করুন।");
      return;
    }

    if (role === "employer" && !employerCategory) {
      setError("Employer ক্যাটাগরি নির্বাচন করুন।");
      return;
    }

    if (!password) {
      setError("Password দিন।");
      return;
    }

    if (password.length < 6) {
      setError("Password কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password এবং Confirm Password মিলছে না।");
      return;
    }

    try {
      const savedUsers =
        localStorage.getItem(USERS_STORAGE_KEY);

      let existingUsers: RegisteredUser[] = [];

      if (savedUsers) {
        try {
          const parsed = JSON.parse(savedUsers);

          if (Array.isArray(parsed)) {
            existingUsers = parsed;
          }
        } catch {
          existingUsers = [];
        }
      }

      const alreadyExists = existingUsers.some(
        (user) =>
          user.phone.replace(/\D/g, "") === phoneDigits
      );

      if (alreadyExists) {
        setError(
          "এই মোবাইল নম্বর দিয়ে ইতোমধ্যে Account তৈরি করা হয়েছে।"
        );
        return;
      }

      const newUser: RegisteredUser = {
        id: `${role}-${Date.now()}`,
        name: cleanName,
        phone: cleanPhone,
        location: cleanLocation,
        role,
        ...(role === "worker"
          ? {
              workerCategory:
                workerCategory as WorkerCategory,
            }
          : {
              employerCategory:
                employerCategory as EmployerCategory,
            }),
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify([
          ...existingUsers,
          newUser,
        ])
      );

      localStorage.setItem(
        "shromobazar_current_user",
        JSON.stringify(newUser)
      );

      if (role === "worker") {
        localStorage.setItem(
          "shromobazar_current_worker",
          JSON.stringify(newUser)
        );
      } else {
        localStorage.setItem(
          "shromobazar_current_employer",
          JSON.stringify(newUser)
        );
      }

      setSuccess(true);

      setTimeout(() => {
        if (role === "worker") {
          router.push("/worker-dashboard");
        } else {
          router.push("/employer-dashboard");
        }
      }, 1200);
    } catch {
      setError(
        "Registration সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।"
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">

        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#081B3A] transition hover:text-orange-500"
        >
          <ArrowLeft size={17} />
          হোমে ফিরে যান
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#081B3A] text-white shadow-lg">
            <Briefcase size={30} />
          </div>

          <h1 className="mt-5 text-3xl font-bold text-[#081B3A] sm:text-4xl">
            Shromobazar Account
          </h1>

          <p className="mt-3 text-slate-500">
            Worker অথবা Employer Account তৈরি করুন।
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

          {/* Role Selection */}
          <div>
            <p className="mb-3 text-sm font-bold text-slate-700">
              আপনি কী হিসেবে নিবন্ধন করবেন?
            </p>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Worker */}
              <button
                type="button"
                onClick={() => handleRoleChange("worker")}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  role === "worker"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${
                    role === "worker"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <UserRound size={24} />
                </div>

                <h2 className="font-bold text-[#081B3A]">
                  Worker
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  কাজ খুঁজতে এবং নিজের দক্ষতা দেখাতে নিবন্ধন করুন
                </p>
              </button>

              {/* Employer */}
              <button
                type="button"
                onClick={() => handleRoleChange("employer")}
                className={`rounded-2xl border-2 p-5 text-left transition ${
                  role === "employer"
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${
                    role === "employer"
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Building2 size={24} />
                </div>

                <h2 className="font-bold text-[#081B3A]">
                  Employer
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Worker নিয়োগ করতে নিবন্ধন করুন
                </p>
              </button>

            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleRegister}
            className="mt-8 space-y-5"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {role === "worker"
                  ? "আপনার নাম"
                  : "প্রতিষ্ঠান / Employer নাম"}
              </label>

              <div className="relative">
                {role === "worker" ? (
                  <UserRound
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={19}
                  />
                ) : (
                  <Building2
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={19}
                  />
                )}

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder={
                    role === "worker"
                      ? "যেমন: রহিম মিয়া"
                      : "যেমন: Construction Company"
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {role === "worker"
                  ? "পেশা / Worker Category"
                  : "Employer Category"}
              </label>

              <div className="relative">
                <Briefcase
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                {role === "worker" ? (
                  <select
                    value={workerCategory}
                    onChange={(event) =>
                      setWorkerCategory(
                        event.target.value as
                          | WorkerCategory
                          | ""
                      )
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                  >
                    <option value="">
                      পেশা নির্বাচন করুন
                    </option>

                    {workerCategories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                ) : (
                  <select
                    value={employerCategory}
                    onChange={(event) =>
                      setEmployerCategory(
                        event.target.value as
                          | EmployerCategory
                          | ""
                      )
                    }
                    className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition focus:border-orange-500 focus:bg-white"
                  >
                    <option value="">
                      Employer Category নির্বাচন করুন
                    </option>

                    {employerCategories.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                মোবাইল নম্বর
              </label>

              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="01XXXXXXXXX"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                ঠিকানা / এলাকা
              </label>

              <div className="relative">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="যেমন: মিরপুর, ঢাকা"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={19}
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Password আবার লিখুন"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none transition focus:border-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                <CheckCircle size={20} />
                Registration সফল হয়েছে। Dashboard-এ নেওয়া হচ্ছে...
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              <CheckCircle size={19} />

              {role === "worker"
                ? "Worker Account তৈরি করুন"
                : "Employer Account তৈরি করুন"}
            </button>

          </form>

          {/* Login */}
          <div className="mt-6 text-center text-sm text-slate-500">
            আগে থেকেই Account আছে?{" "}
            <Link
              href="/login"
              className="font-bold text-orange-500 hover:text-orange-600"
            >
              Login করুন
            </Link>
          </div>

        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          Shromobazar — দক্ষ মানুষ ও কাজের সুযোগকে
          এক জায়গায় যুক্ত করার প্ল্যাটফর্ম।
        </p>

      </div>
    </main>
  );
}