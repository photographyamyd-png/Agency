import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "client";
      clientId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "admin" | "client";
    clientId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "admin" | "client";
    clientId?: string;
  }
}
