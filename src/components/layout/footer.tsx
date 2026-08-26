import Link from "next/link";
import {
  Phone,
  ArrowUpRight,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-blue-900/20 bg-[#030712] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* =====================================================
              BRAND
          ====================================================== */}
          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >
              {/* S MARK */}
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">

                <div className="absolute inset-1 rounded-xl bg-blue-500/20 blur-[2px]" />

                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[3px_3px_0px_#f97316] transition-transform duration-200 group-hover:-translate-y-0.5">
                  <span className="text-2xl font-black italic leading-none text-white">
                    S
                  </span>
                </div>

              </div>

              {/* BRAND NAME */}
              <div className="leading-none">
                <p className="text-xl font-black tracking-[-0.03em] text-orange-400 transition-colors group-hover:text-orange-300">
                  Shromobazar
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-blue-300">
                  Skilled Workforce Platform
                </p>
              </div>
            </Link>

            {/* BUSINESS PARK INITIATIVE */}
                        <p className="mt-4 max-w-sm text-sm font-semibold italic leading-6 text-blue-300">
              Shromobazar is a{" "}
              <span className="font-black text-orange-400">
                Business Park International
              </span>{" "}
              initiative.
              businessparkint@gmail.com
            </p>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
              বাংলাদেশে দক্ষ শ্রমিক ও পেশাজীবীদের সঙ্গে কাজের সুযোগ
              সহজে যুক্ত করার একটি আধুনিক workforce platform।
            </p>
          </div>

          {/* =====================================================
              QUICK LINKS
          ====================================================== */}
          <div>
            <h3 className="font-bold text-white">
              Quick Links
            </h3>

            <div className="mt-4 space-y-3 text-sm text-white/60">

              <Link
                href="/workers"
                className="block transition hover:text-orange-400"
              >
                কর্মী খুঁজুন
              </Link>

              <Link
                href="/jobs"
                className="block transition hover:text-orange-400"
              >
                কাজ খুঁজুন
              </Link>

              <Link
                href="/worker-dashboard"
                className="block transition hover:text-orange-400"
              >
                Worker Dashboard
              </Link>

              <Link
                href="/employer-dashboard"
                className="block transition hover:text-orange-400"
              >
                Employer Dashboard
              </Link>

              <Link
                href="/"
                className="block transition hover:text-orange-400"
              >
                হোম
              </Link>

            </div>
          </div>

          {/* =====================================================
              REVENUE MODEL
          ====================================================== */}
          <div>
            <h3 className="font-bold text-white">
              Revenue Model
            </h3>

            <p className="mt-2 text-xs leading-5 text-white/40">
              Platform-এর সম্ভাব্য ভবিষ্যৎ আয়ের উৎস
            </p>

            <div className="mt-4 space-y-3">

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-sm font-semibold text-orange-400">
                  Commission
                </p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  সফল hiring ও job completion থেকে platform fee।
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-sm font-semibold text-blue-300">
                  Subscription
                </p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  নিয়মিত employer ও business-এর জন্য premium plans।
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-sm font-semibold text-white">
                  Featured Listing
                </p>
                <p className="mt-1 text-xs leading-5 text-white/50">
                  Job ও profile-এর অতিরিক্ত visibility-এর জন্য paid promotion।
                </p>
              </div>

            </div>
          </div>

          {/* =====================================================
              CONTACT + CTA
          ====================================================== */}
          <div>
            <h3 className="font-bold text-white">
              Contact Us
            </h3>

            <div className="mt-4 space-y-4 text-sm text-white/60">

              {/* REAL CONTACT NUMBER */}
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-orange-400" />

                <a
                  href="tel:01715942482"
                  className="font-semibold transition hover:text-orange-400"
                >
                  +8801715942482
                </a>
              </div>

            </div>

            {/* CTA */}
            <div className="mt-7 border-t border-white/10 pt-6">

              <h3 className="font-bold text-white">
                শুরু করুন
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/55">
                আপনার প্রয়োজনের দক্ষ কর্মী খুঁজুন অথবা নিজের দক্ষতা
                দিয়ে কাজের সুযোগ তৈরি করুন।
              </p>

              <Link
                href="/workers"
                className="mt-5 inline-flex items-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700"
              >
                কর্মী খুঁজুন

                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>

            </div>
          </div>

        </div>

        {/* =====================================================
            BOTTOM
        ====================================================== */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Shromobazar. All rights reserved.
        </div>

      </div>
    </footer>
  );
}