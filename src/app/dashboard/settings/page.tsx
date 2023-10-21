import { FormUpdate } from "@/components/dashboard/settings/FormUpdate";
import { IntegrationSettings } from "@/components/dashboard/settings/IntegrationSettings";
import PremiumSettings from "@/components/dashboard/settings/PremiumSettings";
import { RoomSettings } from "@/components/dashboard/settings/RoomSettings";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
export default function Page() {
  return (
    <div className="h-full bg-gray-100 p-4">
      <div className="w-full">
        <Tabs
          size="md"
          variant="enclosed-colored"
          colorScheme="blue"
          color="black"
        >
          <TabList>
            <Tab>User Settings</Tab>
            <Tab>Rooms</Tab>
            <Tab>Integration</Tab>
            <Tab>Billing</Tab>
            <Tab isDisabled>Beta</Tab>
            <Tab isDisabled>Beta</Tab>
            <Tab isDisabled>Beta</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <FormUpdate />
            </TabPanel>
            <TabPanel>
              <RoomSettings />
            </TabPanel>
            <TabPanel>
              <IntegrationSettings />
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/* <div
          className="settings-container"
          style={{ maxHeight: "850px", overflowY: "auto" }}
        >
          <FormUpdate />
          <div className="w-full border-t border-gray-200"></div>
          <RoomSettings />
          <div className="w-full border-t border-gray-200"></div>
          <PremiumSettings />
          <div className="w-full border-t border-gray-200"></div>
          <IntegrationSettings />
        </div> */}
      </div>
    </div>
  );
}
