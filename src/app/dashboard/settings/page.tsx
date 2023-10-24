import { FormUpdate } from "@/components/dashboard/settings/FormUpdate";
import { IntegrationSettings } from "@/components/dashboard/settings/IntegrationSettings";
import PremiumSettings from "@/components/dashboard/settings/PremiumSettings";
import { RoomSettings } from "@/components/dashboard/settings/RoomSettings";
import { BillingSettings } from "@/components/dashboard/settings/billing/BillingSettings";
import { fetchServerSideProducts } from "@/lib/fetchServerSideProducts";
import { fetchServerSideUser } from "@/lib/fetchServerSideUser";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

export default async function Page() {
  const user = await fetchServerSideUser();
  // const products = await fetchServerSideProducts();
  // console.log("[SERVER SIDE PRODUCTS]", products);
  return (
    <div className="h-full bg-gray-100 p-4">
      <div className="w-full">
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
            {/* <Tab isDisabled>Beta</Tab>
            <Tab isDisabled>Beta</Tab>
            <Tab isDisabled>Beta</Tab> */}
          </TabList>
          <TabPanels>
            <TabPanel>
              <FormUpdate user={user} />
            </TabPanel>
            <TabPanel>
              <BillingSettings user={user} />
            </TabPanel>
            <TabPanel>
              <RoomSettings />
            </TabPanel>
            <TabPanel>
              <IntegrationSettings />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
