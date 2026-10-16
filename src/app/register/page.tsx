
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Mail, LoaderCircle } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey,
);

export default function RegisterPage() {
  const router = useRouter();

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function handleOAuth(provider: "google" | "facebook") {
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams:
            provider === "google"
              ? { access_type: "offline", prompt: "select_account" }
              : undefined,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `${provider} দিয়ে চালু করা যাচ্ছে না। আবার চেষ্টা করুন।`,
      );
      setLoading(false);
    }
  }

  async function handleEmailRegister(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setNotice("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("আপনার Email Address লিখুন।");
      return;
    }

    if (password.length < 6) {
      setError("Password কমপক্ষে ৬টি character হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("দুটি Password একই নয়।");
      return;
    }

    if (!agree) {
      setError("Terms & Conditions এবং Privacy Policy গ্রহণ করুন।");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            user_type: "master",
            account_type: "master",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.session) {
        router.replace("/complete-profile");
        router.refresh();
        return;
      }

      setNotice(
        "Registration অনুরোধ সফল হয়েছে। আপনার Email Inbox এবং Spam folder-এ Verification Link দেখুন। Email verify করার পর Login করুন।",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration সম্পন্ন হয়নি। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-slate-50 px-3 py-4 sm:px-5 sm:py-8">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-3 inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Home
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <header className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Create Your Shromobazar Account
            </h1>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-5 text-slate-500">
              One Master Account for your Shromobazar journey.
            </p>
          </header>

          {error && (
            <div
              role="alert"
              className="mt-4 break-words rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-5 text-red-700"
            >
              {error}
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="mt-4 break-words rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm leading-5 text-emerald-800"
            >
              {notice}
            </div>
          )}

          {!showEmailForm ? (
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setNotice("");
                  setShowEmailForm(true);
                }}
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <Mail size={19} />
                Continue with Email
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  OR CONTINUE WITH
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={() => handleOAuth("google")}
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle size={19} className="animate-spin" />
                ) : (
                  <span className="text-lg font-bold text-[#4285F4]">
                    G
                  </span>
                )}
                Continue with Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuth("facebook")}
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <LoaderCircle size={19} className="animate-spin" />
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-sm font-bold text-white">
                    f
                  </span>
                )}
                Continue with Facebook
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleEmailRegister}
              className="mt-5 space-y-3"
            >
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-1.5 block text-sm font-semibold text-slate-700"
                >
                  Confirm Password
                </label>
                <input
                  id="register-confirm-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm your password"
                  className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:text-sm"
                />
              </div>

              <label className="flex items-start gap-2.5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                <input
                  type="checkbox"
                  required
                  checked={agree}
                  onChange={(event) => setAgree(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-slate-900"
                />
                <span>
                  I agree to Shromobazar&apos;s Terms &amp; Conditions
                  and Privacy Policy.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <LoaderCircle size={18} className="animate-spin" />
                )}
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setError("");
                  setNotice("");
                  setShowEmailForm(false);
                }}
                className="min-h-10 w-full text-sm font-semibold text-slate-500 hover:text-slate-900 disabled:opacity-60"
              >
                <span aria-hidden="true">← </span>
                Back to Registration Options
              </button>
            </form>
          )}

          <footer className="mt-5 border-t border-slate-100 pt-4 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="mt-1 inline-block py-1 text-sm font-bold text-slate-900 hover:underline"
            >
              Login
            </Link>
          </footer>
        </section>
      </div>
    </main>
  );
}