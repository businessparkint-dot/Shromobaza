import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecretKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const [
      workersResult,
      employersResult,
      jobsResult,
      applicationsResult,
    ] = await Promise.all([
      supabase
        .from("workers")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("employers")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("jobs")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("applications")
        .select("*", { count: "exact", head: true }),
    ]);

    const errors = [
      workersResult.error,
      employersResult.error,
      jobsResult.error,
      applicationsResult.error,
    ].filter(Boolean);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Central Admin database query failed.",
          errors: errors.map((error) => error?.message),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Shromobazar Central Admin API is working.",

      database: {
        connected: true,
        provider: "Supabase",
      },

      statistics: {
        workers: workersResult.count ?? 0,
        employers: employersResult.count ?? 0,
        jobs: jobsResult.count ?? 0,
        applications: applicationsResult.count ?? 0,
      },

      modules: {
        workers: true,
        employers: true,
        jobs: true,
        applications: true,
        marketplace: true,
        buyRequests: true,
        statusFeed: true,
        helpAdvice: true,
        chat: true,
        complaints: true,
        subscriptions: true,
      },

      futureFeatures: {
        joinAndEarn: {
          enabled: false,
          planned: true,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unexpected server error.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}