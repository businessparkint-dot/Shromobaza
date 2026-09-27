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
      .from("employers")
      .select(`
        id,
        profile_id,
        employer_type,
        company_name,
        description,
        created_at,
        updated_at,
        profiles:profile_id (
          id,
          name,
          phone,
          email,
          location,
          avatar_url,
          user_type
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "CENTRAL ADMIN EMPLOYERS API ERROR:",
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

    const employers = (data ?? []).map(
      (employer: any) => {
        const profile = Array.isArray(
          employer.profiles
        )
          ? employer.profiles[0] || null
          : employer.profiles;

        return {
          id: employer.id,
          profileId: employer.profile_id,
          employerType:
            employer.employer_type || "",
          companyName:
            employer.company_name || "",
          description:
            employer.description || "",
          name:
            profile?.name ||
            "নাম দেওয়া হয়নি",
          phone:
            profile?.phone || "",
          email:
            profile?.email || "",
          location:
            profile?.location || "",
          avatarUrl:
            profile?.avatar_url || null,
          userType:
            profile?.user_type || "",
          createdAt:
            employer.created_at || null,
          updatedAt:
            employer.updated_at || null,
        };
      }
    );

    return NextResponse.json({
      success: true,
      employers,
      total: employers.length,
    });
  } catch (error) {
    console.error(
      "CENTRAL ADMIN EMPLOYERS UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Employers load করা যায়নি।",
      },
      { status: 500 }
    );
  }
}