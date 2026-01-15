import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const path = request.nextUrl.pathname.replace(/\/$/, "");

  let userRole: string | null = null;
  if (sessionCookie) {
    try {

      const sessionData = JSON.parse(
        Buffer.from(sessionCookie.split(".")[1], "base64").toString()
      );
      userRole = sessionData.role || sessionData.user?.role;
    } catch  {
      // If parsing fails, treat as unauthenticated
      userRole = null;
    }
  }

  // Authenticated users cannot visit /login or /register
  if (sessionCookie && ["/login", "/register"].includes(path)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated users cannot visit /profile or /dashboard
  if (
    !sessionCookie &&
    (path === "/profile" || path.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Users (non-admin) cannot view anything starting with /dashboard
  if (sessionCookie && userRole === "user" && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/profile"],
};
