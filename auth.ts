import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    Google({
      id: "google-admin",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "admin-credentials",
      name: "Admin Dev Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        const devPassword = process.env.DEV_ADMIN_PASSWORD;
        if (!adminEmail || !devPassword) return null;

        const email = String(credentials?.email ?? "").toLowerCase().trim();
        const password = String(credentials?.password ?? "");
        if (email !== adminEmail || password !== devPassword) return null;

        return {
          id: "admin-dev",
          email: adminEmail,
          name: "Admin",
        };
      },
    }),
    Credentials({
      id: "client-credentials",
      name: "Client Portal",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        clientId: { label: "Client ID", type: "text" },
        magicAuth: { label: "Magic Auth", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        if (!email) return null;

        if (credentials?.magicAuth === "1" && credentials?.clientId) {
          const user = await prisma.clientPortalUser.findUnique({
            where: { email: email.toLowerCase() },
          });
          if (user && user.clientId === credentials.clientId) {
            return {
              id: user.id,
              email: user.email,
              name: user.email,
              role: "client",
              clientId: user.clientId,
            };
          }
          return null;
        }

        const password = credentials?.password as string | undefined;
        if (!password) return null;

        const { authenticateClientUser } = await import("@/lib/auth/client");
        const user = await authenticateClientUser(email, password);
        if (!user) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.email,
          role: "client",
          clientId: user.clientId,
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
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
});
