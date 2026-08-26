"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, KeyRound, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
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

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (
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

    setLoading(true);

    try {
      /*
       * Supabase Phone Password Recovery
       *
       * OTP পাঠানো হচ্ছে না।
       * Supabase configured recovery flow ব্যবহার করা হবে।
       */
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          `${cleanPhone}@reset.shromobazar.local`,
          {
            redirectTo:
              `${window.location.origin}/reset-password`,
          }
        );

      if (resetError) {
        console.error("Reset password error:", resetError);

        setError(
          "Password reset request সম্পন্ন করা যায়নি। আপনার account ও authentication configuration পরীক্ষা করুন।"
        );

        setLoading(false);
        return;
      }

      setSuccess(
        "Password reset link পাঠানোর অনুরোধ সফল হয়েছে।"
      );
    } catch (err) {
      console.error(err);

      setError(
        "Password reset করা যায়নি। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
      );
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#071b3a] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">

        {/* Header */}
        <div className="mb-7 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
            <KeyRound className="h-7 w-7 text-orange-500" />
          </div>

          <p className="mt-4 text-sm font-bold text-orange-400">
            শ্রমবাজার
          </p>

          <h1 className="mt-1 text-3xl font-black text-white">
            Password ভুলে গেছেন?
          </h1>

          <p className="mt-2 text-sm leading-6 text-blue-100/70">
            আপনার account-এর Password পুনরুদ্ধারের জন্য
            মোবাইল নম্বর দিন।
          </p>

        </div>

        {/* Card */}
        <form
          onSubmit={handleForgotPassword}
          className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        >

          {/* Phone */}
          <div>
            <label className="text-sm font-bold text-slate-700">
              মোবাইল নম্বর
            </label>

            <div className="mt-2 flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-orange-400 focus-within:bg-white">

              <Phone className="mr-3 h-5 w-5 text-slate-400" />

              <input
                type="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="01XXXXXXXXX"
                inputMode="tel"
                autoComplete="tel"
                className="w-full bg-transparent text-sm outline-none"
              />

            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold leading-5 text-red-600">

              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <span>{error}</span>

            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-3 text-sm font-semibold leading-5 text-green-700">

              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />

              <span>{success}</span>

            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "অনুরোধ করা হচ্ছে..."
              : "Password Reset করুন"}
          </button>

          {/* Back to Login */}
          <Link
            href="/login"
            className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Login page-এ ফিরে যান
          </Link>

          {/* Register */}
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

        <p className="mt-5 text-center text-[10px] text-blue-100/50">
          শ্রমবাজার — Global Workforce Platform
        </p>

      </div>
    </main>
  );
}