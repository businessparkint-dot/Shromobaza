"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  Clock3,
  Compass,
  Eye,
  Heart,
  Home,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share2,
  UserPlus,
  UserRound,
  Users,
  Video,
  X,
} from "lucide-react";

import { supabase } from "@/lib/client";

type MediaItem = {
  type?: string;
  url?: string;
  src?: string;
  thumbnail?: string;
  title?: string;
};

type CommentItem = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: Profile | null;
};

type Profile = {
  id: string;
  name?: string | null;
  phone?: string | null;
  location?: string | null;
  user_type?: string | null;
  worker_category?: string | null;
  worker_sub_category?: string | null;
  avatar_url?: string | null;
};

type Post = {
  id: string;
  user_id: string;
  content: string;
  visibility?: string | null;
  location?: string | null;
  media: MediaItem[];
  created_at: string;
  profile?: Profile | null;
  comments: CommentItem[];
  comment_count: number;
  like_count: number;
  relevanceScore?: number;
};

type FeedTab = "following" | "for-you" | "nearby";

const CURRENT_USER_KEY = "shromobazar_current_user";

function safeMedia(value: unknown): MediaItem[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value as MediaItem[];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed as MediaItem[];
      }

      return [];
    } catch {
      return [];
    }
  }

  if (typeof value === "object") {
    return [value as MediaItem];
  }

  return [];
}

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString("bn-BD", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getProfileName(profile?: Profile | null) {
  if (profile?.name?.trim()) {
    return profile.name.trim();
  }

  return "Shromobazar User";
}

function getInitial(profile?: Profile | null) {
  const name = getProfileName(profile);

  return name.charAt(0).toUpperCase();
}

function getMediaUrl(item?: MediaItem) {
  if (!item) return "";

  return item.url || item.src || "";
}

function isVideo(item?: MediaItem) {
  if (!item) return false;

  const type = String(item.type || "").toLowerCase();
  const url = getMediaUrl(item).toLowerCase();

  return (
    type.includes("video") ||
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".mov") ||
    url.includes(".mp4?")
  );
}

function getVisibilityLabel(value?: string | null) {
  switch (value) {
    case "private":
      return "Only me";
    case "followers":
      return "Followers";
    case "friends":
      return "Connections";
    default:
      return "Public";
  }
}

function normalize(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function getLocationValue(post: Post) {
  return normalize(
    post.location ||
      post.profile?.location ||
      "",
  );
}

export default function StatusFeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserProfile, setCurrentUserProfile] =
    useState<Profile | null>(null);

  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});

  const [activeTab, setActiveTab] =
    useState<FeedTab>("for-you");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [openComments, setOpenComments] =
    useState<Record<string, boolean>>({});

  const [commentText, setCommentText] =
    useState<Record<string, string>>({});

  const [sendingComment, setSendingComment] =
    useState<Record<string, boolean>>({});

  const [currentPage, setCurrentPage] = useState(1);

  const POSTS_PER_PAGE = 10;

  const loadCurrentUser = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCurrentUserId(null);
      setCurrentUserProfile(null);
      return null;
    }

    setCurrentUserId(user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id,name,phone,location,user_type,worker_category,worker_sub_category,avatar_url",
      )
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      setCurrentUserProfile(profile as Profile);
    }

    return user.id;
  }, []);

  const loadFollowing = useCallback(async (userId: string) => {
    const { data, error: followError } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);

    if (followError) {
      console.error("Follow load error:", followError);
      return;
    }

    const map: Record<string, boolean> = {};

    for (const row of data || []) {
      if (row.following_id) {
        map[row.following_id] = true;
      }
    }

    setFollowing(map);
  }, []);

  const loadPosts = useCallback(async () => {
    setError("");

    const { data: feedData, error: feedError } = await supabase
      .from("status_feed")
      .select(
        "id,user_id,content,visibility,location,media,created_at",
      )
      .order("created_at", {
        ascending: false,
      });

    if (feedError) {
      console.error("Feed load error:", feedError);
      setError("Status Feed could not be loaded.");
      setPosts([]);
      return;
    }

    const rawPosts = feedData || [];

    const userIds = Array.from(
      new Set(
        rawPosts
          .map((post) => post.user_id)
          .filter(Boolean),
      ),
    );

    let profileMap: Record<string, Profile> = {};

    if (userIds.length > 0) {
      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select(
            "id,name,phone,location,user_type,worker_category,worker_sub_category,avatar_url",
          )
          .in("id", userIds);

      if (profileError) {
        console.error(
          "Profile load error:",
          profileError,
        );
      } else {
        profileMap = Object.fromEntries(
          (profileData || []).map((profile) => [
            profile.id,
            profile as Profile,
          ]),
        );
      }
    }

    const postIds = rawPosts.map((post) => post.id);

    let commentsMap: Record<string, CommentItem[]> = {};

    if (postIds.length > 0) {
      const {
        data: commentData,
        error: commentError,
      } = await supabase
        .from("status_comments")
        .select(
          "id,user_id,content,created_at,post_id",
        )
        .in("post_id", postIds)
        .order("created_at", {
          ascending: true,
        });

      if (commentError) {
        console.error(
          "Comment load error:",
          commentError,
        );
      } else {
        const commentUserIds = Array.from(
          new Set(
            (commentData || [])
              .map((comment) => comment.user_id)
              .filter(Boolean),
          ),
        );

        let commentProfileMap: Record<string, Profile> = {};

        if (commentUserIds.length > 0) {
          const {
            data: commentProfiles,
          } = await supabase
            .from("profiles")
            .select(
              "id,name,phone,location,user_type,worker_category,worker_sub_category,avatar_url",
            )
            .in("id", commentUserIds);

          commentProfileMap = Object.fromEntries(
            (commentProfiles || []).map((profile) => [
              profile.id,
              profile as Profile,
            ]),
          );
        }

        for (const comment of commentData || []) {
          const postId = comment.post_id;

          if (!commentsMap[postId]) {
            commentsMap[postId] = [];
          }

          commentsMap[postId].push({
            id: comment.id,
            user_id: comment.user_id,
            content: comment.content,
            created_at: comment.created_at,
            profile:
              commentProfileMap[comment.user_id] || null,
          });
        }
      }
    }

    const mappedPosts: Post[] = rawPosts.map((post) => {
      const comments = commentsMap[post.id] || [];

      return {
        id: post.id,
        user_id: post.user_id,
        content: post.content || "",
        visibility: post.visibility,
        location: post.location,
        media: safeMedia(post.media),
        created_at: post.created_at,
        profile: profileMap[post.user_id] || null,
        comments,
        comment_count: comments.length,
        like_count: 0,
      };
    });

    setPosts(mappedPosts);
  }, []);

  const loadEverything = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const userId = await loadCurrentUser();

        if (userId) {
          await loadFollowing(userId);
        } else {
          setFollowing({});
        }

        await loadPosts();
      } catch (err) {
        console.error(err);
        setError("There was a problem loading the feed.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      loadCurrentUser,
      loadFollowing,
      loadPosts,
    ],
  );

  useEffect(() => {
    void loadEverything();
  }, [loadEverything]);

  const toggleFollow = async (userId: string) => {
    if (!currentUserId) {
      setError("Please log in before following users.");
      return;
    }

    if (userId === currentUserId) {
      return;
    }

    const isAlreadyFollowing = !!following[userId];

    setFollowing((previous) => ({
      ...previous,
      [userId]: !isAlreadyFollowing,
    }));

    if (isAlreadyFollowing) {
      const { error: deleteError } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", userId);

      if (deleteError) {
        console.error(
          "Unfollow error:",
          deleteError,
        );

        setFollowing((previous) => ({
          ...previous,
          [userId]: true,
        }));

        setError("Could not unfollow this user.");
      }

      return;
    }

    const { error: insertError } = await supabase
      .from("follows")
      .insert({
        follower_id: currentUserId,
        following_id: userId,
      });

    if (insertError) {
      console.error(
        "Follow error:",
        insertError,
      );

      setFollowing((previous) => ({
        ...previous,
        [userId]: false,
      }));

      if (
        insertError.code === "23505"
      ) {
        await loadFollowing(currentUserId);
      } else {
        setError("Could not follow this user.");
      }
    }
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((previous) => ({
      ...previous,
      [postId]: !previous[postId],
    }));

    setPosts((previous) =>
      previous.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const wasLiked = !!likedPosts[postId];

        return {
          ...post,
          like_count: Math.max(
            0,
            post.like_count +
              (wasLiked ? -1 : 1),
          ),
        };
      }),
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((previous) => ({
      ...previous,
      [postId]: !previous[postId],
    }));
  };

  const toggleComments = (postId: string) => {
    setOpenComments((previous) => ({
      ...previous,
      [postId]: !previous[postId],
    }));
  };

  const submitComment = async (postId: string) => {
    if (!currentUserId) {
      setError("Please log in before commenting.");
      return;
    }

    const text = (
      commentText[postId] || ""
    ).trim();

    if (!text) {
      return;
    }

    setSendingComment((previous) => ({
      ...previous,
      [postId]: true,
    }));

    const { data, error: commentError } =
      await supabase
        .from("status_comments")
        .insert({
          post_id: postId,
          user_id: currentUserId,
          content: text,
        })
        .select(
          "id,user_id,content,created_at,post_id",
        )
        .single();

    if (commentError) {
      console.error(
        "Comment insert error:",
        commentError,
      );

      setError("Comment could not be sent.");

      setSendingComment((previous) => ({
        ...previous,
        [postId]: false,
      }));

      return;
    }

    const newComment: CommentItem = {
      id: data.id,
      user_id: data.user_id,
      content: data.content,
      created_at: data.created_at,
      profile: currentUserProfile,
    };

    setPosts((previous) =>
      previous.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return {
          ...post,
          comments: [
            ...post.comments,
            newComment,
          ],
          comment_count:
            post.comment_count + 1,
        };
      }),
    );

    setCommentText((previous) => ({
      ...previous,
      [postId]: "",
    }));

    setSendingComment((previous) => ({
      ...previous,
      [postId]: false,
    }));
  };

  const deletePost = async (postId: string) => {
    if (!currentUserId) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this post?",
    );

    if (!confirmed) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("status_feed")
      .delete()
      .eq("id", postId)
      .eq("user_id", currentUserId);

    if (deleteError) {
      console.error(
        "Delete post error:",
        deleteError,
      );

      setError("The post could not be deleted.");
      return;
    }

    setPosts((previous) =>
      previous.filter(
        (post) => post.id !== postId,
      ),
    );
  };

  const sharePost = async (post: Post) => {
    const shareText =
      post.content.length > 180
        ? `${post.content.slice(0, 180)}...`
        : post.content;

    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/status-feed`
        : "";

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title: "Shromobazar Status",
          text: shareText,
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(
        `${shareText}\n${shareUrl}`,
      );

      window.alert(
        "Post link copied.",
      );
    } catch {
      // User cancelled share.
    }
  };

  const filteredPosts = useMemo(() => {
    const query = normalize(search);

    let result = [...posts];

    if (query) {
      result = result.filter((post) => {
        const searchable = [
          post.content,
          getProfileName(post.profile),
          post.location,
          post.profile?.location,
          post.profile?.worker_category,
          post.profile?.worker_sub_category,
          post.profile?.user_type,
        ]
          .map(normalize)
          .join(" ");

        return searchable.includes(query);
      });
    }

    const currentLocation = normalize(
      currentUserProfile?.location,
    );

    result = result.map((post) => {
      let score = 0;

      const isFollowing =
        !!following[post.user_id];

      const sameLocation =
        currentLocation &&
        getLocationValue(post) &&
        (
          getLocationValue(post).includes(
            currentLocation,
          ) ||
          currentLocation.includes(
            getLocationValue(post),
          )
        );

      const sameCategory =
        normalize(
          currentUserProfile?.worker_category,
        ) &&
        normalize(
          currentUserProfile?.worker_category,
        ) ===
          normalize(
            post.profile?.worker_category,
          );

      const sameUserType =
        normalize(
          currentUserProfile?.user_type,
        ) &&
        normalize(
          currentUserProfile?.user_type,
        ) ===
          normalize(
            post.profile?.user_type,
          );

      if (isFollowing) {
        score += 100;
      }

      if (sameLocation) {
        score += 30;
      }

      if (sameCategory) {
        score += 20;
      }

      if (sameUserType) {
        score += 10;
      }

      return {
        ...post,
        relevanceScore: score,
      };
    });

    if (activeTab === "following") {
      result = result
        .filter(
          (post) =>
            following[post.user_id] === true ||
            post.user_id === currentUserId,
        )
        .sort((a, b) => {
          const scoreDifference =
            (b.relevanceScore || 0) -
            (a.relevanceScore || 0);

          if (scoreDifference !== 0) {
            return scoreDifference;
          }

          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        });
    }

    if (activeTab === "for-you") {
      result.sort((a, b) => {
        const scoreDifference =
          (b.relevanceScore || 0) -
          (a.relevanceScore || 0);

        if (scoreDifference !== 0) {
          return scoreDifference;
        }

        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      });
    }

    if (activeTab === "nearby") {
      result = result
        .filter((post) => {
          if (!currentLocation) {
            return true;
          }

          const location =
            getLocationValue(post);

          return (
            location.includes(
              currentLocation,
            ) ||
            currentLocation.includes(location)
          );
        })
        .sort((a, b) => {
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        });
    }

    return result;
  }, [
    posts,
    search,
    activeTab,
    following,
    currentUserId,
    currentUserProfile,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPosts.length /
        POSTS_PER_PAGE,
    ),
  );

  const paginatedPosts = useMemo(() => {
    const start =
      (currentPage - 1) *
      POSTS_PER_PAGE;

    return filteredPosts.slice(
      start,
      start + POSTS_PER_PAGE,
    );
  }, [
    filteredPosts,
    currentPage,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    activeTab,
  ]);

  const reels = useMemo(() => {
    return posts.filter((post) =>
      post.media.some((item) =>
        isVideo(item),
      ),
    );
  }, [posts]);

  const changeTab = (tab: FeedTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-orange-500 text-xl font-black text-white shadow-sm">
              S
            </div>

            <div className="hidden min-[480px]:block">
              <div className="text-lg font-black leading-none text-slate-900">
                Shromo<span className="text-orange-500">bazar</span>
              </div>

              <div className="mt-1 text-[10px] font-semibold text-slate-400">
                Connect • Share • Grow
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="ml-1 hidden items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 md:flex"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() =>
              setShowSearch(
                (value) => !value,
              )
            }
            className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setShowNotifications(
                (value) => !value,
              )
            }
            className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
          </button>

          <Link
            href="/my-account"
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <UserRound className="h-4 w-4" />
            <span className="hidden sm:inline">
              My Account
            </span>
          </Link>
        </div>

        {showSearch && (
          <div className="border-t border-slate-100 bg-white px-4 py-3">
            <div className="mx-auto flex max-w-7xl items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <Search className="h-4 w-4 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search jobs, workers, businesses, services, or posts..."
                className="w-full bg-transparent py-3 text-sm outline-none"
                autoFocus
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="rounded-lg p-1.5 hover:bg-white"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {showNotifications && (
          <div className="border-t border-slate-100 bg-white px-4 py-4">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 font-bold">
                  <Bell className="h-4 w-4 text-orange-500" />
                  Notifications
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  New notifications will appear here.
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* HERO */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-800 via-blue-700 to-slate-900 p-6 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold">
                <Users className="h-3.5 w-3.5" />
                Shromobazar Community
              </div>

              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                Connect. Share. Grow.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 md:text-base">
                Build meaningful connections around work, people, business, services, and education.
              </p>
            </div>

            <Link
              href="/status-feed/create"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-950/20 hover:bg-orange-400"
            >
              <Plus className="h-5 w-5" />
              Create Post
            </Link>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
          <Link
            href="/status-feed/create"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Plus className="h-5 w-5 text-orange-500" />
            <div className="mt-3 text-sm font-black">
              Create
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Share something
            </div>
          </Link>

          <Link
            href="/chat"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <div className="mt-3 text-sm font-black">
              Chat
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Talk to people
            </div>
          </Link>

          <Link
            href="/my-account"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <UserRound className="h-5 w-5 text-emerald-600" />
            <div className="mt-3 text-sm font-black">
              Account
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Manage identities
            </div>
          </Link>

          <a
            href="#reels"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Video className="h-5 w-5 text-purple-600" />
            <div className="mt-3 text-sm font-black">
              Videos
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Watch updates
            </div>
          </a>

          <Link
            href="/jobs"
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
            <div className="mt-3 text-sm font-black">
              Jobs
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Find opportunities
            </div>
          </Link>
        </section>

        {/* FEED TABS */}
        <section className="mt-6">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <button
              type="button"
              onClick={() =>
                changeTab("following")
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                activeTab === "following"
                  ? "bg-blue-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Following
            </button>

            <button
              type="button"
              onClick={() =>
                changeTab("for-you")
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                activeTab === "for-you"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Compass className="h-4 w-4" />
              For You
            </button>

            <button
              type="button"
              onClick={() =>
                changeTab("nearby")
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                activeTab === "nearby"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <MapPin className="h-4 w-4" />
              Nearby
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-xs font-medium text-slate-400 sm:inline">
                {filteredPosts.length} posts
              </span>

              <button
                type="button"
                onClick={() =>
                  void loadEverything(true)
                }
                disabled={refreshing}
                className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Refresh"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {activeTab === "following" && (
            <p className="mt-2 px-1 text-xs text-slate-400">
              Posts from people you follow are prioritized here.
            </p>
          )}

          {activeTab === "for-you" && (
            <p className="mt-2 px-1 text-xs text-slate-400">
              Relevant content is prioritized based on your work, category, activity, and connections.
            </p>
          )}

          {activeTab === "nearby" && (
            <p className="mt-2 px-1 text-xs text-slate-400">
              Public content related to your profile location is shown here.
            </p>
          )}
        </section>

        {/* REELS */}
        <section
          id="reels"
          className="mt-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">
                Reels & Videos
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Shromobazar community
                video content
              </p>
            </div>

            <Video className="h-5 w-5 text-purple-500" />
          </div>

          {reels.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {reels.slice(0, 8).map((post) => {
                const video =
                  post.media.find(
                    (item) =>
                      isVideo(item),
                  );

                const mediaUrl =
                  getMediaUrl(video);

                return (
                  <div
                    key={post.id}
                    className="group relative h-52 min-w-[150px] overflow-hidden rounded-2xl bg-slate-900"
                  >
                    {mediaUrl ? (
                      <video
                        src={mediaUrl}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800">
                        <Play className="h-10 w-10 text-white" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <div className="text-xs font-bold text-white">
                        {getProfileName(
                          post.profile,
                        )}
                      </div>

                      <div className="mt-1 line-clamp-2 text-[11px] text-white/80">
                        {post.content}
                      </div>
                    </div>

                    <div className="absolute left-2 top-2 rounded-full bg-black/50 p-1.5 text-white">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <Video className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-bold text-slate-500">
                No video posts yet.
              </p>
            </div>
          )}
        </section>

        {/* ERROR */}
        {error && (
          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="rounded-lg p-1 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  Latest Posts
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Public community updates
                </p>
              </div>

              <div className="hidden items-center gap-1 text-xs text-slate-400 sm:flex">
                <Clock3 className="h-3.5 w-3.5" />
                Updated
              </div>
            </div>

            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-600" />

                <p className="mt-3 text-sm font-semibold text-slate-500">
                  Feed loading...
                </p>
              </div>
            ) : paginatedPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Users className="mx-auto h-9 w-9 text-slate-300" />

                <h3 className="mt-4 text-base font-black text-slate-700">
                  No posts found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                  Try another tab or create a new community post.
                </p>

                {activeTab ===
                  "following" && (
                  <button
                    type="button"
                    onClick={() =>
                      changeTab(
                        "for-you",
                      )
                    }
                    className="mt-5 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    View For You
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {paginatedPosts.map(
                  (post) => {
                    const isOwnPost =
                      post.user_id ===
                      currentUserId;

                    const isFollowing =
                      !!following[
                        post.user_id
                      ];

                    return (
                      <article
                        key={post.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                      >
                        {/* POST HEADER */}
                        <div className="flex items-start gap-3 p-4">
                          {post.profile
                            ?.avatar_url ? (
                            <img
                              src={
                                post.profile
                                  .avatar_url
                              }
                              alt=""
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-orange-500 text-sm font-black text-white">
                              {getInitial(
                                post.profile,
                              )}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-black text-slate-900">
                                {getProfileName(
                                  post.profile,
                                )}
                              </span>

                              {!isOwnPost && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void toggleFollow(
                                      post.user_id,
                                    )
                                  }
                                  className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                                    isFollowing
                                      ? "bg-slate-100 text-slate-600"
                                      : "bg-blue-50 text-blue-700"
                                  }`}
                                >
                                  {isFollowing
                                    ? "Following"
                                    : "Follow"}
                                </button>
                              )}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                              <span>
                                {formatDate(
                                  post.created_at,
                                )}
                              </span>

                              <span>•</span>

                              <span>
                                {formatTime(
                                  post.created_at,
                                )}
                              </span>

                              {post.location && (
                                <>
                                  <span>
                                    •
                                  </span>

                                  <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {
                                      post.location
                                    }
                                  </span>
                                </>
                              )}

                              <span>
                                •
                              </span>

                              <span className="inline-flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {getVisibilityLabel(
                                  post.visibility,
                                )}
                              </span>
                            </div>
                          </div>

                          {isOwnPost && (
                            <button
                              type="button"
                              onClick={() =>
                                void deletePost(
                                  post.id,
                                )
                              }
                              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                              aria-label="Delete post"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          )}
                        </div>

                        {/* POST CONTENT */}
                        {post.content && (
                          <div className="px-4 pb-4">
                            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                              {post.content}
                            </p>
                          </div>
                        )}

                        {/* MEDIA */}
                        {post.media.length > 0 && (
                          <div
                            className={`grid gap-1 ${
                              post.media.length ===
                              1
                                ? "grid-cols-1"
                                : "grid-cols-2"
                            }`}
                          >
                            {post.media
                              .slice(0, 4)
                              .map(
                                (
                                  media,
                                  index,
                                ) => {
                                  const url =
                                    getMediaUrl(
                                      media,
                                    );

                                  if (
                                    !url
                                  ) {
                                    return (
                                      <div
                                        key={`${post.id}-media-${index}`}
                                        className="flex min-h-[220px] items-center justify-center bg-slate-100"
                                      >
                                        <ImageIcon className="h-8 w-8 text-slate-300" />
                                      </div>
                                    );
                                  }

                                  if (
                                    isVideo(
                                      media,
                                    )
                                  ) {
                                    return (
                                      <video
                                        key={`${post.id}-media-${index}`}
                                        src={url}
                                        controls
                                        playsInline
                                        className="max-h-[520px] w-full bg-black object-contain"
                                      />
                                    );
                                  }

                                  return (
                                    <img
                                      key={`${post.id}-media-${index}`}
                                      src={url}
                                      alt={
                                        media.title ||
                                        "Post media"
                                      }
                                      className="max-h-[520px] w-full object-cover"
                                    />
                                  );
                                },
                              )}
                          </div>
                        )}

                        {/* ACTION BAR */}
                        <div className="border-t border-slate-100 px-4 py-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                toggleLike(
                                  post.id,
                                )
                              }
                              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                                likedPosts[
                                  post.id
                                ]
                                  ? "bg-red-50 text-red-600"
                                  : "text-slate-500 hover:bg-slate-50"
                              }`}
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  likedPosts[
                                    post.id
                                  ]
                                    ? "fill-current"
                                    : ""
                                }`}
                              />

                              {post.like_count >
                                0 &&
                                post.like_count}

                              <span className="hidden sm:inline">
                                Like
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleComments(
                                  post.id,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50"
                            >
                              <MessageCircle className="h-4 w-4" />

                              {post.comment_count >
                                0 &&
                                post.comment_count}

                              <span className="hidden sm:inline">
                                Comment
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void sharePost(
                                  post,
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50"
                            >
                              <Share2 className="h-4 w-4" />

                              <span className="hidden sm:inline">
                                Share
                              </span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                toggleSave(
                                  post.id,
                                )
                              }
                              className={`ml-auto rounded-xl p-2 ${
                                savedPosts[
                                  post.id
                                ]
                                  ? "bg-blue-50 text-blue-600"
                                  : "text-slate-400 hover:bg-slate-50"
                              }`}
                              aria-label="Save"
                            >
                              <Bookmark
                                className={`h-4 w-4 ${
                                  savedPosts[
                                    post.id
                                  ]
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        {/* COMMENTS */}
                        {openComments[
                          post.id
                        ] && (
                          <div className="border-t border-slate-100 bg-slate-50/70 p-4">
                            <div className="space-y-3">
                              {post.comments.map(
                                (
                                  comment,
                                ) => (
                                  <div
                                    key={
                                      comment.id
                                    }
                                    className="flex gap-2"
                                  >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-black text-blue-700">
                                      {getInitial(
                                        comment.profile,
                                      )}
                                    </div>

                                    <div className="min-w-0 rounded-2xl bg-white px-3 py-2 shadow-sm">
                                      <div className="text-xs font-black">
                                        {getProfileName(
                                          comment.profile,
                                        )}
                                      </div>

                                      <div className="mt-1 text-sm text-slate-600">
                                        {
                                          comment.content
                                        }
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}

                              {post.comments
                                .length ===
                                0 && (
                                <div className="py-3 text-center text-xs text-slate-400">
                                  No comments yet.
                                </div>
                              )}
                            </div>

                            {currentUserId && (
                              <div className="mt-4 flex items-center gap-2">
                                <input
                                  value={
                                    commentText[
                                      post.id
                                    ] ||
                                    ""
                                  }
                                  onChange={(
                                    event,
                                  ) =>
                                    setCommentText(
                                      (
                                        previous,
                                      ) => ({
                                        ...previous,
                                        [post.id]:
                                          event
                                            .target
                                            .value,
                                      }),
                                    )
                                  }
                                  onKeyDown={(
                                    event,
                                  ) => {
                                    if (
                                      event.key ===
                                      "Enter"
                                    ) {
                                      event.preventDefault();

                                      void submitComment(
                                        post.id,
                                      );
                                    }
                                  }}
                                  placeholder="Write a comment..."
                                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    void submitComment(
                                      post.id,
                                    )
                                  }
                                  disabled={
                                    sendingComment[
                                      post.id
                                    ]
                                  }
                                  className="rounded-xl bg-blue-700 p-2.5 text-white disabled:opacity-50"
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
                            )}
                          </div>
                        )}
                      </article>
                    );
                  },
                )}

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      disabled={
                        currentPage === 1
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1,
                            ),
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-black">
                      {currentPage} /{" "}
                      {totalPages}
                    </div>

                    <button
                      type="button"
                      disabled={
                        currentPage ===
                        totalPages
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1,
                            ),
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* SIDEBAR */}
          <aside className="hidden space-y-5 lg:block">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                {currentUserProfile?.avatar_url ? (
                  <img
                    src={
                      currentUserProfile.avatar_url
                    }
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-orange-500 font-black text-white">
                    {getInitial(
                      currentUserProfile,
                    )}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="truncate text-sm font-black">
                    {currentUserProfile
                      ? getProfileName(
                          currentUserProfile,
                        )
                      : "Guest User"}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    {currentUserProfile?.location ||
                      "Shromobazar Community"}
                  </div>
                </div>
              </div>

              <Link
                href="/my-account"
                className="mt-4 block rounded-xl bg-slate-100 px-4 py-2.5 text-center text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                Open My Account
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-orange-500" />

                <h3 className="text-sm font-black">
                  Explore
                </h3>
              </div>

              <div className="mt-4 space-y-1">
                <Link
                  href="/jobs"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <BriefcaseBusiness className="h-4 w-4 text-blue-600" />
                  Jobs & Work
                </Link>

                <Link
                  href="/marketplace"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Compass className="h-4 w-4 text-orange-500" />
                  Marketplace
                </Link>

                <Link
                  href="/chat"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  Chat
                </Link>

                <Link
                  href="/wallet"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Users className="h-4 w-4 text-purple-600" />
                  Wallet
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="text-sm font-black text-blue-900">
                One Account. Multiple
                Identities.
              </div>

              <p className="mt-2 text-xs leading-5 text-blue-700">
                Worker, Student, Medical, Player, Shop, Business, or Institute—create separate identities as needed.
              </p>

              <Link
                href="/my-account"
                className="mt-4 inline-flex items-center gap-1 text-xs font-black text-blue-800"
              >
                Manage identities
                <ChevronDown className="h-3 w-3 -rotate-90" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}