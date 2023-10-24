import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";
import { checkPlans } from "@/lib/subscription";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function GET(req: NextRequest) {
  // Get user
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
    const headers = req.headers.get("Authorization");
    const beareToken = headers?.split(" ")[1];
    if (beareToken) {
      const token = jwt.verify(
        beareToken,
        process.env.NEXTAUTH_SECRET as string
      );

      const user = await prisma.user.findUnique({
        where: {
          id: token.sub as string,
        },
        include: {
          rooms: true,
          plans: true,
        },
      });
      if (user) {
        const isPro = await checkPlans(token.sub as string);
        user.isPro = isPro;
        delete user.password;
        return new NextResponse(JSON.stringify(user), {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    }
    return new NextResponse(JSON.stringify({ message: "Not Authorized" }), {
      status: 401,
    });
  }
  const userId = session.token.sub;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      rooms: true,
      plans: true,
    },
  });
  const isPro = await checkPlans(userId);
  user.isPro = isPro;
  delete user.password;

  return new NextResponse(JSON.stringify({ user }), { status: 200 });
}

export async function PUT(req: NextRequest) {
  // Get user
  const session = await getServerSession({ req, ...authOptions });
  const body = await req.json();
  if (!body) {
    return new NextResponse(JSON.stringify({ message: "BAD_REQUEST" }), {
      status: 400,
    });
  }
  delete body.password;
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Not Authorized" }), {
      status: 401,
    });
  }
  const userId = session.token.sub;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...body,
    },
  });
  return new NextResponse(JSON.stringify({ user }), { status: 200 });
}
