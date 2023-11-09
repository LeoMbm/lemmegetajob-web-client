import axios from "axios";
import Cookies from "js-cookie";

const authToken = Cookies.get("rico_c_tk");

const clientAPI = axios.create({
  baseURL: process.env.BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  },
});

export default clientAPI;
