import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseSecret =
process.env.SUPABASE_SECRET_KEY ||
process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecret) {
throw new Error("Supabase server environment variables are missing.");
}

const supabaseAdmin = createClient(
supabaseUrl,
supabaseSecret,
{
auth: {
autoRefreshToken: false,
persistSession: false,
},
}
);

type Action =
| "start"
| "worker_complete"
| "employer_confirm";

type RequestBody = {
applicationId?: string;
action?: Action;
};

export async function PATCH(request: Request) {
try {
// --------------------------------------------------
// 1. Check Authorization
// --------------------------------------------------


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

const accessToken = authorization
  .replace("Bearer ", "")
  .trim();

if (!accessToken) {
  return NextResponse.json(
    {
      success: false,
      error: "Login session পাওয়া যায়নি।",
    },
    { status: 401 }
  );
}

// --------------------------------------------------
// 2. Get logged-in user
// --------------------------------------------------

const {
  data: { user },
  error: authError,
} = await supabaseAdmin.auth.getUser(accessToken);

if (authError) {
  console.error("AUTH ERROR:", authError);

  return NextResponse.json(
    {
      success: false,
      error: `Authentication failed: ${authError.message}`,
    },
    { status: 401 }
  );
}

if (!user) {
  return NextResponse.json(
    {
      success: false,
      error: "আপনার login session পাওয়া যায়নি।",
    },
    { status: 401 }
  );
}

// --------------------------------------------------
// 3. Read request body
// --------------------------------------------------

let body: RequestBody;

try {
  body = (await request.json()) as RequestBody;
} catch {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid request body.",
    },
    { status: 400 }
  );
}

const applicationId =
  typeof body.applicationId === "string"
    ? body.applicationId.trim()
    : "";

const action = body.action;

if (!applicationId) {
  return NextResponse.json(
    {
      success: false,
      error: "Application ID পাওয়া যায়নি।",
    },
    { status: 400 }
  );
}

if (
  action !== "start" &&
  action !== "worker_complete" &&
  action !== "employer_confirm"
) {
  return NextResponse.json(
    {
      success: false,
      error: "Invalid job action.",
    },
    { status: 400 }
  );
}

console.log("WORKER JOB STATUS REQUEST:", {
  userId: user.id,
  applicationId,
  action,
});

// --------------------------------------------------
// 4. Get application
// --------------------------------------------------

const {
  data: application,
  error: applicationError,
} = await supabaseAdmin
  .from("applications")
  .select(
    "id, worker_id, employer_id, job_id, status"
  )
  .eq("id", applicationId)
  .maybeSingle();

if (applicationError) {
  console.error(
    "APPLICATION FETCH ERROR:",
    applicationError
  );

  return NextResponse.json(
    {
      success: false,
      error: `Application fetch failed: ${applicationError.message}`,
    },
    { status: 500 }
  );
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

console.log("APPLICATION FOUND:", application);

// ==================================================
// WORKER: START JOB
// ==================================================

if (action === "start") {
  // -----------------------------------------------
  // Find worker
  // -----------------------------------------------

  const {
    data: worker,
    error: workerError,
  } = await supabaseAdmin
    .from("workers")
    .select("id, profile_id")
    .eq("id", application.worker_id)
    .maybeSingle();

  if (workerError) {
    console.error(
      "WORKER FETCH ERROR:",
      workerError
    );

    return NextResponse.json(
      {
        success: false,
        error: `Worker fetch failed: ${workerError.message}`,
      },
      { status: 500 }
    );
  }

  if (!worker) {
    return NextResponse.json(
      {
        success: false,
        error: "Worker record পাওয়া যায়নি।",
      },
      { status: 404 }
    );
  }

  console.log("WORKER FOUND:", worker);

  // -----------------------------------------------
  // Check ownership
  // -----------------------------------------------

  if (worker.profile_id !== user.id) {
    console.error("WORKER OWNERSHIP ERROR:", {
      workerProfileId: worker.profile_id,
      loggedInUserId: user.id,
    });

    return NextResponse.json(
      {
        success: false,
        error:
          "এই কাজ শুরু করার অনুমতি আপনার নেই। Worker account mismatch হয়েছে।",
      },
      { status: 403 }
    );
  }

  // -----------------------------------------------
  // Check current status
  // -----------------------------------------------

  if (application.status !== "accepted") {
    return NextResponse.json(
      {
        success: false,
        error: `এই কাজটি এখন "${application.status}" অবস্থায় আছে। শুধু Accepted কাজ শুরু করা যাবে।`,
      },
      { status: 400 }
    );
  }

  // -----------------------------------------------
  // Update accepted -> in_progress
  // -----------------------------------------------

  const now = new Date().toISOString();

  const {
    data: updatedApplication,
    error: updateError,
  } = await supabaseAdmin
    .from("applications")
    .update({
      status: "in_progress",
      updated_at: now,
    })
    .eq("id", application.id)
    .eq("worker_id", worker.id)
    .eq("status", "accepted")
    .select(
      "id, worker_id, employer_id, job_id, status, updated_at"
    )
    .maybeSingle();

  if (updateError) {
    console.error(
      "START JOB UPDATE ERROR:",
      updateError
    );

    return NextResponse.json(
      {
        success: false,
        error:
          `Job start update failed: ${updateError.message}`,
        details: updateError,
      },
      { status: 500 }
    );
  }

  if (!updatedApplication) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Job status update হয়নি। Application হয়তো ইতোমধ্যে অন্য status-এ চলে গেছে।",
      },
      { status: 409 }
    );
  }

  console.log(
    "JOB STARTED SUCCESSFULLY:",
    updatedApplication
  );

  return NextResponse.json({
    success: true,
    message: "কাজ শুরু হয়েছে।",
    application: updatedApplication,
  });
}

// ==================================================
// WORKER: COMPLETE JOB
// ==================================================

if (action === "worker_complete") {
  // -----------------------------------------------
  // Find worker
  // -----------------------------------------------

  const {
    data: worker,
    error: workerError,
  } = await supabaseAdmin
    .from("workers")
    .select("id, profile_id")
    .eq("id", application.worker_id)
    .maybeSingle();

  if (workerError) {
    console.error(
      "WORKER FETCH ERROR:",
      workerError
    );

    return NextResponse.json(
      {
        success: false,
        error: `Worker fetch failed: ${workerError.message}`,
      },
      { status: 500 }
    );
  }

  if (!worker) {
    return NextResponse.json(
      {
        success: false,
        error: "Worker record পাওয়া যায়নি।",
      },
      { status: 404 }
    );
  }

  // -----------------------------------------------
  // Check ownership
  // -----------------------------------------------

  if (worker.profile_id !== user.id) {
    return NextResponse.json(
      {
        success: false,
        error:
          "এই কাজ সম্পন্ন করার অনুমতি আপনার নেই।",
      },
      { status: 403 }
    );
  }

  // -----------------------------------------------
  // Check status
  // -----------------------------------------------

  if (application.status !== "in_progress") {
    return NextResponse.json(
      {
        success: false,
        error:
          `কাজটি এখন "${application.status}" অবস্থায় আছে। আগে কাজ শুরু করতে হবে।`,
      },
      { status: 400 }
    );
  }

  // -----------------------------------------------
  // Update in_progress -> worker_completed
  // -----------------------------------------------

  const {
    data: updatedApplication,
    error: updateError,
  } = await supabaseAdmin
    .from("applications")
    .update({
      status: "worker_completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", application.id)
    .eq("worker_id", worker.id)
    .eq("status", "in_progress")
    .select(
      "id, worker_id, employer_id, job_id, status, updated_at"
    )
    .maybeSingle();

  if (updateError) {
    console.error(
      "WORKER COMPLETE UPDATE ERROR:",
      updateError
    );

    return NextResponse.json(
      {
        success: false,
        error:
          `Job completion update failed: ${updateError.message}`,
        details: updateError,
      },
      { status: 500 }
    );
  }

  if (!updatedApplication) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Job completion update হয়নি।",
      },
      { status: 409 }
    );
  }

  return NextResponse.json({
    success: true,
    message:
      "কাজ সম্পন্ন হিসেবে পাঠানো হয়েছে। Employer confirmation-এর অপেক্ষায় আছে।",
    application: updatedApplication,
  });
}

// ==================================================
// EMPLOYER: CONFIRM JOB
// ==================================================

if (action === "employer_confirm") {
  // -----------------------------------------------
  // Find employer
  // -----------------------------------------------

  const {
    data: employer,
    error: employerError,
  } = await supabaseAdmin
    .from("employers")
    .select("id, profile_id")
    .eq("id", application.employer_id)
    .maybeSingle();

  if (employerError) {
    console.error(
      "EMPLOYER FETCH ERROR:",
      employerError
    );

    return NextResponse.json(
      {
        success: false,
        error:
          `Employer fetch failed: ${employerError.message}`,
      },
      { status: 500 }
    );
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

  // -----------------------------------------------
  // Check ownership
  // -----------------------------------------------

  if (employer.profile_id !== user.id) {
    return NextResponse.json(
      {
        success: false,
        error:
          "এই কাজ confirm করার অনুমতি আপনার নেই।",
      },
      { status: 403 }
    );
  }

  // -----------------------------------------------
  // Check status
  // -----------------------------------------------

  if (application.status !== "worker_completed") {
    return NextResponse.json(
      {
        success: false,
        error:
          "Worker এখনো কাজ সম্পন্ন হিসেবে জমা দেয়নি।",
      },
      { status: 400 }
    );
  }

  // -----------------------------------------------
  // Update worker_completed -> completed
  // -----------------------------------------------

  const {
    data: updatedApplication,
    error: updateError,
  } = await supabaseAdmin
    .from("applications")
    .update({
      status: "completed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", application.id)
    .eq("employer_id", employer.id)
    .eq("status", "worker_completed")
    .select(
      "id, worker_id, employer_id, job_id, status, updated_at"
    )
    .maybeSingle();

  if (updateError) {
    console.error(
      "EMPLOYER CONFIRM UPDATE ERROR:",
      updateError
    );

    return NextResponse.json(
      {
        success: false,
        error:
          `Job confirmation failed: ${updateError.message}`,
        details: updateError,
      },
      { status: 500 }
    );
  }

  if (!updatedApplication) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Job confirmation update হয়নি।",
      },
      { status: 409 }
    );
  }

  // -----------------------------------------------
  // Update related job
  // -----------------------------------------------

  if (application.job_id) {
    const { error: jobUpdateError } =
      await supabaseAdmin
        .from("jobs")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.job_id);

    if (jobUpdateError) {
      console.error(
        "JOB TABLE UPDATE ERROR:",
        jobUpdateError
      );
    }
  }

  return NextResponse.json({
    success: true,
    message:
      "কাজ সম্পন্ন হিসেবে নিশ্চিত করা হয়েছে। এখন Worker-কে Rating দিতে পারবেন।",
    application: updatedApplication,
  });
}

return NextResponse.json(
  {
    success: false,
    error: "Action process করা যায়নি।",
  },
  { status: 400 }
);

} catch (error) {
console.error(
"WORKER JOB STATUS API UNEXPECTED ERROR:",
error
);


return NextResponse.json(
  {
    success: false,
    error:
      error instanceof Error
        ? error.message
        : "Job status update করা যায়নি।",
  },
  { status: 500 }
);

}
}
