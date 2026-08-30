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
          error: "Supabase environment variables are missing.",
        },
        { status: 500 }
      );
    }

    /*
     * Central Admin server-side client
     *
     * Secret key শুধুমাত্র server-side API route-এ ব্যবহার হচ্ছে।
     */
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

    /*
     * 1. Workers
     *
     * শুধু workers table-এর actual columns ব্যবহার করছি।
     */
    const { data: workerData, error: workerError } =
      await supabase
        .from("workers")
        .select(
          "id,profile_id,category,sub_category,experience,skills,district,rating,review_count,created_at,updated_at,location"
        )
        .order("created_at", {
          ascending: false,
        });

    if (workerError) {
      console.error(
        "Central Admin Workers API - workers error:",
        workerError
      );

      return NextResponse.json(
        {
          success: false,
          error: workerError.message,
        },
        { status: 500 }
      );
    }

    const workers = workerData ?? [];

    /*
     * 2. Profile IDs সংগ্রহ
     *
     * workers.profile_id → profiles.id
     */
    const profileIds = Array.from(
      new Set(
        workers
          .map((worker) => worker.profile_id)
          .filter(
            (id): id is string =>
              typeof id === "string" && id.length > 0
          )
      )
    );

    /*
     * 3. Profiles
     *
     * Worker-এর নাম, phone, location ইত্যাদি profiles
     * table থেকে নেওয়া হচ্ছে।
     */
    let profiles: Array<{
      id: string;
      name: string;
      phone: string | null;
      location: string | null;
      user_type: string;
      worker_category: string | null;
      worker_sub_category: string | null;
      employer_type: string | null;
      avatar_url: string | null;
      created_at: string;
      updated_at: string;
    }> = [];

    if (profileIds.length > 0) {
      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select(
            "id,name,phone,location,user_type,worker_category,worker_sub_category,employer_type,avatar_url,created_at,updated_at"
          )
          .in("id", profileIds);

      if (profileError) {
        console.error(
          "Central Admin Workers API - profiles error:",
          profileError
        );

        return NextResponse.json(
          {
            success: false,
            error: profileError.message,
          },
          { status: 500 }
        );
      }

      profiles = profileData ?? [];
    }

    /*
     * 4. Profile lookup map
     *
     * বড় dataset হলেও দ্রুত lookup করার জন্য Map ব্যবহার করছি।
     */
    const profileMap = new Map(
      profiles.map((profile) => [
        profile.id,
        profile,
      ])
    );

    /*
     * 5. Workers + Profiles combine
     */
    const normalizedWorkers = workers.map((worker) => {
      const profile = worker.profile_id
        ? profileMap.get(worker.profile_id)
        : undefined;

      return {
        /*
         * Worker identity
         */
        id: String(worker.id),

        profile_id: worker.profile_id
          ? String(worker.profile_id)
          : null,

        /*
         * Profile information
         */
        name: profile?.name ?? "Worker",

        phone: profile?.phone ?? null,

        email: null,

        avatar_url: profile?.avatar_url ?? null,

        user_type:
          profile?.user_type ?? "worker",

        /*
         * Location
         */
        location:
          worker.location ??
          profile?.location ??
          worker.district ??
          null,

        district:
          worker.district ??
          profile?.location ??
          worker.location ??
          null,

        /*
         * Workforce information
         */
        category:
          worker.category ??
          profile?.worker_category ??
          null,

        sub_category:
          worker.sub_category ??
          profile?.worker_sub_category ??
          null,

        experience:
          worker.experience ?? null,

        skills:
          worker.skills ?? null,

        /*
         * Rating
         */
        rating:
          Number.isFinite(Number(worker.rating))
            ? Number(worker.rating)
            : 0,

        review_count:
          Number.isFinite(
            Number(worker.review_count)
          )
            ? Number(worker.review_count)
            : 0,

        /*
         * Dates
         */
        created_at:
          worker.created_at ??
          profile?.created_at ??
          new Date().toISOString(),

        updated_at:
          worker.updated_at ??
          profile?.updated_at ??
          new Date().toISOString(),
      };
    });

    return NextResponse.json(
      {
        success: true,
        count: normalizedWorkers.length,
        workers: normalizedWorkers,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Unexpected Central Admin Workers error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}