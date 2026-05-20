import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  // Bypass auth checks for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Determine the requested locale, fallback to default
  const segments = pathname.split("/");
  const locale = routing.locales.includes(segments[1] as any) 
    ? segments[1] 
    : routing.defaultLocale;
  
  const isLoginPage = pathname.includes("/login");

  // Protect dashboard routes - redirect unauthenticated to login
  if (!token && !isLoginPage && pathname !== "/login") {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Redirect authenticated users away from the login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  // Pass remaining requests to next-intl for localization
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(am|en)/:path*"],
};
