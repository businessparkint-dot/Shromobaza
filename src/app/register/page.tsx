"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

type Country = {
  name: string;
  code: string;
  dial: string;
  regions: string[];
};

const countries: Country[] = [
  {
    name: "Bangladesh",
    code: "BD",
    dial: "+880",
    regions: [
      "Bagerhat",
      "Bandarban",
      "Barguna",
      "Barishal",
      "Bhola",
      "Bogura",
      "Brahmanbaria",
      "Chandpur",
      "Chattogram",
      "Chuadanga",
      "Cox's Bazar",
      "Cumilla",
      "Dhaka",
      "Dinajpur",
      "Faridpur",
      "Feni",
      "Gaibandha",
      "Gazipur",
      "Gopalganj",
      "Habiganj",
      "Jamalpur",
      "Jashore",
      "Jhalokathi",
      "Jhenaidah",
      "Joypurhat",
      "Khagrachhari",
      "Khulna",
      "Kishoreganj",
      "Kurigram",
      "Kushtia",
      "Lakshmipur",
      "Lalmonirhat",
      "Madaripur",
      "Magura",
      "Manikganj",
      "Meherpur",
      "Moulvibazar",
      "Munshiganj",
      "Mymensingh",
      "Naogaon",
      "Narail",
      "Narayanganj",
      "Narsingdi",
      "Natore",
      "Nawabganj",
      "Netrokona",
      "Nilphamari",
      "Noakhali",
      "Pabna",
      "Panchagarh",
      "Patuakhali",
      "Pirojpur",
      "Rajbari",
      "Rajshahi",
      "Rangamati",
      "Rangpur",
      "Satkhira",
      "Shariatpur",
      "Sherpur",
      "Sirajganj",
      "Sunamganj",
      "Sylhet",
      "Tangail",
      "Thakurgaon",
    ],
  },
  {
    name: "India",
    code: "IN",
    dial: "+91",
    regions: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Delhi",
      "Jammu and Kashmir",
      "Ladakh",
    ],
  },
  {
    name: "Pakistan",
    code: "PK",
    dial: "+92",
    regions: [
      "Punjab",
      "Sindh",
      "Khyber Pakhtunkhwa",
      "Balochistan",
      "Islamabad Capital Territory",
      "Gilgit-Baltistan",
      "Azad Jammu and Kashmir",
    ],
  },
  {
    name: "United Arab Emirates",
    code: "AE",
    dial: "+971",
    regions: [
      "Abu Dhabi",
      "Dubai",
      "Sharjah",
      "Ajman",
      "Umm Al Quwain",
      "Ras Al Khaimah",
      "Fujairah",
    ],
  },
  {
    name: "Saudi Arabia",
    code: "SA",
    dial: "+966",
    regions: [
      "Riyadh",
      "Makkah",
      "Madinah",
      "Eastern Province",
      "Asir",
      "Tabuk",
      "Hail",
      "Jazan",
      "Najran",
      "Al Bahah",
      "Al Jawf",
      "Northern Borders",
    ],
  },
  {
    name: "Qatar",
    code: "QA",
    dial: "+974",
    regions: [
      "Doha",
      "Al Rayyan",
      "Al Wakrah",
      "Al Khor",
      "Al Shamal",
      "Umm Salal",
    ],
  },
  {
    name: "United Kingdom",
    code: "GB",
    dial: "+44",
    regions: [
      "England",
      "Scotland",
      "Wales",
      "Northern Ireland",
    ],
  },
  {
    name: "United States",
    code: "US",
    dial: "+1",
    regions: [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Florida",
      "Georgia",
      "Illinois",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "New Jersey",
      "New York",
      "North Carolina",
      "Ohio",
      "Oregon",
      "Pennsylvania",
      "Texas",
      "Virginia",
      "Washington",
      "Other State",
    ],
  },
  {
    name: "Canada",
    code: "CA",
    dial: "+1",
    regions: [
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Nova Scotia",
      "Ontario",
      "Quebec",
      "Saskatchewan",
      "Newfoundland and Labrador",
      "Prince Edward Island",
      "Northwest Territories",
      "Nunavut",
      "Yukon",
    ],
  },
  {
    name: "Australia",
    code: "AU",
    dial: "+61",
    regions: [
      "New South Wales",
      "Queensland",
      "South Australia",
      "Tasmania",
      "Victoria",
      "Western Australia",
      "Australian Capital Territory",
      "Northern Territory",
    ],
  },
  {
    name: "Malaysia",
    code: "MY",
    dial: "+60",
    regions: [
      "Johor",
      "Kedah",
      "Kelantan",
      "Malacca",
      "Negeri Sembilan",
      "Pahang",
      "Penang",
      "Perak",
      "Perlis",
      "Sabah",
      "Sarawak",
      "Selangor",
      "Terengganu",
      "Kuala Lumpur",
      "Putrajaya",
      "Labuan",
    ],
  },
  {
    name: "Singapore",
    code: "SG",
    dial: "+65",
    regions: [],
  },
  {
    name: "Italy",
    code: "IT",
    dial: "+39",
    regions: [],
  },
  {
    name: "Germany",
    code: "DE",
    dial: "+49",
    regions: [],
  },
  {
    name: "France",
    code: "FR",
    dial: "+33",
    regions: [],
  },
  {
    name: "Japan",
    code: "JP",
    dial: "+81",
    regions: [],
  },
  {
    name: "South Korea",
    code: "KR",
    dial: "+82",
    regions: [],
  },
  {
    name: "China",
    code: "CN",
    dial: "+86",
    regions: [],
  },
  {
    name: "Other Country",
    code: "OTHER",
    dial: "",
    regions: [],
  },
];

function normalizePhone(phone: string, dialCode: string) {
  const clean = phone.replace(/[^\d+]/g, "");

  if (clean.startsWith("+")) {
    return clean;
  }

  const digits = clean.replace(/\D/g, "");

  if (!dialCode) {
    return digits;
  }

  if (dialCode === "+880" && digits.startsWith("0")) {
    return `${dialCode}${digits.slice(1)}`;
  }

  return `${dialCode}${digits}`;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing in .env.local");
}

if (!supabasePublishableKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is missing in .env.local"
  );
}

const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey
);

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("BD");
  const [countrySearch, setCountrySearch] = useState("");

  const [region, setRegion] = useState("");
  const [regionSearch, setRegionSearch] = useState("");

  const [city, setCity] = useState("");

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [password, setPassword] = useState("");

  const [isExpat, setIsExpat] = useState(false);
  const [homeDistrict, setHomeDistrict] = useState("");

  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedCountry =
    countries.find((country) => country.code === countryCode) ??
    countries[0];

  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLowerCase();

    if (!query) return countries;

    return countries.filter((country) =>
      country.name.toLowerCase().includes(query)
    );
  }, [countrySearch]);

  const filteredRegions = useMemo(() => {
    const query = regionSearch.trim().toLowerCase();

    if (!query) return selectedCountry.regions;

    return selectedCountry.regions.filter((item) =>
      item.toLowerCase().includes(query)
    );
  }, [regionSearch, selectedCountry]);

  const bangladesh = countries.find(
    (country) => country.code === "BD"
  );

  function handleCountryChange(code: string) {
    setCountryCode(code);
    setRegion("");
    setRegionSearch("");
    setCountrySearch("");
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCity = city.trim();
    const cleanRegion = region.trim();
    const cleanNid = nid.trim();
    const cleanHomeDistrict = homeDistrict.trim();

    if (cleanName.length < 2) {
      setError("আপনার পূর্ণ নাম লিখুন।");
      return;
    }

    if (!phone.trim()) {
      setError("Mobile Number লিখুন।");
      return;
    }

    if (selectedCountry.code === "BD") {
      const bdPhone = phone.replace(/\D/g, "");

      if (
        !/^01\d{9}$/.test(bdPhone) &&
        !/^\+8801\d{9}$/.test(phone.trim())
      ) {
        setError("সঠিক Bangladesh mobile number দিন।");
        return;
      }
    }

    if (!cleanCity) {
      setError("City / Area লিখুন।");
      return;
    }

    if (isExpat && selectedCountry.code === "BD") {
      setError(
        "আপনি Bangladesh-এ থাকলে প্রবাসী option-এর প্রয়োজন নেই।"
      );
      return;
    }

    if (isExpat && !cleanHomeDistrict) {
      setError("প্রবাসী বাংলাদেশির Home District নির্বাচন করুন।");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("সঠিক Email Address দিন।");
      return;
    }

    if (password.length < 6) {
      setError("Password কমপক্ষে ৬ অক্ষরের হতে হবে।");
      return;
    }

    if (!agree) {
      setError("Terms & Conditions মেনে নিতে হবে।");
      return;
    }

    setLoading(true);

    try {
      const normalizedPhone = normalizePhone(
        phone.trim(),
        selectedCountry.dial
      );

      const currentLocationParts = [
        cleanCity,
        cleanRegion,
        selectedCountry.name,
      ].filter(Boolean);

      const location = currentLocationParts.join(", ");

      const { data: authData, error: authError } =
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              name: cleanName,
              phone: normalizedPhone,

              country: selectedCountry.name,
              country_code: selectedCountry.code,

              region: cleanRegion,
              city: cleanCity,

              location,

              nid: cleanNid || null,

              is_expat: isExpat,

              home_district: isExpat
                ? cleanHomeDistrict
                : selectedCountry.code === "BD"
                  ? cleanRegion
                  : null,

              user_type: "master",
              account_type: "master",
            },
          },
        });

      if (authError) {
        throw authError;
      }

      const user = authData.user;

      if (!user) {
        throw new Error(
          "Account তৈরি করা যায়নি। আবার চেষ্টা করুন।"
        );
      }

      /*
       * Existing profile structure ব্যবহার করা হচ্ছে।
       * Worker row এখানে তৈরি করা হচ্ছে না।
       */
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            name: cleanName,
            phone: normalizedPhone,
            email: cleanEmail,
            location,
            nid: cleanNid || null,
            user_type: "master",
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      const currentUser = {
        id: user.id,
        name: cleanName,
        phone: normalizedPhone,
        email: cleanEmail,

        country: selectedCountry.name,
        country_code: selectedCountry.code,
        region: cleanRegion,
        city: cleanCity,

        location,

        nid: cleanNid || null,

        is_expat: isExpat,
        home_district: isExpat
          ? cleanHomeDistrict
          : selectedCountry.code === "BD"
            ? cleanRegion
            : null,

        user_type: "master",
        account_type: "master",
      };

      localStorage.setItem(
        "shromobazar_current_user",
        JSON.stringify(currentUser)
      );

      setSuccess(
        "Master Account সফলভাবে তৈরি হয়েছে। আপনার Shromobazar account প্রস্তুত।"
      );

      setTimeout(() => {
        router.replace("/account");
      }, 900);
    } catch (err: unknown) {
      console.error("Registration error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. আবার চেষ্টা করুন।";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50 px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shromobazar
        </Link>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-white sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <Globe2 className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-2xl font-black sm:text-3xl">
                  Shromobazar Master Account
                </h1>

                <p className="mt-2 text-sm leading-6 text-orange-50 sm:text-base">
                  একটি Account থেকেই Worker, Employer, Customer,
                  Business এবং অন্যান্য Identity ব্যবহার করা যাবে।
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-7 sm:px-8">
            <div className="mb-6 rounded-2xl border border-orange-100 bg-orange-50 p-4">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    One Global Account
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Bangladesh এবং বিশ্বের অন্যান্য দেশের ব্যবহারকারীরা
                    এই account তৈরি করতে পারবেন। Worker-এর profession,
                    skills ও experience আলাদা Worker Identity-তে থাকবে।
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম"
                    autoComplete="name"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Country
                </label>

                <input
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Country search করুন"
                  className="mb-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />

                <select
                  value={countryCode}
                  onChange={(e) =>
                    handleCountryChange(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  {filteredCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                      {country.dial ? ` (${country.dial})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Mobile Number
                </label>

                <div className="flex gap-2">
                  <div className="flex h-12 min-w-[88px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700">
                    {selectedCountry.dial || "Code"}
                  </div>

                  <div className="relative flex-1">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={
                        selectedCountry.code === "BD"
                          ? "01XXXXXXXXX"
                          : "Mobile number"
                      }
                      autoComplete="tel"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>

              {/* Region */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {selectedCountry.code === "BD"
                    ? "District"
                    : "State / Province / Region"}
                </label>

                {selectedCountry.regions.length > 0 ? (
                  <>
                    <input
                      value={regionSearch}
                      onChange={(e) =>
                        setRegionSearch(e.target.value)
                      }
                      placeholder={
                        selectedCountry.code === "BD"
                          ? "District search করুন"
                          : "State / Region search করুন"
                      }
                      className="mb-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />

                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    >
                      <option value="">
                        Select{" "}
                        {selectedCountry.code === "BD"
                          ? "District"
                          : "Region"}
                      </option>

                      {filteredRegions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <input
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="State / Province / Region"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                )}
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  City / Area
                </label>

                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="আপনার City / Area লিখুন"
                    autoComplete="address-level2"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  পৃথিবীর যেকোনো City / Area এখানে লিখতে পারবেন।
                </p>
              </div>

              {/* Expat */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isExpat}
                    onChange={(e) =>
                      setIsExpat(e.target.checked)
                    }
                    className="mt-1 h-4 w-4 accent-orange-500"
                  />

                  <span>
                    <span className="block text-sm font-black text-slate-800">
                      আমি প্রবাসী বাংলাদেশি
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      বিদেশে বসবাসরত বাংলাদেশিদের জন্য।
                    </span>
                  </span>
                </label>

                {isExpat && (
                  <div className="mt-4 rounded-xl border border-orange-100 bg-white p-4">
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      বাংলাদেশের Home District
                    </label>

                    <select
                      value={homeDistrict}
                      onChange={(e) =>
                        setHomeDistrict(e.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    >
                      <option value="">
                        Select Home District
                      </option>

                      {bangladesh?.regions.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* NID */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  NID / National ID{" "}
                  <span className="font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <input
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  placeholder="National ID number"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-12 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) =>
                    setAgree(e.target.checked)
                  }
                  className="mt-1 h-4 w-4 accent-orange-500"
                />

                <span className="text-xs leading-5 text-slate-600">
                  আমি Shromobazar-এর Terms & Conditions এবং Privacy
                  Policy মেনে নিচ্ছি।
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 w-full items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Account তৈরি হচ্ছে..."
                  : "Create Master Account"}
              </button>
            </form>

            <div className="mt-7 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?
              </p>

              <Link
                href="/login"
                className="mt-1 inline-block text-sm font-black text-orange-600 hover:text-orange-700"
              >
                Login করুন
              </Link>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-center text-xs leading-5 text-slate-500">
                <span className="font-bold text-slate-700">
                  Worker হতে চান?
                </span>{" "}
                Master Account তৈরি করার পর আলাদা Worker Identity তৈরি
                করা যাবে।
              </p>

              <div className="mt-3 text-center">
                <Link
                  href="/worker-register"
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  Worker Registration →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}