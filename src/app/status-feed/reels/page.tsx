"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  ChevronRight,
  Heart,
  Loader2,
  MessageCircle,
  Play,
  Plus,
  RefreshCw,
  Share2,
  UserRound,
  Users,
  Video,
  X,
} from "lucide-react";
import { supabase } from "@/lib/client";

type MediaItem = {
  url: string;
  type: "image" | "video";
};

type ReelPost = {
  id: string;
  user_id: string;
  content: string | null;
  visibility: string | null;
  location: string | null;
  media: MediaItem[];
  created_at: string;
};

type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

export default function ReelsPage() {
  const [posts, setPosts] = useState<ReelPost[]>([]);
  const [profiles, setProfiles] = useState<
    Record<string, Profile>
  >({});

  const [currentUserId, setCurrentUserId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [liked, setLiked] = useState<
    Record<string, boolean>
  >({});

  const [saved, setSaved] = useState<
    Record<string, boolean>
  >({});

  /* =====================================================
     LOAD CURRENT USER
  ===================================================== */

  const loadCurrentUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setCurrentUserId(user?.id ?? null);
  }, []);

  /* =====================================================
     LOAD REELS
  ===================================================== */

  const loadReels = useCallback(async () => {
    try {
      setError("");

      const { data, error: feedError } = await supabase
        .from("status_feed")
        .select(
          `
          id,
          user_id,
          content,
          visibility,
          location,
          media,
          created_at
        `
        )
        .order("created_at", {
          ascending: false,
        });

      if (feedError) {
        throw new Error(feedError.message);
      }

      const rows = data ?? [];

      /* =================================================
         FORMAT VIDEO POSTS
      ================================================= */

      const formatted: ReelPost[] = rows
        .map((post) => {
          let media: MediaItem[] = [];

          if (Array.isArray(post.media)) {
            media = post.media.filter(
              (item: MediaItem) =>
                item &&
                typeof item.url === "string" &&
                (item.type === "image" ||
                  item.type === "video")
            );
          } else if (
            typeof post.media === "string"
          ) {
            try {
              const parsed = JSON.parse(post.media);

              if (Array.isArray(parsed)) {
                media = parsed.filter(
                  (item: MediaItem) =>
                    item &&
                    typeof item.url === "string" &&
                    (item.type === "image" ||
                      item.type === "video")
                );
              }
            } catch {
              media = [];
            }
          }

          return {
            id: post.id,
            user_id: post.user_id,
            content: post.content ?? null,
            visibility: post.visibility ?? "public",
            location: post.location ?? null,
            media,
            created_at: post.created_at,
          };
        })
        .filter((post) =>
          post.media.some(
            (media) => media.type === "video"
          )
        );

      setPosts(formatted);

      /* =================================================
         LOAD PROFILES
      ================================================= */

      const userIds = Array.from(
        new Set(
          formatted
            .map((post) => post.user_id)
            .filter(Boolean)
        )
      );

      if (userIds.length > 0) {
        const {
          data: profileRows,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("id, name, avatar_url")
          .in("id", userIds);

        if (profileError) {
          console.error(
            "Reels profile error:",
            profileError
          );
        }

        if (!profileError && profileRows) {
          const map: Record<string, Profile> = {};

          profileRows.forEach((profile) => {
            map[profile.id] = {
              id: profile.id,
              name: profile.name ?? null,
              avatar_url:
                profile.avatar_url ?? null,
            };
          });

          setProfiles(map);
        }
      } else {
        setProfiles({});
      }
    } catch (err) {
      console.error("Reels load error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Reels could not be loaded."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    void loadCurrentUser();
    void loadReels();
  }, [loadCurrentUser, loadReels]);

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadReels();
  };

  /* =====================================================
     PROFILE
  ===================================================== */

  const getProfile = (userId: string): Profile => {
    return (
      profiles[userId] ?? {
        id: userId,
        name: "Shromobazar User",
        avatar_url: null,
      }
    );
  };

  /* =====================================================
     DATE
  ===================================================== */

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString(
        "en-US",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );
    } catch {
      return date;
    }
  };

  /* =====================================================
     LIKE
  ===================================================== */

  const toggleLike = (postId: string) => {
    if (!currentUserId) {
      setError("Please log in to like a Reel.");
      return;
    }

    setLiked((previous) => ({
      ...previous,
      [postId]: !previous[postId],
    }));
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const toggleSave = (postId: string) => {
    setSaved((previous) => ({
      ...previous,
      [postId]: !previous[postId],
    }));
  };

  /* =====================================================
     SHARE
  ===================================================== */

  const shareReel = async (postId: string) => {
    const url =
      `${window.location.origin}` +
      `/status-feed/reels#reel-${postId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Shromobazar Reel",
          text:
            "Watch a Reel on Shromobazar.",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        window.alert("Reel link copied.");
      }
    } catch {
      // User cancelled sharing.
    }
  };

  /* =====================================================
     VIDEO COUNT
  ===================================================== */

  const totalVideos = useMemo(() => {
    return posts.reduce(
      (total, post) =>
        total +
        post.media.filter(
          (media) => media.type === "video"
        ).length,
      0
    );
  }, [posts]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-5 lg:px-8">
          <div className="flex items-center gap-2">
            <Link
              href="/status-feed"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-orange-500"
              aria-label="Back to Social Hub"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#07152d] text-white">
                <Video className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-black text-[#07152d]">
                  Social Reels
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Content Creation
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/status-feed/create"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2.5 text-[10px] font-black text-white transition hover:bg-orange-600 sm:px-4"
            >
              <Plus className="h-4 w-4" />

              <span className="hidden sm:inline">
                Create Reel
              </span>
            </Link>

            <Link
              href="/my-account"
              className="hidden h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-orange-50 hover:text-orange-500 sm:flex"
              aria-label="My Account"
            >
              <UserRound className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* =================================================
          PAGE
      ================================================= */}

      <div className="mx-auto max-w-6xl px-3 py-5 sm:px-5 lg:px-8">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="overflow-hidden rounded-3xl bg-[#07152d] p-5 text-white shadow-xl sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-orange-300">
                <Video className="h-3 w-3" />
                Social Content
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Reels & Content Creation
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-6 text-slate-300 sm:text-sm">
                Share your work, skills, experience, stories, learning, or creative videos with the Shromobazar community.
              </p>
            </div>

            <Link
              href="/status-feed/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3.5 text-xs font-black text-white shadow-lg transition hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Create Content
            </Link>
          </div>
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Video className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Reels
                </p>

                <p className="text-xl font-black text-[#07152d]">
                  {totalVideos}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[#07152d]">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Community
                </p>

                <p className="text-sm font-black text-[#07152d]">
                  Shromobazar
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Play className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  Content
                </p>

                <p className="text-sm font-black text-[#07152d]">
                  User Generated
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              {error}
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mb-4 mt-7 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-500">
              Community Videos
            </p>

            <h2 className="mt-1 text-xl font-black text-[#07152d]">
              Latest Reels
            </h2>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-orange-500 disabled:opacity-50"
            aria-label="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />

            <p className="mt-3 text-sm font-bold text-slate-500">
              Loading Reels...
            </p>
          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading && posts.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Video className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-lg font-black text-[#07152d]">
              No Reels yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first video and share it with the Shromobazar community.
            </p>

            <Link
              href="/status-feed/create"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-black text-white transition hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Create First Reel
            </Link>
          </div>
        )}

        {/* =================================================
            REELS GRID
        ================================================= */}

        {!loading && posts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const profile = getProfile(
                post.user_id
              );

              const video = post.media.find(
                (media) => media.type === "video"
              );

              if (!video) return null;

              const isLiked =
                liked[post.id] ?? false;

              const isSaved =
                saved[post.id] ?? false;

              return (
                <article
                  key={post.id}
                  id={`reel-${post.id}`}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {/* VIDEO */}

                  <div className="relative aspect-[9/14] overflow-hidden bg-black">
                    <video
                      src={video.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />

                    <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[9px] font-black text-white backdrop-blur">
                      <Play className="h-3 w-3 fill-current" />
                      Reel
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="p-4">
                    <div className="flex items-center gap-3">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={
                            profile.name ||
                            "Profile"
                          }
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#07152d] text-white">
                          <UserRound className="h-4 w-4" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black text-[#07152d]">
                          {profile.name ||
                            "Shromobazar User"}
                        </p>

                        <p className="mt-0.5 text-[9px] text-slate-400">
                          {formatDate(
                            post.created_at
                          )}
                        </p>
                      </div>
                    </div>

                    {post.content && (
                      <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-xs leading-5 text-slate-600">
                        {post.content}
                      </p>
                    )}

                    {post.location && (
                      <p className="mt-2 truncate text-[9px] text-slate-400">
                        {post.location}
                      </p>
                    )}

                    {/* ACTIONS */}

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            toggleLike(post.id)
                          }
                          className={`flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[10px] font-black transition ${
                            isLiked
                              ? "bg-red-50 text-red-500"
                              : "text-slate-500 hover:bg-slate-50"
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isLiked
                                ? "fill-current"
                                : ""
                            }`}
                          />
                          Like
                        </button>

                        <Link
                          href={`/status-feed#post-${post.id}`}
                          className="flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[10px] font-black text-slate-500 transition hover:bg-slate-50"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Comment
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            void shareReel(
                              post.id
                            )
                          }
                          className="flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-[10px] font-black text-slate-500 transition hover:bg-slate-50"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleSave(post.id)
                        }
                        className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                          isSaved
                            ? "bg-orange-50 text-orange-500"
                            : "text-slate-400 hover:bg-slate-50 hover:text-orange-500"
                        }`}
                        aria-label="Save Reel"
                      >
                        <Bookmark
                          className={`h-4 w-4 ${
                            isSaved
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =================================================
            CONTENT CREATOR CTA
        ================================================= */}

        <section className="mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white shadow-lg shadow-orange-500/20">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                <Video className="h-5 w-5" />
              </div>

              <h2 className="mt-4 text-lg font-black">
                Become a Shromobazar Creator
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-6 text-orange-50">
                Publish your skills, work, education, stories, and creative content. Creator profiles, audience growth, and monetization can be added in future phases.
              </p>
            </div>

            <Link
              href="/status-feed/create"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-xs font-black text-orange-600 transition hover:bg-orange-50"
            >
              <Plus className="h-4 w-4" />
              Start Creating
            </Link>
          </div>
        </section>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <Link
            href="/status-feed"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-xs font-black text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-orange-500"
          >
            Social Hub
            <ChevronRight className="h-4 w-4" />
          </Link>

          <Link
            href="/status-feed/create"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-xs font-black text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-orange-500"
          >
            Create Content
            <ChevronRight className="h-4 w-4" />
          </Link>

          <Link
            href="/entertainment"
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-xs font-black text-slate-600 shadow-sm transition hover:border-orange-200 hover:text-orange-500"
          >
            Premium Entertainment
            <ChevronRight className="h-4 w-4" />
          </Link>
        </section>

        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="py-8 text-center text-[9px] text-slate-400">
          © {new Date().getFullYear()} Shromobazar ·
          Social Reels · Content Creation
        </footer>
      </div>
    </main>
  );
}