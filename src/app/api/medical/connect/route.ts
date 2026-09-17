import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getErrorMessage(error: unknown) {
  if (!error) return "Unknown error";

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const e = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    return [
      e.message,
      e.details,
      e.hint,
      e.code ? `Code: ${e.code}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  }

  return String(error);
}

async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Read-only cookie context.
          }
        },
      },
    }
  );
}

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("medical_connect_requests")
      .select(
        "id, user_id, request_type, provider_name, service_name, preferred_date, note, status, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("MEDICAL CONNECT GET ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: getErrorMessage(error),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      requests: data || [],
    });
  } catch (error) {
    console.error("MEDICAL CONNECT GET API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const requestType =
      body?.requestType === "diagnostic"
        ? "diagnostic"
        : "hospital";

    const providerName = String(
      body?.providerName || ""
    ).trim();

    const serviceName = String(
      body?.serviceName || ""
    ).trim();

    const preferredDate = body?.preferredDate
      ? String(body.preferredDate)
      : null;

    const note = body?.note
      ? String(body.note).trim().slice(0, 300)
      : null;

    if (!providerName || !serviceName) {
      return NextResponse.json(
        {
          success: false,
          message: "Provider and service are required.",
        },
        { status: 400 }
      );
    }

    const { data, error: insertError } = await supabase
      .from("medical_connect_requests")
      .insert({
        user_id: user.id,
        request_type: requestType,
        provider_name: providerName,
        service_name: serviceName,
        preferred_date: preferredDate || null,
        note: note || null,
        status: "pending",
      })
      .select(
        "id, user_id, request_type, provider_name, service_name, preferred_date, note, status, created_at"
      )
      .single();

    if (insertError) {
      console.error(
        "MEDICAL CONNECT INSERT ERROR:",
        insertError
      );

      return NextResponse.json(
        {
          success: false,
          message: getErrorMessage(insertError),
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Medical connection request created successfully.",
        request: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "MEDICAL CONNECT POST API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}