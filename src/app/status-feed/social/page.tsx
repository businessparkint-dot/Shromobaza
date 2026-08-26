"use client";

import Link from "next/link";
import {
  Bell,
  Camera,
  ChevronRight,
  Heart,
  Home,
  MessageCircle,
  Play,
  Plus,
  Search,
  ShoppingBag,
  UserCircle,
  Users,
  Video,
} from "lucide-react";

const socialOptions = [
  { title: "Home Feed", subtitle: "Posts & Updates", href: "/status-feed", icon: Home },
  { title: "Reels", subtitle: "Short Videos", href: "/reels", icon: Play },
  { title: "Videos", subtitle: "Watch Videos", href: "/videos", icon: Video },
  { title: "People", subtitle: "Find & Connect", href: "/people", icon: Users },
  { title: "Following", subtitle: "Your Network", href: "/following", icon: Heart },
  { title: "Notifications", subtitle: "Your Activity", href: "/notifications", icon: Bell },
  { title: "Chat", subtitle: "Messages", href: "/chat", icon: MessageCircle },
  { title: "Marketplace", subtitle: "Buy & Sell", href: "/marketplace", icon: ShoppingBag },
  { title: "My Account", subtitle: "Profile & Settings", href: "/my-account", icon: UserCircle },
];

export default function SocialPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] pb-20 text-[#07152d]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07152d] text-white">
              <Users className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-black">Shromobazar</p>
              <p className="text-[10px] text-slate-400">Free Social Platform</p>
            </div>
          </Link>

          <div className="hidden w-full max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search people, posts, videos..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-medium outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/status-feed/create"
              className="hidden h-10 items-center gap-2 rounded-xl bg-orange-500 px-4 text-xs font-black text-white hover:bg-orange-600 sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              Create
            </Link>

            <Link
              href="/notifications"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
            >
              <Bell className="h-4 w-4" />
            </Link>

            <Link
              href="/my-account"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#07152d] text-white"
            >
              <UserCircle className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 py-6 sm:px-6 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 overflow-hidden rounded-[1.75rem] bg-[#07152d] p-5 text-white shadow-lg sm:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black text-orange-300">
                  <Heart className="h-3.5 w-3.5" />
                  FREE SOCIAL PLATFORM
                </div>

                <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Connect, Share & Discover
                </h1>

                <p className="mt-2 max-w-xl text-xs leading-5 text-slate-300 sm:text-sm">
                  Connect with people, share your moments, watch videos,
                  follow creators and stay connected.
                </p>
              </div>

              <Link
                href="/status-feed/create"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-xs font-black text-white hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Create Post
              </Link>
            </div>
          </div>

          <div className="mb-5 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
              {socialOptions.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex min-h-[82px] flex-col items-center justify-center rounded-xl border border-transparent px-2 py-2 text-center hover:border-orange-100 hover:bg-orange-50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-[#07152d] group-hover:bg-orange-500 group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>

                    <span className="mt-2 text-[10px] font-black text-slate-700">
                      {item.title}
                    </span>

                    <span className="mt-0.5 hidden text-[9px] text-slate-400 lg:block">
                      {item.subtitle}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-4">
              <Link
                href="/status-feed/create"
                className="block rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm hover:border-orange-200 sm:p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#07152d] text-white">
                    <UserCircle className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1 rounded-xl bg-slate-50 px-4 py-3 text-xs font-medium text-slate-400">
                    Share something with the community...
                  </div>

                  <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500 sm:flex">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
              </Link>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h2 className="text-sm font-black">Latest Posts</h2>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Community updates
                    </p>
                  </div>

                  <Link
                    href="/status-feed"
                    className="inline-flex items-center gap-1 text-[10px] font-black text-orange-500"
                  >
                    View Feed
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#07152d] text-xs font-black text-white">
                      শ
                    </div>

                    <div>
                      <p className="text-xs font-black">শ্রমবাজার সদস্য</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Community Member
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Community-তে আপনার নতুন update, experience বা প্রয়োজনীয়
                    তথ্য share করুন।
                  </p>

                  <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3">
                    <Link href="/status-feed" className="rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50">
                      ♡ Like
                    </Link>
                    <Link href="/status-feed" className="rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50">
                      Comment
                    </Link>
                    <Link href="/status-feed" className="rounded-lg px-3 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50">
                      Share
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#07152d] text-white">
                    <UserCircle className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-black">My Social Space</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Your profile & activity
                    </p>
                  </div>
                </div>

                <Link
                  href="/my-account"
                  className="mt-4 flex h-9 items-center justify-center rounded-xl bg-[#07152d] text-[10px] font-black text-white"
                >
                  Open My Account
                </Link>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-black">Quick Actions</p>

                <div className="mt-3 space-y-1">
                  <Link href="/status-feed/create" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600">
                    <Plus className="h-4 w-4" />
                    Create Post
                  </Link>

                  <Link href="/chat" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
                    <MessageCircle className="h-4 w-4" />
                    Open Chat
                  </Link>

                  <Link href="/notifications" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </Link>
                </div>
              </div>

              <Link
                href="/marketplace"
                className="group block rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 hover:ring-orange-200"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <ShoppingBag className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-black">Marketplace</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Buy & Sell
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-[10px] leading-5 text-slate-500">
                  Discover products and services from the community.
                </p>
              </Link>

              <div className="rounded-[1.5rem] bg-[#07152d] p-5 text-white shadow-lg">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-orange-400">
                  Future
                </p>

                <h3 className="mt-2 text-sm font-black">Monetization Pool</h3>

                <p className="mt-2 text-[10px] leading-5 text-slate-300">
                  Platform revenue পরে তৈরি হবে। Future phase-এ eligible
                  creators-এর জন্য revenue sharing চালু করা যাবে।
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          <MobileNav href="/status-feed" icon={Home} label="Home" />
          <MobileNav href="/reels" icon={Play} label="Reels" />
          <MobileNav href="/status-feed/create" icon={Plus} label="Create" active />
          <MobileNav href="/chat" icon={MessageCircle} label="Chat" />
          <MobileNav href="/my-account" icon={UserCircle} label="Account" />
        </div>
      </nav>
    </main>
  );
}

function MobileNav({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center rounded-xl py-1.5 transition ${
        active
          ? "text-orange-500"
          : "text-slate-500 hover:bg-slate-50 hover:text-orange-500"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="mt-0.5 text-[9px] font-bold">{label}</span>
    </Link>
  );
}