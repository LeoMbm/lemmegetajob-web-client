import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import appConfig from "@/data/config";

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === "GET") {
    try {
      const response = appConfig;

      return response;
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
