import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const NOTIFICATION_TYPES = [
  "job",
  "marketplace",
  "business",
  "social",
  "chat",
  "wallet",
  "review",
  "system",
  "promotion",
  "support",
  "education",
  "health",
  "sports",
  "entertainment",
  "event",
] as const;

type NotificationType = (typeof NOTIFICATION_TYPES)[number];

type NotificationPayload = {
  userId: string;
  type?: NotificationType;
  title: string;
  message?: string | null;
  href?: string | null;
  metadata?: Record<string, unknown>;
};

function isValidNotificationType(
  value: unknown
): value is NotificationType {
  return (
    typeof value === "string" &&
    NOTIFICATION_TYPES.includes(
      value as NotificationType
    )
  );
}

function isValidUuid(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(request: Request) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        "Notification API: Supabase server configuration is missing."
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Server notification configuration is missing.",
        },
        { status: 500 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 1. Create a Supabase client using the user's access token
     * ---------------------------------------------------------
     *
     * This client is used ONLY for authentication.
     * The service-role client below is used only after the
     * authenticated user's identity has been verified.
     */

    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      !authorization.toLowerCase().startsWith("bearer ")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication is required.",
        },
        { status: 401 }
      );
    }

    const accessToken = authorization
      .slice(7)
      .trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication token is missing.",
        },
        { status: 401 }
      );
    }

    const userSupabase = createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await userSupabase.auth.getUser();

    if (authError || !user) {
      console.error(
        "Notification authentication error:",
        authError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired authentication.",
        },
        { status: 401 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 2. Read and validate request body
     * ---------------------------------------------------------
     */

    let body: NotificationPayload;

    try {
      body =
        (await request.json()) as NotificationPayload;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON request body.",
        },
        { status: 400 }
      );
    }

    if (!body.userId) {
      return NextResponse.json(
        {
          success: false,
          error: "userId is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidUuid(body.userId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid userId.",
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

    /*
     * ---------------------------------------------------------
     * 3. Security check
     * ---------------------------------------------------------
     *
     * A normal client request may create a notification ONLY
     * for the currently authenticated user.
     *
     * This prevents:
     *
     *   User A -> API -> Notification for User B
     *
     * even though the database service-role client bypasses RLS.
     */

    if (body.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You are not allowed to create a notification for another user.",
        },
        { status: 403 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 4. Validate notification type
     * ---------------------------------------------------------
     */

    const notificationType =
      body.type || "system";

    if (
      !isValidNotificationType(
        notificationType
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid notification type.",
        },
        { status: 400 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 5. Sanitize optional values
     * ---------------------------------------------------------
     */

    const title = body.title.trim();

    const message =
      typeof body.message === "string"
        ? body.message.trim() || null
        : null;

    const href =
      typeof body.href === "string"
        ? body.href.trim() || null
        : null;

    const metadata =
      body.metadata &&
      typeof body.metadata === "object" &&
      !Array.isArray(body.metadata)
        ? body.metadata
        : {};

    /*
     * ---------------------------------------------------------
     * 6. Create server-side Supabase admin client
     * ---------------------------------------------------------
     *
     * IMPORTANT:
     * SUPABASE_SERVICE_ROLE_KEY is used ONLY on the server.
     * It must never be placed in client-side code.
     */

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

    /*
     * ---------------------------------------------------------
     * 7. Insert notification
     * ---------------------------------------------------------
     */

    const { data, error } = await adminSupabase
      .from("notifications")
      .insert({
        user_id: user.id,
        type: notificationType,
        title,
        message,
        href,
        metadata,
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
          error:
            "Notification could not be created.",
        },
        { status: 500 }
      );
    }

    /*
     * ---------------------------------------------------------
     * 8. Success
     * ---------------------------------------------------------
     */

    return NextResponse.json(
      {
        success: true,
        notification: data,
      },
      { status: 201 }
    );
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
