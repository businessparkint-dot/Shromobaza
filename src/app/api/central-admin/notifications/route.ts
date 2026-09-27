import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const secretKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "Supabase server environment variables are missing."
    );
  }

  return createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select(`
        id,
        user_id,
        type,
        title,
        message,
        href,
        metadata,
        read,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "CENTRAL ADMIN NOTIFICATIONS API ERROR:",
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

    const notifications = (data ?? []).map(
      (notification: any) => ({
        id: notification.id,
        userId: notification.user_id,
        type: notification.type || "",
        title: notification.title || "",
        message: notification.message || "",
        href: notification.href || "",
        metadata:
          notification.metadata || null,
        read: Boolean(notification.read),
        createdAt:
          notification.created_at || null,
      })
    );

    return NextResponse.json({
      success: true,
      notifications,
      total: notifications.length,
    });
  } catch (error) {
    console.error(
      "CENTRAL ADMIN NOTIFICATIONS UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Notifications load করা যায়নি।",
      },
      { status: 500 }
    );
  }
}