"use client";
import { useEffect, useState } from "react";
import { checkPlans } from "./subscription";

export const usePlanData = (id) => {
  const [plans, setPlans] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkPlans(id);
        setPlans(data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { plans, isLoading, error };
};
