import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/options";

export async function GET(req: NextRequest) {
  // Get user
  const session = await getServerSession({ req, ...authOptions });
  if (!session) {
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
    },
  });
  // Remove password from user object
  delete user.password;
  // Return user

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
