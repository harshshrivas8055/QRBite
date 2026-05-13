import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function proxy(req) {
  const { nextUrl } = req
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })
  const isLoggedIn = !!token

  const isDashboard =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/tables") ||
    nextUrl.pathname.startsWith("/menu") ||
    nextUrl.pathname.startsWith("/orders") ||
    nextUrl.pathname.startsWith("/staff") ||
    nextUrl.pathname.startsWith("/settings") ||
    nextUrl.pathname.startsWith("/stats") ||
    nextUrl.pathname.startsWith("/kitchen")

  const isKitchen = nextUrl.pathname.startsWith("/kitchen")
  const isSuperAdmin = nextUrl.pathname.startsWith("/super-admin")
  const isAuthPage =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register")

  if (isLoggedIn && isAuthPage) {
    const destination =
      token.role === "SUPER_ADMIN" ? "/super-admin" : "/dashboard"
    return NextResponse.redirect(new URL(destination, nextUrl))
  }

  if (!isLoggedIn && isDashboard) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (!isLoggedIn && isKitchen) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isSuperAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }

    if (token.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|menu|order-status|reset-password|forgot-password|verify-email).*)",
  ],
}
