import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
throw new Error(
"Supabase server environment variables are missing."
);
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

async function getAuthenticatedUser(
request: NextRequest,
supabaseAdmin: ReturnType<typeof getSupabaseAdmin>
) {
const authorization =
request.headers.get("authorization");

if (!authorization?.startsWith("Bearer ")) {
return null;
}

const accessToken =
authorization.replace("Bearer ", "").trim();

if (!accessToken) {
return null;
}

const {
data: { user },
error,
} = await supabaseAdmin.auth.getUser(
accessToken
);

if (error || !user) {
return null;
}

return user;
}

export async function GET(
request: NextRequest
) {
try {
const supabaseAdmin = getSupabaseAdmin();


const user =
  await getAuthenticatedUser(
    request,
    supabaseAdmin
  );

if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    { status: 401 }
  );
}

/*
 * ----------------------------------------
 * FIND EMPLOYER PROFILE
 * ----------------------------------------
 */

const {
  data: employer,
  error: employerError,
} = await supabaseAdmin
  .from("employers")
  .select(
    `
    id,
    profile_id,
    employer_type,
    company_name,
    description,
    profiles:profile_id (
      id,
      name,
      phone,
      location,
      user_type,
      avatar_url
    )
  `
  )
  .eq("profile_id", user.id)
  .maybeSingle();

if (employerError) {
  console.error(
    "Employer lookup error:",
    employerError
  );

  return NextResponse.json(
    {
      success: false,
      message: employerError.message,
    },
    { status: 500 }
  );
}

if (!employer) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Employer profile পাওয়া যায়নি। আগে Profile থেকে Shopkeeper / Employer account save করুন।",
    },
    { status: 404 }
  );
}

/*
 * ----------------------------------------
 * LOAD JOBS
 * ----------------------------------------
 */

const {
  data: employerJobs,
  error: jobsError,
} = await supabaseAdmin
  .from("jobs")
  .select(
    `
    id,
    employer_id,
    title,
    location,
    salary,
    workers_needed,
    description,
    status,
    created_at,
    updated_at
  `
  )
  .eq("employer_id", employer.id)
  .order("created_at", {
    ascending: false,
  });

if (jobsError) {
  console.error(
    "Employer jobs error:",
    jobsError
  );

  return NextResponse.json(
    {
      success: false,
      message: jobsError.message,
    },
    { status: 500 }
  );
}

/*
 * ----------------------------------------
 * LOAD APPLICATIONS
 * ----------------------------------------
 */

const {
  data: employerApplications,
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
    updated_at
  `
  )
  .eq("employer_id", employer.id)
  .order("applied_at", {
    ascending: false,
  });

if (applicationsError) {
  console.error(
    "Applications error:",
    applicationsError
  );

  return NextResponse.json(
    {
      success: false,
      message: applicationsError.message,
    },
    { status: 500 }
  );
}

/*
 * ----------------------------------------
 * LOAD WORKERS
 * ----------------------------------------
 */

const workerIds = [
  ...new Set(
    (employerApplications ?? [])
      .map(
        (application) =>
          application.worker_id
      )
      .filter(Boolean)
  ),
];

let workerRows: any[] = [];

if (workerIds.length > 0) {
  const {
    data,
    error: workersError,
  } = await supabaseAdmin
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
        avatar_url,
        location
      )
    `
    )
    .in("id", workerIds);

  if (workersError) {
    console.error(
      "Workers error:",
      workersError
    );
  } else {
    workerRows = data ?? [];
  }
}

/*
 * ----------------------------------------
 * MAP DATA
 * ----------------------------------------
 */

const jobMap = new Map(
  (employerJobs ?? []).map(
    (job) => [job.id, job]
  )
);

const workerMap = new Map(
  workerRows.map(
    (worker) => [worker.id, worker]
  )
);

const applications =
  (employerApplications ?? []).map(
    (application) => ({
      id: application.id,
      jobId: application.job_id,
      workerId: application.worker_id,
      employerId: application.employer_id,
      status: application.status,
      message: application.message,
      appliedAt: application.applied_at,
      updatedAt: application.updated_at,
      job:
        jobMap.get(
          application.job_id
        ) ?? null,
      worker:
        workerMap.get(
          application.worker_id
        ) ?? null,
    })
  );

/*
 * ----------------------------------------
 * STATISTICS
 * ----------------------------------------
 */

const pending =
  applications.filter(
    (item) =>
      item.status === "pending"
  ).length;

const accepted =
  applications.filter(
    (item) =>
      item.status === "accepted"
  ).length;

const rejected =
  applications.filter(
    (item) =>
      item.status === "rejected"
  ).length;

return NextResponse.json({
  success: true,

  employer: {
    id: employer.id,
    profileId: employer.profile_id,
    employerType:
      employer.employer_type,
    companyName:
      employer.company_name,
    description:
      employer.description,
    profile:
      employer.profiles ?? null,
  },

  jobs: employerJobs ?? [],

  applications,

  stats: {
    jobs:
      employerJobs?.length ?? 0,
    applications:
      applications.length,
    pending,
    accepted,
    rejected,
  },
});


} catch (error) {
console.error(
"Employer dashboard API error:",
error
);


return NextResponse.json(
  {
    success: false,
    message:
      error instanceof Error
        ? error.message
        : "Internal server error",
  },
  { status: 500 }
);


}
}
