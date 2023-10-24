import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/db";

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  if (!items) {
    return 0;
  }
  return 1400;
};

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
    const line_items = await req.json();
    console.log("[SERVER]", line_items.name);

    if (!line_items) {
      return new Response(JSON.stringify({ message: "Bad Requests" }), {
        status: 400,
      });
    }

    console.log("[ITEM ID]", line_items);
    const plans = await prisma.plans.findUnique({
      where: {
        userId,
      },
    });

    console.log("[BILLING]", line_items.line_items.default_price);
    console.log("[PLANS]", plans?.stripePriceId);
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
          price_data: {
            currency: "EUR",
            product_data: {
              name: line_items.name,
              description: line_items.description || "Premium Rico",
            },
            unit_amount: line_items.price * 100,
            recurring: {
              interval: "month",
            },
          },
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
