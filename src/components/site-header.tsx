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
  LogIn,
  LogOut,
  Home,
  LayoutDashboard,
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

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-[72px] sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex min-w-0 items-center gap-2"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
            <div className="absolute inset-1 rounded-xl bg-blue-600/20 blur-[2px]" />

            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-[3px_3px_0px_#f97316] transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-9 sm:w-9">
              <span className="text-lg font-black italic leading-none text-white sm:text-xl">
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

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
          >
            <Home size={15} />
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

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-2 lg:flex">
          {mounted && !user && (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              >
                <LogIn size={14} />
                {isBn ? "প্রবেশ করুন" : "Login"}
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-bold text-orange-600 transition hover:border-orange-300 hover:bg-orange-100"
              >
                <UserPlus size={14} />
                {isBn ? "নিবন্ধন" : "Register"}
              </Link>
            </>
          )}

          {mounted && user && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:border-red-300 hover:bg-red-100"
            >
              <LogOut size={14} />
              {isBn ? "প্রস্থান" : "Logout"}
            </button>
          )}

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-orange-600"
          >
            <LayoutDashboard size={14} />
            {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
          </Link>

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
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition active:scale-95 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 lg:hidden"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-100 bg-white shadow-lg lg:hidden">
          <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6">

            {/* MAIN NAV */}
            <nav className="grid gap-1">

              <Link
                href="/"
                onClick={closeMenu}
                className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold text-slate-700 transition active:bg-orange-100 hover:bg-orange-50 hover:text-orange-600"
              >
                <Home className="h-5 w-5 text-slate-400" />
                {isBn ? "হোম" : "Home"}
              </Link>

              <Link
                href="/workers"
                onClick={closeMenu}
                className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold text-slate-700 transition active:bg-orange-100 hover:bg-orange-50 hover:text-orange-600"
              >
                <Search className="h-5 w-5 text-slate-400" />
                {isBn ? "কর্মী খুঁজুন" : "Find Workers"}
              </Link>

              <Link
                href="/jobs"
                onClick={closeMenu}
                className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-bold text-slate-700 transition active:bg-orange-100 hover:bg-orange-50 hover:text-orange-600"
              >
                <Briefcase className="h-5 w-5 text-slate-400" />
                {isBn ? "কাজ খুঁজুন" : "Find Jobs"}
              </Link>

              {/* DASHBOARD */}
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="mt-1 flex min-h-12 items-center gap-3 rounded-xl bg-orange-500 px-4 text-sm font-black text-white shadow-md shadow-orange-500/20 transition active:scale-[0.99] hover:bg-orange-600"
              >
                <LayoutDashboard className="h-5 w-5" />
                {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
              </Link>

              {/* ACCOUNT ACTIONS */}
              {mounted && !user && (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 transition active:bg-slate-100 hover:border-orange-300 hover:text-orange-600"
                  >
                    <LogIn className="h-4 w-4" />
                    {isBn ? "প্রবেশ করুন" : "Login"}
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 text-xs font-black text-white transition active:scale-[0.99] hover:bg-slate-800"
                  >
                    <UserPlus className="h-4 w-4" />
                    {isBn ? "নিবন্ধন" : "Register"}
                  </Link>
                </div>
              )}

              {mounted && user && (
                <div className="mt-2 border-t border-slate-100 pt-3">
                  <div className="mb-2 rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-bold text-slate-400">
                      {isBn ? "বর্তমান ব্যবহারকারী" : "Current User"}
                    </p>

                    <p className="mt-1 truncate text-sm font-black text-slate-800">
                      {user.name || user.phone || "Shromobazar User"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-sm font-bold text-red-600 transition active:bg-red-100 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    {isBn ? "প্রস্থান করুন" : "Logout"}
                  </button>
                </div>
              )}
            </nav>

            {/* LANGUAGE */}
            <div className="mt-3 flex min-h-12 items-center justify-between border-t border-slate-100 px-1 pt-3">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <Languages className="h-4 w-4" />
                {isBn ? "ভাষা" : "Language"}
              </span>

              <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={() => changeLanguage("bn")}
                  className={`min-w-16 rounded-lg px-3 py-2 text-[11px] font-black transition ${
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
                  className={`min-w-12 rounded-lg px-3 py-2 text-[11px] font-black transition ${
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