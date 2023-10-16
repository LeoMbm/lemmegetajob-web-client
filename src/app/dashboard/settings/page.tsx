import { FormUpdate } from "@/components/dashboard/settings/FormUpdate";
import { IntegrationSettings } from "@/components/dashboard/settings/IntegrationSettings";
import PremiumSettings from "@/components/dashboard/settings/PremiumSettings";

export default function Page() {
  return (
    <div className="h-full bg-gray-100 p-4">
      <div className="w-full">
        <div
          className="settings-container"
          style={{ maxHeight: "850px", overflowY: "auto" }}
        >
          <FormUpdate />
          <div className="w-full border-t border-gray-200"></div>
          <PremiumSettings />
          <div className="w-full border-t border-gray-200"></div>
          <IntegrationSettings />
        </div>
      </div>
    </div>
  );
}
