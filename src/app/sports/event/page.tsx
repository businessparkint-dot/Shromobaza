"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flag,
  ImagePlus,
  MapPin,
  Radio,
  Save,
  ShieldCheck,
  Trophy,
  Users,
  Video,
  X,
} from "lucide-react";

type EventVisibility = "public" | "private";

type EventForm = {
  eventName: string;
  sport: string;
  tournament: string;
  venue: string;
  date: string;
  time: string;
  teamOne: string;
  teamTwo: string;
  contact: string;
  description: string;
  visibility: EventVisibility;
  livePlanned: boolean;
};

const SPORTS = [
  "Football",
  "Cricket",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Tennis",
  "Hockey",
  "Table Tennis",
  "Kabaddi",
  "Athletics",
  "Other",
];

const initialForm: EventForm = {
  eventName: "",
  sport: "Football",
  tournament: "",
  venue: "",
  date: "",
  time: "",
  teamOne: "",
  teamTwo: "",
  contact: "",
  description: "",
  visibility: "public",
  livePlanned: false,
};

export default function SportsEventPage() {
  const [form, setForm] = useState<EventForm>(initialForm);
  const [poster, setPoster] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof EventForm>(
    key: K,
    value: EventForm[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handlePoster = (file: File | null) => {
    setPoster(file);

    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const submitEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /*
      Foundation only.

      এখানে এখনো Supabase event table নেই।
      তাই কোনো fake database insert করছি না।

      Database/Event backend যুক্ত হলে এই একই form:
      Create Event → Review → Publish
      flow-এ যাবে।
    */

    setSubmitted(true);
  };

  const resetForm = () => {
    setForm(initialForm);
    setPoster(null);
    setPreview("");
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/sports"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-200">
                <Trophy size={20} />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-base font-black sm:text-lg">
                  Create Sports Event
                </h1>
                <p className="truncate text-[11px] text-slate-500">
                  Shromo Sports
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/sports/live"
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            <Radio size={15} />
            Sports Live
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-orange-300">
                Shromo Sports
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold text-white/60">
                Event Center
              </span>
            </div>

            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              Create Your Sports Event
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
              Local game, school competition, university tournament বা
              professional event — event information এক জায়গায় তৈরি করার
              foundation।
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          SUCCESS
      ========================================================= */}
      {submitted && (
        <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />

            <div className="min-w-0 flex-1">
              <h3 className="font-black">Event information ready</h3>

              <p className="mt-1 text-sm leading-6 text-emerald-800/70">
                Event form successfully prepared. Database publishing will be
                connected when the Sports Event backend is added.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="rounded-lg p-1 text-emerald-700 hover:bg-emerald-100"
            >
              <X size={18} />
            </button>
          </div>
        </section>
      )}

      {/* =========================================================
          FORM
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <form onSubmit={submitEvent} className="space-y-5">
          {/* BASIC INFORMATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon={Trophy}
              title="Event Information"
              description="Basic information about the sports event."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Event Name" required>
                <input
                  value={form.eventName}
                  onChange={(e) => update("eventName", e.target.value)}
                  placeholder="Example: Dhaka District Football Final"
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Sport" required>
                <select
                  value={form.sport}
                  onChange={(e) => update("sport", e.target.value)}
                  className={inputClass}
                >
                  {SPORTS.map((sport) => (
                    <option key={sport} value={sport}>
                      {sport}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Tournament / Competition">
                <input
                  value={form.tournament}
                  onChange={(e) => update("tournament", e.target.value)}
                  placeholder="Tournament name"
                  className={inputClass}
                />
              </Field>

              <Field label="Venue">
                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={form.venue}
                    onChange={(e) => update("venue", e.target.value)}
                    placeholder="Venue / Stadium / Ground"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* DATE / TIME */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon={CalendarDays}
              title="Date & Time"
              description="When will the event happen?"
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Event Date" required>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                  required
                  className={inputClass}
                />
              </Field>

              <Field label="Start Time" required>
                <div className="relative">
                  <Clock3
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    required
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* TEAMS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon={Users}
              title="Participants"
              description="Add teams or participants when applicable."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Team / Participant 1">
                <input
                  value={form.teamOne}
                  onChange={(e) => update("teamOne", e.target.value)}
                  placeholder="Team / Player / Participant"
                  className={inputClass}
                />
              </Field>

              <Field label="Team / Participant 2">
                <input
                  value={form.teamTwo}
                  onChange={(e) => update("teamTwo", e.target.value)}
                  placeholder="Team / Player / Participant"
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          {/* POSTER */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon={ImagePlus}
              title="Event Poster"
              description="Optional poster for the public event."
            />

            <div className="mt-6">
              <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-orange-300 hover:bg-orange-50/30">
                {preview ? (
                  <div className="relative h-full min-h-[180px] w-full">
                    <img
                      src={preview}
                      alt="Event poster preview"
                      className="absolute inset-0 h-full w-full object-contain"
                    />

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white">
                      {poster?.name}
                    </div>
                  </div>
                ) : (
                  <>
                    <ImagePlus size={32} className="text-slate-400" />

                    <span className="mt-3 text-sm font-bold text-slate-700">
                      Upload event poster
                    </span>

                    <span className="mt-1 text-xs text-slate-400">
                      JPG, PNG or WebP
                    </span>
                  </>
                )}

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handlePoster(e.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
          </div>

          {/* LIVE */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                <Video size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-black text-slate-900">
                  SHROMO SPORTS LIVE
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  এই event কি future-এ live broadcast করার জন্য planned?
                </p>

                <label className="mt-4 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.livePlanned}
                    onChange={(e) =>
                      update("livePlanned", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  />

                  <span className="text-sm font-bold text-slate-800">
                    Yes, Live Broadcast planned
                  </span>
                </label>

                <div className="mt-3 flex items-start gap-2 rounded-xl border border-orange-200 bg-white/70 p-3 text-xs leading-5 text-slate-500">
                  <ShieldCheck
                    size={15}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />

                  <span>
                    Live broadcast publish করার আগে event এবং organizer
                    verification প্রয়োজন হবে।
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon={Flag}
              title="Description"
              description="Tell viewers about the event."
            />

            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              placeholder="Event সম্পর্কে সংক্ষিপ্ত তথ্য..."
              className={`${inputClass} mt-6 resize-none`}
            />
          </div>

          {/* CONTACT + VISIBILITY */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <SectionTitle
              icon={ShieldCheck}
              title="Contact & Visibility"
              description="Control how the event should be shared."
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Contact">
                <input
                  value={form.contact}
                  onChange={(e) => update("contact", e.target.value)}
                  placeholder="Phone / email"
                  className={inputClass}
                />
              </Field>

              <Field label="Visibility">
                <select
                  value={form.visibility}
                  onChange={(e) =>
                    update(
                      "visibility",
                      e.target.value as EventVisibility,
                    )
                  }
                  className={inputClass}
                >
                  <option value="public">
                    Public — সবাই দেখতে পারবে
                  </option>

                  <option value="private">
                    Private — restricted event
                  </option>
                </select>
              </Field>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
            >
              <Save size={17} />
              Prepare Event
            </button>
          </div>
        </form>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            <strong className="text-slate-600">SHROMO SPORTS</strong>{" "}
            • Shromobazar
          </span>

          <Link
            href="/sports/live"
            className="font-bold text-orange-500 hover:text-orange-600"
          >
            Open Sports Live
          </Link>
        </div>
      </footer>
    </main>
  );
}

/* =============================================================
   SMALL COMPONENTS
============================================================= */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100";

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {children}
    </label>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Trophy;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        <Icon size={19} />
      </div>

      <div>
        <h3 className="font-black text-slate-900">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}