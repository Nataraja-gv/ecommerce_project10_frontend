import axiosInstance from "@/lib/axios-instance";
import { toast } from "react-toastify";

export const createAOrder = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `/auth/create-order`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const RazorPayInitCreateOrder = async (data) => {
  const config = {
    name:"razorpay create order",
    method: "POST",
    maxBodyLength: Infinity,
    url: `/auth/razorpay-create-order`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
