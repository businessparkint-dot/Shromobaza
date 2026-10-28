
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/client";

type Shop = {
  id: string;
  shop_name: string;
  shop_type: string | null;
  category: string | null;
  location: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  phone: string | null;
  verified: boolean | null;
};

type Product = {
  id: string;
  product_name: string;
  description: string | null;
  price: number | null;
  unit: string | null;
  image_url: string | null;
};

export default function PublicShopPage() {
  const params = useParams<{ id: string }>();
  const shopId = params?.id;

  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shopId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadShop() {
      setLoading(true);
      setError("");

      try {
        const { data: shopData, error: shopError } = await supabase
          .from("shop_profiles")
          .select(
            "id, shop_name, shop_type, category, location, description, logo_url, cover_url, phone, verified"
          )
          .eq("id", shopId)
          .eq("active", true)
          .maybeSingle();

        if (shopError) throw shopError;

        if (!shopData) {
          if (!cancelled) {
            setShop(null);
            setProducts([]);
            setError("এই Shop পাওয়া যায়নি অথবা বর্তমানে সক্রিয় নয়।");
          }
          return;
        }

const { data: shopIdentity, error: identityError } = await supabase
  .from("identities")
  .select("id")
  .eq("identity_type", "shop")
  .eq("display_name", shopData.shop_name)
  .eq("is_active", true)
  .maybeSingle();

if (identityError) throw identityError;

if (!shopIdentity) {
  if (!cancelled) {
    setShop(shopData as Shop);
    setProducts([]);
    setError("এই Shop-এর সক্রিয় Identity পাওয়া যায়নি।");
  }
  return;
}

        const { data: productData, error: productError } = await supabase
          .from("shop_products")
          .select("id, product_name, description, price, unit, image_url")
          .eq("shop_id", shopIdentity.id)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (productError) throw productError;

        if (!cancelled) {
          setShop(shopData as Shop);
          setProducts((productData || []) as Product[]);
        }
      } catch (err: unknown) {
        console.error("Public shop load failed:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? `Shop load failed: ${err.message}`
              : "Shop লোড করা যায়নি। আবার চেষ্টা করুন।"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadShop();

    return () => {
      cancelled = true;
    };
  }, [shopId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border bg-white px-8 py-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
          <p className="font-bold text-slate-700">Shop লোড হচ্ছে...</p>
          <p className="mt-1 text-sm text-slate-400">
            Shromobazar
          </p>
        </div>
      </main>
    );
  }

  if (error || !shop) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
        <section className="w-full max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-3xl">
            🏪
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">
            Shop
          </h1>
          <p className="mt-3 break-words text-sm leading-6 text-red-600">
            {error || "Shop পাওয়া যায়নি।"}
          </p>
          <a
            href="/"
            className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800"
          >
            Home-এ ফিরে যান
          </a>
        </section>
      </main>
    );
  }

  const shopType = `${shop.shop_type || ""} ${shop.category || ""}`.toLowerCase();

  const isFoodShop =
    /food|restaurant|cafe|bakery|রেস্টুরেন্ট|খাবার|ফুড|ক্যাফে/.test(
      shopType
    );

  const shopInitial = shop.shop_name.trim().charAt(0).toUpperCase() || "S";

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-slate-50 to-white pb-10">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-7">
        
        
        {/* Shop cover */}
        <section className="group relative isolate h-52 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-800 to-cyan-800 shadow-xl ring-1 ring-black/5 sm:h-72 lg:h-80">
          {shop.cover_url && (
            <img
              src={shop.cover_url}
              alt={`${shop.shop_name} cover`}
              className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />
          )}

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-slate-900/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/50 via-transparent to-white/5" />

          <div className="flex h-full flex-col justify-between p-4 text-white sm:p-7 lg:p-9">
            <div className="flex items-start justify-between gap-3">
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-3 py-2 text-xs font-extrabold tracking-wide text-white backdrop-blur-md transition hover:bg-white/20 sm:text-sm"
              >
                <span>←</span>
                Shromobazar
              </a>

              {shop.verified && (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200/40 bg-emerald-400/20 px-3 py-2 text-xs font-extrabold text-white shadow-sm backdrop-blur-md">
                  <span>✓</span> Verified Shop
                </span>
              )}
            </div>

            <div className="max-w-3xl">
              <span className="mb-3 inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10px] font-black tracking-[0.18em] text-white backdrop-blur-md sm:text-xs">
                {shop.category || shop.shop_type || "SHROMOBAZAR SHOP"}
              </span>

              <h1 className="break-words text-2xl font-black leading-tight tracking-tight drop-shadow-md sm:text-4xl lg:text-5xl">
                {shop.shop_name}
              </h1>

              {shop.location && (
                <p className="mt-3 flex items-center gap-2 text-xs font-medium text-white/90 sm:text-sm">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10">
                    📍
                  </span>
                  <span className="break-words">{shop.location}</span>
                </p>
              )}
            </div>
          </div>
        </section>


        {/* Shop information */}
        <section className="relative mt-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:mt-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              {shop.logo_url ? (
                <img
                  src={shop.logo_url}
                  alt={`${shop.shop_name} logo`}
                  className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-white object-cover shadow-sm sm:h-20 sm:w-20"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-3xl font-black text-white shadow-sm sm:h-20 sm:w-20">
                  {shopInitial}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="break-words text-xl font-black text-slate-900 sm:text-2xl">
                    {shop.shop_name}
                  </h2>

                  {shop.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                      <span>✓</span> Verified
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {[shop.shop_type, shop.category]
                    .filter(Boolean)
                    .join(" · ") || "Shromobazar Shop"}
                </p>

                {shop.location && (
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    📍 {shop.location}
                  </p>
                )}
              </div>
            </div>

            {shop.phone && (
              <a
                href={`tel:${shop.phone}`}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <span>☎</span>
                যোগাযোগ করুন
              </a>
            )}
          </div>

          {shop.description && (
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="mb-2 text-sm font-extrabold text-slate-800">
                আমাদের সম্পর্কে
              </h3>
              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                {shop.description}
              </p>
            </div>
          )}
        </section>

        {/* Products heading */}
        <section className="mt-8 sm:mt-10">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                {isFoodShop ? "FOOD & DELIGHTS" : "SHOP COLLECTION"}
              </p>

              <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                {isFoodShop ? "আমাদের মেনু" : "Shop Products"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isFoodShop
                  ? "আপনার পছন্দের খাবার ও পণ্য দেখুন"
                  : "আমাদের প্রকাশিত পণ্যগুলো দেখুন"}
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow-sm sm:text-sm">
              {products.length} টি পণ্য
            </span>
          </div>

          {/* Empty state */}
          {products.length === 0 ? (
            <div className="overflow-hidden rounded-3xl border border-dashed border-emerald-200 bg-white px-5 py-10 text-center shadow-sm sm:py-14">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-100 text-4xl">
                {isFoodShop ? "🍽️" : "🛍️"}
              </div>

              <h3 className="mt-5 text-xl font-black text-slate-800">
                {isFoodShop
                  ? "মেনু শিগগিরই আসছে!"
                  : "পণ্য শিগগিরই আসছে!"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">
                এই Shop-এ এখনো কোনো পণ্য প্রকাশ করা হয়নি।
                নতুন পণ্য প্রকাশিত হলে এখানে দেখা যাবে।
              </p>

              {shop.phone && (
                <a
                  href={`tel:${shop.phone}`}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  ☎ Shop-এ যোগাযোগ করুন
                </a>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-emerald-50 sm:h-48">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.product_name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-5xl">
                        {isFoodShop ? "🍲" : "📦"}
                      </span>
                    )}

                    {product.price != null && (
                      <span className="absolute bottom-2 left-2 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-black text-emerald-800 shadow-sm">
                        ৳{product.price}
                        {product.unit ? ` / ${product.unit}` : ""}
                      </span>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="line-clamp-2 break-words font-extrabold text-slate-900">
                      {product.product_name}
                    </h3>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-sm">
                        {product.description}
                      </p>
                    )}

                    {product.price == null && (
                      <p className="mt-3 text-sm font-bold text-emerald-700">
                        মূল্য জানতে যোগাযোগ করুন
                      </p>
                    )}

                    {shop.phone && (
                      <a
                        href={`tel:${shop.phone}`}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-extrabold text-emerald-800 transition hover:bg-emerald-100 sm:text-sm"
                      >
                        ☎ যোগাযোগ করুন
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-slate-200 pt-5 text-center">
          <p className="text-xs text-slate-500">
            Powered by{" "}
            <a href="/" className="font-black text-emerald-700 hover:underline">
              Shromobazar
            </a>
          </p>
          <p className="mt-1 text-xs text-slate-400">
            আপনার ব্যবসা, আপনার পরিচয়
          </p>
        </footer>
      </div>
    </main>
  );
}
