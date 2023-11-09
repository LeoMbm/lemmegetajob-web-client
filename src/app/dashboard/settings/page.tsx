import { FormUpdate } from "../../../components/dashboard/settings/FormUpdate";
import { IntegrationSettings } from "../../../components/dashboard/settings/IntegrationSettings";
import { RoomSettings } from "../../../components/dashboard/settings/RoomSettings";
import { BillingSettings } from "../../../components/dashboard/settings/billing/BillingSettings";
import { fetchServerSideUser } from "../../../libs/fetchServerSideUser";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
export const dynamic = "force-dynamic";
export default async function Page() {
  const user = await fetchServerSideUser();
  return (
    <div className="h-full bg-gray-100 p-2 md:p-4">
      <Tabs
        isFitted
        size="md"
        variant="enclosed-colored"
        colorScheme="blue"
        color="black"
      >
        <TabList>
          <Tab>User Settings</Tab>
          <Tab>Billing</Tab>
          <Tab>Rooms</Tab>
          <Tab>Integration</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormUpdate user={user} />
          </TabPanel>
          <TabPanel>
            <BillingSettings user={user} />
          </TabPanel>
          <TabPanel>
            <RoomSettings user={user} />
          </TabPanel>
          <TabPanel>
            <IntegrationSettings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
