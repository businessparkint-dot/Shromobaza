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
      .from("buy_requests")
      .select(`
        id,
        buyer_id,
        seller_id,
        marketplace_post_id,
        title,
        description,
        budget,
        location,
        quantity,
        status,
        created_at,
        updated_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "CENTRAL ADMIN BUY REQUESTS API ERROR:",
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

    const requests = (data ?? []).map(
      (request: any) => ({
        id: request.id,
        buyerId: request.buyer_id,
        sellerId: request.seller_id,
        marketplacePostId:
          request.marketplace_post_id,
        title: request.title || "",
        description:
          request.description || "",
        budget: request.budget ?? "",
        location: request.location || "",
        quantity: request.quantity ?? "",
        status: request.status || "",
        createdAt:
          request.created_at || null,
        updatedAt:
          request.updated_at || null,
      })
    );

    return NextResponse.json({
      success: true,
      requests,
      total: requests.length,
    });
  } catch (error) {
    console.error(
      "CENTRAL ADMIN BUY REQUESTS UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Buy Requests load করা যায়নি।",
      },
      { status: 500 }
    );
  }
}