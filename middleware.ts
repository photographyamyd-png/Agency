import { auth } from "@/auth";
import { NextResponse } from "next/server";

const adminPrefixes = [
  "/dashboard",
  "/clients",
  "/metrics",
  "/invoices",
  "/settings",
  "/leads",
  "/proposals",
  "/events",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;

  const isAdminRoute = adminPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isClientRoute =
    pathname.startsWith("/client/") && !pathname.startsWith("/client/login");
  const isAdminLogin = pathname === "/admin/login";
  const isLegacyLogin = pathname === "/login";
  const isClientLogin = pathname.startsWith("/client/login");

  if (isLegacyLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }

  if (isAdminRoute && !session) {
    const loginUrl = new URL("/admin/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && session && role !== "admin") {
    return NextResponse.redirect(new URL("/client/dashboard", req.nextUrl.origin));
  }

  if (isClientRoute && !session) {
    const loginUrl = new URL("/client/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isClientRoute && session && role !== "client") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  if (isAdminLogin && session?.user?.role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  if (isClientLogin && pathname === "/client/login" && session?.user?.role === "client") {
    return NextResponse.redirect(new URL("/client/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/clients/:path*",
    "/metrics/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    "/leads/:path*",
    "/proposals/:path*",
    "/events/:path*",
    "/client/:path*",
    "/admin/login",
    "/login",
  ],
};
