import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const secretKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

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

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from("businesses")
      .select(`
        id,
        owner_id,
        business_type,
        name,
        slug,
        phone,
        email,
        address,
        city,
        district,
        is_public,
        is_verified,
        verification_level,
        status,
        created_at,
        updated_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "VERIFICATION API ERROR:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    const verificationItems = (data ?? []).map(
      (business: any) => {
        let verificationStatus:
          | "pending"
          | "verified"
          | "rejected";

        if (business.is_verified === true) {
          verificationStatus = "verified";
        } else if (
          business.status === "rejected"
        ) {
          verificationStatus = "rejected";
        } else {
          verificationStatus = "pending";
        }

        return {
          id: business.id,
          ownerId: business.owner_id,
          name:
            business.name ||
            "Unnamed Business",
          type: "business",
          businessType:
            business.business_type || "",
          status: verificationStatus,
          verificationLevel:
            business.verification_level ||
            "basic",
          phone: business.phone || "",
          email: business.email || "",
          address: business.address || "",
          city: business.city || "",
          district: business.district || "",
          isPublic:
            business.is_public ?? false,
          isVerified:
            business.is_verified ?? false,
          createdAt:
            business.created_at || null,
          updatedAt:
            business.updated_at || null,
        };
      }
    );

    const total =
      verificationItems.length;

    const pending =
      verificationItems.filter(
        (item) =>
          item.status === "pending"
      ).length;

    const verified =
      verificationItems.filter(
        (item) =>
          item.status === "verified"
      ).length;

    const rejected =
      verificationItems.filter(
        (item) =>
          item.status === "rejected"
      ).length;

    return NextResponse.json({
      success: true,
      verificationItems,
      summary: {
        total,
        pending,
        verified,
        rejected,
      },
    });
  } catch (error) {
    console.error(
      "VERIFICATION API UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Verification data load করা যায়নি।",
      },
      { status: 500 }
    );
  }
}