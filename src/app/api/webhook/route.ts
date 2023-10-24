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

  const subId = session.subscription || session.id;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(subId as string);
    console.log("[METADATA-CHECKOUT]", [session?.metadata]);

    if (!session?.metadata?.userId) {
      return new Response(JSON.stringify({ message: "No userId" }), {
        status: 400,
      });
    }
    const product_name = session?.metadata?.product_name;
    const monthlyPrice = (subscription.items.data[0].price.unit_amount /
      100) as number;
    let monthlyExecutionLimit = 108000;
    let dailyExecutionLimit = 3600;
    let upgradable = true;
    let maxRooms = 1;
    let hasIntegrations = false;
    switch (product_name) {
      case "Seeker Plan":
        monthlyExecutionLimit = 216000;
        dailyExecutionLimit = 7200;
        maxRooms = 2;
        hasIntegrations = true;
        break;
      case "Hunter Plan":
        monthlyExecutionLimit = 360000;
        dailyExecutionLimit = 18000;
        upgradable = false;
        maxRooms = 5;
        hasIntegrations = true;
        break;

      default:
        break;
    }
    await prisma.plans.update({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
      data: {
        userId: session.metadata.userId,
        stripSubscriptionId: subscription.id as string,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        name: session.metadata.product_name,
        isUpgradable: upgradable,
        monthlyPrice,
        monthlyExecutionLimit,
        dailyExecutionLimit,
        maxRooms,
        hasIntegration: hasIntegrations,
      },
    });
  }

  // if (event.type === "customer.subscription.updated") {
  //   const subscription = await stripe.subscriptions.retrieve(subId as string);
  //   if (subscription.cancel_at_period_end) {
  //     console.log("[CANCEL_SUB]", subscription.items);
  //     // TODO: ADD CANCELLATION
  //     await prisma.plans.update({
  //       where: {
  //         stripeCustomerId: subscription.customer,
  //       },
  //       data: {
  //         stripePriceId: null,
  //         stripeCurrentPeriodEnd: null,
  //         stripSubscriptionId: null,
  //         hasIntegration: false,
  //         maxRooms: 1,
  //         isUpgradable: true,
  //         monthlyExecutionLimit: 7200,
  //         dailyExecutionLimit: 3600,
  //         monthlyPrice: 0,
  //         name: "Free plan",
  //       },
  //     });
  // } else {
  //   console.log("[REACTIVATE_SUB]", subscription.items.data);
  //   console.log("[WEBHOOK]", subscription);
  //   const monthlyPrice = (subscription.items.data[0].price.unit_amount /
  //     100) as number;
  //   await prisma.plans.update({
  //     where: {
  //       stripeCustomerId: subscription.customer as string,
  //     },
  //     data: {
  //       stripSubscriptionId: subscription.id as string,
  //       stripePriceId: subscription.items.data[0].price.id,
  //       stripeCurrentPeriodEnd: new Date(
  //         subscription.current_period_end * 1000
  //       ),
  //       monthlyPrice,
  //       name: subscription.metadata?.product_name,
  //     },
  //   });
  // }
  // }
  // await prisma.plans.update({
  //   where: {
  //     stripeCustomerId: subscription.customer as string,
  //   },
  //   data: {
  //     stripeCurrentPeriodEnd: new Date(
  //       subscription.current_period_end * 1000
  //     ),
  //     stripePriceId: subscription.items.data[0].price.id,
  //     stripSubscriptionId: subscription.id as string,
  //   },
  // });

  return new Response(JSON.stringify({ message: "OK" }), {
    status: 200,
  });
}
