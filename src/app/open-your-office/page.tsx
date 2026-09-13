"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Globe2,
  Laptop,
  MapPin,
  Users,
} from "lucide-react";

import { supabase } from "@/lib/client";

const businessTypes = [
  {
    value: "company",
    title: "Company / Business",
    description: "নিজের কোম্পানি বা ব্যবসা পরিচালনা করুন",
    icon: Building2,
  },
  {
    value: "office",
    title: "Office / Consultancy",
    description:
      "Consultancy, professional office বা service office",
    icon: BriefcaseBusiness,
  },
  {
    value: "agency",
    title: "Agency",
    description:
      "Agency, manpower, marketing বা service agency",
    icon: Users,
  },
  {
    value: "online",
    title: "Online Business",
    description:
      "Digital বা online-based business পরিচালনা করুন",
    icon: Laptop,
  },
];

const businessCategories = [
  "Construction",
  "Manpower & Recruitment",
  "Engineering",
  "Architecture",
  "Legal",
  "Medical & Healthcare",
  "Education & Training",
  "IT & Software",
  "Digital Marketing",
  "Consultancy",
  "Travel & Tourism",
  "Hajj & Umrah",
  "Visa Services",
  "Import & Export",
  "Trading",
  "Real Estate",
  "Food & Restaurant",
  "Management",
  "Events",
  "Media & Entertainment",
  "Agriculture",
  "Manufacturing",
  "Other",
];

export default function OpenYourOfficePage() {
  const router = useRouter();

  const [businessType, setBusinessType] = useState("company");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [serviceArea, setServiceArea] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanBusinessName = businessName.trim();
    const cleanCategory = category.trim();
    const cleanLocation = location.trim();
    const cleanServiceArea = serviceArea.trim();
    const cleanDescription = description.trim();
    const cleanWebsite = website.trim();

    // ---------------------------------------------
    // BASIC VALIDATION
    // ---------------------------------------------

    if (!cleanBusinessName) {
      setErrorMessage("Business / Office-এর নাম দিন।");
      return;
    }

    if (!cleanCategory) {
      setErrorMessage(
        "Business Category নির্বাচন করুন।"
      );
      return;
    }

    if (!cleanLocation) {
      setErrorMessage(
        "Office / Business Location দিন।"
      );
      return;
    }

    // ---------------------------------------------
    // MAP UI VALUE → DATABASE VALUE
    // ---------------------------------------------

    const databaseBusinessType =
      businessType === "office"
        ? "office_consultancy"
        : businessType === "online"
          ? "online_business"
          : businessType;

    try {
      setSubmitting(true);

      // ---------------------------------------------
      // 1. CHECK LOGIN
      // ---------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        setErrorMessage(
          "Business Registration করতে আগে Login করুন।"
        );

        setSubmitting(false);

        setTimeout(() => {
          router.push(
            `/login?redirect=${encodeURIComponent(
              "/open-your-office"
            )}`
          );
        }, 900);

        return;
      }

      // ---------------------------------------------
      // 2. INSERT BUSINESS PROFILE
      // ---------------------------------------------

      const { data, error } = await supabase
        .from("business_profiles")
        .insert({
          created_by: user.id,

          business_name: cleanBusinessName,

          business_type: databaseBusinessType,

          category: cleanCategory,

          location: cleanLocation,

          service_area:
            cleanServiceArea || null,

          description:
            cleanDescription || null,

          website_url:
            cleanWebsite || null,

          verified: false,

          active: true,

          subscription_plan: "free",

          subscription_status: "inactive",
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.id) {
        throw new Error(
          "Business Registration তৈরি হয়েছে, কিন্তু Business ID পাওয়া যায়নি।"
        );
      }

      // ---------------------------------------------
      // 3. SUCCESS
      // ---------------------------------------------

      setSuccessMessage(
        "আপনার Business / Office Registration সফলভাবে সম্পন্ন হয়েছে।"
      );

      // ---------------------------------------------
      // 4. REDIRECT TO BUSINESS PROFILE
      // ---------------------------------------------

      setTimeout(() => {
        router.push(
          `/open-your-office/profile?id=${encodeURIComponent(
            data.id
          )}`
        );
      }, 1000);
    } catch (error) {
      console.error(
        "Business registration error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Business Registration সম্পন্ন করা যায়নি।";

      setErrorMessage(message);
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="bg-[#081B3A] px-4 pb-12 pt-7 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/global-business"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Business-এ ফিরে যান
          </Link>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
              <Building2 size={16} />
              Open Your Office
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              আপনার নিজের Office / Business খুলুন
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Company, Consultancy, Agency, Professional Office
              অথবা Online Business—আপনার ব্যবসার ধরন অনুযায়ী
              Business Profile তৈরি করুন।
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <form onSubmit={handleSubmit}>
            {/* BUSINESS TYPE */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step 01
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Business-এর ধরন নির্বাচন করুন
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  আপনার প্রতিষ্ঠানের সবচেয়ে কাছের ধরন নির্বাচন
                  করুন।
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {businessTypes.map((type) => {
                  const Icon = type.icon;
                  const active =
                    businessType === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setBusinessType(type.value)
                      }
                      className={`relative rounded-2xl border p-5 text-left transition ${
                        active
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          active
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon size={23} />
                      </div>

                      <h3 className="mt-4 font-bold text-slate-900">
                        {type.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {type.description}
                      </p>

                      {active && (
                        <CheckCircle2
                          className="absolute bottom-4 right-4 text-blue-600"
                          size={20}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* BUSINESS INFORMATION */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step 02
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Business / Office Information
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* BUSINESS NAME */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Business / Office Name
                  </label>

                  <input
                    value={businessName}
                    onChange={(e) =>
                      setBusinessName(e.target.value)
                    }
                    required
                    placeholder="যেমন: Business Park International"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Business Category
                  </label>

                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value)
                      }
                      required
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">
                        Business Category নির্বাচন করুন
                      </option>

                      {businessCategories.map((item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* LOCATION */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Office / Business Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={location}
                      onChange={(e) =>
                        setLocation(e.target.value)
                      }
                      required
                      placeholder="জেলা / শহর / এলাকা"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* SERVICE AREA */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Service Area
                  </label>

                  <input
                    value={serviceArea}
                    onChange={(e) =>
                      setServiceArea(e.target.value)
                    }
                    placeholder="যেমন: Bangladesh / Dhaka / Global"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Business সম্পর্কে সংক্ষিপ্ত বিবরণ
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    rows={5}
                    placeholder="আপনার প্রতিষ্ঠান কী কাজ করে, কী ধরনের service/product দেয়..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* WEBSITE */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Existing Website
                    <span className="ml-2 font-normal text-slate-400">
                      Optional
                    </span>
                  </label>

                  <input
                    value={website}
                    onChange={(e) =>
                      setWebsite(e.target.value)
                    }
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            {/* DYNAMIC DIRECTION */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  {businessType === "online" ? (
                    <Laptop size={24} />
                  ) : businessType === "agency" ? (
                    <Users size={24} />
                  ) : businessType === "office" ? (
                    <BriefcaseBusiness size={24} />
                  ) : (
                    <Building2 size={24} />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Smart Business Setup
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {businessType === "online"
                      ? "Online Business"
                      : businessType === "agency"
                        ? "Agency Business"
                        : businessType === "office"
                          ? "Professional Office / Consultancy"
                          : "Company / Business"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    আপনার নির্বাচিত Business Type অনুযায়ী
                    পরবর্তী ধাপে প্রয়োজনীয় profile fields,
                    services এবং business information সাজানো
                    হবে।
                  </p>
                </div>
              </div>
            </section>

            {/* WEBSITE ECOSYSTEM */}
            <section className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5 sm:p-7">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center gap-4">
                  <Building2
                    className="text-blue-600"
                    size={28}
                  />

                  <div>
                    <p className="font-bold text-slate-900">
                      Business Profile
                    </p>

                    <p className="text-xs text-slate-500">
                      প্রতিষ্ঠানের পরিচিতি ও তথ্য
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <BriefcaseBusiness
                    className="text-blue-600"
                    size={28}
                  />

                  <div>
                    <p className="font-bold text-slate-900">
                      Services & Projects
                    </p>

                    <p className="text-xs text-slate-500">
                      Service, project ও কাজের তথ্য
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Globe2
                    className="text-blue-600"
                    size={28}
                  />

                  <div>
                    <p className="font-bold text-slate-900">
                      Business Website
                    </p>

                    <p className="text-xs text-slate-500">
                      নিজের Business Website / Public Page
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ERROR */}
            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            {/* SUCCESS */}
            {successMessage && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={19} />
                  {successMessage}
                </div>
              </div>
            )}

            {/* SUBMIT */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/global-business"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                বাতিল
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Registration হচ্ছে..."
                  : "Business Registration শুরু করুন"}

                {!submitting && (
                  <ArrowRight size={17} />
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}