"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ExternalLink,
  Filter,
  Globe,
  ImagePlus,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Share2,
  ShoppingBag,
  Store,
  Trash2,
  X,
  Save,
  Edit3,
  Home,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/lib/client";

type ShopProfile = {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  business_type: string | null;
  category: string | null;
  contact_number: string | null;
  email: string | null;
  website_url: string | null;
  address: string | null;
  logo_url: string | null;
  cover_url: string | null;
  verified: boolean;
  is_active: boolean;
  created_at: string;
};

type ShopProduct = {
  id: string;
  shop_id: string;
  user_id: string;
  product_name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  wholesale_price: number | null;
  stock_quantity: number;
  unit: string | null;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at?: string;
};

type ProductForm = {
  product_name: string;
  description: string;
  category: string;
  price: string;
  wholesale_price: string;
  stock_quantity: string;
  unit: string;
  image_url: string;
};

const EMPTY_PRODUCT: ProductForm = {
  product_name: "",
  description: "",
  category: "",
  price: "",
  wholesale_price: "",
  stock_quantity: "0",
  unit: "piece",
  image_url: "",
};

const BUCKET = "shop-media";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function money(value: number | null) {
  return `৳${Number(value ?? 0).toLocaleString("en-BD")}`;
}

function shopTypeLabel(type: string | null) {
  if (type === "wholesale") return "Wholesale";
  if (type === "retail_wholesale") return "Retail + Wholesale";
  if (type === "footpath") return "Street Market";
  return "Retail Shop";
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const e = error as Record<string, unknown>;
    return [
      e.message,
      e.details,
      e.hint ? `Hint: ${e.hint}` : null,
      e.code ? `Code: ${e.code}` : null,
    ]
      .filter(Boolean)
      .map(String)
      .join(" | ");
  }

  return "একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।";
}

async function shareShop(url: string, title: string) {
  if (!url) return;

  try {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return;
  }

  try {
    await navigator.clipboard.writeText(url);
    window.alert("Shop link কপি হয়েছে।");
  } catch {
    window.prompt("Shop link কপি করুন:", url);
  }
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500 sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:rounded-3xl sm:p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <p className="mt-3 text-[10px] font-bold text-slate-500 sm:text-xs">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-black text-slate-950 sm:text-lg">
        {value}
      </p>
    </div>
  );
}

export default function ShopProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");
const identityId = searchParams.get("identityId");

  const [profile, setProfile] = useState<ShopProfile | null>(null);
  const [shopIdentityId, setShopIdentityId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  // Shop profile editing
  const [shopEditOpen, setShopEditOpen] = useState(false);
  const [shopSaving, setShopSaving] = useState(false);
  const saveShopProfile = async () => {
  if (!profile || !userId || !isOwner) {
    setShopError("শুধু Shop owner তথ্য পরিবর্তন করতে পারবেন।");
    if (!profile) {
  return (
    <main className="p-6">
      {loading ? (
        <p>Shop profile loading...</p>
      ) : (
        <p>{pageError || "Shop profile not found."}</p>
      )}
    </main>
  );
}


    return;
  }

  const shopName = shopForm.shop_name.trim();

  if (!shopName) {
    setShopError("Shop Name দিতে হবে।");
    return;
  }

  setShopSaving(true);
  setShopError("");

  try {
    const { data, error } = await supabase
      .from("shop_profiles")
      .update({
        shop_name: shopName,
        shop_type: shopForm.shop_type,
        category: shopForm.category.trim() || null,
        location: shopForm.location.trim() || null,
        description: shopForm.description.trim() || null,
        phone: shopForm.phone.trim() || null,
        email: shopForm.email.trim() || null,
        website_url: shopForm.website_url.trim() || null,
      })
      .eq("id", profile.id)
      .eq("created_by", userId)
      .select(
        "id, created_by, shop_name, shop_type, category, location, logo_url, cover_url, description, phone, email, website_url, verified, active, created_at"
      )
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      throw new Error(
        "Shop আপডেট হয়নি। Owner permission ও Supabase RLS policy পরীক্ষা করুন।"
      );
    }

    setProfile({
      ...profile,
      display_name: data.shop_name,
      business_type: data.shop_type,
      category: data.category || "",
      address: data.location || "",
      bio: data.description || "",
      contact_number: data.phone || "",
      email: data.email || "",
      website_url: data.website_url || "",
    });

    setShopEditOpen(false);
    setShopError("");
  } catch (error) {
    console.error("Save shop profile error:", error);
    setShopError(
      error instanceof Error
        ? error.message
        : "Shop Profile Save করা যায়নি।"
    );
  } finally {
    setShopSaving(false);
  }
};
  const [shopError, setShopError] = useState("");
  const [shopForm, setShopForm] = useState({
    shop_name: "",
    shop_type: "retail",
    category: "",
    location: "",
    description: "",
    phone: "",
    email: "",
    website_url: "",
  });
  const [shopLogoFile, setShopLogoFile] = useState<File | null>(null);
  const [shopCoverFile, setShopCoverFile] = useState<File | null>(null);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productError, setProductError] = useState("");
  const [productSaving, setProductSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_PRODUCT);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const isOwner = Boolean(userId && profile?.user_id === userId);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.category?.trim())
            .filter((value): value is string => Boolean(value))
        )
      ).sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((p) => {
      const matchesSearch =
        !query ||
        p.product_name.toLowerCase().includes(query) ||
        (p.description ?? "").toLowerCase().includes(query) ||
        (p.category ?? "").toLowerCase().includes(query);

      return (
        matchesSearch &&
        (categoryFilter === "all" || p.category === categoryFilter)
      );
    });
  }, [products, searchTerm, categoryFilter]);

  const loadProducts = useCallback(async (shopId: string) => {
    setProductsLoading(true);
    setProductError("");

    try {
      const { data, error } = await supabase
        .from("shop_products")
        .select("*")
        .eq("shop_id", shopId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProducts((data ?? []) as ShopProduct[]);
    } catch (error: unknown) {
      console.error("Load products:", error);
      setProducts([]);
      setProductError(errorMessage(error));
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        const destination = profileId
          ? `/open-your-shop/profile?id=${encodeURIComponent(profileId)}`
          : "/open-your-shop/profile";

        router.replace(`/login?redirect=${encodeURIComponent(destination)}`);
        return;
      }

      setUserId(user.id);

      let resolvedProfileId = profileId || null;

if (!resolvedProfileId && identityId) {
  const {
    data: identity,
    error: identityError,
  } = await supabase
    .from("identities")
    .select("id, user_id, identity_type, display_name, is_active")
    .eq("id", identityId)
    .eq("identity_type", "shop")
    .eq("is_active", true)
    .maybeSingle();

  if (identityError) throw identityError;

  if (identity) {
    const {
      data: shop,
      error: shopError,
    } = await supabase
      .from("shop_profiles")
      .select("id")
      .eq("created_by", identity.user_id)
      .eq("shop_name", identity.display_name)
      .eq("active", true)
      .maybeSingle();

    if (shopError) throw shopError;

    resolvedProfileId = shop?.id ?? null;
  }
}

if (!resolvedProfileId) {
  throw new Error("Shop ID পাওয়া যায়নি। My Account থেকে Shop খুলুন।");
}

      const { data, error } = await supabase
        .from("shop_profiles")
        .select(
          "id, created_by, shop_name, shop_type, category, location, logo_url, cover_url, description, phone, email, website_url, verified, active, created_at"
        )
        .eq("id", resolvedProfileId)
        .eq("active", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error(
          "Shop পাওয়া যায়নি। Shop ID এবং active status পরীক্ষা করুন।"
        );
      }

      const mappedProfile: ShopProfile = {
        id: data.id,
        user_id: data.created_by,
        display_name: data.shop_name,
        bio: data.description,
        business_type: data.shop_type,
        category: data.category,
        contact_number: data.phone,
        email: data.email,
        website_url: data.website_url,
        address: data.location,
        logo_url: data.logo_url,
        cover_url: data.cover_url,
        verified: Boolean(data.verified),
        is_active: Boolean(data.active),
        created_at: data.created_at,
      };
const {
  data: shopIdentity,
  error: shopIdentityError,
} = await supabase
  .from("identities")
  .select("id")
  .eq("user_id", data.created_by)
  .eq("identity_type", "shop")
  .eq("display_name", data.shop_name)
  .eq("is_active", true)
  .maybeSingle();

if (shopIdentityError) throw shopIdentityError;

if (!shopIdentity) {
  throw new Error(
    "এই Shop-এর Identity পাওয়া যায়নি। My Account থেকে Shop Identity তৈরি বা যাচাই করুন।"
  );
}

setShopIdentityId(shopIdentity.id);
setProfile(mappedProfile);
await loadProducts(shopIdentity.id);
    } catch (error: unknown) {
      console.error("Load shop profile:", error);
      setPageError(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [profileId, identityId, router, loadProducts]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);
  const openShopEdit = () => {
    if (!profile || !isOwner) {
      setShopError("শুধু Shop owner তথ্য পরিবর্তন করতে পারবেন।");
      return;
    }
    setShopError("");
    setShopForm({
      shop_name: profile.display_name || "",
      shop_type: profile.business_type || "retail",
      category: profile.category || "",
      location: profile.address || "",
      description: profile.bio || "",
      phone: profile.contact_number || "",
      email: profile.email || "",
      website_url: profile.website_url || "",
    });

    setShopLogoFile(null);
    setShopCoverFile(null);
    setShopEditOpen(true);

    window.setTimeout(() => {
      document.getElementById("shop-profile-edit")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };
  const closeProductForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_PRODUCT);
    setImageFile(null);
    setImagePreview("");
    setProductError("");
  };

  const openProductForm = (product?: ShopProduct) => {
    if (!isOwner) {
      setProductError("শুধু Shop owner পণ্য পরিচালনা করতে পারবেন।");
      return;
    }

    setProductError("");
    setImageFile(null);
    setImagePreview("");

    if (product) {
      setEditingId(product.id);
      setForm({
        product_name: product.product_name,
        description: product.description ?? "",
        category: product.category ?? "",
        price: product.price == null ? "" : String(product.price),
        wholesale_price:
          product.wholesale_price == null
            ? ""
            : String(product.wholesale_price),
        stock_quantity: String(product.stock_quantity ?? 0),
        unit: product.unit ?? "piece",
        image_url: product.image_url ?? "",
      });
    } else {
      setEditingId(null);
      setForm(EMPTY_PRODUCT);
    }

    setFormOpen(true);
    window.setTimeout(() => {
      document.getElementById("product-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const uploadProductImage = async (
    file: File,
    ownerId: string
  ): Promise<string> => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("JPG, PNG, WEBP অথবা GIF ছবি নির্বাচন করুন।");
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে।");
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${ownerId}/products/${crypto.randomUUID()}.${extension}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw new Error(`ছবি Upload হয়নি: ${error.message}`);
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  };

  const saveProduct = async () => {
  if (!profile || !shopIdentityId || !userId || !isOwner) {
    setProductError("পণ্য পরিবর্তনের অনুমতি নেই অথবা Shop Identity পাওয়া যায়নি।");
    return;
  }

  const name = form.product_name.trim();
  const price = Number(form.price);
  const wholesale = form.wholesale_price.trim()
    ? Number(form.wholesale_price)
    : null;
  const stock = Number(form.stock_quantity);
  const imageUrl = form.image_url.trim();

  if (!name) {
    setProductError("পণ্যের নাম লিখুন।");
    return;
  }

  if (!form.price.trim() || !Number.isFinite(price) || price < 0) {
    setProductError("সঠিক Retail price লিখুন।");
    return;
  }

  if (
    wholesale !== null &&
    (!Number.isFinite(wholesale) || wholesale < 0)
  ) {
    setProductError("সঠিক Wholesale price লিখুন।");
    return;
  }

  if (!Number.isInteger(stock) || stock < 0) {
    setProductError("Stock শূন্য বা ধনাত্মক পূর্ণসংখ্যা হতে হবে।");
    return;
  }

  if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
    setProductError("Image URL অবশ্যই http:// অথবা https:// দিয়ে শুরু হবে।");
    return;
  }

  setProductSaving(true);
  setProductError("");

  let uploadedPath: string | null = null;

  try {
    let finalImageUrl = imageUrl || null;

    if (imageFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error("JPG, PNG, WEBP অথবা GIF ছবি নির্বাচন করুন।");
      }

      if (imageFile.size > MAX_IMAGE_SIZE) {
        throw new Error("ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে।");
      }

      const extension =
        imageFile.name.split(".").pop()?.toLowerCase() || "jpg";

      uploadedPath =
        `${userId}/products/${crypto.randomUUID()}.${extension}`;

      const { data: uploadData, error: uploadError } =
        await supabase.storage.from(BUCKET).upload(uploadedPath, imageFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: imageFile.type,
        });

      if (uploadError) throw uploadError;

      finalImageUrl = supabase.storage
        .from(BUCKET)
        .getPublicUrl(uploadData.path).data.publicUrl;
    }

    const payload = {
      shop_id: shopIdentityId,
      user_id: userId,
      product_name: name,
      description: form.description.trim() || null,
      category: form.category.trim() || null,
      price,
      wholesale_price: wholesale,
      stock_quantity: stock,
      unit: form.unit.trim() || "piece",
      image_url: finalImageUrl,
      is_active: true,
    };

    if (editingId) {
      const { data, error } = await supabase
        .from("shop_products")
        .update(payload)
        .eq("id", editingId)
        .eq("shop_id", shopIdentityId)
        .eq("user_id", userId)
        .select("id")
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        throw new Error(
          "পণ্য আপডেট হয়নি। Ownership ও Supabase RLS policy পরীক্ষা করুন।"
        );
      }
    } else {
      const { error } = await supabase
        .from("shop_products")
        .insert(payload);

      if (error) throw error;
    }

    closeProductForm();
    await loadProducts(shopIdentityId);
  } catch (error: unknown) {
    console.error("Save product:", error);

    if (uploadedPath) {
      const { error: cleanupError } = await supabase.storage
        .from(BUCKET)
        .remove([uploadedPath]);

      if (cleanupError) {
        console.warn("Uploaded image cleanup failed:", cleanupError.message);
      }
    }

    setProductError(errorMessage(error));
  } finally {
    setProductSaving(false);
  }
};
if (loading) {
  return (
    <main className="p-6">
      <p>Shop profile loading...</p>
    </main>
  );
}

if (!profile) {
  return (
    <main className="p-6">
      <p className="text-red-600">
        {pageError || "Shop profile not found."}
      </p>
      <Link
        href="/open-your-shop"
        className="mt-4 inline-flex rounded-xl bg-emerald-700 px-4 py-2 font-bold text-white"
      >
        Back to Shop
      </Link>
    </main>
  );
}



return (
  <main>
    {/* Storefront hero */}
    <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#062e24] via-[#087456] to-[#16a085] shadow-xl sm:rounded-[2.25rem]">
          {profile.cover_url && (
            <img
              src={profile.cover_url}
              alt="Shop cover"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-900/40" />
          <div className="absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full border border-white/10 sm:h-96 sm:w-96" />
          <div className="absolute -bottom-32 right-16 -z-10 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />

          <div className="p-5 sm:p-10 lg:p-14">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-2 border-white/70 bg-white shadow-2xl sm:h-36 sm:w-36">
                {profile.logo_url ? (
                  <img
                    src={profile.logo_url}
                    alt={`${profile.display_name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store className="h-12 w-12 text-emerald-700 sm:h-16 sm:w-16" />
                )}
              </div>

              <div className="min-w-0 flex-1 text-white">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black tracking-wider">
                    PREMIUM STOREFRONT
                  </span>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-300/20 px-3 py-1 text-[10px] font-black">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      VERIFIED
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold">
                    <Globe className="h-3.5 w-3.5" />
                    Public Shop
                  </span>
                </div>

                <h1 className="mt-4 break-words text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  {profile.display_name}
                </h1>

                <p className="mt-3 text-sm font-semibold text-emerald-100 sm:text-base">
                  {shopTypeLabel(profile.business_type)}
                  {profile.category ? ` · ${profile.category}` : ""}
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/85 sm:mt-8 sm:text-base">
              {profile.bio || "Shromobazar-এ আমাদের Shop-এ আপনাকে স্বাগতম।"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {profile.contact_number && (
                <a
                  href={`tel:${profile.contact_number}`}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-emerald-900 shadow-lg transition hover:bg-emerald-50"
                >
                  <Phone className="h-4 w-4" />
                  যোগাযোগ করুন
                </a>
              )}

              <button
                type="button"
                onClick={() =>
  void shareShop(
    `${window.location.origin}/shop/${profile.id}`,
    profile.display_name
  )
}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" />
                Share Shop
              </button>

              {profile.website_url && (
                <a
                  href={profile.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Website
                </a>
              )}
            </div>

            
                        {profile.address && (
              <p className="mt-5 flex items-start gap-2 text-xs leading-6 text-white/75 sm:text-sm">
                <MapPin className="mt-1 h-4 w-4 shrink-0" />
                {profile.address}
              </p>
            
             )}
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-4">
          <StatCard
            icon={<Store className="h-5 w-5" />}
            label="Shop Type"
            value={shopTypeLabel(profile.business_type)}
          />
          <StatCard
            icon={<Boxes className="h-5 w-5" />}
            label="Category"
            value={profile.category || "General Shop"}
          />
          <StatCard
            icon={<Package className="h-5 w-5" />}
            label="Products"
            value={String(products.length)}
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Shop Status"
            value={profile.is_active ? "Active" : "Inactive"}
          />
        </section>

        {/* Products */}
        <section
          id="products"
          className="mt-6 scroll-mt-24 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:mt-8 sm:p-7"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionTitle
              eyebrow="Curated Collection"
              title="Products & Services"
              description="পণ্যের ছবি, মূল্য, wholesale price এবং stock এক জায়গায় পরিচালনা করুন।"
            />

            {isOwner && (
              <button
                type="button"
                onClick={() => openProductForm()}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            )}
          </div>

          {productError && (
            <div
              role="alert"
              className="mt-5 break-words rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {productError}
              <button
                type="button"
                onClick={() => {
  if (shopIdentityId) {
    void loadProducts(shopIdentityId);
  }
}}
                className="ml-2 font-black underline"
              >
                Retry
              </button>
            </div>
          )}

          {formOpen && isOwner && (
            <div
              id="product-form"
              className="mt-6 scroll-mt-24 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    Product Studio
                  </p>
                  <h3 className="mt-1 text-xl font-black">
                    {editingId ? "Edit Product" : "Create Product"}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    পণ্যের তথ্য এবং ছবি যোগ করে Save করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeProductForm}
                  disabled={productSaving}
                  aria-label="Close form"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                className="mt-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  void saveProduct();
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="block text-xs font-bold text-slate-600">
                    Product Name *
                    <input
                      required
                      maxLength={160}
                      value={form.product_name}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          product_name: e.target.value,
                        }))
                      }
                      placeholder="Product name"
                      className="shop-input mt-2"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-600">
                    Category
                    <input
                      maxLength={100}
                      value={form.category}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, category: e.target.value }))
                      }
                      placeholder="Fashion, Food, Books..."
                      className="shop-input mt-2"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-600">
                    Retail Price (৳) *
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                      placeholder="0.00"
                      className="shop-input mt-2"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-600">
                    Wholesale Price (৳)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.wholesale_price}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          wholesale_price: e.target.value,
                        }))
                      }
                      placeholder="Optional"
                      className="shop-input mt-2"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-600">
                    Stock Quantity
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.stock_quantity}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          stock_quantity: e.target.value,
                        }))
                      }
                      className="shop-input mt-2"
                    />
                  </label>

                  <label className="block text-xs font-bold text-slate-600">
                    Unit
                    <select
                      value={form.unit}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, unit: e.target.value }))
                      }
                      className="shop-input mt-2"
                    >
                      <option value="piece">Piece</option>
                      <option value="kg">Kilogram</option>
                      <option value="gram">Gram</option>
                      <option value="liter">Liter</option>
                      <option value="meter">Meter</option>
                      <option value="box">Box</option>
                      <option value="pack">Pack</option>
                      <option value="dozen">Dozen</option>
                      <option value="set">Set</option>
                      <option value="service">Service</option>
                    </select>
                  </label>

                  <div className="text-xs font-bold text-slate-600 sm:col-span-2 lg:col-span-1">
                    Product Photo
                    <label className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-emerald-300 bg-white p-3 text-center transition hover:bg-emerald-50">
                      {imagePreview || form.image_url ? (
                        <img
                          src={imagePreview || form.image_url}
                          alt="Product preview"
                          className="h-32 w-full rounded-lg object-contain"
                        />
                      ) : (
                        <>
                          <ImagePlus className="h-8 w-8 text-emerald-700" />
                          <span className="mt-2 text-sm font-black text-slate-800">
                            Upload Photo
                          </span>
                          <span className="mt-1 text-[10px] font-medium text-slate-500">
                            JPG, PNG, WEBP · Max 5MB
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;

                          if (
                            ![
                              "image/jpeg",
                              "image/png",
                              "image/webp",
                              "image/gif",
                            ].includes(file.type)
                          ) {
                            setProductError("JPG, PNG, WEBP অথবা GIF নির্বাচন করুন।");
                            event.target.value = "";
                            return;
                          }

                          if (file.size > MAX_IMAGE_SIZE) {
                            setProductError("ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে।");
                            event.target.value = "";
                            return;
                          }

                          setProductError("");
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }}
                      />
                    </label>

                    {(imagePreview || form.image_url) && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview("");
                          setForm((f) => ({ ...f, image_url: "" }));
                        }}
                        className="mt-2 inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remove Photo
                      </button>
                    )}

                    <input
                      type="url"
                      value={form.image_url}
                      onChange={(e) => {
                        setImageFile(null);
                        setImagePreview("");
                        setForm((f) => ({
                          ...f,
                          image_url: e.target.value,
                        }));
                      }}
                      placeholder="Or paste image URL"
                      className="shop-input mt-2"
                    />
                  </div>

                  <label className="block text-xs font-bold text-slate-600 sm:col-span-2 lg:col-span-2">
                    Description
                    <textarea
                      rows={5}
                      maxLength={2000}
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          description: e.target.value,
                        }))
                      }
                      placeholder="পণ্যের বিবরণ লিখুন..."
                      className="shop-input mt-2 resize-y"
                    />
                  </label>
                </div>

                {productError && (
                  <p
                    role="alert"
                    className="mt-4 break-words rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                  >
                    {productError}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={productSaving}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-black text-white disabled:opacity-50"
                  >
                    {productSaving ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {productSaving ? "Saving Product..." : "Save Product"}
                  </button>
                  <button
                    type="button"
                    onClick={closeProductForm}
                    disabled={productSaving}
                    className="min-h-12 rounded-xl border bg-white px-6 py-3 text-sm font-bold disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Search and category filter */}
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_230px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="পণ্যের নাম বা বিবরণ খুঁজুন..."
                className="shop-input pl-10"
              />
            </label>

            <label className="relative block">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="shop-input pl-10"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
            {(searchTerm || categoryFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
                className="font-black text-emerald-700"
              >
                Clear filters
              </button>
            )}
          </div>

          {productsLoading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-sm font-bold text-slate-500">
              <RefreshCw className="h-5 w-5 animate-spin text-emerald-700" />
              Products loading...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-white px-5 py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-black">
                {productError
                  ? "Product Catalog লোড হয়নি"
                  : products.length === 0
                    ? "আপনার Shop তৈরি, এবার Product যোগ করুন"
                    : "কোনো matching product পাওয়া যায়নি"}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {productError
                  ? "Supabase permission এবং RLS policy পরীক্ষা করুন।"
                  : products.length === 0
                    ? "পণ্যের ছবি, মূল্য এবং বিবরণ দিয়ে আপনার catalog সাজিয়ে নিন।"
                    : "অন্য keyword বা category দিয়ে চেষ্টা করুন।"}
              </p>
              {isOwner && products.length === 0 && !productError && (
                <button
                  type="button"
                  onClick={() => {
  if (shopIdentityId) {
    void loadProducts(shopIdentityId);
  }
}}
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-black text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add First Product
                </button>
              )}
              <button
                
                onClick={() =>
  void shareShop(
    `${window.location.origin}/shop/${profile.id}`,
    profile.display_name
  )
}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl border bg-white px-4 py-2 text-xs font-bold"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Products
              </button>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl"
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-slate-100">
                    {product.image_url ? (
                      <a
                        href={product.image_url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`View ${product.product_name} image`}
                        className="block h-full w-full"
                      >
                        <img
                          src={product.image_url}
                          alt={product.product_name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </a>
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-12 w-12 text-emerald-700/50" />
                      </div>
                    )}

                    <span
                      className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[9px] font-black shadow-sm ${
                        product.stock_quantity > 0
                          ? "bg-white/95 text-emerald-800"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.stock_quantity > 0 ? "IN STOCK" : "OUT OF STOCK"}
                    </span>
                  </div>

                  <div className="p-3 sm:p-4">
                    {product.category && (
                      <p className="truncate text-[10px] font-black uppercase tracking-wide text-emerald-700">
                        {product.category}
                      </p>
                    )}
                    <h3 className="mt-1 line-clamp-2 min-h-10 break-words text-sm font-black leading-5 text-slate-900 sm:text-base">
                      {product.product_name}
                    </h3>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 break-words text-xs leading-5 text-slate-500">
                        {product.description}
                      </p>
                    )}

                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <p className="text-lg font-black text-emerald-700 sm:text-xl">
                        {money(product.price)}
                      </p>
                      {product.wholesale_price != null && (
                        <p className="mt-1 text-[10px] font-semibold text-slate-500 sm:text-xs">
                          Wholesale: {money(product.wholesale_price)}
                        </p>
                      )}
                      <p className="mt-2 text-[10px] text-slate-500 sm:text-xs">
                        Stock: {product.stock_quantity}{" "}
                        {product.unit || "piece"}
                      </p>
                    </div>

                    {isOwner && (
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => openProductForm(product)}
                          className="inline-flex min-h-10 flex-1 items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2 text-xs font-black text-emerald-800"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === product.id}
                          onClick={() =>
  void shareShop(
    `${window.location.origin}/shop/${profile.id}`,
    profile.display_name
  )
}
                          aria-label={`Delete ${product.product_name}`}
                          className="flex min-h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-600 disabled:opacity-50"
                        >
                          {deletingId === product.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Shop gallery */}
        <section
          id="gallery"
          className="mt-5 scroll-mt-24 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:mt-7 sm:p-7"
        >
          <SectionTitle
            eyebrow="Brand Identity"
            title="Shop Gallery"
            description="আপনার Shop-এর cover এবং logo।"
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {profile.cover_url ? (
              <a
                href={profile.cover_url}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border"
              >
                <img
                  src={profile.cover_url}
                  alt="Shop cover"
                  loading="lazy"
                  className="aspect-[16/9] w-full object-cover transition group-hover:scale-[1.02]"
                />
                <p className="p-3 text-sm font-black">Shop Cover</p>
              </a>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-2xl border border-dashed text-sm text-slate-400">
                <ImageIcon className="mr-2 h-5 w-5" />
                Cover photo নেই
              </div>
            )}

            {profile.logo_url ? (
              <a
                href={profile.logo_url}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-44 items-center justify-center overflow-hidden rounded-2xl border bg-slate-50 p-6"
              >
                <img
                  src={profile.logo_url}
                  alt="Shop logo"
                  loading="lazy"
                  className="max-h-44 max-w-full object-contain"
                />
              </a>
            ) : (
              <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed text-sm text-slate-400">
                <Store className="mr-2 h-5 w-5" />
                Shop logo নেই
              </div>
            )}
          </div>

          {isOwner && (
            <Link
             href={`/open-your-shop/profile?id=${encodeURIComponent(profile.id)}`}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800"
            >
              <Edit3 className="h-4 w-4" />
              Edit Shop Cover / Logo
            </Link>
          )}
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="mt-5 scroll-mt-24 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:mt-7 sm:p-7"
        >
          <SectionTitle
            eyebrow="Customer Support"
            title="Contact the Shop"
            description="Shop-এর সঙ্গে সরাসরি যোগাযোগ করুন।"
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Phone className="h-5 w-5" />,
                label: "Phone",
                value: profile.contact_number || "Not added",
              },
              {
                icon: <Mail className="h-5 w-5" />,
                label: "Email",
                value: profile.email || "Not added",
              },
              {
                icon: <MapPin className="h-5 w-5" />,
                label: "Address",
                value: profile.address || "Not added",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-w-0 items-start gap-3 rounded-2xl border bg-slate-50 p-4"
              >
                <span className="text-emerald-700">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {profile.contact_number && (
              <a
                href={`tel:${profile.contact_number}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-black text-white"
              >
                <Phone className="h-4 w-4" />
                Call Shop
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold"
              >
                <Mail className="h-4 w-4" />
                Email Shop
              </a>
            )}
            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </a>
            )}
            <button
              type="button"
              onClick={() =>
  void shareShop(
    `${window.location.origin}/shop/${profile.id}`,
    profile.display_name
  )
}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"
            >
              <Share2 className="h-4 w-4" />
              Share Shop
            </button>
          </div>
        </section>

        <footer className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Store className="h-6 w-6" />
          </div>
          <p className="mt-3 font-black">{profile.display_name}</p>
          <p className="mt-1 text-xs text-slate-500">
            Powered by Shromobazar · No Commission
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-5 text-xs font-bold text-slate-600">
            <Link href="/" className="hover:text-emerald-700">Home</Link>
            <Link href="/marketplace" className="hover:text-emerald-700">Marketplace</Link>
            <Link href="/open-your-shop" className="hover:text-emerald-700">Open Your Shop</Link>
          </div>
        </footer>
      

      {/* Mobile navigation */}
      
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-xl backdrop-blur-xl sm:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {[
            { label: "Home", href: "#top", icon: <Home className="h-5 w-5" /> },
            { label: "Products", href: "#products", icon: <ShoppingBag className="h-5 w-5" /> },
            { label: "Gallery", href: "#gallery", icon: <ImageIcon className="h-5 w-5" /> },
            { label: "Contact", href: "#contact", icon: <MessageCircle className="h-5 w-5" /> },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-700"
            >
              {item.icon}
              <span className="text-[10px] font-black">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
      <style jsx>{`
        .shop-input {
          display: block;
          width: 100%;
          min-height: 46px;
          border: 1px solid #dbe4e0;
          border-radius: 12px;
          background: #fff;
          padding: 11px 12px;
          color: #0f172a;
          font-size: 14px;
          outline: none;
          transition: border-color 150ms ease, box-shadow 150ms ease;
        }
        .shop-input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgb(16 185 129 / 13%);
        }
        .shop-input::placeholder {
          color: #94a3b8;
        }
      `}</style>
      
    </main>
    
  );
}