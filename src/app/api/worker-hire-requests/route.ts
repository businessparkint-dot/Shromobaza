import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Supabase server environment variables are missing.");
}

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function getAccessToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice(7).trim();
}

export async function GET(request: NextRequest) {
  try {
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
        {
          error: "আপনার Login session বৈধ নয়। আবার Login করুন।",
        },
        { status: 401 }
      );
    }

    // Logged-in account থেকে Worker বের করি
    const { data: worker, error: workerError } =
      await supabaseAdmin
        .from("workers")
        .select(`
          id,
          profile_id,
          category,
          sub_category
        `)
        .eq("profile_id", user.id)
        .maybeSingle();

    if (workerError) {
      console.error("Worker lookup error:", workerError);

      return NextResponse.json(
        {
          error: "Worker profile পাওয়া যায়নি।",
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

    console.log("Logged-in user:", user.id);
    console.log("Worker ID:", worker.id);

    // প্রথমে সরাসরি applications table থেকে request নিই
    const { data: applications, error: applicationsError } =
      await supabaseAdmin
        .from("applications")
        .select(`
          id,
          job_id,
          worker_id,
          employer_id,
          status,
          message,
          applied_at,
          updated_at
        `)
        .eq("worker_id", worker.id)
        .eq("status", "pending")
        .order("applied_at", { ascending: false });

    if (applicationsError) {
      console.error(
        "Applications lookup error:",
        applicationsError
      );

      return NextResponse.json(
        {
          error: "Hire Requests লোড করা যায়নি।",
          details: applicationsError.message,
        },
        { status: 500 }
      );
    }

    console.log(
      "Pending applications:",
      applications?.length || 0
    );

    if (!applications || applications.length === 0) {
      return NextResponse.json({
        success: true,
        worker: {
          id: worker.id,
          profileId: worker.profile_id,
          category: worker.category || "",
          subCategory: worker.sub_category || "",
        },
        requests: [],
      });
    }

    // Job IDs
    const jobIds = [
      ...new Set(
        applications
          .map((item) => item.job_id)
          .filter(Boolean)
      ),
    ];

    // Employer IDs
    const employerIds = [
      ...new Set(
        applications
          .map((item) => item.employer_id)
          .filter(Boolean)
      ),
    ];

    // Jobs আলাদাভাবে
    let jobs: any[] = [];

    if (jobIds.length > 0) {
      const { data, error } = await supabaseAdmin
        .from("jobs")
        .select(`
          id,
          title,
          location,
          salary,
          workers_needed,
          description,
          status,
          employer_id
        `)
        .in("id", jobIds);

      if (error) {
        console.error("Jobs lookup error:", error);
      } else {
        jobs = data || [];
      }
    }

    // Employers আলাদাভাবে
    let employers: any[] = [];

    if (employerIds.length > 0) {
      const { data, error } = await supabaseAdmin
        .from("employers")
        .select(`
          id,
          employer_type,
          company_name,
          description,
          profile_id
        `)
        .in("id", employerIds);

      if (error) {
        console.error("Employers lookup error:", error);
      } else {
        employers = data || [];
      }
    }

    // Employer profile IDs
    const employerProfileIds = [
      ...new Set(
        employers
          .map((employer) => employer.profile_id)
          .filter(Boolean)
      ),
    ];

    // Employer profiles
    let profiles: any[] = [];

    if (employerProfileIds.length > 0) {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select(`
          id,
          name,
          phone,
          location,
          avatar_url
        `)
        .in("id", employerProfileIds);

      if (error) {
        console.error("Employer profiles lookup error:", error);
      } else {
        profiles = data || [];
      }
    }

    // Final normalized requests
    const normalizedRequests = applications.map((application) => {
      const job =
        jobs.find(
          (item) => item.id === application.job_id
        ) || null;

      const employer =
        employers.find(
          (item) => item.id === application.employer_id
        ) || null;

      const profile =
        profiles.find(
          (item) => item.id === employer?.profile_id
        ) || null;

      return {
        id: application.id,
        jobId: application.job_id,
        workerId: application.worker_id,
        employerId: application.employer_id,
        status: application.status,
        message: application.message || "",
        appliedAt: application.applied_at,
        updatedAt: application.updated_at,

        job: job
          ? {
              id: job.id,
              title: job.title || "Hire Request",
              location: job.location || "",
              salary: job.salary || "",
              workersNeeded: job.workers_needed || 1,
              description: job.description || "",
              status: job.status || "open",
            }
          : null,

        employer: employer
          ? {
              id: employer.id,
              employerType: employer.employer_type || "",
              companyName:
                employer.company_name ||
                profile?.name ||
                "Employer",
              description: employer.description || "",
              profileId: employer.profile_id || "",
              name: profile?.name || "",
              phone: profile?.phone || "",
              location: profile?.location || "",
              avatarUrl: profile?.avatar_url || null,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      worker: {
        id: worker.id,
        profileId: worker.profile_id,
        category: worker.category || "",
        subCategory: worker.sub_category || "",
      },
      requests: normalizedRequests,
    });
  } catch (error) {
    console.error(
      "GET /api/worker-hire-requests error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Hire Requests লোড করা যায়নি।",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
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
        { error: "Login session বৈধ নয়।" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const applicationId = body.applicationId;
    const status = body.status;

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID প্রয়োজন।" },
        { status: 400 }
      );
    }

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          error:
            "Status অবশ্যই accepted অথবা rejected হতে হবে।",
        },
        { status: 400 }
      );
    }

    const { data: worker, error: workerError } =
      await supabaseAdmin
        .from("workers")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

    if (workerError || !worker) {
      return NextResponse.json(
        { error: "Worker profile পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    // নিশ্চিত করি request-টি এই worker-এরই
    const { data: application, error: applicationError } =
      await supabaseAdmin
        .from("applications")
        .select(`
          id,
          job_id,
          worker_id,
          status
        `)
        .eq("id", applicationId)
        .eq("worker_id", worker.id)
        .maybeSingle();

    if (applicationError) {
      return NextResponse.json(
        {
          error: applicationError.message,
        },
        { status: 500 }
      );
    }

    if (!application) {
      return NextResponse.json(
        {
          error: "এই Hire Request পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    if (application.status !== "pending") {
      return NextResponse.json(
        {
          error:
            "এই Hire Request ইতিমধ্যে processed হয়েছে।",
        },
        { status: 400 }
      );
    }

    // Application update
    const { error: updateError } =
      await supabaseAdmin
        .from("applications")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id)
        .eq("worker_id", worker.id);

    if (updateError) {
      return NextResponse.json(
        {
          error: "Hire Request update করা যায়নি।",
          details: updateError.message,
        },
        { status: 500 }
      );
    }

    // Job status update
    if (application.job_id) {
      await supabaseAdmin
        .from("jobs")
        .update({
          status: status === "accepted" ? "assigned" : "open",
        })
        .eq("id", application.job_id);
    }

    return NextResponse.json({
      success: true,
      message:
        status === "accepted"
          ? "Hire Request গ্রহণ করা হয়েছে।"
          : "Hire Request প্রত্যাখ্যান করা হয়েছে।",
    });
  } catch (error) {
    console.error(
      "PATCH /api/worker-hire-requests error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Request update করা যায়নি।",
      },
      { status: 500 }
    );
  }
}