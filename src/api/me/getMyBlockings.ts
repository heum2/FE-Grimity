import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { MyBlockingsResponse } from "@grimity/dto";

import axiosInstance from "@/constants/baseurl";

import { useAuthStore } from "@/states/authStore";

export const getMyBlockings = async () => {
  try {
    const response = await axiosInstance.get<MyBlockingsResponse>("/me/blockings");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) throw new Error("유효성 검사 실패");
      if (error.response?.status === 401) throw new Error("Unauthorized");
      console.error("Error response:", error.response?.data);
    }
    throw new Error("오류가 발생했습니다.");
  }
};

export const useGetMyBlockings = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<MyBlockingsResponse>({
    queryKey: ["myBlockings"],
    queryFn: getMyBlockings,
    enabled: isLoggedIn && Boolean(accessToken),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
};
