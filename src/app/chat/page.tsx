"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Search,
  Plus,
  Users,
  Send,
  Loader2,
  AlertCircle,
  RefreshCw,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/client";

type UserProfile = {
  id: string;
  name: string | null;
  phone: string | null;
  location: string | null;
  user_type: string | null;
  avatar_url: string | null;
};

type Conversation = {
  id: string;
  updated_at: string;
  otherUser: UserProfile | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
};

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function ChatPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [searchResult, setSearchResult] = useState<UserProfile | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  /* =========================
     CURRENT USER
  ========================= */

  const loadCurrentUser = useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!user) {
      setCurrentUserId(null);
      return null;
    }

    setCurrentUserId(user.id);
    return user.id;
  }, []);

  /* =========================
     LOAD CONVERSATIONS
  ========================= */

  const loadConversations = useCallback(async (userId: string) => {
    const { data: participantRows, error: participantError } =
      await supabase
        .from("chat_participants")
        .select("conversation_id")
        .eq("user_id", userId);

    if (participantError) {
      throw new Error(participantError.message);
    }

    if (!participantRows || participantRows.length === 0) {
      setConversations([]);
      return [];
    }

    const conversationIds = participantRows.map(
      (item) => item.conversation_id
    );

    const { data: allParticipants, error: participantsError } =
      await supabase
        .from("chat_participants")
        .select("conversation_id, user_id")
        .in("conversation_id", conversationIds);

    if (participantsError) {
      throw new Error(participantsError.message);
    }

    const otherUserIds = Array.from(
      new Set(
        (allParticipants ?? [])
          .filter((item) => item.user_id !== userId)
          .map((item) => item.user_id)
      )
    );

    let profileMap = new Map<string, UserProfile>();

    if (otherUserIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select(
          "id, name, phone, location, user_type, avatar_url"
        )
        .in("id", otherUserIds);

      if (!profileError && profiles) {
        profileMap = new Map(
          profiles.map((profile) => [
            profile.id,
            {
              id: profile.id,
              name: profile.name ?? null,
              phone: profile.phone ?? null,
              location: profile.location ?? null,
              user_type: profile.user_type ?? null,
              avatar_url: profile.avatar_url ?? null,
            },
          ])
        );
      }
    }

    const { data: conversationRows, error: conversationError } =
      await supabase
        .from("chat_conversations")
        .select("id, updated_at")
        .in("id", conversationIds)
        .order("updated_at", {
          ascending: false,
        });

    if (conversationError) {
      throw new Error(conversationError.message);
    }

    const result: Conversation[] = [];

    for (const conversation of conversationRows ?? []) {
      const participants = (allParticipants ?? []).filter(
        (item) => item.conversation_id === conversation.id
      );

      const otherParticipant = participants.find(
        (item) => item.user_id !== userId
      );

      let lastMessage: string | null = null;
      let lastMessageTime: string | null = null;

      const { data: messageRows } = await supabase
        .from("chat_messages")
        .select("content, created_at")
        .eq("conversation_id", conversation.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(1);

      if (messageRows?.[0]) {
        lastMessage = messageRows[0].content;
        lastMessageTime = messageRows[0].created_at;
      }

      result.push({
        id: conversation.id,
        updated_at: conversation.updated_at,
        otherUser: otherParticipant
          ? profileMap.get(otherParticipant.user_id) ?? {
              id: otherParticipant.user_id,
              name: "শ্রমবাজার সদস্য",
              phone: null,
              location: null,
              user_type: null,
              avatar_url: null,
            }
          : null,
        lastMessage,
        lastMessageTime,
      });
    }

    setConversations(result);

    return result;
  }, []);

  /* =========================
     LOAD MESSAGES
  ========================= */

  const loadMessages = useCallback(
    async (conversationId: string) => {
      setLoadingMessages(true);

      try {
        const { data, error: messageError } = await supabase
          .from("chat_messages")
          .select(
            "id, conversation_id, sender_id, content, created_at"
          )
          .eq("conversation_id", conversationId)
          .order("created_at", {
            ascending: true,
          });

        if (messageError) {
          throw new Error(messageError.message);
        }

        setMessages(data ?? []);
      } catch (err) {
        console.error("Messages load error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Messages load করা যায়নি।"
        );
      } finally {
        setLoadingMessages(false);
      }
    },
    []
  );

  /* =========================
     LOAD PAGE
  ========================= */

  const loadPage = useCallback(async () => {
    try {
      setError("");

      const userId = await loadCurrentUser();

      if (!userId) {
        setLoading(false);
        return;
      }

      const result = await loadConversations(userId);

      if (
        selectedConversationId &&
        result.some(
          (item) => item.id === selectedConversationId
        )
      ) {
        await loadMessages(selectedConversationId);
      }
    } catch (err) {
      console.error("Chat dashboard error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Chat load করা যায়নি।"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [
    loadCurrentUser,
    loadConversations,
    loadMessages,
    selectedConversationId,
  ]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  /* =========================
     SELECT CONVERSATION
  ========================= */

  const selectConversation = async (id: string) => {
    setSelectedConversationId(id);
    setError("");
    await loadMessages(id);
  };

  /* =========================
     PHONE SEARCH
  ========================= */

  const searchMember = async () => {
    const value = phone.trim();

    setError("");
    setSearchResult(null);

    if (!value) {
      setError("মোবাইল নম্বর লিখুন।");
      return;
    }

    if (!currentUserId) {
      setError("Chat করতে আগে Login করুন।");
      return;
    }

    setSearching(true);

    try {
      const { data, error: searchError } = await supabase
        .from("profiles")
        .select(
          "id, name, phone, location, user_type, avatar_url"
        )
        .eq("phone", value)
        .neq("id", currentUserId)
        .maybeSingle();

      if (searchError) {
        throw new Error(searchError.message);
      }

      if (!data) {
        setError("এই মোবাইল নম্বরে কোনো সদস্য পাওয়া যায়নি।");
        return;
      }

      setSearchResult({
        id: data.id,
        name: data.name ?? null,
        phone: data.phone ?? null,
        location: data.location ?? null,
        user_type: data.user_type ?? null,
        avatar_url: data.avatar_url ?? null,
      });
    } catch (err) {
      console.error("Member search error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "সদস্য খুঁজে পাওয়া যায়নি।"
      );
    } finally {
      setSearching(false);
    }
  };

  /* =========================
     CREATE / OPEN CHAT
  ========================= */

  const openChat = async (otherUserId: string) => {
    if (!currentUserId) {
      setError("Chat করতে আগে Login করুন।");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const { data: myRows, error: myError } = await supabase
        .from("chat_participants")
        .select("conversation_id")
        .eq("user_id", currentUserId);

      if (myError) {
        throw new Error(myError.message);
      }

      const myConversationIds =
        myRows?.map((item) => item.conversation_id) ?? [];

      let conversationId: string | null = null;

      if (myConversationIds.length > 0) {
        const { data: otherRows, error: otherError } =
          await supabase
            .from("chat_participants")
            .select("conversation_id")
            .eq("user_id", otherUserId)
            .in("conversation_id", myConversationIds);

        if (otherError) {
          throw new Error(otherError.message);
        }

        if (otherRows?.[0]) {
          conversationId = otherRows[0].conversation_id;
        }
      }

      if (!conversationId) {
        const {
          data: conversation,
          error: conversationError,
        } = await supabase
          .from("chat_conversations")
          .insert({})
          .select("id")
          .single();

        if (conversationError || !conversation) {
          throw new Error(
            conversationError?.message ??
              "Conversation তৈরি করা যায়নি।"
          );
        }

        conversationId = conversation.id;

        const { error: participantError } =
          await supabase.from("chat_participants").insert([
            {
              conversation_id: conversationId,
              user_id: currentUserId,
            },
            {
              conversation_id: conversationId,
              user_id: otherUserId,
            },
          ]);

        if (participantError) {
          throw new Error(participantError.message);
        }
      }

      setSearchResult(null);
      setPhone("");

      await loadConversations(currentUserId);
      if (conversationId) {
  await selectConversation(conversationId);
}
    } catch (err) {
      console.error("Open chat error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Chat শুরু করা যায়নি।"
      );
    } finally {
      setCreating(false);
    }
  };

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessage = async () => {
    const text = messageText.trim();

    if (!text) return;

    if (!currentUserId) {
      setError("Message পাঠাতে আগে Login করুন।");
      return;
    }

    if (!selectedConversationId) {
      setError("আগে একটি conversation নির্বাচন করুন।");
      return;
    }

    setSending(true);
    setError("");

    try {
      const { data, error: sendError } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: selectedConversationId,
          sender_id: currentUserId,
          content: text,
        })
        .select(
          "id, conversation_id, sender_id, content, created_at"
        )
        .single();

      if (sendError) {
        throw new Error(sendError.message);
      }

      if (data) {
        setMessages((previous) => [...previous, data]);
      }

      setMessageText("");

      await loadConversations(currentUserId);
    } catch (err) {
      console.error("Send message error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Message পাঠানো যায়নি।"
      );
    } finally {
      setSending(false);
    }
  };

  /* =========================
     HELPERS
  ========================= */

  const formatTime = (date: string | null) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleString("bn-BD", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "";
    }
  };

  const getInitial = (user: UserProfile | null) => {
    const name = user?.name?.trim();

    if (name) {
      return name.charAt(0).toUpperCase();
    }

    return "S";
  };

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (item) => item.id === selectedConversationId
      ) ?? null,
    [conversations, selectedConversationId]
  );

  /* =========================
     PAGE
  ========================= */

  return (
    <main className="min-h-screen bg-slate-100">
      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
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
                Chat
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              setRefreshing(true);
              await loadPage();
            }}
            disabled={refreshing}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* CONTENT */}

      <section className="px-3 py-4 sm:px-5 sm:py-6">
        <div className="mx-auto max-w-6xl">
          {/* TITLE */}

          <div className="mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-orange-600">
              <MessageCircle className="h-4 w-4" />
              Messaging
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#07152d] sm:text-3xl">
              Chat
            </h1>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="flex-1">{error}</div>

              <button
                type="button"
                onClick={() => setError("")}
                className="text-xs font-black"
              >
                বন্ধ
              </button>
            </div>
          )}

          {/* CHAT APP */}

          <div className="grid h-[calc(100vh-185px)] min-h-[580px] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-xl shadow-slate-300/30 lg:grid-cols-[340px_1fr]">
            {/* LEFT SIDEBAR */}

            <aside
              className={`flex min-h-0 flex-col border-r border-slate-200 bg-white ${
                selectedConversationId
                  ? "hidden lg:flex"
                  : "flex"
              }`}
            >
              {/* SIDEBAR HEADER */}

              <div className="border-b border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-[#07152d]">
                      Messages
                    </h2>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      Recent conversations
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                </div>

                {/* SEARCH */}

                <div className="mt-4 flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setSearchResult(null);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          searchMember();
                        }
                      }}
                      placeholder="Mobile number"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-2 text-xs outline-none focus:border-orange-400 focus:bg-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={searchMember}
                    disabled={searching}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
                  >
                    {searching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* SEARCH RESULT */}

                {searchResult && (
                  <div className="mt-3 rounded-2xl border border-orange-100 bg-orange-50 p-3">
                    <div className="flex items-center gap-2">
                      {searchResult.avatar_url ? (
                        <img
                          src={searchResult.avatar_url}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#07152d] text-xs font-black text-white">
                          {getInitial(searchResult)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black text-[#07152d]">
                          {searchResult.name ||
                            "শ্রমবাজার সদস্য"}
                        </p>

                        <p className="truncate text-[10px] text-slate-500">
                          {searchResult.phone}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openChat(searchResult.id)
                        }
                        disabled={creating}
                        className="flex h-8 items-center gap-1 rounded-lg bg-[#07152d] px-3 text-[10px] font-black text-white"
                      >
                        {creating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Send className="h-3 w-3" />
                        )}
                        Chat
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CHAT LIST */}

              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Recent Chats
                  </p>
                </div>

                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-orange-500" />

                    <p className="mt-2 text-xs text-slate-400">
                      Loading...
                    </p>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <MessageCircle className="h-5 w-5" />
                    </div>

                    <p className="mt-3 text-xs font-bold text-slate-500">
                      এখনো কোনো Chat নেই
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                      Mobile number দিয়ে একজন সদস্য খুঁজুন।
                    </p>
                  </div>
                ) : (
                  conversations.map((conversation) => {
                    const active =
                      selectedConversationId ===
                      conversation.id;

                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() =>
                          selectConversation(
                            conversation.id
                          )
                        }
                        className={`flex w-full items-center gap-3 border-b border-slate-100 p-3 text-left transition ${
                          active
                            ? "bg-orange-50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        {conversation.otherUser
                          ?.avatar_url ? (
                          <img
                            src={
                              conversation.otherUser
                                .avatar_url
                            }
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#07152d] text-xs font-black text-white">
                            {getInitial(
                              conversation.otherUser
                            )}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-black text-slate-800">
                              {conversation.otherUser
                                ?.name ||
                                "শ্রমবাজার সদস্য"}
                            </p>

                            {conversation.lastMessageTime && (
                              <span className="shrink-0 text-[8px] text-slate-400">
                                {formatTime(
                                  conversation.lastMessageTime
                                )}
                              </span>
                            )}
                          </div>

                          <p className="mt-1 truncate text-[10px] text-slate-400">
                            {conversation.lastMessage ||
                              "Chat শুরু করুন..."}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </aside>

            {/* RIGHT CONVERSATION */}

            <section
              className={`min-h-0 flex-col bg-slate-50 ${
                selectedConversationId
                  ? "flex"
                  : "hidden lg:flex"
              }`}
            >
              {!selectedConversation ? (
                <div className="flex flex-1 items-center justify-center p-8">
                  <div className="max-w-sm text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-slate-300 shadow-sm">
                      <MessageCircle className="h-9 w-9" />
                    </div>

                    <h2 className="mt-5 text-xl font-black text-[#07152d]">
                      আপনার Chat
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      বাম পাশ থেকে একটি conversation নির্বাচন করুন অথবা নতুন সদস্য খুঁজে Chat শুরু করুন।
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* CONVERSATION HEADER */}

                  <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedConversationId(null)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 lg:hidden"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    {selectedConversation.otherUser
                      ?.avatar_url ? (
                      <img
                        src={
                          selectedConversation
                            .otherUser.avatar_url
                        }
                        alt=""
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#07152d] text-sm font-black text-white">
                        {getInitial(
                          selectedConversation.otherUser
                        )}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-[#07152d]">
                        {selectedConversation.otherUser
                          ?.name ||
                          "শ্রমবাজার সদস্য"}
                      </p>

                      <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
                        {selectedConversation.otherUser
                          ?.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {
                              selectedConversation
                                .otherUser.phone
                            }
                          </span>
                        )}

                        {selectedConversation.otherUser
                          ?.location && (
                          <span className="hidden items-center gap-1 sm:inline-flex">
                            <MapPin className="h-3 w-3" />
                            {
                              selectedConversation
                                .otherUser.location
                            }
                          </span>
                        )}
                      </div>
                    </div>

                    <Link
                      href={`/chat/${selectedConversation.id}`}
                      className="hidden h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-black text-slate-600 hover:bg-slate-50 sm:inline-flex"
                    >
                      Open
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* MESSAGES */}

                  <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                    {loadingMessages ? (
                      <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                            <MessageCircle className="h-6 w-6" />
                          </div>

                          <p className="mt-3 text-sm font-black text-slate-500">
                            এখনো কোনো message নেই
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            প্রথম message পাঠান।
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mx-auto max-w-3xl space-y-3">
                        {messages.map((message) => {
                          const mine =
                            message.sender_id ===
                            currentUserId;

                          return (
                            <div
                              key={message.id}
                              className={`flex ${
                                mine
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                                  mine
                                    ? "rounded-br-md bg-[#07152d] text-white"
                                    : "rounded-bl-md bg-white text-slate-700"
                                }`}
                              >
                                <p className="whitespace-pre-wrap text-xs leading-5">
                                  {message.content}
                                </p>

                                <p
                                  className={`mt-1 text-[8px] ${
                                    mine
                                      ? "text-white/50"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {formatTime(
                                    message.created_at
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* MESSAGE INPUT */}

                  <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
                    <div className="mx-auto flex max-w-3xl gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !e.shiftKey
                          ) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Message লিখুন..."
                        className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:bg-white"
                      />

                      <button
                        type="button"
                        onClick={sendMessage}
                        disabled={
                          sending ||
                          !messageText.trim()
                        }
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {sending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}