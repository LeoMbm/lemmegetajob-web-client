import NextAuth from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../../libs/db";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getStoredToken,
  removeToken,
  storeToken,
} from "../../../../libs/cookie";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "leo@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          throw new Error("Invalid credentials");
        }
        if (!user.emailVerified) {
          throw new Error("You need to confirm your account");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {

    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  callbacks: {
    async session(session: any) {
      // Find a way to save the token for avoid regenerate it every time
      if (!session.backendToken) {
        const storedToken = getStoredToken();
        if (storedToken) {
          session.backendToken = storedToken;
        } else {
          // console.log("[AUTH OPTIONS]", session);
          const expiresIn = 3600;
          session.backendToken = jwt.sign(
            { sub: session.token.sub, email: session.token.email },
            process.env.NEXTAUTH_SECRET as string,
            { expiresIn: expiresIn }
          );
          storeToken(session.backendToken, expiresIn);
        }
      }
      return session;
    },
    async jwt({ token }: any) {
      return token;
    }
  },
};

export default NextAuth(authOptions);
