"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserRound,
  Briefcase,
  MapPin,
  Star,
  CheckCircle,
  Clock3,
  Languages,
  ArrowLeft,
} from "lucide-react";

type Language = "bn" | "en";

export default function WorkerDashboard() {
  const [language, setLanguage] = useState<Language>("bn");

  const worker = {
    name: "মোঃ রাকিব হাসান",
    role: "রাজমিস্ত্রি",
    location: "ঢাকা",
    experience: "৮+ বছর",
    rating: "4.9",
    skills: [
      "ইটের কাজ",
      "প্লাস্টার",
      "টাইলস",
    ],
  };

  const applications = [
    {
      id: 1,
      job: "দক্ষ রাজমিস্ত্রি প্রয়োজন",
      company: "Construction Company",
      status: "Pending",
    },
    {
      id: 2,
      job: "Building Maintenance",
      company: "ABC Developer",
      status: "Accepted",
    },
  ];

  const isBangla = language === "bn";

  const text = {
    dashboard: isBangla ? "কর্মী ড্যাশবোর্ড" : "Worker Dashboard",
    welcome: isBangla
      ? "আপনার কাজ ও প্রোফাইলের সারসংক্ষেপ"
      : "Overview of your profile and work",
    profile: isBangla ? "আমার প্রোফাইল" : "My Profile",
    skills: isBangla ? "দক্ষতা" : "Skills",
    applications: isBangla ? "আবেদন করা কাজ" : "Applied Jobs",
    location: isBangla ? "ঢাকা" : "Dhaka",
    experience: isBangla ? "অভিজ্ঞতা" : "Experience",
    rating: isBangla ? "রেটিং" : "Rating",
    pending: isBangla ? "অপেক্ষমাণ" : "Pending",
    accepted: isBangla ? "গৃহীত" : "Accepted",
    viewProfile: isBangla
      ? "প্রোফাইল দেখুন"
      : "View Profile",
    findJobs: isBangla
      ? "কাজ খুঁজুন"
      : "Find Jobs",
    backHome: isBangla
      ? "হোমে ফিরে যান"
      : "Back to Home",
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md">
              <Briefcase className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-bold text-slate-900">
                শ্রমবাজার
              </p>

              <p className="text-xs text-slate-400">
                Shromobazar
              </p>
            </div>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Language */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <Languages className="ml-2 h-4 w-4 text-slate-500" />

              <button
                type="button"
                onClick={() => setLanguage("bn")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  language === "bn"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-slate-500 hover:bg-white"
                }`}
              >
                বাংলা
              </button>

              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  language === "en"
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-slate-500 hover:bg-white"
                }`}
              >
                English
              </button>
            </div>

          </div>
        </div>
      </header>


      {/* Dashboard */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-500"
        >
          <ArrowLeft className="h-4 w-4" />
          {text.backHome}
        </Link>


        {/* Heading */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-800 via-blue-900 to-slate-950 p-7 shadow-xl shadow-blue-900/10">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-400/10 px-3 py-1.5 text-xs font-bold text-orange-300">
                <CheckCircle className="h-4 w-4" />
                {isBangla
                  ? "সক্রিয় কর্মী প্রোফাইল"
                  : "Active Worker Profile"}
              </div>

              <h1 className="text-3xl font-bold text-white md:text-4xl">
                {text.dashboard}
              </h1>

              <p className="mt-2 text-sm text-blue-200 md:text-base">
                {text.welcome}
              </p>
            </div>


            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs text-blue-200">
                {isBangla ? "বর্তমান রেটিং" : "Current Rating"}
              </p>

              <div className="mt-1 flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                <span className="text-2xl font-bold text-white">
                  {worker.rating}
                </span>
              </div>
            </div>

          </div>
        </div>


        {/* Main Cards */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">


          {/* Profile */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold text-slate-900">
                {text.profile}
              </h2>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <UserRound className="h-6 w-6" />
              </div>

            </div>


            <div className="mt-6 flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl font-bold text-white shadow-md">
                {worker.name.charAt(0)}
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  {worker.name}
                </h3>

                <p className="mt-1 text-sm font-semibold text-orange-500">
                  {worker.role}
                </p>
              </div>

            </div>


            <div className="mt-6 space-y-3">

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-orange-500" />
                {text.location}
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                <Briefcase className="h-4 w-4 text-blue-600" />
                {text.experience}: {worker.experience}
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {text.rating}: {worker.rating}
              </div>

            </div>


            <Link
              href="/workers"
              className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-orange-500 font-bold text-white transition hover:bg-orange-600"
            >
              {text.viewProfile}
            </Link>

          </div>


          {/* Skills */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold text-slate-900">
                {text.skills}
              </h2>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <Briefcase className="h-6 w-6" />
              </div>

            </div>


            <p className="mt-2 text-sm text-slate-500">
              {isBangla
                ? "আপনার প্রধান কাজের দক্ষতাগুলো"
                : "Your primary professional skills"}
            </p>


            <div className="mt-6 flex flex-wrap gap-2">

              {worker.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
                >
                  {skill}
                </span>
              ))}

            </div>


            <div className="mt-8 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-5">

              <p className="text-xs font-semibold text-orange-500">
                {isBangla
                  ? "প্রোফাইল স্ট্যাটাস"
                  : "Profile Status"}
              </p>

              <p className="mt-1 text-lg font-bold text-slate-800">
                {isBangla
                  ? "প্রোফাইল সম্পূর্ণ"
                  : "Profile Complete"}
              </p>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full w-[90%] rounded-full bg-orange-500" />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                90%
              </p>

            </div>

          </div>


          {/* Applications */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold text-slate-900">
                {text.applications}
              </h2>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Clock3 className="h-6 w-6" />
              </div>

            </div>


            <div className="mt-5 space-y-4">

              {applications.map((app) => {

                const accepted = app.status === "Accepted";

                return (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {app.job}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {app.company}
                        </p>
                      </div>

                      {accepted ? (
                        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                      ) : (
                        <Clock3 className="h-5 w-5 shrink-0 text-orange-500" />
                      )}

                    </div>


                    <span
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        accepted
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-orange-50 text-orange-600"
                      }`}
                    >
                      {accepted
                        ? text.accepted
                        : text.pending}
                    </span>

                  </div>
                );
              })}

            </div>


            <Link
              href="/jobs"
              className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 font-bold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            >
              {text.findJobs}
            </Link>

          </div>

        </div>

      </section>
    </main>
  );
}