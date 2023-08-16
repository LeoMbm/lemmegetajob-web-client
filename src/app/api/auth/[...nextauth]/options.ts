import NextAuth from "next-auth/next";
import { User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()
export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: "Email", type: "email", placeholder: "leo@mail.com" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if (!credentials || !credentials.email || !credentials.password) {
                throw new Error('Missing credentials')
            }
            
            const user = await prisma.user.findUnique({
                where: {
                    email: credentials.email
                }
            })
            if (!user) {
                throw new Error('Invalid credentials')
            }
            const passwordMatch = await bcrypt.compare(credentials.password, user.password)
            if (!passwordMatch) {
                throw new Error('Invalid credentials')
            }
            return user
          }
        })
      ],
      secret: process.env.NEXTAUTH_SECRET,
      session: {
        strategy: "jwt",
      },
      debug: process.env.NODE_ENV === "development",
      pages : {
        signIn: "/signin",
        signOut: "/signout",
      },
      callbacks: {
        session: ({ session, token }) => {
          return {
            ...session,
            user: {
              ...session.user,
              id: token.id,
              randomKey: token.randomKey,
            },
          };
        },
        jwt: ({ token, user }) => {
          if (user) {
            const u = user as unknown as any;
            return {
              ...token,
              id: u.id,
              randomKey: u.randomKey,
            };
          }
          return token;
        },
      },
};

export default NextAuth(authOptions)