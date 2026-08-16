"use client";

import {
  Building2,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";

export default function EmployerPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">

      <div className="mx-auto max-w-xl px-4">

        <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">

          <h1 className="text-3xl font-bold text-navy">
            নিয়োগকর্তা নিবন্ধন
          </h1>

          <p className="mt-2 text-navy/60">
            আপনার কাজের জন্য দক্ষ কর্মী খুঁজে নিন।
          </p>


          <form className="mt-8 space-y-5">

            <div>
              <label className="text-sm font-medium text-navy">
                প্রতিষ্ঠান / ব্যক্তির নাম
              </label>

              <div className="relative mt-2">

                <Building2 className="absolute left-3 top-3 h-5 w-5 text-navy/40"/>

                <input
                  className="h-12 w-full rounded-xl border pl-11 px-4"
                  placeholder="নাম লিখুন"
                />

              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-navy">
                মোবাইল নম্বর
              </label>

              <div className="relative mt-2">

                <Phone className="absolute left-3 top-3 h-5 w-5 text-navy/40"/>

                <input
                  className="h-12 w-full rounded-xl border pl-11 px-4"
                  placeholder="01XXXXXXXXX"
                />

              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-navy">
                কাজের ধরন
              </label>

              <div className="relative mt-2">

                <Briefcase className="absolute left-3 top-3 h-5 w-5 text-navy/40"/>

                <input
                  className="h-12 w-full rounded-xl border pl-11 px-4"
                  placeholder="যেমন: বিল্ডিং নির্মাণ"
                />

              </div>
            </div>


            <div>
              <label className="text-sm font-medium text-navy">
                কাজের স্থান
              </label>

              <div className="relative mt-2">

                <MapPin className="absolute left-3 top-3 h-5 w-5 text-navy/40"/>

                <input
                  className="h-12 w-full rounded-xl border pl-11 px-4"
                  placeholder="জেলা"
                />

              </div>
            </div>


            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-orange font-semibold text-white hover:opacity-90"
            >
              নিবন্ধন করুন
            </button>


          </form>

        </div>

      </div>

    </main>
  );
}