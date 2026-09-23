import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Central Admin Accounts Error:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    const accounts = (data ?? []).map((profile: any) => ({
      id: profile.id ?? null,
      name: profile.name ?? "নাম দেওয়া হয়নি",
      phone: profile.phone ?? "",
      email: profile.email ?? "",
      location: profile.location ?? "",
      country: profile.country ?? "",
      region: profile.region ?? "",
      city: profile.city ?? "",
      district: profile.district ?? "",
      user_type: profile.user_type ?? "master",
      account_type: profile.account_type ?? "master",
      nid: profile.nid ?? null,
      created_at: profile.created_at ?? null,
      updated_at: profile.updated_at ?? null,
    }));

    return NextResponse.json({
      success: true,
      accounts,
      total: accounts.length,
    });
  } catch (error) {
    console.error("Central Admin Accounts API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load accounts.",
      },
      { status: 500 }
    );
  }
}