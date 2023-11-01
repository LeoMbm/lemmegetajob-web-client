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
  let user_id;


  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    if (!session?.metadata?.userId) {
      return new Response(JSON.stringify({ message: "No userId" }), {
        status: 400,
      });
    }
    user_id = session.metadata.userId;

    await prisma.plans.update({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
      data: {
        userId: user_id,
        stripSubscriptionId: subscription.items.data[0].subscription,
        stripeCustomerId: subscription.customer as string,
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const product = await prisma.products.findFirst({
      where: {
        productId: subscription.items.data[0].plan.product as string,
      },
    });

    const plans = await prisma.plans.update({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
      data: {
        dailyExecutionLimit: product?.dailyExecutionLimit,
        hasIntegration: product?.hasIntegration,
        maxRooms: product?.maxRooms,
        monthlyExecutionLimit: product?.monthlyExecutionLimit,
        name: product?.name,
        isUpgradable: product?.isUpgradable,
        monthlyPrice: product?.price,
        stripePriceId: subscription.items.data[0].price.id,
        stripSubscriptionId: subscription.items.data[0].subscription,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        started_at: new Date(subscription.current_period_start * 1000),
      },
    });
    const userId = plans?.userId as string;

    const room = await prisma.rooms.findFirst({
      where: {
        userId,
      },
    });
    if (!room) {
      return new Response(JSON.stringify(null), {
        status: 400,
      });
    }
    await prisma.rooms.update({
      where: {
        id: room.id,
      },
      data: {
        monthlyExecutionLimit: product?.monthlyExecutionLimit,
        dailyExecutionLimit: product?.dailyExecutionLimit,
      },
    });
  }
  if (event.type === "customer.subscription.updated") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    // If user cancel but plan work until end period
    if (subscription.cancel_at_period_end) {
      // console.log("[CANCEL_SUB]", subscription.items);
      // TODO: ADD CANCELLATION
      await prisma.plans.update({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
        data: {
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
          stripSubscriptionId: null,
          hasIntegration: false,
          maxRooms: 1,
          isUpgradable: true,
          monthlyExecutionLimit: 7200,
          dailyExecutionLimit: 3600,
          monthlyPrice: 0,
          name: "Free plan",
        },
      });
    }
    // If user change plan
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = await stripe.subscriptions.retrieve(
      session.id as string
    );

    const plans = await prisma.plans.update({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
      data: {
        stripePriceId: null,
        stripeCurrentPeriodEnd: null,
        stripSubscriptionId: null,
        hasIntegration: false,
        maxRooms: 1,
        isUpgradable: true,
        monthlyExecutionLimit: 7200,
        dailyExecutionLimit: 3600,
        monthlyPrice: 0,
        name: "Free plan",
      },
    });
    const userId = plans?.userId as string;

    const room = await prisma.rooms.findFirst({
      where: {
        userId,
      },
    });
    if (!room) {
      return new Response(JSON.stringify(null), {
        status: 400,
      });
    }
    await prisma.rooms.update({
      where: {
        id: room.id,
      },
      data: {
        monthlyExecutionLimit: 7200,
        dailyExecutionLimit: 3600,
      },
    });
  }

  return new Response(JSON.stringify({ message: "OK" }), {
    status: 200,
  });
}
