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

    const { data, error } = await supabase
      .from("probashi_job_applications")
      .select(
        `
        id,
        recruitment_post_id,
        applicant_user_id,
        cover_note,
        status,
        created_at,
        updated_at,
        probashi_recruitment_posts (
          id,
          country,
          city,
          job_title,
          job_category,
          salary_text,
          status
        )
        `,
      )
      .eq("applicant_user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Probashi applications GET error:", error);

      return errorResponse(
        error.message || "Applications load করা যায়নি।",
        500,
      );
    }

    return NextResponse.json({
      success: true,
      applications: data || [],
    });
  } catch (error) {
    console.error("Probashi applications GET error:", error);

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

    const recruitmentPostId =
      typeof body.recruitmentPostId === "string"
        ? body.recruitmentPostId.trim()
        : "";

    const coverNote =
      typeof body.coverNote === "string"
        ? body.coverNote.trim()
        : "";

    if (!recruitmentPostId) {
      return errorResponse("Job post is required.");
    }

    const { data: job, error: jobError } = await supabase
      .from("probashi_recruitment_posts")
      .select("id, status")
      .eq("id", recruitmentPostId)
      .maybeSingle();

    if (jobError) {
      console.error("Probashi job verification error:", jobError);

      return errorResponse(
        jobError.message || "Job verify করা যায়নি।",
        500,
      );
    }

    if (!job) {
      return errorResponse("Job post পাওয়া যায়নি.", 404);
    }

    if (job.status !== "open") {
      return errorResponse("এই job এখন আর open নেই.");
    }

    const { data, error } = await supabase
      .from("probashi_job_applications")
      .insert({
        recruitment_post_id: recruitmentPostId,
        applicant_user_id: user.id,
        cover_note: coverNote || null,
        status: "submitted",
      })
      .select(
        `
        id,
        recruitment_post_id,
        applicant_user_id,
        cover_note,
        status,
        created_at,
        updated_at
        `,
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        return errorResponse(
          "আপনি এই job-এ আগে থেকেই apply করেছেন।",
          409,
        );
      }

      console.error("Probashi application POST error:", error);

      return errorResponse(
        error.message || "Application submit করা যায়নি।",
        500,
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Job application সফলভাবে submit হয়েছে।",
        application: data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Probashi application POST error:", error);

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Unexpected server error.",
      500,
    );
  }
}