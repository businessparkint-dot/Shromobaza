"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Package,
  ShoppingBag,
  ShieldCheck,
  Store,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

import { supabase } from "@/lib/client";

const shopCategories = [
  "Food & Grocery",
  "Restaurant & Food",
  "Clothing & Fashion",
  "Electronics",
  "Mobile & Accessories",
  "Home & Furniture",
  "Construction Materials",
  "Hardware & Tools",
  "Beauty & Cosmetics",
  "Pharmacy & Health",
  "Books & Education",
  "Agriculture",
  "Automobile & Parts",
  "Sports",
  "Art & Creative",
  "Industrial Products",
  "Services",
  "Other",
];

const shopTypes = [
  {
    value: "retail",
    title: "Retail",
    description: "সরাসরি সাধারণ ক্রেতার কাছে পণ্য বিক্রি করুন",
    icon: ShoppingBag,
  },
  {
    value: "wholesale",
    title: "Wholesale",
    description:
      "বড় পরিমাণে ব্যবসায়ী ও রিসেলারদের কাছে পণ্য বিক্রি করুন",
    icon: Warehouse,
    featured: true,
  },
  {
    value: "both",
    title: "Retail + Wholesale",
    description:
      "একই Shop থেকে Retail ও Wholesale দুটো ব্যবসা করুন",
    icon: Store,
  },
];

const representativeRoles = [
  {
    value: "owner",
    title: "Owner / Founder",
    description: "আমি Shop-এর মালিক বা প্রতিষ্ঠাতা।",
  },
  {
    value: "authorized_representative",
    title: "Authorized Representative",
    description:
      "আমি Shop-এর পক্ষ থেকে অনুমোদিত প্রতিনিধি।",
  },
  {
    value: "manager_admin",
    title: "Manager / Admin",
    description:
      "আমি Shop-এর Manager বা Administrator।",
  },
  {
    value: "other_authorized",
    title: "Other Authorized Person",
    description:
      "আমি অন্যভাবে Shop-এর হয়ে কাজ করার অনুমতি পেয়েছি।",
  },
];

export default function OpenYourShopPage() {
  const router = useRouter();

  const [shopType, setShopType] = useState("retail");
  const [category, setCategory] = useState("");
  const [shopName, setShopName] = useState("");
  const [location, setLocation] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [minimumOrder, setMinimumOrder] = useState("");
  const [warehouse, setWarehouse] = useState(false);
  const [resellerSupply, setResellerSupply] = useState(false);

  const [representativeRole, setRepresentativeRole] =
    useState("owner");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedType = useMemo(
    () => shopTypes.find((item) => item.value === shopType),
    [shopType]
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanShopName = shopName.trim();
    const cleanLocation = location.trim();
    const cleanDeliveryArea = deliveryArea.trim();
    const cleanMinimumOrder = minimumOrder.trim();

    if (!cleanShopName) {
      setErrorMessage("Shop-এর নাম দিন।");
      return;
    }

    if (!category) {
      setErrorMessage("Shop-এর Category নির্বাচন করুন।");
      return;
    }

    if (!cleanLocation) {
      setErrorMessage("Shop Location দিন।");
      return;
    }

    if (!representativeRole) {
      setErrorMessage(
        "Shop-এর সাথে আপনার ভূমিকা নির্বাচন করুন।"
      );
      return;
    }

    try {
      setSubmitting(true);

      // --------------------------------------------------
      // 1. CHECK LOGGED-IN USER
      // --------------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        setErrorMessage(
          "Shop Registration করতে আগে Login করুন।"
        );

        setSubmitting(false);

        setTimeout(() => {
          router.push(
            `/login?redirect=${encodeURIComponent(
              "/open-your-shop"
            )}`
          );
        }, 900);

        return;
      }

      // --------------------------------------------------
      // 2. MAP UI SHOP TYPE TO DATABASE VALUE
      // --------------------------------------------------

      const databaseShopType =
        shopType === "both"
          ? "retail_wholesale"
          : shopType;

      // --------------------------------------------------
      // 3. INSERT SHOP PROFILE
      // --------------------------------------------------

      const { data, error } = await supabase
        .from("shop_profiles")
        .insert({
          created_by: user.id,

          shop_name: cleanShopName,

          shop_type: databaseShopType,

          category,

          location: cleanLocation,

          delivery_area:
            cleanDeliveryArea || null,

          minimum_order_quantity:
            shopType === "wholesale" ||
            shopType === "both"
              ? cleanMinimumOrder || null
              : null,

          has_warehouse:
            shopType === "wholesale" ||
            shopType === "both"
              ? warehouse
              : false,

          reseller_supply:
            shopType === "wholesale" ||
            shopType === "both"
              ? resellerSupply
              : false,

          active: true,

          verified: false,

          subscription_plan: "free",

          subscription_status: "inactive",
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.id) {
        throw new Error(
          "Shop registration তৈরি হয়েছে, কিন্তু Shop ID পাওয়া যায়নি।"
        );
      }

      // --------------------------------------------------
      // 4. SUCCESS
      // --------------------------------------------------

      setSuccessMessage(
        "আপনার Shop Registration সফলভাবে সম্পন্ন হয়েছে।"
      );

      // --------------------------------------------------
      // 5. REDIRECT TO SHOP PROFILE
      // --------------------------------------------------

      setTimeout(() => {
        router.push(
          `/open-your-shop/profile?id=${encodeURIComponent(
            data.id
          )}`
        );
      }, 1000);
    } catch (error) {
      console.error(
        "Shop registration error:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Shop Registration সম্পন্ন করা যায়নি।";

      setErrorMessage(message);
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <section className="bg-[#081B3A] px-4 pb-12 pt-7 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/marketplace"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Marketplace-এ ফিরে যান
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
                <Store size={16} />
                Open Your Shop
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                আপনার নিজের Shop খুলুন
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Retail, Wholesale অথবা দুই ধরনের ব্যবসা একসাথে
                পরিচালনা করুন। আপনার Shop Profile তৈরি করে
                ভবিষ্যতে নিজের Shop Website / Storefront চালু
                করতে পারবেন।
              </p>
            </div>

            <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-5 lg:w-72">
              <div className="flex items-center gap-3">
                <Warehouse
                  className="text-orange-400"
                  size={25}
                />

                <div>
                  <p className="font-bold text-orange-300">
                    Wholesale Ready
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-300">
                    Bulk order ও reseller supply-এর জন্য
                    প্রস্তুত
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <form onSubmit={handleSubmit}>
            {/* SHOP TYPE */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step 01
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  আপনার Shop-এর ধরন নির্বাচন করুন
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  আপনি কীভাবে পণ্য বিক্রি করতে চান তা নির্বাচন
                  করুন।
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {shopTypes.map((type) => {
                  const Icon = type.icon;
                  const active = shopType === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setShopType(type.value)}
                      className={`relative rounded-2xl border p-5 text-left transition ${
                        active
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      {type.featured && (
                        <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold text-white">
                          IMPORTANT
                        </span>
                      )}

                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                          active
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon size={24} />
                      </div>

                      <h3 className="mt-4 font-bold text-slate-900">
                        {type.title}
                      </h3>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {type.description}
                      </p>

                      {active && (
                        <CheckCircle2
                          className="absolute bottom-4 right-4 text-blue-600"
                          size={20}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* REPRESENTATIVE ROLE */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step 02
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  আপনি Shop-এর হয়ে কোন ভূমিকায় নিবন্ধন করছেন?
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Shop-এর মালিক হওয়া বাধ্যতামূলক নয়। Owner,
                  Authorized Representative, Manager বা অন্য
                  অনুমোদিত ব্যক্তি Shop নিবন্ধন করতে পারবেন।
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {representativeRoles.map((role) => {
                  const active =
                    representativeRole === role.value;

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() =>
                        setRepresentativeRole(role.value)
                      }
                      className={`relative rounded-2xl border p-5 text-left transition ${
                        active
                          ? "border-orange-400 bg-orange-50 ring-2 ring-orange-100"
                          : "border-slate-200 bg-white hover:border-orange-300 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            active
                              ? "bg-orange-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <ShieldCheck size={22} />
                        </div>

                        <div className="pr-7">
                          <h3 className="font-bold text-slate-900">
                            {role.title}
                          </h3>

                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            {role.description}
                          </p>
                        </div>
                      </div>

                      {active && (
                        <CheckCircle2
                          className="absolute right-4 top-5 text-orange-500"
                          size={20}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <p className="text-xs leading-5 text-blue-900">
                    <span className="font-black">
                      গুরুত্বপূর্ণ:
                    </span>{" "}
                    Shop একটি আলাদা Business Entity হিসেবে থাকবে।
                    ভবিষ্যতে একই Shop-এ Owner, Manager, Staff বা
                    অন্যান্য authorized member যুক্ত করা যাবে।
                  </p>
                </div>
              </div>
            </section>

            {/* BASIC INFORMATION */}
            <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Step 03
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Shop-এর তথ্য
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Shop-এর নাম
                  </label>

                  <input
                    value={shopName}
                    onChange={(e) =>
                      setShopName(e.target.value)
                    }
                    required
                    placeholder="যেমন: Rahman Trading"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    প্রধান Category
                  </label>

                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value)
                      }
                      required
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">
                        Category নির্বাচন করুন
                      </option>

                      {shopCategories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Shop Location
                  </label>

                  <input
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    required
                    placeholder="জেলা / শহর / এলাকা"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Delivery Area
                  </label>

                  <input
                    value={deliveryArea}
                    onChange={(e) =>
                      setDeliveryArea(e.target.value)
                    }
                    placeholder="যেমন: Dhaka, Chattogram, All Bangladesh"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>
            </section>

            {/* WHOLESALE */}
            {(shopType === "wholesale" ||
              shopType === "both") && (
              <section className="mt-6 rounded-3xl border border-orange-200 bg-orange-50 p-5 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <Package size={23} />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                      Wholesale Business
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      Bulk Business Information
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Wholesale customer, reseller এবং বড়
                      অর্ডারের জন্য অতিরিক্ত তথ্য দিন।
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Minimum Order Quantity / Value
                    </label>

                    <input
                      value={minimumOrder}
                      onChange={(e) =>
                        setMinimumOrder(e.target.value)
                      }
                      placeholder="যেমন: 50 pcs / ৳10,000"
                      className="w-full rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-200 bg-white p-4">
                    <input
                      type="checkbox"
                      checked={warehouse}
                      onChange={(e) =>
                        setWarehouse(e.target.checked)
                      }
                      className="h-5 w-5 accent-orange-500"
                    />

                    <span>
                      <span className="block text-sm font-bold text-slate-800">
                        Warehouse / Stock আছে
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        Bulk stock ও warehouse information
                        দেখানো যাবে
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-orange-200 bg-white p-4 md:col-span-2">
                    <input
                      type="checkbox"
                      checked={resellerSupply}
                      onChange={(e) =>
                        setResellerSupply(e.target.checked)
                      }
                      className="h-5 w-5 accent-orange-500"
                    />

                    <span>
                      <span className="block text-sm font-bold text-slate-800">
                        Reseller Supply করি
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        Retailer / reseller-দের নিয়মিত পণ্য
                        সরবরাহ করতে চাই
                      </span>
                    </span>
                  </label>
                </div>
              </section>
            )}

            {/* FUTURE STORE */}
            <section className="mt-6 rounded-3xl border border-blue-100 bg-blue-50 p-5 sm:p-7">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center gap-4">
                  <Store
                    className="text-blue-600"
                    size={28}
                  />

                  <div>
                    <p className="font-bold text-slate-900">
                      Shop Profile
                    </p>

                    <p className="text-xs text-slate-500">
                      আপনার ব্যবসার পরিচিতি
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <ShoppingBag
                    className="text-blue-600"
                    size={28}
                  />

                  <div>
                    <p className="font-bold text-slate-900">
                      Product Catalog
                    </p>

                    <p className="text-xs text-slate-500">
                      পণ্য ও দাম দেখানোর ব্যবস্থা
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Truck
                    className="text-blue-600"
                    size={28}
                  />

                  <div>
                    <p className="font-bold text-slate-900">
                      Delivery
                    </p>

                    <p className="text-xs text-slate-500">
                      Delivery area ও order workflow
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ACCESS MODEL */}
            <section className="mt-6 rounded-3xl border border-orange-100 bg-orange-50 p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                  <Users size={24} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    Shop Access
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    একটি Shop একাধিক মানুষ পরিচালনা করতে পারবেন
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-orange-900/80">
                    Registration-এর পর Shop-টি একটি আলাদা
                    Business Entity হিসেবে থাকবে। ভবিষ্যতে Owner,
                    Authorized Representative, Manager, Staff এবং
                    অন্যান্য সদস্যকে access দেওয়া যাবে।
                  </p>
                </div>
              </div>
            </section>

            {/* ERROR */}
            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                {errorMessage}
              </div>
            )}

            {/* SUCCESS */}
            {successMessage && (
              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={19} />
                  {successMessage}
                </div>
              </div>
            )}

            {/* SUBMIT */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                বাতিল
              </Link>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Registration হচ্ছে..."
                  : "Shop Registration শুরু করুন"}

                {!submitting && <ArrowRight size={17} />}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              Selected:{" "}
              {selectedType?.title ||
                "Shop Type নির্বাচন করুন"}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}