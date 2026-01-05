import axiosInstance from "@/lib/axios-instance";

export const getCategories = async () => {
  const config = {
    method: "GET",
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
    },
    url: "/category/all",
  };
  try {
    const res = await axiosInstance.request(config);
    return res?.data;
  } catch (error) {
    console.log(error.message);
  }
};
