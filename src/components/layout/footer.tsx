import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

export function Footer() {
  const quickLinks = [
    {
      href: "/workers",
      label: "কর্মী খুঁজুন",
      icon: Users,
    },
    {
      href: "/jobs",
      label: "কাজ খুঁজুন",
      icon: BriefcaseBusiness,
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      icon: Store,
    },
    {
      href: "/worker-dashboard",
      label: "Worker Dashboard",
      icon: Users,
    },
    {
      href: "/employer-dashboard",
      label: "Employer Dashboard",
      icon: Building2,
    },
    {
      href: "/",
      label: "হোম",
      icon: Globe2,
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-blue-900/30 bg-[#020617] text-white">
      {/* =====================================================
          BACKGROUND GLOW
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* =====================================================
            MAIN FOOTER GRID
        ====================================================== */}
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
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-md transition-all duration-300 group-hover:bg-blue-500/30" />

                <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 shadow-[4px_4px_0px_#f97316] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[5px_5px_0px_#f97316]">
                  <span className="text-2xl font-black italic leading-none text-white">
                    S
                  </span>
                </div>
              </div>

              {/* BRAND NAME */}
              <div className="leading-none">
                <p className="text-xl font-black tracking-[-0.04em] text-orange-400 transition-colors duration-300 group-hover:text-orange-300">
                  Shromobazar
                </p>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-blue-300">
                  Global Workforce Platform
                </p>
              </div>
            </Link>

            {/* BUSINESS PARK */}
            <div className="mt-5 rounded-2xl border border-blue-400/10 bg-blue-500/[0.04] p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
                An initiative of
              </p>

              <p className="mt-1 text-sm font-black text-orange-400">
                Business Park International
              </p>

              <p className="mt-1 text-xs text-white/40">
                Produce • Construction • Service • Consultancy
              </p>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
              বাংলাদেশে দক্ষ শ্রমিক, পেশাজীবী, employer ও ব্যবসার
              মধ্যে কাজের সুযোগ এবং business connection সহজে
              যুক্ত করার একটি আধুনিক workforce platform।
            </p>

            {/* EMAIL */}
            <a
              href="mailto:businessparkint@gmail.com"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition-colors hover:text-orange-400"
            >
              <Mail className="h-4 w-4" />
              businessparkint@gmail.com
            </a>
          </div>

          {/* =====================================================
              QUICK LINKS
          ====================================================== */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-black text-white">
              <span className="h-5 w-1 rounded-full bg-orange-500" />
              Quick Links
            </h3>

            <div className="mt-5 space-y-2">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-white/55 transition-all duration-200 hover:bg-white/[0.04] hover:text-orange-400"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-blue-400/70 transition-colors group-hover:text-orange-400" />

                      <span>{item.label}</span>
                    </span>

                    <ChevronRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              REVENUE MODEL
          ====================================================== */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-black text-white">
              <span className="h-5 w-1 rounded-full bg-blue-500" />
              Platform Plans
            </h3>

            <p className="mt-2 text-xs leading-5 text-white/40">
              Shromobazar-এর subscription-based platform model
            </p>

            <div className="mt-5 space-y-3">

              {/* SUBSCRIPTION */}
              <Link
                href="/subscriptions"
                className="group block rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/[0.10] to-orange-500/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/40 hover:bg-orange-500/[0.13]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-orange-400">
                    Subscription
                  </p>

                  <ArrowUpRight className="h-4 w-4 text-orange-400 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  Employer, seller, business ও service provider-এর
                  জন্য premium subscription plans।
                </p>
              </Link>

              {/* SHOP / OFFICE */}
              <Link
                href="/subscriptions"
                className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-blue-500/[0.05]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-blue-300">
                    Shop & Office Plans
                  </p>

                  <Store className="h-4 w-4 text-blue-300 opacity-60" />
                </div>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  Marketplace-এ নিজের Shop বা Office পরিচালনা এবং
                  advanced business tools ব্যবহারের জন্য paid plans।
                </p>
              </Link>

              {/* FEATURED */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-white">
                    Featured Listing
                  </p>

                  <ArrowUpRight className="h-4 w-4 text-white/30" />
                </div>

                <p className="mt-1 text-xs leading-5 text-white/50">
                  Job, profile, product ও service-এর অতিরিক্ত
                  visibility-এর জন্য optional paid promotion।
                </p>
              </div>

            </div>
          </div>

          {/* =====================================================
              CONTACT + CTA
          ====================================================== */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-black text-white">
              <span className="h-5 w-1 rounded-full bg-orange-500" />
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">

              {/* PHONE */}
              <a
                href="tel:01715942482"
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-200 hover:border-orange-400/30 hover:bg-orange-500/[0.05]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
                  <Phone className="h-4 w-4 text-orange-400" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">
                    Phone
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-white/75 transition-colors group-hover:text-orange-400">
                    +8801715942482
                  </p>
                </div>
              </a>

              {/* EMAIL */}
              <a
                href="mailto:businessparkint@gmail.com"
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all duration-200 hover:border-blue-400/30 hover:bg-blue-500/[0.05]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">
                    Email
                  </p>

                  <p className="mt-0.5 truncate text-sm font-bold text-white/70 transition-colors group-hover:text-blue-300">
                    businessparkint@gmail.com
                  </p>
                </div>
              </a>

              {/* LOCATION */}
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                  <MapPin className="h-4 w-4 text-blue-300" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/35">
                    Platform
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-white/70">
                    Bangladesh • Global Vision
                  </p>
                </div>
              </div>

            </div>

            {/* =================================================
                CTA
            ================================================== */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <h3 className="font-black text-white">
                শুরু করুন
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/50">
                আপনার প্রয়োজনের দক্ষ কর্মী খুঁজুন অথবা নিজের
                দক্ষতা দিয়ে কাজের সুযোগ তৈরি করুন।
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                {/* FIND WORKER */}
                <Link
                  href="/workers"
                  className="group inline-flex items-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-orange-400 hover:to-orange-600"
                >
                  কর্মী খুঁজুন

                  <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                {/* FIND JOB */}
                <Link
                  href="/jobs"
                  className="group inline-flex items-center rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-2.5 text-sm font-black text-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-blue-500/20 hover:text-white"
                >
                  কাজ খুঁজুন

                  <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            TRUST BAR
        ====================================================== */}
        <div className="mt-12 grid gap-3 border-y border-white/10 py-5 sm:grid-cols-3">

          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <ShieldCheck className="h-4 w-4 text-blue-300" />
            </div>

            <div>
              <p className="text-xs font-black text-white/80">
                Trust & Safety
              </p>

              <p className="mt-0.5 text-[11px] text-white/35">
                Better workforce connection
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 border-white/10 text-center sm:border-x sm:text-left">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
              <Users className="h-4 w-4 text-orange-400" />
            </div>

            <div>
              <p className="text-xs font-black text-white/80">
                Workforce Network
              </p>

              <p className="mt-0.5 text-[11px] text-white/35">
                Workers • Employers • Businesses
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-center sm:justify-end sm:text-left">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <Globe2 className="h-4 w-4 text-blue-300" />
            </div>

            <div>
              <p className="text-xs font-black text-white/80">
                Global Workforce Vision
              </p>

              <p className="mt-0.5 text-[11px] text-white/35">
                Built from Bangladesh
              </p>
            </div>
          </div>

        </div>

        {/* =====================================================
            BOTTOM BAR
        ====================================================== */}
        <div className="flex flex-col gap-4 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} Shromobazar. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/"
              className="transition-colors hover:text-orange-400"
            >
              Home
            </Link>

            <Link
              href="/workers"
              className="transition-colors hover:text-orange-400"
            >
              Workers
            </Link>

            <Link
              href="/jobs"
              className="transition-colors hover:text-orange-400"
            >
              Jobs
            </Link>

            <Link
              href="/marketplace"
              className="transition-colors hover:text-orange-400"
            >
              Marketplace
            </Link>

            <Link
              href="/subscriptions"
              className="transition-colors hover:text-orange-400"
            >
              Plans
            </Link>
          </div>

        </div>

        {/* =====================================================
            FINAL BRAND LINE
        ====================================================== */}
        <div className="mt-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/20">
            Shromobazar • Global Workforce Platform
          </p>
        </div>
      </div>
    </footer>
  );
}