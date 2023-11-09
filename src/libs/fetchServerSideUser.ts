"use server";

import { cookies } from "next/headers";
import { checkEnvironmentUrl } from "./utils";

type CookieRico = {
  value: string;
  name: string;
};

async function getCookie() {
  const authToken = cookies().get("rico_c_tk");
  return new Promise<CookieRico>((resolve) =>
    setTimeout(() => {
      resolve(authToken);
    }, 1000)
  );
}
export const fetchServerSideUser = async () => {
  try {
    const authToken = await getCookie();

    const response = await fetch("http://localhost:3000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken?.value}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(data);
      }, 1000)
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};
