import axiosInstance from "@/lib/axios-instance";
import axios from "@/lib/axios-instance";
import { toast } from "react-toastify";

export const AuthSingup = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `/auth/login`,
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

export const verifyOtp = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `/auth/verify_otp`,
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

export const ResendOTP = async (data) => {
  const config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: `/auth/resend`,
    headers: {
      "Content-Type": "application/json",
    },
    data:{email: data},
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
