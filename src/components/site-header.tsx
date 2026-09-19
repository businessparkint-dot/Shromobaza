"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
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
  Store,
  Trophy,
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
};

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [language, setLanguage] = useState<"bn" | "en">("bn");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

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

      {/* =====================================================
          TOP BRAND / SEARCH / ACCOUNT ROW
      ====================================================== */}

      <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center gap-3 px-3 py-2 sm:px-5 lg:px-7">

        {/* LOGO */}

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
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
          className="mx-auto hidden min-w-0 max-w-[760px] flex-1 md:flex"
        >
          <div className="relative flex h-12 w-full items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-[0_4px_18px_rgba(15,23,42,0.07)] transition focus-within:border-blue-300 focus-within:shadow-[0_6px_22px_rgba(37,99,235,0.12)]">

            <Search className="ml-5 h-5 w-5 shrink-0 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                isBn
                  ? "শ্রমিক, কাজ, দোকান, সেবা, পণ্য খুঁজুন..."
                  : "Search workers, jobs, shops, services, products..."
              }
              className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            />

            <button
              type="submit"
              className="mr-1.5 flex h-10 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

          </div>
        </form>

        {/* RIGHT ACTIONS */}

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">

          {/* LANGUAGE */}

          <button
            onClick={changeLanguage}
            className="hidden h-10 items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-3 text-xs font-bold text-slate-700 transition hover:bg-blue-100 sm:flex"
          >
            <span className="text-base">🇧🇩</span>
            <span>{isBn ? "বাংলা" : "EN"}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">
              {isBn ? "EN" : "বাংলা"}
            </span>
          </button>

          {/* NOTIFICATION */}

          <Link
            href="/notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Notifications"
          >
            <Bell className="h-[19px] w-[19px]" />

            <span className="absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-black text-white">
              3
            </span>
          </Link>

          {/* CHAT */}

          <Link
            href="/chat"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 sm:flex"
            aria-label="Chat"
          >
            <MessageCircle className="h-[19px] w-[19px]" />
          </Link>

          {/* ACCOUNT */}

          {user ? (
            <Link
              href="/account"
              className="hidden items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-slate-50 sm:flex"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                <User className="h-5 w-5" />
              </div>

              <div className="hidden text-left xl:block">
                <div className="max-w-[130px] truncate text-xs font-black text-[#07152d]">
                  {user.name || user.phone || "User"}
                </div>

                <div className="text-[9px] font-medium text-slate-400">
                  {isBn ? "আমার অ্যাকাউন্ট" : "My Account"}
                </div>
              </div>
            </Link>
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

      {/* =====================================================
          MOBILE SEARCH
      ====================================================== */}

      <div className="px-3 pb-2 md:hidden">
        <form onSubmit={handleSearch}>
          <div className="flex h-10 items-center overflow-hidden rounded-full border border-slate-200 bg-slate-50">

            <Search className="ml-3 h-4 w-4 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                isBn
                  ? "কাজ, মানুষ, সেবা, পণ্য খুঁজুন..."
                  : "Search anything..."
              }
              className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-none"
            />

            <button
              type="submit"
              className="mr-1 flex h-8 w-9 items-center justify-center rounded-full bg-blue-600 text-white"
            >
              <Search className="h-4 w-4" />
            </button>

          </div>
        </form>
      </div>

      {/* =====================================================
          MAIN SMART NAVIGATION
      ====================================================== */}

      <div className="border-t border-slate-800/50 bg-[#07152f] px-2 pb-2 sm:px-4 lg:px-6">
  <nav className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-r from-[#06142d] via-[#0a1d3d] to-[#07152f] px-1.5 py-1.5 shadow-[0_8px_24px_rgba(2,6,23,0.25)] scrollbar-none">

          {/* HOME */}

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

          {/* MARKETPLACE */}

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

          {/* BUSINESS */}

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

          {/* PROBASHI */}

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

          {/* GOOD WORK */}

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

          {/* SPORTS */}

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

          {/* MEDICAL */}

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

          {/* EDUCATION */}

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

          {/* EXPLORE */}

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

          {/* MEDIA */}

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

          {/* WALLET */}

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

          {/* DIVIDER */}

          <div className="mx-1 hidden h-7 w-px shrink-0 bg-slate-200 lg:block" />

          {/* SUPPORT */}

          <Link
            href="/chat"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 lg:flex"
            aria-label="Support"
          >
            <MessageCircle className="h-4 w-4" />
          </Link>

        </nav>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

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

            {!user ? (
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
            ) : (
              <button
                onClick={handleLogout}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-red-500 text-sm font-bold text-white"
              >
                <LogOut className="h-4 w-4" />
                {isBn ? "লগআউট" : "Logout"}
              </button>
            )}

            <button
              onClick={changeLanguage}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-100 text-sm font-bold text-slate-700"
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