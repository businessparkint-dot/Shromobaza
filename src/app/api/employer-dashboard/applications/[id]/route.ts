import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
throw new Error(
"Supabase server environment variables are missing. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in Vercel."
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

const token =
authorization.slice(7).trim();

const {
data: { user },
error,
} = await supabaseAdmin.auth.getUser(token);

if (error || !user) {
return null;
}

return user;
}

export async function PATCH(
request: NextRequest,
context: {
params: Promise<{
id: string;
}>;
}
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

const { id } = await context.params;

if (!id) {
  return NextResponse.json(
    {
      success: false,
      message: "Application ID পাওয়া যায়নি।",
    },
    { status: 400 }
  );
}

const body = await request.json();

const status = body?.status;

if (
  status !== "accepted" &&
  status !== "rejected" &&
  status !== "pending"
) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Invalid application status.",
    },
    { status: 400 }
  );
}

// ---------------------------------------------------------
// Find employer belonging to authenticated user
// ---------------------------------------------------------
const {
  data: employer,
  error: employerError,
} = await supabaseAdmin
  .from("employers")
  .select("id, profile_id")
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
        "Employer profile পাওয়া যায়নি।",
    },
    { status: 404 }
  );
}

// ---------------------------------------------------------
// Update only an application owned by this employer
// ---------------------------------------------------------
const {
  data: application,
  error: updateError,
} = await supabaseAdmin
  .from("applications")
  .update({
    status,
    updated_at:
      new Date().toISOString(),
  })
  .eq("id", id)
  .eq("employer_id", employer.id)
  .select()
  .maybeSingle();

if (updateError) {
  console.error(
    "Application update error:",
    updateError
  );

  return NextResponse.json(
    {
      success: false,
      message: updateError.message,
    },
    { status: 500 }
  );
}

if (!application) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Application পাওয়া যায়নি অথবা এই Employer-এর অধীনে নয়।",
    },
    { status: 404 }
  );
}

return NextResponse.json({
  success: true,
  application,
});


} catch (error) {
console.error(
"Application PATCH error:",
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
