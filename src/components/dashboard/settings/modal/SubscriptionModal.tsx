"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  Input,
  VStack,
  HStack,
  Heading,
  Box,
  Icon,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";

import { MdCheckCircle } from "react-icons/md";
import ToastMessage from "@/components/global/alert/Toast";
import { useSession } from "next-auth/react";
import { FiCheck } from "react-icons/fi";
import { Product } from "@/types/products";
import Cookies from "js-cookie";
export const SubscriptionModal = ({ overlay, isOpen, onClose }) => {
  const [onDelete, setOnDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [nameConfirmation, setNameConfirmation] = useState("");
  const authToken = Cookies.get("rico_c_tk");
  const [data, setData] = useState<Product[]>([]);

  const fetchProduct = async () => {
    const response = await fetch("/api/subscriptions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setData(data);
      setLoading(false);
    } else {
      setStatus("error");
      setMessage("Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [isOpen]);
  
  return (
    <>
      <Modal
        isCentered
        isOpen={isOpen}
        size="5xl"
        onClose={() => {
          onClose();
          setOnDelete(false);
        }}
      >
        {overlay}
        <ModalContent>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Pricing plans={data}>
                <Text p="8" textAlign="center" color="muted">
                  VAT may be applicable depending on your location.
                </Text>
              </Pricing>
            </>
          )}

          {status === "error" && (
            <ToastMessage
              message={message}
              status={status}
              onClose={() => false}
            />
          )}
        </ModalContent>
      </Modal>
      {status === "success" && (
        <ToastMessage message={message} status={status} onClose={() => false} />
      )}
    </>
  );
};

export const Pricing = ({ children, plans }: { plans: Product[] }) => {
  const [bloading, setBLoading] = useState(false);
  const subscribeProduct = async (line_items) => {
    setBLoading(true);
    const response = await fetch("/api/create-payment", {
      method: "POST",
      body: JSON.stringify(line_items),
    });
    if (response.status === 200) {
      const json = await response.json();
      console.log(json);

      setBLoading(false);
      window.location.href = json.url;
    } else {
      setBLoading(false);
    }
  };

  return (
    <Box zIndex="2" pos="relative">
      <SimpleGrid columns={[1, null, 3]} spacing={2}>
        {plans?.map((plan) => (
          <PricingBox
            key={plan.id}
            name={plan.name}
            description={plan.description}
            price={plan.price}
          >
            <PricingFeatures>
              {plan.features.map((feature, i) =>
                feature ? (
                  <PricingFeature key={i} {...feature} />
                ) : (
                  <br key={i} />
                )
              )}
            </PricingFeatures>
            <Button
              backgroundColor="blue.500"
              variant="solid"
              isLoading={bloading}
              isDisabled={bloading}
              onClick={() => subscribeProduct(plan)}
            >
              Upgrade plan
            </Button>
          </PricingBox>
        ))}
      </SimpleGrid>

      {children}
    </Box>
  );
};

const PricingFeatures = ({ children }) => {
  return (
    <VStack
      align="stretch"
      justifyContent="stretch"
      spacing="4"
      mb="8"
      flex="1"
    >
      {children}
    </VStack>
  );
};

const PricingFeature = ({ name }) => {
  return (
    <HStack>
      <Icon as={FiCheck} color="blue.500" />
      <Text flex="1" fontSize="sm">
        {name}
      </Text>
    </HStack>
  );
};

const PricingBox = ({ name, price, description, children }) => {
  return (
    <VStack
      zIndex="2"
      bg="whiteAlpha.600"
      borderRadius="md"
      p="8"
      m="4"
      flex="1 0"
      alignItems="stretch"
      border="1px solid"
      borderColor="gray.400"
      _dark={{
        bg: "blackAlpha.300",
        borderColor: "gray.800",
      }}
    >
      <Heading as="h3" size="md" fontWeight="bold" fontSize="lg" mb="2">
        {name}
      </Heading>
      <Box color="muted">{description}</Box>
      <Box fontSize="2xl" fontWeight="bold" py="4">
        {price}
      </Box>
      <VStack align="stretch" justifyContent="stretch" spacing="4" flex="1">
        {children}
      </VStack>
    </VStack>
  );
};
