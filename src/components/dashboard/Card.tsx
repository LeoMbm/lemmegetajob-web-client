'use client';

import { getStoredToken } from "@/lib/cookie";
import { useSession } from "next-auth/react";

export default function Card() {
    const data = {
      "Total Jobs": "0",
      "Total Companies": "0",
      "Total Applications": "0",
      "Success": "0",
      "Failure": "0",
    };

    const session = useSession();

    

  
    return (
      <div className="flex flex-wrap -mx-4">
        {Object.entries(data).map(([label, value]) => (
          <div key={label} className="w-full md:w-1/2 xl:w-1/3 p-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl shadow p-6">
              <div className="flex flex-row items-center">
                <div className="flex-shrink pr-4">
                  <div className="rounded p-3 bg-gray-300">
                    <i className="fa fa-wallet fa-2x fa-fw fa-inverse"></i>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h5 className="font-bold uppercase text-gray-400">{label}</h5>
                  <h3 className="font-bold text-3xl text-gray-600">
                    {value}
                    <span className="text-green-500">
                      <i className="fas fa-caret-up"></i>
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }