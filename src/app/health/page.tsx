"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileHeart,
  FileText,
  Hospital,
  Lock,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  Trash2,
  Upload,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/lib/client";

type MedicalRecord = {
  id: string;
  user_id: string;
  title: string;
  record_type: string;
  hospital_name: string | null;
  doctor_name: string | null;
  record_date: string | null;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const recordTypes = [
  { value: "report", label: "Medical Report" },
  { value: "prescription", label: "Prescription" },
  { value: "test_report", label: "Diagnostic / Test Report" },
  { value: "doctor_advice", label: "Doctor Advice" },
  { value: "hospital_document", label: "Hospital Document" },
  { value: "other", label: "Other Document" },
];

const providerTypes = [
  {
    icon: Stethoscope,
    title: "Doctor",
    description: "Verified doctors and specialists",
  },
  {
    icon: Hospital,
    title: "Clinic / Hospital",
    description: "Healthcare institutions",
  },
  {
    icon: Activity,
    title: "Pathology / Diagnostic",
    description: "Lab and diagnostic services",
  },
  {
    icon: UserRound,
    title: "Healthcare Professional",
    description: "Other verified professionals",
  },
];

function getErrorMessage(error: unknown) {
  if (!error) return "Unknown error";

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const e = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    return [
      e.message,
      e.details,
      e.hint,
      e.code ? `Code: ${e.code}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  }

  return String(error);
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";

  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string | null) {
  if (!date) return "Date not specified";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getRecordLabel(type: string) {
  return (
    recordTypes.find((item) => item.value === type)?.label ||
    "Medical Document"
  );
}

export default function HealthPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [userId, setUserId] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [recordType, setRecordType] = useState("report");
  const [hospitalName, setHospitalName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [recordDate, setRecordDate] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState("");

  async function loadRecords(currentUserId: string) {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("user_id", currentUserId)
        .order("record_date", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (queryError) {
        console.error("DIGITAL HEALTH SUPABASE ERROR:", queryError);
        throw queryError;
      }

      setRecords((data || []) as MedicalRecord[]);
    } catch (err) {
      const message = getErrorMessage(err);

      console.error("DIGITAL HEALTH ERROR:", message);

      setError(
        `Health records load করা যায়নি। ${message}`
      );
    } finally {
      setLoading(false);
    }
  }

  async function getCurrentUser() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("AUTH ERROR:", authError);
    }

    if (!user) {
      setUserId(null);
      setLoading(false);
      setError(
        "Supabase Auth session পাওয়া যায়নি। Login page থেকে Supabase account দিয়ে login করে আবার Health page খুলুন।"
      );
      return;
    }

    setUserId(user.id);
    await loadRecords(user.id);
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  const filteredRecords = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return records;

    return records.filter((record) =>
      [
        record.title,
        record.hospital_name,
        record.doctor_name,
        record.file_name,
        getRecordLabel(record.record_type),
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(keyword)
        )
    );
  }, [records, search]);

  const stats = useMemo(() => {
    const reports = records.filter(
      (record) =>
        record.record_type === "report" ||
        record.record_type === "test_report"
    ).length;

    const prescriptions = records.filter(
      (record) => record.record_type === "prescription"
    ).length;

    const doctors = new Set(
      records
        .map((record) => record.doctor_name)
        .filter(Boolean)
    ).size;

    const hospitals = new Set(
      records
        .map((record) => record.hospital_name)
        .filter(Boolean)
    ).size;

    return {
      total: records.length,
      reports,
      prescriptions,
      doctors,
      hospitals,
    };
  }, [records]);

  async function handleUpload() {
    if (!userId) {
      setError("আপনার account session পাওয়া যায়নি।");
      return;
    }

    if (!title.trim()) {
      setError("Medical record-এর title দিন।");
      return;
    }

    if (!file) {
      setError("একটি medical document select করুন।");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const safeFileName = file.name
        .replace(/[^a-zA-Z0-9._-]/g, "-")
        .replace(/-+/g, "-");

      const filePath = `${userId}/${crypto.randomUUID()}-${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("medical-records")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { error: insertError } = await supabase
        .from("medical_records")
        .insert({
          user_id: userId,
          title: title.trim(),
          record_type: recordType,
          hospital_name: hospitalName.trim() || null,
          doctor_name: doctorName.trim() || null,
          record_date: recordDate || null,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type || null,
          file_size: file.size,
          notes: notes.trim() || null,
        });

      if (insertError) {
        await supabase.storage
          .from("medical-records")
          .remove([filePath]);

        throw insertError;
      }

      setTitle("");
      setRecordType("report");
      setHospitalName("");
      setDoctorName("");
      setRecordDate("");
      setNotes("");
      setFile(null);

      setShowAddModal(false);

      await loadRecords(userId);
    } catch (err) {
      const message = getErrorMessage(err);

      console.error("MEDICAL RECORD UPLOAD ERROR:", message);

      setError(`Record save করা যায়নি। ${message}`);
    } finally {
      setUploading(false);
    }
  }

  async function viewRecord(record: MedicalRecord) {
    try {
      setError("");

      const { data, error: signedUrlError } = await supabase.storage
        .from("medical-records")
        .createSignedUrl(record.file_path, 60 * 10);

      if (signedUrlError) {
        throw signedUrlError;
      }

      if (!data?.signedUrl) {
        throw new Error("Secure file URL তৈরি হয়নি।");
      }

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(`Record open করা যায়নি। ${getErrorMessage(err)}`);
    }
  }

  async function deleteRecord(record: MedicalRecord) {
    const confirmed = window.confirm(
      `আপনি কি "${record.title}" record টি permanently delete করতে চান?`
    );

    if (!confirmed) return;

    try {
      setError("");

      const { error: storageError } = await supabase.storage
        .from("medical-records")
        .remove([record.file_path]);

      if (storageError) {
        console.warn("Storage delete warning:", storageError);
      }

      const { error: deleteError } = await supabase
        .from("medical_records")
        .delete()
        .eq("id", record.id)
        .eq("user_id", userId);

      if (deleteError) {
        throw deleteError;
      }

      setRecords((previous) =>
        previous.filter((item) => item.id !== record.id)
      );
    } catch (err) {
      setError(`Record delete করা যায়নি। ${getErrorMessage(err)}`);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <ShieldCheck className="h-4 w-4" />
                Private Digital Health
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                আপনার স্বাস্থ্য তথ্য,
                <span className="block text-emerald-600">
                  আপনার নিয়ন্ত্রণে।
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Medical report, prescription, diagnostic result, doctor advice
                এবং গুরুত্বপূর্ণ health documents এক জায়গায় নিরাপদে রাখুন।
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setError("");
                    setShowAddModal(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <Plus className="h-5 w-5" />
                  Add Medical Record
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("health-records")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  View My Records
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-white p-3 text-emerald-600 shadow-sm">
                  <FileHeart className="h-7 w-7" />
                </div>

                <div>
                  <h2 className="text-lg font-black">
                    Smart Health Vault
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    আপনার health history ভবিষ্যতে verified doctors,
                    diagnostic centers এবং healthcare services-এর সাথে
                    permission-based ভাবে ব্যবহার করা যাবে।
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-2xl font-black">{stats.total}</p>
                  <p className="text-xs text-slate-500">Total Records</p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-2xl font-black">{stats.reports}</p>
                  <p className="text-xs text-slate-500">Reports</p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-2xl font-black">
                    {stats.doctors}
                  </p>
                  <p className="text-xs text-slate-500">Doctors</p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-2xl font-black">
                    {stats.hospitals}
                  </p>
                  <p className="text-xs text-slate-500">
                    Hospitals / Centers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNTABILITY */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              Trust & Accountability
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Healthcare service-এ transparency
            </h2>

            <p className="mt-3 text-slate-600">
              ভবিষ্যতে Shromobazar-এ healthcare provider-দের verified profile,
              service history, service experience, behaviour, appointment,
              billing এবং complaint management থাকবে।
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {providerTypes.map((provider) => {
              const Icon = provider.icon;

              return (
                <div
                  key={provider.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 font-black">
                    {provider.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {provider.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    Service & Behaviour Rating
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <p className="text-sm leading-6 text-amber-900">
                <strong>গুরুত্বপূর্ণ:</strong> service rating কোনো doctor-এর
                clinical quality বা medical competence-এর সরকারি certification
                নয়। Professional credentials ও regulatory verification
                আলাদাভাবে যাচাই করতে হবে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HEALTH RECORDS */}
      <section id="health-records" className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-emerald-600">
                My Health Vault
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Medical Records
              </h2>

              <p className="mt-2 text-slate-500">
                আপনার নিজের medical documents এবং history।
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search records..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-emerald-500"
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-20 text-center text-slate-500">
              Loading your health records...
            </div>
          ) : !userId ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Lock className="mx-auto h-10 w-10 text-slate-400" />

              <h3 className="mt-4 text-xl font-black">
                Secure login required
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Personal health information দেখার জন্য আপনার authenticated
                account session প্রয়োজন।
              </p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />

              <h3 className="mt-4 text-xl font-black">
                No medical records yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                আপনার প্রথম report বা prescription এখানে নিরাপদে সংরক্ষণ করুন।
              </p>

              <button
                onClick={() => setShowAddModal(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
              >
                <Plus className="h-5 w-5" />
                Add First Record
              </button>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredRecords.map((record) => (
                <article
                  key={record.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <FileText className="h-5 w-5" />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {getRecordLabel(record.record_type)}
                    </span>
                  </div>

                  <h3 className="mt-5 line-clamp-2 text-lg font-black">
                    {record.title}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-slate-500">
                    {record.doctor_name && (
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        {record.doctor_name}
                      </div>
                    )}

                    {record.hospital_name && (
                      <div className="flex items-center gap-2">
                        <Hospital className="h-4 w-4" />
                        {record.hospital_name}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(record.record_date)}
                    </div>
                  </div>

                  {record.notes && (
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                      {record.notes}
                    </p>
                  )}

                  <div className="mt-5 border-t pt-4">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate pr-3">
                        {record.file_name}
                      </span>

                      <span className="shrink-0">
                        {formatFileSize(record.file_size)}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => viewRecord(record)}
                        className="flex-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        View Securely
                      </button>

                      <button
                        onClick={() => deleteRecord(record)}
                        className="rounded-xl border border-red-200 px-3 py-2.5 text-red-600 hover:bg-red-50"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FUTURE SERVICES */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black">
            Smart Health — Future Services
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Doctor Consultation", Stethoscope],
              ["Diagnostic Tests", Activity],
              ["Appointments", CalendarDays],
              ["Secure Communication", MessageSquare],
              ["Health Timeline", Clock3],
              ["Family Health", Users],
              ["Permission Sharing", ShieldCheck],
              ["Service Complaints", AlertCircle],
            ].map(([title, Icon]) => {
              const Component = Icon as typeof Activity;

              return (
                <div
                  key={String(title)}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <Component className="h-6 w-6 text-emerald-600" />
                  <p className="mt-3 font-bold">{String(title)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-black">
                  Add Medical Record
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  আপনার private Health Vault-এ একটি record যোগ করুন।
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Record Title *
                </label>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Blood Test Report"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Record Type
                </label>

                <select
                  value={recordType}
                  onChange={(event) => setRecordType(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
                >
                  {recordTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Doctor Name
                  </label>

                  <input
                    value={doctorName}
                    onChange={(event) =>
                      setDoctorName(event.target.value)
                    }
                    placeholder="Doctor name"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Hospital / Diagnostic Center
                  </label>

                  <input
                    value={hospitalName}
                    onChange={(event) =>
                      setHospitalName(event.target.value)
                    }
                    placeholder="Hospital / Lab"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Record Date
                </label>

                <input
                  type="date"
                  value={recordDate}
                  onChange={(event) =>
                    setRecordDate(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Notes
                </label>

                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  placeholder="Optional notes..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  Medical File *
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center hover:border-emerald-400">
                  <Upload className="h-8 w-8 text-emerald-600" />

                  <span className="mt-3 font-bold">
                    {file ? file.name : "Choose medical document"}
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    PDF, JPG, PNG or other supported document
                  </span>

                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                    onChange={(event) =>
                      setFile(event.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex gap-3">
                  <Lock className="h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm leading-6 text-emerald-900">
                    এই record private storage-এ থাকবে। ভবিষ্যতে অন্য কোনো
                    provider-কে access দিতে হলে patient permission প্রয়োজন হবে।
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      Save Medical Record
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}