import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

const ADMIN_KEY =
  process.env.SHROMO_TV_ADMIN_KEY ||
  process.env.CENTRAL_ADMIN_KEY ||
  "";

const BUCKET = "shromo-tv";

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error(
      "Supabase server environment variables are missing."
    );
  }

  return createClient(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

function isAdmin(request: NextRequest) {
  if (!ADMIN_KEY) return false;

  const key =
    request.headers.get("x-shromo-tv-admin-key") ||
    request.headers.get("x-admin-key");

  return key === ADMIN_KEY;
}

function isActive(item: {
  published: boolean;
  starts_at: string | null;
  expires_at: string | null;
}) {
  const now = Date.now();

  if (!item.published) return false;

  if (
    item.starts_at &&
    new Date(item.starts_at).getTime() > now
  ) {
    return false;
  }

  if (
    item.expires_at &&
    new Date(item.expires_at).getTime() <= now
  ) {
    return false;
  }

  return true;
}

/* =========================================================
   GET
   Public users only receive currently active published TV.
   Admin can use ?admin=1 with the admin key to receive all.
========================================================= */

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    const adminMode =
      request.nextUrl.searchParams.get("admin") === "1";

    if (adminMode && !isAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("shromo_tv_content")
      .select(
        `
        id,
        title,
        slug,
        description,
        media_type,
        media_url,
        thumbnail_url,
        published,
        starts_at,
        expires_at,
        created_at,
        updated_at
      `
      )
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return NextResponse.json(
        {
          error: "Unable to load SHROMO TV content.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    const content = adminMode
      ? data || []
      : (data || []).filter(isActive);

    return NextResponse.json({
      content,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to load SHROMO TV content.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   POST
   1. create-upload
   2. create-content
========================================================= */

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const supabase = getSupabaseAdmin();

    const body = await request.json();

    const action = String(
      body?.action || ""
    ).trim();

    /* -----------------------------------------------------
       CREATE SIGNED UPLOAD URL
    ----------------------------------------------------- */

    if (action === "create-upload") {
      const fileName = String(
        body?.fileName || ""
      ).trim();

      if (!fileName) {
        return NextResponse.json(
          {
            error:
              "File name is required.",
          },
          { status: 400 }
        );
      }

      const bucket =
        await supabase.storage.getBucket(
          BUCKET
        );

      if (bucket.error) {
        const { error: bucketError } =
          await supabase.storage.createBucket(
            BUCKET,
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
              error:
                "Unable to create SHROMO TV storage bucket.",
              details:
                bucketError.message,
            },
            { status: 500 }
          );
        }
      }

      const safeName =
        fileName
          .replace(
            /[^a-zA-Z0-9._-]/g,
            "-"
          )
          .replace(
            /-+/g,
            "-"
          );

      const storagePath =
        `${Date.now()}-${crypto.randomUUID()}-${safeName}`;

      const { data, error } =
        await supabase.storage
          .from(BUCKET)
          .createSignedUploadUrl(
            storagePath
          );

      if (error || !data) {
        return NextResponse.json(
          {
            error:
              "Unable to create upload URL.",
            details:
              error?.message,
          },
          { status: 500 }
        );
      }

      const publicUrl =
        `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;

      return NextResponse.json({
        success: true,
        path: storagePath,
        token: data.token,
        signedUrl: data.signedUrl,
        publicUrl,
      });
    }

    /* -----------------------------------------------------
       CREATE CONTENT METADATA
    ----------------------------------------------------- */

    if (action === "create-content") {
      const title = String(
        body?.title || ""
      ).trim();

      const slug = String(
        body?.slug || ""
      ).trim();

      const description =
        body?.description
          ? String(
              body.description
            ).trim()
          : null;

      const mediaType = String(
        body?.media_type || ""
      ).trim();

      const mediaUrl = String(
        body?.media_url || ""
      ).trim();

      const thumbnailUrl =
        body?.thumbnail_url
          ? String(
              body.thumbnail_url
            ).trim()
          : null;

      const startsAt =
        body?.starts_at || null;

      const expiresAt =
        body?.expires_at || null;

      const published =
        Boolean(body?.published);

      if (
        !title ||
        !slug ||
        !mediaUrl
      ) {
        return NextResponse.json(
          {
            error:
              "Title, slug and media URL are required.",
          },
          { status: 400 }
        );
      }

      if (
        mediaType !== "video" &&
        mediaType !== "image"
      ) {
        return NextResponse.json(
          {
            error:
              "Media type must be video or image.",
          },
          { status: 400 }
        );
      }

      if (
        startsAt &&
        expiresAt &&
        new Date(expiresAt).getTime() <=
          new Date(startsAt).getTime()
      ) {
        return NextResponse.json(
          {
            error:
              "Expiry must be after start time.",
          },
          { status: 400 }
        );
      }

      const { data, error } =
        await supabase
          .from(
            "shromo_tv_content"
          )
          .insert({
            title,
            slug,
            description,
            media_type: mediaType,
            media_url: mediaUrl,
            thumbnail_url:
              thumbnailUrl,
            published,
            starts_at: startsAt,
            expires_at: expiresAt,
          })
          .select()
          .single();

      if (error) {
        return NextResponse.json(
          {
            error:
              "Unable to create SHROMO TV content.",
            details:
              error.message,
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        content: data,
      });
    }

    return NextResponse.json(
      {
        error:
          "Unknown SHROMO TV action.",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "SHROMO TV request failed.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   PATCH
   Publish / Unpublish
========================================================= */

export async function PATCH(
  request: NextRequest
) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const supabase =
      getSupabaseAdmin();

    const body =
      await request.json();

    const id = String(
      body?.id || ""
    ).trim();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Content ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      typeof body?.published !==
      "boolean"
    ) {
      return NextResponse.json(
        {
          error:
            "Published value is required.",
        },
        { status: 400 }
      );
    }

    const { data, error } =
      await supabase
        .from(
          "shromo_tv_content"
        )
        .update({
          published:
            body.published,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
      return NextResponse.json(
        {
          error:
            "Unable to update SHROMO TV content.",
          details:
            error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      content: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "SHROMO TV update failed.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/* =========================================================
   DELETE
========================================================= */

export async function DELETE(
  request: NextRequest
) {
  if (!isAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const supabase =
      getSupabaseAdmin();

    const body =
      await request.json();

    const id = String(
      body?.id || ""
    ).trim();

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Content ID is required.",
        },
        { status: 400 }
      );
    }

    const { data: existing, error: findError } =
      await supabase
        .from(
          "shromo_tv_content"
        )
        .select(
          "media_url, thumbnail_url"
        )
        .eq("id", id)
        .maybeSingle();

    if (findError) {
      return NextResponse.json(
        {
          error:
            "Unable to find content.",
          details:
            findError.message,
        },
        { status: 500 }
      );
    }

    const { error: deleteError } =
      await supabase
        .from(
          "shromo_tv_content"
        )
        .delete()
        .eq("id", id);

    if (deleteError) {
      return NextResponse.json(
        {
          error:
            "Unable to delete SHROMO TV content.",
          details:
            deleteError.message,
        },
        { status: 500 }
      );
    }

    if (existing) {
      const files: string[] = [];

      function getStoragePath(
        url: string | null
      ) {
        if (!url) return null;

        const marker =
          `/storage/v1/object/public/${BUCKET}/`;

        const index =
          url.indexOf(marker);

        if (index === -1) {
          return null;
        }

        return decodeURIComponent(
          url.substring(
            index + marker.length
          )
        );
      }

      const mediaPath =
        getStoragePath(
          existing.media_url
        );

      const thumbnailPath =
        getStoragePath(
          existing.thumbnail_url
        );

      if (mediaPath) {
        files.push(mediaPath);
      }

      if (thumbnailPath) {
        files.push(
          thumbnailPath
        );
      }

      if (files.length) {
        await supabase.storage
          .from(BUCKET)
          .remove(files);
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "SHROMO TV delete failed.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}
