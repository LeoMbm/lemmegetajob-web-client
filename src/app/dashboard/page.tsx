import Card from "@/components/dashboard/Card";
import FeedbackAlert from "@/components/global/alert/Feedback";

export default function Page() {
    return (
        <div className="h-full bg-gray-100 p-4">
            <h1 className="text-gray-800 text-3xl text-center font-semibold">Dashboard</h1> 
                <FeedbackAlert />
            <div className="flex flex-wrap">
                <Card />
            </div>
        </div>
        ) 
  }