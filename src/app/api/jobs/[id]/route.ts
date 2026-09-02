import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

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

type RouteContext = {
params: Promise<{
id: string;
}>;
};

async function getUserFromRequest(
request: NextRequest,
supabaseAdmin: ReturnType<typeof getSupabaseAdmin>
) {
const authorization =
request.headers.get("authorization");

if (!authorization?.startsWith("Bearer ")) {
return null;
}

const token =
authorization.replace("Bearer ", "").trim();

if (!token) {
return null;
}

const {
data: { user },
error,
} = await supabaseAdmin.auth.getUser(token);

if (error || !user) {
return null;
}

return user;
}

export async function GET(
_request: NextRequest,
context: RouteContext
) {
try {
const supabaseAdmin = getSupabaseAdmin();


const { id } = await context.params;

if (!id) {
  return NextResponse.json(
    { error: "Job ID is required." },
    { status: 400 }
  );
}

const {
  data: job,
  error,
} = await supabaseAdmin
  .from("jobs")
  .select(`
    id,
    employer_id,
    title,
    location,
    salary,
    workers_needed,
    description,
    status,
    created_at,
    updated_at,
    employers (
      id,
      profile_id,
      employer_type,
      company_name,
      description
    )
  `)
  .eq("id", id)
  .maybeSingle();

if (error) {
  console.error(
    "GET /api/jobs/[id] error:",
    error
  );

  return NextResponse.json(
    {
      error: "Job load failed.",
      details: error.message,
    },
    { status: 500 }
  );
}

if (!job) {
  return NextResponse.json(
    { error: "Job not found." },
    { status: 404 }
  );
}

return NextResponse.json({ job });


} catch (error) {
console.error(
"GET /api/jobs/[id] exception:",
error
);


return NextResponse.json(
  { error: "Internal server error." },
  { status: 500 }
);


}
}

export async function PATCH(
request: NextRequest,
context: RouteContext
) {
try {
const supabaseAdmin = getSupabaseAdmin();


const user =
  await getUserFromRequest(
    request,
    supabaseAdmin
  );

if (!user) {
  return NextResponse.json(
    { error: "Authentication required." },
    { status: 401 }
  );
}

const { id } = await context.params;

if (!id) {
  return NextResponse.json(
    { error: "Job ID is required." },
    { status: 400 }
  );
}

const {
  data: employer,
  error: employerError,
} = await supabaseAdmin
  .from("employers")
  .select("id, profile_id")
  .eq("profile_id", user.id)
  .maybeSingle();

if (employerError || !employer) {
  return NextResponse.json(
    { error: "Employer profile not found." },
    { status: 403 }
  );
}

const body = await request.json();

const updates: Record<string, unknown> = {};

if (body.title !== undefined) {
  updates.title =
    String(body.title).trim();
}

if (body.location !== undefined) {
  updates.location =
    String(body.location).trim();
}

if (body.salary !== undefined) {
  updates.salary =
    String(body.salary).trim();
}

if (body.description !== undefined) {
  updates.description =
    String(body.description).trim() || null;
}

if (body.workersNeeded !== undefined) {
  updates.workers_needed =
    Math.max(
      1,
      Number.parseInt(
        String(body.workersNeeded),
        10
      ) || 1
    );
}

if (body.status !== undefined) {
  const allowedStatuses = [
    "open",
    "closed",
    "completed",
    "cancelled",
  ];

  const status =
    String(body.status);

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json(
      { error: "Invalid job status." },
      { status: 400 }
    );
  }

  updates.status = status;
}

updates.updated_at =
  new Date().toISOString();

const {
  data: job,
  error: updateError,
} = await supabaseAdmin
  .from("jobs")
  .update(updates)
  .eq("id", id)
  .eq("employer_id", employer.id)
  .select(`
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
  `)
  .maybeSingle();

if (updateError) {
  return NextResponse.json(
    {
      error: "Job update failed.",
      details: updateError.message,
    },
    { status: 500 }
  );
}

if (!job) {
  return NextResponse.json(
    {
      error:
        "Job not found or access denied.",
    },
    { status: 404 }
  );
}

return NextResponse.json({
  message:
    "Job updated successfully.",
  job,
});


} catch (error) {
console.error(
"PATCH /api/jobs/[id] exception:",
error
);


return NextResponse.json(
  { error: "Invalid request." },
  { status: 400 }
);


}
}
