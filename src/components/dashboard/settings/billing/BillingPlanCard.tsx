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
} from "@chakra-ui/react";

import { TbStarsFilled } from "react-icons/tb";

export const BillingPlanCard = ({ data }) => {
  console.log(data);
  const [user, setUser] = useState(data?.user);
  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        {/* <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
          alt="Caffe Latte"
        /> */}

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
                <ListItem>Max room: 1</ListItem>
              </UnorderedList>
            </Flex>
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
