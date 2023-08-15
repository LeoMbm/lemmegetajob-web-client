// import LaunchButton from "@/components/dashboard/bot/LaunchButton";
import { LogView } from "@/components/dashboard/bot/scraping/LogView";

export default function Page() {
 

    return (
    <div className="h-full bg-gray-100 p-4">
      <h1 className="text-gray-800 text-3xl text-center font-semibold">Scraping</h1> 
      <div className="flex flex-wrap mt-4 mobile:justify-center mobile:items-center">
      <div className="w-full h-1/2">
      <LogView />
      </div>
      </div>
    </div>
  )
  }