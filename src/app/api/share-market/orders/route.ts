import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

type OrderBody = {
  shareId?: string;
  symbol?: string;
  companyName?: string;
  side?: "BUY" | "SELL";
  orderType?: "LIMIT" | "MARKET";
  quantity?: number;
  price?: number | null;
};

async function getSupabase() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase environment variables are missing.",
    );
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

/* =========================================================
   GET — Load current user's orders
   Optional: ?shareId=...
   ========================================================= */

export async function GET(request: Request) {
  try {
    const supabase = await getSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Login required.",
        },
        { status: 401 },
      );
    }

    const requestUrl = new URL(request.url);
    const shareId =
      requestUrl.searchParams.get("shareId");

    let query = supabase
      .from("share_orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    /*
     * If a shareId is supplied, only return
     * orders belonging to that share.
     */
    if (shareId) {
      query = query.eq("share_id", shareId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      orders: data || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Orders load করা যায়নি।",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   POST — Create PAPER BUY / SELL order
   ========================================================= */

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as OrderBody;

    const supabase = await getSupabase();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error:
            "Buy/Sell order দিতে Login করতে হবে।",
        },
        { status: 401 },
      );
    }

    const shareId = body.shareId?.trim();
    const symbol = body.symbol?.trim();
    const companyName =
      body.companyName?.trim();

    const side = body.side;

    const orderType =
      body.orderType || "LIMIT";

    const quantity =
      Number(body.quantity);

    const price =
      body.price === null ||
      body.price === undefined
        ? null
        : Number(body.price);

    /* -------------------------------------------------------
       Basic share validation
       ------------------------------------------------------- */

    if (
      !shareId ||
      !symbol ||
      !companyName
    ) {
      return NextResponse.json(
        {
          error:
            "Share information incomplete.",
        },
        { status: 400 },
      );
    }

    /* -------------------------------------------------------
       BUY / SELL validation
       ------------------------------------------------------- */

    if (
      side !== "BUY" &&
      side !== "SELL"
    ) {
      return NextResponse.json(
        {
          error: "Invalid order side.",
        },
        { status: 400 },
      );
    }

    /* -------------------------------------------------------
       LIMIT / MARKET validation
       ------------------------------------------------------- */

    if (
      orderType !== "LIMIT" &&
      orderType !== "MARKET"
    ) {
      return NextResponse.json(
        {
          error: "Invalid order type.",
        },
        { status: 400 },
      );
    }

    /* -------------------------------------------------------
       Quantity validation
       ------------------------------------------------------- */

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      return NextResponse.json(
        {
          error: "Valid quantity দিন।",
        },
        { status: 400 },
      );
    }

    /* -------------------------------------------------------
       LIMIT price validation
       ------------------------------------------------------- */

    if (
      orderType === "LIMIT" &&
      (
        !Number.isFinite(
          price as number,
        ) ||
        Number(price) <= 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Limit order-এর জন্য valid price প্রয়োজন।",
        },
        { status: 400 },
      );
    }

    /* =======================================================
       Create PAPER order
       ======================================================= */

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("share_orders")
      .insert({
        user_id: user.id,
        share_id: shareId,
        symbol,
        company_name: companyName,
        side,
        order_type: orderType,
        quantity,
        remaining_quantity: quantity,
        price:
          orderType === "LIMIT"
            ? price
            : null,
        status: "OPEN",
      })
      .select("*")
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          error:
            orderError?.message ||
            "Order create করা যায়নি।",
        },
        { status: 500 },
      );
    }

    /* =======================================================
       Immediately try matching
       ======================================================= */

    const {
      data: matchResult,
      error: matchError,
    } = await supabase.rpc(
      "match_share_order",
      {
        p_order_id: order.id,
      },
    );

    /*
     * Order successfully created even if
     * matching could not run.
     */
    if (matchError) {
      return NextResponse.json({
        success: true,
        paperTrading: true,
        matched: false,
        order,
        warning:
          "Order তৈরি হয়েছে, কিন্তু matching এখনো হয়নি।",
        matchingError:
          matchError.message,
      });
    }

    /* =======================================================
       Reload final order status
       ======================================================= */

    const {
      data: finalOrder,
    } = await supabase
      .from("share_orders")
      .select("*")
      .eq("id", order.id)
      .single();

    return NextResponse.json({
      success: true,
      paperTrading: true,
      matched: true,
      order:
        finalOrder || order,
      match: matchResult,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Order processing failed.",
      },
      { status: 500 },
    );
  }
}