import axiosInstance from "@/lib/axios-instance";

export const getProducts = async () => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
    },
    url: "/product/all",
    params: {
      pagination: false,
    },
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    console.log(error.message);
  }
};
