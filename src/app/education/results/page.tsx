"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type ResultItem = {
  id: string;
  exam_name: string | null;
  class_name: string | null;
  subject: string;
  marks: number | null;
  total_marks: number | null;
  grade: string | null;
  gpa: number | null;
  result_date: string | null;
  note: string | null;
  active: boolean;
};

type ResultForm = {
  examName: string;
  className: string;
  subject: string;
  marks: string;
  totalMarks: string;
  grade: string;
  gpa: string;
  resultDate: string;
  note: string;
};

const EMPTY_FORM: ResultForm = {
  examName: "",
  className: "",
  subject: "",
  marks: "",
  totalMarks: "",
  grade: "",
  gpa: "",
  resultDate: "",
  note: "",
};

export default function ResultsPage() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [form, setForm] = useState<ResultForm>(EMPTY_FORM);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadResults();
  }, []);

  async function loadResults() {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("প্রথমে Login করুন।");
        return;
      }

      const { data, error } = await supabase
        .from("education_results")
        .select(
          "id,exam_name,class_name,subject,marks,total_marks,grade,gpa,result_date,note,active"
        )
        .eq("user_id", user.id)
        .eq("active", true)
        .order("result_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Results load error:", error);
        setMessage(error.message || "Results load করা যায়নি।");
        return;
      }

      setResults((data ?? []) as ResultItem[]);
    } catch (error) {
      console.error(error);
      setMessage("Results load করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(
    field: keyof ResultForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setMessage("");
    setShowForm(true);
  }

  function openEdit(item: ResultItem) {
    setEditingId(item.id);

    setForm({
      examName: item.exam_name || "",
      className: item.class_name || "",
      subject: item.subject || "",
      marks:
        item.marks !== null
          ? String(item.marks)
          : "",
      totalMarks:
        item.total_marks !== null
          ? String(item.total_marks)
          : "",
      grade: item.grade || "",
      gpa:
        item.gpa !== null
          ? String(item.gpa)
          : "",
      resultDate: item.result_date || "",
      note: item.note || "",
    });

    setMessage("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function saveResult() {
    if (!form.subject.trim()) {
      setMessage("Subject দিন।");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("প্রথমে Login করুন।");
        return;
      }

      const payload = {
        user_id: user.id,
        exam_name: form.examName.trim() || null,
        class_name: form.className.trim() || null,
        subject: form.subject.trim(),

        marks:
          form.marks.trim() !== ""
            ? Number(form.marks)
            : null,

        total_marks:
          form.totalMarks.trim() !== ""
            ? Number(form.totalMarks)
            : null,

        grade: form.grade.trim() || null,

        gpa:
          form.gpa.trim() !== ""
            ? Number(form.gpa)
            : null,

        result_date:
          form.resultDate || null,

        note: form.note.trim() || null,

        active: true,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error } = await supabase
          .from("education_results")
          .update(payload)
          .eq("id", editingId)
          .eq("user_id", user.id);

        if (error) {
          console.error("Result update error:", error);
          setMessage(
            error.message ||
              "Result update করা যায়নি।"
          );
          return;
        }

        setMessage("Result successfully updated.");
      } else {
        const { error } = await supabase
          .from("education_results")
          .insert(payload);

        if (error) {
          console.error("Result insert error:", error);
          setMessage(
            error.message ||
              "Result save করা যায়নি।"
          );
          return;
        }

        setMessage("Result successfully added.");
      }

      closeForm();
      await loadResults();
    } catch (error) {
      console.error(error);
      setMessage("Result save করা যায়নি।");
    } finally {
      setSaving(false);
    }
  }

  async function deleteResult(id: string) {
    const confirmed = window.confirm(
      "এই result টি delete করতে চান?"
    );

    if (!confirmed) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("প্রথমে Login করুন।");
        return;
      }

      const { error } = await supabase
        .from("education_results")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Result delete error:", error);
        setMessage(
          error.message ||
            "Result delete করা যায়নি।"
        );
        return;
      }

      setMessage("Result deleted.");
      await loadResults();
    } catch (error) {
      console.error(error);
      setMessage("Result delete করা যায়নি।");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/education"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Education
          </Link>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Result
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <Award className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-black">
                Results
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                আপনার exam result, marks, grade ও GPA
                এখানে সংরক্ষণ করুন।
              </p>
            </div>
          </div>

          {message && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
              {message}
            </div>
          )}

          {loading ? (
            <div className="mt-8 py-10 text-center text-sm text-slate-500">
              Results loading...
            </div>
          ) : results.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <Award className="mx-auto h-10 w-10 text-slate-400" />

              <h2 className="mt-4 font-black">
                এখনো কোনো result নেই
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add Result দিয়ে আপনার academic result
                যোগ করুন।
              </p>

              <button
                type="button"
                onClick={openAdd}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add First Result
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-black text-slate-900">
                        {item.subject}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                        {item.exam_name && (
                          <span className="rounded-full bg-white px-3 py-1">
                            {item.exam_name}
                          </span>
                        )}

                        {item.class_name && (
                          <span className="rounded-full bg-white px-3 py-1">
                            {item.class_name}
                          </span>
                        )}

                        {item.result_date && (
                          <span className="rounded-full bg-white px-3 py-1">
                            {item.result_date}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
                        {item.marks !== null && (
                          <span>
                            Marks: {item.marks}
                            {item.total_marks !== null
                              ? ` / ${item.total_marks}`
                              : ""}
                          </span>
                        )}

                        {item.grade && (
                          <span>
                            Grade: {item.grade}
                          </span>
                        )}

                        {item.gpa !== null && (
                          <span>
                            GPA: {item.gpa}
                          </span>
                        )}
                      </div>

                      {item.note && (
                        <p className="mt-2 text-xs leading-5 text-slate-500">
                          {item.note}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteResult(item.id)
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="font-black">
                  {editingId
                    ? "Edit Result"
                    : "Add Result"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Academic result information
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field
                label="Exam / Term"
                value={form.examName}
                onChange={(value) =>
                  updateForm("examName", value)
                }
                placeholder="যেমন: SSC 2026"
              />

              <Field
                label="Class"
                value={form.className}
                onChange={(value) =>
                  updateForm("className", value)
                }
                placeholder="যেমন: Class 10"
              />

              <Field
                label="Subject *"
                value={form.subject}
                onChange={(value) =>
                  updateForm("subject", value)
                }
                placeholder="যেমন: Mathematics"
              />

              <Field
                label="Marks"
                type="number"
                value={form.marks}
                onChange={(value) =>
                  updateForm("marks", value)
                }
                placeholder="80"
              />

              <Field
                label="Total Marks"
                type="number"
                value={form.totalMarks}
                onChange={(value) =>
                  updateForm("totalMarks", value)
                }
                placeholder="100"
              />

              <Field
                label="Grade"
                value={form.grade}
                onChange={(value) =>
                  updateForm("grade", value)
                }
                placeholder="A+"
              />

              <Field
                label="GPA"
                type="number"
                step="0.01"
                value={form.gpa}
                onChange={(value) =>
                  updateForm("gpa", value)
                }
                placeholder="5.00"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Result Date
                </label>

                <input
                  type="date"
                  value={form.resultDate}
                  onChange={(event) =>
                    updateForm(
                      "resultDate",
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Note
                </label>

                <textarea
                  value={form.note}
                  onChange={(event) =>
                    updateForm(
                      "note",
                      event.target.value
                    )
                  }
                  rows={3}
                  placeholder="Optional note"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveResult}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />

                {saving
                  ? "Saving..."
                  : "Save Result"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
      />
    </div>
  );
}