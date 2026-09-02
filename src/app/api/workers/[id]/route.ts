import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const secretKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL"
    );
  }

  if (!secretKey) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY"
    );
  }

  return createClient(
    supabaseUrl,
    secretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

function normalizeSkills(
  value: unknown
): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const text = value.trim();

    if (!text) {
      return [];
    }

    try {
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed)) {
        return parsed
          .map((item) => String(item).trim())
          .filter(Boolean);
      }
    } catch {
      // Normal text value
    }

    return text
      .split(/[,|\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function cleanText(
  value: unknown,
  fallback = ""
): string {
  if (
    typeof value !== "string"
  ) {
    return fallback;
  }

  const text = value.trim();

  return text || fallback;
}

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const supabaseAdmin =
      getAdminClient();

    const { id } =
      await context.params;

    const workerId =
      String(id ?? "").trim();

    if (!workerId) {
      return NextResponse.json(
        {
          success: false,
          error: "Worker ID is required.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // Get Worker
    // ---------------------------------------------------------

    const {
      data: workerData,
      error: workerError,
    } = await supabaseAdmin
      .from("workers")
      .select(`
        id,
        profile_id,
        category,
        sub_category,
        experience,
        skills,
        district,
        location,
        rating,
        review_count,
        created_at,
        updated_at
      `)
      .eq("id", workerId)
      .maybeSingle();

    if (workerError) {
      console.error(
        "Worker query error:",
        workerError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Worker information could not be loaded.",
          details: workerError.message,
        },
        { status: 500 }
      );
    }

    if (!workerData) {
      return NextResponse.json(
        {
          success: false,
          error: "Worker not found.",
        },
        { status: 404 }
      );
    }

    // ---------------------------------------------------------
    // Get Profile
    // ---------------------------------------------------------

    let profileData:
      | {
          id?: string;
          name?: string | null;
          phone?: string | null;
          location?: string | null;
          worker_category?: string | null;
          worker_sub_category?: string | null;
          avatar_url?: string | null;
          user_type?: string | null;
        }
      | null = null;

    if (workerData.profile_id) {
      const {
        data,
        error: profileError,
      } = await supabaseAdmin
        .from("profiles")
        .select(`
          id,
          name,
          phone,
          location,
          worker_category,
          worker_sub_category,
          avatar_url,
          user_type
        `)
        .eq(
          "id",
          workerData.profile_id
        )
        .maybeSingle();

      if (profileError) {
        console.error(
          "Profile query error:",
          profileError
        );
      } else {
        profileData = data;
      }
    }

    // ---------------------------------------------------------
    // Category
    // ---------------------------------------------------------

    const workerCategory =
      cleanText(
        workerData.category
      );

    const profileCategory =
      cleanText(
        profileData?.worker_category
      );

    const category =
      workerCategory &&
      workerCategory.toLowerCase() !==
        "worker"
        ? workerCategory
        : profileCategory ||
          workerCategory ||
          "Worker";

    // ---------------------------------------------------------
    // Sub Category
    // ---------------------------------------------------------

    const subCategory =
      cleanText(
        workerData.sub_category
      ) ||
      cleanText(
        profileData?.worker_sub_category
      );

    // ---------------------------------------------------------
    // Name
    // ---------------------------------------------------------

    const name =
      cleanText(
        profileData?.name
      ) ||
      "নাম দেওয়া হয়নি";

    // ---------------------------------------------------------
    // Phone
    // ---------------------------------------------------------

    const phone =
      cleanText(
        profileData?.phone
      );

    // ---------------------------------------------------------
    // Location
    // ---------------------------------------------------------

    const location =
      cleanText(
        workerData.location
      ) ||
      cleanText(
        profileData?.location
      ) ||
      cleanText(
        workerData.district
      ) ||
      "লোকেশন উল্লেখ করা হয়নি";

    // ---------------------------------------------------------
    // District
    // ---------------------------------------------------------

    const district =
      cleanText(
        workerData.district
      ) ||
      cleanText(
        profileData?.location
      );

    // ---------------------------------------------------------
    // Experience
    // ---------------------------------------------------------

    const experience =
      cleanText(
        workerData.experience
      ) ||
      "অভিজ্ঞতা উল্লেখ করা হয়নি";

    // ---------------------------------------------------------
    // Skills
    // ---------------------------------------------------------

    const skills =
      normalizeSkills(
        workerData.skills
      );

    // ---------------------------------------------------------
    // Rating
    // ---------------------------------------------------------

    const rating =
      Number(
        workerData.rating ?? 0
      ) || 0;

    const reviewCount =
      Number(
        workerData.review_count ?? 0
      ) || 0;

    // ---------------------------------------------------------
    // Avatar
    // ---------------------------------------------------------

    const avatarUrl =
      cleanText(
        profileData?.avatar_url
      );

    // ---------------------------------------------------------
    // Availability
    // ---------------------------------------------------------

    const available = true;

    const availability =
      "এখনই পাওয়া যাবে";

    // ---------------------------------------------------------
    // Role
    // ---------------------------------------------------------

    const role =
      subCategory ||
      category ||
      "দক্ষ কর্মী";

    // ---------------------------------------------------------
    // Final Worker Response
    // ---------------------------------------------------------

    return NextResponse.json({
      success: true,

      worker: {
        id: workerData.id,

        profileId:
          workerData.profile_id ?? null,

        name,

        phone,

        avatarUrl,

        category,

        subCategory,

        experience,

        skills,

        district,

        location,

        rating,

        reviewCount,

        role,

        verified: false,

        available,

        availability,

        currentWork: "",

        about:
          "এই Worker শ্রমবাজারের workforce network-এর একজন নিবন্ধিত সদস্য।",

        rate: "",

        completedJobs: 0,

        createdAt:
          workerData.created_at ?? null,

        updatedAt:
          workerData.updated_at ?? null,
      },
    });
  } catch (error) {
    console.error(
      "Worker API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal server error.",
      },
      { status: 500 }
    );
  }
}