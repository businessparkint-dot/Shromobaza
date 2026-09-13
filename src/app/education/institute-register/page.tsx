"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  Globe2,
  GraduationCap,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type InstitutionCategory =
  | "Kindergarten"
  | "Primary"
  | "High School"
  | "College"
  | "Open University"
  | "National University"
  | "Public University"
  | "Private University"
  | "Medical"
  | "Engineering"
  | "Diploma"
  | "BSc"
  | "Skill Development"
  | "Language"
  | "Art & Drama";

const CATEGORIES: InstitutionCategory[] = [
  "Kindergarten",
  "Primary",
  "High School",
  "College",
  "Open University",
  "National University",
  "Public University",
  "Private University",
  "Medical",
  "Engineering",
  "Diploma",
  "BSc",
  "Skill Development",
  "Language",
  "Art & Drama",
];

const DISTRICTS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

type FormState = {
  name: string;
  category: InstitutionCategory | "";
  district: string;
  location: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  admission_available: boolean;
};

const INITIAL_FORM: FormState = {
  name: "",
  category: "",
  district: "",
  location: "",
  description: "",
  website: "",
  phone: "",
  email: "",
  admission_available: false,
};

export default function InstituteRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      setUserId(user?.id ?? null);
      setAuthLoading(false);
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  function updateField<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("শুধু image file upload করা যাবে।");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Logo সর্বোচ্চ 5MB হতে হবে।");
      return;
    }

    setLogoFile(file);
    setErrorMessage("");
    setSuccessMessage("");
  }

  function validateForm() {
    if (!form.name.trim()) {
      return "Institute name দিন।";
    }

    if (!form.category) {
      return "Institute category নির্বাচন করুন।";
    }

    if (!form.district) {
      return "District নির্বাচন করুন।";
    }

    if (!form.location.trim()) {
      return "Institute location দিন।";
    }

    if (!form.description.trim()) {
      return "Institute সম্পর্কে সংক্ষিপ্ত description দিন।";
    }

    if (form.email.trim()) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      );

      if (!emailOk) {
        return "সঠিক email address দিন।";
      }
    }

    return "";
  }

  async function uploadLogo(currentUserId: string) {
    if (!logoFile) return logoUrl || null;

    setUploadingLogo(true);

    try {
      const extension =
        logoFile.name.split(".").pop()?.toLowerCase() || "jpg";

      const path = `${currentUserId}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("institute-logos")
        .upload(path, logoFile, {
          upsert: false,
          contentType: logoFile.type,
        });

      if (uploadError) {
        console.error("Institute logo upload error:", uploadError);

        /*
          Logo storage bucket না থাকলেও institute registration
          বন্ধ করছি না। Profile text data save হবে।
        */
        return logoUrl || null;
      }

      const { data } = supabase.storage
        .from("institute-logos")
        .getPublicUrl(path);

      return data.publicUrl || null;
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!userId) {
      setErrorMessage(
        "Institute profile তৈরি করতে আগে Login করতে হবে।"
      );
      return;
    }

    setSaving(true);

    try {
      const finalLogoUrl = await uploadLogo(userId);

      const { data, error } = await supabase
        .from("institutes")
        .insert({
          name: form.name.trim(),
          category: form.category,
          district: form.district,
          location: form.location.trim(),
          description: form.description.trim(),
          website: form.website.trim() || null,
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          logo_url: finalLogoUrl,
          verified: false,
          active: true,
          admission_available: form.admission_available,
          created_by: userId,
        })
        .select("id")
        .single();

      if (error) {
        console.error("Institute registration error:", error);

        if (
          error.code === "42501" ||
          error.message.toLowerCase().includes("permission")
        ) {
          setErrorMessage(
            "Institute save করার permission নেই। Supabase institutes table-এর RLS/INSERT policy check করুন।"
          );
        } else {
          setErrorMessage(
            error.message ||
              "Institute profile save করা যায়নি।"
          );
        }

        return;
      }

      if (!data?.id) {
        setErrorMessage(
          "Institute save হয়েছে কি না নিশ্চিত করা যাচ্ছে না।"
        );
        return;
      }

      setSuccessMessage(
        "Institute profile সফলভাবে তৈরি হয়েছে। এখন profile দেখা যাবে।"
      );

      setTimeout(() => {
        router.push(
          `/education/institute-profile?id=${data.id}`
        );
      }, 900);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "Unexpected error হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="h-10 w-56 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-6 h-[600px] animate-pulse rounded-3xl bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-12">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <Building2 className="h-8 w-8" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-slate-900">
              Institute Profile খুলতে Login করুন
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              একটি institute profile তৈরি করার আগে আপনার
              Shromobazar account-এ login থাকতে হবে।
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="flex flex-1 items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600"
              >
                Login
              </Link>

              <Link
                href="/education"
                className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Education
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Education
          </Link>

          <div className="hidden items-center gap-2 text-xs font-bold text-slate-400 sm:flex">
            <GraduationCap className="h-4 w-4" />
            Institute Registration
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-white">
              <Sparkles className="h-4 w-4 text-orange-300" />
              Shromobazar Education
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Create Institute Profile
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              আপনার Institute-এর official information এক জায়গায়
              দিন। পরে শিক্ষার্থীরা category, location ও institute
              profile-এর মাধ্যমে সহজে খুঁজে পাবে।
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* BASIC INFORMATION */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeader
                icon={<Building2 className="h-5 w-5" />}
                title="Basic Institute Information"
                text="Institute-এর মূল পরিচয়"
              />

              <div className="mt-7 grid gap-5">
                <Field
                  label="Institute Name"
                  required
                  value={form.name}
                  onChange={(value) =>
                    updateField("name", value)
                  }
                  placeholder="যেমন: ABC School & College"
                />

                <div className="grid gap-5 md:grid-cols-2">
                  <SelectField
                    label="Institute Category"
                    required
                    value={form.category}
                    onChange={(value) =>
                      updateField(
                        "category",
                        value as InstitutionCategory
                      )
                    }
                    options={CATEGORIES.map((category) => ({
                      value: category,
                      label: category,
                    }))}
                    placeholder="Category নির্বাচন করুন"
                  />

                  <SelectField
                    label="District"
                    required
                    value={form.district}
                    onChange={(value) =>
                      updateField("district", value)
                    }
                    options={DISTRICTS.map((district) => ({
                      value: district,
                      label: district,
                    }))}
                    placeholder="District নির্বাচন করুন"
                  />
                </div>

                <Field
                  label="Location / Area"
                  required
                  value={form.location}
                  onChange={(value) =>
                    updateField("location", value)
                  }
                  placeholder="যেমন: Mirpur, Dhaka"
                  icon={<MapPin className="h-4 w-4" />}
                />

                <TextAreaField
                  label="About Institute"
                  required
                  value={form.description}
                  onChange={(value) =>
                    updateField("description", value)
                  }
                  placeholder="Institute-এর শিক্ষা কার্যক্রম, বিশেষত্ব, campus বা services সম্পর্কে সংক্ষেপে লিখুন..."
                  rows={6}
                />
              </div>
            </section>

            {/* CONTACT */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeader
                icon={<Phone className="h-5 w-5" />}
                title="Contact & Official Information"
                text="শিক্ষার্থীরা যেন সরাসরি official source-এ যেতে পারে"
              />

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                  placeholder="01XXXXXXXXX"
                  icon={<Phone className="h-4 w-4" />}
                />

                <Field
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                  placeholder="info@example.com"
                  icon={<Mail className="h-4 w-4" />}
                />

                <div className="md:col-span-2">
                  <Field
                    label="Official Website"
                    value={form.website}
                    onChange={(value) =>
                      updateField("website", value)
                    }
                    placeholder="https://example.edu.bd"
                    icon={<Globe2 className="h-4 w-4" />}
                  />
                </div>
              </div>
            </section>

            {/* LOGO */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeader
                icon={<ImagePlus className="h-5 w-5" />}
                title="Institute Logo"
                text="Optional — পরে upload করলেও হবে"
              />

              <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                  {logoFile ? (
                    <img
                      src={URL.createObjectURL(logoFile)}
                      alt="Institute logo preview"
                      className="h-full w-full object-cover"
                    />
                  ) : logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Institute logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-10 w-10 text-slate-300" />
                  )}
                </div>

                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    Choose Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-2 text-xs text-slate-500">
                    JPG, PNG বা WebP · সর্বোচ্চ 5MB
                  </p>

                  {logoFile && (
                    <button
                      type="button"
                      onClick={() => setLogoFile(null)}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-600"
                    >
                      <X className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* ADMISSION */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <SectionHeader
                icon={<GraduationCap className="h-5 w-5" />}
                title="Admission"
                text="বর্তমানে admission information available কি না"
              />

              <button
                type="button"
                onClick={() =>
                  updateField(
                    "admission_available",
                    !form.admission_available
                  )
                }
                className={[
                  "mt-7 flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition",
                  form.admission_available
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl",
                      form.admission_available
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-500",
                    ].join(" ")}
                  >
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Admission Available
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Students-কে জানাতে পারবেন যে admission
                      information বর্তমানে available।
                    </p>
                  </div>
                </div>

                <div
                  className={[
                    "flex h-6 w-11 items-center rounded-full p-1 transition",
                    form.admission_available
                      ? "bg-emerald-500"
                      : "bg-slate-300",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "h-4 w-4 rounded-full bg-white shadow transition",
                      form.admission_available
                        ? "translate-x-5"
                        : "translate-x-0",
                    ].join(" ")}
                  />
                </div>
              </button>
            </section>

            {/* SECURITY */}
            <section className="rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-black text-slate-900">
                    Verification
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    নতুন institute profile প্রথমে
                    <strong> Unverified</strong> থাকবে। Admin
                    verification-এর পরে verified badge দেওয়া হবে।
                    User নিজে verified status দিতে পারবে না।
                  </p>
                </div>
              </div>
            </section>

            {/* MESSAGES */}
            {errorMessage && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <X className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="font-semibold">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="font-semibold">{successMessage}</p>
              </div>
            )}

            {/* SUBMIT */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Link
                href="/education"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving || uploadingLogo}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving || uploadingLogo ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Institute Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
          <p className="text-sm font-black text-slate-800">
            Shromobazar Education
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Learn → Skill → Opportunity → Work
          </p>
        </div>
      </footer>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* UI COMPONENTS                                                              */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-black text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">
        {label}
        {required && (
          <span className="ml-1 text-orange-500">*</span>
        )}
      </span>

      <div className="relative mt-2">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={[
            "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100",
            icon ? "pl-11" : "",
          ].join(" ")}
        />
      </div>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">
        {label}
        {required && (
          <span className="ml-1 text-orange-500">*</span>
        )}
      </span>

      <div className="relative mt-2">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-800">
        {label}
        {required && (
          <span className="ml-1 text-orange-500">*</span>
        )}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}