"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (!session) {
          setError(
            "Password reset session পাওয়া যায়নি। আবার Forgot Password ব্যবহার করুন।"
          );
        }
      } catch (err) {
        console.error("Reset session error:", err);

        if (mounted) {
          setError(
            "Password reset session যাচাই করা যায়নি। আবার চেষ্টা করুন।"
          );
        }
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, []);

  const handleReset = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Password কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("দুইটি Password একই নয়।");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Password reset session পাওয়া যায়নি। আবার Forgot Password ব্যবহার করুন।"
        );
        setLoading(false);
        return;
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) {
        console.error("Password update error:", updateError);

        setError(
          `Password পরিবর্তন করা যায়নি: ${updateError.message}`
        );

        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err) {
      console.error(err);

      setError(
        "Password পরিবর্তন করা যায়নি। আবার চেষ্টা করুন।"
      );

      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071b3a] px-4">
        <div className="rounded-2xl bg-white px-8 py-7 text-center shadow-2xl">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500" />

          <p className="mt-4 text-sm font-semibold text-slate-600">
            Password reset session যাচাই করা হচ্ছে...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071b3a] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md">

        {/* HEADER */}
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl">
            <KeyRound className="h-7 w-7 text-orange-500" />
          </div>

          <p className="mt-4 text-sm font-bold text-orange-400">
            শ্রমবাজার
          </p>

          <h1 className="mt-1 text-3xl font-black text-white">
            নতুন Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-blue-100/70">
            আপনার account-এর জন্য নতুন Password সেট করুন।
          </p>
        </div>

        {/* RESET CARD */}
        <form
          onSubmit={handleReset}
          className="rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
        >
          {error && !success && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <p className="text-sm font-semibold leading-5 text-red-600">
                  {error}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href="/forgot-password"
                  className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-orange-600"
                >
                  Forgot Password
                </Link>

                <Link
                  href="/login"
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Login
                </Link>
              </div>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="h-9 w-9 text-green-600" />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-900">
                Password পরিবর্তন হয়েছে
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                আপনার নতুন Password সফলভাবে সংরক্ষণ করা হয়েছে।
              </p>

              <div className="mt-5 rounded-2xl border border-green-100 bg-green-50 p-4">
                <p className="text-xs font-semibold leading-5 text-green-700">
                  নিরাপত্তার জন্য আপনাকে Login page-এ পাঠানো হচ্ছে।
                </p>
              </div>
            </div>
          ) : (
            <>
              {!error && (
                <div className="mb-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs leading-5 text-slate-600">
                    নতুন Password কমপক্ষে ৬ অক্ষরের হতে হবে।
                    নিরাপত্তার জন্য সহজ Password ব্যবহার করবেন না।
                  </p>
                </div>
              )}

              {/* NEW PASSWORD */}
              <div>
                <label className="text-sm font-bold text-slate-700">
                  নতুন Password
                </label>

                <div className="mt-2 flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-orange-400 focus-within:bg-white">
                  <Lock className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mt-4">
                <label className="text-sm font-bold text-slate-700">
                  Password আবার লিখুন
                </label>

                <div className="mt-2 flex h-12 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 transition focus-within:border-orange-400 focus-within:bg-white">
                  <Lock className="mr-3 h-5 w-5 shrink-0 text-slate-400" />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Password আবার লিখুন"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-semibold text-red-600">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

                  <span>{error}</span>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Password পরিবর্তন হচ্ছে..."
                  : "নতুন Password সংরক্ষণ করুন"}
              </button>

              {/* BACK */}
              <div className="mt-5 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition hover:text-orange-500"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Login page-এ ফিরে যান
                </Link>
              </div>
            </>
          )}
        </form>

        <p className="mt-5 text-center text-[10px] text-blue-100/50">
          শ্রমবাজার — Global Workforce Platform
        </p>
      </div>
    </main>
  );
}