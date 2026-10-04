"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Edit3,
  Globe,
  Image as ImageIcon,
  MapPin,
  Package,
  Phone,
  PlayCircle,
  Radio,
  RefreshCw,
  Store,
  Video,
} from "lucide-react";

import { supabase } from "@/lib/client";

type ShopProfile = {
  id: string;
  user_id: string;
  identity_type: "shop";
  display_name: string;
  bio: string | null;
  business_type: string | null;
  category: string | null;
  owner_admin_name: string | null;
  contact_number: string | null;
  address: string | null;
  is_active: boolean;
  is_public: boolean;
  created_at: string;
};

function shopTypeLabel(type: string | null) {
  if (type === "wholesale") return "Wholesale";
  if (type === "retail_wholesale") return "Retail + Wholesale";
  if (type === "footpath") return "Footpath / Street Market";
  return "Retail";
}

export default function ShopProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const profileId = searchParams.get("id");

  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace(
            `/login?redirect=/open-your-shop/profile${
              profileId ? `?id=${profileId}` : ""
            }`
          );
          return;
        }

        if (!mounted) return;

        setUserId(user.id);

        let query = supabase
          .from("identities")
          .select(
            `
              id,
              user_id,
              identity_type,
              display_name,
              bio,
              business_type,
              category,
              owner_admin_name,
              contact_number,
              address,
              is_active,
              is_public,
              created_at
            `
          )
          .eq("identity_type", "shop");

        if (profileId) {
          query = query.eq("id", profileId);
        } else {
          query = query
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: false,
            });
        }

        const { data, error: fetchError } = await query.maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error("Shop profile পাওয়া যায়নি।");
        }

        if (!mounted) return;

        setProfile(data as ShopProfile);
      } catch (err: unknown) {
        console.error("Shop profile error:", err);

        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Shop profile load করা যায়নি."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [profileId, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
          <span className="font-semibold text-slate-700">
            Shop Profile লোড হচ্ছে...
          </span>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/open-your-shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop Registration
          </Link>

          <div className="mt-8 rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <Store className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Shop Profile পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-slate-600">
              {error || "এই Shop Profile বর্তমানে পাওয়া যাচ্ছে না।"}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <Link
                href="/open-your-shop"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                <Store className="h-4 w-4" />
                Open Your Shop
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isOwner = !!userId && profile.user_id === userId;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Smart Shop Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Marketplace</span>
            <span className="sm:hidden">Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs font-bold text-slate-400">
                {profile.display_name}
              </span>
            </div>

            {profile.is_public ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                <Globe className="h-3.5 w-3.5" />
                Public
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600">
                Private
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${
                profile.is_active
                  ? "bg-blue-50 text-blue-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {profile.is_active && (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              {profile.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">
        {/* Shop Cover / Main Hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-blue-800 via-blue-600 to-orange-500 shadow-xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-28 -left-10 h-80 w-80 rounded-full bg-orange-200 blur-3xl" />
          </div>

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/80 bg-white shadow-xl sm:h-28 sm:w-28">
                  <Store className="h-12 w-12 text-blue-600 sm:h-14 sm:w-14" />
                </div>

                <div className="text-white">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 sm:text-sm">
                    Shromobazar Shop
                  </p>

                  <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                    {profile.display_name}
                  </h1>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur sm:text-sm">
                      {shopTypeLabel(profile.business_type)}
                    </span>

                    {profile.category && (
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur sm:text-sm">
                        {profile.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isOwner && (
                <Link
                  href={`/open-your-shop?edit=${profile.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Shop
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Full Auto Website */}
        <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          {/* Website Navigation */}
          <div className="border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Shromobazar Storefront
                </p>
                <p className="mt-1 text-sm font-bold text-slate-500">
                  আপনার Shop Website অটোমেটিকভাবে প্রস্তুত
                </p>
              </div>

              <nav className="flex flex-wrap gap-2">
                <a
                  href="#gallery"
                  className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Album
                </a>

                <a
                  href="#video"
                  className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-purple-50 hover:text-purple-700"
                >
                  Video
                </a>

                <a
                  href="#products"
                  className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                >
                  Products
                </a>

                <a
                  href="#offers"
                  className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
                >
                  Offers
                </a>

                <a
                  href="#live"
                  className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700 transition hover:bg-red-50 hover:text-red-700"
                >
                  Live
                </a>
              </nav>
            </div>
          </div>

          {/* Website Hero */}
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-6 py-10 text-white sm:px-10 sm:py-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black backdrop-blur">
                    Official Shop
                  </span>

                  {profile.is_public && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-black text-emerald-100">
                      <Globe className="h-3.5 w-3.5" />
                      Public Store
                    </span>
                  )}
                </div>

                <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                  {profile.display_name}
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                  {profile.bio ||
                    "Shromobazar-এর মাধ্যমে আপনার পণ্য, সেবা ও ব্যবসাকে একটি সুন্দর ডিজিটাল Shop Website হিসেবে উপস্থাপন করুন।"}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {profile.address && (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold backdrop-blur">
                      <MapPin className="h-4 w-4" />
                      {profile.address}
                    </div>
                  )}

                  {profile.contact_number && (
                    <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold backdrop-blur">
                      <Phone className="h-4 w-4" />
                      {profile.contact_number}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Store className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-white/50">
                      Store Type
                    </p>
                    <p className="mt-1 font-black">
                      {shopTypeLabel(profile.business_type)}
                    </p>
                  </div>
                </div>

                {profile.category && (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="text-xs font-black uppercase tracking-wider text-white/50">
                      Category
                    </p>
                    <p className="mt-2 font-bold text-white/90">
                      {profile.category}
                    </p>
                  </div>
                )}

                <div className="mt-5 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/60">
                      Shop Status
                    </span>

                    <span className="rounded-full bg-emerald-400/20 px-3 py-1.5 text-xs font-black text-emerald-100">
                      {profile.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Services */}
          <div className="px-5 py-7 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StoreService
                icon={<Package className="h-5 w-5" />}
                title="Products"
                text="পণ্য দেখুন"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />

              <StoreService
                icon={<ImageIcon className="h-5 w-5" />}
                title="Album"
                text="Shop Photos"
                onClick={() =>
                  document
                    .getElementById("gallery")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />

              <StoreService
                icon={<Video className="h-5 w-5" />}
                title="Video"
                text="Shop Video"
                onClick={() =>
                  document
                    .getElementById("video")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />

              <StoreService
                icon={<Radio className="h-5 w-5" />}
                title="Live"
                text="Live Selling"
                onClick={() =>
                  document
                    .getElementById("live")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />
            </div>
          </div>

          {/* Album / Gallery */}
          <section
            id="gallery"
            className="border-t border-slate-100 bg-slate-50 px-5 py-9 sm:px-6"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Shop Album
                </p>

                <h3 className="mt-1 text-2xl font-black text-slate-900">
                  Photos & Gallery
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  আপনার Shop-এর ছবি, showroom, products ও special moments এখানে
                  সুন্দরভাবে প্রদর্শিত হবে।
                </p>
              </div>

              {isOwner && (
                <button
                  type="button"
                  onClick={() =>
                    alert("Shop Album upload system পরবর্তী ধাপে চালু হবে।")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-black text-blue-700 hover:bg-blue-50"
                >
                  <ImageIcon className="h-4 w-4" />
                  Add Photos
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <GalleryCard
                title="Shop Cover"
                subtitle="Your storefront cover"
                icon={<Store className="h-8 w-8" />}
              />

              <GalleryCard
                title="Products"
                subtitle="Product photos"
                icon={<Package className="h-8 w-8" />}
              />

              <GalleryCard
                title="Showroom"
                subtitle="Shop & showroom"
                icon={<ImageIcon className="h-8 w-8" />}
              />

              <GalleryCard
                title="Highlights"
                subtitle="Special moments"
                icon={<BadgeCheck className="h-8 w-8" />}
              />
            </div>
          </section>

          {/* Video */}
          <section id="video" className="px-5 py-9 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-7 text-white sm:p-9">
                <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-purple-500/20 blur-3xl" />

                <div className="relative">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Video className="h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Shop Video
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-black sm:text-3xl">
                    Video Showcase
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                    Shop introduction, product video, promotional video এবং
                    business presentation এখানে দেখানো যাবে।
                  </p>

                  <div className="mt-7 flex aspect-video items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                    <div className="text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <PlayCircle className="h-9 w-9 text-white" />
                      </div>

                      <p className="mt-4 text-sm font-black text-white/70">
                        Shop Video Coming Soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-xs font-black uppercase tracking-wider text-purple-600">
                  Media
                </p>

                <h3 className="mt-2 text-xl font-black text-slate-900">
                  Video & Media
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  ভবিষ্যতে এখানে একাধিক video, promotional content এবং product
                  showcase যুক্ত করা যাবে।
                </p>

                <div className="mt-6 space-y-3">
                  <MediaFeature
                    icon={<PlayCircle className="h-5 w-5" />}
                    title="Product Video"
                    text="Product showcase"
                  />

                  <MediaFeature
                    icon={<Video className="h-5 w-5" />}
                    title="Shop Video"
                    text="Shop introduction"
                  />

                  <MediaFeature
                    icon={<Radio className="h-5 w-5" />}
                    title="Live"
                    text="Live commerce"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="border-t border-slate-100 bg-slate-50 px-5 py-8 sm:px-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                Shop Categories
              </p>

              <h3 className="mt-1 text-2xl font-black text-slate-900">
                Browse Products
              </h3>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "All Products",
                profile.category || "Shop Products",
                "Featured",
                "New Arrivals",
                "Offers",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* Product Catalog */}
          <section id="products" className="px-5 py-9 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                  Product Catalog
                </p>

                <h3 className="mt-1 text-2xl font-black text-slate-900">
                  Products & Services
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  আপনার পণ্যগুলো এখানে সুন্দরভাবে প্রদর্শিত হবে।
                </p>
              </div>

              {isOwner && (
                <button
                  type="button"
                  onClick={() =>
                    alert("Add Product system পরবর্তী ধাপে চালু করা হবে।")
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
                >
                  <Package className="h-4 w-4" />
                  Add Product
                </button>
              )}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <ProductPlaceholder
                title="Product Catalog"
                text="ছবি, নাম, দাম, stock ও বিস্তারিত তথ্যসহ পণ্য যুক্ত হবে।"
              />

              <ProductPlaceholder
                title="Featured Products"
                text="আপনার নির্বাচিত গুরুত্বপূর্ণ পণ্য এখানে প্রদর্শিত হবে।"
              />

              <ProductPlaceholder
                title="Special Offers"
                text="Discount, Deal ও promotional products এখানে থাকবে।"
              />

              <ProductPlaceholder
                title="New Arrivals"
                text="নতুন যুক্ত হওয়া পণ্য customers সহজেই দেখতে পারবে।"
              />
            </div>
          </section>

          {/* Offers */}
          <section
            id="offers"
            className="border-y border-slate-100 bg-orange-50/60 px-5 py-9 sm:px-6"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-orange-600">
                  Offers & Deals
                </p>

                <h3 className="mt-1 text-2xl font-black text-slate-900">
                  Special Offers
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                  Discount, bundle offer, seasonal offer, wholesale price এবং
                  customer deals ভবিষ্যতে এখান থেকেই পরিচালনা করা যাবে।
                </p>
              </div>

              <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
                <p className="text-sm font-black text-orange-700">
                  Offer System
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Product system চালু হলে আপনার Shop-এর বিশেষ অফারগুলো এখানে
                  live করা যাবে।
                </p>

                <button
                  type="button"
                  onClick={() =>
                    alert("Offer & Discount system পরবর্তী ধাপে যুক্ত হবে।")
                  }
                  className="mt-5 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-black text-white hover:bg-orange-600"
                >
                  Create Offer
                </button>
              </div>
            </div>
          </section>

          {/* Live Selling */}
          <section id="live" className="px-5 py-9 sm:px-6">
            <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
              <div className="grid gap-7 lg:grid-cols-[1fr_0.65fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-2 text-red-400">
                    <Radio className="h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Live Commerce
                    </span>
                  </div>

                  <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                    Live Selling
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                    Shop owner ভবিষ্যতে সরাসরি Live-এ product showcase, customer
                    interaction এবং live selling করতে পারবেন।
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Live Selling system পরবর্তী ধাপে চালু হবে।"
                      )
                    }
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-black text-white hover:bg-red-600"
                  >
                    <Radio className="h-4 w-4" />
                    Start Live
                  </button>
                </div>

                <div className="flex aspect-video items-center justify-center rounded-3xl border border-white/10 bg-white/5">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
                      <Radio className="h-8 w-8 text-red-400" />
                    </div>

                    <p className="mt-4 text-sm font-black text-white/60">
                      Live Room Coming Soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Future Commerce */}
          <section className="border-t border-slate-100 bg-slate-50 px-5 py-9 sm:px-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                Future Commerce
              </p>

              <h3 className="mt-1 text-2xl font-black text-slate-900">
                Shop → Order → Payment → Delivery
              </h3>

              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                একই Shop Website-এর ভেতরে ভবিষ্যতে পুরো commerce workflow যুক্ত
                হবে।
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <CommerceCard
                number="01"
                title="Buy & Cart"
                text="Customer product select করে cart ও order করতে পারবে।"
              />

              <CommerceCard
                number="02"
                title="Payment"
                text="বাস্তব payment এবং transaction workflow যুক্ত হবে।"
              />

              <CommerceCard
                number="03"
                title="Parcel"
                text="Order অনুযায়ী parcel ও delivery process পরিচালিত হবে।"
              />

              <CommerceCard
                number="04"
                title="Tracking"
                text="Customer order status ও delivery tracking দেখতে পারবে।"
              />
            </div>
          </section>

          {/* Shop Website Footer */}
          <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-6">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <Store className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="font-black text-slate-900">
                      {profile.display_name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Powered by Shromobazar
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm font-bold">
                <a
                  href="#gallery"
                  className="text-slate-600 hover:text-blue-600"
                >
                  Album
                </a>

                <a
                  href="#video"
                  className="text-slate-600 hover:text-purple-600"
                >
                  Video
                </a>

                <a
                  href="#products"
                  className="text-slate-600 hover:text-blue-600"
                >
                  Products
                </a>

                <a
                  href="#offers"
                  className="text-slate-600 hover:text-orange-600"
                >
                  Offers
                </a>

                <a
                  href="#live"
                  className="text-slate-600 hover:text-red-600"
                >
                  Live
                </a>

                <a
                  href="#contact"
                  className="text-slate-600 hover:text-blue-600"
                >
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </div>

        {/* Contact & Location */}
        <section
          id="contact"
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
              <Phone className="h-5 w-5 text-orange-600" />
            </div>

            <div>
              <h2 className="text-xl font-black">Contact & Location</h2>

              <p className="text-sm text-slate-500">
                Shop যোগাযোগের তথ্য
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ContactBox
              icon={<Phone className="h-5 w-5" />}
              label="Phone"
              value={profile.contact_number || "Not added"}
            />

            <ContactBox
              icon={<MapPin className="h-5 w-5" />}
              label="Address"
              value={profile.address || "Not added"}
            />

            <ContactBox
              icon={<Globe className="h-5 w-5" />}
              label="Shop Website"
              value="This page is your Shop Website"
            />
          </div>
        </section>

        {/* Outer Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-sm text-slate-500">
            Shromobazar Shop Profile
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
            <Link
              href="/marketplace"
              className="text-slate-600 hover:text-blue-600"
            >
              Marketplace
            </Link>

            <Link
              href="/open-your-shop"
              className="text-slate-600 hover:text-blue-600"
            >
              Open Your Shop
            </Link>

            <Link
              href="/"
              className="text-slate-600 hover:text-blue-600"
            >
              Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* =========================
   Small UI Components
========================= */

function StoreService({
  icon,
  title,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          {icon}
        </div>

        <div>
          <p className="font-black text-slate-900">{title}</p>
          <p className="mt-0.5 text-xs font-semibold text-slate-500">
            {text}
          </p>
        </div>
      </div>
    </button>
  );
}

function GalleryCard({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-orange-50 text-blue-500">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm transition group-hover:scale-105">
          {icon}
        </div>
      </div>

      <div className="p-4">
        <p className="font-black text-slate-900">{title}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function MediaFeature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-black text-slate-800">{title}</p>
        <p className="mt-0.5 text-xs font-semibold text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function ProductPlaceholder({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm">
          <Package className="h-7 w-7" />
        </div>
      </div>

      <h4 className="mt-4 font-black text-slate-900">{title}</h4>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>

      <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-500">
        Coming Soon
      </span>
    </div>
  );
}

function CommerceCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
        {number}
      </span>

      <h4 className="mt-4 font-black text-slate-900">{title}</h4>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>

      <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-black text-slate-500">
        Future Upgrade
      </span>
    </div>
  );
}

function ContactBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="text-orange-600">{icon}</div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words font-semibold text-slate-700">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}