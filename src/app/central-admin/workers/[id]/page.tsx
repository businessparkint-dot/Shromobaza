"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  MapPin,
  Star,
  ShieldCheck,
  UserRound,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

type Worker = {
  id: string;
  profile_id: string | null;
  category: string | null;
  sub_category: string | null;
  experience: string | null;
  skills: string | null;
  district: string | null;
  rating: number | null;
  review_count: number | null;
  created_at: string;
};

export default function AdminWorkerProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWorker() {
      try {
        const { id } = await params;

        const response = await fetch(
          `/api/central-admin/workers/${id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Worker profile could not be loaded."
          );
        }

        setWorker(data.worker);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Worker profile could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorker();
  }, [params]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-slate-500"
          />

          <p className="mt-4 text-sm text-slate-400">
            Loading worker profile...
          </p>
        </div>
      </main>
    );
  }

  if (error || !worker) {
    return (
      <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/central-admin/workers"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Workers
          </Link>

          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6">
            <h1 className="text-xl font-semibold">
              Worker profile unavailable
            </h1>

            <p className="mt-2 text-sm text-red-300">
              {error || "Worker was not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/95 px-5 py-5 md:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/central-admin/workers"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Workers
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl p-5 md:p-8">
        {/* Profile header */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
                  <UserRound size={34} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Worker Profile
                  </p>

                  <h1 className="mt-1 text-2xl font-bold md:text-3xl">
                    {worker.sub_category ||
                      worker.category ||
                      "Worker"}
                  </h1>

                  {worker.category && (
                    <p className="mt-1 text-sm text-slate-400">
                      {worker.category}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
                <ShieldCheck size={16} />
                Active
              </div>
            </div>
          </div>
        </section>

        {/* Information */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-lg font-semibold">
              Professional Information
            </h2>

            <div className="mt-5 space-y-5">
              <InfoRow
                icon={<BriefcaseBusiness size={18} />}
                label="Category"
                value={worker.category || "Not provided"}
              />

              <InfoRow
                icon={<BriefcaseBusiness size={18} />}
                label="Sub-category"
                value={worker.sub_category || "Not provided"}
              />

              <InfoRow
                icon={<BriefcaseBusiness size={18} />}
                label="Experience"
                value={worker.experience || "Not provided"}
              />

              <InfoRow
                icon={<MapPin size={18} />}
                label="District"
                value={worker.district || "Not provided"}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-lg font-semibold">
              Performance
            </h2>

            <div className="mt-5 space-y-5">
              <InfoRow
                icon={<Star size={18} />}
                label="Rating"
                value={`${worker.rating ?? 0} / 5`}
              />

              <InfoRow
                icon={<Star size={18} />}
                label="Reviews"
                value={`${worker.review_count ?? 0}`}
              />

              <InfoRow
                icon={<CalendarDays size={18} />}
                label="Registered"
                value={new Date(
                  worker.created_at
                ).toLocaleDateString()}
              />

              <InfoRow
                icon={<ShieldCheck size={18} />}
                label="Profile Status"
                value="Active"
              />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold">
            Skills & Expertise
          </h2>

          <div className="mt-4 rounded-xl bg-black/20 p-4">
            <p className="text-sm leading-7 text-slate-300">
              {worker.skills || "No skills information provided."}
            </p>
          </div>
        </section>

        {/* Admin actions */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-lg font-semibold">
            Administration
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Worker verification and account controls will be
            connected here.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              disabled
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-500"
            >
              Verify Worker
            </button>

            <button
              disabled
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-500"
            >
              Suspend
            </button>

            <button
              disabled
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-500"
            >
              Edit Profile
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-500">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 text-sm text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}