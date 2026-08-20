"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Phone,
  MapPin,
  Lock,
  Briefcase,
  Store,
  Users,
  CheckCircle2,
} from "lucide-react";

type UserType = "worker" | "employer" | "customer";

type WorkerCategory =
  | "শ্রমিক"
  | "দক্ষ কর্মী"
  | "পেশাজীবী";

type RegisteredUser = {
  id: string;
  name: string;
  phone: string;
  location: string;
  userType: UserType;
  workerCategory?: WorkerCategory;
  workerSubCategory?: string;
  employerType?: string;
  createdAt: string;
};

const STORAGE_KEY = "shromobazar_users";
const CURRENT_USER_KEY = "shromobazar_current_user";

const workerSubCategories: Record<WorkerCategory, string[]> = {
  শ্রমিক: [
    "সাধারণ নির্মাণ শ্রমিক",
    "হেলপার",
    "সাইট শ্রমিক",
    "ভাঙার কাজের শ্রমিক",
    "মালামাল বহনকারী শ্রমিক",
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
    "ক্লিনার",
    "পরিচ্ছন্নতা কর্মী",
    "ময়লা সংগ্রহ কর্মী",
    "ভবন রক্ষণাবেক্ষণ কর্মী",
    "মালী",
    "সিকিউরিটি / দারোয়ান",
    "গৃহকর্মী",
    "বাবুর্চি",
    "রান্নার সহকারী",
    "কেয়ারগিভার",
    "গৃহসহায়ক",
    "দৈনিক মজুর",
    "অস্থায়ী শ্রমিক",
    "মৌসুমি শ্রমিক",
    "ইভেন্ট শ্রমিক",
    "অন্যান্য",
  ],

  "দক্ষ কর্মী": [
    "রাজমিস্ত্রি",
    "রড মিস্ত্রি",
    "কাঠমিস্ত্রি",
    "টাইলস মিস্ত্রি",
    "প্লাস্টার মিস্ত্রি",
    "পেইন্টার",
    "ইলেকট্রিশিয়ান",
    "হাউস ওয়্যারিং",
    "ইন্ডাস্ট্রিয়াল ইলেকট্রিশিয়ান",
    "প্লাম্বার",
    "স্যানিটারি মিস্ত্রি",
    "পাইপ ফিটার",
    "এসি টেকনিশিয়ান",
    "ফ্রিজ টেকনিশিয়ান",
    "ওয়েল্ডার",
    "মেকানিক",
    "ড্রাইভার",
    "টেকনিশিয়ান",
    "মেশিন অপারেটর",
    "রেফ্রিজারেশন টেকনিশিয়ান",
    "অন্যান্য",
  ],

  "পেশাজীবী": [
    "ইঞ্জিনিয়ার",
    "ডাক্তার",
    "শিক্ষক",
    "আইনজীবী",
    "অন্যান্য",
  ],
};

const employerTypes = [
  "ঠিকাদার",
  "কোম্পানি",
  "ডেভেলপার",
  "দোকানদার",
  "ব্যবসায়ী",
  "কারখানা",
  "সেবা প্রদানকারী",
  "প্রতিষ্ঠান",
  "অন্যান্য",
];

const districts = [
  "ঢাকা",
  "গাজীপুর",
  "নারায়ণগঞ্জ",
  "চট্টগ্রাম",
  "খুলনা",
  "বরিশাল",
  "সিলেট",
  "রাজশাহী",
  "রংপুর",
  "ময়মনসিংহ",
  "কুমিল্লা",
  "ফরিদপুর",
  "বাগেরহাট",
  "অন্যান্য",
];

export default function RegisterPage() {
  const router = useRouter();

  const [userType, setUserType] =
    useState<UserType>("worker");

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

  const subCategories = useMemo(() => {
    return workerSubCategories[workerCategory];
  }, [workerCategory]);

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setError("");

    if (type !== "worker") {
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
    setError("");
  };

  const handleRegister = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanLocation = location.trim();

    if (!cleanName) {
      setError("আপনার পূর্ণ নাম লিখুন।");
      return;
    }

    if (!cleanPhone) {
      setError("মোবাইল নম্বর দিন।");
      return;
    }

    const normalizedPhone = cleanPhone.replace(
      /\s+/g,
      ""
    );

    if (
      normalizedPhone.length < 11 ||
      !/^[0-9+]+$/.test(normalizedPhone)
    ) {
      setError("সঠিক মোবাইল নম্বর দিন।");
      return;
    }

    if (!cleanLocation) {
      setError("আপনার এলাকা নির্বাচন করুন।");
      return;
    }

    if (password.length < 4) {
      setError(
        "পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।"
      );
      return;
    }

    if (userType === "worker") {
      if (!workerCategory) {
        setError("কর্মীর Category নির্বাচন করুন।");
        return;
      }

      if (!workerSubCategory) {
        setError(
          "কর্মীর পেশা / Sub-category নির্বাচন করুন।"
        );
        return;
      }
    }

    if (userType === "employer") {
      if (!employerType) {
        setError(
          "নিয়োগকর্তার ধরন নির্বাচন করুন।"
        );
        return;
      }
    }

    if (!agree) {
      setError(
        "শর্তাবলিতে সম্মতি দিতে হবে।"
      );
      return;
    }

    const newUser: RegisteredUser = {
      id: `USR-${Date.now()}`,
      name: cleanName,
      phone: cleanPhone,
      location: cleanLocation,
      userType,
      createdAt: new Date().toISOString(),

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
    };

    try {
      const savedUsers =
        localStorage.getItem(STORAGE_KEY);

      let users: RegisteredUser[] = [];

      if (savedUsers) {
        try {
          const parsed = JSON.parse(savedUsers);

          if (Array.isArray(parsed)) {
            users =
              parsed as RegisteredUser[];
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
          router.push(
            "/worker-dashboard"
          );
        } else if (
          userType === "employer"
        ) {
          router.push(
            "/employer-dashboard"
          );
        } else {
          router.push("/");
        }
      }, 700);
    } catch {
      setError(
        "নিবন্ধন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।"
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
            কর্মী, নিয়োগকর্তা অথবা সাধারণ গ্রাহক হিসেবে
            শ্রমবাজারে যুক্ত হন।
          </p>
        </div>

        {/* USER TYPE */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-slate-900">
            আপনি কীভাবে শ্রমবাজার ব্যবহার করতে চান?
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">

            {/* WORKER */}
            <button
              type="button"
              onClick={() =>
                handleUserTypeChange("worker")
              }
              className={`rounded-2xl border p-5 text-left transition ${
                userType === "worker"
                  ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                  : "border-slate-200 bg-white hover:border-orange-300"
              }`}
            >
              <UserRound
                className={`h-7 w-7 ${
                  userType === "worker"
                    ? "text-orange-500"
                    : "text-slate-400"
                }`}
              />

              <p className="mt-3 font-bold text-slate-900">
                কর্মী
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                শ্রমিক, দক্ষ কর্মী ও পেশাজীবী হিসেবে কাজ খুঁজুন
              </p>
            </button>

            {/* EMPLOYER */}
            <button
              type="button"
              onClick={() =>
                handleUserTypeChange("employer")
              }
              className={`rounded-2xl border p-5 text-left transition ${
                userType === "employer"
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-slate-200 bg-white hover:border-blue-300"
              }`}
            >
              <Store
                className={`h-7 w-7 ${
                  userType === "employer"
                    ? "text-blue-500"
                    : "text-slate-400"
                }`}
              />

              <p className="mt-3 font-bold text-slate-900">
                নিয়োগকর্তা
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                কর্মী নিয়োগ ও কাজ পোস্ট করুন
              </p>
            </button>

            {/* CUSTOMER */}
            <button
              type="button"
              onClick={() =>
                handleUserTypeChange("customer")
              }
              className={`rounded-2xl border p-5 text-left transition ${
                userType === "customer"
                  ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                  : "border-slate-200 bg-white hover:border-green-300"
              }`}
            >
              <Users
                className={`h-7 w-7 ${
                  userType === "customer"
                    ? "text-green-500"
                    : "text-slate-400"
                }`}
              />

              <p className="mt-3 font-bold text-slate-900">
                সাধারণ গ্রাহক
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                শ্রমিক ও সেবা খুঁজতে সাধারণ account
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
                এলাকা
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

                  {districts.map(
                    (district) => (
                      <option
                        key={district}
                        value={district}
                      >
                        {district}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                পাসওয়ার্ড
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

          {/* WORKER */}
          {userType === "worker" && (
            <div className="mt-7 rounded-2xl border border-orange-100 bg-orange-50/50 p-5">

              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-500" />

                <div>
                  <h3 className="font-bold text-slate-900">
                    কর্মীর পেশাগত তথ্য
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    আপনার Category এবং পেশা নির্বাচন করুন।
                  </p>
                </div>
              </div>

              {/* CATEGORY */}
              <div className="mt-5">
                <label className="text-sm font-bold text-slate-700">
                  কর্মীর Category
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

                  <option value="পেশাজীবী">
                    পেশাজীবী
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

                  {subCategories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>
          )}

          {/* EMPLOYER */}
          {userType === "employer" && (
            <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">

              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-500" />

                <div>
                  <h3 className="font-bold text-slate-900">
                    নিয়োগকর্তার তথ্য
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    আপনি কোন ধরনের নিয়োগকর্তা তা নির্বাচন করুন।
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-bold text-slate-700">
                  নিয়োগকর্তার ধরন
                </label>

                <select
                  value={employerType}
                  onChange={(e) =>
                    setEmployerType(
                      e.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-blue-400"
                >
                  <option value="">
                    ধরন নির্বাচন করুন
                  </option>

                  {employerTypes.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>

            </div>
          )}

          {/* CUSTOMER */}
          {userType === "customer" && (
            <div className="mt-7 rounded-2xl border border-green-100 bg-green-50/50 p-5">

              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />

                <div>
                  <h3 className="font-bold text-slate-900">
                    সাধারণ গ্রাহক
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    সাধারণ গ্রাহক হিসেবে account খুলে
                    আপনি শ্রমিক, কাজ ও প্রয়োজনীয় সেবা
                    খুঁজে দেখতে পারবেন।
                  </p>
                </div>
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
                নিবন্ধন সফল হয়েছে। Dashboard-এ নেওয়া হচ্ছে...
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
              আমি শ্রমবাজারের শর্তাবলি ও গোপনীয়তা নীতিতে
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
            ইতিমধ্যে account আছে?{" "}

            <Link
              href="/login"
              className="font-bold text-orange-500 transition hover:text-orange-600"
            >
              Login করুন
            </Link>
          </p>

        </form>

        {/* FOOTER NOTE */}
        <p className="mt-6 text-center text-xs text-slate-400">
          শ্রমবাজার — Global Workforce Platform
        </p>

      </div>
    </main>
  );
}