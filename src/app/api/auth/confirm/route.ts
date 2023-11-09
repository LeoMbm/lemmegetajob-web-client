import { prisma } from "../../../../libs/db";
import { checkConfirmationToken } from "../../../../libs/utils";
import { NextResponse, NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  let params = req.nextUrl.searchParams;
  let token = params.get("token");
  const user = await prisma.user.findFirst({
    where: {
      confirmationToken: token,
    },
  });

  if (!user) {
    return new Response(JSON.stringify({ message: "Token not valid" }), {
      status: 400,
    });
  }

  if (user.emailVerified) {
    return new Response(JSON.stringify({ message: "Token expirated" }), {
      status: 400,
    });
  }
  const check = checkConfirmationToken(user);

  if (!check) {
    return new Response(JSON.stringify({ message: "Token expirated" }), {
      status: 400,
    });
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      emailVerified: true,
    },
  });

  return new Response(JSON.stringify({ message: "Account confirmed" }), {
    status: 200,
  });
}
