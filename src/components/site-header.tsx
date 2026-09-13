"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  Globe2,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Store,
  UserPlus,
  WalletCards,
  UsersRound,
  UserRound,
  X,
} from "lucide-react";

const CURRENT_USER_KEY = "shromobazar_current_user";
const LANGUAGE_KEY = "shromobazar-language";

type Language = "bn" | "en";

type CurrentUser = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
};

export default function SiteHeader() {
  const pathname = usePathname();

  const [language, setLanguage] = useState<Language>("bn");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

      if (savedLanguage === "bn" || savedLanguage === "en") {
        setLanguage(savedLanguage);
      }
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  function toggleLanguage() {
    const nextLanguage: Language = language === "bn" ? "en" : "bn";

    setLanguage(nextLanguage);

    try {
      localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    } catch {
      // Ignore localStorage errors.
    }
  }

  function handleLogout() {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
    } catch {
      // Ignore localStorage errors.
    }

    setCurrentUser(null);
    setAccountOpen(false);
    setMobileOpen(false);

    window.location.href = "/";
  }

  const navItems: NavItem[] = [
    {
      href: "/",
      label: language === "bn" ? "হোম" : "Home",
      icon: Home,
    },
    {
      href: "/marketplace",
      label: language === "bn" ? "মার্কেট" : "Market",
      icon: Store,
    },
    {
      href: "/status-feed",
      label: language === "bn" ? "সোশ্যাল হাব" : "Social Hub",
      icon: UsersRound,
    },
    {
      href: "/chat",
      label: language === "bn" ? "কানেক্ট" : "Connect",
      icon: Search,
    },
    {
      href: "/wallet",
      label: language === "bn" ? "ওয়ালেট" : "Wallet",
      icon: WalletCards,
    },
  ];

  const accountItems: NavItem[] = [
    {
      href: "/my-account",
      label: language === "bn" ? "আমার অ্যাকাউন্ট" : "My Account",
      icon: CircleUserRound,
    },
    {
      href: "/profile",
      label: language === "bn" ? "আমার প্রোফাইল" : "My Profile",
      icon: UserRound,
    },
    {
      href: "/dashboard",
      label: language === "bn" ? "ড্যাশবোর্ড" : "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/wallet",
      label: language === "bn" ? "ওয়ালেট" : "Wallet",
      icon: WalletCards,
    },
    {
      href: "/notifications",
      label: language === "bn" ? "নোটিফিকেশন" : "Notifications",
      icon: Bell,
    },
    {
      href: "/settings",
      label: language === "bn" ? "সেটিংস" : "Settings",
      icon: Settings,
    },
    {
      href: "/settings",
      label:
        language === "bn"
          ? "সিকিউরিটি ও ভেরিফিকেশন"
          : "Security & Verification",
      icon: ShieldCheck,
    },
  ];

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/10 bg-[#071b3a]/95 text-white shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex h-[56px] w-full max-w-[1600px] items-center gap-1.5 px-2.5 sm:px-3 lg:px-5">

        {/* LOGO */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-1.5"
          aria-label="Shromobazar Home"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 text-[15px] font-black italic text-white">
              S
            </div>
          </div>

          <span className="hidden whitespace-nowrap text-[15px] font-extrabold tracking-tight sm:inline">
            <span className="text-orange-400">Shromobazar</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="ml-1.5 hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-all",
                  active
                    ? "bg-white/15 text-orange-300 shadow-sm"
                    : "text-white/85 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <Icon
                  size={15}
                  strokeWidth={2}
                  className={active ? "text-orange-300" : ""}
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex shrink-0 items-center gap-1">

          {/* NOTIFICATION */}
          <Link
            href="/notifications"
            aria-label={
              language === "bn" ? "নোটিফিকেশন" : "Notifications"
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/85 transition hover:bg-white/10 hover:text-white"
          >
            <Bell size={16} />
          </Link>

          {/* LANGUAGE */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="hidden h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-bold text-white/85 transition hover:bg-white/10 hover:text-white md:flex"
            aria-label="Change language"
          >
            <Globe2 size={14} />
            <span>{language === "bn" ? "EN" : "বাংলা"}</span>
          </button>

          {/* DESKTOP ACCOUNT / LOGIN */}
          {currentUser ? (
            <div ref={accountRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-white/10 px-2 transition hover:bg-white/15"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-400 text-[#071b3a]">
                  <UserRound size={14} strokeWidth={2.5} />
                </div>

                <div className="max-w-[95px] text-left">
                  <div className="truncate text-[11px] font-bold">
                    {currentUser.name ||
                      (language === "bn"
                        ? "আমার অ্যাকাউন্ট"
                        : "My Account")}
                  </div>
                </div>

                <ChevronDown
                  size={13}
                  className={accountOpen ? "rotate-180" : ""}
                />
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-[40px] w-[240px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-slate-800 shadow-2xl">

                  <div className="mb-1 border-b border-slate-100 px-2.5 py-2">
                    <div className="truncate text-xs font-bold">
                      {currentUser.name || "User"}
                    </div>

                    {currentUser.email && (
                      <div className="truncate text-[11px] text-slate-500">
                        {currentUser.email}
                      </div>
                    )}
                  </div>

                  {accountItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition hover:bg-slate-100"
                      >
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2.5 rounded-lg border-t border-slate-100 px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    <span>
                      {language === "bn" ? "লগআউট" : "Logout"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-1 lg:flex">
              <Link
                href="/register"
                className="flex h-8 items-center gap-1 rounded-lg bg-orange-500 px-2.5 text-[11px] font-extrabold text-white transition hover:bg-orange-600"
              >
                <UserPlus size={14} />

                <span>
                  {language === "bn" ? "রেজিস্টার" : "Register"}
                </span>
              </Link>

              <Link
                href="/login"
                className="flex h-8 items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 text-[11px] font-extrabold text-white transition hover:bg-white/15"
              >
                <LogIn size={14} />

                <span>
                  {language === "bn" ? "লগইন" : "Login"}
                </span>
              </Link>
            </div>
          )}

          {/* MOBILE REGISTER / LOGIN */}
          {!currentUser && (
            <div className="flex items-center gap-0.5 lg:hidden">
              <Link
                href="/register"
                className="flex h-7 items-center rounded-md bg-orange-500 px-1.5 text-[9px] font-extrabold text-white sm:px-2 sm:text-[10px]"
              >
                {language === "bn" ? "রেজিস্টার" : "Register"}
              </Link>

              <Link
                href="/login"
                className="flex h-7 items-center rounded-md border border-white/20 bg-white/10 px-1.5 text-[9px] font-extrabold text-white sm:px-2 sm:text-[10px]"
              >
                {language === "bn" ? "লগইন" : "Login"}
              </Link>
            </div>
          )}

          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition hover:bg-white/10 lg:hidden"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#071b3a] lg:hidden">
          <div className="mx-auto max-w-[1600px] px-3 py-2.5 sm:px-4">

            {/* MAIN MOBILE NAV */}
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "flex items-center gap-2 rounded-lg border px-2.5 py-2.5 text-xs font-semibold transition",
                      active
                        ? "border-orange-400/30 bg-orange-500/15 text-orange-300"
                        : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* MOBILE ACCOUNT */}
            {currentUser ? (
              <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-1.5">

                <div className="mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400 text-[#071b3a]">
                    <UserRound size={16} strokeWidth={2.5} />
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-xs font-bold text-white">
                      {currentUser.name || "User"}
                    </div>

                    {currentUser.email && (
                      <div className="truncate text-[10px] text-white/50">
                        {currentUser.email}
                      </div>
                    )}
                  </div>
                </div>

                {accountItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-2.5 rounded-lg border-t border-white/10 px-2.5 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  <LogOut size={16} />

                  <span>
                    {language === "bn" ? "লগআউট" : "Logout"}
                  </span>
                </button>
              </div>
            ) : (
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-2.5 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600"
                >
                  <UserPlus size={15} />
                  {language === "bn" ? "রেজিস্টার" : "Register"}
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-2.5 py-2.5 text-xs font-bold text-white transition hover:bg-white/15"
                >
                  <LogIn size={15} />
                  {language === "bn" ? "লগইন" : "Login"}
                </Link>
              </div>
            )}

            {/* LANGUAGE */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2.5 text-xs font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              <Globe2 size={16} />

              {language === "bn"
                ? "Switch to English"
                : "বাংলায় দেখুন"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
