
import { cookies } from "next/headers";

export function getStoredToken() {
  return cookies().get("rico_c_tk");
}

export function storeToken(token, sessionDuration) {
  console.log("[EXPIRATION DATE]", sessionDuration);
  console.log("[EXPIRATION DATE CONVERT]", sessionDuration / 1000);
  const expirationDate = new Date(Date.now() + sessionDuration * 1000); // Convert to milliseconds
  cookies().set("rico_c_tk", token, {
    expires: expirationDate,
    secure: true,
    sameSite: "strict",
  });
}

export function removeToken() {
  cookies().delete("rico_c_tk");
}
