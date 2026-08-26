"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Lock,
  LogIn,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/client";

function normalizePhone(value: string) {
  let phone = value.trim().replace(/\s+/g, "");

  if (phone.startsWith("+880")) {
    phone = "0" + phone.slice(4);
  } else if (phone.startsWith("880")) {
    phone = "0" + phone.slice(3);
  }

  return phone;
}

function toAuthPhone(phone: string) {
  return `+880${phone.slice(1)}`;
}

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanPhone = normalizePhone(phone);

    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setError("সঠিক বাংলাদেশি মোবাইল নম্বর দিন।");
      return;
    }

    if (!password) {
      setError("Password দিন।");
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          phone: toAuthPhone(cleanPhone),
          password,
        });

      if (loginError) {
        setError("মোবাইল নম্বর অথবা Password সঠিক নয়।");
        setLoading(false);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        setError("Login সফল হয়েছে, কিন্তু User পাওয়া যায়নি।");
        setLoading(false);
        return;
      }

      const { data: worker } = await supabase
        .from("workers")
        .select(
          "id,name,phone,location,worker_category"
        )
        .eq("id", userId)
        .maybeSingle();

      if (worker) {
        localStorage.setItem(
          "shromobazar_current_user",
          JSON.stringify({
            id: worker.id,
            name: worker.name,
            phone: worker.phone,
            location: worker.location,
            profession: worker.worker_category,
          })
        );
      }

      setSuccess("Login সফল হয়েছে। Dashboard-এ নেওয়া হচ্ছে...");

      setTimeout(() => {
        router.replace("/worker-dashboard");
      }, 600);
    } catch (err) {
      console.error(err);
      setError("Login করা যায়নি। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071b3a] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
            <LogIn className="h-7 w-7 text-orange-500" />
          </div>

          <p className="mt-4 text-sm font-bold text-orange-400">
            শ্রমবাজার
          </p>

          <h1 className="mt-1 text-3xl font-black text-white">
            প্রবেশ করুন
          </h1>

          <p className="mt-2 text-sm text-blue-100/70">
            আপনার account-এ প্রবেশ করুন
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        >
          <div>
            <label className="text-sm font-bold text-slate-700">
              মোবাইল নম্বর
            </label>

            <div className="mt-2 flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-orange-400 focus-within:bg-white">
              <Phone className="mr-3 h-5 w-5 text-slate-400" />

              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                placeholder="01XXXXXXXXX"
                inputMode="tel"
                autoComplete="tel"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-bold text-slate-700">
              Password
            </label>

            <div className="mt-2 flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-orange-400 focus-within:bg-white">
              <Lock className="mr-3 h-5 w-5 text-slate-400" />

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="আপনার Password"
                autoComplete="current-password"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-3 text-right">
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-orange-500 hover:text-orange-600"
            >
              Password ভুলে গেছেন?
            </Link>
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-600">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm font-semibold text-green-700">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "প্রবেশ করা হচ্ছে..." : "প্রবেশ করুন"}
          </button>

          <p className="mt-5 text-center text-sm text-slate-500">
            নতুন account?

            <Link
              href="/register"
              className="ml-1.5 font-bold text-orange-500 hover:text-orange-600"
            >
              নিবন্ধন করুন
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}