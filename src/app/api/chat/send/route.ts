import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerNotification } from "@/lib/server-notifications";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase server environment is not configured."
    );
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase auth environment is not configured."
    );
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getBearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const authClient = getAuthClient();

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired login session.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const conversationId =
      typeof body.conversationId === "string"
        ? body.conversationId.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (!conversationId) {
      return NextResponse.json(
        {
          success: false,
          error: "Conversation ID is required.",
        },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Message cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Message is too long. Maximum 5000 characters allowed.",
        },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    /* =========================
       VERIFY PARTICIPATION
    ========================= */

    const {
      data: participantRows,
      error: participantError,
    } = await supabase
      .from("chat_participants")
      .select("user_id")
      .eq("conversation_id", conversationId);

    if (participantError) {
      throw new Error(
        participantError.message
      );
    }

    const participants =
      participantRows ?? [];

    const isParticipant =
      participants.some(
        (item) => item.user_id === user.id
      );

    if (!isParticipant) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You are not a participant in this conversation.",
        },
        { status: 403 }
      );
    }

    const receiver =
      participants.find(
        (item) => item.user_id !== user.id
      );

    if (!receiver?.user_id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Chat receiver could not be found.",
        },
        { status: 400 }
      );
    }

    /* =========================
       INSERT MESSAGE
    ========================= */

    const {
      data: message,
      error: messageError,
    } = await supabase
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
      })
      .select(
        "id, conversation_id, sender_id, content, created_at"
      )
      .single();

    if (messageError) {
      throw new Error(
        messageError.message
      );
    }

    /* =========================
       UPDATE CONVERSATION TIME
    ========================= */

    const { error: updateError } =
      await supabase
        .from("chat_conversations")
        .update({
          updated_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

    if (updateError) {
      console.warn(
        "Chat conversation update warning:",
        updateError.message
      );
    }

    /* =========================
       LOAD SENDER PROFILE
    ========================= */

    const {
      data: senderProfile,
    } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .maybeSingle();

    const senderName =
      senderProfile?.name?.trim() ||
      "শ্রমবাজার সদস্য";

    /* =========================
       CREATE CHAT NOTIFICATION
    ========================= */

    const notificationResult =
      await createServerNotification({
        userId: receiver.user_id,
        type: "chat",
        title: `${senderName} আপনাকে নতুন Message পাঠিয়েছেন`,
        message:
          content.length > 120
            ? `${content.slice(0, 117)}...`
            : content,
        href: `/chat/${conversationId}`,
        metadata: {
          event: "new_chat_message",
          conversation_id: conversationId,
          message_id: message.id,
          sender_id: user.id,
          receiver_id: receiver.user_id,
        },
      });

    if (!notificationResult.success) {
      console.warn(
        "Chat notification warning:",
        notificationResult.error
      );
    }

    return NextResponse.json({
      success: true,
      message,
      notificationCreated:
        notificationResult.success,
    });
  } catch (error) {
    console.error(
      "Chat send API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Message পাঠানো যায়নি।",
      },
      { status: 500 }
    );
  }
}