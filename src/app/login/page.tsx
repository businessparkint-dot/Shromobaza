"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailLogin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("আপনার Email Address দিন।");
      return;
    }

    if (!password) {
      setError("আপনার Password দিন।");
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (!data.user) {
        setError("Login করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .maybeSingle();

      const { data: worker } = await supabase
        .from("workers")
        .select("*")
        .eq("profile_id", data.user.id)
        .maybeSingle();

      localStorage.setItem(
  "shromobazar_current_user",
  JSON.stringify({
    ...(profile ?? {}),
    id: data.user.id,
    email: data.user.email ?? cleanEmail,
    phone: data.user.phone ?? null,
    worker: worker ?? null,
  }),
);

window.dispatchEvent(
  new Event("shromobazar-user-updated"),
);

router.replace("/");
    } catch (err) {
      console.error("Email login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Login করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              প্রবেশ করুন
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              আপনার শ্রমবাজার account-এ প্রবেশ করুন
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-semibold leading-5 text-red-600">
              {error}
            </div>
          )}

          {/* Login Information */}
          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3.5">
            <p className="text-sm font-bold leading-6 text-sky-900">
              আপনি যে Email দিয়ে Register করেছেন,
              সেই Email Address ব্যবহার করুন।
            </p>

            <p className="mt-1 text-xs leading-5 text-sky-700">
              Google বা Facebook দিয়ে Register করে থাকলে,
              সেই Account-এর Email Address দিন।
            </p>
          </div>

          {/* Email Login */}
          <form
            onSubmit={handleEmailLogin}
            className="mt-6 space-y-4"
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
                autoComplete="off"
                disabled={loading}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-slate-400 disabled:bg-slate-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword ? "text" : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Your password"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none transition focus:border-slate-400 disabled:bg-slate-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-slate-600 transition hover:text-slate-900"
              >
                Password ভুলে গেছেন?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "প্রবেশ করা হচ্ছে..."
                : "প্রবেশ করুন"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            নতুন account?{" "}
            <Link
              href="/register"
              className="font-bold text-slate-900 hover:underline"
            >
              নিবন্ধন করুন
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          শ্রমবাজার — Global Workforce Platform
        </p>
      </div>
    </main>
  );
}