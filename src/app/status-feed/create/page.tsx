"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  Globe2,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Video,
  X,
  MapPin,
} from "lucide-react";
import { supabase } from "@/lib/client";

type MediaPreview = {
  file: File;
  url: string;
  type: "image" | "video";
};

type UploadedMedia = {
  url: string;
  type: "image" | "video";
};

export default function CreatePostPage() {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [postText, setPostText] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState<MediaPreview[]>([]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addMedia = (
    files: FileList | null,
    type: "image" | "video"
  ) => {
    if (!files || files.length === 0) return;

    setError("");

    const selected = Array.from(files);

    const validFiles = selected.filter((file) =>
      type === "image"
        ? file.type.startsWith("image/")
        : file.type.startsWith("video/")
    );

    if (validFiles.length === 0) {
      setError(
        type === "image"
          ? "শুধু ছবি নির্বাচন করুন।"
          : "শুধু ভিডিও নির্বাচন করুন।"
      );
      return;
    }

    const maxSize =
      type === "image"
        ? 10 * 1024 * 1024
        : 50 * 1024 * 1024;

    const tooLarge = validFiles.find(
      (file) => file.size > maxSize
    );

    if (tooLarge) {
      setError(
        type === "image"
          ? "ছবির সর্বোচ্চ size 10MB।"
          : "ভিডিওর সর্বোচ্চ size 50MB।"
      );
      return;
    }

    const remaining = Math.max(0, 4 - media.length);

    if (remaining === 0) {
      setError("সর্বোচ্চ ৪টি media যোগ করা যাবে।");
      return;
    }

    const previews: MediaPreview[] = validFiles
      .slice(0, remaining)
      .map((file) => ({
        file,
        url: URL.createObjectURL(file),
        type,
      }));

    setMedia((previous) => [
      ...previous,
      ...previews,
    ]);
  };

  const removeMedia = (index: number) => {
    setMedia((previous) => {
      const item = previous[index];

      if (item) {
        URL.revokeObjectURL(item.url);
      }

      return previous.filter(
        (_, currentIndex) => currentIndex !== index
      );
    });
  };

  const uploadMedia = async (
    userId: string,
    item: MediaPreview,
    index: number
  ): Promise<UploadedMedia> => {
    const extension =
      item.file.name.split(".").pop()?.toLowerCase() ||
      "file";

    const safeName = item.file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const fileName =
      `${userId}/${Date.now()}-${index}-${safeName}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from("status-feed")
        .upload(fileName, item.file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      throw new Error(
        `Media upload failed: ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from("status-feed")
      .getPublicUrl(fileName);

    if (!data?.publicUrl) {
      throw new Error(
        "Media public URL পাওয়া যায়নি।"
      );
    }

    return {
      url: data.publicUrl,
      type: item.type,
    };
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    const text = postText.trim();
    const cleanLocation = location.trim();

    if (!text && media.length === 0) {
      setError(
        "পোস্টে লেখা, ছবি অথবা ভিডিও দিন।"
      );
      return;
    }

    if (text.length > 2000) {
      setError(
        "পোস্ট সর্বোচ্চ ২০০০ অক্ষরের হতে পারবে।"
      );
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(userError.message);
      }

      if (!user) {
        setError(
          "পোস্ট করার জন্য আগে Login করুন।"
        );
        return;
      }

      /*
       * সবসময় array থাকবে।
       * Text-only post হলে [] যাবে।
       */
      let uploadedMedia: UploadedMedia[] = [];

      if (media.length > 0) {
        uploadedMedia = [];

        for (let i = 0; i < media.length; i++) {
          const uploaded = await uploadMedia(
            user.id,
            media[i],
            i
          );

          uploadedMedia.push(uploaded);
        }
      }

      /*
       * status_feed insert
       *
       * media কখনো null যাবে না।
       */
      const { error: postError } =
        await supabase
          .from("status_feed")
          .insert({
            user_id: user.id,
            content: text || null,
            visibility: visibility || "public",
            location: cleanLocation || null,
            media: uploadedMedia,
            created_at: new Date().toISOString(),
          });

      if (postError) {
        throw new Error(postError.message);
      }

      media.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });

      setPostText("");
      setLocation("");
      setMedia([]);
      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/status-feed";
      }, 900);
    } catch (err) {
      console.error(
        "Create post error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "পোস্ট প্রকাশ করা যায়নি।"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <Link
            href="/status-feed"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            News Feed
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#07152d] text-white">
              <MessageCircle className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-black text-[#07152d]">
                শ্রমবাজার
              </p>
              <p className="text-[10px] text-slate-400">
                Create Post
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 py-7 sm:py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
              <MessageCircle className="h-4 w-4" />
              Community
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight text-[#07152d] sm:text-3xl">
              নতুন পোস্ট
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              আপনার update community-এর সঙ্গে শেয়ার করুন।
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#07152d] text-white">
                <Users className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-black text-[#07152d]">
                  আপনার Profile
                </p>
                <p className="text-[11px] text-slate-400">
                  Community Post
                </p>
              </div>
            </div>

            <div className="p-5">
              <textarea
                value={postText}
                onChange={(e) => {
                  setPostText(e.target.value);
                  setError("");
                  setSuccess(false);
                }}
                placeholder="আপনি কী শেয়ার করতে চান?"
                maxLength={2000}
                rows={5}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />

              <div className="mt-1 flex justify-end text-[11px] text-slate-400">
                {postText.length}/2000
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    imageInputRef.current?.click()
                  }
                  disabled={media.length >= 4}
                  className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3.5 py-2.5 text-xs font-bold text-green-700 hover:bg-green-100 disabled:opacity-50"
                >
                  <ImageIcon className="h-4 w-4" />
                  ছবি
                </button>

                <button
                  type="button"
                  onClick={() =>
                    videoInputRef.current?.click()
                  }
                  disabled={media.length >= 4}
                  className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2.5 text-xs font-bold text-purple-700 hover:bg-purple-100 disabled:opacity-50"
                >
                  <Video className="h-4 w-4" />
                  ভিডিও
                </button>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    addMedia(
                      e.target.files,
                      "image"
                    );
                    e.currentTarget.value = "";
                  }}
                />

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    addMedia(
                      e.target.files,
                      "video"
                    );
                    e.currentTarget.value = "";
                  }}
                />
              </div>

              {media.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {media.map((item, index) => (
                    <div
                      key={`${item.url}-${index}`}
                      className="relative overflow-hidden rounded-xl bg-black"
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.url}
                          alt="Preview"
                          className="h-40 w-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.url}
                          controls
                          className="h-40 w-full object-cover"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          removeMedia(index)
                        }
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3">
                  <MapPin className="h-4 w-4 text-slate-400" />

                  <input
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                    placeholder="Location — ঐচ্ছিক"
                    className="h-10 w-full bg-transparent text-xs outline-none"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setVisibility("public")
                  }
                  className={`rounded-xl border p-3 text-left ${
                    visibility === "public"
                      ? "border-orange-400 bg-orange-50"
                      : "border-slate-200"
                  }`}
                >
                  <Globe2 className="h-4 w-4 text-orange-500" />
                  <p className="mt-1 text-xs font-bold">
                    Public
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setVisibility("community")
                  }
                  className={`rounded-xl border p-3 text-left ${
                    visibility === "community"
                      ? "border-green-400 bg-green-50"
                      : "border-slate-200"
                  }`}
                >
                  <Users className="h-4 w-4 text-green-600" />
                  <p className="mt-1 text-xs font-bold">
                    Community
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setVisibility("members")
                  }
                  className={`rounded-xl border p-3 text-left ${
                    visibility === "members"
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <p className="mt-1 text-xs font-bold">
                    Members
                  </p>
                </button>
              </div>

              {success && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-bold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  পোস্ট সফলভাবে প্রকাশ হয়েছে।
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-black text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {loading
                  ? "প্রকাশ হচ্ছে..."
                  : "পোস্ট প্রকাশ করুন"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}