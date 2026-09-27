import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

/*
  GET
  Central Admin → Global Opportunities
*/
export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("global_opportunities")
      .select(`
        id,
        owner_id,
        opportunity_type,
        title,
        description,
        sector,
        country,
        city,
        offering,
        requirement,
        funding_required,
        funding_currency,
        status,
        is_verified,
        is_public,
        website,
        contact_email,
        contact_phone,
        created_at,
        updated_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "CENTRAL ADMIN GLOBAL OPPORTUNITIES ERROR:",
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
      opportunities: data ?? [],
    });
  } catch (error) {
    console.error(
      "CENTRAL ADMIN GLOBAL OPPORTUNITIES UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Global Opportunities load করা যায়নি।",
      },
      { status: 500 }
    );
  }
}

/*
  POST
  Central Admin → Verify / Reject
*/
export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const id = Number(body?.id);
    const action = body?.action;

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Valid opportunity id is required.",
        },
        { status: 400 }
      );
    }

    if (
      action !== "verify" &&
      action !== "reject"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Action must be verify or reject.",
        },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const updateData =
      action === "verify"
        ? {
            status: "published",
            is_verified: true,
            is_public: true,
            updated_at:
              new Date().toISOString(),
          }
        : {
            status: "rejected",
            is_verified: false,
            is_public: false,
            updated_at:
              new Date().toISOString(),
          };

    const { data, error } =
      await supabaseAdmin
        .from("global_opportunities")
        .update(updateData)
        .eq("id", id)
        .select(`
          id,
          owner_id,
          opportunity_type,
          title,
          status,
          is_verified,
          is_public,
          updated_at
        `)
        .single();

    if (error) {
      console.error(
        "CENTRAL ADMIN GLOBAL OPPORTUNITY ACTION ERROR:",
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
      action,
      message:
        action === "verify"
          ? "Global Opportunity verified and published successfully."
          : "Global Opportunity rejected successfully.",
      opportunity: data,
    });
  } catch (error) {
    console.error(
      "CENTRAL ADMIN GLOBAL OPPORTUNITY POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Global Opportunity action সম্পন্ন করা যায়নি।",
      },
      { status: 500 }
    );
  }
}
