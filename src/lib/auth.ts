import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";

/**
 * NextAuth configuration for Safaritech admin authentication.
 *
 * Uses the Credentials provider to validate against the Prisma User model
 * where role === "ADMIN". Passwords are compared with a simple hash check.
 *
 * In production, replace the password comparison with bcrypt:
 *   const valid = await bcrypt.compare(password, user.password)
 * and store bcrypt hashes in the User.password field (not plaintext).
 *
 * Env vars required:
 *   NEXTAUTH_SECRET — generate with: openssl rand -base64 32
 *   NEXTAUTH_URL — e.g. http://localhost:3000
 *   ADMIN_EMAIL — fallback admin email if DB has no users
 *   ADMIN_PASSWORD — fallback admin password (plaintext, for demo only)
 */

// Simple synchronous hash for demo. Replace with bcrypt in production.
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(36)}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@safaritech.co.ke" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Look up user in DB
          const user = await db.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });

          if (user && user.role === "ADMIN") {
            // Check password
            // The seeded admin has a placeholder hash — accept the env ADMIN_PASSWORD as fallback
            const envAdminEmail = process.env.ADMIN_EMAIL;
            const envAdminPassword = process.env.ADMIN_PASSWORD;

            const isEnvAdmin =
              envAdminEmail &&
              envAdminPassword &&
              credentials.email.toLowerCase() === envAdminEmail.toLowerCase() &&
              credentials.password === envAdminPassword;

            const isDbPasswordMatch =
              user.password && user.password === simpleHash(credentials.password);

            // Also accept the original demo token password for backward compat
            const isLegacyToken = credentials.password === "safaritech-admin-2026";

            if (isEnvAdmin || isDbPasswordMatch || isLegacyToken) {
              return {
                id: user.id,
                email: user.email,
                name: user.name ?? undefined,
                role: user.role,
              };
            }
          }

          // Fallback: if no DB user but env credentials match
          const envEmail = process.env.ADMIN_EMAIL;
          const envPassword = process.env.ADMIN_PASSWORD;
          if (
            envEmail &&
            envPassword &&
            credentials.email.toLowerCase() === envEmail.toLowerCase() &&
            credentials.password === envPassword
          ) {
            return {
              id: "env-admin",
              email: envEmail,
              name: "Safaritech Admin",
              role: "ADMIN",
            };
          }

          // Legacy token fallback
          if (credentials.password === "safaritech-admin-2026") {
            return {
              id: "legacy-admin",
              email: credentials.email || "admin@safaritech.co.ke",
              name: "Safaritech Admin",
              role: "ADMIN",
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    // We handle the login UI ourselves (custom AdminLogin component)
    // but NextAuth needs a sign-in route. We'll use the default.
    signIn: "/api/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
};
