import axios from "@/lib/axios-instance";
import { toast } from "react-toastify";

export const addAddress = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `/auth/address/add`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    const res = await axios.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const getAddress = async () => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `/auth/address/all`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.request(config);
    return res?.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
  }
};

export const PostSelectedAddress = async (addressId) => {
  const config = {
    method: "PUT",
    maxBodyLength: Infinity,
    url: `/auth/address/select/${addressId}`,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.request(config);
    return res?.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
  }
};
