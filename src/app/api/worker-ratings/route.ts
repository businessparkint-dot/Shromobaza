import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseSecret =
process.env.SUPABASE_SECRET_KEY ||
process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecret) {
throw new Error("Supabase server environment variables are missing.");
}

return createClient(supabaseUrl, supabaseSecret, {
auth: {
autoRefreshToken: false,
persistSession: false,
},
});
}

type RatingBody = {
applicationId: string;
rating: number;
review?: string;
};

export async function POST(request: Request) {
try {
const supabaseAdmin = getSupabaseAdmin();


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

const body = (await request.json()) as RatingBody;

const applicationId = body.applicationId?.trim();
const rating = Number(body.rating);
const review = body.review?.trim() || null;

if (!applicationId) {
  return NextResponse.json(
    {
      success: false,
      error: "Application ID পাওয়া যায়নি।",
    },
    { status: 400 }
  );
}

if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
  return NextResponse.json(
    {
      success: false,
      error: "Rating 1 থেকে 5 এর মধ্যে হতে হবে।",
    },
    { status: 400 }
  );
}

/*
 * Application
 */
const { data: application, error: applicationError } =
  await supabaseAdmin
    .from("applications")
    .select(
      `
      id,
      worker_id,
      employer_id,
      status
    `
    )
    .eq("id", applicationId)
    .maybeSingle();

if (applicationError) {
  throw applicationError;
}

if (!application) {
  return NextResponse.json(
    {
      success: false,
      error: "Application পাওয়া যায়নি।",
    },
    { status: 404 }
  );
}

/*
 * Only COMPLETED jobs can be rated.
 */
if (application.status !== "completed") {
  return NextResponse.json(
    {
      success: false,
      error:
        "কাজ সম্পন্ন ও Employer confirmation-এর পরেই Rating দেওয়া যাবে।",
    },
    { status: 400 }
  );
}

/*
 * Employer verification
 */
const { data: employer, error: employerError } =
  await supabaseAdmin
    .from("employers")
    .select("id, profile_id")
    .eq("id", application.employer_id)
    .maybeSingle();

if (employerError) {
  throw employerError;
}

if (!employer) {
  return NextResponse.json(
    {
      success: false,
      error: "Employer record পাওয়া যায়নি।",
    },
    { status: 404 }
  );
}

if (employer.profile_id !== user.id) {
  return NextResponse.json(
    {
      success: false,
      error:
        "শুধুমাত্র এই কাজের Employer Worker-কে Rating দিতে পারবেন।",
    },
    { status: 403 }
  );
}

/*
 * Duplicate rating protection
 *
 * application_id is UNIQUE in worker_reviews.
 */
const { data: existingReview, error: existingError } =
  await supabaseAdmin
    .from("worker_reviews")
    .select("id")
    .eq("application_id", applicationId)
    .maybeSingle();

if (existingError) {
  throw existingError;
}

if (existingReview) {
  return NextResponse.json(
    {
      success: false,
      error: "এই কাজের জন্য আপনি ইতিমধ্যে Rating দিয়েছেন।",
    },
    { status: 409 }
  );
}

/*
 * Save review
 */
const { data: savedReview, error: reviewError } =
  await supabaseAdmin
    .from("worker_reviews")
    .insert({
      worker_id: application.worker_id,
      employer_id: application.employer_id,
      application_id: application.id,
      rating,
      review,
    })
    .select(
      `
      id,
      worker_id,
      employer_id,
      application_id,
      rating,
      review,
      created_at
    `
    )
    .single();

if (reviewError) {
  throw reviewError;
}

/*
 * Recalculate Worker rating
 *
 * Example:
 * 5 + 4 + 5 = 14 / 3 = 4.67
 */
const { data: reviews, error: reviewsError } =
  await supabaseAdmin
    .from("worker_reviews")
    .select("rating")
    .eq("worker_id", application.worker_id);

if (reviewsError) {
  throw reviewsError;
}

const reviewCount = reviews?.length || 0;

const totalRating =
  reviews?.reduce(
    (sum, item) => sum + Number(item.rating || 0),
    0
  ) || 0;

const averageRating =
  reviewCount > 0
    ? Number((totalRating / reviewCount).toFixed(2))
    : 0;

/*
 * Update Worker profile rating
 */
const { data: updatedWorker, error: workerUpdateError } =
  await supabaseAdmin
    .from("workers")
    .update({
      rating: averageRating,
      review_count: reviewCount,
      updated_at: new Date().toISOString(),
    })
    .eq("id", application.worker_id)
    .select("id, rating, review_count")
    .single();

if (workerUpdateError) {
  throw workerUpdateError;
}

return NextResponse.json({
  success: true,
  message: "Rating ও Review সফলভাবে সংরক্ষণ হয়েছে।",
  review: savedReview,
  worker: updatedWorker,
});


} catch (error) {
console.error("WORKER RATING API ERROR:", error);


return NextResponse.json(
  {
    success: false,
    error:
      error instanceof Error
        ? error.message
        : "Rating সংরক্ষণ করা যায়নি।",
  },
  { status: 500 }
);


}
}
