"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, UserPlus } from "lucide-react";

import { workers, type Worker } from "@/lib/database";

const STORAGE_KEY = "shromobazar_workers";

export default function RegisterWorkerPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [currentWork, setCurrentWork] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !role.trim() ||
      !category.trim() ||
      !location.trim() ||
      !phone.trim()
    ) {
      setMessage("দয়া করে প্রয়োজনীয় সব তথ্য পূরণ করুন।");
      return;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      const existingWorkers: Worker[] = saved
        ? JSON.parse(saved)
        : [];

      const newWorker = {
        id: `REG-${Date.now()}`,
        name: name.trim(),
        role: role.trim(),
        category: category.trim(),
        location: location.trim(),
        phone: phone.trim(),
        experience: experience.trim() || "নতুন",
        currentWork: currentWork.trim() || "নতুন নিবন্ধিত কর্মী",
        skills: skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        rating: 0,
        verified: false,
      } as Worker;

      const updatedWorkers = [
        ...existingWorkers,
        newWorker,
      ];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedWorkers)
      );

      setMessage("নিবন্ধন সফল হয়েছে।");

      setName("");
      setRole("");
      setCategory("");
      setLocation("");
      setPhone("");
      setExperience("");
      setCurrentWork("");
      setSkills("");

      window.setTimeout(() => {
        window.location.href = `/workers/${newWorker.id}`;
      }, 800);
    } catch (error) {
      console.error(error);
      setMessage(
        "নিবন্ধন সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।"
      );
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
              Worker Profile তৈরি করুন।
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-10"
          >

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  পূর্ণ নাম *
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  পেশা *
                </label>

                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="যেমন: রাজমিস্ত্রি"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  কাজের ধরন *
                </label>

                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="যেমন: নির্মাণ"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  জেলা / এলাকা *
                </label>

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="যেমন: ঢাকা"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
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
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  অভিজ্ঞতা
                </label>

                <input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="যেমন: ৫ বছর"
                  className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                বর্তমান কাজ
              </label>

              <input
                value={currentWork}
                onChange={(e) => setCurrentWork(e.target.value)}
                placeholder="বর্তমানে কী ধরনের কাজ করছেন?"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                দক্ষতা
              </label>

              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="কমা দিয়ে লিখুন: ইটের কাজ, প্লাস্টার, টাইলস"
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {message && (
              <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700">
                <CheckCircle size={18} />
                {message}
              </div>
            )}

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-6 font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              নিবন্ধন করুন
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}