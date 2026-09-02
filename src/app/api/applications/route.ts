import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Supabase server environment variables are missing.");
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function getAccessToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = getAccessToken(request);

    if (!accessToken) {
      return NextResponse.json(
        { error: "Login required." },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "আপনার Login session বৈধ নয়। আবার Login করুন।" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const jobId =
      typeof body.jobId === "string"
        ? body.jobId.trim()
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const message =
      typeof body.message === "string"
        ? body.message.trim()
        : "";

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID পাওয়া যায়নি।" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "আপনার নাম দিন।" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "মোবাইল নম্বর দিন।" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 1. Real Job খুঁজে বের করা
    // ---------------------------------------------------------
    const {
      data: job,
      error: jobError,
    } = await supabaseAdmin
      .from("jobs")
      .select(
        `
        id,
        title,
        employer_id,
        status
      `
      )
      .eq("id", jobId)
      .maybeSingle();

    if (jobError) {
      console.error("Job lookup error:", jobError);

      return NextResponse.json(
        { error: "Job তথ্য যাচাই করা যায়নি।" },
        { status: 500 }
      );
    }

    if (!job) {
      return NextResponse.json(
        { error: "এই Job আর পাওয়া যাচ্ছে না।" },
        { status: 404 }
      );
    }

    if (job.status && job.status !== "open") {
      return NextResponse.json(
        { error: "এই Job বর্তমানে আবেদন নেওয়া হচ্ছে না।" },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 2. Worker profile খুঁজে বের করা
    // ---------------------------------------------------------
    const {
      data: worker,
      error: workerError,
    } = await supabaseAdmin
      .from("workers")
      .select(
        `
        id,
        profile_id,
        category,
        sub_category
      `
      )
      .eq("profile_id", user.id)
      .maybeSingle();

    if (workerError) {
      console.error("Worker lookup error:", workerError);

      return NextResponse.json(
        { error: "Worker profile যাচাই করা যায়নি।" },
        { status: 500 }
      );
    }

    if (!worker) {
      return NextResponse.json(
        {
          error:
            "এই account-এর Worker profile পাওয়া যায়নি। আগে Worker profile সম্পূর্ণ করুন।",
        },
        { status: 403 }
      );
    }

    // ---------------------------------------------------------
    // 3. একই Worker একই Job-এ আগে Apply করেছে কি না
    // ---------------------------------------------------------
    const {
      data: existingApplication,
      error: existingError,
    } = await supabaseAdmin
      .from("applications")
      .select("id, status")
      .eq("job_id", job.id)
      .eq("worker_id", worker.id)
      .maybeSingle();

    if (existingError) {
      console.error(
        "Existing application lookup error:",
        existingError
      );

      return NextResponse.json(
        { error: "আগের আবেদন যাচাই করা যায়নি।" },
        { status: 500 }
      );
    }

    if (existingApplication) {
      return NextResponse.json(
        {
          error:
            "আপনি ইতিমধ্যে এই Job-এ আবেদন করেছেন।",
          application: existingApplication,
        },
        { status: 409 }
      );
    }

    // ---------------------------------------------------------
    // 4. Real Supabase applications table-এ Application তৈরি
    // ---------------------------------------------------------
    const {
      data: application,
      error: insertError,
    } = await supabaseAdmin
      .from("applications")
      .insert({
        job_id: job.id,
        worker_id: worker.id,
        employer_id: job.employer_id,
        status: "pending",
        message: message || null,
      })
      .select(
        `
        id,
        job_id,
        worker_id,
        employer_id,
        status,
        message,
        applied_at,
        updated_at
      `
      )
      .single();

    if (insertError) {
      console.error(
        "Application insert error:",
        insertError
      );

      return NextResponse.json(
        {
          error:
            "আবেদন সংরক্ষণ করা যায়নি।",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 5. Profile-এর নাম/ফোন থাকলে Worker profile update
    // ---------------------------------------------------------
    const { error: profileUpdateError } =
      await supabaseAdmin
        .from("profiles")
        .update({
          name,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileUpdateError) {
      // Application সফল হয়েছে, তাই profile update failure-এর
      // জন্য application rollback করছি না।
      console.warn(
        "Profile update warning:",
        profileUpdateError.message
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "আবেদন সফলভাবে জমা হয়েছে।",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/applications error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "আবেদন জমা দেওয়া যায়নি।",
      },
      { status: 500 }
    );
  }
}