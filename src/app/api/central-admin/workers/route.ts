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
     * IMPORTANT
     * workers table-এর নির্দিষ্ট column যেমন name ধরে
     * query করা হচ্ছে না।
     *
     * আপনার বর্তমান database schema থেকে সরাসরি data নেওয়া হচ্ছে।
     */
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Central Admin Workers API error:",
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

    /*
     * Database-এর বর্তমান column অনুযায়ী
     * frontend-এর জন্য normalized worker object তৈরি।
     *
     * বিভিন্ন পুরোনো schema থাকলেও যাতে কাজ করে,
     * সম্ভাব্য field নামগুলো fallback হিসেবে রাখা হয়েছে।
     */
    const workers = (data ?? []).map(
      (worker: Record<string, unknown>) => {
        const id =
          worker.id ??
          worker.worker_id ??
          worker.profile_id ??
          "";

        const profileId =
          worker.profile_id ??
          worker.user_id ??
          worker.id ??
          null;

        const category =
          worker.worker_category ??
          worker.category ??
          worker.profession ??
          worker.job_category ??
          null;

        const subCategory =
          worker.worker_sub_category ??
          worker.sub_category ??
          worker.specialization ??
          null;

        const experience =
          worker.experience ??
          worker.experience_years ??
          worker.work_experience ??
          null;

        const skills =
          worker.skills ??
          worker.skill ??
          worker.description ??
          null;

        const district =
          worker.location ??
          worker.district ??
          worker.address ??
          null;

        const ratingValue =
          worker.rating ??
          worker.average_rating ??
          0;

        const reviewCountValue =
          worker.review_count ??
          worker.reviews_count ??
          0;

        return {
          id: String(id),
          profile_id:
            profileId !== null
              ? String(profileId)
              : null,

          category:
            category !== null
              ? String(category)
              : null,

          sub_category:
            subCategory !== null
              ? String(subCategory)
              : null,

          experience:
            experience !== null
              ? String(experience)
              : null,

          skills:
            skills !== null
              ? String(skills)
              : null,

          district:
            district !== null
              ? String(district)
              : null,

          rating:
            Number.isFinite(Number(ratingValue))
              ? Number(ratingValue)
              : 0,

          review_count:
            Number.isFinite(Number(reviewCountValue))
              ? Number(reviewCountValue)
              : 0,

          created_at:
            worker.created_at
              ? String(worker.created_at)
              : new Date().toISOString(),

          /*
           * এগুলো frontend-এ এখন না দেখালেও
           * ভবিষ্যতের Central Admin ব্যবস্থাপনার জন্য রাখা হলো।
           */
          raw: worker,
        };
      }
    );

    return NextResponse.json(
      {
        success: true,
        count: workers.length,
        workers,
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