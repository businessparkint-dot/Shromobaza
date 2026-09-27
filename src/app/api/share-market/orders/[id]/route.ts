import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

async function getSupabase() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await context.params;

    const orderId = Number(id);

    if (!Number.isInteger(orderId)) {
      return NextResponse.json(
        { error: "Invalid order id." },
        { status: 400 },
      );
    }

    const supabase = await getSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Login required." },
        { status: 401 },
      );
    }

    const { data, error } = await supabase
      .from("share_orders")
      .update({
        status: "CANCELLED",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .eq("user_id", user.id)
      .in("status", ["OPEN", "PARTIAL"])
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          error:
            "Order cancel করা যায়নি। হয়তো order already executed/cancelled.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Order cancel failed.",
      },
      { status: 500 },
    );
  }
}