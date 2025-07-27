import axiosInstance from "@/constants/baseurl";

const postNameCheck = async (nickname: string) => {
  const response = await axiosInstance.post("/users/name-check", { name: nickname });

  return response.data;
};

export default postNameCheck;
