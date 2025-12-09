import axios from "axios";
import { BASEURL } from "./config";

const axiosInstance = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use((response) => response);

export default axiosInstance;
