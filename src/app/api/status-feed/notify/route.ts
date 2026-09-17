import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { createServerNotification } from "@/lib/server-notifications";

type NotifyEvent = "follow" | "comment";

type NotifyBody = {
  event: NotifyEvent;
  recipientId: string;
  postId?: string;
  actorName?: string;
  commentText?: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function getAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Supabase authentication environment is not configured.");
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication token is missing.",
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
          error: "Invalid or expired session.",
        },
        { status: 401 }
      );
    }

    const body = (await request.json()) as NotifyBody;

    const event = body.event;
    const recipientId = String(body.recipientId || "").trim();

    if (event !== "follow" && event !== "comment") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid notification event.",
        },
        { status: 400 }
      );
    }

    if (!isUuid(recipientId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid recipientId.",
        },
        { status: 400 }
      );
    }

    // Never notify the actor themselves.
    if (recipientId === user.id) {
      return NextResponse.json({
        success: true,
        skipped: true,
      });
    }

    const actorName =
      String(body.actorName || "").trim() || "একজন Shromobazar User";

    if (event === "follow") {
      const result = await createServerNotification({
        userId: recipientId,
        type: "social",
        title: "নতুন follower",
        message: `${actorName} আপনাকে follow করেছেন।`,
        href: "/status-feed",
        metadata: {
          event: "follow",
          actor_id: user.id,
          actor_name: actorName,
        },
      });

      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            error: result.error || "Follow notification তৈরি করা যায়নি।",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    const postId = String(body.postId || "").trim();

    if (!isUuid(postId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid postId.",
        },
        { status: 400 }
      );
    }

    const commentText =
      String(body.commentText || "").trim();

    const safeComment =
      commentText.length > 160
        ? `${commentText.slice(0, 160)}...`
        : commentText;

    const result = await createServerNotification({
      userId: recipientId,
      type: "social",
      title: "নতুন comment",
      message: safeComment
        ? `${actorName}: ${safeComment}`
        : `${actorName} আপনার post-এ comment করেছেন।`,
      href: "/status-feed",
      metadata: {
        event: "comment",
        actor_id: user.id,
        actor_name: actorName,
        post_id: postId,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Comment notification তৈরি করা যায়নি।",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Status Feed notification error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Notification service error.",
      },
      { status: 500 }
    );
  }
}