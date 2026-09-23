"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  CheckCircle2,
  BriefcaseBusiness,
  ChevronDown,
  Compass,
  Globe2,
  GraduationCap,
  Heart,
  Home,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Plane,
  Search,
  ShoppingBag,
  Trophy,
  UsersRound,
  User,
  UserPlus,
  Wallet,
  X,
} from "lucide-react";

const CURRENT_USER_KEY = "shromobazar_current_user";
const LANGUAGE_KEY = "shromobazar-language";

type CurrentUser = {
  id?: string;
  name?: string;
  phone?: string;
  userType?: string;
  avatar_url?: string;
};

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(CURRENT_USER_KEY);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

      setLanguage(savedLanguage === "en" ? "en" : "bn");
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(target)
      ) {
        setAccountMenuOpen(false);
      }

      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(target)
      ) {
        setLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setAccountMenuOpen(false);
    setLanguageMenuOpen(false);
  }, [pathname]);

  const isBn = language === "bn";

  const changeLanguage = () => {
    const nextLanguage = language === "bn" ? "en" : "bn";

    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setMobileOpen(false);
    setAccountMenuOpen(false);
    window.location.href = "/";
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-[0_6px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1600px] items-center gap-3 px-3 py-2 sm:px-5 lg:px-7">

        {/* LOGO */}
        <Link
          href="/"
          onClick={() => {
            setMobileOpen(false);
            setAccountMenuOpen(false);
          }}
          className="group flex shrink-0 items-center"
        >
          <img
            src="/shromobazar-header-logo.png"
            alt="Shromobazar"
            className="h-[48px] w-auto object-contain transition duration-200 group-hover:scale-[1.02] sm:h-[56px] lg:h-[62px]"
          />
        </Link>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="mx-auto hidden min-w-0 max-w-[700px] flex-1 md:flex"
        >
          <div className="relative flex h-9 w-full items-center overflow-hidden rounded-full border border-orange-300 bg-white shadow-[0_3px_14px_rgba(37,99,235,0.08)] ring-1 ring-blue-100 transition focus-within:border-orange-400 focus-within:ring-blue-200">
            <Search className="ml-3.5 h-4 w-4 shrink-0 text-blue-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                isBn
                  ? "শ্রমিক, কাজ, দোকান, সেবা, পণ্য খুঁজুন..."
                  : "Search workers, jobs, shops, services, products..."
              }
              className="min-w-0 flex-1 bg-transparent px-2.5 text-[12px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="mr-1 flex h-7 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-orange-500"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* RIGHT ACTIONS */}
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">

          {/* LANGUAGE */}
          <div
            ref={languageMenuRef}
            className="relative hidden sm:block"
          >
            <button
              type="button"
              onClick={() => {
                setLanguageMenuOpen((value) => !value);
                setAccountMenuOpen(false);
              }}
              aria-expanded={languageMenuOpen}
              aria-haspopup="menu"
              className="flex h-8 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-[9px] font-black text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
              title="Language / ভাষা"
            >
              <Globe2 className="h-3.5 w-3.5 text-orange-500" />
              <span>{isBn ? "BN" : "EN"}</span>

              <ChevronDown
                className={`h-2.5 w-2.5 text-slate-400 transition ${
                  languageMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {languageMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-[80] mt-2 w-56 overflow-hidden rounded-xl border border-orange-300/50 bg-white p-1.5 shadow-[0_18px_45px_rgba(15,23,42,0.18)]"
              >
                <div className="rounded-lg bg-gradient-to-r from-blue-50 to-orange-50 px-2.5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Globe2 className="h-3.5 w-3.5 text-orange-500" />
                    </span>

                    <div>
                      <div className="text-[10px] font-black text-[#07152d]">
                        {isBn
                          ? "বাংলাদেশ → বিশ্ব"
                          : "Bangladesh → Global"}
                      </div>

                      <div className="text-[8px] font-medium text-slate-500">
                        {isBn
                          ? "আরও ভাষা ভবিষ্যতে যুক্ত হবে"
                          : "More languages will be added"}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setLanguage("bn");
                    localStorage.setItem(LANGUAGE_KEY, "bn");
                    setLanguageMenuOpen(false);
                    window.location.reload();
                  }}
                  className={`mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[10px] font-bold transition ${
                    isBn
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <span>🇧🇩</span>
                  <span className="flex-1">বাংলা</span>

                  {isBn && (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setLanguage("en");
                    localStorage.setItem(LANGUAGE_KEY, "en");
                    setLanguageMenuOpen(false);
                    window.location.reload();
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[10px] font-bold transition ${
                    !isBn
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <span>🌐</span>
                  <span className="flex-1">English</span>

                  {!isBn && (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                </button>

                <div className="my-1.5 border-t border-slate-100" />

                <div className="px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">
                  More languages · Coming Soon
                </div>

                <div className="grid grid-cols-2 gap-1 px-1 pb-1">
                  <div className="rounded-lg bg-slate-50 px-2 py-1.5 text-[9px] font-bold text-slate-500">
                    العربية
                  </div>

                  <div className="rounded-lg bg-slate-50 px-2 py-1.5 text-[9px] font-bold text-slate-500">
                    हिन्दी
                  </div>

                  <div className="rounded-lg bg-slate-50 px-2 py-1.5 text-[9px] font-bold text-slate-500">
                    اردو
                  </div>

                  <div className="rounded-lg bg-slate-50 px-2 py-1.5 text-[9px] font-bold text-slate-500">
                    More · Future
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SOCIAL HUB */}
          <Link
            href="/status-feed"
            className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-pink-50 hover:text-pink-600 sm:flex"
            aria-label="Social Hub"
            title={isBn ? "সোশ্যাল হাব" : "Social Hub"}
          >
            <UsersRound className="h-[18px] w-[18px]" />
          </Link>

          {/* CONNECT */}
          <Link
            href="/chat"
            className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 sm:flex"
            aria-label="Connect"
            title={isBn ? "কানেক্ট" : "Connect"}
          >
            <MessageCircle className="h-[18px] w-[18px]" />
          </Link>

          {/* NOTIFICATIONS */}
          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Notifications"
            title={isBn ? "নোটিফিকেশন" : "Notifications"}
          >
            <Bell className="h-[18px] w-[18px]" />

            <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-1 text-[7px] font-black text-white">
              3
            </span>
          </Link>

          {/* ACCOUNT */}
          {user ? (
            <div
              ref={accountMenuRef}
              className="relative hidden sm:block"
            >
              <button
                type="button"
                onClick={() =>
                  setAccountMenuOpen((value) => !value)
                }
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-slate-50"
              >
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white shadow-sm ring-2 ring-white">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}

                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>

                <div className="hidden text-left xl:block">
                  <div className="max-w-[130px] truncate text-xs font-black text-[#07152d]">
                    {user.name || user.phone || "User"}
                  </div>

                  <div className="text-[9px] font-medium text-slate-400">
                    {isBn ? "আমার অ্যাকাউন্ট" : "My Account"}
                  </div>
                </div>

                <ChevronDown
                  className={`hidden h-3.5 w-3.5 text-slate-400 transition duration-200 xl:block ${
                    accountMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ACCOUNT DROPDOWN */}
              {accountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-[70] mt-2 w-52 overflow-hidden rounded-xl border border-orange-300/50 bg-gradient-to-b from-orange-600 to-orange-500 p-1.5 shadow-[0_18px_40px_rgba(15,23,42,0.22)]"
                >
                  {/* ACCOUNT HEADER */}
                  <div className="mb-1 rounded-lg bg-orange-700/40 px-2.5 py-2">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 text-white">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}

                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-orange-600 bg-emerald-400" />
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-xs font-black text-white">
                          {user.name || user.phone || "User"}
                        </div>

                        <div className="text-[9px] font-medium text-orange-100">
                          Shromobazar Account
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MY ACCOUNT */}
                  <Link
                    href="/account"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-blue-600"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/40">
                      <User className="h-3.5 w-3.5" />
                    </span>

                    <span>
                      {isBn ? "আমার অ্যাকাউন্ট" : "My Account"}
                    </span>
                  </Link>

                  {/* SOCIAL HUB */}
                  <Link
                    href="/status-feed"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-blue-600"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/40">
                      <UsersRound className="h-3.5 w-3.5" />
                    </span>

                    <span>
                      {isBn ? "সোশ্যাল হাব" : "Social Hub"}
                    </span>
                  </Link>

                  {/* WALLET */}
                  <Link
                    href="/wallet"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-blue-600"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/40">
                      <Wallet className="h-3.5 w-3.5" />
                    </span>

                    <span>
                      {isBn ? "ওয়ালেট" : "Wallet"}
                    </span>
                  </Link>

                  {/* NOTIFICATIONS */}
                  <Link
                    href="/notifications"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-blue-600"
                  >
                    <span className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/40">
                      <Bell className="h-3.5 w-3.5" />

                      <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-red-300" />
                    </span>

                    <span>
                      {isBn ? "নোটিফিকেশন" : "Notifications"}
                    </span>
                  </Link>

                  {/* SETTINGS */}
                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-blue-600"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/40">
                      ⚙️
                    </span>

                    <span>
                      {isBn ? "সেটিংস" : "Settings"}
                    </span>
                  </Link>

                  {/* SECURITY */}
                  <Link
                    href="/settings"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-bold text-white transition hover:bg-blue-600"
                    title="Security & Verification"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/40">
                      🛡️
                    </span>

                    <span>
                      {isBn ? "সিকিউরিটি" : "Security"}
                    </span>
                  </Link>

                  <div className="my-1.5 border-t border-white/20" />

                  {/* LOGOUT */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[11px] font-bold text-white transition hover:bg-red-600"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/40">
                      <LogOut className="h-3.5 w-3.5" />
                    </span>

                    <span>
                      {isBn ? "লগআউট" : "Logout"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#07152d] transition hover:bg-blue-50 sm:flex"
            >
              <User className="h-4 w-4" />
              {isBn ? "লগইন" : "Login"}
            </Link>
          )}

          {/* REGISTER */}
          {!user && (
            <Link
              href="/register"
              className="hidden h-10 items-center gap-1.5 rounded-full bg-blue-600 px-4 text-xs font-black text-white shadow-[0_5px_15px_rgba(37,99,235,0.20)] transition hover:-translate-y-0.5 hover:bg-blue-700 sm:flex"
            >
              <UserPlus className="h-4 w-4" />
              {isBn ? "নিবন্ধন" : "Register"}
            </Link>
          )}

          {/* MOBILE MENU */}
          <button
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600 lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="px-3 pb-2 md:hidden">
        <form onSubmit={handleSearch}>
          <div className="flex h-9 items-center overflow-hidden rounded-full border border-orange-300 bg-white ring-1 ring-blue-100">
            <Search className="ml-3 h-4 w-4 text-blue-500" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                isBn
                  ? "কাজ, মানুষ, সেবা, পণ্য খুঁজুন..."
                  : "Search anything..."
              }
              className="min-w-0 flex-1 bg-transparent px-2 text-[11px] outline-none"
            />

            <button
              type="submit"
              className="mr-1 flex h-7 w-8 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-orange-500"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* NAVIGATION */}
      <div className="border-t border-slate-800/50 bg-[#07152f] px-2 pb-2 sm:px-4 lg:px-6">
        <nav className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-r from-[#06142d] via-[#0a1d3d] to-[#07152f] px-1.5 py-1.5 shadow-[0_8px_24px_rgba(2,6,23,0.25)] scrollbar-none">

          <Link
            href="/"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/")
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>{isBn ? "হোম" : "Home"}</span>
          </Link>

          <Link
            href="/marketplace"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/marketplace")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isBn ? "মার্কেটপ্লেস" : "Marketplace"}</span>
            <ChevronDown className="h-3 w-3" />
          </Link>

          <Link
            href="/business"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/business")
                ? "bg-blue-50 text-blue-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            }`}
          >
            <BriefcaseBusiness className="h-4 w-4" />
            <span>{isBn ? "ব্যবসা" : "Business"}</span>
            <ChevronDown className="h-3 w-3" />
          </Link>

          <Link
            href="/global-business"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/global-business")
                ? "bg-orange-50 text-orange-600"
                : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <Plane className="h-4 w-4" />
            <span>{isBn ? "প্রবাসী সার্ভিস" : "Probashi Service"}</span>
          </Link>

          <Link
            href="/good-work"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/good-work")
                ? "bg-pink-50 text-pink-600"
                : "text-slate-600 hover:bg-pink-50 hover:text-pink-600"
            }`}
          >
            <Heart className="h-4 w-4" />
            <span>{isBn ? "ভালো কাজ" : "Good Work"}</span>
          </Link>

          <Link
            href="/sports"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/sports")
                ? "bg-amber-50 text-amber-600"
                : "text-slate-600 hover:bg-amber-50 hover:text-amber-600"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>{isBn ? "স্পোর্টস" : "Sports"}</span>
            <ChevronDown className="h-3 w-3" />
          </Link>

          <Link
            href="/health"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/health")
                ? "bg-cyan-50 text-cyan-700"
                : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
            }`}
          >
            <span className="text-base leading-none">🩺</span>
            <span>{isBn ? "স্বাস্থ্য" : "Medical"}</span>
          </Link>

          <Link
            href="/education"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/education")
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>{isBn ? "শিক্ষা" : "Education"}</span>
          </Link>

          <Link
            href="/explore"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/explore")
                ? "bg-orange-50 text-orange-600"
                : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>{isBn ? "এক্সপ্লোর" : "Explore"}</span>
          </Link>

          <Link
            href="/shromo-tv"
            className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${
              isActive("/shromo-tv")
                ? "bg-purple-50 text-purple-600"
                : "text-slate-600 hover:bg-purple-50 hover:text-purple-600"
            }`}
          >
            <span className="text-base">📺</span>
            <span>{isBn ? "মিডিয়া" : "Media"}</span>
          </Link>

          <Link
            href="/wallet"
            className={`hidden h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition xl:flex ${
              isActive("/wallet")
                ? "bg-emerald-50 text-emerald-700"
                : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span>{isBn ? "ওয়ালেট" : "Wallet"}</span>
          </Link>

          <div className="mx-1 hidden h-7 w-px shrink-0 bg-slate-200 lg:block" />

          <Link
            href="/chat"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 lg:flex"
            aria-label="Support"
          >
            <MessageCircle className="h-4 w-4" />
          </Link>
        </nav>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-3 py-3 shadow-lg lg:hidden">
          <div className="grid grid-cols-2 gap-2">

            <Link
              href="/notifications"
              onClick={() => setMobileOpen(false)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-50 text-sm font-bold text-red-600"
            >
              <Bell className="h-4 w-4" />
              {isBn ? "নোটিফিকেশন" : "Notifications"}
            </Link>

            <Link
              href="/wallet"
              onClick={() => setMobileOpen(false)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700"
            >
              <Wallet className="h-4 w-4" />
              {isBn ? "ওয়ালেট" : "Wallet"}
            </Link>

            <Link
              href="/health"
              onClick={() => setMobileOpen(false)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-50 text-sm font-bold text-cyan-700"
            >
              <span>🩺</span>
              {isBn ? "মেডিকেল" : "Medical"}
            </Link>

            <Link
              href="/education"
              onClick={() => setMobileOpen(false)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700"
            >
              <BookOpen className="h-4 w-4" />
              {isBn ? "শিক্ষা" : "Education"}
            </Link>

            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-50 text-sm font-bold text-blue-700"
                >
                  <User className="h-4 w-4" />
                  {isBn ? "অ্যাকাউন্ট" : "Account"}
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-50 text-sm font-bold text-orange-700"
                >
                  <span>⚙️</span>
                  {isBn ? "সেটিংস" : "Settings"}
                </Link>

                <button
                  onClick={handleLogout}
                  className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500 text-sm font-bold text-white"
                >
                  <LogOut className="h-4 w-4" />
                  {isBn ? "লগআউট" : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  {isBn ? "নিবন্ধন" : "Register"}
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-bold text-white"
                >
                  <LogIn className="h-4 w-4" />
                  {isBn ? "লগইন" : "Login"}
                </Link>
              </>
            )}

            <button
              onClick={changeLanguage}
              className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-700"
            >
              <Globe2 className="h-4 w-4" />
              {isBn ? "English" : "বাংলা"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}