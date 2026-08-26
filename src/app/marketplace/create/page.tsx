"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, ImagePlus, Loader2, Upload } from "lucide-react";
import { supabase } from "@/lib/client";

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

export default function MarketplaceCreatePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!title.trim()) {
      setError("Product/Service title দিন।");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Post করতে আগে Login করুন।");
      }

      let imageUrl: string | null = null;

      if (image) {
        const extension = image.name.split(".").pop() || "jpg";

        const filePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("marketplace-images")
          .upload(filePath, image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicUrl } = supabase.storage
          .from("marketplace-images")
          .getPublicUrl(filePath);

        imageUrl = publicUrl.publicUrl;
      }

      const { error: postError } = await supabase
        .from("marketplace_posts")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          price: price ? Number(price) : null,
          category: category || null,
          location: location.trim() || null,
          image_url: imageUrl,
        });

      if (postError) {
        throw new Error(postError.message);
      }

      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setLocation("");
      setImage(null);

      setMessage("Marketplace post successfully published.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Post তৈরি করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Marketplace
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-7 sm:px-6">
        <div className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
            Marketplace
          </span>

          <h1 className="mt-2 text-2xl font-black text-[#07152d]">
            Create Post
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Product অথবা service-এর post তৈরি করুন।
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        >
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-red-600">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-xs font-bold text-green-700">
              {message}
            </div>
          )}

          <label className="block text-xs font-black text-slate-700">
            Product / Service Image
          </label>

          <label className="mt-2 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-orange-300 hover:bg-orange-50">
            {image ? (
              <>
                <ImagePlus className="h-8 w-8 text-orange-500" />
                <p className="mt-2 max-w-[90%] truncate text-xs font-bold text-slate-600">
                  {image.name}
                </p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-slate-300" />
                <p className="mt-2 text-xs font-bold text-slate-500">
                  Upload Image
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  JPG, PNG or WEBP
                </p>
              </>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) =>
                setImage(e.target.files?.[0] ?? null)
              }
            />
          </label>

          <div className="mt-5">
            <label className="text-xs font-black text-slate-700">
              Title
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you selling?"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
            />
          </div>

          <div className="mt-4">
            <label className="text-xs font-black text-slate-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe your product or service..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-black text-slate-700">
                Price
              </label>

              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="৳ Price"
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-700">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-orange-400"
              >
                <option value="">Select category</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-black text-slate-700">
              Location
            </label>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dhaka, Bangladesh"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-black text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Publish Marketplace Post
              </>
            )}
          </button>
        </form>
      </section>
    </main>
  );
}