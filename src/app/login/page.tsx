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
  Loader2,
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

    if (loading) return;

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
      /*
       * 1. Supabase authentication
       */
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          phone: toAuthPhone(cleanPhone),
          password,
        });

      if (loginError) {
        console.error("Login error:", loginError);

        setError(
          "মোবাইল নম্বর অথবা Password সঠিক নয়।"
        );
        setLoading(false);
        return;
      }

      const user = data.user;

      if (!user) {
        setError(
          "Login সম্পন্ন হয়নি। আবার চেষ্টা করুন।"
        );
        setLoading(false);
        return;
      }

      /*
       * 2. Worker profile খোঁজা
       *
       * শুধু বর্তমানে নিশ্চিতভাবে ব্যবহৃত
       * columns নেওয়া হচ্ছে।
       */
      const { data: worker, error: workerError } =
        await supabase
          .from("workers")
          .select("id,name,phone,worker_category")
          .eq("id", user.id)
          .maybeSingle();

      if (workerError) {
        console.error(
          "Worker profile lookup error:",
          workerError
        );
      }

      /*
       * 3. Local session/profile information
       *
       * Worker profile পাওয়া গেলে সেটি ব্যবহার হবে।
       * না পাওয়া গেলে Supabase user-এর phone ব্যবহার হবে।
       */
      localStorage.setItem(
        "shromobazar_current_user",
        JSON.stringify({
          id: user.id,
          name: worker?.name || "",
          phone: worker?.phone || cleanPhone,
          location: "",
          profession:
            worker?.worker_category || "",
          email: user.email || null,
        })
      );

      /*
       * 4. Success message
       */
      setSuccess(
        "Login সফল হয়েছে। Dashboard-এ নেওয়া হচ্ছে..."
      );

      /*
       * 5. Dashboard redirect
       */
      router.replace("/worker-dashboard");
    } catch (err) {
      console.error("Unexpected login error:", err);

      setError(
        "Login করা যায়নি। ইন্টারনেট সংযোগ ও তথ্য পরীক্ষা করে আবার চেষ্টা করুন।"
      );

      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071b3a] px-4 py-8 sm:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full">
          {/* HEADER */}
          <div className="mb-6 text-center sm:mb-7">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
              <LogIn className="h-7 w-7 text-orange-500" />
            </div>

            <p className="mt-4 text-sm font-bold text-orange-400">
              শ্রমবাজার
            </p>

            <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
              প্রবেশ করুন
            </h1>

            <p className="mt-2 text-xs text-blue-100/70 sm:text-sm">
              আপনার শ্রমবাজার account-এ প্রবেশ করুন
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleLogin}
            className="rounded-3xl border border-white/10 bg-white p-5 shadow-2xl sm:p-7"
          >
            {/* PHONE */}
            <div>
              <label
                htmlFor="phone"
                className="text-xs font-bold text-slate-700 sm:text-sm"
              >
                মোবাইল নম্বর
              </label>

              <div className="mt-1.5 flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100">
                <Phone className="mr-2.5 h-5 w-5 shrink-0 text-slate-400" />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError("");
                  }}
                  placeholder="01XXXXXXXXX"
                  inputMode="tel"
                  autoComplete="tel"
                  disabled={loading}
                  className="w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mt-4">
              <label
                htmlFor="password"
                className="text-xs font-bold text-slate-700 sm:text-sm"
              >
                Password
              </label>

              <div className="mt-1.5 flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100">
                <Lock className="mr-2.5 h-5 w-5 shrink-0 text-slate-400" />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="আপনার Password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="mt-3 text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-orange-500 transition hover:text-orange-600"
              >
                Password ভুলে গেছেন?
              </Link>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-xs font-semibold leading-5 text-red-600 sm:text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />

                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-xs font-semibold leading-5 text-green-700 sm:text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />

                <span>{success}</span>
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  প্রবেশ করা হচ্ছে...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  প্রবেশ করুন
                </>
              )}
            </button>

            {/* REGISTER */}
            <p className="mt-5 text-center text-xs text-slate-500 sm:text-sm">
              নতুন account?

              <Link
                href="/register"
                className="ml-1.5 font-bold text-orange-500 transition hover:text-orange-600"
              >
                নিবন্ধন করুন
              </Link>
            </p>
          </form>

          {/* FOOTER */}
          <p className="mt-5 text-center text-[10px] text-blue-100/50">
            শ্রমবাজার — Global Workforce Platform
          </p>
        </div>
      </div>
    </main>
  );
}