"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  Globe2,
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share2,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import { supabase } from "@/lib/client";

type MediaItem = {
  url: string;
  type: "image" | "video";
};

type CommentItem = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
};

type Post = {
  id: string;
  user_id: string;
  content: string | null;
  visibility: string | null;
  location: string | null;
  media: MediaItem[];
  created_at: string;
  comments: CommentItem[];
  comment_count: number;
  like_count: number;
};

type Profile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

export default function StatusFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const [openComments, setOpenComments] = useState<
    Record<string, boolean>
  >({});

  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  const [following, setFollowing] = useState<Record<string, boolean>>({});

  const [sendingComment, setSendingComment] = useState<
    Record<string, boolean>
  >({});

  /* =====================================================
     CURRENT USER
  ===================================================== */

  const loadCurrentUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userId = user?.id ?? null;

    setCurrentUserId(userId);

    return userId;
  }, []);

  /* =====================================================
     LOAD POSTS
  ===================================================== */

  const loadPosts = useCallback(async () => {
    try {
      setError("");

      const { data, error: postError } = await supabase
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

      if (postError) {
        throw new Error(postError.message);
      }

      const rows = data ?? [];

      const userIds = Array.from(
        new Set(
          rows
            .map((item) => item.user_id)
            .filter(Boolean)
        )
      );

      /* ===================================================
         PROFILES
      =================================================== */

      if (userIds.length > 0) {
        const {
          data: profileRows,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("id, name, avatar_url")
          .in("id", userIds);

        if (profileError) {
          console.error("Profile load error:", profileError);
        }

        if (!profileError && profileRows) {
          const profileMap: Record<string, Profile> = {};

          profileRows.forEach((profile) => {
            profileMap[profile.id] = {
              id: profile.id,
              name: profile.name ?? null,
              avatar_url: profile.avatar_url ?? null,
            };
          });

          setProfiles(profileMap);
        }
      } else {
        setProfiles({});
      }

      /* ===================================================
         MEDIA FORMAT
      =================================================== */

      const formattedPosts: Post[] = rows.map((post) => {
        let media: MediaItem[] = [];

        if (Array.isArray(post.media)) {
          media = post.media.filter(
            (item: MediaItem) =>
              item &&
              typeof item.url === "string" &&
              (item.type === "image" || item.type === "video")
          );
        } else if (typeof post.media === "string") {
          try {
            const parsed = JSON.parse(post.media);

            if (Array.isArray(parsed)) {
              media = parsed.filter(
                (item: MediaItem) =>
                  item &&
                  typeof item.url === "string" &&
                  (item.type === "image" || item.type === "video")
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
          comments: [],
          comment_count: 0,
          like_count: 0,
        };
      });

      setPosts(formattedPosts);

      /* ===================================================
         COMMENTS
      =================================================== */

      if (formattedPosts.length > 0) {
        const postIds = formattedPosts.map((post) => post.id);

        const {
          data: commentRows,
          error: commentError,
        } = await supabase
          .from("status_comments")
          .select(
            "id, post_id, user_id, content, created_at"
          )
          .in("post_id", postIds)
          .order("created_at", {
            ascending: true,
          });

        if (commentError) {
          console.error("Comment load error:", commentError);
        }

        if (!commentError && commentRows) {
          setPosts((previous) =>
            previous.map((post) => {
              const comments = commentRows
                .filter(
                  (comment) => comment.post_id === post.id
                )
                .map((comment) => ({
                  id: comment.id,
                  user_id: comment.user_id,
                  content: comment.content,
                  created_at: comment.created_at,
                }));

              return {
                ...post,
                comments,
                comment_count: comments.length,
              };
            })
          );
        }
      }
    } catch (err) {
      console.error("Status feed error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Social Feed load করা যায়নি।"
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
    void loadPosts();
  }, [loadCurrentUser, loadPosts]);

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
  };

  /* =====================================================
     PROFILE
  ===================================================== */

  const getProfile = (userId: string): Profile => {
    return (
      profiles[userId] ?? {
        id: userId,
        name: "শ্রমবাজার সদস্য",
        avatar_url: null,
      }
    );
  };

  /* =====================================================
     DATE
  ===================================================== */

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleString("bn-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return date;
    }
  };

  /* =====================================================
     LIKE
  ===================================================== */

  const toggleLike = (postId: string) => {
    if (!currentUserId) {
      setError("Like করতে আগে Login করুন।");
      return;
    }

    const alreadyLiked = likedPosts[postId] ?? false;

    setLikedPosts((previous) => ({
      ...previous,
      [postId]: !alreadyLiked,
    }));

    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? {
              ...post,
              like_count: alreadyLiked
                ? Math.max(0, post.like_count - 1)
                : post.like_count + 1,
            }
          : post
      )
    );
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const toggleSave = (postId: string) => {
    setSavedPosts((previous) => ({
      ...previous,
      [postId]: !previous[postId],
    }));
  };

  /* =====================================================
     FOLLOW
  ===================================================== */

  const toggleFollow = (userId: string) => {
    if (!currentUserId) {
      setError("Follow করতে আগে Login করুন।");
      return;
    }

    if (userId === currentUserId) return;

    setFollowing((previous) => ({
      ...previous,
      [userId]: !previous[userId],
    }));
  };

  /* =====================================================
     COMMENT
  ===================================================== */

  const submitComment = async (postId: string) => {
    const text = (commentText[postId] ?? "").trim();

    if (!text) return;

    if (!currentUserId) {
      setError("Comment করতে আগে Login করুন।");
      return;
    }

    setSendingComment((previous) => ({
      ...previous,
      [postId]: true,
    }));

    try {
      const { data, error: commentError } = await supabase
        .from("status_comments")
        .insert({
          post_id: postId,
          user_id: currentUserId,
          content: text,
          created_at: new Date().toISOString(),
        })
        .select(
          "id, post_id, user_id, content, created_at"
        )
        .single();

      if (commentError) {
        throw new Error(commentError.message);
      }

      if (data) {
        const newComment: CommentItem = {
          id: data.id,
          user_id: data.user_id,
          content: data.content,
          created_at: data.created_at,
        };

        setPosts((previous) =>
          previous.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: [
                    ...post.comments,
                    newComment,
                  ],
                  comment_count:
                    post.comment_count + 1,
                }
              : post
          )
        );
      }

      setCommentText((previous) => ({
        ...previous,
        [postId]: "",
      }));

      setOpenComments((previous) => ({
        ...previous,
        [postId]: true,
      }));
    } catch (err) {
      console.error("Comment error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Comment করা যায়নি।"
      );
    } finally {
      setSendingComment((previous) => ({
        ...previous,
        [postId]: false,
      }));
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const deletePost = async (postId: string) => {
    if (!currentUserId) return;

    const confirmed = window.confirm(
      "আপনি কি এই পোস্টটি মুছে ফেলতে চান?"
    );

    if (!confirmed) return;

    try {
      const { error: deleteError } = await supabase
        .from("status_feed")
        .delete()
        .eq("id", postId)
        .eq("user_id", currentUserId);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      setPosts((previous) =>
        previous.filter((post) => post.id !== postId)
      );
    } catch (err) {
      console.error("Delete error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Post delete করা যায়নি।"
      );
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return posts;

    return posts.filter((post) => {
      const profile = getProfile(post.user_id);

      return Boolean(
        post.content?.toLowerCase().includes(query) ||
          profile.name?.toLowerCase().includes(query) ||
          post.location?.toLowerCase().includes(query)
      );
    });
  }, [posts, search, profiles]);

  /* =====================================================
     REELS
  ===================================================== */

  const reels = useMemo(() => {
    return posts.filter((post) =>
      post.media.some(
        (media) => media.type === "video"
      )
    );
  }, [posts]);

  /* =====================================================
     SHARE
  ===================================================== */

  const sharePost = async (postId: string) => {
    const url = `${window.location.origin}/status-feed#post-${postId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Shromobazar",
          text: "Shromobazar-এর একটি পোস্ট দেখুন",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Post link copy হয়েছে।");
      }
    } catch {
      // User cancelled native share.
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* =================================================
          TOP NAV
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-8">
          {/* LEFT */}

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-orange-500"
              aria-label="Home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <Link
              href="/"
              className="hidden items-center gap-2 sm:flex"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#07152d] text-white">
                <Users className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-black text-[#07152d]">
                  Shromobazar
                </p>

                <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Social
                </p>
              </div>
            </Link>
          </div>

          {/* CENTER SEARCH */}

          <div className="hidden w-full max-w-md px-6 md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search Shromobazar..."
                className="h-10 w-full rounded-full border border-slate-200 bg-slate-100 pl-10 pr-4 text-xs outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setShowSearch((previous) => !previous)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-orange-500 md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() =>
                setShowNotifications(
                  (previous) => !previous
                )
              }
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-orange-500"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
            </button>

            <Link
              href="/my-account"
              className="ml-1 hidden rounded-full bg-orange-500 px-4 py-2.5 text-[11px] font-black text-white transition hover:bg-orange-600 sm:block"
            >
              My Account
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH */}

        {showSearch && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                autoFocus
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search posts, people..."
                className="h-11 w-full rounded-full border border-slate-200 bg-slate-100 pl-10 pr-10 text-xs outline-none focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* NOTIFICATION */}

        {showNotifications && (
          <div className="border-t border-slate-100 bg-white px-4 py-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Bell className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-black text-[#07152d]">
                    Notifications
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    আপনার notification system future
                    integration-এর জন্য প্রস্তুত।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =================================================
          PAGE
      ================================================= */}

      <div className="mx-auto max-w-7xl px-3 py-5 sm:px-5 lg:px-8">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="mb-5 rounded-3xl bg-[#07152d] p-5 text-white shadow-xl sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] text-orange-300">
                <Users className="h-3 w-3" />
                Shromobazar Social
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Connect. Share. Grow.
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-6 text-slate-300 sm:text-sm">
                মানুষের সঙ্গে connect করুন, নিজের
                কাজ ও অভিজ্ঞতা share করুন এবং
                Shromobazar community-এর সঙ্গে যুক্ত
                থাকুন।
              </p>
            </div>

            <Link
              href="/status-feed/create"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3.5 text-xs font-black text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
              Create Post
            </Link>
          </div>
        </section>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="flex-1">
              {error}
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-black"
              aria-label="Close error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* =================================================
            STORIES / QUICK ACTIONS
        ================================================= */}

        <section className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-500">
                Community
              </p>

              <h2 className="mt-1 text-base font-black text-[#07152d]">
                Your Space
              </h2>
            </div>

            <Link
              href="/status-feed/create"
              className="text-[10px] font-black text-orange-500 hover:text-orange-600"
            >
              Create
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {/* CREATE STORY */}

            <Link
              href="/status-feed/create"
              className="relative flex h-28 w-20 shrink-0 flex-col items-center justify-end overflow-hidden rounded-2xl bg-[#07152d] p-2 text-center"
            >
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-orange-500/80 to-transparent" />

              <div className="relative z-10 mb-auto mt-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white">
                <Plus className="h-4 w-4" />
              </div>

              <span className="relative z-10 text-[9px] font-black text-white">
                Create
              </span>

              <span className="relative z-10 text-[8px] text-white/70">
                Story
              </span>
            </Link>

            {/* QUICK CARDS */}

            {[
              {
                title: "Chat",
                sub: "Members",
                href: "/chat",
                icon: MessageCircle,
              },
              {
                title: "Account",
                sub: "Profile",
                href: "/my-account",
                icon: Users,
              },
              {
                title: "Videos",
                sub: "Reels",
                href: "/entertainment",
                icon: Play,
              },
              {
                title: "Jobs",
                sub: "Find work",
                href: "/jobs",
                icon: Search,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="relative flex h-28 w-20 shrink-0 flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 p-2 text-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="relative z-10 mb-auto mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                    <Icon className="h-4 w-4 text-orange-400" />
                  </div>

                  <span className="relative z-10 text-[9px] font-black">
                    {item.title}
                  </span>

                  <span className="relative z-10 text-[8px] text-white/60">
                    {item.sub}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =================================================
            REELS
        ================================================= */}

        {!loading && reels.length > 0 && (
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-500">
                  Short Videos
                </p>

                <h2 className="mt-1 text-lg font-black text-[#07152d]">
                  Reels
                </h2>
              </div>

              <Link
                href="/entertainment"
                className="inline-flex items-center gap-1 text-[10px] font-black text-slate-500 hover:text-orange-500"
              >
                See All
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {reels.slice(0, 8).map((post) => {
                const video = post.media.find(
                  (media) => media.type === "video"
                );

                if (!video) return null;

                const profile = getProfile(post.user_id);

                return (
                  <Link
                    key={post.id}
                    href={`#post-${post.id}`}
                    className="group relative h-52 w-32 shrink-0 overflow-hidden rounded-2xl bg-black shadow-md sm:h-60 sm:w-36"
                  >
                    <video
                      src={video.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />

                    <div className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                      <Play className="h-3 w-3 fill-current" />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="truncate text-[10px] font-black text-white">
                        {profile.name || "শ্রমবাজার সদস্য"}
                      </p>

                      <p className="mt-1 line-clamp-2 text-[9px] leading-4 text-white/70">
                        {post.content || "Short video"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* =================================================
            MAIN GRID
        ================================================= */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,680px)_300px] lg:justify-center">
          {/* =================================================
              FEED
          ================================================= */}

          <section>
            {/* FEED HEADER */}

            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-500">
                  Social Feed
                </p>

                <h2 className="mt-1 text-lg font-black text-[#07152d]">
                  Latest Posts
                </h2>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-orange-500 disabled:opacity-50"
                aria-label="Refresh"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>

            {/* LOADING */}

            {loading && (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <Loader2 className="mx-auto h-7 w-7 animate-spin text-orange-500" />

                <p className="mt-3 text-sm font-bold text-slate-500">
                  Feed load হচ্ছে...
                </p>
              </div>
            )}

            {/* EMPTY */}

            {!loading && filteredPosts.length === 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Users className="h-7 w-7" />
                </div>

                <h3 className="mt-4 text-lg font-black text-[#07152d]">
                  {search
                    ? "No matching posts"
                    : "No posts yet"}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {search
                    ? "অন্য কিছু দিয়ে search করে দেখুন।"
                    : "Community-তে প্রথম post করুন।"}
                </p>

                {!search && (
                  <Link
                    href="/status-feed/create"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-black text-white transition hover:bg-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                    Create Post
                  </Link>
                )}
              </div>
            )}

            {/* POSTS */}

            {!loading &&
              filteredPosts.map((post) => {
                const profile = getProfile(post.user_id);

                const isLiked =
                  likedPosts[post.id] ?? false;

                const isSaved =
                  savedPosts[post.id] ?? false;

                const isFollowing =
                  following[post.user_id] ?? false;

                return (
                  <article
                    key={post.id}
                    id={`post-${post.id}`}
                    className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* POST HEADER */}

                    <div className="flex items-center justify-between px-4 py-4 sm:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        {/* AVATAR */}

                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.name || "Profile"}
                            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-slate-100"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#07152d] text-sm font-black text-white">
                            {(
                              profile.name || "S"
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-black text-[#07152d]">
                              {profile.name ||
                                "শ্রমবাজার সদস্য"}
                            </p>

                            {post.user_id !==
                              currentUserId && (
                              <button
                                type="button"
                                onClick={() =>
                                  toggleFollow(
                                    post.user_id
                                  )
                                }
                                className={`hidden items-center gap-1 rounded-full px-2 py-1 text-[9px] font-black sm:inline-flex ${
                                  isFollowing
                                    ? "bg-green-50 text-green-600"
                                    : "bg-orange-50 text-orange-500"
                                }`}
                              >
                                {isFollowing ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    Following
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="h-3 w-3" />
                                    Follow
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400">
                            <span>
                              {formatDate(
                                post.created_at
                              )}
                            </span>

                            <span>•</span>

                            <span className="inline-flex items-center gap-1">
                              {post.visibility ===
                              "community" ? (
                                <Users className="h-3 w-3" />
                              ) : (
                                <Globe2 className="h-3 w-3" />
                              )}

                              {post.visibility ===
                              "community"
                                ? "Community"
                                : post.visibility ===
                                  "members"
                                ? "Members"
                                : "Public"}
                            </span>

                            {post.location && (
                              <>
                                <span>•</span>

                                <span className="truncate">
                                  {post.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {currentUserId === post.user_id && (
                        <button
                          type="button"
                          onClick={() =>
                            deletePost(post.id)
                          }
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          aria-label="Delete post"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* CONTENT */}

                    {post.content && (
                      <div className="px-4 pb-4 sm:px-5">
                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                          {post.content}
                        </p>
                      </div>
                    )}

                    {/* MEDIA */}

                    {post.media.length > 0 && (
                      <div
                        className={`grid gap-0.5 ${
                          post.media.length === 1
                            ? "grid-cols-1"
                            : "grid-cols-2"
                        }`}
                      >
                        {post.media.map(
                          (media, index) => (
                            <div
                              key={`${media.url}-${index}`}
                              className="relative overflow-hidden bg-black"
                            >
                              {media.type ===
                              "video" ? (
                                <>
                                  <video
                                    src={media.url}
                                    controls
                                    playsInline
                                    preload="metadata"
                                    className="max-h-[560px] min-h-[220px] w-full object-cover"
                                  />

                                  <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[9px] font-black text-white backdrop-blur">
                                    <Video className="h-3 w-3" />
                                    Video
                                  </div>
                                </>
                              ) : (
                                <>
                                  <img
                                    src={media.url}
                                    alt="Post media"
                                    loading="lazy"
                                    className="max-h-[560px] min-h-[180px] w-full object-cover"
                                  />

                                  <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[9px] font-black text-white backdrop-blur">
                                    <ImageIcon className="h-3 w-3" />
                                    Photo
                                  </div>
                                </>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* COUNTER */}

                    {(post.like_count > 0 ||
                      post.comment_count > 0) && (
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 text-[10px] text-slate-400 sm:px-5">
                        <span>
                          {post.like_count > 0
                            ? `${post.like_count} ${
                                post.like_count === 1
                                  ? "Like"
                                  : "Likes"
                              }`
                            : ""}
                        </span>

                        <span>
                          {post.comment_count > 0
                            ? `${post.comment_count} ${
                                post.comment_count === 1
                                  ? "Comment"
                                  : "Comments"
                              }`
                            : ""}
                        </span>
                      </div>
                    )}

                    {/* ACTIONS */}

                    <div className="px-3 py-2 sm:px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex min-w-0 items-center gap-0.5">
                          {/* LIKE */}

                          <button
                            type="button"
                            onClick={() =>
                              toggleLike(post.id)
                            }
                            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-black transition sm:px-3 ${
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

                            <span className="hidden sm:inline">
                              {isLiked
                                ? "Liked"
                                : "Like"}
                            </span>
                          </button>

                          {/* COMMENT */}

                          <button
                            type="button"
                            onClick={() =>
                              setOpenComments(
                                (previous) => ({
                                  ...previous,
                                  [post.id]:
                                    !previous[post.id],
                                })
                              )
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-black text-slate-500 transition hover:bg-slate-50 sm:px-3"
                          >
                            <MessageCircle className="h-4 w-4" />

                            <span className="hidden sm:inline">
                              Comment
                            </span>
                          </button>

                          {/* SHARE */}

                          <button
                            type="button"
                            onClick={() =>
                              sharePost(post.id)
                            }
                            className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-black text-slate-500 transition hover:bg-slate-50 sm:px-3"
                          >
                            <Share2 className="h-4 w-4" />

                            <span className="hidden sm:inline">
                              Share
                            </span>
                          </button>
                        </div>

                        {/* SAVE */}

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
                          aria-label="Save"
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

                      {/* COMMENTS */}

                      {openComments[post.id] && (
                        <div className="mt-2 border-t border-slate-100 pt-3">
                          {post.comments.length > 0 && (
                            <div className="space-y-2.5">
                              {post.comments.map(
                                (comment) => {
                                  const commentProfile =
                                    getProfile(
                                      comment.user_id
                                    );

                                  return (
                                    <div
                                      key={
                                        comment.id
                                      }
                                      className="flex gap-2.5"
                                    >
                                      {commentProfile.avatar_url ? (
                                        <img
                                          src={
                                            commentProfile.avatar_url
                                          }
                                          alt={
                                            commentProfile.name ||
                                            ""
                                          }
                                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#07152d] text-[9px] font-black text-white">
                                          SB
                                        </div>
                                      )}

                                      <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 px-3 py-2.5">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="text-[10px] font-black text-slate-700">
                                            {commentProfile.name ||
                                              "সদস্য"}
                                          </span>

                                          <span className="text-[8px] text-slate-400">
                                            {formatDate(
                                              comment.created_at
                                            )}
                                          </span>
                                        </div>

                                        <p className="mt-1.5 whitespace-pre-wrap text-xs leading-5 text-slate-600">
                                          {
                                            comment.content
                                          }
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}

                          {/* INPUT */}

                          <div className="mt-3 flex gap-2">
                            {currentUserId && (
                              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#07152d] text-white sm:flex">
                                <Users className="h-4 w-4" />
                              </div>
                            )}

                            <input
                              type="text"
                              value={
                                commentText[post.id] ||
                                ""
                              }
                              onChange={(e) =>
                                setCommentText(
                                  (previous) => ({
                                    ...previous,
                                    [post.id]:
                                      e.target.value,
                                  })
                                )
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === "Enter" &&
                                  !e.shiftKey
                                ) {
                                  e.preventDefault();

                                  void submitComment(
                                    post.id
                                  );
                                }
                              }}
                              placeholder={
                                currentUserId
                                  ? "Write a comment..."
                                  : "Login করে comment করুন..."
                              }
                              maxLength={500}
                              className="h-10 min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-xs outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                void submitComment(
                                  post.id
                                )
                              }
                              disabled={
                                sendingComment[
                                  post.id
                                ] ||
                                !(
                                  commentText[
                                    post.id
                                  ] || ""
                                ).trim()
                              }
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label="Send comment"
                            >
                              {sendingComment[
                                post.id
                              ] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
          </section>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* ACCOUNT */}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07152d] text-white">
                    <Users className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-[#07152d]">
                      My Social Space
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Shromobazar Community
                    </p>
                  </div>
                </div>

                <Link
                  href="/my-account"
                  className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-[10px] font-black text-slate-600 transition hover:bg-orange-50 hover:text-orange-500"
                >
                  View My Account
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              {/* CREATE */}

              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 text-white shadow-lg shadow-orange-500/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Plus className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-black">
                  Share with Community
                </h3>

                <p className="mt-2 text-[11px] leading-5 text-orange-50">
                  আপনার কাজ, অভিজ্ঞতা, ছবি অথবা
                  video community-এর সঙ্গে share
                  করুন।
                </p>

                <Link
                  href="/status-feed/create"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[10px] font-black text-orange-600 transition hover:bg-orange-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Post
                </Link>
              </div>

              {/* COMMUNITY */}

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-500">
                  Explore
                </p>

                <div className="mt-3 space-y-1">
                  <Link
                    href="/workers"
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Workers
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href="/jobs"
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Jobs
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href="/marketplace"
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Marketplace
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href="/chat"
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Chat
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href="/entertainment"
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Entertainment
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* FOOTNOTE */}

              <div className="px-3 text-[9px] leading-5 text-slate-400">
                Shromobazar Social Platform · Community
                · Jobs · Marketplace · Workforce
              </div>
            </div>
          </aside>
        </div>

        {/* FOOTER */}

        <footer className="py-8 text-center text-[9px] text-slate-400">
          © {new Date().getFullYear()} Shromobazar ·
          Global Workforce Platform
        </footer>
      </div>
    </main>
  );
}