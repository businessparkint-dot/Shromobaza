import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization) return null;

  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

function getSupabaseClient(token: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status },
  );
}

export async function GET(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return errorResponse("Login required.", 401);
    }

    const supabase = getSupabaseClient(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse("Authenticated user not found.", 401);
    }

    const { searchParams } = new URL(request.url);

    const country = searchParams.get("country")?.trim() || "";
    const keyword = searchParams.get("keyword")?.trim() || "";

    let query = supabase
      .from("probashi_recruitment_posts")
      .select(
        `
        id,
        user_id,
        country,
        city,
        job_title,
        job_category,
        workers_needed,
        required_skills,
        experience_required,
        salary_text,
        accommodation_provided,
        food_provided,
        transport_provided,
        description,
        contact_method,
        status,
        verified,
        created_at,
        updated_at
        `,
      )
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(50);

    if (country) {
      query = query.ilike("country", `%${country}%`);
    }

    if (keyword) {
      query = query.or(
        `job_title.ilike.%${keyword}%,job_category.ilike.%${keyword}%,city.ilike.%${keyword}%`,
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Probashi recruitment GET error:", error);

      return errorResponse(
        error.message || "Recruitment jobs load করা যায়নি।",
        500,
      );
    }

    return NextResponse.json({
      success: true,
      jobs: data || [],
    });
  } catch (error) {
    console.error("Probashi recruitment GET error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Unexpected server error.",
      500,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return errorResponse("Login required.", 401);
    }

    const supabase = getSupabaseClient(token);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse("Authenticated user not found.", 401);
    }

    const body = await request.json();

    const country =
      typeof body.country === "string" ? body.country.trim() : "";

    const city =
      typeof body.city === "string" ? body.city.trim() : "";

    const jobTitle =
      typeof body.jobTitle === "string" ? body.jobTitle.trim() : "";

    const jobCategory =
      typeof body.jobCategory === "string"
        ? body.jobCategory.trim()
        : "";

    const workersNeeded = Number(body.workersNeeded);

    const requiredSkills = Array.isArray(body.requiredSkills)
      ? body.requiredSkills
          .filter((item: unknown) => typeof item === "string")
          .map((item: string) => item.trim())
          .filter(Boolean)
      : [];

    const experienceRequired =
      typeof body.experienceRequired === "string"
        ? body.experienceRequired.trim()
        : "";

    const salaryText =
      typeof body.salaryText === "string"
        ? body.salaryText.trim()
        : "";

    const accommodationProvided =
      body.accommodationProvided === true;

    const foodProvided = body.foodProvided === true;

    const transportProvided =
      body.transportProvided === true;

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    if (!country) {
      return errorResponse("Country is required.");
    }

    if (!jobTitle) {
      return errorResponse("Job title is required.");
    }

    if (!Number.isInteger(workersNeeded) || workersNeeded < 1) {
      return errorResponse("Workers needed must be at least 1.");
    }

    if (!description) {
      return errorResponse("Job description is required.");
    }

    const { data, error } = await supabase
      .from("probashi_recruitment_posts")
      .insert({
        user_id: user.id,
        country,
        city: city || null,
        job_title: jobTitle,
        job_category: jobCategory || null,
        workers_needed: workersNeeded,
        required_skills: requiredSkills,
        experience_required: experienceRequired || null,
        salary_text: salaryText || null,
        accommodation_provided: accommodationProvided,
        food_provided: foodProvided,
        transport_provided: transportProvided,
        description,
        contact_method: "platform",
        status: "open",
        verified: false,
      })
      .select(
        `
        id,
        user_id,
        country,
        city,
        job_title,
        job_category,
        workers_needed,
        required_skills,
        experience_required,
        salary_text,
        accommodation_provided,
        food_provided,
        transport_provided,
        description,
        contact_method,
        status,
        verified,
        created_at,
        updated_at
        `,
      )
      .single();

    if (error) {
      console.error("Probashi recruitment POST error:", error);

      return errorResponse(
        error.message || "Recruitment post তৈরি করা যায়নি।",
        500,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "বিদেশে লোক লাগবে পোস্টটি সফলভাবে প্রকাশ হয়েছে।",
        job: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Probashi recruitment POST error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Unexpected server error.",
      500,
    );
  }
}