"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkEnvironmentUrl } from "./utils";

export const fetchConfig = async () => {
  try {
    const authToken = cookies().get("rico_c_tk");
    const response = await fetch(
      checkEnvironmentUrl().concat("/api/data/config"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${authToken?.value}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
