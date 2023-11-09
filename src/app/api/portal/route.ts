import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../libs/stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "../../../libs/db";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return new Response(JSON.stringify({ message: "Not Authorized" }), {
        status: 401,
      });
    }

    const user = session?.token;
    const userId = user.sub;

    const plans = await prisma.plans.findUnique({
      where: {
        userId,
      },
    });

    if (plans && plans.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: plans.stripeCustomerId,
        return_url: `${process.env.BASE_URL}/dashboard`,
      });

      return new Response(JSON.stringify({ url: stripeSession.url }));
    }

    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return new Response(JSON.stringify({ message: "Not Authorized" }), {
        status: 401,
      });
    }

    const user = session?.token;
    const userId = user.sub;

    const plans = await prisma.plans.findUnique({
      where: {
        userId,
      },
    });

    if (plans && plans.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: plans.stripeCustomerId,
        return_url: `${process.env.BASE_URL}/dashboard`,
      });

      return new Response(JSON.stringify({ url: stripeSession.url }));
    }

    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
