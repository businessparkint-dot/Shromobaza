import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Supabase server environment variables are missing.");
}

const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function getBearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.replace("Bearer ", "").trim();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const category =
      searchParams.get("category") || "all";

    const search =
      searchParams.get("search")?.trim() || "";

    let query = supabaseAdmin
      .from("art_of_brain_items")
      .select(`
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
      `)
      .eq("status", "published")
      .order("created_at", {
        ascending: false,
      });

    if (category !== "all") {
      query = query.eq("item_type", category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Art of Brain GET error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Art of Brain database query failed.",
          error: error.message,
          details: error.details || null,
          hint: error.hint || null,
          code: error.code || null,
        },
        {
          status: 500,
        }
      );
    }

    const creatorIds = [
      ...new Set(
        (data || [])
          .map((item) => item.creator_id)
          .filter(Boolean)
      ),
    ];

    let creators: any[] = [];

    if (creatorIds.length > 0) {
      const result = await supabaseAdmin
        .from("profiles")
        .select(`
          id,
          name,
          phone,
          location,
          avatar_url
        `)
        .in("id", creatorIds);

      if (result.error) {
        console.error(
          "Art of Brain creator lookup error:",
          result.error
        );
      } else {
        creators = result.data || [];
      }
    }

    const creatorMap = new Map(
      creators.map((creator) => [
        creator.id,
        creator,
      ])
    );

    const items = (data || []).map((item) => ({
      ...item,
      creator:
        creatorMap.get(item.creator_id) || null,
    }));

    return NextResponse.json(
      {
        success: true,
        items,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Art of Brain GET exception:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        {
          status: 401,
        }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid authentication.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const title =
      String(body.title || "").trim();

    const description =
      String(body.description || "").trim();

    const category =
      String(body.category || "").trim();

    const itemType =
      String(body.itemType || "other").trim();

    const accessType =
      String(body.accessType || "showcase").trim();

    const price =
      body.price === ""
        ? null
        : body.price == null
          ? null
          : Number(body.price);

    const licenseType =
      body.licenseType || null;

    const coverUrl =
      body.coverUrl || null;

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
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
          message: "Category is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      price !== null &&
      (!Number.isFinite(price) || price < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid price.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from("art_of_brain_items")
        .insert({
          creator_id: user.id,
          title,
          description: description || null,
          category,
          item_type: itemType,
          access_type: accessType,
          price,
          license_type: licenseType,
          cover_url: coverUrl,
          status: "published",
        })
        .select()
        .single();

    if (error) {
      console.error(
        "Art of Brain POST error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "Could not publish your work.",
          error: error.message,
          details: error.details || null,
          hint: error.hint || null,
          code: error.code || null,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        item: data,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Art of Brain POST exception:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}
