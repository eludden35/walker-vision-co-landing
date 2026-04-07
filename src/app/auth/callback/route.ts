import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/utils/supabase/env";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/admin";
  const origin = url.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth`);
  }

  let supabaseUrl: string;
  let supabaseKey: string;
  try {
    supabaseUrl = getSupabaseUrl();
    supabaseKey = getSupabasePublishableKey();
  } catch {
    return NextResponse.redirect(`${origin}/admin/login?error=auth`);
  }

  const response = NextResponse.redirect(`${origin}${next}`);

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth`);
  }

  return response;
}
