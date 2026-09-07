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
      console.error("SHROMO sponsor query error:", error);

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
        item.starts_at != null ? new Date(item.starts_at).getTime() : null;

      const expires =
        item.expires_at != null ? new Date(item.expires_at).getTime() : null;

      if (starts !== null && Number.isNaN(starts)) return false;
      if (expires !== null && Number.isNaN(expires)) return false;

      if (starts !== null && starts > now) return false;
      if (expires !== null && expires <= now) return false;

      return true;
    });

    return NextResponse.json({
      sponsors: activeSponsors,
    });
  } catch (error) {
    console.error("SHROMO sponsor API error:", error);

    return NextResponse.json(
      {
        sponsors: [],
        error: "Unable to load sponsor advertisements.",
      },
      { status: 500 }
    );
  }
}