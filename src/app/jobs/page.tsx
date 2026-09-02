"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  MapPin,
  Plus,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type Job = {
  id: string;
  employer_id: string;
  title: string;
  location: string | null;
  salary: string | null;
  workers_needed: number | null;
  description: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  employers?: {
    id: string;
    profile_id: string;
    employer_type: string | null;
    company_name: string | null;
    description: string | null;
  } | null;
};

type FormState = {
  title: string;
  location: string;
  salary: string;
  workersNeeded: string;
  description: string;
};

const initialForm: FormState = {
  title: "",
  location: "",
  salary: "",
  workersNeeded: "1",
  description: "",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadJobs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/jobs", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.details || data?.error || "Jobs load failed."
        );
      }

      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Jobs load failed."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function createJob(event: React.FormEvent) {
    event.preventDefault();

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("আগে Login করুন।");
        return;
      }

      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          salary: form.salary,
          workersNeeded: form.workersNeeded,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.details || data?.error || "Job create failed."
        );
      }

      setSuccess("Job সফলভাবে তৈরি হয়েছে।");
      setForm(initialForm);
      setShowCreate(false);

      await loadJobs();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Job create failed."
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-orange-500"
            >
              ← হোমে ফিরুন
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
                <Briefcase className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                  সব কাজ
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Real Supabase Jobs
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowCreate(true);
              setError("");
              setSuccess("");
            }}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            <Plus className="h-5 w-5" />
            Job Post করুন
          </button>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* JOBS */}
        {loading ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-slate-500">
              Job তথ্য লোড হচ্ছে...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50">
              <Briefcase className="h-8 w-8 text-orange-500" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              এখনো কোনো Job নেই
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Employer একটি Job Post করলে সেটি এখানে দেখা যাবে।
            </p>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              প্রথম Job Post করুন
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {jobs.map((job) => {
              const employerName =
                job.employers?.company_name || "Employer";

              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        {job.status === "open"
                          ? "Available"
                          : job.status || "Job"}
                      </span>

                      <h2 className="mt-4 text-xl font-black text-slate-900 group-hover:text-orange-600">
                        {job.title}
                      </h2>

                      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Building2 className="h-4 w-4" />
                        {employerName}
                      </div>
                    </div>

                    <ArrowRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-orange-500" />
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <MapPin className="h-4 w-4 text-orange-500" />
                      <p className="mt-2 text-xs text-slate-400">
                        স্থান
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-800">
                        {job.location || "উল্লেখ নেই"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <Wallet className="h-4 w-4 text-orange-500" />
                      <p className="mt-2 text-xs text-slate-400">
                        পারিশ্রমিক
                      </p>
                      <p className="mt-1 truncate text-sm font-bold text-slate-800">
                        {job.salary || "উল্লেখ নেই"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <Users className="h-4 w-4 text-orange-500" />
                      <p className="mt-2 text-xs text-slate-400">
                        প্রয়োজন
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {job.workers_needed || 1} জন
                      </p>
                    </div>
                  </div>

                  {job.description && (
                    <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
                      {job.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* CREATE JOB MODAL */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    নতুন Job Post
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    আপনার Employer account থেকে real Job তৈরি করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={createJob}
                className="space-y-5 p-6"
              >
                <div>
                  <label className="text-sm font-bold text-slate-800">
                    Job Title
                  </label>

                  <input
                    required
                    value={form.title}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        title: event.target.value,
                      })
                    }
                    placeholder="যেমন: Mason প্রয়োজন"
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-bold text-slate-800">
                      Location
                    </label>

                    <input
                      required
                      value={form.location}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          location: event.target.value,
                        })
                      }
                      placeholder="Bagerhat"
                      className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-800">
                      Salary / পারিশ্রমিক
                    </label>

                    <input
                      required
                      value={form.salary}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          salary: event.target.value,
                        })
                      }
                      placeholder="৳ 1,000 / দিন"
                      className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800">
                    কতজন Worker প্রয়োজন?
                  </label>

                  <input
                    required
                    min="1"
                    type="number"
                    value={form.workersNeeded}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        workersNeeded: event.target.value,
                      })
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800">
                    কাজের বিবরণ
                  </label>

                  <textarea
                    rows={5}
                    value={form.description}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        description: event.target.value,
                      })
                    }
                    placeholder="কাজের বিস্তারিত লিখুন..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  />
                </div>

                <button
                  disabled={creating}
                  type="submit"
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? "Job তৈরি হচ্ছে..."
                    : "Job Post করুন"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}