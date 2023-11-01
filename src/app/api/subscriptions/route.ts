import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { parseProducts } from "@/lib/utils";
import jwt from "jsonwebtoken";
export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === "GET") {
    try {
      //   const session = await getServerSession({ req, ...authOptions });
      //   if (!session) {
      //     const headers = req.headers.get("Authorization");
      //     const beareToken = headers?.split(" ")[1];
      //     if (beareToken) {
      //       const token = jwt.verify(
      //         beareToken,
      //         process.env.NEXTAUTH_SECRET as string
      //       );

      //       const products = await stripe.products.list();
      //       const response = await parseProducts(products.data);

      //       console.log(response);
      //       return new Response(JSON.stringify(response), {
      //         status: 200,
      //       });
      //     }
      //     return new Response(JSON.stringify({ message: "Not Authorized" }), {
      //       status: 401,
      //     });
      //   }
      const products = await stripe.products.list();
      const response = await parseProducts(products.data);
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
