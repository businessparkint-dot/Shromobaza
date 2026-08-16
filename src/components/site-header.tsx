
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Search,
  Briefcase,
  UserRound,
  Languages,
} from "lucide-react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  useEffect(() => {
    const saved = localStorage.getItem("shromobazar-language");

    if (saved === "bn" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (value: "bn" | "en") => {
    setLanguage(value);
    localStorage.setItem("shromobazar-language", value);
  };

  const isBn = language === "bn";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            LOGO
        ====================================================== */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-2.5"
        >
          {/* S MARK */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">

            {/* Blue soft shadow */}
            <div className="absolute inset-1 rounded-xl bg-blue-600/20 blur-[2px]" />

            {/* Main S box */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-[3px_3px_0px_#f97316] transition-transform duration-200 group-hover:-translate-y-0.5">
              <span className="text-2xl font-black italic leading-none text-white">
                S
              </span>
            </div>

          </div>

          {/* BRAND TEXT */}
          <div className="leading-none">

            <div className="text-[24px] font-black tracking-[-0.045em] text-orange-500 transition-colors duration-200 group-hover:text-orange-600 sm:text-[27px]">
              Shromobazar
            </div>

            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px]">
              Skilled Workforce Platform
            </div>

          </div>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <nav className="hidden items-center gap-1 lg:flex">

          {/* HOME */}
          <Link
            href="/"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            {isBn ? "হোম" : "Home"}
          </Link>

          {/* FIND WORKERS */}
          <Link
            href="/workers"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <Search size={16} />
            {isBn ? "কর্মী খুঁজুন" : "Find Workers"}
          </Link>

          {/* FIND JOBS */}
          <Link
            href="/jobs"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <Briefcase size={16} />
            {isBn ? "কাজ খুঁজুন" : "Find Jobs"}
          </Link>

          {/* WORKER DASHBOARD */}
          <Link
            href="/worker-dashboard"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            {isBn ? "কর্মী ড্যাশবোর্ড" : "Worker Dashboard"}
          </Link>

          {/* EMPLOYER DASHBOARD */}
          <Link
            href="/employer-dashboard"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            {isBn
              ? "নিয়োগকর্তা ড্যাশবোর্ড"
              : "Employer Dashboard"}
          </Link>

        </nav>

        {/* =====================================================
            DESKTOP RIGHT
        ====================================================== */}
        <div className="hidden items-center gap-3 lg:flex">

          {/* LANGUAGE SWITCHER */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">

            <Languages
              size={16}
              className="ml-2 text-slate-500"
            />

            <button
              type="button"
              onClick={() => changeLanguage("bn")}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                isBn
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              বাংলা
            </button>

            <button
              type="button"
              onClick={() => changeLanguage("en")}
              className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                !isBn
                  ? "bg-orange-500 text-white"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              EN
            </button>

          </div>

          {/* DASHBOARD */}
          <Link
            href="/worker-dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
          >
            <UserRound size={16} />
            Dashboard
          </Link>

        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 lg:hidden"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>

      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            <nav className="space-y-1">

              {/* HOME */}
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                {isBn ? "হোম" : "Home"}
              </Link>

              {/* FIND WORKERS */}
              <Link
                href="/workers"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Search size={18} />
                {isBn ? "কর্মী খুঁজুন" : "Find Workers"}
              </Link>

              {/* FIND JOBS */}
              <Link
                href="/jobs"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Briefcase size={18} />
                {isBn ? "কাজ খুঁজুন" : "Find Jobs"}
              </Link>

              {/* WORKER DASHBOARD */}
              <Link
                href="/worker-dashboard"
                onClick={() => setOpen(false)}
                className="flex rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                {isBn
                  ? "কর্মী ড্যাশবোর্ড"
                  : "Worker Dashboard"}
              </Link>

              {/* EMPLOYER DASHBOARD */}
              <Link
                href="/employer-dashboard"
                onClick={() => setOpen(false)}
                className="flex rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                {isBn
                  ? "নিয়োগকর্তা ড্যাশবোর্ড"
                  : "Employer Dashboard"}
              </Link>

            </nav>

            {/* =================================================
                MOBILE LANGUAGE
            ================================================== */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

              <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Languages size={17} />
                {isBn ? "ভাষা" : "Language"}
              </span>

              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">

                <button
                  type="button"
                  onClick={() => changeLanguage("bn")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    isBn
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  বাংলা
                </button>

                <button
                  type="button"
                  onClick={() => changeLanguage("en")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    !isBn
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  EN
                </button>

              </div>

            </div>

            {/* =================================================
                MOBILE DASHBOARD
            ================================================== */}
            <div className="mt-4 border-t border-slate-100 pt-4">

              <Link
                href="/worker-dashboard"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                <UserRound size={17} />
                Dashboard
              </Link>

            </div>

          </div>
        </div>
      )}
    </header>
  );
}
