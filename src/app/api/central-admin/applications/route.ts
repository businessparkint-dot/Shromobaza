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
      .from("applications")
      .select(`
        id,
        job_id,
        worker_id,
        employer_id,
        status,
        message,
        applied_at,
        updated_at,
        jobs:job_id (
          id,
          title,
          location,
          salary,
          workers_needed,
          status,
          employer_id
        ),
        employers:employer_id (
          id,
          profile_id,
          employer_type,
          company_name,
          description
        ),
        workers:worker_id (
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
          profiles:profile_id (
            id,
            name,
            phone,
            location,
            avatar_url,
            user_type
          )
        )
      `)
      .order("applied_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "CENTRAL ADMIN APPLICATIONS API ERROR:",
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

    const applications = (data ?? []).map(
      (application: any) => {
        const job = Array.isArray(application.jobs)
          ? application.jobs[0] || null
          : application.jobs;

        const employer = Array.isArray(
          application.employers
        )
          ? application.employers[0] || null
          : application.employers;

        const worker = Array.isArray(
          application.workers
        )
          ? application.workers[0] || null
          : application.workers;

        const profile = Array.isArray(
          worker?.profiles
        )
          ? worker.profiles[0] || null
          : worker?.profiles;

        return {
          id: application.id,
          jobId: application.job_id,
          workerId: application.worker_id,
          employerId: application.employer_id,

          status:
            application.status || "",

          message:
            application.message || "",

          appliedAt:
            application.applied_at || null,

          updatedAt:
            application.updated_at || null,

          job: {
            id: job?.id || application.job_id,
            title: job?.title || "",
            location: job?.location || "",
            salary: job?.salary || "",
            workersNeeded:
              job?.workers_needed ?? 0,
            status: job?.status || "",
          },

          employer: {
            id:
              employer?.id ||
              application.employer_id,
            profileId:
              employer?.profile_id || "",
            type:
              employer?.employer_type || "",
            companyName:
              employer?.company_name || "",
            description:
              employer?.description || "",
          },

          worker: {
            id:
              worker?.id ||
              application.worker_id,
            profileId:
              worker?.profile_id || "",
            name:
              profile?.name ||
              "নাম দেওয়া হয়নি",
            phone:
              profile?.phone || "",
            location:
              profile?.location ||
              worker?.location ||
              "",
            district:
              worker?.district || "",
            category:
              worker?.category || "",
            subCategory:
              worker?.sub_category || "",
            experience:
              worker?.experience || "",
            skills:
              worker?.skills || "",
            rating:
              worker?.rating ?? 0,
            reviewCount:
              worker?.review_count ?? 0,
            avatarUrl:
              profile?.avatar_url || null,
          },
        };
      }
    );

    return NextResponse.json({
      success: true,
      applications,
      total: applications.length,
    });
  } catch (error) {
    console.error(
      "CENTRAL ADMIN APPLICATIONS UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Applications load করা যায়নি।",
      },
      { status: 500 }
    );
  }
}