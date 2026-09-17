import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient(token: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization) return null;

  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return errorResponse("Authentication required.", 401);
    }

    const supabase = getSupabaseClient(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse("Authenticated user not found.", 401);
    }

    const body = await request.json();

    const recordId =
      typeof body.recordId === "string" ? body.recordId.trim() : "";

    const sharedWithUserId =
      typeof body.sharedWithUserId === "string"
        ? body.sharedWithUserId.trim()
        : null;

    const sharedWithName =
      typeof body.sharedWithName === "string"
        ? body.sharedWithName.trim()
        : null;

    const sharedWithEmail =
      typeof body.sharedWithEmail === "string"
        ? body.sharedWithEmail.trim()
        : null;

    const sharedWithPhone =
      typeof body.sharedWithPhone === "string"
        ? body.sharedWithPhone.trim()
        : null;

    const permissionType =
      body.permissionType === "download" ? "download" : "view";

    const expiresAt =
      typeof body.expiresAt === "string" && body.expiresAt.trim()
        ? body.expiresAt.trim()
        : null;

    const note =
      typeof body.note === "string" && body.note.trim()
        ? body.note.trim()
        : null;

    if (!recordId) {
      return errorResponse("Medical record is required.");
    }

    if (
      !sharedWithUserId &&
      !sharedWithName &&
      !sharedWithEmail &&
      !sharedWithPhone
    ) {
      return errorResponse(
        "Please provide the person or healthcare provider to share with."
      );
    }

    const { data: record, error: recordError } = await supabase
      .from("medical_records")
      .select("id, user_id")
      .eq("id", recordId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (recordError) {
      console.error("Medical record verification error:", recordError);
      return errorResponse(
        recordError.message || "Could not verify medical record.",
        500
      );
    }

    if (!record) {
      return errorResponse(
        "Medical record not found or you do not have permission to share it.",
        403
      );
    }

    if (sharedWithUserId) {
      const { data: existingShare, error: existingError } = await supabase
        .from("medical_record_shares")
        .select("id, status")
        .eq("record_id", recordId)
        .eq("owner_id", user.id)
        .eq("shared_with_user_id", sharedWithUserId)
        .in("status", ["pending", "active"])
        .maybeSingle();

      if (existingError) {
        console.error("Existing share check error:", existingError);
        return errorResponse(
          existingError.message || "Could not check existing permission.",
          500
        );
      }

      if (existingShare) {
        return errorResponse(
          "This medical record is already shared with this user."
        );
      }
    }

    const { data: share, error: insertError } = await supabase
      .from("medical_record_shares")
      .insert({
        record_id: recordId,
        owner_id: user.id,
        shared_with_user_id: sharedWithUserId,
        shared_with_name: sharedWithName,
        shared_with_email: sharedWithEmail,
        shared_with_phone: sharedWithPhone,
        permission_type: permissionType,
        status: sharedWithUserId ? "active" : "pending",
        expires_at: expiresAt,
        note,
      })
      .select(
        `
        id,
        record_id,
        owner_id,
        shared_with_user_id,
        shared_with_name,
        shared_with_email,
        shared_with_phone,
        permission_type,
        status,
        expires_at,
        note,
        created_at,
        updated_at
        `
      )
      .single();

    if (insertError) {
      console.error("Medical sharing insert error:", insertError);
      return errorResponse(
        insertError.message || "Could not create sharing permission.",
        500
      );
    }

    return NextResponse.json({
      success: true,
      message: "Medical record sharing permission created successfully.",
      share,
    });
  } catch (error) {
    console.error("Medical sharing POST error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected server error.",
      500
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return errorResponse("Authentication required.", 401);
    }

    const supabase = getSupabaseClient(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse("Authenticated user not found.", 401);
    }

    const { data, error } = await supabase
      .from("medical_record_shares")
      .select(
        `
        id,
        record_id,
        owner_id,
        shared_with_user_id,
        shared_with_name,
        shared_with_email,
        shared_with_phone,
        permission_type,
        status,
        expires_at,
        note,
        created_at,
        updated_at
        `
      )
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Medical sharing GET error:", error);
      return errorResponse(
        error.message || "Could not load sharing permissions.",
        500
      );
    }

    return NextResponse.json({
      success: true,
      shares: data || [],
    });
  } catch (error) {
    console.error("Medical sharing GET error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected server error.",
      500
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return errorResponse("Authentication required.", 401);
    }

    const supabase = getSupabaseClient(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse("Authenticated user not found.", 401);
    }

    const body = await request.json();

    const shareId =
      typeof body.shareId === "string" ? body.shareId.trim() : "";

    const action =
      typeof body.action === "string" ? body.action.trim() : "";

    if (!shareId) {
      return errorResponse("Share ID is required.");
    }

    if (!["revoke", "activate"].includes(action)) {
      return errorResponse("Invalid sharing action.");
    }

    const newStatus = action === "revoke" ? "revoked" : "active";

    const { data, error } = await supabase
      .from("medical_record_shares")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", shareId)
      .eq("owner_id", user.id)
      .select(
        `
        id,
        record_id,
        owner_id,
        shared_with_user_id,
        shared_with_name,
        shared_with_email,
        shared_with_phone,
        permission_type,
        status,
        expires_at,
        note,
        created_at,
        updated_at
        `
      )
      .single();

    if (error) {
      console.error("Medical sharing PATCH error:", error);
      return errorResponse(
        error.message || "Could not update sharing permission.",
        500
      );
    }

    return NextResponse.json({
      success: true,
      message:
        action === "revoke"
          ? "Medical record permission revoked."
          : "Medical record permission activated.",
      share: data,
    });
  } catch (error) {
    console.error("Medical sharing PATCH error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected server error.",
      500
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return errorResponse("Authentication required.", 401);
    }

    const supabase = getSupabaseClient(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse("Authenticated user not found.", 401);
    }

    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get("id")?.trim();

    if (!shareId) {
      return errorResponse("Share ID is required.");
    }

    const { error } = await supabase
      .from("medical_record_shares")
      .delete()
      .eq("id", shareId)
      .eq("owner_id", user.id);

    if (error) {
      console.error("Medical sharing DELETE error:", error);
      return errorResponse(
        error.message || "Could not delete sharing permission.",
        500
      );
    }

    return NextResponse.json({
      success: true,
      message: "Medical sharing permission deleted.",
    });
  } catch (error) {
    console.error("Medical sharing DELETE error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Unexpected server error.",
      500
    );
  }
}
