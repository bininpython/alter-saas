import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_PATHS = [
  "/admin",
  "/dashboard",
  "/training",
  "/nutrition",
  "/progress",
  "/profile",
  "/onboarding",
  "/api/admin",
  "/api/user",
  "/api/onboarding",
  "/api/gemini",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (pathname === "/api/admin/setup") return NextResponse.next();

  if (!isProtected) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if ((token as any)?.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Proibido" }, { status: 403 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/training/:path*",
    "/nutrition/:path*",
    "/progress/:path*",
    "/profile/:path*",
    "/onboarding/:path*",
    "/api/admin/:path*",
    "/api/user/:path*",
    "/api/onboarding/:path*",
    "/api/gemini/:path*",
  ],
};
