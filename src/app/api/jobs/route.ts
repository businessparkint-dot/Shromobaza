import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !secretKey) {
  throw new Error("Supabase server environment variables are missing.");
}

const supabaseAdmin = createClient(supabaseUrl, secretKey);

async function getUserFromRequest(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.replace("Bearer ", "").trim();

  if (!token) {
    return null;
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select(`
        id,
        employer_id,
        title,
        location,
        salary,
        workers_needed,
        description,
        status,
        created_at,
        updated_at,
        employers (
          id,
          profile_id,
          employer_type,
          company_name,
          description
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/jobs error:", error);

      return NextResponse.json(
        {
          error: "Jobs load failed",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      jobs: data ?? [],
    });
  } catch (error) {
    console.error("GET /api/jobs exception:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const location = String(body.location ?? "").trim();
    const salary = String(body.salary ?? "").trim();
    const description = String(body.description ?? "").trim();

    const workersNeeded = Math.max(
      1,
      Number.parseInt(String(body.workersNeeded ?? 1), 10) || 1
    );

    if (!title) {
      return NextResponse.json(
        { error: "Job title is required." },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        { error: "Location is required." },
        { status: 400 }
      );
    }

    if (!salary) {
      return NextResponse.json(
        { error: "Salary is required." },
        { status: 400 }
      );
    }

    const { data: employer, error: employerError } =
      await supabaseAdmin
        .from("employers")
        .select("id, profile_id")
        .eq("profile_id", user.id)
        .maybeSingle();

    if (employerError) {
      return NextResponse.json(
        {
          error: "Employer lookup failed.",
          details: employerError.message,
        },
        { status: 500 }
      );
    }

    if (!employer) {
      return NextResponse.json(
        {
          error:
            "Employer profile পাওয়া যায়নি। আগে Profile থেকে Shopkeeper / Employer account type save করুন.",
        },
        { status: 403 }
      );
    }

    const { data: job, error: jobError } = await supabaseAdmin
      .from("jobs")
      .insert({
        employer_id: employer.id,
        title,
        location,
        salary,
        workers_needed: workersNeeded,
        description: description || null,
        status: "open",
      })
      .select(`
        id,
        employer_id,
        title,
        location,
        salary,
        workers_needed,
        description,
        status,
        created_at,
        updated_at
      `)
      .single();

    if (jobError) {
      console.error("POST /api/jobs error:", jobError);

      return NextResponse.json(
        {
          error: "Job create failed.",
          details: jobError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Job created successfully.",
        job,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/jobs exception:", error);

    return NextResponse.json(
      {
        error: "Invalid request.",
      },
      { status: 400 }
    );
  }
}