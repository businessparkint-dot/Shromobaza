import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type NotificationType =
  | "job"
  | "marketplace"
  | "business"
  | "social"
  | "chat"
  | "wallet"
  | "review"
  | "system"
  | "promotion"
  | "support"
  | "education"
  | "health"
  | "sports"
  | "entertainment"
  | "event";

type NotificationPayload = {
  userId: string;
  type: NotificationType;
  title: string;
  message?: string | null;
  href?: string | null;
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Server notification configuration is missing.",
        },
        { status: 500 }
      );
    }

    const body =
      (await request.json()) as NotificationPayload;

    if (!body.userId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId is required.",
        },
        { status: 400 }
      );
    }

    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "title is required.",
        },
        { status: 400 }
      );
    }

    const adminSupabase = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await adminSupabase
      .from("notifications")
      .insert({
        user_id: body.userId,
        type: body.type || "system",
        title: body.title.trim(),
        message: body.message?.trim() || null,
        href: body.href || null,
        metadata: body.metadata || {},
        read: false,
      })
      .select(
        "id, user_id, type, title, message, href, read, metadata, created_at"
      )
      .single();

    if (error) {
      console.error(
        "NOTIFICATION CREATE ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      notification: data,
    });
  } catch (error) {
    console.error(
      "NOTIFICATION API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      { status: 500 }
    );
  }
}