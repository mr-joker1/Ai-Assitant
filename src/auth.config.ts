import type { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import google from "next-auth/providers/google";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") ||
                            nextUrl.pathname.startsWith("/portfolio") ||
                            nextUrl.pathname.startsWith("/zakat") ||
                            nextUrl.pathname.startsWith("/purification") ||
                            nextUrl.pathname.startsWith("/ai-chat") ||
                            nextUrl.pathname.startsWith("/settings") ||
                            nextUrl.pathname.startsWith("/admin");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
  providers: [
    google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is implemented fully in auth.ts extending this config
        return null;
      }
    })
  ],
} satisfies NextAuthConfig;
