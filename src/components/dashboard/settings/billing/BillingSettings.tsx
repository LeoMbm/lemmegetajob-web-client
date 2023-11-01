"use client";
import React from "react";
import { BillingPlanCard } from "./BillingPlanCard";
import { useUserData } from "@/lib/useUserData";
import { Button, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { PaymentInfoCard } from "./PaymentInfoCard";
import { checkPlans } from "@/lib/subscription";
import { usePlanData } from "@/lib/usePlanData";

export const BillingSettings = ({ user }) => {
  return (
    <div>
      <>
        <BillingPlanCard data={user} />
        <Grid templateColumns="repeat(2, 1fr)" gap={6} mt="4">
          <GridItem w="100%">
            <PaymentInfoCard data={user} />
          </GridItem>
          <GridItem w="100%" h="10" bg="blue.500" />
        </Grid>
      </>
    </div>
  );
};
