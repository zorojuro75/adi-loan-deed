import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    role: string;
    branch_code: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      branch_code: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    branch_code: string;
  }
}