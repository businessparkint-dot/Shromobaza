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
  UserPlus,
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
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            LOGO
        ====================================================== */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-2"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-blue-600/20 blur-[2px]" />

            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-[3px_3px_0px_#f97316] transition-transform duration-200 group-hover:-translate-y-0.5">
              <span className="text-xl font-black italic leading-none text-white">
                S
              </span>
            </div>
          </div>

          <div className="leading-none">
            <div className="text-[21px] font-black tracking-[-0.045em] text-orange-500 transition-colors duration-200 group-hover:text-orange-600 sm:text-[23px]">
              Shromobazar
            </div>

            <div className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:text-[9px]">
              Skilled Workforce Platform
            </div>
          </div>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <nav className="hidden items-center gap-0.5 lg:flex">

          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            {isBn ? "হোম" : "Home"}
          </Link>

          <Link
            href="/workers"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <Search size={15} />
            {isBn ? "কর্মী খুঁজুন" : "Find Workers"}
          </Link>

          <Link
            href="/jobs"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <Briefcase size={15} />
            {isBn ? "কাজ খুঁজুন" : "Find Jobs"}
          </Link>

        </nav>

        {/* =====================================================
            DESKTOP RIGHT
        ====================================================== */}
        <div className="hidden items-center gap-2 lg:flex">

          {/* REGISTRATION - SMALL */}
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 transition hover:border-orange-300 hover:bg-orange-100"
          >
            <UserPlus size={14} />
            {isBn ? "নিবন্ধন" : "Register"}
          </Link>

          {/* LANGUAGE - SMALL */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">

            <Languages
              size={13}
              className="ml-1.5 mr-0.5 text-slate-400"
            />

            <button
              type="button"
              onClick={() => changeLanguage("bn")}
              className={`rounded-md px-2 py-1.5 text-[11px] font-bold transition ${
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
              className={`rounded-md px-2 py-1.5 text-[11px] font-bold transition ${
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
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-orange-600"
          >
            <UserRound size={14} />
            {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
          </Link>

        </div>

        {/* =====================================================
            MOBILE BUTTON
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

              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                {isBn ? "হোম" : "Home"}
              </Link>

              <Link
                href="/workers"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Search size={18} />
                {isBn ? "কর্মী খুঁজুন" : "Find Workers"}
              </Link>

              <Link
                href="/jobs"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <Briefcase size={18} />
                {isBn ? "কাজ খুঁজুন" : "Find Jobs"}
              </Link>

              {/* MOBILE REGISTRATION */}
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
              >
                <UserPlus size={18} />
                {isBn ? "নিবন্ধন করুন" : "Register"}
              </Link>

              {/* MOBILE DASHBOARD */}
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                <UserRound size={18} />
                {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
              </Link>

            </nav>

            {/* MOBILE LANGUAGE */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">

              <span className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Languages size={17} />
                {isBn ? "ভাষা" : "Language"}
              </span>

              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">

                <button
                  type="button"
                  onClick={() => changeLanguage("bn")}
                  className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition ${
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
                  className={`rounded-md px-2.5 py-1.5 text-[11px] font-bold transition ${
                    !isBn
                      ? "bg-orange-500 text-white"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  EN
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </header>
  );
}