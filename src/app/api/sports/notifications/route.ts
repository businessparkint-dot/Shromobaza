import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type EventType =
  | "hire_created"
  | "hire_status"
  | "verification_submitted";

const HIRE_STATUSES = [
  "accepted",
  "rejected",
  "cancelled",
  "completed",
] as const;

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase server environment is not configured.");
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
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase auth environment is not configured.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

function getStatusTitle(status: string) {
  switch (status) {
    case "accepted":
      return "Sports Hire Request Accepted";
    case "rejected":
      return "Sports Hire Request Rejected";
    case "cancelled":
      return "Sports Hire Request Cancelled";
    case "completed":
      return "Sports Hire Request Completed";
    default:
      return "Sports Hire Request Updated";
  }
}

function getStatusMessage(status: string) {
  switch (status) {
    case "accepted":
      return "আপনার Sports Hire Request গ্রহণ করা হয়েছে।";
    case "rejected":
      return "আপনার Sports Hire Request প্রত্যাখ্যান করা হয়েছে।";
    case "cancelled":
      return "Sports Hire Request বাতিল করা হয়েছে।";
    case "completed":
      return "Sports Hire কাজটি completed হিসেবে চিহ্নিত হয়েছে।";
    default:
      return "আপনার Sports Hire Request-এর status পরিবর্তন হয়েছে।";
  }
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
        { status: 401 },
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
          error: "Invalid authentication.",
        },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const event = body.event as EventType | undefined;

    if (
      event !== "hire_created" &&
      event !== "hire_status" &&
      event !== "verification_submitted"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid sports notification event.",
        },
        { status: 400 },
      );
    }

    const supabase = getAdminClient();

    /* =======================================================
       HIRE CREATED
    ======================================================= */

    if (event === "hire_created") {
      const requestId =
        typeof body.requestId === "string"
          ? body.requestId
          : "";

      if (!requestId) {
        return NextResponse.json(
          {
            success: false,
            error: "requestId is required.",
          },
          { status: 400 },
        );
      }

      const { data: hireRequest, error: requestError } =
        await supabase
          .from("sports_hire_requests")
          .select(
            "id, requester_id, target_profile_id, role, sport, position, status",
          )
          .eq("id", requestId)
          .single();

      if (requestError || !hireRequest) {
        return NextResponse.json(
          {
            success: false,
            error: "Sports hire request not found.",
          },
          { status: 404 },
        );
      }

      if (hireRequest.requester_id !== user.id) {
        return NextResponse.json(
          {
            success: false,
            error: "Not authorized for this request.",
          },
          { status: 403 },
        );
      }

      const { data: targetProfile, error: profileError } =
        await supabase
          .from("sports_profiles")
          .select("id, user_id, name, role, sport")
          .eq("id", hireRequest.target_profile_id)
          .single();

      if (profileError || !targetProfile) {
        return NextResponse.json(
          {
            success: false,
            error: "Target Sports Profile not found.",
          },
          { status: 404 },
        );
      }

      if (targetProfile.user_id === user.id) {
        return NextResponse.json(
          {
            success: false,
            error: "Self notification is not allowed.",
          },
          { status: 400 },
        );
      }

      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: targetProfile.user_id,
          type: "sports",
          title: "নতুন Sports Hire Request এসেছে",
          message: `${
            targetProfile.name || "একজন Sports Member"
          }-এর Sports Profile-এর জন্য নতুন Hire / Connect Request এসেছে।`,
          href: "/sports",
          metadata: {
            event: "hire_created",
            request_id: hireRequest.id,
            requester_id: hireRequest.requester_id,
            target_profile_id: hireRequest.target_profile_id,
            role: hireRequest.role,
            sport: hireRequest.sport,
            position: hireRequest.position,
          },
          read: false,
        });

      if (notificationError) {
        console.error(
          "Sports hire-created notification:",
          notificationError,
        );

        return NextResponse.json(
          {
            success: false,
            error: notificationError.message,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    /* =======================================================
       HIRE STATUS
    ======================================================= */

    if (event === "hire_status") {
      const requestId =
        typeof body.requestId === "string"
          ? body.requestId
          : "";

      const status =
        typeof body.status === "string"
          ? body.status
          : "";

      if (!requestId || !HIRE_STATUSES.includes(status as never)) {
        return NextResponse.json(
          {
            success: false,
            error: "requestId and valid status are required.",
          },
          { status: 400 },
        );
      }

      const { data: hireRequest, error: requestError } =
        await supabase
          .from("sports_hire_requests")
          .select(
            "id, requester_id, target_profile_id, role, sport, position, status",
          )
          .eq("id", requestId)
          .single();

      if (requestError || !hireRequest) {
        return NextResponse.json(
          {
            success: false,
            error: "Sports hire request not found.",
          },
          { status: 404 },
        );
      }

      const { data: targetProfile, error: profileError } =
        await supabase
          .from("sports_profiles")
          .select("id, user_id, name, role, sport")
          .eq("id", hireRequest.target_profile_id)
          .single();

      if (profileError || !targetProfile) {
        return NextResponse.json(
          {
            success: false,
            error: "Target Sports Profile not found.",
          },
          { status: 404 },
        );
      }

      const isRequester =
        hireRequest.requester_id === user.id;

      const isTargetOwner =
        targetProfile.user_id === user.id;

      if (!isRequester && !isTargetOwner) {
        return NextResponse.json(
          {
            success: false,
            error: "Not authorized for this request.",
          },
          { status: 403 },
        );
      }

      const receiverId = isRequester
        ? targetProfile.user_id
        : hireRequest.requester_id;

      if (!receiverId || receiverId === user.id) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid notification receiver.",
          },
          { status: 400 },
        );
      }

      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: receiverId,
          type: "sports",
          title: getStatusTitle(status),
          message: getStatusMessage(status),
          href: "/sports",
          metadata: {
            event: "hire_status",
            request_id: hireRequest.id,
            status,
            requester_id: hireRequest.requester_id,
            target_profile_id: hireRequest.target_profile_id,
            role: hireRequest.role,
            sport: hireRequest.sport,
          },
          read: false,
        });

      if (notificationError) {
        console.error(
          "Sports hire-status notification:",
          notificationError,
        );

        return NextResponse.json(
          {
            success: false,
            error: notificationError.message,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    /* =======================================================
       VERIFICATION SUBMITTED
    ======================================================= */

    if (event === "verification_submitted") {
      const profileId =
        typeof body.profileId === "string"
          ? body.profileId
          : "";

      if (!profileId) {
        return NextResponse.json(
          {
            success: false,
            error: "profileId is required.",
          },
          { status: 400 },
        );
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("sports_profiles")
          .select("id, user_id, name, role, sport, level")
          .eq("id", profileId)
          .single();

      if (profileError || !profile) {
        return NextResponse.json(
          {
            success: false,
            error: "Sports Profile not found.",
          },
          { status: 404 },
        );
      }

      if (profile.user_id !== user.id) {
        return NextResponse.json(
          {
            success: false,
            error: "Not authorized for this profile.",
          },
          { status: 403 },
        );
      }

      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          type: "sports",
          title: "Sports Verification জমা হয়েছে",
          message:
            "আপনার Sports Verification document সফলভাবে জমা হয়েছে। Admin review pending.",
          href: "/sports",
          metadata: {
            event: "verification_submitted",
            profile_id: profile.id,
            role: profile.role,
            sport: profile.sport,
            level: profile.level,
          },
          read: false,
        });

      if (notificationError) {
        console.error(
          "Sports verification notification:",
          notificationError,
        );

        return NextResponse.json(
          {
            success: false,
            error: notificationError.message,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unsupported event.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Sports notifications API:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Sports notification failed.",
      },
      { status: 500 },
    );
  }
}