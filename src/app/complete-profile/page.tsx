
"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/client";

const countryCodes = [
  { code: "+880", country: "Bangladesh" },
  { code: "+91", country: "India" },
  { code: "+92", country: "Pakistan" },
  { code: "+977", country: "Nepal" },
  { code: "+94", country: "Sri Lanka" },
  { code: "+971", country: "UAE" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+974", country: "Qatar" },
  { code: "+44", country: "UK" },
  { code: "+1", country: "USA / Canada" },
  { code: "+61", country: "Australia" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+86", country: "China" },
];

export default function CompleteProfilePage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+880");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [verificationFile, setVerificationFile] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const metadata = user.user_metadata ?? {};

      const savedName =
        typeof metadata.name === "string"
          ? metadata.name
          : "";

      const nameParts = savedName.trim().split(/\s+/);

      setFirstName(
        typeof metadata.first_name === "string"
          ? metadata.first_name
          : nameParts[0] || "",
      );

      setLastName(
        typeof metadata.last_name === "string"
          ? metadata.last_name
          : nameParts.slice(1).join(" "),
      );

      const savedPhone =
        typeof metadata.phone === "string"
          ? metadata.phone
          : "";

      if (savedPhone.startsWith("+")) {
        const matchedCode = countryCodes.find((item) =>
          savedPhone.startsWith(item.code),
        );

        if (matchedCode) {
          setCountryCode(matchedCode.code);
          setPhone(savedPhone.slice(matchedCode.code.length));
        } else {
          setPhone(savedPhone);
        }
      } else {
        setPhone(savedPhone);
      }

      setRecoveryEmail(
        typeof metadata.recovery_email === "string"
          ? metadata.recovery_email
          : "",
      );

      setCountry(
        typeof metadata.country === "string"
          ? metadata.country
          : "Bangladesh",
      );

      setDistrict(
        typeof metadata.district === "string"
          ? metadata.district
          : "",
      );

      setCity(
        typeof metadata.city === "string"
          ? metadata.city
          : "",
      );

      setChecking(false);
    }

    loadUser();
  }, [router]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanPhone = phone.trim();
    const cleanRecoveryEmail =
      recoveryEmail.trim().toLowerCase();

    if (!cleanFirstName) {
      setError("First Name দিন।");
      return;
    }

    if (!cleanLastName) {
      setError("Last Name দিন।");
      return;
    }

    if (!cleanPhone) {
      setError("Phone Number দিন।");
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

    if (
      cleanRecoveryEmail &&
      !cleanRecoveryEmail.includes("@")
    ) {
      setError("Recovery Email সঠিকভাবে দিন।");
      return;
    }

    setLoading(true);

    const fullName =
      `${cleanFirstName} ${cleanLastName}`.trim();

    const fullPhone = `${countryCode}${cleanPhone}`;

    const { error: authError } =
      await supabase.auth.updateUser({
        password,
        data: {
          first_name: cleanFirstName,
          last_name: cleanLastName,
          name: fullName,
          phone: fullPhone,
          phone_country_code: countryCode,
          recovery_email:
            cleanRecoveryEmail || null,
          country: country.trim(),
          district: district.trim(),
          city: city.trim(),
          profile_completed: true,
          account_type: "master",
          user_type: "master",
        },
      });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error: profileError } =
        
  await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        name: fullName,
        phone: fullPhone,
        user_type: "master",
        location: [
          city.trim(),
          district.trim(),
          country.trim(),
        ]
          .filter(Boolean)
          .join(", "),
      },
      {
        onConflict: "id",
      },
    );
             
      if (profileError) {
        console.error(
          "Profile save error:",
          profileError.message,
        );
      }
    }

    router.replace("/");
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Complete Your Profile
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Complete your basic account information to continue.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-medium leading-6 text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  First Name
                </label>

                <input
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  placeholder="First Name"
                  autoComplete="given-name"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Last Name
                </label>

                <input
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  placeholder="Last Name"
                  autoComplete="family-name"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </label>

              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(event) =>
                    setCountryCode(event.target.value)
                  }
                  className="w-[125px] shrink-0 rounded-2xl border border-slate-200 bg-white px-3 py-3.5 text-sm font-semibold text-slate-700 outline-none focus:border-slate-400"
                >
                  {countryCodes.map((item) => (
                    <option
                      key={item.code}
                      value={item.code}
                    >
                      {item.code} · {item.country}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Phone number"
                  autoComplete="tel"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-400"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Include your country code for international access.
              </p>
            </div>

       
{/* Security */}
<div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
  <p className="text-sm font-bold text-slate-800">
    Login Security
  </p>

  <p className="mt-1 text-xs leading-5 text-slate-500">
    Create a password so you can use Phone + Password
    to access your account later.
  </p>

  <div className="mt-4 grid gap-4 sm:grid-cols-2">
    {/* Password */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Password
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Create password"
          autoComplete="new-password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none focus:border-slate-400"
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

    {/* Confirm Password */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Confirm Password
      </label>

      <div className="relative">
        <input
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
          placeholder="Confirm password"
          autoComplete="new-password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-sm outline-none focus:border-slate-400"
        />

        <button
          type="button"
          onClick={() =>
            setShowConfirmPassword((value) => !value)
          }
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label={
            showConfirmPassword
              ? "Hide confirm password"
              : "Show confirm password"
          }
        >
          {showConfirmPassword ? "🙈" : "👁️"}
        </button>
      </div>
    </div>
  </div>

  <p className="mt-3 text-xs text-slate-500">
    Keep your password secret. Shromobazar will never
    ask you to share it.
  </p>
</div>


            {/* Recovery Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Recovery Email{" "}
                <span className="font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <input
                type="email"
                value={recoveryEmail}
                onChange={(event) =>
                  setRecoveryEmail(event.target.value)
                }
                placeholder="For account recovery"
                autoComplete="email"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-400"
              />
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Where are you from?
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  This helps us personalize your Shromobazar
                  experience.
                </p>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Country
                  </label>

                  <input
                    type="text"
                    value={country}
                    onChange={(event) =>
                      setCountry(event.target.value)
                    }
                    placeholder="Country"
                    autoComplete="country-name"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      District / Region
                    </label>

                    <input
                      type="text"
                      value={district}
                      onChange={(event) =>
                        setDistrict(event.target.value)
                      }
                      placeholder="District / Region"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      City / Area
                    </label>

                    <input
                      type="text"
                      value={city}
                      onChange={(event) =>
                        setCity(event.target.value)
                      }
                      placeholder="City / Area"
                      autoComplete="address-level2"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Identity Verification */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">
                    Identity Verification
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Optional — strengthen your profile and build trust.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                  Optional
                </span>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  NID / Passport / Driving Licence
                </label>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(event) =>
                    setVerificationFile(
                      event.target.files?.[0] ?? null,
                    )
                  }
                  className="block w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                />

                {verificationFile && (
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                    Selected: {verificationFile.name}
                  </p>
                )}

                <p className="mt-2 text-[11px] leading-5 text-slate-400">
                  You can skip this for now. Verification is not
                  required to complete your profile.
                </p>
              </div>
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}