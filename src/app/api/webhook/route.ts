import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/lib/db";
import Stripe from "stripe";
import { headers } from "next/headers";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 400,
    });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.userId) {
      return new Response(JSON.stringify({ message: "No userId" }), {
        status: 400,
      });
    }

    await prisma.plans.create({
      data: {
        userId: session.metadata.userId,
        stripSubscriptionId: subscription.id as string,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.plans.update({
      where: {
        stripSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new Response(JSON.stringify({ message: "OK" }), {
    status: 200,
  });
}
