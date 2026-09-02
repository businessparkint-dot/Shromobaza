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

type Params = {
  params: Promise<{ id: string }>;
};

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseSkills(value: string) {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Worker ID পাওয়া যায়নি।",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // AUTHENTICATION
    // ---------------------------------------------------------

    const authorization =
      request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          error: "আপনাকে প্রথমে Login করতে হবে।",
        },
        { status: 401 }
      );
    }

    const accessToken =
      authorization.replace("Bearer ", "").trim();

    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (
      authError ||
      !authData.user
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Login session পাওয়া যায়নি।",
        },
        { status: 401 }
      );
    }

    const currentUserId =
      authData.user.id;

    // ---------------------------------------------------------
    // WORKER CHECK
    // ---------------------------------------------------------

    const {
      data: existingWorker,
      error: workerError,
    } = await supabaseAdmin
      .from("workers")
      .select(`
        id,
        profile_id
      `)
      .eq("id", id)
      .maybeSingle();

    if (workerError) {
      return NextResponse.json(
        {
          success: false,
          error: workerError.message,
        },
        { status: 500 }
      );
    }

    if (!existingWorker) {
      return NextResponse.json(
        {
          success: false,
          error: "Worker পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    // নিজের profile ছাড়া অন্য Worker edit করা যাবে না।
    if (
      existingWorker.profile_id !== currentUserId &&
      existingWorker.id !== currentUserId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "আপনি এই Worker profile edit করার অনুমতি রাখেন না।",
        },
        { status: 403 }
      );
    }

    const formData =
      await request.formData();

    // ---------------------------------------------------------
    // FORM DATA
    // ---------------------------------------------------------

    const name = clean(
      formData.get("name")
    );

    const phone = clean(
      formData.get("phone")
    );

    const location = clean(
      formData.get("location")
    );

    const district = clean(
      formData.get("district")
    );

    const category = clean(
      formData.get("category")
    );

    const subCategory = clean(
      formData.get("subCategory")
    );

    const experience = clean(
      formData.get("experience")
    );

    const skillsText = clean(
      formData.get("skills")
    );

    const about = clean(
      formData.get("about")
    );

    const photo =
      formData.get("photo");

    // ---------------------------------------------------------
    // PROFILE UPDATE
    // ---------------------------------------------------------

    const profileId =
      existingWorker.profile_id ||
      currentUserId;

    const profileUpdate = {
      name:
        name || "নাম দেওয়া হয়নি",

      phone:
        phone || null,

      location:
        location || null,

      worker_category:
        category || null,

      worker_sub_category:
        subCategory || null,

      updated_at:
        new Date().toISOString(),
    };

    const {
      error: profileUpdateError,
    } = await supabaseAdmin
      .from("profiles")
      .update(profileUpdate)
      .eq("id", profileId);

    if (profileUpdateError) {
      console.error(
        "PROFILE UPDATE ERROR:",
        profileUpdateError
      );

      return NextResponse.json(
        {
          success: false,
          error: profileUpdateError.message,
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // PHOTO UPLOAD
    // ---------------------------------------------------------

    let avatarUrl: string | null = null;

    if (
      photo &&
      photo instanceof File &&
      photo.size > 0
    ) {
      if (photo.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Profile photo সর্বোচ্চ 5MB হতে পারবে।",
          },
          { status: 400 }
        );
      }

      if (
        !photo.type.startsWith("image/")
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "শুধু image file upload করা যাবে।",
          },
          { status: 400 }
        );
      }

      // Bucket না থাকলে তৈরি করার চেষ্টা।
      const {
        data: buckets,
      } = await supabaseAdmin
        .storage
        .listBuckets();

      const bucketExists =
        buckets?.some(
          (bucket) =>
            bucket.name === "avatars"
        );

      if (!bucketExists) {
        const {
          error: bucketError,
        } = await supabaseAdmin.storage.createBucket(
          "avatars",
          {
            public: true,
          }
        );

        if (
          bucketError &&
          !bucketError.message
            .toLowerCase()
            .includes("already exists")
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Avatar storage তৈরি করা যায়নি: " +
                bucketError.message,
            },
            { status: 500 }
          );
        }
      }

      const extension =
        photo.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const filePath =
        `${profileId}/profile-${Date.now()}.${extension}`;

      const arrayBuffer =
        await photo.arrayBuffer();

      const {
        error: uploadError,
      } = await supabaseAdmin
        .storage
        .from("avatars")
        .upload(
          filePath,
          arrayBuffer,
          {
            contentType: photo.type,
            upsert: true,
          }
        );

      if (uploadError) {
        console.error(
          "AVATAR UPLOAD ERROR:",
          uploadError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Profile photo upload করা যায়নি: " +
              uploadError.message,
          },
          { status: 500 }
        );
      }

      const {
        data: publicUrlData,
      } = supabaseAdmin
        .storage
        .from("avatars")
        .getPublicUrl(filePath);

      avatarUrl =
        publicUrlData.publicUrl;

      const {
        error: avatarUpdateError,
      } = await supabaseAdmin
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", profileId);

      if (avatarUpdateError) {
        return NextResponse.json(
          {
            success: false,
            error:
              avatarUpdateError.message,
          },
          { status: 500 }
        );
      }
    }

    // ---------------------------------------------------------
    // WORKER UPDATE
    // ---------------------------------------------------------

    const workerUpdate = {
      category:
        category || null,

      sub_category:
        subCategory || null,

      experience:
        experience || null,

      skills:
        skillsText
          ? parseSkills(skillsText)
          : null,

      district:
        district || null,

      location:
        location || null,

      updated_at:
        new Date().toISOString(),
    };

    const {
      error: workerUpdateError,
    } = await supabaseAdmin
      .from("workers")
      .update(workerUpdate)
      .eq("id", id);

    if (workerUpdateError) {
      console.error(
        "WORKER UPDATE ERROR:",
        workerUpdateError
      );

      return NextResponse.json(
        {
          success: false,
          error: workerUpdateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Worker profile সফলভাবে update হয়েছে।",
      avatarUrl,
      about,
    });
  } catch (error) {
    console.error(
      "WORKER EDIT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Profile update করা যায়নি।",
      },
      { status: 500 }
    );
  }
}