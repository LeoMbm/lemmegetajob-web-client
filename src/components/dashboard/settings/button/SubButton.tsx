"use client";

import React, { useState } from "react";
import { Button, Icon, ModalOverlay, useDisclosure } from "@chakra-ui/react";

import { MdOutlineUpgrade } from "react-icons/md";
import { SubscriptionModal } from "../modal/SubscriptionModal";
import { Product } from "@/types/products";

interface SubButtonProps {
  isPro: boolean;
}
export const SubButton = ({ isPro = false }: SubButtonProps) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const OverlayTwo = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(20deg)"
    />
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayTwo />);

  const handleClick = async () => {
    setLoading(true);
    setDisabled(true);
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      console.log(json);

      window.location.href = json.url;
      setLoading(false);
      setDisabled(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleModal = () => {
    setOverlay(<OverlayTwo />);
    onOpen();
  };

  return (
    <>
      <SubscriptionModal
        overlay={overlay}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Button
        onClick={handleModal}
        isDisabled={disabled}
        isLoading={loading}
        variant="solid"
      >
        {!isPro && (
          <Icon
            as={MdOutlineUpgrade}
            className="w-6 h-6 mr-2 flex-shrink-0"
            color="white"
          />
        )}
        {isPro ? "Manage your plan" : "Upgrade"}
      </Button>
    </>
  );
};
