import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret =
process.env.SUPABASE_SECRET_KEY ||
process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecret) {
throw new Error(
"Supabase server environment variables are missing."
);
}

return createClient(
supabaseUrl,
supabaseSecret,
{
auth: {
autoRefreshToken: false,
persistSession: false,
},
}
);
}

export async function GET() {
try {
const supabaseAdmin = getSupabaseAdmin();

const { data, error } = await supabaseAdmin
  .from("workers")
  .select(`
    id,
    profile_id,
    category,
    sub_category,
    experience,
    skills,
    district,
    rating,
    review_count,
    location,
    created_at,
    updated_at,
    profiles:profile_id (
      id,
      name,
      phone,
      location,
      avatar_url
    )
  `)
  .order("created_at", {
    ascending: false,
  });

if (error) {
  console.error(
    "WORKERS API ERROR:",
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

const workers = (data ?? []).map(
  (worker: any) => {
    const profile = Array.isArray(
      worker.profiles
    )
      ? worker.profiles[0]
      : worker.profiles;

    let skills: string[] = [];

    if (Array.isArray(worker.skills)) {
      skills = worker.skills;
    } else if (
      typeof worker.skills === "string"
    ) {
      try {
        const parsed = JSON.parse(
          worker.skills
        );

        if (Array.isArray(parsed)) {
          skills = parsed;
        } else {
          skills = worker.skills
            .split(",")
            .map((item: string) =>
              item.trim()
            )
            .filter(Boolean);
        }
      } catch {
        skills = worker.skills
          .split(",")
          .map((item: string) =>
            item.trim()
          )
          .filter(Boolean);
      }
    }

    return {
      id: worker.id,

      profileId:
        worker.profile_id,

      name:
        profile?.name ??
        "নাম পাওয়া যায়নি",

      phone:
        profile?.phone ?? "",

      avatarUrl:
        profile?.avatar_url ?? "",

      category:
        worker.category ?? "",

      subCategory:
        worker.sub_category ?? "",

      experience:
        worker.experience ?? "",

      skills,

      district:
        worker.district ?? "",

      location:
        worker.location ??
        profile?.location ??
        "",

      rating:
        Number(worker.rating ?? 0),

      reviewCount:
        Number(
          worker.review_count ?? 0
        ),

      verified: false,

      available: true,

      availability:
        "এখনই পাওয়া যাবে",

      role:
        worker.sub_category ||
        worker.category ||
        "দক্ষ কর্মী",

      currentWork: "",

      about: "",

      rate: "",

      completedJobs: 0,
    };
  }
);

return NextResponse.json({
  success: true,
  workers,
});

} catch (error) {
console.error(
"WORKERS API UNEXPECTED ERROR:",
error
);

return NextResponse.json(
  {
    success: false,
    error:
      error instanceof Error
        ? error.message
        : "Workers load করা যায়নি।",
  },
  { status: 500 }
);

}
}