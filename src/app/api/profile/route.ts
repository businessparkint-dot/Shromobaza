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
  },
);

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authorization.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid authentication session." },
        { status: 401 },
      );
    }

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select(
          `
          id,
          name,
          phone,
          location,
          user_type,
          worker_category,
          worker_sub_category,
          employer_type,
          avatar_url
        `,
        )
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        {
          error: "Profile load failed.",
          details: profileError.message,
        },
        { status: 500 },
      );
    }

    const { data: employer } = await supabaseAdmin
      .from("employers")
      .select(
        `
        id,
        profile_id,
        employer_type,
        company_name,
        description
        `,
      )
      .eq("profile_id", user.id)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email || "",
      },
      profile: profile || null,
      employer: employer || null,
    });
  } catch (error) {
    console.error("Profile GET error:", error);

    return NextResponse.json(
      {
        error: "Profile load failed.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authorization.replace("Bearer ", "").trim();

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid authentication session." },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const userType = String(
      formData.get("userType") || "customer",
    ).trim();

    const occupation = String(
      formData.get("occupation") || "",
    ).trim();

    const skill = String(
      formData.get("skill") || "",
    ).trim();

    const employerType = String(
      formData.get("employerType") || "",
    ).trim();

    const companyName = String(
      formData.get("companyName") || "",
    ).trim();

    const description = String(
      formData.get("description") || "",
    ).trim();

    const photo = formData.get("photo");

    if (!name) {
      return NextResponse.json(
        { error: "নাম দিন।" },
        { status: 400 },
      );
    }

    if (!["worker", "employer", "customer"].includes(userType)) {
      return NextResponse.json(
        { error: "Invalid account type." },
        { status: 400 },
      );
    }

    /*
     * ==========================================
     * PROFILE UPDATE
     * ==========================================
     */

    const profilePayload = {
      name,
      phone: phone || null,
      location: location || null,
      user_type: userType,
      worker_category:
        userType === "worker"
          ? occupation || null
          : null,
      worker_sub_category: null,
      employer_type:
        userType === "employer"
          ? employerType || null
          : null,
      updated_at: new Date().toISOString(),
    };

    let avatarUrl: string | null = null;

    /*
     * Keep existing avatar when no new photo is uploaded.
     */

    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    avatarUrl = existingProfile?.avatar_url || null;

    /*
     * ==========================================
     * PHOTO UPLOAD
     * ==========================================
     */

    if (
      photo instanceof File &&
      photo.size > 0
    ) {
      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            error:
              "Profile photo must be smaller than 5MB.",
          },
          { status: 400 },
        );
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(photo.type)) {
        return NextResponse.json(
          {
            error:
              "Only JPG, PNG or WebP images are allowed.",
          },
          { status: 400 },
        );
      }

      const extension =
        photo.type === "image/png"
          ? "png"
          : photo.type === "image/webp"
            ? "webp"
            : "jpg";

      const bucketName = "avatars";

      const { data: buckets } =
        await supabaseAdmin.storage.listBuckets();

      const bucketExists = buckets?.some(
        (bucket) => bucket.name === bucketName,
      );

      if (!bucketExists) {
        const { error: bucketError } =
          await supabaseAdmin.storage.createBucket(
            bucketName,
            {
              public: true,
            },
          );

        if (
          bucketError &&
          !bucketError.message
            .toLowerCase()
            .includes("already exists")
        ) {
          return NextResponse.json(
            {
              error:
                "Profile photo storage could not be created.",
              details: bucketError.message,
            },
            { status: 500 },
          );
        }
      }

      const filePath =
        `${user.id}/profile-${Date.now()}.${extension}`;

      const arrayBuffer = await photo.arrayBuffer();

      const { error: uploadError } =
        await supabaseAdmin.storage
          .from(bucketName)
          .upload(
            filePath,
            arrayBuffer,
            {
              contentType: photo.type,
              upsert: true,
            },
          );

      if (uploadError) {
        return NextResponse.json(
          {
            error:
              "Profile photo upload failed.",
            details: uploadError.message,
          },
          { status: 500 },
        );
      }

      const { data: publicUrlData } =
        supabaseAdmin.storage
          .from(bucketName)
          .getPublicUrl(filePath);

      avatarUrl =
        publicUrlData.publicUrl;
    }

    /*
     * Add avatar URL only after photo handling.
     */

    const finalProfilePayload = {
      ...profilePayload,
      avatar_url: avatarUrl,
    };

    const { data: savedProfile, error: saveError } =
      await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            id: user.id,
            ...finalProfilePayload,
          },
          {
            onConflict: "id",
          },
        )
        .select(
          `
          id,
          name,
          phone,
          location,
          user_type,
          worker_category,
          worker_sub_category,
          employer_type,
          avatar_url
          `,
        )
        .single();

    if (saveError) {
      return NextResponse.json(
        {
          error: "Profile save failed.",
          details: saveError.message,
        },
        { status: 500 },
      );
    }

    /*
     * ==========================================
     * EMPLOYER
     * ==========================================
     */

    let savedEmployer = null;

    if (userType === "employer") {
      const { data, error } =
        await supabaseAdmin
          .from("employers")
          .upsert(
            {
              profile_id: user.id,
              employer_type:
                employerType || "business",
              company_name:
                companyName || name,
              description:
                description || null,
              updated_at:
                new Date().toISOString(),
            },
            {
              onConflict: "profile_id",
            },
          )
          .select(
            `
            id,
            profile_id,
            employer_type,
            company_name,
            description
            `,
          )
          .single();

      if (error) {
        return NextResponse.json(
          {
            error:
              "Employer profile save failed.",
            details: error.message,
          },
          { status: 500 },
        );
      }

      savedEmployer = data;
    }

    return NextResponse.json({
      success: true,
      message:
        "Profile successfully updated.",
      profile: savedProfile,
      employer: savedEmployer,
    });
  } catch (error) {
    console.error("Profile PATCH error:", error);

    return NextResponse.json(
      {
        error: "Profile update failed.",
      },
      { status: 500 },
    );
  }
}