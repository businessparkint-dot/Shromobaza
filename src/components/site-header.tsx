"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BriefcaseBusiness,
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
  X,
} from "lucide-react";

const CURRENT_USER_KEY = "shromobazar_current_user";
const LANGUAGE_KEY = "shromobazar-language";

type CurrentUser = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  userType?: string;
};

export default function SiteHeader() {
  const pathname = usePathname();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  const accountRef = useRef<HTMLDivElement>(null);

  /* ============================================================
     LOAD USER
  ============================================================ */

  useEffect(() => {
    setMounted(true);

    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

      if (savedLanguage === "en") {
        setLanguage("en");
      }
    } catch {
      setUser(null);
    }
  }, []);

  /* ============================================================
     CLOSE ACCOUNT DROPDOWN
  ============================================================ */

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

  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setAccountOpen(false);
    setMobileOpen(false);

    window.location.href = "/";
  };

  /* ============================================================
     LANGUAGE
  ============================================================ */

  const changeLanguage = () => {
    const nextLanguage = language === "bn" ? "en" : "bn";

    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);

    window.location.reload();
  };

  /* ============================================================
     MAIN NAVIGATION
  ============================================================ */

  const navItems = [
    {
      href: "/",
      label: language === "bn" ? "হোম" : "Home",
      icon: Home,
    },
    {
      href: "/jobs",
      label: language === "bn" ? "কাজ" : "Work",
      icon: BriefcaseBusiness,
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

  /* ============================================================
     ACCOUNT MENU
  ============================================================ */

  const accountItems = [
    {
      href: "/profile",
      label: "My Profile",
      icon: CircleUserRound,
      iconClass: "text-cyan-400",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      iconClass: "text-blue-400",
    },
    {
      href: "/wallet",
      label: "Wallet",
      icon: WalletCards,
      iconClass: "text-emerald-400",
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: Bell,
      iconClass: "text-amber-400",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      iconClass: "text-slate-300",
    },
    {
      href: "/settings",
      label: "Security & Verification",
      icon: ShieldCheck,
      iconClass: "text-emerald-400",
    },
    {
      href: "/",
      label: "Help & Support",
      icon: Search,
      iconClass: "text-orange-400",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#071A33]/95 shadow-[0_3px_14px_rgba(0,0,0,0.22)] backdrop-blur-md">

      <div className="mx-auto flex h-12 w-full max-w-[1600px] items-center gap-1.5 px-2.5 sm:px-4">

        {/* ======================================================
            LOGO
        ====================================================== */}

        <Link
          href="/"
          className="group flex shrink-0 items-center gap-1.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-400/70 bg-white shadow-[2px_2px_0px_#f97316] transition group-hover:-translate-y-0.5">
            <span className="text-lg font-black italic text-orange-500">
              S
            </span>
          </div>

          <div className="hidden leading-none sm:block">
            <div className="text-[17px] font-black tracking-[-0.025em]">
              <span className="text-orange-400">SHROMO</span>
              <span className="text-white">BAZAR</span>
            </div>

            <div className="mt-0.5 text-[6px] font-bold tracking-[0.16em] text-slate-400">
              GLOBAL WORKFORCE PLATFORM
            </div>
          </div>
        </Link>

        {/* ======================================================
            DESKTOP NAV
        ====================================================== */}

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  inline-flex h-7 items-center gap-1 rounded-md
                  border px-2
                  text-[11px] font-bold
                  transition-all
                  ${
                    active
                      ? "border-white/20 bg-white/15 text-white"
                      : "border-transparent text-slate-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ======================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="ml-auto flex items-center gap-1">

          {/* ====================================================
              NOTIFICATION
          ==================================================== */}

          <Link
            href="/notifications"
            aria-label="Notifications"
            title="Notifications"
            className={`
              relative flex h-7 w-7 items-center justify-center
              rounded-md border
              transition-all
              ${
                pathname.startsWith("/notifications")
                  ? "border-amber-300/40 bg-amber-400/20 text-amber-300"
                  : "border-amber-400/20 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
              }
            `}
          >
            <Bell className="h-3.5 w-3.5" />

            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_5px_rgba(252,211,77,0.8)]" />
          </Link>

          {/* ====================================================
              LANGUAGE
          ==================================================== */}

          <button
            type="button"
            onClick={changeLanguage}
            title="Change language"
            className="
              hidden h-7 items-center gap-1
              rounded-md
              border border-white/10
              bg-white/5
              px-1.5
              text-[10px] font-bold text-slate-200
              transition
              hover:bg-white/10
              sm:flex
            "
          >
            <Globe2 className="h-3 w-3" />
            {language === "bn" ? "EN" : "বাং"}
          </button>

          {/* ====================================================
              ACCOUNT
          ==================================================== */}

          {mounted && user ? (
            <div ref={accountRef} className="relative">

              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className={`
                  flex h-7 max-w-[150px] items-center gap-1
                  rounded-md
                  border
                  px-1.5
                  transition-all
                  ${
                    accountOpen
                      ? "border-cyan-300/40 bg-cyan-400/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }
                `}
              >
                <CircleUserRound className="h-3.5 w-3.5 shrink-0 text-cyan-300" />

                <span className="hidden max-w-[75px] truncate text-[10px] font-bold text-white sm:block">
                  {user.name || "My Account"}
                </span>

                <ChevronDown
                  className={`
                    h-3 w-3 shrink-0 text-slate-400 transition-transform
                    ${accountOpen ? "rotate-180" : ""}
                  `}
                />
              </button>

              {/* ==================================================
                  ACCOUNT DROPDOWN
              ================================================== */}

              {accountOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0B2342] p-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.40)]">

                  {/* USER INFO */}

                  <div className="mb-1.5 border-b border-white/10 px-2.5 py-2">
                    <div className="truncate text-xs font-black text-white">
                      {user.name || "Shromobazar User"}
                    </div>

                    {user.phone && (
                      <div className="mt-0.5 truncate text-[9px] text-slate-500">
                        {user.phone}
                      </div>
                    )}

                    {user.email && (
                      <div className="mt-0.5 truncate text-[9px] text-slate-500">
                        {user.email}
                      </div>
                    )}
                  </div>

                  {/* MENU */}

                  {accountItems.map((item) => {
                    const Icon = item.icon;

                    const active =
                      item.href !== "/" &&
                      pathname.startsWith(item.href);

                    return (
                      <Link
                        key={`${item.label}-${item.href}`}
                        href={item.href}
                        onClick={() => setAccountOpen(false)}
                        className={`
                          flex items-center gap-2 rounded-lg
                          px-2.5 py-2
                          text-[11px] font-semibold
                          transition
                          ${
                            active
                              ? "bg-white/10 text-white"
                              : "text-slate-300 hover:bg-white/10 hover:text-white"
                          }
                        `}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 ${item.iconClass}`}
                        />

                        <span className="flex-1">
                          {item.label}
                        </span>

                        {active && (
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        )}
                      </Link>
                    );
                  })}

                  {/* LOGOUT */}

                  <div className="mt-1 border-t border-white/10 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex w-full items-center gap-2
                        rounded-lg
                        px-2.5 py-2
                        text-left
                        text-[11px] font-bold
                        text-red-300
                        transition
                        hover:bg-red-500/10
                        hover:text-red-200
                      "
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* REGISTER */}

              <Link
                href="/register"
                className="
                  hidden h-7 items-center gap-1
                  rounded-md
                  border border-emerald-400/20
                  bg-emerald-500/10
                  px-2
                  text-[10px] font-bold
                  text-emerald-300
                  transition
                  hover:bg-emerald-500/20
                  sm:inline-flex
                "
              >
                <UserPlus className="h-3 w-3" />
                Register
              </Link>

              {/* LOGIN */}

              <Link
                href="/login"
                className="
                  hidden h-7 items-center gap-1
                  rounded-md
                  bg-orange-500
                  px-2
                  text-[10px] font-bold
                  text-white
                  transition
                  hover:bg-orange-400
                  sm:inline-flex
                "
              >
                <LogIn className="h-3 w-3" />
                Login
              </Link>
            </>
          )}

          {/* ====================================================
              MOBILE MENU BUTTON
          ==================================================== */}

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Menu"
            className="
              flex h-7 w-7 items-center justify-center
              rounded-md
              border border-white/10
              bg-white/5
              text-slate-200
              transition
              hover:bg-white/10
              md:hidden
            "
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          MOBILE MENU
      ======================================================== */}

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#091F3B] px-2.5 py-2 md:hidden">

          <div className="grid grid-cols-2 gap-1.5">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex h-8 items-center justify-center gap-1.5
                    rounded-md
                    border border-white/10
                    bg-white/5
                    text-[11px] font-bold
                    text-slate-200
                    transition
                    hover:bg-white/10
                  "
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}

            {/* MOBILE NOTIFICATION */}

            <Link
              href="/notifications"
              onClick={() => setMobileOpen(false)}
              className="
                flex h-8 items-center justify-center gap-1.5
                rounded-md
                border border-amber-400/20
                bg-amber-400/10
                text-[11px] font-bold
                text-amber-300
              "
            >
              <Bell className="h-3.5 w-3.5" />
              Notifications
            </Link>

            {mounted && user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex h-8 items-center justify-center gap-1.5
                    rounded-md
                    border border-cyan-400/20
                    bg-cyan-400/10
                    text-[11px] font-bold
                    text-cyan-300
                  "
                >
                  <CircleUserRound className="h-3.5 w-3.5" />
                  My Profile
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex h-8 items-center justify-center gap-1.5
                    rounded-md
                    border border-blue-400/20
                    bg-blue-400/10
                    text-[11px] font-bold
                    text-blue-300
                  "
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex h-8 items-center justify-center gap-1.5
                    rounded-md
                    border border-white/10
                    bg-white/5
                    text-[11px] font-bold
                    text-slate-300
                  "
                >
                  <Settings className="h-3.5 w-3.5" />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex h-8 items-center justify-center gap-1.5
                    rounded-md
                    border border-red-400/20
                    bg-red-500/10
                    text-[11px] font-bold
                    text-red-300
                  "
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex h-8 items-center justify-center gap-1.5
                    rounded-md
                    border border-emerald-400/20
                    bg-emerald-500/10
                    text-[11px] font-bold
                    text-emerald-300
                  "
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Register
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex h-8 items-center justify-center gap-1.5
                    rounded-md
                    bg-orange-500
                    text-[11px] font-bold
                    text-white
                  "
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Link>
              </>
            )}

            {/* MOBILE LANGUAGE */}

            <button
              type="button"
              onClick={changeLanguage}
              className="
                flex h-8 items-center justify-center gap-1.5
                rounded-md
                border border-white/10
                bg-white/5
                text-[11px] font-bold
                text-slate-300
              "
            >
              <Globe2 className="h-3.5 w-3.5" />
              {language === "bn" ? "English" : "বাংলা"}
            </button>

          </div>
        </div>
      )}
    </header>
  );
}
