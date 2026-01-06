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

export const getProductsDetails = async (productId) => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
    },
    url: `/product/${productId}`,
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
