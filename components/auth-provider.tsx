"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}


// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Allow authentication paths
  const isAuthPath = path === "/login";

  if (!token && !isAuthPath) {
    // Redirect to login if user is not logged in and trying to access a protected route
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if user is already logged in and trying to access login page
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Add routes to be protected
export const config = {
  matcher: ["/", "/dashboard/:path*", "/profile/:path*", "/login"],
};