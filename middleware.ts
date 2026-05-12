import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/gallery", "/leaderboard", "/tv", "/results"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p)) {
    return NextResponse.next();
  }

  // Allow static assets and API routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("altir_session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let session: { isAdmin?: boolean; isJudge?: boolean } | null = null;

  try {
    session = JSON.parse(sessionCookie);
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin-only routes
  if (pathname.startsWith("/admin") && !session?.isAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Judge routes - allow judges and admins
  if (pathname.startsWith("/judge") && !session?.isJudge && !session?.isAdmin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
