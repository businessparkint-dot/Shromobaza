import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecret) {
  throw new Error("Supabase server environment variables are missing.");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseSecret, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

type HireRequestBody = {
  workerId: string;
  jobTitle: string;
  location: string;
  salary: string;
  message?: string;
};

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "Login required.",
        },
        { status: 401 }
      );
    }

    const accessToken = authorization.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "আপনার login session পাওয়া যায়নি।",
        },
        { status: 401 }
      );
    }

    const body = (await request.json()) as HireRequestBody;

    const workerId = body.workerId?.trim();
    const jobTitle = body.jobTitle?.trim();
    const location = body.location?.trim();
    const salary = body.salary?.trim();
    const message = body.message?.trim() || "";

    if (!workerId) {
      return NextResponse.json(
        {
          success: false,
          error: "Worker নির্বাচন করা হয়নি।",
        },
        { status: 400 }
      );
    }

    if (!jobTitle) {
      return NextResponse.json(
        {
          success: false,
          error: "কাজের নাম দিন।",
        },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        {
          success: false,
          error: "কাজের স্থান দিন।",
        },
        { status: 400 }
      );
    }

    if (!salary) {
      return NextResponse.json(
        {
          success: false,
          error: "পারিশ্রমিক দিন।",
        },
        { status: 400 }
      );
    }

    /*
     * Worker check
     */
    const { data: worker, error: workerError } =
      await supabaseAdmin
        .from("workers")
        .select("id")
        .eq("id", workerId)
        .maybeSingle();

    if (workerError) {
      throw workerError;
    }

    if (!worker) {
      return NextResponse.json(
        {
          success: false,
          error: "Worker পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    /*
     * Logged-in profile
     */
    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, name, user_type")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          error:
            "আপনার profile পাওয়া যায়নি। আগে profile সম্পূর্ণ করুন।",
        },
        { status: 400 }
      );
    }

    /*
     * Employer record
     */
    const { data: employer, error: employerError } =
      await supabaseAdmin
        .from("employers")
        .select("id, profile_id")
        .eq("profile_id", profile.id)
        .maybeSingle();

    if (employerError) {
      throw employerError;
    }

    if (!employer) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Hire Request পাঠাতে আপনার Employer profile প্রয়োজন।",
        },
        { status: 403 }
      );
    }

    /*
     * Direct-hire job record
     */
    const { data: job, error: jobError } =
      await supabaseAdmin
        .from("jobs")
        .insert({
          employer_id: employer.id,
          title: jobTitle,
          location,
          salary,
          workers_needed: 1,
          description: message || null,
          status: "open",
        })
        .select("id")
        .single();

    if (jobError) {
      throw jobError;
    }

    /*
     * Application / Hire Request
     */
    const { data: application, error: applicationError } =
      await supabaseAdmin
        .from("applications")
        .insert({
          job_id: job.id,
          worker_id: worker.id,
          employer_id: employer.id,
          status: "pending",
          message: message || null,
        })
        .select("id, status, applied_at")
        .single();

    if (applicationError) {
      /*
       * Job তৈরি হয়েছিল কিন্তু application failed হলে
       * orphan job না রাখার চেষ্টা।
       */
      await supabaseAdmin
        .from("jobs")
        .delete()
        .eq("id", job.id);

      throw applicationError;
    }

    return NextResponse.json({
      success: true,
      message: "Hire Request সফলভাবে পাঠানো হয়েছে।",
      application,
      jobId: job.id,
    });
  } catch (error) {
    console.error("HIRE REQUEST API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Hire Request পাঠানো যায়নি।",
      },
      { status: 500 }
    );
  }
}