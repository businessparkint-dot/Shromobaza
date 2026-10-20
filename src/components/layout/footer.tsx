
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Store,
  Users,
} from "lucide-react";

export function Footer() {
  const quickLinks = [
    { href: "/workers", label: "কর্মী খুঁজুন", icon: Users },
    { href: "/jobs", label: "কাজ খুঁজুন", icon: BriefcaseBusiness },
    { href: "/marketplace", label: "Marketplace", icon: Store },
    { href: "/subscriptions", label: "Plans & Subscription", icon: ArrowUpRight },
    { href: "/", label: "হোম", icon: Globe2 },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#030b1c] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.10),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(249,115,22,0.07),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* BRAND */}
          <div className="min-w-0">
            <Link
              href="/"
              aria-label="Shromobazar Home"
              className="inline-flex items-center"
            >
              <img
                src="/shromobazar-header-logo.png"
                alt="Shromobazar"
                className="h-10 w-auto max-w-[180px] object-contain sm:h-12 sm:max-w-[210px]"
              />
            </Link>

            <p className="mt-2 text-[9px] font-black uppercase tracking-[0.16em] text-blue-300 sm:text-[10px]">
              Global Workforce Platform
            </p>

            <p className="mt-1.5 max-w-sm text-[11px] leading-5 text-slate-400 sm:text-xs">
              কাজ, কর্মী, ব্যবসা ও সেবাকে একই প্ল্যাটফর্মে যুক্ত করার উদ্যোগ।
            </p>

            <div className="mt-3 flex flex-col items-start gap-1.5">
  <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-500 sm:text-[9px]">
    An initiative of
  </span>

  <span className="max-w-full break-words text-sm font-black leading-tight tracking-wide text-orange-300 sm:text-base lg:text-lg">
    Business Park International
  </span>

  <a
    href="mailto:businessparkint@gmail.com"
    className="mt-1 inline-flex max-w-full items-center gap-1.5 text-[9px] text-slate-400 transition hover:text-orange-200 sm:text-[10px]"
  >
    <Mail className="h-3 w-3 shrink-0" />
    <span className="break-all">businessparkint@gmail.com</span>
  </a>
</div>
</div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-xs font-black text-white sm:text-sm">
              <span className="mr-2 inline-block h-3.5 w-1 rounded-full bg-orange-500 align-middle" />
              Quick Links
            </h3>

            <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-1">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group inline-flex min-w-0 items-center gap-2 rounded-md py-1 text-[10px] text-slate-400 transition hover:text-orange-300 sm:text-xs"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500 transition group-hover:text-orange-300" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-xs font-black text-white sm:text-sm">
              <span className="mr-2 inline-block h-3.5 w-1 rounded-full bg-blue-500 align-middle" />
              Contact
            </h3>

            <div className="mt-2.5 space-y-2">
              <a
                href="tel:+8801715942482"
                className="flex items-center gap-2 text-[10px] text-slate-400 transition hover:text-orange-300 sm:text-xs"
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-orange-300" />
                <span>+8801715942482</span>
              </a>

              <a
                href="mailto:info.shromobazar@gmail.com"
                className="flex min-w-0 items-center gap-2 text-[10px] text-slate-400 transition hover:text-orange-300 sm:text-xs"
              >
                <Mail className="h-3.5 w-3.5 shrink-0 text-orange-300" />
                <span className="truncate">info.shromobazar@gmail.com</span>
              </a>
{/* SHROMOBAZAR QR CODE */}
<div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-3">
  <a
    href="https://www.shromobazar.com"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Open Shromobazar website"
    className="shrink-0 rounded-lg bg-white p-1.5 transition hover:scale-105"
  >
    <img
      src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https%3A%2F%2Fwww.shromobazar.com"
      alt="Scan to visit Shromobazar"
      width={68}
      height={68}
      className="h-[68px] w-[68px]"
    />
  </a>

  <div className="min-w-0">
    <p className="text-[10px] font-black text-white sm:text-xs">
      Scan & Visit
    </p>
    <p className="mt-1 text-[9px] leading-4 text-slate-400 sm:text-[10px]">
      Scan the QR code to visit Shromobazar.
    </p>
    <a
      href="https://www.shromobazar.com"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold text-orange-300 hover:text-orange-200"
    >
      shromobazar.com
      <ArrowUpRight className="h-3 w-3" />
    </a>
  </div>
</div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 sm:text-xs">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-300" />
                <span>Bangladesh · Global Vision</span>
              </div>
            </div>
          </div>
        </div>

        {/* SLIM BOTTOM BAR */}
        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-3 text-[9px] text-slate-500 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:text-[10px]">
          <p>
            © {new Date().getFullYear()} Shromobazar. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href="/"
              className="transition hover:text-orange-300"
            >
              Home
            </Link>

            <Link
              href="/workers"
              className="transition hover:text-orange-300"
            >
              Workers
            </Link>

            <Link
              href="/jobs"
              className="transition hover:text-orange-300"
            >
              Jobs
            </Link>

            <Link
              href="/marketplace"
              className="transition hover:text-orange-300"
            >
              Marketplace
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
