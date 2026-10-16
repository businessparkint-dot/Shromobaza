
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const code = requestUrl.searchParams.get("code");
  const authError = requestUrl.searchParams.get("error");

  // OAuth provider returned an error.
  if (authError) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(authError)}`,
        origin,
      ),
    );
  }

  // Authorization code is required for the PKCE callback.
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_code_missing", origin),
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
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );

  // Exchange the callback code for a Supabase session.
  const { error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    console.error(
      "Auth callback session exchange failed:",
      exchangeError.message,
    );

    return NextResponse.redirect(
      new URL("/login?error=oauth_session_failed", origin),
    );
  }

  // Confirm the authenticated user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error(
      "Auth callback user lookup failed:",
      userError?.message,
    );

    return NextResponse.redirect(
      new URL("/login?error=oauth_user_missing", origin),
    );
  }

  // Look up the user's existing master profile.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, profile_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Auth callback profile lookup failed:",
      profileError.message,
    );

    return NextResponse.redirect(
      new URL("/complete-profile?error=profile_check_failed", origin),
    );
  }

  // Existing and completed profile.
  if (profile && profile.profile_completed === true) {
    return NextResponse.redirect(new URL("/account", origin));
  }

  // New user or profile that still needs completion.
  return NextResponse.redirect(
    new URL("/complete-profile", origin),
  );
}