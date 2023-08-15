import CardConfig from "@/components/dashboard/configuration/CardConfig";

export default function Page() {
    return (
      <div className="h-full bg-gray-100 p-4">
      <h1 className="text-gray-800 text-3xl text-center font-semibold">Configuration</h1> 
      <div className="flex flex-wrap">
          <CardConfig />
      </div>
  </div>
  )
  }