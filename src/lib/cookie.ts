import Cookies from "js-cookie";

export function getStoredToken() {
    return Cookies.get("backendToken");
}

export function storeToken(token, sessionDuration) {
    const expirationDate = new Date(Date.now() + sessionDuration * 1000); // Convert to milliseconds
    Cookies.set("backendToken", token, { expires: expirationDate, secure: true, sameSite: "strict" });
}
