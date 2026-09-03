import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
throw new Error("Supabase server environment variables are missing.");
}

return createClient(
supabaseUrl,
supabaseSecretKey,
{
auth: {
autoRefreshToken: false,
persistSession: false,
},
}
);
}

function getAccessToken(request: NextRequest) {
const authorization = request.headers.get("authorization");

if (!authorization?.startsWith("Bearer ")) {
return null;
}

return authorization.slice(7).trim();
}

export async function GET(request: NextRequest) {
try {
const supabaseAdmin = getSupabaseAdmin();


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

// ---------------------------------------------------------
// Worker profile
// ---------------------------------------------------------
const { data: worker, error: workerError } =
  await supabaseAdmin
    .from("workers")
    .select(
      `
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
        user_type,
        worker_category,
        worker_sub_category,
        avatar_url
      )
    `
    )
    .eq("profile_id", user.id)
    .maybeSingle();

if (workerError) {
  console.error("Worker profile error:", workerError);

  return NextResponse.json(
    {
      error: "Worker profile লোড করা যায়নি।",
      details: workerError.message,
    },
    { status: 500 }
  );
}

if (!worker) {
  return NextResponse.json(
    {
      error: "এই account-এর Worker profile পাওয়া যায়নি।",
    },
    { status: 404 }
  );
}

const profile = Array.isArray(worker.profiles)
  ? worker.profiles[0] || null
  : worker.profiles;

// ---------------------------------------------------------
// Applications
// ---------------------------------------------------------
const {
  data: applications,
  error: applicationsError,
} = await supabaseAdmin
  .from("applications")
  .select(
    `
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
      description,
      status,
      employer_id
    ),
    employers:employer_id (
      id,
      employer_type,
      company_name,
      description,
      profile_id
    )
  `
  )
  .eq("worker_id", worker.id)
  .order("applied_at", { ascending: false });

if (applicationsError) {
  console.error(
    "Worker applications error:",
    applicationsError
  );

  return NextResponse.json(
    {
      error: "Worker applications লোড করা যায়নি।",
      details: applicationsError.message,
    },
    { status: 500 }
  );
}

const normalizedApplications = (applications || []).map(
  (application) => {
    const job = Array.isArray(application.jobs)
      ? application.jobs[0] || null
      : application.jobs;

    const employer = Array.isArray(application.employers)
      ? application.employers[0] || null
      : application.employers;

    return {
      id: application.id,
      jobId: application.job_id,
      employerId: application.employer_id,
      status: application.status,
      message: application.message,
      appliedAt: application.applied_at,
      updatedAt: application.updated_at,
      job,
      employer,
    };
  }
);

// ---------------------------------------------------------
// Statistics
// ---------------------------------------------------------
const totalApplications =
  normalizedApplications.length;

const acceptedApplications =
  normalizedApplications.filter(
    (item) => item.status === "accepted"
  ).length;

const pendingApplications =
  normalizedApplications.filter(
    (item) => item.status === "pending"
  ).length;

const rejectedApplications =
  normalizedApplications.filter(
    (item) => item.status === "rejected"
  ).length;

// ---------------------------------------------------------
// Skills
// workers.skills is text in current schema.
// We support comma/newline separated skills.
// ---------------------------------------------------------
const rawSkills = worker.skills || "";

const skills = rawSkills
  .split(/[,|\n]+/)
  .map((skill: string) => skill.trim())
  .filter(Boolean);

if (
  skills.length === 0 &&
  (
    worker.category ||
    profile?.worker_category ||
    worker.sub_category ||
    profile?.worker_sub_category
  )
) {
  const category =
    worker.sub_category ||
    profile?.worker_sub_category ||
    worker.category ||
    profile?.worker_category;

  if (category) {
    skills.push(category);
  }
}

return NextResponse.json({
  success: true,

  worker: {
    id: worker.id,
    profileId: worker.profile_id,
    name: profile?.name || "নাম দেওয়া হয়নি",
    phone: profile?.phone || "",
    location:
      worker.location ||
      worker.district ||
      profile?.location ||
      "স্থান উল্লেখ নেই",
    district: worker.district || "",
    category:
      worker.category ||
      profile?.worker_category ||
      "পেশা উল্লেখ নেই",
    subCategory:
      worker.sub_category ||
      profile?.worker_sub_category ||
      "",
    experience:
      worker.experience ||
      "অভিজ্ঞতা উল্লেখ করা হয়নি",
    skills,
    rating: Number(worker.rating || 0),
    reviewCount: Number(worker.review_count || 0),
    avatarUrl: profile?.avatar_url || null,
  },

  applications: normalizedApplications,

  stats: {
    total: totalApplications,
    accepted: acceptedApplications,
    pending: pendingApplications,
    rejected: rejectedApplications,
  },
});


} catch (error) {
console.error(
"GET /api/worker-dashboard error:",
error
);


return NextResponse.json(
  {
    error:
      error instanceof Error
        ? error.message
        : "Worker Dashboard লোড করা যায়নি।",
  },
  { status: 500 }
);


}
}
