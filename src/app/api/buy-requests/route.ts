import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  createServerNotification,
} from "@/lib/server-notifications";

export const dynamic = "force-dynamic";

/* =========================================================
   ADMIN SUPABASE CLIENT
   ========================================================= */

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase server environment is not configured."
    );
  }

  return createClient(url, serviceKey, {
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

  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error(
      "Supabase authentication environment is not configured."
    );
  }

  const supabase = createClient(
    supabaseUrl,
    anonKey,
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
  } = await supabase.auth.getUser(token);

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
  maxLength = 200
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

function normalizeCategory(
  value: unknown
) {
  const category = cleanString(value, 50);

  const allowed = [
    "story",
    "poetry",
    "script",
    "lyrics",
    "content",
    "creative_idea",
    "research",
  ];

  if (!allowed.includes(category)) {
    return "";
  }

  return category;
}

function normalizeItemType(
  value: unknown
) {
  const itemType = cleanString(value, 50);

  const allowed = [
    "story",
    "poetry",
    "script",
    "lyrics",
    "content",
    "creative_idea",
    "research",
  ];

  if (!allowed.includes(itemType)) {
    return "content";
  }

  return itemType;
}

function normalizeAccessType(
  value: unknown
) {
  const accessType = cleanString(value, 50);

  const allowed = [
    "showcase",
    "free",
    "sell",
    "license",
    "custom_request",
  ];

  if (!allowed.includes(accessType)) {
    return "showcase";
  }

  return accessType;
}

function normalizeLicenseType(
  value: unknown
) {
  const licenseType = cleanString(value, 100);

  return licenseType || null;
}

/* =========================================================
   GET
   Art of Brain Marketplace items
   ========================================================= */

export async function GET(
  request: NextRequest
) {
  try {
    const supabase =
      getAdminClient();

    const { searchParams } =
      new URL(request.url);

    const category =
      searchParams.get("category")?.trim() ||
      "";

    const search =
      searchParams.get("search")?.trim() ||
      "";

    let query = supabase
      .from("art_of_brain")
      .select(
        `
        id,
        creator_id,
        title,
        description,
        category,
        item_type,
        access_type,
        price,
        license_type,
        cover_url,
        status,
        view_count,
        created_at,
        updated_at
        `
      )
      .eq("status", "published")
      .order("created_at", {
        ascending: false,
      });

    if (category && category !== "all") {
      query = query.eq(
        "category",
        category
      );
    }

    if (search) {
      const safeSearch =
        search.replace(
          /[%_,]/g,
          " "
        );

      query = query.or(
        `title.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`
      );
    }

    const {
      data,
      error,
    } = await query;

    if (error) {
      console.error(
        "GET /api/art-of-brain:",
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

    /*
     * Creator information separately load করা হচ্ছে।
     * এতে foreign-key relation-এর নামের উপর
     * dependency থাকে না।
     */

    const creatorIds = Array.from(
      new Set(
        (data ?? [])
          .map(
            (item) =>
              item.creator_id
          )
          .filter(Boolean)
      )
    );

    let creators: Record<
      string,
      {
        id: string;
        name: string;
        phone?: string | null;
        location?: string | null;
        avatar_url?: string | null;
      }
    > = {};

    if (creatorIds.length > 0) {
      const {
        data: profileRows,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          `
          id,
          name,
          phone,
          location,
          avatar_url
          `
        )
        .in(
          "id",
          creatorIds
        );

      if (profileError) {
        console.error(
          "Art of Brain creator lookup:",
          profileError
        );
      } else {
        creators = Object.fromEntries(
          (profileRows ?? []).map(
            (profile) => [
              profile.id,
              profile,
            ]
          )
        );
      }
    }

    const items = (data ?? []).map(
      (item) => ({
        ...item,
        creator:
          creators[
            item.creator_id
          ] ?? null,
      })
    );

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error(
      "GET /api/art-of-brain unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load Art of Brain items.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST
   1. Publish Art of Brain work
   2. Send marketplace notification
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

    const action =
      cleanString(
        body.action,
        50
      );

    const supabase =
      getAdminClient();

    /* =====================================================
       ACTION: NOTIFY
       ===================================================== */

    if (action === "notify") {
      const recipientId =
        cleanString(
          body.recipientId,
          100
        );

      const itemId =
        cleanString(
          body.itemId,
          100
        );

      const itemTitle =
        cleanString(
          body.itemTitle,
          200
        );

      const requestType =
        cleanString(
          body.requestType,
          50
        );

      const message =
        cleanString(
          body.message,
          500
        );

      if (!recipientId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Recipient is required.",
          },
          {
            status: 400,
          }
        );
      }

      if (!itemId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Art of Brain item is required.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        recipientId === user.id
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "You cannot send a request to yourself.",
          },
          {
            status: 400,
          }
        );
      }

      /*
       * Item verify
       */

      const {
        data: item,
        error: itemError,
      } = await supabase
        .from("art_of_brain")
        .select(
          `
          id,
          creator_id,
          title,
          access_type,
          status
          `
        )
        .eq("id", itemId)
        .maybeSingle();

      if (itemError) {
        console.error(
          "Art of Brain item lookup:",
          itemError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              itemError.message,
          },
          {
            status: 500,
          }
        );
      }

      if (!item) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Art of Brain item not found.",
          },
          {
            status: 404,
          }
        );
      }

      if (
        item.creator_id !==
        recipientId
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Recipient does not own this Art of Brain item.",
          },
          {
            status: 403,
          }
        );
      }

      /*
       * Notification wording
       */

      let notificationTitle =
        "নতুন Art of Brain Request এসেছে";

      let notificationMessage =
        message ||
        `"${(
          itemTitle ||
          item.title
        ).slice(
          0,
          120
        )}" নিয়ে একজন ব্যবহারকারী আগ্রহ দেখিয়েছেন।`;

      if (
        requestType === "purchase" ||
        requestType === "buy"
      ) {
        notificationTitle =
          "নতুন Purchase Request এসেছে";

        notificationMessage =
          message ||
          `"${item.title.slice(
            0,
            120
          )}" কাজটি কিনতে একজন ব্যবহারকারী আগ্রহী।`;
      }

      if (
        requestType === "license"
      ) {
        notificationTitle =
          "নতুন License Request এসেছে";

        notificationMessage =
          message ||
          `"${item.title.slice(
            0,
            120
          )}" কাজটির License নিতে একজন ব্যবহারকারী আগ্রহী।`;
      }

      if (
        requestType ===
        "custom_request"
      ) {
        notificationTitle =
          "নতুন Custom Request এসেছে";

        notificationMessage =
          message ||
          `"${item.title.slice(
            0,
            120
          )}" নিয়ে একজন ব্যবহারকারী Custom Request পাঠিয়েছেন।`;
      }

      const notificationResult =
        await createServerNotification(
          {
            userId:
              recipientId,

            type:
              "marketplace",

            title:
              notificationTitle,

            message:
              notificationMessage,

            href:
              "/marketplace",

            metadata: {
              source:
                "art_of_brain",

              event:
                "art_of_brain_request",

              request_type:
                requestType ||
                "interest",

              item_id:
                item.id,

              item_title:
                item.title,

              creator_id:
                item.creator_id,

              requester_id:
                user.id,
            },
          }
        );

      if (
        !notificationResult.success
      ) {
        console.error(
          "Art of Brain notification failed:",
          notificationResult.error
        );

        return NextResponse.json(
          {
            success: false,
            error:
              notificationResult.error ||
              "Notification could not be sent.",
          },
          {
            status: 500,
          }
        );
      }

      return NextResponse.json({
        success: true,
        notificationSent: true,
        message:
          "Notification sent successfully.",
      });
    }

    /* =====================================================
       DEFAULT ACTION: PUBLISH
       ===================================================== */

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

    const category =
      normalizeCategory(
        body.category
      );

    const itemType =
      normalizeItemType(
        body.itemType
      );

    const accessType =
      normalizeAccessType(
        body.accessType
      );

    const price =
      nullableNumber(
        body.price
      );

    const licenseType =
      normalizeLicenseType(
        body.licenseType
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

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Valid category is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      accessType === "sell" &&
      (price === null ||
        price < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A valid price is required for selling.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      accessType === "license" &&
      !licenseType
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "License type is required.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: created,
      error: insertError,
    } = await supabase
      .from("art_of_brain")
      .insert({
        creator_id:
          user.id,

        title:
          title.slice(
            0,
            200
          ),

        description:
          description.slice(
            0,
            5000
          ) || null,

        category,

        item_type:
          itemType,

        access_type:
          accessType,

        price,

        license_type:
          licenseType,

        cover_url:
          null,

        status:
          "published",

        view_count:
          0,
      })
      .select(
        `
        id,
        creator_id,
        title,
        description,
        category,
        item_type,
        access_type,
        price,
        license_type,
        cover_url,
        status,
        view_count,
        created_at,
        updated_at
        `
      )
      .single();

    if (insertError) {
      console.error(
        "Art of Brain insert:",
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
        item: created,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/art-of-brain unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to process Art of Brain request.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH
   Art of Brain request status notification
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

    const recipientId =
      cleanString(
        body.recipientId,
        100
      );

    const itemId =
      cleanString(
        body.itemId,
        100
      );

    const requestType =
      cleanString(
        body.requestType,
        50
      );

    const newStatus =
      cleanString(
        body.status,
        50
      );

    const itemTitle =
      cleanString(
        body.itemTitle,
        200
      );

    if (!recipientId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Recipient is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Item is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!newStatus) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Status is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      recipientId === user.id
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid notification recipient.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * FIX:
     * PATCH handler-এ supabase client define করা ছিল না।
     * GET/POST-এর মতো এখানেও admin client ব্যবহার করছি।
     */
    const supabase =
      getAdminClient();

    const {
      data: item,
      error: itemError,
    } = await supabase
      .from("art_of_brain")
      .select(
        `
        id,
        creator_id,
        title
        `
      )
      .eq("id", itemId)
      .maybeSingle();

    if (itemError) {
      console.error(
        "Art of Brain PATCH item lookup:",
        itemError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            itemError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Art of Brain item not found.",
        },
        {
          status: 404,
        }
      );
    }

    let notificationTitle =
      "Art of Brain Request Update";

    let notificationMessage =
      `"${(
        itemTitle ||
        item.title
      ).slice(
        0,
        120
      )}" request-এর status পরিবর্তন হয়েছে।`;

    if (
      newStatus ===
      "accepted"
    ) {
      notificationTitle =
        "Request Accepted";

      notificationMessage =
        `"${(
          itemTitle ||
          item.title
        ).slice(
          0,
          120
        )}" request গ্রহণ করা হয়েছে।`;
    }

    if (
      newStatus ===
      "rejected"
    ) {
      notificationTitle =
        "Request Rejected";

      notificationMessage =
        `"${(
          itemTitle ||
          item.title
        ).slice(
          0,
          120
        )}" request প্রত্যাখ্যান করা হয়েছে।`;
    }

    if (
      newStatus ===
      "completed"
    ) {
      notificationTitle =
        "Request Completed";

      notificationMessage =
        `"${(
          itemTitle ||
          item.title
        ).slice(
          0,
          120
        )}" request completed হয়েছে।`;
    }

    const notificationResult =
      await createServerNotification(
        {
          userId:
            recipientId,

          type:
            "marketplace",

          title:
            notificationTitle,

          message:
            notificationMessage,

          href:
            "/marketplace",

          metadata: {
            source:
              "art_of_brain",

            event:
              "art_of_brain_request_status_changed",

            request_type:
              requestType ||
              "interest",

            item_id:
              item.id,

            item_title:
              item.title,

            creator_id:
              item.creator_id,

            sender_id:
              user.id,

            new_status:
              newStatus,
          },
        }
      );

    if (
      !notificationResult.success
    ) {
      console.error(
        "Art of Brain status notification failed:",
        notificationResult.error
      );

      return NextResponse.json(
        {
          success: false,
          error:
            notificationResult.error ||
            "Notification could not be sent.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      notificationSent: true,
    });
  } catch (error) {
    console.error(
      "PATCH /api/art-of-brain unexpected error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to process Art of Brain status.",
      },
      {
        status: 500,
      }
    );
  }
}