
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Globe2,
  LogOut,
  EllipsisVertical,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
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

const navigation = [
  ["/", "Home"],
  ["/marketplace", "Marketplace"],
  ["/global-business", "Global Business"],
  ["/religion", "Religion"],
  ["/art-of-brine", "Art of Brine"],
  ["/food-pathe-market", "Food Pathé Market"],
  ["/probashi", "Probashi Service"],
  ["/good-work", "Good Work"],
  ["/sports", "Sports"],
  ["/health", "Medical"],
  ["/education", "Education"],
  ["/shromo-tv", "Media"],
  ["/wallet", "Wallet"],
];

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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isBn = language === "bn";

  // Load saved language
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_KEY);
      if (saved === "bn" || saved === "en") {
        setLanguage(saved);
      }
    } catch (error) {
      console.error("Language loading error:", error);
    }
  }, []);

  // Load Supabase user and profile
  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const savedUser = localStorage.getItem(CURRENT_USER_KEY);

        if (savedUser && mounted) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem(CURRENT_USER_KEY);
          }
        }

        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth user loading error:", authError.message);
        }

        if (!mounted) return;

        if (!authUser) {
          setUser(null);
          localStorage.removeItem(CURRENT_USER_KEY);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, name, phone, avatar_url")
          .eq("id", authUser.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile loading error:", profileError.message);
        }

        if (!mounted) return;

        const firstName = authUser.user_metadata?.first_name || "";
        const lastName = authUser.user_metadata?.last_name || "";
        const metadataName =
          authUser.user_metadata?.name ||
          `${firstName} ${lastName}`.trim();

        const currentUser: CurrentUser = {
          id: authUser.id,
          name:
            profile?.name ||
            metadataName ||
            authUser.email?.split("@")[0] ||
            "User",
          phone:
            profile?.phone ||
            authUser.user_metadata?.phone ||
            undefined,
          avatar_url:
            profile?.avatar_url ||
            authUser.user_metadata?.avatar_url ||
            authUser.user_metadata?.picture ||
            undefined,
          userType: authUser.user_metadata?.user_type || "master",
        };

        setUser(currentUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      } catch (error) {
        console.error("Header user loading error:", error);
      }
    };

    void loadUser();

    const handleUserUpdated = () => {
      void loadUser();
    };

    window.addEventListener("shromobazar-user-updated", handleUserUpdated);

    return () => {
      mounted = false;
      window.removeEventListener(
        "shromobazar-user-updated",
        handleUserUpdated,
      );
    };
  }, []);

  // Close menus when navigating or clicking outside
  useEffect(() => {
    setAccountMenuOpen(false);
    setLanguageMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
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

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountMenuOpen(false);
        setLanguageMenuOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const changeLanguage = (nextLanguage: "bn" | "en") => {
    setLanguage(nextLanguage);
    localStorage.setItem(LANGUAGE_KEY, nextLanguage);
    setLanguageMenuOpen(false);
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error.message);
        return;
      }

      localStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
      setAccountMenuOpen(false);
      setMobileOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();

    if (!query) return;

    setMobileOpen(false);
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const accountMenuItems = [
    {
      href: "/account",
      label: isBn ? "আমার অ্যাকাউন্ট" : "My Account",
      icon: User,
    },
    {
      href: "/status-feed",
      label: isBn ? "সোশ্যাল হাব" : "Social Hub",
      icon: UsersRound,
    },
    {
      href: "/wallet",
      label: isBn ? "ওয়ালেট" : "Wallet",
      icon: Wallet,
    },
    {
      href: "/settings",
      label: isBn ? "সেটিংস ও সিকিউরিটি" : "Settings & Security",
      icon: Settings,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-[0_6px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      {/* TOP HEADER */}
      <div className="mx-auto flex min-h-[60px] max-w-[1600px] items-center gap-2 px-2.5 py-2 sm:min-h-[72px] sm:gap-3 sm:px-5 lg:px-7">
        {/* LOGO — preserve existing asset */}
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
            className="h-[40px] w-auto object-contain transition duration-200 group-hover:scale-[1.02] sm:h-[56px] lg:h-[62px]"
          />
        </Link>

        {/* DESKTOP SEARCH */}
        <form
          onSubmit={handleSearch}
          className="mx-auto hidden min-w-0 max-w-[700px] flex-1 md:flex"
        >
          <div className="relative flex h-9 w-full items-center overflow-hidden rounded-full border border-orange-300 bg-white shadow-sm ring-1 ring-blue-100 focus-within:border-orange-400">
            <Search className="ml-3.5 h-4 w-4 shrink-0 text-blue-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                isBn
                  ? "শ্রমিক, কাজ, দোকান, সেবা, পণ্য খুঁজুন..."
                  : "Search workers, jobs, shops, services, products..."
              }
              className="min-w-0 flex-1 bg-transparent px-2.5 text-xs font-medium text-slate-700 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Search"
              className="mr-1 flex h-7 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-orange-500"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>

        {/* RIGHT ACTIONS */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
          {/* DESKTOP LANGUAGE MENU */}
          <div ref={languageMenuRef} className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => {
                setLanguageMenuOpen((value) => !value);
                setAccountMenuOpen(false);
              }}
              aria-expanded={languageMenuOpen}
              aria-haspopup="menu"
              className="flex h-8 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-[10px] font-black text-slate-700 shadow-sm hover:border-orange-300 hover:bg-orange-50"
              title="Language / ভাষা"
            >
              <Globe2 className="h-3.5 w-3.5 text-orange-500" />
              <span>{isBn ? "BN" : "EN"}</span>
              <ChevronDown
                className={`h-3 w-3 text-slate-400 transition ${
                  languageMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {languageMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-[80] mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
              >
                <div className="px-2.5 py-2 text-[10px] font-black text-slate-500">
                  {isBn ? "ভাষা নির্বাচন করুন" : "Choose language"}
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => changeLanguage("bn")}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs font-bold ${
                    isBn
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  🇧🇩 বাংলা
                  {isBn && <CheckCircle2 className="ml-auto h-4 w-4" />}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => changeLanguage("en")}
                  className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-xs font-bold ${
                    !isBn
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  🌐 English
                  {!isBn && <CheckCircle2 className="ml-auto h-4 w-4" />}
                </button>
              </div>
            )}
          </div>

          {/* DESKTOP SHORTCUTS */}
          {user && (
            <>
              <Link
                href="/status-feed"
                className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-pink-50 hover:text-pink-600 sm:flex"
                aria-label="Social Hub"
                title={isBn ? "সোশ্যাল হাব" : "Social Hub"}
              >
                <UsersRound className="h-[18px] w-[18px]" />
              </Link>

              <Link
                href="/chat"
                className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 sm:flex"
                aria-label="Connect"
                title={isBn ? "কানেক্ট" : "Connect"}
              >
                <MessageCircle className="h-[18px] w-[18px]" />
              </Link>

              <Link
                href="/notifications"
                className="relative hidden h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 sm:flex"
                aria-label="Notifications"
                title={isBn ? "নোটিফিকেশন" : "Notifications"}
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-1 text-[7px] font-black text-white">
                  3
                </span>
              </Link>
            </>
          )}

          {/* ACCOUNT: desktop name button + small mobile avatar */}
          {user ? (
            <div ref={accountMenuRef} className="relative">
              {/* DESKTOP ACCOUNT BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setAccountMenuOpen((value) => !value);
                  setMobileOpen(false);
                  setLanguageMenuOpen(false);
                }}
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                aria-label={isBn ? "আমার অ্যাকাউন্ট" : "My Account"}
                className="hidden items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-slate-50 sm:flex"
              >
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white ring-2 ring-white">
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
                </span>

                <span className="text-left">
                  <span className="block max-w-[130px] truncate text-xs font-black text-[#07152d]">
                    {user.name || user.phone || "User"}
                  </span>
                  <span className="block text-[9px] font-medium text-slate-400">
                    {isBn ? "আমার অ্যাকাউন্ট" : "My Account"}
                  </span>
                </span>

                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition ${
                    accountMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* MOBILE: compact circular profile avatar */}
              <button
                type="button"
                onClick={() => {
                  setAccountMenuOpen((value) => !value);
                  setMobileOpen(false);
                  setLanguageMenuOpen(false);
                }}
                aria-expanded={accountMenuOpen}
                aria-haspopup="menu"
                aria-label={isBn ? "আমার অ্যাকাউন্ট" : "My Account"}
                title={isBn ? "আমার অ্যাকাউন্ট" : "My Account"}
                className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-blue-600 text-white shadow-sm ring-1 ring-slate-100 sm:hidden"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name || "My profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-emerald-500" />
              </button>

              {/* COMPACT BLACK ACCOUNT DROPDOWN — one column on every screen */}
              {accountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-[90] mt-2 w-[205px] max-w-[calc(100vw-20px)] overflow-hidden rounded-xl border border-slate-700 bg-[#111827] p-1.5 shadow-[0_14px_35px_rgba(0,0,0,0.30)]"
                >
                  <div className="mb-1 flex items-center gap-2.5 rounded-lg border-b border-white/10 px-2.5 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-white">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-white">
                        {user.name || user.phone || "User"}
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Shromobazar Account
                      </div>
                    </div>
                  </div>

                  {accountMenuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        role="menuitem"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex min-h-9 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}

                  <Link
                    href="/notifications"
                    role="menuitem"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex min-h-9 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-slate-200 hover:bg-slate-700 hover:text-white"
                  >
                    <Bell className="h-4 w-4 shrink-0 text-slate-400" />
                    {isBn ? "নোটিফিকেশন" : "Notifications"}
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="mt-1 flex min-h-9 w-full items-center gap-2.5 rounded-lg border-t border-white/10 px-2.5 py-2 text-left text-[11px] font-semibold text-red-300 transition hover:bg-red-500/15 hover:text-red-200"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {isBn ? "লগআউট" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#07152d] transition hover:bg-blue-50 sm:flex"
              >
                <User className="h-4 w-4" />
                {isBn ? "লগইন" : "Login"}
              </Link>

              <Link
                href="/register"
                className="hidden h-9 items-center gap-1.5 rounded-full bg-blue-600 px-4 text-xs font-black text-white shadow-sm transition hover:bg-blue-700 sm:flex"
              >
                <UserPlus className="h-4 w-4" />
                {isBn ? "নিবন্ধন" : "Register"}
              </Link>

              {/* MOBILE LOGIN / REGISTER */}
              <div className="flex shrink-0 items-center gap-1 sm:hidden">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-7 items-center justify-center rounded-full border border-blue-200 bg-white px-2 text-[9px] font-black text-blue-700"
                >
                  {isBn ? "লগইন" : "Login"}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-7 items-center justify-center rounded-full bg-blue-600 px-2 text-[9px] font-black text-white"
                >
                  {isBn ? "নিবন্ধন" : "Register"}
                </Link>
              </div>
            </>
          )}

          {/* THREE-DOT MOBILE MENU */}
          <div ref={mobileMenuRef} className="relative lg:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileOpen((value) => !value);
                setAccountMenuOpen(false);
                setLanguageMenuOpen(false);
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
              aria-label={isBn ? "আরও মেনু" : "More menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <EllipsisVertical className="h-5 w-5" />
              )}
            </button>

            {mobileOpen && (
              <div
                id="mobile-menu"
                className="absolute right-0 top-full z-[80] mt-2 w-[245px] max-w-[calc(100vw-16px)] overflow-hidden rounded-xl border border-slate-200 bg-white p-2 shadow-[0_15px_35px_rgba(15,23,42,0.18)]"
              >
                <div className="mb-1 flex items-center justify-between border-b border-slate-100 px-2 py-2">
                  <span className="text-xs font-black text-slate-800">
                    {isBn ? "দ্রুত মেনু" : "Quick Menu"}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeLanguage(isBn ? "en" : "bn")}
                    className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700"
                  >
                    <Globe2 className="h-3 w-3" />
                    {isBn ? "বাংলা" : "English"}
                  </button>
                </div>

                {user && (
                  <div className="mb-1 flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-slate-800">
                        {user.name || user.phone || "User"}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isBn ? "সক্রিয় অ্যাকাউন্ট" : "Signed in"}
                      </div>
                    </div>
                  </div>
                )}

                {[
                  {
                    href: "/status-feed",
                    label: isBn ? "সোশ্যাল হাব" : "Social Hub",
                    icon: UsersRound,
                  },
                  {
                    href: "/chat",
                    label: isBn ? "কানেক্ট / চ্যাট" : "Connect / Chat",
                    icon: MessageCircle,
                  },
                  {
                    href: "/notifications",
                    label: isBn ? "নোটিফিকেশন" : "Notifications",
                    icon: Bell,
                  },
                  {
                    href: "/wallet",
                    label: isBn ? "ওয়ালেট" : "Wallet",
                    icon: Wallet,
                  },
                  {
                    href: "/health",
                    label: isBn ? "মেডিকেল" : "Medical",
                    icon: ShieldCheck,
                  },
                  {
                    href: "/education",
                    label: isBn ? "শিক্ষা" : "Education",
                    icon: BookOpen,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Icon className="h-4 w-4 text-slate-500" />
                      {item.label}
                    </Link>
                  );
                })}

                {user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setMobileOpen(false)}
                      className="flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      {isBn ? "আমার অ্যাকাউন্ট" : "My Account"}
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMobileOpen(false)}
                      className="flex min-h-10 items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                      {isBn ? "সেটিংস" : "Settings"}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex min-h-10 w-full items-center gap-2.5 rounded-lg border-t border-slate-100 px-2.5 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {isBn ? "লগআউট" : "Logout"}
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mt-1 flex min-h-10 items-center gap-2.5 rounded-lg border-t border-slate-100 px-2.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                  >
                    <User className="h-4 w-4" />
                    {isBn ? "লগইন করুন" : "Sign in"}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="px-3 pb-2 md:hidden">
        <form onSubmit={handleSearch}>
          <div className="flex h-9 items-center overflow-hidden rounded-full border border-orange-300 bg-white ring-1 ring-blue-100">
            <Search className="ml-3 h-4 w-4 shrink-0 text-blue-500" />
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
              aria-label="Search"
              className="mr-1 flex h-7 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-orange-500"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* MAIN NAVIGATION — preserved */}
      <div className="w-full min-w-0 px-1 sm:px-2">
        <nav
          id="main-navigation"
          className="flex w-full min-w-0 items-center justify-start gap-1 overflow-x-auto rounded-xl border border-slate-700 bg-[#071b3a] px-1.5 py-1.5 shadow-md lg:justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {navigation.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="flex h-7 shrink-0 items-center whitespace-nowrap rounded-lg border border-white/10 bg-white/5 px-2 text-[9px] font-bold text-white transition-all duration-200 hover:border-orange-400 hover:bg-orange-500 active:scale-[0.97] sm:h-8 sm:px-2.5 sm:text-[11px]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}