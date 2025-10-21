import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // const sessionCookie = getSessionCookie(request);

  // const path = request.nextUrl.pathname.replace("//$/", "");

  // if (sessionCookie && ["/login", "/register"].includes(path)) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // if (!sessionCookie && path === "/dashboard") {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard"],
};
