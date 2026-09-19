import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

/* =========================================================
   ADMIN SUPABASE CLIENT
========================================================= */

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase server environment is not configured."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/* =========================================================
   AUTHENTICATED USER
========================================================= */

async function getAuthenticatedUser(
  request: NextRequest
) {
  const authHeader =
    request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader
    .slice(7)
    .trim();

  if (!token) {
    return null;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase server environment is not configured."
    );
  }

  const supabaseAdmin =
    createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

  const {
    data: { user },
    error,
  } =
    await supabaseAdmin.auth.getUser(
      token
    );

  if (error || !user) {
    return null;
  }

  return user;
}

/* =========================================================
   HELPERS
========================================================= */

function cleanString(
  value: unknown,
  maxLength = 500
) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .slice(0, maxLength);
}

function nullableNumber(
  value: unknown
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function normalizeStatus(
  value: unknown
) {
  const status =
    cleanString(value, 50)
      .toLowerCase();

  const allowed = [
    "pending",
    "accepted",
    "rejected",
    "completed",
    "cancelled",
    "canceled",
  ];

  if (!allowed.includes(status)) {
    return "pending";
  }

  if (status === "canceled") {
    return "cancelled";
  }

  return status;
}

/* =========================================================
   GET
   Load Buy Requests
========================================================= */

export async function GET(
  request: NextRequest
) {
  try {
    const user =
      await getAuthenticatedUser(
        request
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const supabase =
      getAdminClient();

    /*
     * নিজের পাঠানো এবং নিজের কাছে আসা
     * দুই ধরনের request-ই load করা হচ্ছে।
     */

    const {
      data,
      error,
    } = await supabase
      .from("buy_requests")
      .select(
        `
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
        `
      )
      .or(
        `buyer_id.eq.${user.id},seller_id.eq.${user.id}`
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

    if (error) {
      console.error(
        "GET /api/buy-requests:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        requests: data ?? [],
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "GET /api/buy-requests unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load Buy Requests.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST
   Create Buy Request
========================================================= */

export async function POST(
  request: NextRequest
) {
  try {
    const user =
      await getAuthenticatedUser(
        request
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const marketplacePostId =
      cleanString(
        body.marketplace_post_id ??
          body.marketplacePostId,
        100
      );

    const title =
      cleanString(
        body.title,
        200
      );

    const description =
      cleanString(
        body.description,
        5000
      );

    const location =
      cleanString(
        body.location,
        300
      );

    const quantity =
      nullableNumber(
        body.quantity
      );

    const budget =
      nullableNumber(
        body.budget
      );

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      quantity !== null &&
      quantity < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Quantity cannot be negative.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      budget !== null &&
      budget < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Budget cannot be negative.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      getAdminClient();

    let sellerId:
      | string
      | null = null;

    /* =====================================================
       MARKETPLACE ITEM VERIFICATION
    ===================================================== */

    if (marketplacePostId) {
      const {
        data: post,
        error: postError,
      } = await supabase
        .from("marketplace_posts")
        .select(
          `
          id,
          user_id,
          title
          `
        )
        .eq(
          "id",
          marketplacePostId
        )
        .maybeSingle();

      if (postError) {
        console.error(
          "Buy Request marketplace lookup:",
          postError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              postError.message,
          },
          {
            status: 500,
          }
        );
      }

      if (!post) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Marketplace item not found.",
          },
          {
            status: 404,
          }
        );
      }

      sellerId =
        post.user_id ?? null;

      if (
        sellerId &&
        sellerId === user.id
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "You cannot send a Buy Request to your own item.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /*
     * Seller না পাওয়া গেলে request তৈরি করা যাবে,
     * কিন্তু seller_id null থাকবে।
     *
     * এটি generic Buy Request হিসেবে কাজ করবে।
     */

    const {
      data: created,
      error: insertError,
    } = await supabase
      .from("buy_requests")
      .insert({
        buyer_id:
          user.id,

        seller_id:
          sellerId,

        marketplace_post_id:
          marketplacePostId ||
          null,

        title,

        description:
          description || null,

        budget,

        location:
          location || null,

        quantity,

        status:
          "pending",
      })
      .select(
        `
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
        `
      )
      .single();

    if (insertError) {
      console.error(
        "POST /api/buy-requests insert:",
        insertError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            insertError.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        request: created,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/buy-requests unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create Buy Request.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH
   Update Buy Request Status
========================================================= */

export async function PATCH(
  request: NextRequest
) {
  try {
    const user =
      await getAuthenticatedUser(
        request
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const body =
      await request.json();

    const requestId =
      cleanString(
        body.id ??
          body.requestId,
        100
      );

    const newStatus =
      normalizeStatus(
        body.status
      );

    if (!requestId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Buy Request ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      getAdminClient();

    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from("buy_requests")
      .select(
        `
        id,
        buyer_id,
        seller_id,
        marketplace_post_id,
        title,
        status
        `
      )
      .eq(
        "id",
        requestId
      )
      .maybeSingle();

    if (existingError) {
      console.error(
        "Buy Request lookup:",
        existingError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            existingError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Buy Request not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Buyer নিজের request cancel করতে পারবে।
     *
     * Seller request গ্রহণ/প্রত্যাখ্যান/
     * completed করতে পারবে।
     */

    const isBuyer =
      existing.buyer_id ===
      user.id;

    const isSeller =
      existing.seller_id ===
      user.id;

    if (!isBuyer && !isSeller) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You are not allowed to update this Buy Request.",
        },
        {
          status: 403,
        }
      );
    }

    if (
      isBuyer &&
      !isSeller &&
      newStatus !==
        "cancelled"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Buyer can only cancel their own request.",
        },
        {
          status: 403,
        }
      );
    }

    const {
      data: updated,
      error: updateError,
    } = await supabase
      .from("buy_requests")
      .update({
        status:
          newStatus,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        requestId
      )
      .select(
        `
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
        `
      )
      .single();

    if (updateError) {
      console.error(
        "Buy Request update:",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            updateError.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        request: updated,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "PATCH /api/buy-requests unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update Buy Request.",
      },
      {
        status: 500,
      }
    );
  }
}