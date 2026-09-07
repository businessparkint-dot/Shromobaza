"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
  Globe2,
  Home,
  LogIn,
  LogOut,
  Menu,
  Store,
  Wallet,
  X,
  UserPlus,
} from "lucide-react";

const CURRENT_USER_KEY = "shromobazar_current_user";
const LANGUAGE_KEY = "shromobazar-language";

type CurrentUser = {
  id?: string;
  name?: string;
  phone?: string;
  userType?: string;
};

export default function SiteHeader() {
  const pathname = usePathname();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

      if (savedLanguage === "en") {
        setLanguage("en");
      } else {
        setLanguage("bn");
      }
    } catch {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setMobileOpen(false);
    window.location.href = "/";
  };

  const changeLanguage = () => {
    const nextLanguage = language === "bn" ? "en" : "bn";

    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);

    window.location.reload();
  };

  const navItems = [
    {
      href: "/",
      label: language === "bn" ? "হোম" : "Home",
      icon: Home,
      active: pathname === "/",
      className: "bg-blue-600 hover:bg-blue-500",
    },
    {
      href: "/jobs",
      label: language === "bn" ? "কাজ" : "Work",
      icon: BriefcaseBusiness,
      active: pathname.startsWith("/jobs"),
      className: "bg-indigo-600 hover:bg-indigo-500",
    },
    {
      href: "/marketplace",
      label: language === "bn" ? "মার্কেট" : "Market",
      icon: Store,
      active: pathname.startsWith("/marketplace"),
      className: "bg-violet-600 hover:bg-violet-500",
    },
    {
      href: "/wallet",
      label: language === "bn" ? "ওয়ালেট" : "Wallet",
      icon: Wallet,
      active: pathname.startsWith("/wallet"),
      className: "bg-emerald-600 hover:bg-emerald-500",
    },
    {
      href: "/notifications",
      label: language === "bn" ? "নোটিফিকেশন" : "Notifications",
      icon: Bell,
      active: pathname.startsWith("/notifications"),
      className: "bg-rose-600 hover:bg-rose-500",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-[#071A33] shadow-[0_4px_18px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-2 px-3 sm:px-4 lg:px-5">

        {/* ================= LOGO ================= */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 rounded-xl px-1.5 py-1"
        >
          {/* DOUBLE BORDER S LOGO */}
          <div
            className="
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border-2
              border-orange-400
              bg-white
              shadow-[0_3px_10px_rgba(249,115,22,0.35)]
              transition-all
              duration-200
              group-hover:-translate-y-1
              group-hover:rotate-2
              group-hover:shadow-[0_7px_16px_rgba(249,115,22,0.45)]
            "
          >
            <div className="flex h-[27px] w-[27px] items-center justify-center rounded-md border border-orange-500">
              <span className="text-[21px] font-black italic leading-none text-orange-500">
                S
              </span>
            </div>
          </div>

          {/* BRAND NAME */}
          <div className="hidden leading-none sm:block">
            <div className="text-[16px] font-black tracking-tight">
              <span className="text-orange-400">SHROMO</span>
              <span className="text-white">BAZAR</span>
            </div>

            <div className="mt-1 text-[7px] font-semibold tracking-[0.19em] text-slate-300">
              GLOBAL WORKFORCE PLATFORM
            </div>
          </div>
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex h-8 shrink-0 items-center gap-1.5
                  rounded-lg px-2.5
                  text-xs font-semibold text-white
                  shadow-md
                  transition-all duration-200
                  ${item.className}
                  ${
                    item.active
                      ? "scale-[1.02] ring-2 ring-white/60 ring-offset-1 ring-offset-[#071A33]"
                      : "hover:-translate-y-[1px]"
                  }
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ================= RIGHT ACTIONS ================= */}
        <div className="ml-auto hidden shrink-0 items-center gap-1.5 lg:flex">
          {!user ? (
            <>
              {/* REGISTER */}
              <Link
                href="/register"
                className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-emerald-500 px-2.5 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-[1px] hover:bg-emerald-400"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>
                  {language === "bn" ? "নিবন্ধন" : "Register"}
                </span>
              </Link>

              {/* LOGIN */}
              <Link
                href="/login"
                className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-orange-500 px-2.5 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-[1px] hover:bg-orange-400"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>
                  {language === "bn" ? "লগইন" : "Login"}
                </span>
              </Link>
            </>
          ) : (
            <>
              {/* USER */}
              <div className="hidden max-w-[130px] truncate rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white xl:block">
                {user.name || user.phone || "User"}
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-red-500 px-2.5 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-[1px] hover:bg-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>
                  {language === "bn" ? "লগআউট" : "Logout"}
                </span>
              </button>
            </>
          )}

          {/* LANGUAGE */}
          <button
            onClick={changeLanguage}
            className="flex h-8 shrink-0 items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2 text-xs font-bold text-white transition hover:bg-white/20"
            title="Change Language"
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>{language === "bn" ? "EN" : "বাং"}</span>
          </button>
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
          aria-label="Menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0A2342] px-3 py-3 shadow-xl lg:hidden">
          <nav className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-bold text-white shadow-md ${item.className} ${
                    item.active
                      ? "ring-2 ring-white/60 ring-offset-1 ring-offset-[#0A2342]"
                      : ""
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {!user ? (
              <>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-bold text-white shadow-md"
                >
                  <UserPlus className="h-4 w-4" />
                  {language === "bn" ? "নিবন্ধন" : "Register"}
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 text-sm font-bold text-white shadow-md"
                >
                  <LogIn className="h-4 w-4" />
                  {language === "bn" ? "লগইন" : "Login"}
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-red-500 text-sm font-bold text-white shadow-md"
              >
                <LogOut className="h-4 w-4" />
                {language === "bn" ? "লগআউট" : "Logout"}
              </button>
            )}

            <button
              onClick={changeLanguage}
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 text-sm font-bold text-white"
            >
              <Globe2 className="h-4 w-4" />
              {language === "bn" ? "English" : "বাংলা"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}