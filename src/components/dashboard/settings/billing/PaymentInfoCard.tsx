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
  Link,
} from "@chakra-ui/react";

import { TbStarsFilled } from "react-icons/tb";
import { AddIcon } from "@chakra-ui/icons";
import { loadStripe } from "@stripe/stripe-js";

export const PaymentInfoCard = ({ data }) => {
  const [user, setUser] = useState(data);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [billingUrl, setBillingUrl] = useState("");

  const handleBillingPortal = async () => {
    setLoading(true);
    setDisabled(true);
    const response = await fetch("/api/portal", {
      method: "POST",
    });
    if (response.status === 200) {
      const json = await response.json();
      setBillingUrl(json.url);
      window.location.href = json.url;
      setLoading(false);
      setDisabled(false);
    } else {
      setLoading(false);
      setDisabled(false);
    }
  };

  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <CardBody>
          <Flex direction="row" align="center" justify="space-between">
            <Text color="white" fontSize="sm" py="2" fontWeight="semibold">
              Payment Information
            </Text>
            <Button
              color="white"
              fontSize="sm"
              py="2"
              _hover={{
                cursor: "pointer",
                textDecoration: "underline",
                color: "blue.500",
              }}
              onClick={handleBillingPortal}
              isLoading={loading}
              isDisabled={disabled}
            >
              <Icon as={AddIcon} className="w-4 h-4 mr-2 flex-shrink-0" />
              Update
            </Button>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
};
