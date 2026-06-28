import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect all dashboard, settings, portfolio, zakat, purification, chat, and admin routes
  matcher: [
    "/dashboard/:path*",
    "/portfolio/:path*",
    "/zakat/:path*",
    "/purification/:path*",
    "/ai-chat/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
