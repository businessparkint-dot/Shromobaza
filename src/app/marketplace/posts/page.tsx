"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Search, ShoppingBag } from "lucide-react";
import { supabase } from "@/lib/client";

type Post = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  category: string | null;
  location: string | null;
  image_url: string | null;
  created_at: string;
};

export default function MarketplacePostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);

    const { data } = await supabase
      .from("marketplace_posts")
      .select(
        "id,title,description,price,category,location,image_url,created_at"
      )
      .order("created_at", { ascending: false });

    setPosts(data ?? []);
    setLoading(false);
  }

  const filtered = posts.filter((post) => {
    const q = search.toLowerCase().trim();

    if (!q) return true;

    return (
      post.title.toLowerCase().includes(q) ||
      post.description?.toLowerCase().includes(q) ||
      post.category?.toLowerCase().includes(q) ||
      post.location?.toLowerCase().includes(q)
    );
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Marketplace
          </Link>

          <Link
            href="/marketplace/create"
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white"
          >
            <Plus className="h-4 w-4" />
            Post
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#07152d]">
            Marketplace Posts
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Products and services from members.
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-orange-400"
          />
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-400">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <ShoppingBag className="mx-auto h-9 w-9 text-slate-300" />

            <h2 className="mt-3 text-sm font-black text-slate-700">
              No posts yet
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Be the first person to post a product or service.
            </p>

            <Link
              href="/marketplace/create"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black text-white"
            >
              <Plus className="h-4 w-4" />
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
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
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-[10px] font-bold text-orange-500">
                    {post.category || "Marketplace"}
                  </p>

                  <h2 className="mt-1 truncate text-sm font-black text-[#07152d]">
                    {post.title}
                  </h2>

                  {post.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                      {post.description}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-base font-black text-[#07152d]">
                      {post.price != null
                        ? `৳${post.price.toLocaleString()}`
                        : "Price on request"}
                    </p>

                    {post.location && (
                      <span className="text-[10px] text-slate-400">
                        {post.location}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}