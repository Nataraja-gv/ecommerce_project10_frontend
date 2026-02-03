import axiosInstance from "@/lib/axios-instance";
import { toast } from "react-toastify";

export const addTocart = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `/auth/customer/cart`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const addCartAllItems = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `/auth/customer/cart/items/add`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.error(error);
  }
};

export const removeFromCartApi = async (data) => {
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `/auth/customer/cart/item/remove`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getuserCartItems = async () => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `/auth/customer/cart/items`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
