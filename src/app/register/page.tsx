"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowLeft, Mail, Facebook, Smartphone } from "lucide-react";

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

  async function handleGoogle() {
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Google দিয়ে registration শুরু করা যাচ্ছে না।",
      );
      setLoading(false);
    }
  }

  async function handleFacebook() {
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Facebook দিয়ে registration শুরু করা যাচ্ছে না।",
      );
      setLoading(false);
    }
  }

  async function handleEmailRegister(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Email address দিন।");
      return;
    }

    if (password.length < 6) {
      setError("Password কমপক্ষে 6 characters হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password দুটো একই নয়।");
      return;
    }

    if (!agree) {
      setError("Terms & Conditions গ্রহণ করুন।");
      return;
    }

    try {
      setLoading(true);

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

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        router.replace("/complete-profile");
        return;
      }

      setError(
        "Registration সফল হয়েছে। আপনার email-এ verification link পাঠানো হয়েছে। Email verify করার পর Login করে Complete Your Profile-এ যেতে পারবেন.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Registration সম্পন্ন করা যাচ্ছে না। আবার চেষ্টা করুন।";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="text-center">
           <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Create Your Shromobazar Account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              One Master Account for your Shromobazar journey.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-medium leading-6 text-red-700">
              {error}
            </div>
          )}

          {!showEmailForm ? (
            <div className="mt-8 space-y-3">
              {/* Mobile Registration */}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  router.push("/register/mobile");
                }}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Smartphone size={19} />
                Continue with Mobile
              </button>

              {/* OR Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  OR
                </span>

                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Email Registration */}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowEmailForm(true);
                }}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Mail size={19} />
                Continue with Email
              </button>

              {/* Google + Facebook */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="text-lg font-bold text-[#4285F4]">
                    G
                  </span>

                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebook}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1877F2] text-sm font-bold text-white">
                    f
                  </span>

                  <span>Facebook</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleEmailRegister}
              className="mt-8 space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-slate-400"
                />
              </div>

              <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(event) =>
                    setAgree(event.target.checked)
                  }
                  className="mt-1"
                />

                <span>
                  I agree to Shromobazar&apos;s Terms &
                  Conditions and Privacy Policy.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Account..."
                  : "Continue with Email"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setShowEmailForm(false);
                }}
                className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
              >
                ← Back
              </button>
            </form>
          )}

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-1 inline-block text-sm font-bold text-slate-900 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}