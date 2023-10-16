"use client";
import React, { useState } from "react";
import appConfig from "@/data/config";
import { Integration } from "@/types/integration";
import { Button } from "flowbite-react";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";
import { Badge, Icon, IconButton } from "@chakra-ui/react";

export const IntegrationSettings = () => {
  const [integrations, SetIntegrations] = useState<Integration[]>(
    appConfig.integration
  );

  return (
    <div className="mt-4">
      <div className="text-black mb-2">
        <h3>Connect Rico with your app:</h3>
      </div>

      <ButtonGroup className="flex-col" color="blue">
        {integrations.map((integration, i) => (
          <Button className="mt-4 rounded-md w-52 flex items-center" disabled>
            {integration.icon ? (
              <Icon
                as={integration.icon}
                className="w-5 h-5 mr-2 flex-shrink-0"
              />
            ) : null}
            {integration.name}
            <Badge ml="2" colorScheme="gray">
              Soon
            </Badge>
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};
