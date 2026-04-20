import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ROUTES, PUBLIC_ROUTES } from "./constants/routes"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("auth_token")?.value

  // Check if the current path is a public route (login, register)
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // 1. If user is logged in and trying to access a public route (login/register)
  // Redirect them to home
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url))
  }

  // 2. If user is NOT logged in and trying to access a protected route
  // Redirect them to login
  if (!token && !isPublicRoute) {
    // Also skip internal next.js paths, static files etc.
    const isInternalPath = 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.includes('/favicon.ico') ||
      pathname.includes('.') // for .png, .jpg etc.

    if (!isInternalPath) {
      return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
