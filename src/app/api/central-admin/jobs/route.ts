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
        employers:employer_id (
          id,
          profile_id,
          employer_type,
          company_name,
          description
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "CENTRAL ADMIN JOBS API ERROR:",
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

    const jobs = (data ?? []).map((job: any) => {
      const employer = Array.isArray(job.employers)
        ? job.employers[0] || null
        : job.employers;

      return {
        id: job.id,
        employerId: job.employer_id,
        title: job.title || "",
        location: job.location || "",
        salary: job.salary || "",
        workersNeeded:
          job.workers_needed ?? 0,
        description: job.description || "",
        status: job.status || "",
        employerType:
          employer?.employer_type || "",
        companyName:
          employer?.company_name || "",
        employerProfileId:
          employer?.profile_id || "",
        employerDescription:
          employer?.description || "",
        createdAt:
          job.created_at || null,
        updatedAt:
          job.updated_at || null,
      };
    });

    return NextResponse.json({
      success: true,
      jobs,
      total: jobs.length,
    });
  } catch (error) {
    console.error(
      "CENTRAL ADMIN JOBS UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Jobs load করা যায়নি।",
      },
      { status: 500 }
    );
  }
}