import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  createConfirmationToken,
  generateUniqueToken,
  sendEmail,
} from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { email, first_name, last_name, password, phone, position } =
    await req.json();
  console.log(email, first_name, last_name, password, phone, position);

  if (!first_name || !first_name || !email || !password || !phone) {
    return new NextResponse(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });
  }

  if (password.length < 6) {
    return new NextResponse(
      JSON.stringify({ error: "Password must be at least 6 characters long" }),
      { status: 400 }
    );
  }

  const exist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (exist) {
    return new NextResponse(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const uniqueToken = createConfirmationToken();
  const confirmationPath = `/confirm?token=${uniqueToken.token}`;
  const host = req.nextUrl.host;
  const url_confirmation = `http://${host}${confirmationPath}`;
  const user = await prisma.user.create({
    data: {
      email,
      first_name,
      last_name,
      phone,
      password: hashedPassword,
      current_position: position,
      confirmationToken: uniqueToken.token,
      create_time: uniqueToken.createdAt,
    },
  });
  await sendEmail(email, first_name, url_confirmation);
  return new NextResponse(JSON.stringify({ user }), { status: 200 });
}
