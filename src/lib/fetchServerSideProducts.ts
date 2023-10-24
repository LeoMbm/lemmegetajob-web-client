"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { checkEnvironmentUrl } from "./utils";


export const fetchServerSideProducts = async () => {
  try {
    const authToken = cookies().get("rico_c_tk");
    if (!authToken) {
      return {
        status: 401,
      };
    }
    const response = await fetch(
      checkEnvironmentUrl().concat("/api/subscriptions"),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken?.value}`,
        },
      }
    );
    console.log("[REQUEST]", response);
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
