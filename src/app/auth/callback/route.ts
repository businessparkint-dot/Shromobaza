import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/login?error=oauth_code_missing",
        requestUrl.origin,
      ),
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              },
            );
          } catch {
            // Ignore cookie errors.
          }
        },
      },
    },
  );

  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(
      "OAuth callback session exchange error:",
      error.message,
    );

    return NextResponse.redirect(
      new URL(
        `/login?error=oauth_session_failed`,
        requestUrl.origin,
      ),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error(
      "OAuth callback: session created but user not found.",
    );

    return NextResponse.redirect(
      new URL(
        "/login?error=oauth_user_missing",
        requestUrl.origin,
      ),
    );
  }

  return NextResponse.redirect(
    new URL("/complete-profile", requestUrl.origin),
  );
}