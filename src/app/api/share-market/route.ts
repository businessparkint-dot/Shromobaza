import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Central Admin Share Market API is working.",
    route: "/api/central-admin/share-market",
  });
}