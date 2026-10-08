
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Smartphone } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
export default function MobileRegisterPage() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"mobile" | "otp">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOtp(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setError("");

  const cleanMobile = mobile.replace(/\D/g, "");

  if (!cleanMobile) {
    setError("Mobile number দিন।");
    return;
  }

  if (cleanMobile.length !== 11 || !cleanMobile.startsWith("01")) {
    setError("সঠিক 11 digit mobile number দিন।");
    return;
  }

  try {
    setLoading(true);

    const phone = `+880${cleanMobile.slice(1)}`;

    const { error } = await supabase.auth.signInWithOtp({
      phone,
    });

    if (error) {
      throw new Error(error.message);
    }

    setStep("otp");
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "OTP পাঠানো যাচ্ছে না। আবার চেষ্টা করুন।",
    );
  } finally {
    setLoading(false);
  }
}

  async function handleVerifyOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanOtp = otp.replace(/\D/g, "");

    if (cleanOtp.length !== 6) {
      setError("6 digit OTP দিন।");
      return;
    }

    try {
      setLoading(true);

      // OTP verification API এখানে যুক্ত হবে
      router.replace("/complete-profile");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "OTP verification failed। আবার চেষ্টা করুন।",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-[100svh] items-center justify-center overflow-hidden bg-slate-50 px-3 py-3 sm:px-4">
      <div className="w-full max-w-[360px]">
        {/* Back */}
        <Link
          href="/register"
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back to Register
        </Link>

        {/* Compact Card */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5 sm:py-5">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Smartphone size={20} />
            </div>

            <h1 className="mt-2.5 text-lg font-bold tracking-tight text-slate-900">
              {step === "mobile"
                ? "Register with Mobile"
                : "Verify Your Mobile"}
            </h1>

            <p className="mx-auto mt-1 max-w-[300px] text-[11px] leading-4 text-slate-500">
              {step === "mobile"
                ? "Enter your mobile number to receive a verification code."
                : `We sent a 6-digit OTP to ${mobile}.`}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-medium leading-4 text-red-700">
              {error}
            </div>
          )}

          {/* Mobile Step */}
          {step === "mobile" ? (
            <form
              onSubmit={handleSendOtp}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Mobile Number
                </label>

                <div className="flex h-11 w-full overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-slate-400">
  <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-600">
    +880
  </div>

  <input
    type="tel"
    value={mobile}
    onChange={(event) =>
      setMobile(event.target.value.replace(/\D/g, "").slice(0, 11))
    }
    placeholder="17159420000"
    inputMode="numeric"
    autoComplete="tel"
    maxLength={11}
    className="h-full min-w-0 flex-1 bg-white px-3 text-sm outline-none"
  />
</div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            /* OTP Step */
            <form
              onSubmit={handleVerifyOtp}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Enter OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="000000"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-center text-lg font-bold tracking-[0.35em] outline-none transition focus:border-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("mobile");
                  setOtp("");
                  setError("");
                }}
                className="w-full py-1 text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                ← Change Mobile Number
              </button>
            </form>
          )}

          {/* Login */}
          <div className="mt-4 border-t border-slate-100 pt-3 text-center">
            <p className="text-[11px] text-slate-500">
              Already have an account?
            </p>

            <Link
              href="/login"
              className="mt-0.5 inline-block text-xs font-bold text-slate-900 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
