'use client';

import Loading from "@/app/dashboard/loading";
import { getStoredToken } from "@/lib/cookie";
import { Spinner } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


const INITIAL_DATA = {
  "Total Jobs": "0",
  "Total Companies": "0",
  "Total Applications": "0",
  "Success": "0",
  "Failure": "0",
};

const Card = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const { data: sessionData } = useSession();

  useEffect(() => {
    fetch(`/api/data/jobs`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((jobs) => {
        setData((prev) => ({
          ...prev,
          "Total Jobs": String(jobs.length),
          "Total Companies": String(new Set(jobs.map((job) => job.company)).size),
        }))
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

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
                  {loading ? <Spinner aria-label="Loading" /> : value}
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
};

export default Card;


