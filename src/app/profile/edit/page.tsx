"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Phone,
  MapPin,
  Briefcase,
  Store,
  Save,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

type UserType = "worker" | "employer" | "customer";

type RegisteredUser = {
  id: string;
  name: string;
  phone: string;
  location: string;
  userType: UserType;
  workerCategory?: string;
  workerSubCategory?: string;
  employerType?: string;
  createdAt: string;
};

const STORAGE_KEY = "shromobazar_users";
const CURRENT_USER_KEY = "shromobazar_current_user";

const workerSubCategories: Record<string, string[]> = {
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
    "AC Technician",
    "ওয়েল্ডার",
    "মেকানিক",
    "ড্রাইভার",
    "টেকনিশিয়ান",
    "মেশিন অপারেটর",
    "রেফ্রিজারেশন টেকনিশিয়ান",
    "ইঞ্জিনিয়ার",
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

export default function EditProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<RegisteredUser | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [workerCategory, setWorkerCategory] = useState("শ্রমিক");
  const [workerSubCategory, setWorkerSubCategory] = useState("");

  const [employerType, setEmployerType] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);

      if (!savedUser) {
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(savedUser) as RegisteredUser;

      setUser(parsed);
      setName(parsed.name || "");
      setPhone(parsed.phone || "");
      setLocation(parsed.location || "");
      setWorkerCategory(parsed.workerCategory || "শ্রমিক");
      setWorkerSubCategory(parsed.workerSubCategory || "");
      setEmployerType(parsed.employerType || "");
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const subCategories = useMemo(() => {
    return workerSubCategories[workerCategory] || [];
  }, [workerCategory]);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!user) {
      setError("Profile পাওয়া যায়নি।");
      return;
    }

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

    const normalizedPhone = cleanPhone.replace(/\s+/g, "");

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

    if (user.userType === "worker") {
      if (!workerCategory) {
        setError("কর্মীর Category নির্বাচন করুন।");
        return;
      }

      if (!workerSubCategory) {
        setError("কর্মীর Sub-category নির্বাচন করুন।");
        return;
      }
    }

    if (user.userType === "employer") {
      if (!employerType) {
        setError("নিয়োগকর্তার ধরন নির্বাচন করুন।");
        return;
      }
    }

    const updatedUser: RegisteredUser = {
      ...user,
      name: cleanName,
      phone: cleanPhone,
      location: cleanLocation,
      ...(user.userType === "worker"
        ? {
            workerCategory,
            workerSubCategory,
          }
        : {}),
      ...(user.userType === "employer"
        ? {
            employerType,
          }
        : {}),
    };

    try {
      /*
       * Update current user
       */
      localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(updatedUser)
      );

      /*
       * Update user inside registered users list
       */
      const savedUsers = localStorage.getItem(STORAGE_KEY);

      if (savedUsers) {
        try {
          const parsedUsers = JSON.parse(savedUsers);

          if (Array.isArray(parsedUsers)) {
            const updatedUsers = parsedUsers.map(
              (existingUser: RegisteredUser) =>
                existingUser.id === updatedUser.id
                  ? updatedUser
                  : existingUser
            );

            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify(updatedUsers)
            );
          }
        } catch {
          // Keep current user updated even if the users list is invalid.
        }
      }

      setUser(updatedUser);
      setSuccess(true);

      setTimeout(() => {
        router.push("/profile");
      }, 700);
    } catch {
      setError(
        "Profile update করা যায়নি। আবার চেষ্টা করুন।"
      );
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-500">
          Profile লোড হচ্ছে...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <UserRound className="mx-auto h-12 w-12 text-slate-300" />

          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Profile পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            প্রথমে শ্রমবাজারে নিবন্ধন করুন।
          </p>

          <Link
            href="/register"
            className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            নিবন্ধন করুন
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Profile-এ ফিরে যান
          </Link>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div>
            <p className="text-sm font-bold text-orange-500">
              শ্রমবাজার
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Profile Edit করুন
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              আপনার নিবন্ধিত তথ্য পরিবর্তন করে Save করুন।
            </p>
          </div>

          {/* BASIC INFORMATION */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">

            {/* NAME */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                নাম
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-orange-400 focus-within:bg-white">
                <UserRound className="mr-3 h-5 w-5 text-slate-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full bg-transparent text-sm outline-none"
                  placeholder="আপনার পূর্ণ নাম"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                মোবাইল নম্বর
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-orange-400 focus-within:bg-white">
                <Phone className="mr-3 h-5 w-5 text-slate-400" />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 w-full bg-transparent text-sm outline-none"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            {/* LOCATION */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                এলাকা
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-orange-400 focus-within:bg-white">
                <MapPin className="mr-3 h-5 w-5 text-slate-400" />

                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 w-full bg-transparent text-sm outline-none"
                >
                  <option value="">
                    জেলা নির্বাচন করুন
                  </option>

                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ACCOUNT TYPE */}
            <div>
              <label className="text-sm font-bold text-slate-700">
                Account Type
              </label>

              <div className="mt-2 flex h-12 items-center rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm font-bold text-slate-600">
                {user.userType === "worker"
                  ? "কর্মী"
                  : user.userType === "employer"
                  ? "নিয়োগকর্তা"
                  : "সাধারণ গ্রাহক"}
              </div>
            </div>
          </div>

          {/* WORKER */}
          {user.userType === "worker" && (
            <div className="mt-7 rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-orange-500" />

                <h2 className="font-bold text-slate-900">
                  পেশাগত তথ্য
                </h2>
              </div>

              {/* CATEGORY */}
              <div className="mt-5">
                <label className="text-sm font-bold text-slate-700">
                  Category
                </label>

                <select
                  value={workerCategory}
                  onChange={(e) => {
                    setWorkerCategory(e.target.value);
                    setWorkerSubCategory("");
                  }}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
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
                  Sub-category
                </label>

                <select
                  value={workerSubCategory}
                  onChange={(e) =>
                    setWorkerSubCategory(e.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
                >
                  <option value="">
                    Sub-category নির্বাচন করুন
                  </option>

                  {subCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* EMPLOYER */}
          {user.userType === "employer" && (
            <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-500" />

                <h2 className="font-bold text-slate-900">
                  নিয়োগকর্তার তথ্য
                </h2>
              </div>

              <div className="mt-5">
                <label className="text-sm font-bold text-slate-700">
                  নিয়োগকর্তার ধরন
                </label>

                <select
                  value={employerType}
                  onChange={(e) =>
                    setEmployerType(e.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-400"
                >
                  <option value="">
                    ধরন নির্বাচন করুন
                  </option>

                  {employerTypes.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* CUSTOMER */}
          {user.userType === "customer" && (
            <div className="mt-7 rounded-2xl border border-green-100 bg-green-50/50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />

                <div>
                  <h2 className="font-bold text-slate-900">
                    সাধারণ গ্রাহক
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    সাধারণ গ্রাহক হিসেবে আপনার basic
                    information আপডেট করতে পারবেন।
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />

              <span>
                Profile সফলভাবে আপডেট হয়েছে। Profile-এ নেওয়া হচ্ছে...
              </span>
            </div>
          )}

          {/* SAVE */}
          <button
            type="submit"
            disabled={success}
            className="mt-7 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {success
              ? "আপডেট সম্পন্ন"
              : "Profile Save করুন"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          শ্রমবাজার — Global Workforce Platform
        </p>
      </div>
    </main>
  );
}