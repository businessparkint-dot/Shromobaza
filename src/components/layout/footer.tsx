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
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#030b1c] text-white">
      {/* =====================================================
          PREMIUM BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-600/10 blur-[100px]" />

        <div className="absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[110px]" />

        <div className="absolute bottom-[-220px] left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.05] blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,64,175,0.08),transparent_38%)]" />
      </div>

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

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
              className="group inline-flex items-center rounded-2xl transition-transform duration-300 hover:-translate-y-0.5"
            >
              <img
                src="/shromobazar-header-logo.png"
                alt="Shromobazar"
                className="h-[72px] w-auto max-w-[270px] object-contain drop-shadow-[0_8px_20px_rgba(37,99,235,0.18)] transition duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            <div className="mt-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/70">
                Global Workforce Platform
              </p>

              <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
                কাজ, কর্মী, ব্যবসা, সেবা, marketplace ও মানুষের
                প্রয়োজনকে একটি connected ecosystem-এর মাধ্যমে
                একসাথে যুক্ত করার আধুনিক platform।
              </p>
            </div>

            {/* BUSINESS PARK */}

            <div className="mt-6 rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/[0.10] to-white/[0.02] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">
                An initiative of
              </p>

              <p className="mt-1 text-sm font-black text-orange-400">
                Business Park International
              </p>

              <p className="mt-1 text-xs leading-5 text-white/35">
                Produce • Construction • Service • Consultancy
              </p>
            </div>

            {/* EMAIL */}

            <a
              href="mailto:businessparkint@gmail.com"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition-colors hover:text-orange-400"
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

            <p className="mt-2 text-xs text-white/30">
              দ্রুত প্রয়োজনীয় জায়গায় যান
            </p>

            <div className="mt-5 space-y-1.5">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm text-white/55 transition-all duration-200 hover:border-white/5 hover:bg-white/[0.045] hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/[0.08]">
                        <Icon className="h-4 w-4 text-blue-300/80 transition-colors group-hover:text-orange-400" />
                      </span>

                      <span>{item.label}</span>
                    </span>

                    <ChevronRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-orange-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* =====================================================
              PLATFORM PLANS
          ====================================================== */}

          <div>
            <h3 className="flex items-center gap-2 text-base font-black text-white">
              <span className="h-5 w-1 rounded-full bg-blue-500" />
              Platform Plans
            </h3>

            <p className="mt-2 text-xs leading-5 text-white/35">
              Shromobazar-এর subscription-based platform model
            </p>

            <div className="mt-5 space-y-3">

              {/* SUBSCRIPTION */}

              <Link
                href="/subscriptions"
                className="group block rounded-2xl border border-orange-400/15 bg-gradient-to-br from-orange-500/[0.10] to-white/[0.02] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-400/35 hover:bg-orange-500/[0.13]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-orange-400">
                    Subscription
                  </p>

                  <ArrowUpRight className="h-4 w-4 text-orange-400 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                <p className="mt-1 text-xs leading-5 text-white/45">
                  Employer, seller, business ও service provider-এর
                  জন্য premium subscription plans।
                </p>
              </Link>

              {/* SHOP / OFFICE */}

              <Link
                href="/subscriptions"
                className="group block rounded-2xl border border-blue-400/10 bg-blue-500/[0.045] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/25 hover:bg-blue-500/[0.08]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-blue-300">
                    Shop & Office Plans
                  </p>

                  <Store className="h-4 w-4 text-blue-300 opacity-70" />
                </div>

                <p className="mt-1 text-xs leading-5 text-white/45">
                  Marketplace-এ নিজের Shop বা Office পরিচালনা এবং
                  advanced business tools ব্যবহারের জন্য paid plans।
                </p>
              </Link>

              {/* FEATURED */}

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-white/85">
                    Featured Listing
                  </p>

                  <ArrowUpRight className="h-4 w-4 text-white/25" />
                </div>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  Job, profile, product ও service-এর অতিরিক্ত
                  visibility-এর জন্য optional paid promotion।
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              CONTACT
          ====================================================== */}

          <div>
            <h3 className="flex items-center gap-2 text-base font-black text-white">
              <span className="h-5 w-1 rounded-full bg-orange-500" />
              Contact Us
            </h3>

            <div className="mt-5 space-y-3">

              {/* PHONE */}

              <a
                href="tel:01715942482"
                className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 transition-all duration-200 hover:border-orange-400/25 hover:bg-orange-500/[0.05]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
                  <Phone className="h-4 w-4 text-orange-400" />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
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
                className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3 transition-all duration-200 hover:border-blue-400/25 hover:bg-blue-500/[0.05]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-300" />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                    Email
                  </p>

                  <p className="mt-0.5 truncate text-sm font-bold text-white/70 transition-colors group-hover:text-blue-300">
                    businessparkint@gmail.com
                  </p>
                </div>
              </a>

              {/* PLATFORM */}

              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                  <MapPin className="h-4 w-4 text-blue-300" />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                    Platform
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-white/70">
                    Bangladesh • Global Vision
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}

            <div className="mt-6 border-t border-white/[0.08] pt-6">
              <h3 className="font-black text-white">
                শুরু করুন
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/45">
                আপনার প্রয়োজনের দক্ষ কর্মী খুঁজুন অথবা নিজের
                দক্ষতা দিয়ে কাজের সুযোগ তৈরি করুন।
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                <Link
                  href="/workers"
                  className="group inline-flex items-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-orange-400 hover:to-orange-600"
                >
                  কর্মী খুঁজুন

                  <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  href="/jobs"
                  className="group inline-flex items-center rounded-xl border border-blue-400/25 bg-blue-500/10 px-4 py-2.5 text-sm font-black text-blue-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/45 hover:bg-blue-500/20 hover:text-white"
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

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">
          <div className="grid gap-0 sm:grid-cols-3">

            {/* TRUST */}

            <div className="flex items-center gap-3 px-5 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
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

            {/* NETWORK */}

            <div className="flex items-center gap-3 border-y border-white/[0.07] px-5 py-5 sm:border-x sm:border-y-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
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

            {/* GLOBAL */}

            <div className="flex items-center gap-3 px-5 py-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
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
        </div>

        {/* =====================================================
            BOTTOM BAR
        ====================================================== */}

        <div className="flex flex-col gap-4 border-t border-white/[0.07] pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">

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
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/15">
            Shromobazar • Global Workforce Platform
          </p>
        </div>
      </div>
    </footer>
  );
}