"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
BriefcaseBusiness,
CheckCircle2,
Clock3,
MapPin,
MessageSquare,
PlayCircle,
RefreshCw,
Star,
UserRound,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
supabaseUrl && supabaseKey
? createClient(supabaseUrl, supabaseKey)
: null;

type ApplicationStatus =
| "pending"
| "accepted"
| "rejected"
| "in_progress"
| "worker_completed"
| "completed";

type Worker = {
id: string;
profileId?: string;
name?: string;
phone?: string;
location?: string;
district?: string;
category?: string;
subCategory?: string;
experience?: string;
skills?: string;
rating?: number;
reviewCount?: number;
avatarUrl?: string;
};

type Job = {
id: string;
title: string;
location?: string;
salary?: string | number;
description?: string;
status?: string;
};

type Employer = {
id: string;
employerType?: string;
companyName?: string;
description?: string;
profileId?: string;
profile?: {
id?: string;
name?: string;
phone?: string;
location?: string;
} | null;
};

type Application = {
id: string;
jobId: string;
workerId: string;
employerId: string;
status: ApplicationStatus;
message?: string | null;
appliedAt?: string;
updatedAt?: string;
job?: Job | null;
employer?: Employer | null;
};

type HireRequest = {
id: string;
jobId: string;
workerId: string;
employerId: string;
status: ApplicationStatus;
message?: string | null;
appliedAt?: string;
job?: Job | null;
employer?: Employer | null;
};

type DashboardResponse = {
success: boolean;
message?: string;
error?: string;
worker?: Worker;
applications?: Application[];
};

function statusLabel(status: ApplicationStatus) {
switch (status) {
case "pending":
return "অপেক্ষমাণ";
case "accepted":
return "গৃহীত";
case "rejected":
return "বাতিল";
case "in_progress":
return "কাজ চলছে";
case "worker_completed":
return "কাজ সম্পন্ন — নিশ্চিতকরণের অপেক্ষায়";
case "completed":
return "কাজ সম্পন্ন";
default:
return status;
}
}

function statusClass(status: ApplicationStatus) {
switch (status) {
case "accepted":
return "bg-emerald-50 text-emerald-700 border-emerald-200";
case "in_progress":
return "bg-blue-50 text-blue-700 border-blue-200";
case "worker_completed":
return "bg-amber-50 text-amber-700 border-amber-200";
case "completed":
return "bg-purple-50 text-purple-700 border-purple-200";
case "rejected":
return "bg-red-50 text-red-700 border-red-200";
default:
return "bg-gray-50 text-gray-700 border-gray-200";
}
}

export default function WorkerDashboardPage() {
const [worker, setWorker] = useState<Worker | null>(null);
const [applications, setApplications] = useState<Application[]>([]);
const [hireRequests, setHireRequests] = useState<HireRequest[]>([]);
const [loading, setLoading] = useState(true);
const [actionLoading, setActionLoading] = useState<string | null>(null);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const getToken = useCallback(async () => {
if (!supabase) {
throw new Error(
"Supabase configuration পাওয়া যায়নি। .env.local check করুন।"
);
}

const {
  data: { session },
  error: sessionError,
} = await supabase.auth.getSession();

if (sessionError) {
  throw new Error(sessionError.message);
}

return session?.access_token || null;

}, []);

const loadDashboard = useCallback(async () => {
try {
setLoading(true);
setError("");


  const token = await getToken();

  if (!token) {
    setError("আপনার login session পাওয়া যায়নি। আবার login করুন।");
    return;
  }

  const response = await fetch("/api/worker-dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data =
    (await response.json().catch(() => ({}))) as DashboardResponse;

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        data.error ||
        `Dashboard load failed (${response.status})`
    );
  }

  setWorker(data.worker || null);
  setApplications(data.applications || []);

  const hireResponse = await fetch("/api/worker-hire-requests", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (hireResponse.ok) {
    const hireData = await hireResponse.json().catch(() => ({}));

    setHireRequests(
      Array.isArray(hireData.requests) ? hireData.requests : []
    );
  } else {
    setHireRequests([]);
  }
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Dashboard load করা যায়নি।"
  );
} finally {
  setLoading(false);
}


}, [getToken]);

useEffect(() => {
loadDashboard();
}, [loadDashboard]);

const updateJobStatus = async (
applicationId: string,
action: "start" | "worker_complete"
) => {
try {
setActionLoading(applicationId);
setError("");
setSuccess("");


  const token = await getToken();

  if (!token) {
    setError("Login session পাওয়া যায়নি। আবার login করুন।");
    return;
  }

  const response = await fetch("/api/worker-job-status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    body: JSON.stringify({
      applicationId,
      action,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        data.error ||
        `Status update failed (${response.status})`
    );
  }

  const newStatus: ApplicationStatus =
    action === "start" ? "in_progress" : "worker_completed";

  setApplications((current) =>
    current.map((application) =>
      application.id === applicationId
        ? {
            ...application,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : application
    )
  );

  if (action === "start") {
    setSuccess(
      "কাজ শুরু হয়েছে। কাজ শেষ হলে 'কাজ সম্পন্ন করুন' চাপুন।"
    );
  } else {
    setSuccess(
      "কাজ সম্পন্ন হিসেবে পাঠানো হয়েছে। এখন Employer confirmation-এর অপেক্ষায়।"
    );
  }

  setActionLoading(null);

  setTimeout(() => {
    loadDashboard();
  }, 800);
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "কাজের status update করা যায়নি।"
  );
  setActionLoading(null);
}


};

const respondToHireRequest = async (
applicationId: string,
status: "accepted" | "rejected"
) => {
try {
setActionLoading(applicationId);
setError("");
setSuccess("");


  const token = await getToken();

  if (!token) {
    setError("Login session পাওয়া যায়নি। আবার login করুন।");
    return;
  }

  const response = await fetch("/api/worker-hire-requests", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      applicationId,
      status,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        data.error ||
        "Hire Request update করা যায়নি।"
    );
  }

  setSuccess(
    status === "accepted"
      ? "Hire Request গ্রহণ করা হয়েছে।"
      : "Hire Request বাতিল করা হয়েছে।"
  );

  await loadDashboard();
} catch (err) {
  setError(
    err instanceof Error
      ? err.message
      : "Hire Request update করা যায়নি।"
  );
} finally {
  setActionLoading(null);
}


};

const activeJobs = useMemo(
() =>
applications.filter(
(item) =>
item.status === "accepted" ||
item.status === "in_progress" ||
item.status === "worker_completed"
),
[applications]
);

const completedJobs = useMemo(
() =>
applications.filter(
(item) => item.status === "completed"
),
[applications]
);

if (loading) {
return ( <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4"> <div className="flex items-center gap-3 text-gray-600"> <RefreshCw className="h-5 w-5 animate-spin" />
Dashboard loading... </div> </main>
);
}

return ( <main className="min-h-screen bg-gray-50"> <div className="mx-auto max-w-6xl px-4 py-8">


    <div className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-emerald-100">
            {worker?.avatarUrl ? (
              <img
                src={worker.avatarUrl}
                alt={worker.name || "Worker"}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-8 w-8 text-emerald-700" />
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Worker Dashboard
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              {worker?.name || "Worker"}
            </h1>

            <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {worker?.location ||
                  worker?.district ||
                  "Location নেই"}
              </span>

              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {Number(worker?.rating || 0).toFixed(2)} (
                {worker?.reviewCount || 0})
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
    </div>

    {error && (
      <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
        {error}
      </div>
    )}

    {success && (
      <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
        {success}
      </div>
    )}

    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border bg-white p-5">
        <BriefcaseBusiness className="mb-3 h-6 w-6 text-emerald-600" />
        <p className="text-sm text-gray-500">
          মোট Application
        </p>
        <p className="mt-1 text-3xl font-bold">
          {applications.length}
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <Clock3 className="mb-3 h-6 w-6 text-amber-600" />
        <p className="text-sm text-gray-500">
          Pending
        </p>
        <p className="mt-1 text-3xl font-bold">
          {
            applications.filter(
              (x) => x.status === "pending"
            ).length
          }
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <PlayCircle className="mb-3 h-6 w-6 text-blue-600" />
        <p className="text-sm text-gray-500">
          Active Jobs
        </p>
        <p className="mt-1 text-3xl font-bold">
          {activeJobs.length}
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-5">
        <CheckCircle2 className="mb-3 h-6 w-6 text-purple-600" />
        <p className="text-sm text-gray-500">
          Completed
        </p>
        <p className="mt-1 text-3xl font-bold">
          {completedJobs.length}
        </p>
      </div>
    </div>

    {hireRequests.length > 0 && (
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            নতুন Hire Request
          </h2>

          <p className="text-sm text-gray-500">
            Employer সরাসরি আপনাকে যে কাজের জন্য request পাঠিয়েছে।
          </p>
        </div>

        <div className="space-y-4">
          {hireRequests.map((request) => (
            <div
              key={request.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    {request.job?.title || "কাজ"}
                  </h3>

                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>
                      Employer:{" "}
                      <strong>
                        {request.employer?.profile?.name ||
                          request.employer?.companyName ||
                          "Employer"}
                      </strong>
                    </p>

                    <p className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {request.job?.location || "Location নেই"}
                    </p>

                    <p>
                      Salary:{" "}
                      <strong>
                        {request.job?.salary ||
                          "আলোচনা সাপেক্ষে"}
                      </strong>
                    </p>
                  </div>

                  {request.message && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                      <MessageSquare className="mr-2 inline h-4 w-4" />
                      {request.message}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={actionLoading === request.id}
                    onClick={() =>
                      respondToHireRequest(
                        request.id,
                        "accepted"
                      )
                    }
                    className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading === request.id}
                    onClick={() =>
                      respondToHireRequest(
                        request.id,
                        "rejected"
                      )
                    }
                    className="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}

    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          আমার সক্রিয় কাজ
        </h2>

        <p className="text-sm text-gray-500">
          Accepted কাজ থেকে completion পর্যন্ত এখান থেকেই manage করুন।
        </p>
      </div>

      {activeJobs.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
          বর্তমানে কোনো Active Job নেই।
        </div>
      ) : (
        <div className="space-y-4">
          {activeJobs.map((application) => (
            <div
              key={application.id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">
                      {application.job?.title || "কাজ"}
                    </h3>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass(
                        application.status
                      )}`}
                    >
                      {statusLabel(application.status)}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                    <p>
                      Employer:{" "}
                      <strong>
                        {application.employer?.profile?.name ||
                          application.employer?.companyName ||
                          "Employer"}
                      </strong>
                    </p>

                    <p>
                      Salary:{" "}
                      <strong>
                        {application.job?.salary ||
                          "আলোচনা সাপেক্ষে"}
                      </strong>
                    </p>

                    <p className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {application.job?.location ||
                        "Location নেই"}
                    </p>
                  </div>

                  {application.job?.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-600">
                      {application.job.description}
                    </p>
                  )}
                </div>

                <div className="w-full md:w-auto">

                  {application.status === "accepted" && (
                    <button
                      type="button"
                      disabled={
                        actionLoading === application.id
                      }
                      onClick={() =>
                        updateJobStatus(
                          application.id,
                          "start"
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                    >
                      {actionLoading === application.id ? (
                        <>
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          আপডেট হচ্ছে...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-5 w-5" />
                          কাজ শুরু করুন
                        </>
                      )}
                    </button>
                  )}

                  {application.status === "in_progress" && (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-center">
                        <p className="text-sm font-bold text-blue-700">
                          কাজ চলছে
                        </p>

                        <p className="mt-1 text-xs text-blue-600">
                          কাজ শেষ হলে নিচের button চাপুন।
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          actionLoading === application.id
                        }
                        onClick={() =>
                          updateJobStatus(
                            application.id,
                            "worker_complete"
                          )
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                      >
                        {actionLoading === application.id ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            আপডেট হচ্ছে...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-5 w-5" />
                            কাজ সম্পন্ন করুন
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {application.status === "worker_completed" && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-center">
                      <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-amber-600" />

                      <p className="text-sm font-bold text-amber-700">
                        কাজ সম্পন্ন হয়েছে
                      </p>

                      <p className="mt-1 text-xs text-amber-600">
                        Employer এখন কাজটি confirm করবেন।
                      </p>

                      <p className="mt-2 text-xs font-semibold text-amber-700">
                        Confirmation-এর অপেক্ষায়
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

    <section>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          সম্পন্ন কাজ
        </h2>

        <p className="text-sm text-gray-500">
          Employer confirmation-এর পর সম্পন্ন কাজ এখানে থাকবে।
        </p>
      </div>

      {completedJobs.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">
          এখনো কোনো কাজ সম্পন্ন হয়নি।
        </div>
      ) : (
        <div className="space-y-3">
          {completedJobs.map((application) => (
            <div
              key={application.id}
              className="rounded-2xl border bg-white p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold">
                    {application.job?.title || "কাজ"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Employer:{" "}
                    {application.employer?.profile?.name ||
                      application.employer?.companyName ||
                      "Employer"}
                  </p>
                </div>

                <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-sm font-semibold text-purple-700">
                  <CheckCircle2 className="h-4 w-4" />
                  কাজ সম্পন্ন
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>

    <div className="mt-8 rounded-2xl border bg-white p-5 text-center">
      <Link
        href="/workers"
        className="font-semibold text-emerald-700 hover:underline"
      >
        Worker Profile দেখুন
      </Link>
    </div>
  </div>
</main>


);
}
