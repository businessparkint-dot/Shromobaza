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
  RefreshCw,
  BriefcaseBusiness,
  Phone,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/client";

type BusinessType =
  | "company"
  | "office_consultancy"
  | "agency"
  | "online_business";

type BusinessProfile = {
  id: string;
  created_by: string;
  business_name: string;
  business_type: BusinessType;
  category: string | null;
  location: string | null;
  service_area: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website_url: string | null;
  logo_url: string | null;
  cover_url: string | null;
  verified: boolean;
  active: boolean;
  subscription_plan: string | null;
  subscription_status: string | null;
  created_at: string;
};

function businessTypeLabel(type: BusinessType) {
  switch (type) {
    case "office_consultancy":
      return "Office / Consultancy";
    case "agency":
      return "Agency";
    case "online_business":
      return "Online Business";
    default:
      return "Company";
  }
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

export default function BusinessProfilePage() {
  const router = useRouter();
  const params = useParams();

  const rawId = params?.id;
  const profileId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadBusinessProfile() {
      setLoading(true);
      setError("");

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace(
            `/login?redirect=/open-your-office/profile${
              profileId ? `?id=${profileId}` : ""
            }`
          );
          return;
        }

        if (!mounted) return;

        setUserId(user.id);

        let query = supabase
          .from("business_profiles")
          .select(
            `
              id,
              created_by,
              business_name,
              business_type,
              category,
              location,
              service_area,
              description,
              phone,
              email,
              website_url,
              logo_url,
              cover_url,
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
          query = query
            .eq("created_by", user.id)
            .order("created_at", {
              ascending: false,
            });
        }

        const { data, error: fetchError } =
          await query.maybeSingle();

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error(
            "Business Profile পাওয়া যায়নি।"
          );
        }

        if (!mounted) return;

        setProfile(data as BusinessProfile);
      } catch (err: unknown) {
        console.error(
          "Business profile error:",
          err
        );

        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Business Profile load করা যায়নি।"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBusinessProfile();

    return () => {
      mounted = false;
    };
  }, [profileId, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
          <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />

          <span className="font-semibold text-slate-700">
            Business Profile লোড হচ্ছে...
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
            href="/open-your-office"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Business Registration
          </Link>

          <div className="mt-8 rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <Building2 className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Business Profile পাওয়া যায়নি
            </h1>

            <p className="mt-2 text-slate-600">
              {error ||
                "এই Business Profile বর্তমানে পাওয়া যাচ্ছে না।"}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <Link
                href="/open-your-office"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                <Building2 className="h-4 w-4" />
                Open Your Office
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const isOwner =
    !!userId && profile.created_by === userId;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link
            href="/global-business"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Business
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
        {/* Hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-950 via-blue-900 to-blue-600 shadow-lg">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-300 blur-3xl" />
            <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-orange-300 blur-3xl" />
          </div>

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/80 bg-white shadow-xl">
                  {profile.logo_url ? (
                    <img
                      src={profile.logo_url}
                      alt={profile.business_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-12 w-12 text-blue-600" />
                  )}
                </div>

                <div className="text-white">
                  <p className="text-sm font-bold uppercase tracking-wider text-white/70">
                    My Business
                  </p>

                  <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                    {profile.business_name}
                  </h1>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold backdrop-blur">
                      {businessTypeLabel(
                        profile.business_type
                      )}
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
                  href={`/open-your-office?edit=${profile.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-black text-blue-700 shadow-lg hover:bg-slate-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Business
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/global-business"
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-black text-white shadow-sm hover:bg-blue-700"
          >
            <Building2 className="h-5 w-5" />
            Global Business
          </Link>

          <button
            type="button"
            onClick={() =>
              alert(
                "Business Website পরবর্তী ধাপে তৈরি করা হবে।"
              )
            }
            className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-4 font-black text-white shadow-sm hover:bg-orange-600"
          >
            <Globe className="h-5 w-5" />
            Open Business Website
          </button>

          <button
            type="button"
            onClick={() =>
              alert(
                "Services & Team management পরবর্তী ধাপে যুক্ত করা হবে।"
              )
            }
            className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-black text-slate-800 shadow-sm hover:bg-slate-50"
          >
            <BriefcaseBusiness className="h-5 w-5" />
            Manage Services
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
          {/* Business information */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-black">
                  Business Information
                </h2>

                <p className="text-sm text-slate-500">
                  আপনার ব্যবসা বা অফিসের মূল তথ্য
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={
                  <Building2 className="h-5 w-5" />
                }
                label="Business Type"
                value={businessTypeLabel(
                  profile.business_type
                )}
              />

              <InfoItem
                icon={
                  <BriefcaseBusiness className="h-5 w-5" />
                }
                label="Category"
                value={
                  profile.category || "Not added"
                }
              />

              <InfoItem
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={
                  profile.location || "Not added"
                }
              />

              <InfoItem
                icon={<Users className="h-5 w-5" />}
                label="Service Area"
                value={
                  profile.service_area ||
                  "Not added"
                }
              />
            </div>

            {profile.description && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                <h3 className="font-black text-slate-900">
                  About the Business
                </h3>

                <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-600">
                  {profile.description}
                </p>
              </div>
            )}
          </section>

          {/* Status */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">
              Business Status
            </h2>

            <div className="mt-5 space-y-4">
              <StatusRow
                label="Business Status"
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

              <div className="border-b border-slate-100 pb-4">
                <p className="text-sm font-semibold text-slate-500">
                  Business Type
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {businessTypeLabel(
                    profile.business_type
                  )}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Subscription
                </p>

                <p className="mt-1 font-bold text-blue-700">
                  {subscriptionLabel(
                    profile.subscription_plan,
                    profile.subscription_status
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-orange-50 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                Business Model
              </p>

              <p className="mt-2 text-sm font-bold leading-6 text-orange-900">
                Shromobazar uses a commission-free model.
                Premium visibility and subscription tools
                can be added later.
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
              <h2 className="text-xl font-black">
                Contact & Web
              </h2>

              <p className="text-sm text-slate-500">
                Business যোগাযোগের তথ্য
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ContactBox
              icon={<Phone className="h-5 w-5" />}
              label="Phone"
              value={
                profile.phone || "Not added"
              }
            />

            <ContactBox
              icon={<Globe className="h-5 w-5" />}
              label="Email"
              value={
                profile.email || "Not added"
              }
            />

            <ContactBox
              icon={<Globe className="h-5 w-5" />}
              label="Website"
              value={
                profile.website_url ||
                "Coming soon"
              }
            />
          </div>
        </section>

        {/* Next stage */}
        <section className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-blue-600">
                Next Step
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900">
                আপনার নিজের Business Website
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Business Profile-এর পর আপনার নিজস্ব
                Business Website তৈরি হবে, যেখানে
                Services, Team, Contact, Business
                information এবং customer leads রাখা যাবে।
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Business Website builder পরবর্তী ধাপে তৈরি করা হবে।"
                )
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-black text-white hover:bg-blue-700"
            >
              <Globe className="h-5 w-5" />
              Website Builder
            </button>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-sm text-slate-500">
            Shromobazar Business Profile
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
            <Link
              href="/global-business"
              className="text-slate-600 hover:text-blue-600"
            >
              Global Business
            </Link>

            <Link
              href="/open-your-office"
              className="text-slate-600 hover:text-blue-600"
            >
              Open Your Office
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
        <div className="text-blue-600">
          {icon}
        </div>

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
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <span className="font-semibold text-slate-600">
        {label}
      </span>

      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
          active
            ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {active && (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}

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
        <div className="text-orange-600">
          {icon}
        </div>

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