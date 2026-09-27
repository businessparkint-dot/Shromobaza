
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

/* =========================================================
   GET
   Existing Business Verification
   + Global Opportunities Verification
   ========================================================= */

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    /* -----------------------------
       BUSINESS VERIFICATION
       ----------------------------- */

    const {
      data: businesses,
      error: businessError,
    } = await supabaseAdmin
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

    if (businessError) {
      console.error(
        "VERIFICATION BUSINESS API ERROR:",
        businessError
      );

      return NextResponse.json(
        {
          success: false,
          error: businessError.message,
        },
        { status: 500 }
      );
    }

    const businessVerificationItems = (businesses ?? []).map(
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
          district:
            business.district || "",
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

    /* -----------------------------
       GLOBAL OPPORTUNITIES
       ----------------------------- */

    const {
      data: opportunities,
      error: opportunityError,
    } = await supabaseAdmin
      .from("global_opportunities")
      .select(`
        id,
        owner_id,
        opportunity_type,
        title,
        description,
        sector,
        country,
        city,
        offering,
        requirement,
        funding_required,
        funding_currency,
        status,
        is_verified,
        is_public,
        website,
        contact_email,
        contact_phone,
        created_at,
        updated_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (opportunityError) {
      console.error(
        "GLOBAL OPPORTUNITY VERIFICATION API ERROR:",
        opportunityError
      );

      return NextResponse.json(
        {
          success: false,
          error: opportunityError.message,
        },
        { status: 500 }
      );
    }

    const globalVerificationItems = (
      opportunities ?? []
    ).map((opportunity: any) => {
      let verificationStatus:
        | "pending"
        | "verified"
        | "rejected";

      if (
        opportunity.status === "rejected"
      ) {
        verificationStatus = "rejected";
      } else if (
        opportunity.is_verified === true &&
        opportunity.status === "published"
      ) {
        verificationStatus = "verified";
      } else {
        verificationStatus = "pending";
      }

      return {
        id: String(opportunity.id),
        ownerId:
          opportunity.owner_id,
        name:
          opportunity.title ||
          "Untitled Global Opportunity",
        type: "global_opportunity",
        businessType:
          opportunity.opportunity_type ||
          "",
        opportunityType:
          opportunity.opportunity_type ||
          "",
        status: verificationStatus,
        verificationLevel:
          opportunity.is_verified
            ? "verified"
            : "pending",
        phone:
          opportunity.contact_phone ||
          "",
        email:
          opportunity.contact_email ||
          "",
        address: "",
        city:
          opportunity.city || "",
        district:
          opportunity.country || "",
        country:
          opportunity.country || "",
        sector:
          opportunity.sector || "",
        description:
          opportunity.description || "",
        offering:
          opportunity.offering || "",
        requirement:
          opportunity.requirement || "",
        fundingRequired:
          opportunity.funding_required ??
          null,
        fundingCurrency:
          opportunity.funding_currency ||
          "BDT",
        website:
          opportunity.website || "",
        isPublic:
          opportunity.is_public ?? false,
        isVerified:
          opportunity.is_verified ?? false,
        createdAt:
          opportunity.created_at || null,
        updatedAt:
          opportunity.updated_at || null,
      };
    });

    /* -----------------------------
       COMBINED VERIFICATION ITEMS
       ----------------------------- */

    const verificationItems = [
      ...businessVerificationItems,
      ...globalVerificationItems,
    ];

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

    const businessTotal =
      businessVerificationItems.length;

    const businessPending =
      businessVerificationItems.filter(
        (item) =>
          item.status === "pending"
      ).length;

    const businessVerified =
      businessVerificationItems.filter(
        (item) =>
          item.status === "verified"
      ).length;

    const businessRejected =
      businessVerificationItems.filter(
        (item) =>
          item.status === "rejected"
      ).length;

    const globalTotal =
      globalVerificationItems.length;

    const globalPending =
      globalVerificationItems.filter(
        (item) =>
          item.status === "pending"
      ).length;

    const globalVerified =
      globalVerificationItems.filter(
        (item) =>
          item.status === "verified"
      ).length;

    const globalRejected =
      globalVerificationItems.filter(
        (item) =>
          item.status === "rejected"
      ).length;

    return NextResponse.json({
      success: true,

      verificationItems,

      businessVerificationItems,

      globalVerificationItems,

      summary: {
        total,
        pending,
        verified,
        rejected,
      },

      businessSummary: {
        total: businessTotal,
        pending: businessPending,
        verified: businessVerified,
        rejected: businessRejected,
      },

      globalSummary: {
        total: globalTotal,
        pending: globalPending,
        verified: globalVerified,
        rejected: globalRejected,
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

/* =========================================================
   POST
   Global Opportunity Verify / Reject
   ========================================================= */

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const id = body?.id;
    const action = body?.action;

    if (
      id === undefined ||
      id === null ||
      !["verify", "reject"].includes(
        action
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Valid opportunity id and action are required.",
        },
        { status: 400 }
      );
    }

    const supabaseAdmin =
      getSupabaseAdmin();

    const opportunityId =
      Number(id);

    if (
      !Number.isInteger(
        opportunityId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid opportunity id.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------
       VERIFY
       ----------------------------- */

    if (action === "verify") {
      const { data, error } =
        await supabaseAdmin
          .from("global_opportunities")
          .update({
            status: "published",
            is_verified: true,
            is_public: true,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", opportunityId)
          .select(`
            id,
            owner_id,
            opportunity_type,
            title,
            status,
            is_verified,
            is_public,
            updated_at
          `)
          .single();

      if (error) {
        console.error(
          "GLOBAL OPPORTUNITY VERIFY ERROR:",
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

      return NextResponse.json({
        success: true,
        action: "verify",
        message:
          "Global Opportunity verified and published successfully.",
        opportunity: data,
      });
    }

    /* -----------------------------
       REJECT
       ----------------------------- */

    const { data, error } =
      await supabaseAdmin
        .from("global_opportunities")
        .update({
          status: "rejected",
          is_verified: false,
          is_public: false,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", opportunityId)
        .select(`
          id,
          owner_id,
          opportunity_type,
          title,
          status,
          is_verified,
          is_public,
          updated_at
        `)
        .single();

    if (error) {
      console.error(
        "GLOBAL OPPORTUNITY REJECT ERROR:",
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

    return NextResponse.json({
      success: true,
      action: "reject",
      message:
        "Global Opportunity rejected successfully.",
      opportunity: data,
    });
  } catch (error) {
    console.error(
      "VERIFICATION POST UNEXPECTED ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Verification action সম্পন্ন করা যায়নি।",
      },
      { status: 500 }
    );
  }
}