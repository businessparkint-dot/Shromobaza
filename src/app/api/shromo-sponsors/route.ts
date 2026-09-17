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
   Public Sponsor Row
   Only approved + currently active sponsors are returned.
========================================================= */

export async function GET() {
  try {
    const supabase = getClient();

    const { data, error } = await supabase
      .from("shromo_sponsor_ads")
      .select(
        "id, company_name, logo_url, offer_text, link_url, published, starts_at, expires_at, priority"
      )
      .eq("published", true)
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("SHROMO sponsor GET error:", error);

      return NextResponse.json(
        {
          sponsors: [],
          error: "Unable to load sponsor advertisements.",
        },
        { status: 500 }
      );
    }

    const now = Date.now();

    const activeSponsors = (data ?? []).filter((item) => {
      const starts =
        item.starts_at != null
          ? new Date(item.starts_at).getTime()
          : null;

      const expires =
        item.expires_at != null
          ? new Date(item.expires_at).getTime()
          : null;

      if (starts !== null && Number.isNaN(starts)) {
        return false;
      }

      if (expires !== null && Number.isNaN(expires)) {
        return false;
      }

      if (starts !== null && starts > now) {
        return false;
      }

      if (expires !== null && expires <= now) {
        return false;
      }

      return true;
    });

    return NextResponse.json({
      sponsors: activeSponsors,
    });
  } catch (error) {
    console.error("SHROMO sponsor GET exception:", error);

    return NextResponse.json(
      {
        sponsors: [],
        error: "Unable to load sponsor advertisements.",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST
   Create new sponsor request.

   IMPORTANT:
   New requests are NEVER published automatically.
========================================================= */

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const companyName =
      typeof body?.company_name === "string"
        ? body.company_name.trim()
        : "";

    const offerText =
      typeof body?.offer === "string"
        ? body.offer.trim()
        : typeof body?.offer_text === "string"
          ? body.offer_text.trim()
          : "";

    const linkUrl =
      typeof body?.website_url === "string"
        ? body.website_url.trim()
        : typeof body?.link_url === "string"
          ? body.link_url.trim()
          : "";

    const logoUrl =
      typeof body?.logo_url === "string"
        ? body.logo_url.trim()
        : "";

    if (!companyName) {
      return NextResponse.json(
        {
          error: "Business name is required.",
        },
        { status: 400 }
      );
    }

    if (!offerText) {
      return NextResponse.json(
        {
          error: "Advertisement offer is required.",
        },
        { status: 400 }
      );
    }

    const supabase = getClient();

    const insertPayload: Record<string, unknown> = {
      company_name: companyName,
      offer_text: offerText,

      // IMPORTANT:
      // Admin approval is required.
      published: false,

      priority: 0,
    };

    if (linkUrl) {
      insertPayload.link_url = linkUrl;
    }

    if (logoUrl) {
      insertPayload.logo_url = logoUrl;
    }

    const { data, error } = await supabase
      .from("shromo_sponsor_ads")
      .insert(insertPayload)
      .select(
        "id, company_name, logo_url, offer_text, link_url, published, starts_at, expires_at, priority"
      )
      .single();

    if (error) {
      console.error("SHROMO sponsor POST error:", error);

      return NextResponse.json(
        {
          error: "Unable to submit sponsor request.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        pending: true,
        message:
          "Sponsor request submitted successfully. It is waiting for admin approval.",
        sponsor: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("SHROMO sponsor POST exception:", error);

    return NextResponse.json(
      {
        error: "Unable to submit sponsor request.",
      },
      { status: 500 }
    );
  }
}