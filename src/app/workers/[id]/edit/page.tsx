"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  UserRound,
} from "lucide-react";

import { supabase } from "@/lib/client";

type Worker = {
  id: string;
  profileId: string;
  name: string;
  phone: string;
  avatarUrl: string;
  category: string;
  subCategory: string;
  experience: string;
  skills: string[];
  district: string;
  location: string;
  about: string;
};

export default function EditWorkerPage() {
  const params = useParams();
  const router = useRouter();

  const workerId = String(params.id);

  const [worker, setWorker] =
    useState<Worker | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [photoPreview, setPhotoPreview] =
    useState("");

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    district: "",
    category: "",
    subCategory: "",
    experience: "",
    skills: "",
    about: "",
  });

  useEffect(() => {
    async function loadWorker() {
      try {
        setLoading(true);

        const response =
          await fetch(
            `/api/workers/${workerId}`,
            {
              cache: "no-store",
            }
          );

        const result =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error ||
              "Worker profile load করা যায়নি।"
          );
        }

        const data = result.worker;

        setWorker(data);

        setForm({
          name: data.name || "",
          phone: data.phone || "",
          location: data.location || "",
          district: data.district || "",
          category: data.category || "",
          subCategory:
            data.subCategory || "",
          experience:
            data.experience || "",
          skills:
            Array.isArray(data.skills)
              ? data.skills.join(", ")
              : "",
          about: data.about || "",
        });

        setPhotoPreview(
          data.avatarUrl || ""
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Profile load করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorker();
  }, [workerId]);

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handlePhotoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(
        "শুধু image file নির্বাচন করুন।"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile photo সর্বোচ্চ 5MB হতে পারবে।"
      );
      return;
    }

    setError("");
    setPhotoFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setPhotoPreview(previewUrl);
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const {
        data: sessionData,
      } = await supabase.auth.getSession();

      const accessToken =
        sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error(
          "আপনার Login session পাওয়া যায়নি। আবার Login করুন।"
        );
      }

      const formData =
        new FormData();

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "phone",
        form.phone
      );

      formData.append(
        "location",
        form.location
      );

      formData.append(
        "district",
        form.district
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "subCategory",
        form.subCategory
      );

      formData.append(
        "experience",
        form.experience
      );

      formData.append(
        "skills",
        form.skills
      );

      formData.append(
        "about",
        form.about
      );

      if (photoFile) {
        formData.append(
          "photo",
          photoFile
        );
      }

      const response =
        await fetch(
          `/api/workers/${workerId}/edit`,
          {
            method: "PATCH",
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "Profile update করা যায়নি।"
        );
      }

      setMessage(
        "Profile সফলভাবে update হয়েছে।"
      );

      setTimeout(() => {
        router.push(
          `/workers/${workerId}`
        );

        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Profile update করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 h-[600px] animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </main>
    );
  }

  if (error && !worker) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-red-600">
            {error}
          </p>

          <Link
            href={`/workers/${workerId}`}
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-bold text-white"
          >
            Profile-এ ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/workers/${workerId}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Profile-এ ফিরে যান
        </Link>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-6 py-8 sm:px-10">
            <h1 className="text-3xl font-black text-white sm:text-4xl">
              Edit Worker Profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              আপনার profile information এবং profile photo update করুন।
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8 p-6 sm:p-10"
          >
            {/* PHOTO */}
            <section>
              <h2 className="text-lg font-black text-slate-900">
                Profile Photo
              </h2>

              <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-xl ring-1 ring-slate-200">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Worker profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound className="h-14 w-14 text-slate-400" />
                    )}
                  </div>

                  <label
                    htmlFor="profile-photo"
                    className="absolute bottom-1 right-1 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:bg-emerald-700"
                  >
                    <Camera className="h-5 w-5" />
                  </label>

                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    আপনার Profile Photo
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    JPG, PNG, WEBP • সর্বোচ্চ 5MB
                  </p>

                  <label
                    htmlFor="profile-photo"
                    className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-100"
                  >
                    <Camera className="h-4 w-4" />
                    Photo Change করুন
                  </label>
                </div>
              </div>
            </section>

            {/* BASIC INFORMATION */}
            <section>
              <h2 className="text-lg font-black text-slate-900">
                Basic Information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field
                  label="পূর্ণ নাম"
                  value={form.name}
                  onChange={(value) =>
                    updateField("name", value)
                  }
                  placeholder="আপনার নাম"
                  required
                />

                <Field
                  label="ফোন নম্বর"
                  value={form.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                  placeholder="01XXXXXXXXX"
                />

                <Field
                  label="অবস্থান"
                  value={form.location}
                  onChange={(value) =>
                    updateField("location", value)
                  }
                  placeholder="যেমন: Bagerhat"
                />

                <Field
                  label="জেলা"
                  value={form.district}
                  onChange={(value) =>
                    updateField("district", value)
                  }
                  placeholder="যেমন: Bagerhat"
                />
              </div>
            </section>

            {/* PROFESSIONAL */}
            <section>
              <h2 className="text-lg font-black text-slate-900">
                Professional Information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field
                  label="ক্যাটাগরি / Profession"
                  value={form.category}
                  onChange={(value) =>
                    updateField("category", value)
                  }
                  placeholder="যেমন: Electrician"
                />

                <Field
                  label="Sub-category"
                  value={form.subCategory}
                  onChange={(value) =>
                    updateField(
                      "subCategory",
                      value
                    )
                  }
                  placeholder="যেমন: House Wiring"
                />

                <Field
                  label="অভিজ্ঞতা"
                  value={form.experience}
                  onChange={(value) =>
                    updateField(
                      "experience",
                      value
                    )
                  }
                  placeholder="যেমন: 5 years"
                />

                <Field
                  label="Skills"
                  value={form.skills}
                  onChange={(value) =>
                    updateField(
                      "skills",
                      value
                    )
                  }
                  placeholder="যেমন: Wiring, Repair, Maintenance"
                />
              </div>
            </section>

            {/* ABOUT */}
            <section>
              <h2 className="text-lg font-black text-slate-900">
                About
              </h2>

              <textarea
                value={form.about}
                onChange={(event) =>
                  updateField(
                    "about",
                    event.target.value
                  )
                }
                rows={5}
                placeholder="নিজের কাজ, অভিজ্ঞতা ও দক্ষতা সম্পর্কে লিখুন..."
                className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />
            </section>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                {message}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <Link
                href={`/workers/${workerId}`}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 px-6 font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 font-black text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      <input
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />
    </label>
  );
}