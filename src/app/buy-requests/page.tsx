"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Check,
  Clock,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type BuyRequest = {
  id: string;
  buyer_id: string;
  seller_id: string;
  marketplace_post_id: string | null;
  title: string;
  description: string | null;
  budget: number | null;
  location: string | null;
  quantity: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type MarketplacePost = {
  id: string;
  title: string;
  price: number | null;
  category: string | null;
  location: string | null;
};

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "অপেক্ষমাণ";
    case "active":
      return "সক্রিয়";
    case "accepted":
      return "গ্রহণ করা হয়েছে";
    case "rejected":
      return "প্রত্যাখ্যান করা হয়েছে";
    case "completed":
      return "সম্পন্ন";
    case "cancelled":
      return "বাতিল";
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function BuyRequestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState<string | null>(null);
  const [requests, setRequests] = useState<BuyRequest[]>([]);
  const [posts, setPosts] = useState<MarketplacePost[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [selectedPostId, setSelectedPostId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");

  const handlePostChange = useCallback(
    (postId: string) => {
      setSelectedPostId(postId);

      const selected = posts.find((post) => post.id === postId);

      if (!selected) {
        return;
      }

      setTitle(`আমি "${selected.title}" কিনতে চাই`);

      if (selected.price !== null && selected.price !== undefined) {
        setBudget(String(selected.price));
      } else {
        setBudget("");
      }

      if (selected.location) {
        setLocation(selected.location);
      } else {
        setLocation("");
      }
    },
    [posts]
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setUserId(session.user.id);

      const accessToken = session.access_token;

      const response = await fetch("/api/buy-requests", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Buy Request load করা যায়নি।"
        );
      }

      setRequests(result.requests ?? []);

      const { data: marketplacePosts, error: postsError } = await supabase
        .from("marketplace_posts")
        .select("id, title, price, category, location")
        .order("created_at", { ascending: false })
        .limit(100);

      if (postsError) {
        console.error("Marketplace posts:", postsError);
        setPosts([]);
        return;
      }

      const loadedPosts = marketplacePosts ?? [];
      setPosts(loadedPosts);

      /*
       * Marketplace product card থেকে
       * /buy-requests?postId=... এ এলে
       * সেই product automatically select হবে।
       */
      const postIdFromUrl = searchParams.get("postId");

      if (postIdFromUrl) {
        const selected = loadedPosts.find(
          (post) => post.id === postIdFromUrl
        );

        if (selected) {
          setSelectedPostId(selected.id);
          setTitle(`আমি "${selected.title}" কিনতে চাই`);

          if (selected.price !== null && selected.price !== undefined) {
            setBudget(String(selected.price));
          } else {
            setBudget("");
          }

          if (selected.location) {
            setLocation(selected.location);
          } else {
            setLocation("");
          }
        }
      }
    } catch (err) {
      console.error("Buy Requests load error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Buy Request load করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  }, [router, searchParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createRequest = async () => {
    if (!userId) {
      setError("Login required.");
      return;
    }

    if (!selectedPostId) {
      setError("একটি Marketplace product নির্বাচন করুন।");
      return;
    }

    if (!title.trim()) {
      setError("Request title দিন।");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/buy-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          marketplacePostId: selectedPostId,
          title: title.trim(),
          description: description.trim(),
          quantity: quantity ? Number(quantity) : null,
          budget: budget ? Number(budget) : null,
          location: location.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Buy Request তৈরি করা যায়নি।"
        );
      }

      setMessage(
        "Buy Request পাঠানো হয়েছে। Seller/Shop/Office owner-কে notification পাঠানো হয়েছে।"
      );

      setSelectedPostId("");
      setTitle("");
      setDescription("");
      setQuantity("");
      setBudget("");
      setLocation("");

      router.replace("/buy-requests");

      await loadData();
    } catch (err) {
      console.error("Create Buy Request:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Buy Request তৈরি করা যায়নি।"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateRequest = async (
    requestId: string,
    status: "accepted" | "rejected" | "completed" | "cancelled"
  ) => {
    try {
      setUpdatingId(requestId);
      setError("");
      setMessage("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/buy-requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: requestId,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Request update করা যায়নি।"
        );
      }

      if (status === "accepted") {
        setMessage(
          "Buy Request গ্রহণ করা হয়েছে। Buyer notification পেয়েছে।"
        );
      } else if (status === "rejected") {
        setMessage(
          "Buy Request প্রত্যাখ্যান করা হয়েছে। Buyer notification পেয়েছে।"
        );
      } else if (status === "completed") {
        setMessage("Buy Request completed হিসেবে update হয়েছে।");
      } else {
        setMessage("Buy Request বাতিল করা হয়েছে।");
      }

      await loadData();
    } catch (err) {
      console.error("Update Buy Request:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Request update করা যায়নি।"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const receivedRequests = requests.filter(
    (request) => request.seller_id === userId
  );

  const sentRequests = requests.filter(
    (request) => request.buyer_id === userId
  );

  const selectedPost = posts.find(
    (post) => post.id === selectedPostId
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto flex max-w-5xl items-center justify-center py-20">
          <Loader2 className="mr-3 h-6 w-6 animate-spin" />
          <span>Buy Requests loading...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-orange-500 to-blue-700 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <ShoppingCart className="h-7 w-7" />

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Buy Request
                </h1>
              </div>

              <p className="text-sm text-white/90 sm:text-base">
                আমি কিনতে চাই — Seller, Shop বা Office-এর কাছে সরাসরি
                purchase request পাঠান।
              </p>
            </div>

            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/25"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Selected Product Notice */}
        {selectedPost && (
          <div className="mb-5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
            <p className="text-xs font-bold text-orange-600">
              Selected Marketplace Product
            </p>

            <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-black text-slate-800">
                {selectedPost.title}
              </p>

              <p className="text-xs font-semibold text-slate-500">
                {selectedPost.price != null
                  ? `৳${selectedPost.price.toLocaleString()}`
                  : "Price on request"}
              </p>
            </div>
          </div>
        )}

        {/* Create Request */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
              <ShoppingCart className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                আমি কিনতে চাই
              </h2>

              <p className="text-sm text-slate-500">
                Marketplace-এর product নির্বাচন করে request পাঠান।
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* Product */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Marketplace Product
              </label>

              <select
                value={selectedPostId}
                onChange={(e) => handlePostChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">
                  -- Product নির্বাচন করুন --
                </option>

                {posts.map((post) => (
                  <option key={post.id} value={post.id}>
                    {post.title}
                    {post.price !== null
                      ? ` — ৳${post.price}`
                      : ""}
                  </option>
                ))}
              </select>

              {posts.length === 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  কোনো Marketplace product পাওয়া যায়নি।
                </p>
              )}
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Request Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="আমি এই পণ্যটি কিনতে চাই"
                maxLength={200}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                বিস্তারিত
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="আপনার প্রয়োজন বা অতিরিক্ত তথ্য লিখুন..."
                rows={4}
                maxLength={2000}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="যেমন: 2"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Budget */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Budget (৳)
              </label>

              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="আপনার বাজেট"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="যেমন: Dhaka"
                  maxLength={300}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={createRequest}
              disabled={submitting || !selectedPostId}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  আমি কিনতে চাই
                </>
              )}
            </button>
          </div>
        </section>

        {/* Received Requests */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700">
              <Store className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Received Buy Requests
              </h2>

              <p className="text-sm text-slate-500">
                আপনার product-এর জন্য আসা buyer requests
              </p>
            </div>
          </div>

          {receivedRequests.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Package className="mx-auto mb-3 h-10 w-10 text-slate-300" />

              <p className="font-semibold text-slate-600">
                এখনো কোনো Buy Request আসেনি।
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {receivedRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900">
                        {request.title}
                      </h3>

                      {request.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {request.description}
                        </p>
                      )}
                    </div>

                    <span
                      className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        request.status
                      )}`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {getStatusLabel(request.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                    <div>
                      <span className="font-semibold">Quantity:</span>{" "}
                      {request.quantity ?? "—"}
                    </div>

                    <div>
                      <span className="font-semibold">Budget:</span>{" "}
                      {request.budget !== null
                        ? `৳${request.budget}`
                        : "—"}
                    </div>

                    <div>
                      <span className="font-semibold">Location:</span>{" "}
                      {request.location || "—"}
                    </div>
                  </div>

                  {(request.status === "pending" ||
                    request.status === "active") && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={updatingId === request.id}
                        onClick={() =>
                          updateRequest(request.id, "accepted")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {updatingId === request.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        Accept
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === request.id}
                        onClick={() =>
                          updateRequest(request.id, "rejected")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === "accepted" && (
                    <div className="mt-4">
                      <button
                        type="button"
                        disabled={updatingId === request.id}
                        onClick={() =>
                          updateRequest(request.id, "completed")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" />
                        Completed
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sent Requests */}
        <section className="pb-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
              <ShoppingCart className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                My Buy Requests
              </h2>

              <p className="text-sm text-slate-500">
                আপনি যেসব seller-এর কাছে request পাঠিয়েছেন
              </p>
            </div>
          </div>

          {sentRequests.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <ShoppingCart className="mx-auto mb-3 h-10 w-10 text-slate-300" />

              <p className="font-semibold text-slate-600">
                আপনার কোনো Buy Request নেই।
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {sentRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {request.title}
                      </h3>

                      {request.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {request.description}
                        </p>
                      )}
                    </div>

                    <span
                      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                        request.status
                      )}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                    <div>
                      <span className="font-semibold">Quantity:</span>{" "}
                      {request.quantity ?? "—"}
                    </div>

                    <div>
                      <span className="font-semibold">Budget:</span>{" "}
                      {request.budget !== null
                        ? `৳${request.budget}`
                        : "—"}
                    </div>

                    <div>
                      <span className="font-semibold">Location:</span>{" "}
                      {request.location || "—"}
                    </div>
                  </div>

                  {(request.status === "pending" ||
                    request.status === "active") && (
                    <div className="mt-5">
                      <button
                        type="button"
                        disabled={updatingId === request.id}
                        onClick={() =>
                          updateRequest(request.id, "cancelled")
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                        Cancel Request
                      </button>
                    </div>
                  )}

                  {request.status === "accepted" && (
                    <div className="mt-4 rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                      Seller আপনার Buy Request গ্রহণ করেছেন।
                    </div>
                  )}

                  {request.status === "rejected" && (
                    <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                      Seller এই Buy Request গ্রহণ করেননি।
                    </div>
                  )}

                  {request.status === "completed" && (
                    <div className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
                      এই Buy Request completed হয়েছে।
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}