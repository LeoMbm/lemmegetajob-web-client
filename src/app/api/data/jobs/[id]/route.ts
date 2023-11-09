import { prisma } from "../../../../../libs/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function DELETE(req: NextRequest, res: NextResponse) {
  if (req.method === "DELETE") {
    try {
      const session = await getServerSession({ req, ...authOptions });
      if (!session) {
        return new Response(JSON.stringify({ message: "Not Authorized" }), {
          status: 401,
        });
      }
      const url = new URL(req.url as string);
      const id = url.pathname.split("/")[4];
      const response = await prisma.job.delete({
        where: {
          id: parseInt(id),
        },
      });
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    } catch (error) {
      console.log(error);

      return new Response(JSON.stringify({ message: error }), {
        status: 500,
      });
    }
  } else {
    return new Response(JSON.stringify({ message: "Not Allowed" }), {
      status: 405,
    });
  }
}
