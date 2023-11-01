import TabsConfig from "@/components/dashboard/configuration/TabsConfig";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

export default function Page() {
  return (
    <div className="h-full bg-gray-100 p-2 md:p-4">
      <div className="w-full">
        <Tabs
          isFitted
          size="md"
          variant="enclosed-colored"
          colorScheme="blue"
          color="black"
        >
          <TabList>
            <Tab>General</Tab>
            <Tab>Experience</Tab>
            <Tab>Education</Tab>
            <Tab>Other</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TabsConfig type="General" />
            </TabPanel>
            <TabPanel>
              <TabsConfig type="Experience" />
            </TabPanel>
            <TabPanel>
              <TabsConfig type="Education" />
            </TabPanel>
            <TabPanel>
              <TabsConfig type="Other" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
    //       <div className="h-full bg-gray-100 p-4">
    //       <h1 className="text-gray-800 text-3xl text-center font-semibold">Configuration</h1>
    //       <div className="flex flex-wrap">
    //           <CardConfig />
    //       </div>
    //   </div>
  );
}
