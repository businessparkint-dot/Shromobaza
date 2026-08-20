"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  UserRound,
  Phone,
  MapPin,
  Briefcase,
  Store,
  Users,
  Pencil,
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

const CURRENT_USER_KEY = "shromobazar_current_user";
const STORAGE_KEY = "shromobazar_users";

export default function ProfilePage() {
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-500">
          Profile লোড হচ্ছে...
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <UserRound className="mx-auto h-12 w-12 text-slate-300" />

          <h1 className="mt-4 text-2xl font-black text-slate-900">
            কোনো Profile পাওয়া যায়নি
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            প্রথমে শ্রমবাজারে নিবন্ধন করুন।
          </p>

          <Link
            href="/register"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            নিবন্ধন করুন
          </Link>
        </div>
      </main>
    );
  }

  const accountType =
    user.userType === "worker"
      ? "কর্মী"
      : user.userType === "employer"
      ? "নিয়োগকর্তা"
      : "সাধারণ গ্রাহক";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={
              user.userType === "worker"
                ? "/worker-dashboard"
                : user.userType === "employer"
                ? "/employer-dashboard"
                : "/"
            }
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            ফিরে যান
          </Link>

          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>

        {/* PROFILE CARD */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* COVER */}
          <div className="h-28 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 sm:h-36" />

          <div className="px-5 pb-7 sm:px-8">

            {/* AVATAR */}
            <div className="-mt-12 flex items-end justify-between">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-slate-100 shadow-md">
                <UserRound className="h-11 w-11 text-slate-400" />
              </div>

              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                নিবন্ধিত
              </div>
            </div>

            {/* NAME */}
            <div className="mt-5">
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                {user.name}
              </h1>

              <p className="mt-1 text-sm font-semibold text-orange-500">
                {accountType}
              </p>
            </div>

            {/* INFO */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      মোবাইল নম্বর
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {user.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      এলাকা
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {user.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    {user.userType === "worker" ? (
                      <Briefcase className="h-5 w-5" />
                    ) : user.userType === "employer" ? (
                      <Store className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Account Type
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {accountType}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div>
                  <p className="text-xs text-slate-400">
                    User ID
                  </p>
                  <p className="mt-1 break-all text-sm font-bold text-slate-800">
                    {user.id}
                  </p>
                </div>
              </div>

            </div>

            {/* WORKER DETAILS */}
            {user.userType === "worker" && (
              <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/50 p-5">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-orange-500" />

                  <h2 className="font-bold text-slate-900">
                    পেশাগত তথ্য
                  </h2>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-slate-400">
                      Category
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {user.workerCategory || "—"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs text-slate-400">
                      Sub-category
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {user.workerSubCategory || "—"}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* EMPLOYER DETAILS */}
            {user.userType === "employer" && (
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-blue-500" />

                  <h2 className="font-bold text-slate-900">
                    নিয়োগকর্তার তথ্য
                  </h2>
                </div>

                <div className="mt-4 rounded-xl bg-white p-4">
                  <p className="text-xs text-slate-400">
                    নিয়োগকর্তার ধরন
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {user.employerType || "—"}
                  </p>
                </div>
              </div>
            )}

            {/* EDIT BUTTON */}
            <Link
              href="/profile/edit"
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
            >
              <Pencil className="h-4 w-4" />
              আমার Profile সম্পাদনা করুন
            </Link>

          </div>
        </section>

        <p className="mt-5 text-center text-xs text-slate-400">
          শ্রমবাজার — Global Workforce Platform
        </p>
      </div>
    </main>
  );
}