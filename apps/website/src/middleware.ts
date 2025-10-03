import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { auth, type Session } from "@/lib/auth";
import { routing } from "./i18n/routing";

const ADMIN_PATHNAMES = ["/policies", "/master", "/users", "/settings"];
const AUTHENTICATED_PATHNAMES = ["/dashboard"];
const PUBLIC_PATHNAMES = ["/login", "/register"];

/**
 * Remove locale prefix from pathname for matching against protected routes
 * e.g., "/en/dashboard" -> "/dashboard"
 */
const stripLocaleFromPathname = (pathname: string): string => {
	const locale = routing.locales.find((loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`);

	if (!locale) return pathname;
	return pathname === `/${locale}` ? "/" : pathname.slice(locale.length + 1);
};

/**
 * Check if pathname matches any of the protected routes
 */
const matchesPath = (pathname: string, paths: string[]): boolean => paths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

/**
 * Create redirect URL with locale prefix
 */
const createRedirectUrl = (request: NextRequest, targetPath: string): URL => {
	const url = request.nextUrl.clone();
	const currentLocale = routing.locales.find((loc) => url.pathname.startsWith(`/${loc}/`) || url.pathname === `/${loc}`);

	const localePrefix = currentLocale && currentLocale !== "en" ? `/${currentLocale}` : "";
	url.pathname = `${localePrefix}${targetPath}`;

	return url;
};

/**
 * Get user session from request
 */
const getSession = async (): Promise<Session> =>
	(await auth.api.getSession({
		headers: await headers(),
	})) as Session;

/**
 * Check if user has admin role
 */
const isAdmin = (session: Session): boolean => session?.user?.role === "admin";

/**
 * Handle redirect response
 */
const redirect = (request: NextRequest, targetPath: string): NextResponse => NextResponse.redirect(createRedirectUrl(request, targetPath));

export default async function middleware(request: NextRequest) {
	const pathnameWithoutLocale = stripLocaleFromPathname(request.nextUrl.pathname);
	const session = await getSession();

	const isPublicRoute = matchesPath(pathnameWithoutLocale, PUBLIC_PATHNAMES);
	const isAdminRoute = matchesPath(pathnameWithoutLocale, ADMIN_PATHNAMES);
	const isPrivateRoute = matchesPath(pathnameWithoutLocale, AUTHENTICATED_PATHNAMES);

	// Redirect authenticated users away from public routes
	if (session && isPublicRoute) {
		return redirect(request, "/dashboard");
	}

	// Redirect unauthenticated users from protected routes
	if (!session && (isAdminRoute || isPrivateRoute)) {
		return redirect(request, "/login");
	}

	// Redirect non-admin users from admin routes
	if (session && isAdminRoute && !isAdmin(session)) {
		return redirect(request, "/dashboard");
	}

	// Apply i18n middleware for locale handling
	const intlMiddleware = createMiddleware(routing);
	return intlMiddleware(request);
}

export const config = {
	matcher: "/((?!api|trpc|rpc|_next|_vercel|.*\\..*).*)",
	runtime: "nodejs",
};
