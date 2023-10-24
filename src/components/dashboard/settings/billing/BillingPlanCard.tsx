"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Button,
  Box,
  Flex,
  Icon,
  ListItem,
  UnorderedList,
  useDisclosure,
  ModalOverlay,
} from "@chakra-ui/react";

import { TbStarsFilled } from "react-icons/tb";
import { SubButton } from "../button/SubButton";

export const BillingPlanCard = async ({ data }) => {
  const [user, setUser] = useState(data);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <Stack>
          <CardBody>
            <Heading size="md">
              <Icon as={TbStarsFilled} className="w-5 h-5 mr-2 flex-shrink-0" />
              Current Plan: {user.plans[0].name}
            </Heading>
            <Text color="gray.500" fontSize="sm" py="2">
              {user.plans[0].monthlyPrice}€/month
            </Text>
            <Flex direction="row" align="center">
              <UnorderedList py="2">
                <ListItem>
                  {" "}
                  Execution time: {user.plans[0].monthlyExecutionLimit / 3600}
                  h/month
                </ListItem>
                <ListItem>Max room: {user.plans[0].maxRooms}</ListItem>
              </UnorderedList>
            </Flex>
            <SubButton isPro={user.isPro} />
          </CardBody>
          {/* 
          <CardFooter>
            <Button variant="solid" colorScheme="blue">
              Buy Latte
            </Button>
          </CardFooter> */}
        </Stack>
      </Card>
    </>
  );
};
