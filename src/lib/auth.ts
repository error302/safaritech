import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { consumeRateLimit } from "@/lib/request-security";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@safaritech.co.ke" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const email = credentials.email.trim().toLowerCase();
          const forwarded = req.headers?.["x-forwarded-for"];
          const clientIp =
            forwarded?.split(",")[0]?.trim() ||
            req.headers?.["x-real-ip"] ||
            "unknown";
          const ipLimit = await consumeRateLimit(
            "admin-login-ip",
            clientIp,
            20,
            15 * 60_000
          );
          const accountLimit = await consumeRateLimit(
            "admin-login-account",
            email,
            50,
            15 * 60_000
          );
          if (!ipLimit.allowed || !accountLimit.allowed) return null;
          const user = await db.user.findUnique({
            where: { email },
          });

          if (
            user?.role === "ADMIN" &&
            user.password &&
            verifyPassword(credentials.password, user.password)
          ) {
            return {
              id: user.id,
              email: user.email,
              name: user.name ?? undefined,
              role: user.role,
            };
          }

          return null;
        } catch (err) {
          console.error("[NextAuth authorize]", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
  pages: {
    signIn: "/api/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role === "ADMIN" ? "ADMIN" : "CUSTOMER";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
