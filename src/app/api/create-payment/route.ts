import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../libs/stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "../../../libs/db";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const session = await getServerSession({ req, ...authOptions });
    if (!session) {
      return new Response(JSON.stringify({ message: "Not Authorized" }), {
        status: 401,
      });
    }

    const user = session.token;
    const userId = user.sub;
    const line_items = await req.json();

    if (!line_items) {
      return new Response(JSON.stringify({ message: "Bad Requests" }), {
        status: 400,
      });
    }

    const plans = await prisma.plans.findUnique({
      where: {
        userId,
      },
    });

    if (
      plans &&
      plans.stripeCustomerId &&
      plans.stripePriceId === line_items.line_items.default_price
    ) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: plans.stripeCustomerId,
        return_url: `${process.env.BASE_URL}/dashboard`,
      });

      return new Response(JSON.stringify({ url: stripeSession.url }));
    }
    const customerID = plans?.stripeCustomerId as string;

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.BASE_URL}/dashboard`,
      cancel_url: `${process.env.BASE_URL}/dashboard`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer: customerID,
      line_items: [
        {
          price: line_items.line_items.default_price,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        product_name: line_items.name,
      },
    });
    return new Response(JSON.stringify({ url: stripeSession.url }));
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: error }), {
      status: 500,
    });
  }
}
