import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === "GET") {
    const bearerToken = req.headers.get("Authorization")?.split(" ")[1];
    const config = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    
    
    try {
      const session = await getServerSession({ req, ...authOptions });
      if (!session) {
        return new Response(JSON.stringify({ message: "Not Authorized" }), {
          status: 401,
        });
      
      }
      const url = new URL(req.url);

      const page = parseInt(url.searchParams.get("page") || "1", 10);
      const perPage = parseInt(url.searchParams.get("perPage") || "1000", 10);

      const skip = (page - 1) * perPage;

      const response = await prisma.job.findMany({
        where: {
          userId: session.token.sub,
        },
        skip,
        take: perPage, // Limite le nombre d'éléments retournés
      });
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    } catch (error) {
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
