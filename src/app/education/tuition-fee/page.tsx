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
  CheckCircle2,
  CreditCard,
  Edit3,
  Plus,
  Save,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type FeeStatus =
  | "Due"
  | "Partially Paid"
  | "Paid"
  | "Overdue";

type TuitionFee = {
  id: string;
  user_id: string;
  fee_title: string | null;
  semester_name: string | null;
  amount: number | null;
  paid_amount: number | null;
  due_amount: number | null;
  due_date: string | null;
  payment_date: string | null;
  status: FeeStatus;
  note: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

type FeeForm = {
  fee_title: string;
  semester_name: string;
  amount: string;
  paid_amount: string;
  due_date: string;
  payment_date: string;
  status: FeeStatus;
  note: string;
};

const emptyForm: FeeForm = {
  fee_title: "",
  semester_name: "",
  amount: "",
  paid_amount: "",
  due_date: "",
  payment_date: "",
  status: "Due",
  note: "",
};

function formatMoney(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "৳0";
  }

  return `৳${value.toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;
}

function getStatusClass(status: FeeStatus) {
  switch (status) {
    case "Paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Partially Paid":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "Overdue":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-blue-50 text-blue-700 border-blue-200";
  }
}

export default function TuitionFeePage() {
  const router = useRouter();

  const [fees, setFees] = useState<TuitionFee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<FeeForm>(emptyForm);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFees = useCallback(async () => {
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
        .from("education_tuition_fees")
        .select(
          `
            id,
            user_id,
            fee_title,
            semester_name,
            amount,
            paid_amount,
            due_amount,
            due_date,
            payment_date,
            status,
            note,
            active,
            created_at,
            updated_at
          `
        )
        .eq("user_id", session.user.id)
        .eq("active", true)
        .order("due_date", {
          ascending: true,
          nullsFirst: false,
        })
        .order("created_at", {
          ascending: false,
        });

      if (fetchError) {
        throw fetchError;
      }

      setFees((data ?? []) as TuitionFee[]);
    } catch (err) {
      console.error("Tuition Fee load error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Tuition Fee load করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadFees();
  }, [loadFees]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (fee: TuitionFee) => {
    setEditingId(fee.id);

    setForm({
      fee_title: fee.fee_title ?? "",
      semester_name: fee.semester_name ?? "",
      amount:
        fee.amount !== null ? String(fee.amount) : "",
      paid_amount:
        fee.paid_amount !== null
          ? String(fee.paid_amount)
          : "",
      due_date: fee.due_date ?? "",
      payment_date: fee.payment_date ?? "",
      status: fee.status,
      note: fee.note ?? "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
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

      const amount = form.amount.trim()
        ? Number(form.amount)
        : 0;

      const paidAmount = form.paid_amount.trim()
        ? Number(form.paid_amount)
        : 0;

      if (Number.isNaN(amount) || amount < 0) {
        throw new Error(
          "Total Fee সঠিকভাবে দিন।"
        );
      }

      if (
        Number.isNaN(paidAmount) ||
        paidAmount < 0
      ) {
        throw new Error(
          "Paid Amount সঠিকভাবে দিন।"
        );
      }

      if (paidAmount > amount) {
        throw new Error(
          "Paid Amount Total Fee-এর চেয়ে বেশি হতে পারবে না।"
        );
      }

      const dueAmount = Math.max(
        amount - paidAmount,
        0
      );

      let calculatedStatus = form.status;

      if (dueAmount === 0 && amount > 0) {
        calculatedStatus = "Paid";
      } else if (
        paidAmount > 0 &&
        dueAmount > 0
      ) {
        calculatedStatus = "Partially Paid";
      }

      const payload = {
        fee_title:
          form.fee_title.trim() || null,
        semester_name:
          form.semester_name.trim() || null,
        amount,
        paid_amount: paidAmount,
        due_amount: dueAmount,
        due_date:
          form.due_date || null,
        payment_date:
          form.payment_date || null,
        status: calculatedStatus,
        note: form.note.trim() || null,
        active: true,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { error: updateError } =
          await supabase
            .from("education_tuition_fees")
            .update(payload)
            .eq("id", editingId)
            .eq("user_id", session.user.id);

        if (updateError) {
          throw updateError;
        }

        setSuccess(
          "Tuition Fee সফলভাবে update হয়েছে।"
        );
      } else {
        const { error: insertError } =
          await supabase
            .from("education_tuition_fees")
            .insert({
              ...payload,
              user_id: session.user.id,
            });

        if (insertError) {
          throw insertError;
        }

        setSuccess(
          "Tuition Fee সফলভাবে save হয়েছে।"
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadFees();
    } catch (err) {
      console.error("Tuition Fee save error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Tuition Fee save করা যায়নি।"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "এই Tuition Fee record টি delete করতে চান?"
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
          .from("education_tuition_fees")
          .delete()
          .eq("id", id)
          .eq("user_id", session.user.id);

      if (deleteError) {
        throw deleteError;
      }

      setSuccess(
        "Tuition Fee record delete হয়েছে।"
      );

      await loadFees();
    } catch (err) {
      console.error(
        "Tuition Fee delete error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Tuition Fee delete করা যায়নি।"
      );
    }
  };

  const totalFee = fees.reduce(
    (sum, item) => sum + Number(item.amount ?? 0),
    0
  );

  const totalPaid = fees.reduce(
    (sum, item) =>
      sum + Number(item.paid_amount ?? 0),
    0
  );

  const totalDue = fees.reduce(
    (sum, item) =>
      sum + Number(item.due_amount ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/education"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Education
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                <WalletCards className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Tuition Fee
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Fee, paid ও due information
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Tuition Fee
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

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <CreditCard className="h-4 w-4" />
              Total Fee
            </div>

            <div className="text-2xl font-bold text-slate-900">
              {formatMoney(totalFee)}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              Paid
            </div>

            <div className="text-2xl font-bold text-emerald-700">
              {formatMoney(totalPaid)}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-600">
              <WalletCards className="h-4 w-4" />
              Due
            </div>

            <div className="text-2xl font-bold text-amber-700">
              {formatMoney(totalDue)}
            </div>
          </div>
        </section>

        {showForm && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? "Edit Tuition Fee"
                    : "Add Tuition Fee"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Fee information আপনার নিজের account-এর জন্য save হবে।
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close"
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
                  Fee Title
                </label>

                <input
                  type="text"
                  value={form.fee_title}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      fee_title: e.target.value,
                    }))
                  }
                  placeholder="যেমন: Semester Fee"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Semester / Term
                </label>

                <input
                  type="text"
                  value={form.semester_name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      semester_name: e.target.value,
                    }))
                  }
                  placeholder="যেমন: Spring 2026"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Total Fee
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="৳"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Paid Amount
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.paid_amount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      paid_amount: e.target.value,
                    }))
                  }
                  placeholder="৳"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Due Date
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        due_date: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Payment Date
                </label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    value={form.payment_date}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        payment_date: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
                  />
                </div>
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
                      status: e.target.value as FeeStatus,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                >
                  <option value="Due">Due</option>
                  <option value="Partially Paid">
                    Partially Paid
                  </option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">
                    Overdue
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Note
                </label>

                <textarea
                  value={form.note}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      note: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Optional note"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2 sm:col-span-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Fee"
                      : "Save Fee"}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="font-bold text-slate-900">
              My Tuition Fees
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              আপনার Fee records এখানে দেখা যাবে।
            </p>
          </div>

          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              Tuition Fee loading...
            </div>
          ) : fees.length === 0 ? (
            <div className="px-5 py-12 text-center sm:px-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <WalletCards className="h-6 w-6" />
              </div>

              <h3 className="font-bold text-slate-800">
                কোনো Tuition Fee record নেই
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add Tuition Fee দিয়ে প্রথম record তৈরি করুন।
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fees.map((fee) => (
                <div
                  key={fee.id}
                  className="p-5 sm:p-6"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {fee.fee_title ||
                            "Tuition Fee"}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getStatusClass(
                            fee.status
                          )}`}
                        >
                          {fee.status}
                        </span>
                      </div>

                      {fee.semester_name && (
                        <p className="mt-1 text-sm text-slate-500">
                          {fee.semester_name}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(fee)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(fee.id)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-slate-500">
                        Total Fee
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {formatMoney(fee.amount)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-4">
                      <p className="text-xs font-semibold text-emerald-600">
                        Paid
                      </p>

                      <p className="mt-1 text-lg font-bold text-emerald-700">
                        {formatMoney(
                          fee.paid_amount
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-amber-50 p-4">
                      <p className="text-xs font-semibold text-amber-600">
                        Due
                      </p>

                      <p className="mt-1 text-lg font-bold text-amber-700">
                        {formatMoney(
                          fee.due_amount
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                    {fee.due_date && (
                      <div>
                        <span className="font-semibold text-slate-700">
                          Due Date:
                        </span>{" "}
                        {fee.due_date}
                      </div>
                    )}

                    {fee.payment_date && (
                      <div>
                        <span className="font-semibold text-slate-700">
                          Payment Date:
                        </span>{" "}
                        {fee.payment_date}
                      </div>
                    )}
                  </div>

                  {fee.note && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {fee.note}
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