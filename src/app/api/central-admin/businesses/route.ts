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
        tagline,
        description,
        logo_url,
        cover_url,
        phone,
        email,
        address,
        city,
        district,
        website_url,
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
        "CENTRAL ADMIN BUSINESSES API ERROR:",
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

    const businesses = (data ?? []).map(
      (business: any) => ({
        id: business.id,
        ownerId: business.owner_id,
        businessType:
          business.business_type || "",
        name: business.name || "",
        slug: business.slug || "",
        tagline: business.tagline || "",
        description:
          business.description || "",
        logoUrl: business.logo_url || "",
        coverUrl: business.cover_url || "",
        phone: business.phone || "",
        email: business.email || "",
        address: business.address || "",
        city: business.city || "",
        district: business.district || "",
        websiteUrl:
          business.website_url || "",
        isPublic:
          business.is_public ?? false,
        isVerified:
          business.is_verified ?? false,
        verificationLevel:
          business.verification_level || "",
        status: business.status || "",
        createdAt:
          business.created_at || null,
        updatedAt:
          business.updated_at || null,
      })
    );

    return NextResponse.json({
      success: true,
      businesses,
      total: businesses.length,
    });
  } catch (error) {
    console.error(
      "CENTRAL ADMIN BUSINESSES UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Business/Office load করা যায়নি।",
      },
      { status: 500 }
    );
  }
}