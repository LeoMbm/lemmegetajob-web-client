import { prisma } from "@/lib/db";

const DAY_IN_MILLISECONDS = 86_400_000;

export const checkPlans = async (userId) => {
  const userPlans = await prisma.plans.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripSubscriptionId: true,
      stripePriceId: true,
    },
  });

  if (!userPlans) {
    return false;
  }
  //   console.log("[PERIOD END]", userPlans.stripeCurrentPeriodEnd);
  //   console.log(
  //     "[PERIOD END GETIME]",
  //     userPlans.stripeCurrentPeriodEnd?.getTime()
  //   );
  const isValid =
    userPlans.stripePriceId &&
    userPlans.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MILLISECONDS >
      Date.now();

  return !!isValid;
};
