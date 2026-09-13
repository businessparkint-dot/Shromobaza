"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Edit3,
  Globe,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Store,
  Truck,
  Warehouse,
} from "lucide-react";

import { supabase } from "@/lib/client";

type ShopProfile = {
  id: string;
  created_by: string;
  shop_name: string;
  shop_type: "retail" | "wholesale" | "retail_wholesale";
  category: string | null;
  location: string | null;
  delivery_area: string | null;
  minimum_order_quantity: number | null;
  has_warehouse: boolean;
  reseller_supply: boolean;
  logo_url: string | null;
  cover_url: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  verified: boolean;
  active: boolean;
  subscription_plan: string | null;
  subscription_status: string | null;
  created_at: string;
};

function shopTypeLabel(type: ShopProfile["shop_type"]) {
  if (type === "wholesale") return "Wholesale";
  if (type === "retail_wholesale") return "Retail + Wholesale";
  return "Retail";
}

function subscriptionLabel(
  plan: string | null,
  status: string | null
) {
  if (status === "active") {
    return plan ? plan.toUpperCase() : "ACTIVE";
  }

  return "FREE";
}

export default function ShopProfilePage() {
  const router = useRouter();
  const params = useParams();

  const rawId = params?.id;
  const profileId = Array.isArray(rawId) ? rawId[0] : rawId;

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
          .from("shop_profiles")
          .select(
            `
              id,
              created_by,
              shop_name,
              shop_type,
              category,
              location,
              delivery_area,
              minimum_order_quantity,
              has_warehouse,
              reseller_supply,
              logo_url,
              cover_url,
              description,
              phone,
              email,
              website_url,
              verified,
              active,
              subscription_plan,
              subscription_status,
              created_at
            `
          );

        if (profileId) {
          query = query.eq("id", profileId);
        } else {
          query = query.eq("created_by", user.id).order("created_at", {
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
            : "Shop profile load করা যায়নি।"
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
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-5 shadow-sm border border-slate-200">
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

  const isOwner = !!userId && profile.created_by === userId;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Marketplace
          </Link>

          <div className="flex items-center gap-2">
            {profile.verified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <BadgeCheck className="h-4 w-4" />
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                Verification Pending
              </span>
            )}

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              {subscriptionLabel(
                profile.subscription_plan,
                profile.subscription_status
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-blue-700 via-blue-600 to-orange-500 shadow-lg">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-orange-200 blur-3xl" />
          </div>

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/80 bg-white shadow-xl">
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt={profile.shop_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store className="h-12 w-12 text-blue-600" />
                  )}
                </div>

                <div className="text-white">
                  <p className="text-sm font-bold uppercase tracking-wider text-white/80">
                    My Shop
                  </p>

                  <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                    {profile.shop_name}
                  </h1>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
                      {shopTypeLabel(profile.shop_type)}
                    </span>

                    {profile.category && (
                      <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
                        {profile.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isOwner && (
                <Link
                  href={`/open-your-shop?edit=${profile.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-blue-700 shadow-lg hover:bg-slate-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Shop
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/marketplace"
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-black text-white shadow-sm hover:bg-blue-700"
          >
            <Store className="h-5 w-5" />
            Marketplace
          </Link>

          <button
            type="button"
            onClick={() =>
              alert(
                "Shop Website / Storefront পরবর্তী ধাপে তৈরি করা হবে।"
              )
            }
            className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-sm hover:bg-orange-600"
          >
            <Globe className="h-5 w-5" />
            Open Shop Website
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Product management পরবর্তী ধাপে যুক্ত করা হবে।"
              )
            }
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-black text-slate-800 shadow-sm hover:bg-slate-50"
          >
            <Package className="h-5 w-5" />
            Manage Products
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Subscription & premium tools পরবর্তী ধাপে যুক্ত করা হবে।"
              )
            }
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-black text-slate-800 shadow-sm hover:bg-slate-50"
          >
            <BadgeCheck className="h-5 w-5" />
            Premium Tools
          </button>
        </div>

        {/* Information */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* About */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-black">
                  Shop Information
                </h2>
                <p className="text-sm text-slate-500">
                  আপনার দোকানের মূল তথ্য
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<Store className="h-5 w-5" />}
                label="Shop Type"
                value={shopTypeLabel(profile.shop_type)}
              />

              <InfoItem
                icon={<Package className="h-5 w-5" />}
                label="Category"
                value={profile.category || "Not added"}
              />

              <InfoItem
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={profile.location || "Not added"}
              />

              <InfoItem
                icon={<Truck className="h-5 w-5" />}
                label="Delivery Area"
                value={profile.delivery_area || "Not added"}
              />

              <InfoItem
                icon={<Package className="h-5 w-5" />}
                label="Minimum Order"
                value={
                  profile.minimum_order_quantity
                    ? String(profile.minimum_order_quantity)
                    : "Not specified"
                }
              />

              <InfoItem
                icon={<Warehouse className="h-5 w-5" />}
                label="Warehouse"
                value={profile.has_warehouse ? "Available" : "Not added"}
              />
            </div>

            {profile.description && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black text-slate-900">
                  About the Shop
                </h3>

                <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-600">
                  {profile.description}
                </p>
              </div>
            )}
          </section>

          {/* Status */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Shop Status</h2>

            <div className="mt-5 space-y-4">
              <StatusRow
                label="Shop Status"
                active={profile.active}
                activeText="Active"
                inactiveText="Inactive"
              />

              <StatusRow
                label="Verification"
                active={profile.verified}
                activeText="Verified"
                inactiveText="Not Verified"
              />

              <StatusRow
                label="Warehouse"
                active={profile.has_warehouse}
                activeText="Available"
                inactiveText="Not Available"
              />

              <StatusRow
                label="Reseller Supply"
                active={profile.reseller_supply}
                activeText="Available"
                inactiveText="Not Available"
              />
            </div>

            <div className="mt-6 rounded-2xl bg-orange-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                Business Model
              </p>

              <p className="mt-2 text-sm font-bold leading-6 text-orange-900">
                Shromobazar uses a commission-free model.
                Premium visibility and subscription tools can be added later.
              </p>
            </div>
          </aside>
        </div>

        {/* Contact */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50">
              <Phone className="h-5 w-5 text-orange-600" />
            </div>

            <div>
              <h2 className="text-xl font-black">Contact & Web</h2>
              <p className="text-sm text-slate-500">
                Shop যোগাযোগের তথ্য
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ContactBox
              icon={<Phone className="h-5 w-5" />}
              label="Phone"
              value={profile.phone || "Not added"}
            />

            <ContactBox
              icon={<Globe className="h-5 w-5" />}
              label="Email"
              value={profile.email || "Not added"}
            />

            <ContactBox
              icon={<Globe className="h-5 w-5" />}
              label="Website"
              value={profile.website_url || "Coming soon"}
            />
          </div>
        </section>

        {/* Footer navigation */}
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

function InfoItem({
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
        <div className="text-blue-600">{icon}</div>

        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words font-bold text-slate-800">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  active,
  activeText,
  inactiveText,
}: {
  label: string;
  active: boolean;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <span className="font-semibold text-slate-600">{label}</span>

      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
          active
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {active && <CheckCircle2 className="h-3.5 w-3.5" />}
        {active ? activeText : inactiveText}
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

          <p className="mt-1 break-all font-semibold text-slate-700">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}