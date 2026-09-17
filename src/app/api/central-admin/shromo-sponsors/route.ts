import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const key =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/* =========================================================
   GET
   Admin sees all sponsor requests.
========================================================= */

export async function GET() {
  try {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("shromo_sponsor_ads")
      .select(
        "id, company_name, logo_url, offer_text, link_url, published, starts_at, expires_at, priority, created_at"
      )
      .order("published", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin sponsor GET error:", error);

      return NextResponse.json(
        {
          sponsors: [],
          error: "Unable to load sponsor requests.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sponsors: data ?? [],
    });
  } catch (error) {
    console.error("Admin sponsor GET exception:", error);

    return NextResponse.json(
      {
        success: false,
        sponsors: [],
        error: "Unable to load sponsor requests.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST
   action:
   approve
   reject

   APPROVE:
   published = true

   REJECT:
   request is removed from the sponsor table.
========================================================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const id =
      typeof body?.id === "string"
        ? body.id.trim()
        : "";

    const action =
      typeof body?.action === "string"
        ? body.action.trim().toLowerCase()
        : "";

    if (!id) {
      return NextResponse.json(
        {
          error: "Sponsor ID is required.",
        },
        { status: 400 }
      );
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        {
          error: "Invalid sponsor action.",
        },
        { status: 400 }
      );
    }

    const supabase = getClient();

    /* -----------------------------------------------
       APPROVE
    ------------------------------------------------ */

    if (action === "approve") {
      const { data, error } = await supabase
        .from("shromo_sponsor_ads")
        .update({
          published: true,
        })
        .eq("id", id)
        .select(
          "id, company_name, logo_url, offer_text, link_url, published, starts_at, expires_at, priority"
        )
        .single();

      if (error) {
        console.error("Sponsor approval error:", error);

        return NextResponse.json(
          {
            error: "Unable to approve sponsor request.",
            details: error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: "approved",
        sponsor: data,
      });
    }

    /* -----------------------------------------------
       REJECT
    ------------------------------------------------ */

    const { error } = await supabase
      .from("shromo_sponsor_ads")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Sponsor rejection error:", error);

      return NextResponse.json(
        {
          error: "Unable to reject sponsor request.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: "rejected",
      id,
    });
  } catch (error) {
    console.error("Admin sponsor action exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to process sponsor request.",
      },
      { status: 500 }
    );
  }
}