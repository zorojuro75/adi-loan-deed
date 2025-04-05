import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { supabase } from "@/lib/supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Query the custom users table
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("username", credentials.username)
            .eq("password", credentials.password)
            .single();

          if (error || !data) {
            return null;
          }

          // Return user data for session
          return {
            id: data.id.toString(),
            name: data.username,
            role: data.role || "user",
            branch_code: data.branch_code || "",
            // You can add more user data here if needed
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user data to the JWT token
        token.id = user.id;
        token.role = user.role;
        token.branch_code = user.branch_code;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // Add the user data from the token to the session
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.branch_code = token.branch_code as string;
      }
      return session;
    },
  },
};
