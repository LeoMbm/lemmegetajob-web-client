import { LogApplyView } from "@/components/dashboard/bot/apply/LogApplyView";

export default function Page() {
  return (
    <div className="h-full bg-gray-100 p-4">
      <h1 className="text-gray-800 text-3xl text-center font-semibold">
        Apply
      </h1>
      <div className="flex flex-wrap mt-4 mobile:justify-center mobile:items-center">
        <div className="w-full h-1/2">
          <LogApplyView />
        </div>
      </div>
    </div>
  );
}
