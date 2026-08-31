"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Search,
  Briefcase,
  Languages,
  UserPlus,
  LogIn,
  LogOut,
  Home,
  LayoutDashboard,
  Wallet,
} from "lucide-react";

const CURRENT_USER_KEY = "shromobazar_current_user";

type CurrentUser = {
  id?: string;
  name?: string;
  phone?: string;
  userType?: "worker" | "employer" | "customer";
};

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedLanguage = localStorage.getItem(
      "shromobazar-language"
    );

    if (savedLanguage === "bn" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    const savedUser = localStorage.getItem(
      CURRENT_USER_KEY
    );

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
        setUser(null);
      }
    }
  }, []);

  const changeLanguage = (value: "bn" | "en") => {
    setLanguage(value);
    localStorage.setItem("shromobazar-language", value);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setOpen(false);
    window.location.href = "/";
  };

  const isBn = language === "bn";

  /* ============================================================
     COMMON DESKTOP NAV STYLE
  ============================================================ */

  const navClass =
    "inline-flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 hover:shadow-md";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-[72px] sm:px-6 lg:px-8">

        {/* =====================================================
            LOGO
        ====================================================== */}

        <Link
          href="/"
          onClick={closeMenu}
          className="group flex min-w-0 items-center gap-2"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
            <div className="absolute inset-1 rounded-xl bg-blue-600/20 blur-[3px]" />

            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-[3px_3px_0px_#f97316] transition-all duration-200 group-hover:-translate-y-0.5">
              <span className="text-xl font-black italic leading-none text-white">
                S
              </span>
            </div>
          </div>

          <div className="min-w-0 leading-none">
            <div className="truncate text-[18px] font-black tracking-[-0.045em] text-orange-500 sm:text-[23px]">
              Shromobazar
            </div>

            <div className="mt-1 hidden text-[8px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:block sm:text-[9px]">
              Skilled Workforce Platform
            </div>
          </div>
        </Link>

        {/* =====================================================
            DESKTOP NAV
        ====================================================== */}

        <nav className="hidden items-center gap-1 lg:flex">

          {/* HOME */}
          <Link
            href="/"
            className={navClass}
          >
            <Home size={14} />
            {isBn ? "হোম" : "Home"}
          </Link>

          {/* WORKERS */}
          <Link
            href="/workers"
            className={navClass}
          >
            <Search size={14} />
            {isBn ? "কর্মী খুঁজুন" : "Find Workers"}
          </Link>

          {/* JOBS */}
          <Link
            href="/jobs"
            className={navClass}
          >
            <Briefcase size={14} />
            {isBn ? "কাজ খুঁজুন" : "Find Jobs"}
          </Link>
        </nav>

        {/* =====================================================
            DESKTOP ACTIONS
        ====================================================== */}

        <div className="hidden items-center gap-1.5 lg:flex">

          {/* LOGIN */}
          {mounted && !user && (
            <Link
              href="/login"
              className={navClass}
            >
              <LogIn size={14} />
              {isBn ? "প্রবেশ" : "Login"}
            </Link>
          )}

          {/* REGISTER */}
          {mounted && !user && (
            <Link
              href="/register"
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-3 text-xs font-black text-white shadow-md shadow-orange-500/20 transition-all hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
            >
              <UserPlus size={14} />
              {isBn ? "নিবন্ধন" : "Register"}
            </Link>
          )}

          {/* =================================================
              WALLET
              ALWAYS VISIBLE
          ================================================== */}

          <Link
            href="/wallet"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 text-xs font-black text-orange-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-100 hover:shadow-md"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm">
              <Wallet size={13} />
            </span>

            {isBn ? "ওয়ালেট" : "Wallet"}
          </Link>

          {/* =================================================
              DASHBOARD
          ================================================== */}

          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#07152d] px-3 text-xs font-black text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#0b1d3d] hover:shadow-md"
          >
            <LayoutDashboard size={14} />
            {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
          </Link>

          {/* =================================================
              LOGOUT
          ================================================== */}

          {mounted && user && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-black text-red-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:shadow-md"
            >
              <LogOut size={14} />
              {isBn ? "প্রস্থান" : "Logout"}
            </button>
          )}

          {/* =================================================
              LANGUAGE
          ================================================== */}

          <div className="flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 shadow-sm">

            <Languages
              size={13}
              className="ml-1.5 mr-0.5 text-slate-400"
            />

            <button
              type="button"
              onClick={() => changeLanguage("bn")}
              className={`h-8 rounded-lg px-2 text-[10px] font-black transition ${
                isBn
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              বাংলা
            </button>

            <button
              type="button"
              onClick={() => changeLanguage("en")}
              className={`h-8 rounded-lg px-2 text-[10px] font-black transition ${
                !isBn
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              EN
            </button>

          </div>
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 active:scale-95 lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* =======================================================
          MOBILE MENU
      ======================================================== */}

      {open && (
        <div className="border-t border-slate-100 bg-white shadow-xl lg:hidden">

          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6">

            <nav className="grid gap-1.5">

              {/* HOME */}

              <Link
                href="/"
                onClick={closeMenu}
                className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                <Home size={16} />
                {isBn ? "হোম" : "Home"}
              </Link>

              {/* WORKERS */}

              <Link
                href="/workers"
                onClick={closeMenu}
                className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                <Search size={16} />
                {isBn ? "কর্মী খুঁজুন" : "Find Workers"}
              </Link>

              {/* JOBS */}

              <Link
                href="/jobs"
                onClick={closeMenu}
                className="flex h-11 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                <Briefcase size={16} />
                {isBn ? "কাজ খুঁজুন" : "Find Jobs"}
              </Link>

              {/* =================================================
                  MOBILE WALLET — ALWAYS VISIBLE
              ================================================== */}

              <Link
                href="/wallet"
                onClick={closeMenu}
                className="mt-1 flex h-12 w-full items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 px-4 text-xs font-black text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-100"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm">
                  <Wallet size={15} />
                </span>

                {isBn ? "ওয়ালেট" : "Wallet"}
              </Link>

              {/* =================================================
                  MOBILE DASHBOARD
              ================================================== */}

              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="mt-1 flex h-12 w-full items-center gap-3 rounded-xl bg-[#07152d] px-4 text-xs font-black text-white shadow-md transition hover:bg-[#0b1d3d]"
              >
                <LayoutDashboard size={16} />
                {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
              </Link>

              {/* =================================================
                  LOGIN / REGISTER
              ================================================== */}

              {mounted && !user && (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">

                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <LogIn size={15} />
                    {isBn ? "প্রবেশ" : "Login"}
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-black text-white shadow-md transition hover:bg-orange-600"
                  >
                    <UserPlus size={15} />
                    {isBn ? "নিবন্ধন" : "Register"}
                  </Link>

                </div>
              )}

              {/* =================================================
                  CURRENT USER + LOGOUT
              ================================================== */}

              {mounted && user && (
                <div className="mt-2 border-t border-slate-100 pt-3">

                  <div className="mb-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {isBn
                        ? "বর্তমান ব্যবহারকারী"
                        : "Current User"}
                    </p>

                    <p className="mt-1 truncate text-xs font-black text-slate-800">
                      {user.name ||
                        user.phone ||
                        "Shromobazar User"}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-11 w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 text-xs font-black text-red-600 transition hover:bg-red-100"
                  >
                    <LogOut size={16} />
                    {isBn
                      ? "প্রস্থান করুন"
                      : "Logout"}
                  </button>

                </div>
              )}
            </nav>

            {/* =================================================
                MOBILE LANGUAGE
            ================================================== */}

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 px-1 pt-3">

              <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Languages size={15} />
                {isBn ? "ভাষা" : "Language"}
              </span>

              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">

                <button
                  type="button"
                  onClick={() => changeLanguage("bn")}
                  className={`h-8 rounded-lg px-3 text-[10px] font-black ${
                    isBn
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  বাংলা
                </button>

                <button
                  type="button"
                  onClick={() => changeLanguage("en")}
                  className={`h-8 rounded-lg px-3 text-[10px] font-black ${
                    !isBn
                      ? "bg-orange-500 text-white shadow-sm"
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