"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type ScholarshipStatus =
  | "Draft"
  | "Preparing"
  | "Applied"
  | "Under Review"
  | "Completed";

type Scholarship = {
  id: string;
  user_id: string;
  scholarship_title: string;
  provider_name: string | null;
  scholarship_type: string | null;
  application_url: string | null;
  deadline: string | null;
  status: ScholarshipStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ScholarshipForm = {
  scholarshipTitle: string;
  providerName: string;
  scholarshipType: string;
  applicationUrl: string;
  deadline: string;
  status: ScholarshipStatus;
  notes: string;
};

const EMPTY_FORM: ScholarshipForm = {
  scholarshipTitle: "",
  providerName: "",
  scholarshipType: "",
  applicationUrl: "",
  deadline: "",
  status: "Draft",
  notes: "",
};

const STATUS_OPTIONS: ScholarshipStatus[] = [
  "Draft",
  "Preparing",
  "Applied",
  "Under Review",
  "Completed",
];

const OFFICIAL_LINKS = [
  {
    title: "PMEAT",
    text: "Primary and Mass Education related scholarship information",
    url: "https://pmeat.gov.bd/",
  },
  {
    title: "Education Ministry",
    text: "Education scholarship and official information",
    url: "https://shed.gov.bd/",
  },
];

function statusClass(status: ScholarshipStatus) {
  switch (status) {
    case "Completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Applied":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "Under Review":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "Preparing":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export default function ScholarshipPage() {
  const router = useRouter();

  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [form, setForm] =
    useState<ScholarshipForm>(EMPTY_FORM);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadScholarships = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("education_scholarship_applications")
        .select(
          `
            id,
            user_id,
            scholarship_title,
            provider_name,
            scholarship_type,
            application_url,
            deadline,
            status,
            notes,
            created_at,
            updated_at
          `
        )
        .eq("user_id", session.user.id)
        .order("deadline", {
          ascending: true,
          nullsFirst: false,
        })
        .order("created_at", {
          ascending: false,
        });

      if (fetchError) {
        throw fetchError;
      }

      setScholarships(
        (data ?? []) as Scholarship[]
      );
    } catch (err) {
      console.error(
        "Scholarship load error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Scholarship data load করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (item: Scholarship) => {
    setEditingId(item.id);

    setForm({
      scholarshipTitle:
        item.scholarship_title ?? "",
      providerName: item.provider_name ?? "",
      scholarshipType:
        item.scholarship_type ?? "",
      applicationUrl:
        item.application_url ?? "",
      deadline: item.deadline ?? "",
      status: item.status,
      notes: item.notes ?? "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const title =
        form.scholarshipTitle.trim();

      if (!title) {
        throw new Error(
          "Scholarship title দিন।"
        );
      }

      const payload = {
        scholarship_title: title,
        provider_name:
          form.providerName.trim() || null,
        scholarship_type:
          form.scholarshipType.trim() || null,
        application_url:
          form.applicationUrl.trim() || null,
        deadline: form.deadline || null,
        status: form.status,
        notes: form.notes.trim() || null,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error: updateError } =
          await supabase
            .from(
              "education_scholarship_applications"
            )
            .update(payload)
            .eq("id", editingId)
            .eq("user_id", session.user.id);

        if (updateError) {
          throw updateError;
        }

        setSuccess(
          "Scholarship record update হয়েছে।"
        );
      } else {
        const { error: insertError } =
          await supabase
            .from(
              "education_scholarship_applications"
            )
            .insert({
              ...payload,
              user_id: session.user.id,
            });

        if (insertError) {
          throw insertError;
        }

        setSuccess(
          "Scholarship record save হয়েছে।"
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);

      await loadScholarships();
    } catch (err) {
      console.error(
        "Scholarship save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Scholarship save করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "এই Scholarship record টি delete করতে চান?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const { error: deleteError } =
        await supabase
          .from(
            "education_scholarship_applications"
          )
          .delete()
          .eq("id", id)
          .eq("user_id", session.user.id);

      if (deleteError) {
        throw deleteError;
      }

      setSuccess(
        "Scholarship record delete হয়েছে।"
      );

      await loadScholarships();
    } catch (err) {
      console.error(
        "Scholarship delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Scholarship delete করা যায়নি।"
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/education"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Education
            </Link>

            <h1 className="text-2xl font-bold text-slate-900">
              Scholarship
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Scholarship খুঁজুন, application track করুন এবং
              deadline মনে রাখুন।
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Scholarship
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <section className="mb-6 grid gap-4 sm:grid-cols-2">
          {OFFICIAL_LINKS.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>

                <ExternalLink className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:text-slate-700" />
              </div>
            </a>
          ))}
        </section>

        {showForm && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? "Edit Scholarship"
                    : "Add Scholarship"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Application information আপনার account-এ save হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Scholarship Title
                </label>

                <input
                  type="text"
                  required
                  value={form.scholarshipTitle}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      scholarshipTitle:
                        e.target.value,
                    }))
                  }
                  placeholder="যেমন: Government Scholarship"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Provider
                </label>

                <input
                  type="text"
                  value={form.providerName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      providerName:
                        e.target.value,
                    }))
                  }
                  placeholder="Provider / Organization"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Scholarship Type
                </label>

                <input
                  type="text"
                  value={form.scholarshipType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      scholarshipType:
                        e.target.value,
                    }))
                  }
                  placeholder="যেমন: Merit / Need Based"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Deadline
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        deadline:
                          e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Application URL
                </label>

                <input
                  type="url"
                  value={form.applicationUrl}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      applicationUrl:
                        e.target.value,
                    }))
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status:
                        e.target.value as ScholarshipStatus,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                >
                  {STATUS_OPTIONS.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Notes
                </label>

                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Optional"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Scholarship"
                      : "Save Scholarship"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-bold text-slate-900">
              My Scholarship Applications
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              আপনার scholarship application records।
            </p>
          </div>

          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              Scholarship loading...
            </div>
          ) : scholarships.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-bold text-slate-800">
                কোনো Scholarship record নেই
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Add Scholarship দিয়ে আপনার application track করুন।
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {scholarships.map((item) => (
                <div
                  key={item.id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">
                          {item.scholarship_title}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      {item.provider_name && (
                        <p className="mt-1 text-sm text-slate-500">
                          {item.provider_name}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {item.application_url && (
                        <a
                          href={
                            item.application_url
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Apply
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(item)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Type
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {item.scholarship_type ||
                          "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Deadline
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {item.deadline ||
                          "Not specified"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Status
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {item.status}
                      </p>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}