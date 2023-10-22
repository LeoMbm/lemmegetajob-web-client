"use client";
import React from "react";
import { BillingPlanCard } from "./BillingPlanCard";
import { useUserData } from "@/lib/useUserData";
import { Button, Grid, GridItem, Spinner } from "@chakra-ui/react";
import { PaymentInfoCard } from "./PaymentInfoCard";

export const BillingSettings = () => {
  const { userData, error, isLoading } = useUserData();
  return (
    <div>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <BillingPlanCard data={userData} />
          <Grid templateColumns="repeat(2, 1fr)" gap={6} mt="4">
            <GridItem w="100%">
              <PaymentInfoCard />
            </GridItem>
            <GridItem w="100%" h="10" bg="blue.500" />
          </Grid>
        </>
      )}
    </div>
  );
};
