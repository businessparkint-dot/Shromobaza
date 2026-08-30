"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Grid3X3,
  ImagePlus,
  Loader2,
  Plus,
  Search,
  ShoppingBag,
  Store,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "@/lib/client";

type Shop = {
  id: string;
  user_id: string;
  shop_name: string;
  description: string | null;
  category: string | null;
  location: string | null;
  phone: string | null;
  image_url: string | null;
};

type Post = {
  id: string;
  shop_id: string | null;
  title: string;
  description: string | null;
  price: number | null;
  category: string | null;
  location: string | null;
  image_url: string | null;
  created_at: string;
};

const categories = [
  "Electronics",
  "Clothing",
  "Food",
  "Home & Furniture",
  "Construction",
  "Services",
  "Agriculture",
  "Vehicles",
  "Other",
];

export default function MarketplacePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingShop, setSavingShop] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const [showShopForm, setShowShopForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  const [search, setSearch] = useState("");

  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopCategory, setShopCategory] = useState("");
  const [shopLocation, setShopLocation] = useState("");
  const [shopPhone, setShopPhone] = useState("");
  const [shopImage, setShopImage] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadMarketplace();
  }, []);

  async function loadMarketplace() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: shopData, error: shopError } = await supabase
        .from("marketplace_shops")
        .select(
          "id,user_id,shop_name,description,category,location,phone,image_url"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (shopError) {
        throw new Error(shopError.message);
      }

      setShop(shopData);

      const { data: postData, error: postError } = await supabase
        .from("marketplace_posts")
        .select(
          "id,shop_id,title,description,price,category,location,image_url,created_at"
        )
        .order("created_at", { ascending: false })
        .limit(50);

      if (postError) {
        throw new Error(postError.message);
      }

      setPosts(postData ?? []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Marketplace load করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file: File, folder: string) {
    if (!userId) {
      throw new Error("Login করুন।");
    }

    const extension = file.name.split(".").pop() || "jpg";

    const path = `${userId}/${folder}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("marketplace-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("marketplace-images")
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function createShop(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!userId) {
      setError("Shop খুলতে আগে Login করুন।");
      return;
    }

    if (!shopName.trim()) {
      setError("Shop name দিন।");
      return;
    }

    setSavingShop(true);

    try {
      let imageUrl: string | null = null;

      if (shopImage) {
        imageUrl = await uploadImage(shopImage, "shops");
      }

      const { data, error: insertError } = await supabase
        .from("marketplace_shops")
        .insert({
          user_id: userId,
          shop_name: shopName.trim(),
          description: shopDescription.trim() || null,
          category: shopCategory || null,
          location: shopLocation.trim() || null,
          phone: shopPhone.trim() || null,
          image_url: imageUrl,
        })
        .select(
          "id,user_id,shop_name,description,category,location,phone,image_url"
        )
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      setShop(data);
      setShowShopForm(false);

      setShopName("");
      setShopDescription("");
      setShopCategory("");
      setShopLocation("");
      setShopPhone("");
      setShopImage(null);

      setMessage("আপনার Shop সফলভাবে তৈরি হয়েছে।");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Shop তৈরি করা যায়নি।"
      );
    } finally {
      setSavingShop(false);
    }
  }

  async function createPost(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!userId) {
      setError("Post করতে আগে Login করুন।");
      return;
    }

    if (!shop) {
      setError("আগে একটি Shop খুলুন।");
      return;
    }

    if (!title.trim()) {
      setError("Product / Service title দিন।");
      return;
    }

    setSavingPost(true);

    try {
      let imageUrl: string | null = null;

      if (postImage) {
        imageUrl = await uploadImage(postImage, "posts");
      }

      const { error: insertError } = await supabase
        .from("marketplace_posts")
        .insert({
          user_id: userId,
          shop_id: shop.id,
          title: title.trim(),
          description: description.trim() || null,
          price: price ? Number(price) : null,
          category: category || null,
          location: location.trim() || shop.location || null,
          image_url: imageUrl,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setLocation("");
      setPostImage(null);
      setShowPostForm(false);

      setMessage("Marketplace post সফলভাবে published হয়েছে।");

      await loadMarketplace();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Post তৈরি করা যায়নি।"
      );
    } finally {
      setSavingPost(false);
    }
  }

  const filteredPosts = posts.filter((post) => {
    const q = search.trim().toLowerCase();

    if (!q) return true;

    return (
      post.title.toLowerCase().includes(q) ||
      post.description?.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q) ||
      post.location?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />

          <p className="mt-3 text-sm font-bold text-slate-500">
            Marketplace loading...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-orange-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-[#07152d]">
              <img
                src="/logo.png"
                alt="Shromobazar"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-black text-[#07152d]">
                Shromobazar
              </p>

              <p className="text-[9px] text-slate-400">
                Marketplace
              </p>
            </div>
          </div>

          {shop ? (
            <button
              type="button"
              onClick={() => setShowPostForm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-[11px] font-black text-white hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Post
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowShopForm(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-[11px] font-black text-white hover:bg-orange-600"
            >
              <Store className="h-4 w-4" />
              Open Shop
            </button>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-9">
        {/* HERO */}
        <div className="rounded-[2rem] bg-[#07152d] p-6 text-white sm:p-8">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
            Marketplace
          </span>

          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Buy • Sell • Discover
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Products and services from Shromobazar members.
          </p>

          <div className="relative mt-5 max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products or services..."
              className="h-12 w-full rounded-2xl bg-white pl-12 pr-4 text-sm text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* ALERT */}
        {error && (
          <div className="mt-5 flex items-start justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-bold text-green-700">
            {message}
          </div>
        )}

        {/* MARKETPLACE STATUS */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <Grid3X3 className="h-5 w-5 text-orange-500" />

            <p className="mt-2 text-xs font-black text-[#07152d]">
              Categories
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Browse products & services
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <Store className="h-5 w-5 text-orange-500" />

            <p className="mt-2 text-xs font-black text-[#07152d]">
              {shop ? "My Shop" : "Open Shop"}
            </p>

            <p className="mt-1 truncate text-[10px] text-slate-400">
              {shop
                ? shop.shop_name
                : "Create your own business space"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <Camera className="h-5 w-5 text-orange-500" />

            <p className="mt-2 text-xs font-black text-[#07152d]">
              Posts
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              {posts.length} listings
            </p>
          </div>
        </div>

        {/* MY SHOP */}
        {shop ? (
          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4 p-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#07152d]">
                <img
                  src="/logo.png"
                  alt="Shromobazar"
                  className="h-12 w-12 object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                  My Shop
                </p>

                <h2 className="truncate text-base font-black text-[#07152d]">
                  {shop.shop_name}
                </h2>

                <p className="truncate text-xs text-slate-400">
                  {shop.location || "Location not added"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPostForm(true)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-2 text-[11px] font-black text-white hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" />
                Post
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[1.75rem] border border-orange-100 bg-orange-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#07152d]">
                <img
                  src="/logo.png"
                  alt="Shromobazar"
                  className="h-12 w-12 object-contain"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-black text-[#07152d]">
                  আপনার Shop খুলুন
                </h2>

                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                  নিজের Product বা Service-এর জন্য আপনার
                  একটি professional Shop তৈরি করুন।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowShopForm(true)}
                className="rounded-xl bg-[#07152d] px-4 py-2.5 text-[11px] font-black text-white hover:bg-slate-800"
              >
                Open Your Shop
              </button>
            </div>
          </div>
        )}

        {/* POSTS */}
        <div className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#07152d]">
                Marketplace Posts
              </h2>

              <p className="mt-1 text-[11px] text-slate-400">
                Latest products and services
              </p>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-12 text-center">
              <ShoppingBag className="mx-auto h-9 w-9 text-slate-300" />

              <h3 className="mt-3 text-sm font-black text-slate-700">
                এখনো কোনো post নেই
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Shop খুলে প্রথম product/service post করুন।
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="aspect-[4/3] bg-slate-100">
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-300">
                        <ShoppingBag className="h-9 w-9" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-[9px] font-black uppercase text-orange-500">
                      {post.category || "Marketplace"}
                    </p>

                    <h3 className="mt-1 truncate text-sm font-black text-[#07152d]">
                      {post.title}
                    </h3>

                    {post.description && (
                      <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">
                        {post.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-[#07152d]">
                        {post.price != null
                          ? `৳${post.price.toLocaleString()}`
                          : "Price on request"}
                      </span>

                      {post.location && (
                        <span className="truncate text-[9px] text-slate-400">
                          {post.location}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SHOP MODAL */}
      {showShopForm && (
        <Modal
          title="Open Your Shop"
          onClose={() => setShowShopForm(false)}
        >
          <form onSubmit={createShop} className="space-y-4">
            <FilePicker
              label="Shop Image"
              file={shopImage}
              onChange={setShopImage}
            />

            <Input
              label="Shop Name"
              value={shopName}
              onChange={setShopName}
              placeholder="Your shop name"
            />

            <Input
              label="Description"
              value={shopDescription}
              onChange={setShopDescription}
              placeholder="What do you sell?"
            />

            <div>
              <label className="text-xs font-black text-slate-700">
                Category
              </label>

              <select
                value={shopCategory}
                onChange={(e) => setShopCategory(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
              >
                <option value="">Select category</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Location"
              value={shopLocation}
              onChange={setShopLocation}
              placeholder="Dhaka, Bangladesh"
            />

            <Input
              label="Phone"
              value={shopPhone}
              onChange={setShopPhone}
              placeholder="01XXXXXXXXX"
            />

            <button
              type="submit"
              disabled={savingShop}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-black text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {savingShop ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Store className="h-4 w-4" />
                  Create Shop
                </>
              )}
            </button>
          </form>
        </Modal>
      )}

      {/* POST MODAL */}
      {showPostForm && (
        <Modal
          title="Create Marketplace Post"
          onClose={() => setShowPostForm(false)}
        >
          <form onSubmit={createPost} className="space-y-4">
            <FilePicker
              label="Product Image"
              file={postImage}
              onChange={setPostImage}
            />

            <Input
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="Product or service name"
            />

            <Input
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Describe your product/service"
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="Price"
                value={price}
                onChange={setPrice}
                placeholder="৳ Price"
                type="number"
              />

              <div>
                <label className="text-xs font-black text-slate-700">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
                >
                  <option value="">Category</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder={shop?.location || "Location"}
            />

            <button
              type="submit"
              disabled={savingPost}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-black text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {savingPost ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Publish Post
                </>
              )}
            </button>
          </form>
        </Modal>
      )}
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-black text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10"
      />
    </div>
  );
}

function FilePicker({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div>
      <label className="text-xs font-black text-slate-700">
        {label}
      </label>

      <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-orange-300 hover:bg-orange-50">
        {file ? (
          <>
            <ImagePlus className="h-6 w-6 text-orange-500" />

            <span className="min-w-0 flex-1 truncate text-xs font-bold text-slate-600">
              {file.name}
            </span>
          </>
        ) : (
          <>
            <Camera className="h-6 w-6 text-slate-300" />

            <span className="text-xs font-bold text-slate-500">
              Upload Image
            </span>
          </>
        )}

        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) =>
            onChange(e.target.files?.[0] ?? null)
          }
        />
      </label>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-5 shadow-2xl sm:rounded-[2rem] sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-black text-[#07152d]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}