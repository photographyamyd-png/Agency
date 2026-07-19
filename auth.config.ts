import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [],
  callbacks: {
    signIn({ user, account }) {
      if (account?.provider === "google-admin") {
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        return user.email?.toLowerCase() === adminEmail;
      }
      return true;
    },
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        if (
          account?.provider === "google-admin" ||
          account?.provider === "admin-credentials"
        ) {
          token.role = "admin";
          token.clientId = undefined;
        } else {
          token.role = "client";
          token.clientId = (user as { clientId?: string }).clientId;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "admin" | "client") ?? "admin";
        session.user.clientId = token.clientId as string | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
