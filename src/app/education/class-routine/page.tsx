"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type RoutineItem = {
  id: string;
  class_name: string | null;
  batch_name: string | null;
  subject: string | null;
  teacher_name: string | null;
  day_of_week: string | null;
  start_time: string | null;
  end_time: string | null;
  room: string | null;
  note: string | null;
  active: boolean;
};

type RoutineForm = {
  className: string;
  batchName: string;
  subject: string;
  teacherName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
};

const EMPTY_FORM: RoutineForm = {
  className: "",
  batchName: "",
  subject: "",
  teacherName: "",
  dayOfWeek: "",
  startTime: "",
  endTime: "",
  room: "",
  note: "",
};

const DAYS = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

export default function ClassRoutinePage() {
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [form, setForm] = useState<RoutineForm>(EMPTY_FORM);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadRoutines();
  }, []);

  async function loadRoutines() {
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("প্রথমে Login করুন।");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("education_class_routines")
        .select(
          "id,class_name,batch_name,subject,teacher_name,day_of_week,start_time,end_time,room,note,active"
        )
        .eq("user_id", user.id)
        .eq("active", true)
        .order("day_of_week")
        .order("start_time");

      if (error) {
  console.error("Routine insert error:", {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });

  setMessage(
    error.message ||
      error.details ||
      error.hint ||
      "Routine save করা যায়নি।"
  );

  return;
}

      setItems((data ?? []) as RoutineItem[]);
    } catch (error) {
      console.error(error);
      setMessage("Class & Routine load করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(
    field: keyof RoutineForm,
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

  function openEdit(item: RoutineItem) {
    setEditingId(item.id);

    setForm({
      className: item.class_name || "",
      batchName: item.batch_name || "",
      subject: item.subject || "",
      teacherName: item.teacher_name || "",
      dayOfWeek: item.day_of_week || "",
      startTime: item.start_time?.slice(0, 5) || "",
      endTime: item.end_time?.slice(0, 5) || "",
      room: item.room || "",
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

  async function saveRoutine() {
    if (!form.subject.trim()) {
      setMessage("Subject দিন।");
      return;
    }

    if (!form.dayOfWeek) {
      setMessage("Day নির্বাচন করুন।");
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
console.log("Routine Auth User:", user?.id);
console.log("Routine Payload User:", user.id);
      const payload = {
        user_id: user.id,
        class_name: form.className.trim() || null,
        batch_name: form.batchName.trim() || null,
        subject: form.subject.trim(),
        teacher_name: form.teacherName.trim() || null,
        day_of_week: form.dayOfWeek,
        start_time: form.startTime || null,
        end_time: form.endTime || null,
        room: form.room.trim() || null,
        note: form.note.trim() || null,
        active: true,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const insertPromise = supabase
  .from("education_class_routines")
  .insert(payload);

const timeoutPromise = new Promise<{
  error: {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
  };
}>((resolve) => {
  setTimeout(() => {
    resolve({
      error: {
        message:
          "Routine save request 10 seconds ধরে response দিচ্ছে না।",
        details:
          "Supabase insert request সম্ভবত আটকে আছে।",
      },
    });
  }, 10000);
});

const result = await Promise.race([
  insertPromise,
  timeoutPromise,
]);

if (result.error) {
  console.error("ROUTINE INSERT ERROR:", result.error);

  setMessage(
    result.error.message ||
      result.error.details ||
      "Routine save করা যায়নি।"
  );

  return;
}

        setMessage("Routine successfully updated.");
      } else {
        const { error } = await supabase
          .from("education_class_routines")
          .insert(payload);

        if (error) {
  const routineError = error as {
    message?: string;
    details?: string;
    hint?: string;
    code?: string;
  };

  const fullError = [
    routineError.message,
    routineError.details,
    routineError.hint,
    routineError.code
      ? `Code: ${routineError.code}`
      : "",
  ]
    .filter(Boolean)
    .join(" | ");

  console.log("ROUTINE INSERT ERROR:", fullError);

  setMessage(
    fullError || "Routine save করা যায়নি।"
  );

  return;
}

        setMessage("Routine successfully added.");
      }

      closeForm();
      await loadRoutines();
    } catch (error) {
      console.error(error);
      setMessage("Routine save করা যায়নি।");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRoutine(id: string) {
    const confirmed = window.confirm(
      "এই routine টি delete করতে চান?"
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
        .from("education_class_routines")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        console.error("Routine delete error:", error);
        setMessage(error.message);
        return;
      }

      setMessage("Routine deleted.");
      await loadRoutines();
    } catch (error) {
      console.error(error);
      setMessage("Routine delete করা যায়নি।");
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
            Add Routine
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-black">
                Class & Routine
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                আপনার class, batch, subject, teacher এবং
                weekly routine এখানে সংরক্ষণ করুন।
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
              Routine loading...
            </div>
          ) : items.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <CalendarDays className="mx-auto h-10 w-10 text-slate-400" />

              <h2 className="mt-4 font-black">
                এখনো কোনো routine নেই
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Add Routine দিয়ে আপনার প্রথম class schedule যোগ করুন।
              </p>

              <button
                type="button"
                onClick={openAdd}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Add First Routine
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-black text-slate-900">
                        {item.subject || "Subject"}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                        {item.class_name && (
                          <span className="rounded-full bg-white px-3 py-1">
                            {item.class_name}
                          </span>
                        )}

                        {item.batch_name && (
                          <span className="rounded-full bg-white px-3 py-1">
                            {item.batch_name}
                          </span>
                        )}

                        {item.teacher_name && (
                          <span className="rounded-full bg-white px-3 py-1">
                            {item.teacher_name}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        {item.day_of_week}
                        {item.start_time
                          ? ` • ${item.start_time.slice(0, 5)}`
                          : ""}
                        {item.end_time
                          ? ` - ${item.end_time.slice(0, 5)}`
                          : ""}
                        {item.room
                          ? ` • Room ${item.room}`
                          : ""}
                      </p>

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
                        onClick={() => deleteRoutine(item.id)}
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
                    ? "Edit Routine"
                    : "Add Class & Routine"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  আপনার education schedule
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
                label="Class"
                value={form.className}
                onChange={(value) =>
                  updateForm("className", value)
                }
                placeholder="যেমন: Class 10"
              />

              <Field
                label="Batch"
                value={form.batchName}
                onChange={(value) =>
                  updateForm("batchName", value)
                }
                placeholder="যেমন: Morning Batch"
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
                label="Teacher"
                value={form.teacherName}
                onChange={(value) =>
                  updateForm("teacherName", value)
                }
                placeholder="Teacher name"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Day *
                </label>

                <select
                  value={form.dayOfWeek}
                  onChange={(event) =>
                    updateForm(
                      "dayOfWeek",
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                >
                  <option value="">
                    Select day
                  </option>

                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <Field
                label="Room"
                value={form.room}
                onChange={(value) =>
                  updateForm("room", value)
                }
                placeholder="Room / Lab"
              />

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Start Time
                </label>

                <input
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    updateForm(
                      "startTime",
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  End Time
                </label>

                <input
                  type="time"
                  value={form.endTime}
                  onChange={(event) =>
                    updateForm(
                      "endTime",
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
                onClick={saveRoutine}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />

                {saving ? "Saving..." : "Save Routine"}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
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