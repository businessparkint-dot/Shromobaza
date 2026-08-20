"use client";

import { Suspense } from "react";
import WorkerApplicationClient from "./worker-application-client";

function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">
          Job তথ্য লোড হচ্ছে...
        </p>
      </div>
    </main>
  );
}

export default function WorkerApplicationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <WorkerApplicationClient />
    </Suspense>
  );
}